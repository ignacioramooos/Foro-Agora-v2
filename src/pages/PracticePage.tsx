import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { chapters, dailyPool, montevideoDay, computeStreak, DAILY_COUNT } from "@/content/math";
import { useMathProgress } from "@/hooks/useMathProgress";
import ExerciseCard from "@/components/math/ExerciseCard";

const phrases = [
  "Constancia > talento.",
  "Un ejercicio por vez.",
  "Equivocarse también es practicar.",
  "Lo difícil hoy es lo fácil de mañana.",
  "Cinco ejercicios. Todos los días.",
  "No hace falta ser rápido, hace falta ser constante.",
  "Entender vale más que memorizar.",
];

const PracticePage = () => {
  const today = montevideoDay();
  const [chapterId, setChapterId] = useState<string>("all");
  const [extra, setExtra] = useState(0);
  const { progress, toggle, isLoggedIn } = useMathProgress();

  const pool = useMemo(() => dailyPool(chapterId, today), [chapterId, today]);
  const daily = pool.slice(0, DAILY_COUNT);
  // "More" pulls further exercises, prioritizing not-yet-done ones.
  const rest = pool.slice(DAILY_COUNT);
  const more = [...rest.filter((e) => !progress[e.id]), ...rest.filter((e) => progress[e.id])].slice(0, extra);
  const visible = [...daily, ...more];

  const dailyDone = daily.filter((e) => progress[e.id]).length;
  const streak = computeStreak(Object.values(progress), today);
  const phrase = phrases[parseInt(today.replace(/-/g, ""), 10) % phrases.length];
  const allDone = daily.length > 0 && dailyDone === daily.length;

  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Práctica diaria</h1>
              <p className="mt-2 text-muted-foreground">{phrase}</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-heading font-semibold text-foreground shrink-0">
              <Flame className={cn("h-4 w-4", streak > 0 ? "text-accent" : "text-muted-foreground")} />
              {streak} {streak === 1 ? "día" : "días"}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progreso de hoy</span>
              <span className="font-heading font-semibold text-foreground">{dailyDone}/{daily.length}</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${daily.length ? (dailyDone / daily.length) * 100 : 0}%` }} />
            </div>
          </div>

          {!isLoggedIn && (
            <p className="mt-4 text-sm text-muted-foreground">
              <Link to="/auth" className="text-primary font-medium hover:underline">Iniciá sesión</Link> para guardar tu racha en tu cuenta.
            </p>
          )}
        </header>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {[{ id: "all", label: "Todos" }, ...chapters.map((c) => ({ id: c.id, label: `Cap. ${c.number}` }))].map((opt) => (
            <button
              key={opt.id}
              onClick={() => { setChapterId(opt.id); setExtra(0); }}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                chapterId === opt.id ? "bg-foreground text-background" : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {allDone && (
          <div className="mb-6 rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center">
            <p className="font-heading text-lg font-semibold text-foreground">¡Listo por hoy! 🎉</p>
            <p className="text-sm text-muted-foreground mt-1">Volvé mañana para mantener la racha, o seguí practicando.</p>
          </div>
        )}

        <div className="space-y-4">
          {visible.map((e) => (
            <ExerciseCard key={e.id} exercise={e} done={!!progress[e.id]} onToggle={() => toggle(e.id)} />
          ))}
          {visible.length === 0 && <p className="text-center text-muted-foreground py-10">Todavía no hay ejercicios cargados.</p>}
        </div>

        {visible.length < pool.length && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setExtra((n) => n + DAILY_COUNT)}
              className="rounded-full border border-border px-6 py-2.5 text-sm font-heading font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Quiero más ejercicios
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticePage;
