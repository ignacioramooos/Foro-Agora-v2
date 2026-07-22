import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { signupWithPassword } from "@/lib/passwordSignup";
import { claimReferralIfPending } from "@/lib/referral";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  streak: number;
  completedClasses: number;
  totalClasses: number;
  publishedTheses: number;
  onboardingCompleted: boolean;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  session: null,
  login: async () => ({ error: null }),
  signup: async () => ({ error: null }),
  logout: async () => {},
  refreshProfile: async () => {},
  loading: true,
});

const toISODate = (value: Date) => value.toISOString().slice(0, 10);

const calculateCurrentStreak = (completedAtValues: Array<string | null>) => {
  const completedDays = new Set(
    completedAtValues
      .filter((value): value is string => Boolean(value))
      .map((value) => toISODate(new Date(value)))
  );

  if (completedDays.size === 0) {
    return 0;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cursor = new Date(today);
  if (!completedDays.has(toISODate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!completedDays.has(toISODate(cursor))) {
      return 0;
    }
  }

  let streak = 0;
  while (completedDays.has(toISODate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { fetchUserProfile, fetchLessonStats } = useProfile();

  const fetchProfile = useCallback(async (supabaseUser: SupabaseUser) => {
    try {
      // Fetch profile and lesson stats in parallel
      const [profileData, lessonStats] = await Promise.all([
        fetchUserProfile(supabaseUser.id),
        fetchLessonStats(supabaseUser.id),
      ]);

      const displayName = profileData?.display_name || 
                         supabaseUser.user_metadata?.display_name || 
                         supabaseUser.email?.split("@")[0] || 
                         "Usuario";
      
      const streak = calculateCurrentStreak(lessonStats.completedAt);

      setUser({
        id: supabaseUser.id,
        name: displayName,
        email: supabaseUser.email || "",
        streak,
        completedClasses: lessonStats.completedClasses,
        totalClasses: lessonStats.totalClasses,
        publishedTheses: lessonStats.publishedTheses,
        onboardingCompleted: profileData?.onboarding_completed ?? false,
      });
    } catch (err) {
      console.error("[AuthContext] Error fetching profile:", err);
      setUser(null);
    }
  }, [fetchUserProfile, fetchLessonStats]);

  const refreshProfile = useCallback(async () => {
    if (session?.user) {
      await fetchProfile(session.user);
    }
  }, [session, fetchProfile]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          setTimeout(() => fetchProfile(newSession.user), 0);
          setTimeout(() => { claimReferralIfPending(); }, 0);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        fetchProfile(currentSession.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  };

  const signup = async (email: string, password: string, displayName: string) => {
    return signupWithPassword({
      email,
      password,
      metadata: { display_name: displayName },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!session, user, session, login, signup, logout, refreshProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
