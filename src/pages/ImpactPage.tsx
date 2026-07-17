import { useEffect, useRef, useState } from "react";
import SectionFade from "@/components/SectionFade";
import CoreValues from "@/components/CoreValues";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, GraduationCap, Layers, Sparkles } from "lucide-react";

interface ImpactStats {
  students: number;
  activeClasses: number;
  publishedContent: number;
}

const LiveCounter = ({ value }: { value: number }) => {
  const [display, setDisplay] = useState(0);
  const displayRef = useRef(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const from = displayRef.current;
    const duration = 900;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(from + (value - from) * eased);
      displayRef.current = nextValue;
      setDisplay(nextValue);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span className="tabular-nums">{display.toLocaleString("es-UY")}</span>;
};

const ImpactPage = () => {
  const [stats, setStats] = useState<ImpactStats>({ students: 0, activeClasses: 0, publishedContent: 0 });

  const fetchImpactData = async () => {
    const [studentsCountRes, classesRes, contentRes] = await Promise.all([
      supabase.rpc("get_public_profiles_count"),
      supabase.from("class_sessions").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("content_items").select("id", { count: "exact", head: true }).eq("is_published", true),
    ]);

    setStats({
      students: Number(studentsCountRes.data ?? 0),
      activeClasses: classesRes.count ?? 0,
      publishedContent: contentRes.count ?? 0,
    });
  };

  useEffect(() => {
    fetchImpactData();

    const channel = supabase
      .channel("impact-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, fetchImpactData)
      .on("postgres_changes", { event: "*", schema: "public", table: "class_sessions" }, fetchImpactData)
      .on("postgres_changes", { event: "*", schema: "public", table: "content_items" }, fetchImpactData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32 pb-20 overflow-hidden">
      <section className="relative">
        <div className="absolute inset-0 -z-10 opacity-50">
          <div className="absolute -top-24 left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-accent/15 blur-2xl" />
          <div className="absolute top-44 -left-24 h-64 w-64 rounded-full bg-primary-blue/15 blur-2xl" />
          <div className="absolute top-64 -right-24 h-64 w-64 rounded-full bg-secondary-cyan/15 blur-2xl" />
        </div>

        <div className="container max-w-6xl">
          <SectionFade>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-primary-blue" />
              <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground">
                Impacto público
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl leading-[1] md:leading-[0.95] text-foreground max-w-4xl mb-6">
              Impacto de Foro Agora en tiempo real
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Este tablero se actualiza directamente desde nuestra base de datos para mostrar crecimiento de estudiantes,
              clases activas y contenido publicado.
            </p>
          </SectionFade>

          <SectionFade delay={0.08}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
              <div className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-all">
                <p className="text-xs uppercase tracking-widest font-heading text-muted-foreground mb-3">Estudiantes</p>
                <p className="text-4xl font-heading text-foreground mb-3">
                  <LiveCounter value={stats.students} />
                </p>
                <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
                  <GraduationCap size={14} className="text-primary-blue" /> Registros totales en perfiles
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-all">
                <p className="text-xs uppercase tracking-widest font-heading text-muted-foreground mb-3">Clases activas</p>
                <p className="text-4xl font-heading text-foreground mb-3">
                  <LiveCounter value={stats.activeClasses} />
                </p>
                <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
                  <Layers size={14} className="text-secondary-cyan" /> Clases presenciales con estado activo
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-all">
                <p className="text-xs uppercase tracking-widest font-heading text-muted-foreground mb-3">Contenido publicado</p>
                <p className="text-4xl font-heading text-foreground mb-3">
                  <LiveCounter value={stats.publishedContent} />
                </p>
                <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
                  <BookOpen size={14} className="text-amber-600 dark:text-amber-400" /> Clases y recursos visibles
                </p>
              </div>
            </div>
          </SectionFade>
        </div>
      </section>

      <section className="pt-16 md:pt-24 pb-8">
        <div className="container max-w-6xl">
          <SectionFade>
            <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
              Nuestros principios
            </p>
            <h2 className="text-3xl md:text-4xl text-foreground mb-12">
              Los valores que guían nuestro impacto
            </h2>
          </SectionFade>
          <SectionFade delay={0.1}>
            <CoreValues layout="inline" />
          </SectionFade>
        </div>
      </section>
    </div>
  );
};

export default ImpactPage;
