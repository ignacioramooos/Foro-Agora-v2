import { Link } from "react-router-dom";
import { Flag, Flame, Timer, Trophy } from "lucide-react";
import { chapters, computeStreak, parisDay } from "@/content/math";
import { indexedExercises, formatUid } from "@/content/math/numbering";
import { useMathProgress } from "@/hooks/useMathProgress";
import { useMathFlags } from "@/hooks/useMathFlags";
import { formatDuration, useLocalMap } from "@/hooks/useLocalMap";
import MathShell from "@/components/math/MathShell";
import MathText from "@/components/math/MathText";

const Bar = ({ label, done, total, tone }: { label: string; done: number; total: number; tone: string }) => (
  <div>
    <div className="mb-1 flex justify-between text-xs text-muted-foreground"><span>{label}</span><span className="tabular-nums">{done}/{total}</span></div>
    <div className="h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${tone}`} style={{ width: total ? `${(done / total) * 100}%` : 0 }} /></div>
  </div>
);

const MathProgressPage = () => {
  const { progress } = useMathProgress();
  const { flags } = useMathFlags();
  const [times] = useLocalMap<number>("fa_math_times");
  const doneCount = Object.keys(progress).length;
  const streak = computeStreak(Object.values(progress), parisDay());
  const weekAgo = Date.now() - 7 * 86400000;
  const stale = indexedExercises.filter((e) => flags[e.id] && !progress[e.id] && new Date(flags[e.id]).getTime() < weekAgo);
  const flaggedOpen = indexedExercises.filter((e) => flags[e.id] && !progress[e.id]);
  const totalTime = Object.values(times).reduce((a, b) => a + b, 0);

  const stat = (Icon: typeof Flag, label: string, value: string) => (
    <div className="rounded-2xl border border-border bg-card p-4">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <p className="mt-2 font-heading text-2xl font-bold tabular-nums text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );

  return (
    <MathShell>
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">Bilan</p>
        <h1 className="mt-0.5 font-heading text-2xl font-bold text-foreground">Progression</h1>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stat(Trophy, "exercices faits", `${doneCount}/${indexedExercises.length}`)}
          {stat(Flame, streak > 1 ? "jours d'affilée" : "jour d'affilée", String(streak))}
          {stat(Flag, "drapeaux à reprendre", String(flaggedOpen.length))}
          {stat(Timer, "temps chronométré", formatDuration(totalTime))}
        </div>

        {stale.length > 0 && (
          <section className="mt-6 rounded-2xl border border-accent/50 bg-card p-5">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold text-foreground"><Flag className="h-4 w-4 text-accent" /> Drapeaux posés il y a plus de 7 jours</h2>
            <ul className="mt-3 space-y-2">
              {stale.slice(0, 8).map((e) => (
                <li key={e.id}>
                  <Link to={`/maths/exo/${e.uid}`} className="flex items-baseline gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">{formatUid(e.id)}</span>
                    <span className="min-w-0 truncate text-foreground"><MathText text={e.statement.split("\n")[0].slice(0, 120)} /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {chapters.map((c) => {
            const by = (f: (s?: string) => boolean) => {
              const list = c.exercises.filter((e) => f(e.source));
              return { total: list.length, done: list.filter((e) => progress[e.id]).length, time: list.reduce((a, e) => a + (times[e.id] ?? 0), 0), timed: list.filter((e) => times[e.id]).length };
            };
            const cours = by((s) => s === "cours"), ex = by((s) => s === "exemple"), td = by((s) => s !== "cours" && s !== "exemple");
            const timed = cours.timed + ex.timed + td.timed;
            const avg = timed ? (cours.time + ex.time + td.time) / timed : 0;
            return (
              <Link key={c.id} to={`/maths/chapitre/${c.id}/td`} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/30">
                <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">Chapitre {c.number}</p>
                <p className="mb-4 font-heading font-semibold text-foreground">{c.title}</p>
                <div className="space-y-3">
                  {cours.total > 0 && <Bar label="Cours" {...cours} tone="bg-foreground/70" />}
                  {ex.total > 0 && <Bar label="Exemples" {...ex} tone="bg-accent" />}
                  {td.total > 0 && <Bar label="TD" {...td} tone="bg-primary" />}
                </div>
                {avg > 0 && <p className="mt-3 text-xs text-muted-foreground">Temps moyen par exercice chronométré : {formatDuration(avg)}</p>}
              </Link>
            );
          })}
        </section>
      </div>
    </MathShell>
  );
};

export default MathProgressPage;
