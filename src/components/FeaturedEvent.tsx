import { useEffect, useState } from "react";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import injuCasaMonochromeLogo from "@/assets/inju-casa-inju-monochrome-2026.png";
import EventSignupButton from "@/components/EventSignupButton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUpcomingClassSession } from "@/hooks/useUpcomingClassSession";
import {
  EVENT_FALLBACK_DESCRIPTION,
  formatEventDate,
  formatEventTimeRange,
  getRegistrationLimit,
  type ClassSession,
} from "@/lib/classEvent";

const EventFacts = ({ classSession, light = false }: { classSession: ClassSession; light?: boolean }) => {
  const textClass = light ? "text-white/85" : "text-foreground/75";
  const iconClass = light ? "text-sun" : "text-blue-pop";

  return (
    <div className={`grid gap-3 text-sm sm:grid-cols-2 ${textClass}`}>
      <span className="flex items-center gap-2"><CalendarDays className={iconClass} size={18} /> {formatEventDate(classSession.class_date)}</span>
      <span className="flex items-center gap-2"><Clock className={iconClass} size={18} /> {formatEventTimeRange(classSession)}</span>
      <span className="flex items-center gap-2"><MapPin className={iconClass} size={18} /> {classSession.location}</span>
      <span className="flex items-center gap-2"><Users className={iconClass} size={18} /> {classSession.max_capacity} lugares · hasta {getRegistrationLimit(classSession)} inscripciones</span>
    </div>
  );
};

export const LandingEventHero = () => {
  const { classSession, loading } = useUpcomingClassSession();
  const [popupOpen, setPopupOpen] = useState(false);
  const classSessionId = classSession?.id;

  useEffect(() => {
    if (!classSessionId) return;
    const popupTimer = window.setTimeout(() => setPopupOpen(true), 550);
    return () => window.clearTimeout(popupTimer);
  }, [classSessionId]);

  if (loading || !classSession) return null;

  return (
    <>
      <section className="relative overflow-hidden bg-[#07111f] pb-14 pt-28 text-white md:pb-20 md:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.34),transparent_34%),radial-gradient(circle_at_15%_90%,rgba(255,200,0,0.22),transparent_30%)]" />
        <div className="container relative grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em]">
              Primer encuentro presencial · Actividad sin costo
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-[0.96] sm:text-5xl md:text-7xl">
              {classSession.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
              {classSession.notes || EVENT_FALLBACK_DESCRIPTION}
            </p>
            <div className="mt-8 max-w-2xl"><EventFacts classSession={classSession} light /></div>
            <EventSignupButton classId={classSession.id} className="mt-8 w-full sm:w-auto" label="Reservar mi lugar" />
          </div>
          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-7 backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">Con el apoyo de</p>
            <div className="mt-5 overflow-hidden rounded-xl border border-white/15 bg-black px-2 py-5">
              <img
                src={injuCasaMonochromeLogo}
                alt="Ministerio de Desarrollo Social, INJU y Casa INJU"
                className="h-auto w-full object-contain"
              />
            </div>
            <p className="mt-4 text-sm font-bold text-sun">Sala audiovisual de Casa INJU</p>
          </div>
        </div>
      </section>

      <Dialog open={popupOpen} onOpenChange={setPopupOpen}>
        <DialogContent className="max-w-xl overflow-hidden border-2 border-foreground p-0">
          <div className="bg-sun px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-foreground">
            Cupos abiertos · Miércoles 22 de julio
          </div>
          <div className="p-6 md:p-8">
            <DialogHeader>
              <DialogTitle className="pr-7 text-3xl font-black leading-tight">{classSession.title}</DialogTitle>
              <DialogDescription className="pt-2 text-base leading-relaxed">
                Te esperamos de 18:00 a 20:00 en la sala audiovisual de Casa INJU. La actividad es gratuita y no requiere experiencia previa.
              </DialogDescription>
            </DialogHeader>
            <div className="my-6"><EventFacts classSession={classSession} /></div>
            <EventSignupButton classId={classSession.id} className="w-full" label="Sí, quiero inscribirme" />
            <p className="mt-3 text-center text-xs text-muted-foreground">Si todavía no tenés cuenta, te ayudamos a crearla antes de completar la inscripción.</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const LandingEventFooter = () => {
  const { classSession, loading } = useUpcomingClassSession();
  if (loading || !classSession) return null;

  return (
    <section className="bg-blue-soft py-14 md:py-24">
      <div className="container grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div>
          <p className="font-hand text-3xl text-blue-pop">Agendalo ahora</p>
          <h2 className="mt-2 text-4xl font-black leading-tight md:text-5xl">Miércoles 22 de julio · 18:00 a 20:00</h2>
          <p className="mt-4 max-w-xl text-foreground/70">Una tarde para conocer Foro Agora, aprender, hacer preguntas y encontrarte con jóvenes que quieren tomar mejores decisiones financieras.</p>
        </div>
        <div className="rounded-[1.5rem] border-2 border-foreground bg-card p-6 shadow-[10px_10px_0_#ffc800] md:p-8">
          <h3 className="text-2xl font-black">{classSession.title}</h3>
          <div className="my-6"><EventFacts classSession={classSession} /></div>
          <EventSignupButton classId={classSession.id} className="w-full" label="Inscribirme al encuentro" />
        </div>
      </div>
    </section>
  );
};
