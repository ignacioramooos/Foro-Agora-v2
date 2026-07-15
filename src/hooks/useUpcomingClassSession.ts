import { useEffect, useId, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ClassSession } from "@/lib/classEvent";

export const useUpcomingClassSession = () => {
  const hookId = useId();
  const [classSession, setClassSession] = useState<ClassSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchClassSession = async () => {
      const { data } = await supabase
        .from("class_sessions")
        .select("*")
        .eq("is_active", true)
        .gte("class_date", new Date().toISOString())
        .order("class_date", { ascending: true })
        .limit(10);

      if (cancelled) return;
      const sessions = (data ?? []) as ClassSession[];
      setClassSession(sessions.find((session) => session.is_featured) ?? sessions[0] ?? null);
      setLoading(false);
    };

    fetchClassSession();
    const channel = supabase
      .channel(`upcoming-featured-class-${hookId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "class_sessions" }, fetchClassSession)
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [hookId]);

  return { classSession, loading };
};
