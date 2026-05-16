import { useCallback, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UserPreferences {
  id?: string;
  user_id: string;
  theme: "light" | "dark";
  dashboard_active_tab: string;
  locale: string;
}

export function useUserPreferences(userId: string | undefined) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user preferences
  const fetchPreferences = useCallback(async (uid: string) => {
    if (!uid) {
      setPreferences(null);
      setLoading(false);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", uid)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No row found, create default
          return await createDefaultPreferences(uid);
        }
        console.warn("[useUserPreferences] Error fetching preferences:", error);
        return null;
      }

      setPreferences(data as UserPreferences);
      return data as UserPreferences;
    } catch (err) {
      console.error("[useUserPreferences] Unexpected error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create default preferences for new user
  const createDefaultPreferences = useCallback(async (uid: string): Promise<UserPreferences | null> => {
    try {
      const defaultPrefs: UserPreferences = {
        user_id: uid,
        theme: "light",
        dashboard_active_tab: "home",
        locale: "es-UY",
      };

      const { data, error } = await supabase
        .from("user_preferences")
        .insert(defaultPrefs)
        .select()
        .single();

      if (error) {
        console.error("[useUserPreferences] Error creating default preferences:", error);
        return null;
      }

      setPreferences(data as UserPreferences);
      return data as UserPreferences;
    } catch (err) {
      console.error("[useUserPreferences] Unexpected error creating preferences:", err);
      return null;
    }
  }, []);

  // Update theme preference
  const updateTheme = useCallback(async (theme: "light" | "dark") => {
    if (!userId) return { success: false, error: "No user ID" };

    try {
      const { error } = await supabase
        .from("user_preferences")
        .update({ theme })
        .eq("user_id", userId);

      if (error) {
        console.error("[useUserPreferences] Error updating theme:", error);
        return { success: false, error: error.message };
      }

      setPreferences(prev => prev ? { ...prev, theme } : null);
      return { success: true };
    } catch (err) {
      console.error("[useUserPreferences] Unexpected error updating theme:", err);
      return { success: false, error: "Unexpected error" };
    }
  }, [userId]);

  // Update active dashboard tab
  const updateDashboardTab = useCallback(async (tab: string) => {
    if (!userId) return { success: false, error: "No user ID" };

    try {
      const { error } = await supabase
        .from("user_preferences")
        .update({ dashboard_active_tab: tab })
        .eq("user_id", userId);

      if (error) {
        console.error("[useUserPreferences] Error updating dashboard tab:", error);
        return { success: false, error: error.message };
      }

      setPreferences(prev => prev ? { ...prev, dashboard_active_tab: tab } : null);
      return { success: true };
    } catch (err) {
      console.error("[useUserPreferences] Unexpected error updating dashboard tab:", err);
      return { success: false, error: "Unexpected error" };
    }
  }, [userId]);

  // Update locale
  const updateLocale = useCallback(async (locale: string) => {
    if (!userId) return { success: false, error: "No user ID" };

    try {
      const { error } = await supabase
        .from("user_preferences")
        .update({ locale })
        .eq("user_id", userId);

      if (error) {
        console.error("[useUserPreferences] Error updating locale:", error);
        return { success: false, error: error.message };
      }

      setPreferences(prev => prev ? { ...prev, locale } : null);
      return { success: true };
    } catch (err) {
      console.error("[useUserPreferences] Unexpected error updating locale:", err);
      return { success: false, error: "Unexpected error" };
    }
  }, [userId]);

  // Fetch preferences on user ID change
  useEffect(() => {
    if (userId) {
      fetchPreferences(userId);
    }
  }, [userId, fetchPreferences]);

  return {
    preferences,
    loading,
    fetchPreferences,
    createDefaultPreferences,
    updateTheme,
    updateDashboardTab,
    updateLocale,
  };
}
