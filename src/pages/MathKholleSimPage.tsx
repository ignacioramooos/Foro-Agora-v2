import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, Pause, Play, RotateCcw, Shuffle, X } from "lucide-react";
import { allExercises, parisDay } from "@/content/math";
import { kholleWeeks } from "@/content/math/kholles";
import { exerciseUid, formatUid } from "@/content/math/numbering";
import { formatDuration } from "@/hooks/useLocalMap";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import MathShell from "@/components/math/MathShell";
import MathText from "@/components/math/MathText";
import DesmosPanel from "@/components/math/DesmosPanel";

const pick = <T,>(arr: T[], n: number) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

const currentWeek = () => {
  const today = parisDay();
  return [...kholleWeeks].sort((a, b) => b.start.localeCompare(a.start)).find((w) => w.start <= today) ?? kholleWeeks[0];
};

type Phase = "setup" | "prep" | "pass" | "done";

const MathKholleSimPage = () => {
  const week = useMemo(currentWeek, []);
  const chapters = [...new Set(week.scope.map((s) => s.chapter))];
  const pool = allExercises.filter((e) => chapters.includes(e.chapter.number) && e.source !== "exemple" && e.source !== "dm");
  const [prepMin, setPrepMin] = useState(20);
  const [passMin, setPassMin] = useState(20);
  const [count, setCount] = useState(2);
  const [phase, setPhase] = useState<Phase>("setup");
  const [question, setQuestion] = useState(week.incontournables[0]);
  const [exos, setExos] = useState(pool.slice(0, 0));
  const [left, setLeft] = useState(0);
  const [paused, setPaused] = useState(false);
  const [desmos, setDesmos] = useState(false);

  useEffect(() => {
    if (phase !== "prep" && phase !== "pass") return;
    if (paused) return;
    const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(t);
  }, [phase, paused]);

  useEffect(() => {
    if (left > 0) return;
    if (phase === "prep") { setPhase("pass"); setLeft(passMin * 60); }
    else if (phase === "pass") setPhase("done");
  }, [left, phase, passMin]);

  const draw = () => {
    setQuestion(pick(week.incontournables, 1)[0]);
    setExos(pick(pool, count));
    setPhase("prep");
    setPaused(false);
    setLeft(prepMin * 60);
  };

  const stepper = (label: string, v: number, set: (n: number) => void, min: number, max: number, unit = "") => (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => set(Math.max(min, v - (unit ? 5 : 1)))} aria-label={`Diminuer : ${label}`}>−</Button>
        <span className="w-16 text-center font-mono text-sm tabular-nums">{v}{unit}</span>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => set(Math.min(max, v + (unit ? 5 : 1)))} aria-label={`Augmenter : ${label}`}>+</Button>
      </div>
    </div>
  );

  return (
    <MathShell>
      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">Khôlle blanche · {week.label}</p>
        <h1 className="mt-0.5 font-heading text-2xl font-bold text-foreground">Simulateur de khôlle</h1>

        {phase === "setup" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Un tirage en conditions réelles : une question de cours parmi les incontournables de la semaine, puis des exercices des chapitres au programme ({chapters.map((c) => `ch. ${c}`).join(", ")}).
              </p>
              {stepper("Préparation", prepMin, setPrepMin, 5, 60, " min")}
              {stepper("Passage", passMin, setPassMin, 5, 60, " min")}
              {stepper("Exercices", count, setCount, 1, 3)}
              <Button onClick={draw} className="w-full" size="lg"><Shuffle /> Lancer le tirage</Button>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="mb-3 text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground">Incontournables de la semaine</p>
              <ul className="space-y-2 text-sm">
                {week.incontournables.map((q, i) => <li key={i} className="flex gap-2"><span className="text-muted-foreground">{i + 1}.</span><MathText text={q.text} /></li>)}
              </ul>
            </div>
          </div>
        )}

        {phase !== "setup" && (
          <>
            <div className="sticky top-0 z-10 -mx-4 mt-4 flex flex-wrap items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
              <span className={cn("rounded-full px-3 py-1 text-xs font-heading font-semibold uppercase", phase === "prep" ? "bg-secondary text-secondary-foreground" : phase === "pass" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
                {phase === "prep" ? "Préparation" : phase === "pass" ? "Passage au tableau" : "Terminé"}
              </span>
              {phase !== "done" && <span className="font-mono text-3xl font-bold tabular-nums text-foreground" aria-live="polite">{formatDuration(left)}</span>}
              <div className="ml-auto flex flex-wrap gap-2">
                {phase !== "done" && <Button variant="outline" size="sm" onClick={() => setPaused((p) => !p)}>{paused ? <Play /> : <Pause />} {paused ? "Reprendre" : "Pause"}</Button>}
                {phase === "prep" && <Button variant="outline" size="sm" onClick={() => setLeft(0)}>Passer au tableau</Button>}
                {phase === "pass" && <Button variant="outline" size="sm" onClick={() => setPhase("done")}>Terminer</Button>}
                <Button variant="outline" size="sm" onClick={() => setDesmos((d) => !d)} aria-pressed={desmos}><Calculator /> Calculatrice</Button>
                <Button variant="ghost" size="sm" onClick={() => setPhase("setup")}><RotateCcw /> Nouveau tirage</Button>
              </div>
            </div>

            <div className={cn("mt-5 grid gap-5", desmos && "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]")}>
              <div className="space-y-4">
                {week.preamble && <p className="rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">{week.preamble}</p>}
                <article className="rounded-2xl border border-primary/40 bg-primary/5 p-5 sm:p-6">
                  <p className="mb-3 text-xs font-heading font-semibold uppercase text-muted-foreground">Question de cours{question.chapter ? ` · Chap. ${question.chapter}` : ""}</p>
                  <MathText text={question.text} className="text-foreground" />
                </article>
                {exos.map((e) => (
                  <article key={e.id} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                    <div className="mb-3 flex items-center gap-2 text-xs font-heading font-semibold uppercase text-muted-foreground">
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">{e.source === "cours" ? "Cours" : "TD"}</span>
                      <span>Chap. {e.chapter.number} · Exercice {e.number}</span>
                      <Link to={`/maths/exo/${exerciseUid(e.id)}`} className="ml-auto font-mono normal-case hover:text-foreground">{formatUid(e.id)}</Link>
                      {phase !== "done" && exos.length > 1 && (
                        <button type="button" onClick={() => setExos(exos.filter((x) => x.id !== e.id))} aria-label="Retirer cet exercice" className="rounded p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
                      )}
                    </div>
                    <MathText text={e.statement} className="text-foreground" />
                  </article>
                ))}
                {phase === "done" && (
                  <div className="rounded-2xl border border-border bg-card p-5 text-sm">
                    <p className="font-heading font-semibold text-foreground">Bilan</p>
                    <p className="mt-1 text-muted-foreground">Reprends chaque exercice depuis sa page pour le marquer comme fait, demander un indice ou le drapeau si tu veux y revenir.</p>
                    <Button onClick={draw} className="mt-4"><Shuffle /> Nouveau tirage</Button>
                  </div>
                )}
              </div>
              {desmos && <div className="h-[70dvh] overflow-hidden rounded-2xl border border-border lg:sticky lg:top-20"><DesmosPanel onClose={() => setDesmos(false)} /></div>}
            </div>
          </>
        )}
      </div>
    </MathShell>
  );
};

export default MathKholleSimPage;
