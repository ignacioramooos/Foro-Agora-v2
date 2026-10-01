import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPreferences } from "@/hooks/useUserPreferences";

const LOCAL_KEY = "fa_math_daily_goal";
const DEFAULT_GOAL = 5;
const GOAL_EVENT = "fa-math-goal-change";

const normalizeGoal = (value: number) => Math.min(30, Math.max(1, Math.round(value)));
const readLocalGoal = () => {
  const stored = Number(localStorage.getItem(LOCAL_KEY));
  return Number.isFinite(stored) && stored >= 1 ? normalizeGoal(stored) : DEFAULT_GOAL;
};

export function useMathGoal() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const { preferences, updateDailyMathGoal } = useUserPreferences(userId);
  const [goal, setGoalState] = useState(readLocalGoal);
  const syncedUser = useRef<string | null>(null);

  useEffect(() => {
    if (!userId || !preferences || syncedUser.current === userId) return;
    const local = readLocalGoal();
    const account = normalizeGoal(preferences.daily_math_goal ?? DEFAULT_GOAL);
    const next = local !== DEFAULT_GOAL ? local : account;
    setGoalState(next);
    localStorage.setItem(LOCAL_KEY, String(next));
    syncedUser.current = userId;
    if (next !== account) void updateDailyMathGoal(next);
  }, [preferences, updateDailyMathGoal, userId]);

  useEffect(() => {
    const syncGoal = (event: Event) => {
      const next = (event as CustomEvent<number>).detail;
      if (Number.isFinite(next)) setGoalState(normalizeGoal(next));
    };
    window.addEventListener(GOAL_EVENT, syncGoal);
    return () => window.removeEventListener(GOAL_EVENT, syncGoal);
  }, []);

  const setGoal = useCallback((value: number) => {
    const next = normalizeGoal(value);
    setGoalState(next);
    localStorage.setItem(LOCAL_KEY, String(next));
    window.dispatchEvent(new CustomEvent(GOAL_EVENT, { detail: next }));
    if (userId) void updateDailyMathGoal(next);
  }, [updateDailyMathGoal, userId]);

  return { goal, setGoal };
}