import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const LOCAL_KEY = "fa_math_progress";

type ProgressMap = Record<string, string>; // exerciseId -> ISO completed_at

const readLocal = (): ProgressMap => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}");
  } catch {
    return {};
  }
};
const writeLocal = (m: ProgressMap) => localStorage.setItem(LOCAL_KEY, JSON.stringify(m));

// The generated types may not include this table yet.
const table = () => (supabase as any).from("math_exercise_progress");

export function useMathProgress() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [progress, setProgress] = useState<ProgressMap>(() => readLocal());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!userId) {
        setProgress(readLocal());
        setLoaded(true);
        return;
      }
      // Merge device progress into the account, then load.
      const local = readLocal();
      const rows = Object.entries(local).map(([exercise_id, completed_at]) => ({ user_id: userId, exercise_id, completed_at }));
      if (rows.length) {
        const { error } = await table().upsert(rows, { onConflict: "user_id,exercise_id", ignoreDuplicates: true });
        if (!error) localStorage.removeItem(LOCAL_KEY);
      }
      const { data } = await table().select("exercise_id, completed_at").eq("user_id", userId);
      if (cancelled) return;
      const map: ProgressMap = {};
      (data ?? []).forEach((r: { exercise_id: string; completed_at: string }) => (map[r.exercise_id] = r.completed_at));
      setProgress(map);
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const toggle = useCallback(
    async (exerciseId: string) => {
      const done = !!progress[exerciseId];
      const next = { ...progress };
      if (done) delete next[exerciseId];
      else next[exerciseId] = new Date().toISOString();
      setProgress(next);

      if (!userId) return writeLocal(next);
      const { error } = done
        ? await table().delete().eq("user_id", userId).eq("exercise_id", exerciseId)
        : await table().insert({ user_id: userId, exercise_id: exerciseId, completed_at: next[exerciseId] });
      if (error) setProgress(progress); // revert
    },
    [progress, userId],
  );

  return { progress, toggle, loaded, isLoggedIn: !!userId };
}
