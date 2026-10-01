import { useCallback, useEffect, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const LOCAL_KEY = "fa_math_flags";
type Flags = Record<string, string>;

const readLocal = (): Flags => {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}"); } catch { return {}; }
};
const table = () => (supabase as any).from("math_exercise_flags");

let flags: Flags = readLocal();
let loadedFor: string | null | undefined;
const listeners = new Set<() => void>();
const set = (f: Flags) => { flags = f; listeners.forEach((l) => l()); };
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };

async function load(userId: string | null) {
  if (loadedFor === userId) return;
  loadedFor = userId;
  if (!userId) return set(readLocal());
  const local = readLocal();
  const rows = Object.entries(local).map(([exercise_id, created_at]) => ({ user_id: userId, exercise_id, created_at }));
  if (rows.length) {
    const { error } = await table().upsert(rows, { onConflict: "user_id,exercise_id", ignoreDuplicates: true });
    if (!error) localStorage.removeItem(LOCAL_KEY);
  }
  const { data } = await table().select("exercise_id, created_at").eq("user_id", userId);
  if (loadedFor !== userId) return;
  const map: Flags = {};
  (data ?? []).forEach((r: { exercise_id: string; created_at: string }) => (map[r.exercise_id] = r.created_at));
  set(map);
}

export function useMathFlags() {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;
  const current = useSyncExternalStore(subscribe, () => flags);

  useEffect(() => { load(userId); }, [userId]);

  const toggleFlag = useCallback(async (id: string) => {
    const prev = flags;
    const on = !!prev[id];
    const next = { ...prev };
    if (on) delete next[id]; else next[id] = new Date().toISOString();
    set(next);
    if (!userId) return localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
    const { error } = on
      ? await table().delete().eq("user_id", userId).eq("exercise_id", id)
      : await table().insert({ user_id: userId, exercise_id: id });
    if (error) set(prev);
  }, [userId]);

  return { flags: current, toggleFlag };
}
