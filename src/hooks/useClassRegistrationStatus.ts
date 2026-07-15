import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type RegistrationStatus = "checking" | "registered" | "not-registered";

export const useClassRegistrationStatus = (classId?: string) => {
  const { session, loading: authLoading } = useAuth();
  const userId = session?.user?.id;
  const [status, setStatus] = useState<RegistrationStatus>("checking");

  useEffect(() => {
    let cancelled = false;

    if (!classId || authLoading) {
      setStatus("checking");
      return () => {
        cancelled = true;
      };
    }

    if (!userId) {
      setStatus("not-registered");
      return () => {
        cancelled = true;
      };
    }

    setStatus("checking");
    const checkRegistration = async () => {
      const { data, error } = await supabase
        .from("class_registrations")
        .select("id")
        .eq("class_id", classId)
        .eq("user_id", userId)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("[EventRegistration] No se pudo verificar la inscripción:", error);
        return;
      }

      setStatus(data ? "registered" : "not-registered");
    };

    void checkRegistration();
    return () => {
      cancelled = true;
    };
  }, [authLoading, classId, userId]);

  return {
    isRegistered: status === "registered",
    registrationChecked: status !== "checking",
  };
};
