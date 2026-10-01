import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Flame, Minus, Plus, Shuffle, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";
import { chapters, dailyPool, parisDay, computeStreak } from "@/content/math";
import { useMathProgress } from "@/hooks/useMathProgress";
import { useMathGoal } from "@/hooks/useMathGoal";
import ExerciseCard from "@/components/math/ExerciseCard";
import { Button } from "@/components/ui/button";

const phrases = [
  "La régularité bat le talent.",
  "Un exercice à la fois.",
  "Se tromper, c'est aussi s'entraîner.",
  "Ce qui est dur aujourd'hui sera facile demain.",
  "Cinq exercices. Tous les jours.",
  "Pas besoin d'aller vite, il faut être régulier.",
  "Comprendre vaut mieux que mémoriser.",
];

const PracticePage = () => {
  const today = parisDay();
  const [chapterId, setChapterId] = useState<string>("all");
  const [extra, setExtra] = useState(0);
  const { progress, toggle, isLoggedIn } = useMathProgress();
  const { goal, setGoal } = useMathGoal();

  const completedIds = useMemo(() => new Set(Object.keys(progress)), [progress]);
  const pool = useMemo(() => dailyPool(chapterId, today, completedIds), [chapterId, completedIds, today]);
  const daily = pool.slice(0, goal);
  const rest = pool.slice(goal);
  const more = rest.slice(0, extra);
  const visible = [...daily, ...more];

  const dailyDone = daily.filter((e) => progress[e.id]).length;
  const streak = computeStreak(Object.values(progress), today);
  const phrase = phrases[parseInt(today.replace(/-/g, ""), 10) % phrases.length];
  const allDone = daily.length > 0 && dailyDone === daily.length;

  return (
    <div className="pb-20 pt-10 sm:pt-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Entraînement quotidien</h1>
              <p className="mt-2 text-muted-foreground">{phrase}</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-heading font-semibold text-foreground shrink-0">
              <Flame className={cn("h-4 w-4", streak > 0 ? "text-accent" : "text-muted-foreground")} />
              {streak} {streak === 1 ? "jour" : "jours"}
            </div>
          </div>

          <div className="mt-7 border-y border-border py-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-heading font-semibold text-foreground">Objectif quotidien</p>
                <p className="text-xs text-muted-foreground">Choisis ton rythme, de 1 à 30 exercices.</p>
              </div>
              <div className="flex items-center gap-2" aria-label="Objectif quotidien">
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setGoal(goal - 1)} disabled={goal <= 1} aria-label="Réduire l'objectif"><Minus /></Button>
                <span className="w-16 text-center font-heading text-lg font-bold text-foreground">{goal}</span>
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setGoal(goal + 1)} disabled={goal >= 30} aria-label="Augmenter l'objectif"><Plus /></Button>
              </div>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progression du jour</span>
              <span className="font-heading font-semibold text-foreground">{dailyDone}/{daily.length}</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${daily.length ? (dailyDone / daily.length) * 100 : 0}%` }} />
            </div>
          </div>

          {!isLoggedIn && (
            <p className="mt-4 text-sm text-muted-foreground">
              <Link to="/auth" className="text-primary font-medium hover:underline">Connecte-toi</Link> pour sauvegarder ta série sur ton compte.
            </p>
          )}
        </header>

        <div className="mb-2 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {[{ id: "all", label: "Tous" }, ...chapters.map((c) => ({ id: c.id, label: `Chap. ${c.number}` }))].map((opt) => (
            <Button
              variant={chapterId === opt.id ? "default" : "secondary"}
              size="sm"
              key={opt.id}
              onClick={() => { setChapterId(opt.id); setExtra(0); }}
              className="shrink-0"
            >
              {opt.label}
            </Button>
          ))}
        </div>
        <p className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          {chapterId === "all" ? <><Shuffle className="h-3.5 w-3.5" /> Mélange quotidien</> : <><ListOrdered className="h-3.5 w-3.5" /> Ordre du chapitre · premier exercice non terminé</>}
        </p>

        {allDone && (
          <div className="mb-6 rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center">
            <p className="font-heading text-lg font-semibold text-foreground">C'est fait pour aujourd'hui ! 🎉</p>
            <p className="text-sm text-muted-foreground mt-1">Reviens demain pour garder ta série, ou continue à t'entraîner.</p>
          </div>
        )}

        <div className="space-y-4">
          {visible.map((e) => (
            <ExerciseCard key={e.id} exercise={e} done={!!progress[e.id]} onToggle={() => toggle(e.id)} />
          ))}
          {visible.length === 0 && <p className="text-center text-muted-foreground py-10">Aucun exercice pour l'instant.</p>}
        </div>

        {visible.length < pool.length && (
          <div className="mt-8 text-center">
            <Button variant="outline" onClick={() => setExtra((n) => n + goal)}>
              Plus d'exercices
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticePage;
