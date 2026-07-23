import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Clock, MapPin, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import EventSignupButton from "@/components/EventSignupButton";
import InjuLocationMap from "@/components/InjuLocationMap";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  EVENT_FALLBACK_DESCRIPTION,
  formatEventDate,
  formatEventTimeRange,
  type ClassSession,
} from "@/lib/classEvent";

const EventsSection = () => {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [registeredClassIds, setRegisteredClassIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      const [classesResult, registrationsResult] = await Promise.all([
        supabase
          .from("class_sessions")
          .select("*")
          .order("class_date", { ascending: false }),
        userId
          ? supabase.from("class_registrations").select("class_id").eq("user_id", userId)
          : Promise.resolve({ data: [] }),
      ]);

      if (cancelled) return;
      const classSessions = [...((classesResult.data ?? []) as ClassSession[])].sort((a, b) => {
        if (a.is_active !== b.is_active) return Number(b.is_active) - Number(a.is_active);

        const dateDifference = new Date(a.class_date).getTime() - new Date(b.class_date).getTime();
        return a.is_active ? dateDifference : -dateDifference;
      });
      setClasses(classSessions);
      setRegisteredClassIds(
        new Set((registrationsResult.data ?? []).flatMap((registration) => registration.class_id ? [registration.class_id] : []))
      );
      setLoading(false);
    };

    fetchData();
    const channel = supabase
      .channel("dashboard-class-events")
      .on("postgres_changes", { event: "*", schema: "public", table: "class_sessions" }, fetchData)
      .on("postgres_changes", { event: "*", schema: "public", table: "class_registrations" }, fetchData)
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 p-6 md:p-10">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-5 w-72" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10">
      <h1 className="mb-2 text-2xl font-semibold text-foreground md:text-3xl">Eventos</h1>
      <p className="mb-8 text-muted-foreground">Encuentros presenciales, workshops y charlas de Foro Agora.</p>

      {classes.length === 0 ? (
        <div className="rounded-xl border border-border p-8 text-sm text-muted-foreground">
          No hay eventos publicados en este momento.
        </div>
      ) : (
        <div className="space-y-5">
          {classes.map((classSession) => {
            const isRegistered = registeredClassIds.has(classSession.id);
            const isPast = !classSession.is_active;
            return (
              <div key={classSession.id} className="space-y-4">
                <article
                  aria-label={isPast ? `${classSession.title}, evento pasado` : classSession.title}
                  className={`overflow-hidden rounded-2xl border-2 ${
                    isPast
                      ? "border-border bg-muted/40 text-muted-foreground grayscale"
                      : "border-foreground bg-card"
                  }`}
                >
                  <div className={`px-5 py-3 text-xs font-black uppercase tracking-[0.15em] ${
                    isPast ? "bg-muted text-muted-foreground" : "bg-sun text-foreground"
                  }`}>
                    {isPast ? "Evento pasado" : classSession.is_featured ? "Evento destacado" : "Inscripciones abiertas"}
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className={`text-2xl font-black md:text-3xl ${isPast ? "text-muted-foreground" : "text-foreground"}`}>
                          {classSession.title}
                        </h2>
                        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                          {classSession.notes || EVENT_FALLBACK_DESCRIPTION}
                        </p>
                      </div>
                      {isRegistered && !isPast ? (
                        <Badge variant="secondary" className="self-start gap-1.5 px-3 py-2"><CheckCircle2 size={14} /> Ya estás inscripto</Badge>
                      ) : null}
                    </div>

                    <div className={`my-7 grid gap-4 text-sm sm:grid-cols-2 ${isPast ? "text-muted-foreground" : "text-foreground/75"}`}>
                      <span className="flex items-center gap-2"><CalendarDays className={isPast ? "text-muted-foreground" : "text-blue-pop"} size={18} /> {formatEventDate(classSession.class_date)}</span>
                      <span className="flex items-center gap-2"><Clock className={isPast ? "text-muted-foreground" : "text-blue-pop"} size={18} /> {formatEventTimeRange(classSession)}</span>
                      <span className="flex items-center gap-2"><MapPin className={isPast ? "text-muted-foreground" : "text-blue-pop"} size={18} /> {classSession.location}</span>
                      <span className="flex items-center gap-2"><Users className={isPast ? "text-muted-foreground" : "text-blue-pop"} size={18} /> {classSession.max_capacity} lugares</span>
                    </div>

                    {isPast ? (
                      <div className="rounded-lg border border-border bg-muted px-4 py-3 text-sm font-semibold text-muted-foreground">
                        Este evento ya pasó — {formatEventDate(classSession.class_date)}.
                      </div>
                    ) : isRegistered ? (
                      <div className="rounded-lg bg-secondary px-4 py-3 text-sm font-semibold text-foreground">
                        Ya estás inscripto. Te esperamos en Casa INJU.
                      </div>
                    ) : (
                      <EventSignupButton classId={classSession.id} className="w-full sm:w-auto" label="Inscribirme a este evento" />
                    )}
                  </div>
                </article>
                {!isPast && classSession.location.toLocaleLowerCase("es-UY").includes("inju") ? <InjuLocationMap /> : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventsSection;
