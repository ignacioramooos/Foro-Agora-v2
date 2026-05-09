import { useCallback, useState, useEffect } from "react";
import { useUserPreferences } from "@/hooks/useUserPreferences";

export type DashboardTab = "home" | "progress" | "tools" | "community" | "theses" | "events" | "content" | "portfolio" | "settings";

export function useDashboardState(userId: string | undefined) {
  const [activeTab, setActiveTabState] = useState<DashboardTab>("home");
  const { preferences, updateDashboardTab } = useUserPreferences(userId);

  // Load saved tab on mount (once preferences are fetched)
  useEffect(() => {
    if (preferences?.dashboard_active_tab) {
      setActiveTabState(preferences.dashboard_active_tab as DashboardTab);
    }
  }, [preferences?.dashboard_active_tab]);

  // Change tab and persist
  const setActiveTab = useCallback(async (tab: DashboardTab) => {
    setActiveTabState(tab);
    
    // Persist to database (fire and forget, don't block UI)
    if (userId) {
      updateDashboardTab(tab).catch(err => {
        console.error("[useDashboardState] Failed to persist tab:", err);
      });
    }
  }, [userId, updateDashboardTab]);

  return {
    activeTab,
    setActiveTab,
  };
}
