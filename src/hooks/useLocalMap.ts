import { useCallback, useSyncExternalStore } from "react";

/** Tiny localStorage-backed map store shared across components (per key). */
const stores = new Map<string, { value: Record<string, any>; listeners: Set<() => void> }>();

const getStore = (key: string) => {
  let s = stores.get(key);
  if (!s) {
    let value: Record<string, any> = {};
    try { value = JSON.parse(localStorage.getItem(key) || "{}"); } catch { value = {}; }
    s = { value, listeners: new Set() };
    stores.set(key, s);
  }
  return s;
};

export function useLocalMap<T>(key: string) {
  const store = getStore(key);
  const value = useSyncExternalStore(
    (cb) => { store.listeners.add(cb); return () => store.listeners.delete(cb); },
    () => store.value,
  ) as Record<string, T>;
  const setEntry = useCallback((id: string, v: T | undefined) => {
    const next = { ...store.value };
    if (v === undefined) delete next[id]; else next[id] = v;
    store.value = next;
    localStorage.setItem(key, JSON.stringify(next));
    store.listeners.forEach((l) => l());
  }, [key, store]);
  return [value, setEntry] as const;
}

export const formatDuration = (s: number) => {
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}` : `${m}:${String(sec).padStart(2, "0")}`;
};
