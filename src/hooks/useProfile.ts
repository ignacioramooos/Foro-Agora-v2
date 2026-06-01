import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface UserProfileData {
  display_name?: string | null;
  full_name?: string | null;
  age?: number | null;
  department?: string | null;
  institution?: string | null;
  how_found_us?: string | null;
  onboarding_completed?: boolean | null;
}

export function useProfile() {
  // Fetch complete user profile from database
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfileData | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, full_name, age, department, institution, how_found_us, onboarding_completed")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.warn("[useProfile] Error fetching profile:", error);
        return null;
      }

      return data || null;
    } catch (err) {
      console.error("[useProfile] Unexpected error fetching profile:", err);
      return null;
    }
  }, []);

  // Update a single profile field
  const updateProfileField = useCallback(async <K extends keyof UserProfileData>(
    userId: string,
    field: K,
    value: UserProfileData[K]
  ) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ [field]: value } as never)
        .eq("user_id", userId);

      if (error) {
        console.error(`[useProfile] Error updating ${field}:`, error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error("[useProfile] Unexpected error updating field:", err);
      return { success: false, error: "Unexpected error" };
    }
  }, []);

  // Update multiple profile fields at once
  const updateProfile = useCallback(async (userId: string, updates: UserProfileData) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", userId);

      if (error) {
        console.error("[useProfile] Error updating profile:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error("[useProfile] Unexpected error updating profile:", err);
      return { success: false, error: "Unexpected error" };
    }
  }, []);

  // Mark onboarding as completed
  const completeOnboarding = useCallback(async (userId: string) => {
    return updateProfileField(userId, "onboarding_completed", true);
  }, [updateProfileField]);

  // Update display name
  const updateDisplayName = useCallback(async (userId: string, name: string) => {
    return updateProfileField(userId, "display_name", name);
  }, [updateProfileField]);

  // Fetch lesson progress statistics
  const fetchLessonStats = useCallback(async (userId: string) => {
    try {
      const { data: completedData, count: completedCount, error: completedError } = await supabase
        .from("lesson_progress")
        .select("completed_at", { count: "exact" })
        .eq("user_id", userId)
        .not("completed_at", "is", null);

      if (completedError) throw completedError;

      const { count: totalCount, error: totalError } = await supabase
        .from("lessons")
        .select("id", { count: "exact", head: true });

      if (totalError) throw totalError;

      const { count: certificatesCount, error: certError } = await supabase
        .from("certificates")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (certError) throw certError;

      return {
        completedClasses: completedCount ?? 0,
        totalClasses: totalCount ?? 0,
        publishedTheses: certificatesCount ?? 0,
        completedAt: (completedData ?? []).map(row => row.completed_at),
      };
    } catch (err) {
      console.error("[useProfile] Error fetching lesson stats:", err);
      return {
        completedClasses: 0,
        totalClasses: 0,
        publishedTheses: 0,
        completedAt: [],
      };
    }
  }, []);

  // Mark a lesson as completed
  const markLessonComplete = useCallback(async (userId: string, lessonId: string) => {
    try {
      // Check if already completed
      const { data: existing } = await supabase
        .from("lesson_progress")
        .select("id")
        .eq("user_id", userId)
        .eq("lesson_id", lessonId)
        .single();

      if (existing) {
        // Update existing progress if not already completed
        const { error } = await supabase
          .from("lesson_progress")
          .update({ completed_at: new Date().toISOString() })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // Create new progress entry
        const { error } = await supabase
          .from("lesson_progress")
          .insert({
            user_id: userId,
            lesson_id: lessonId,
            completed_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      return { success: true };
    } catch (err) {
      console.error("[useProfile] Error marking lesson complete:", err);
      return { success: false, error: "Failed to mark lesson complete" };
    }
  }, []);

  return {
    fetchUserProfile,
    updateProfileField,
    updateProfile,
    completeOnboarding,
    updateDisplayName,
    fetchLessonStats,
    markLessonComplete,
  };
}
