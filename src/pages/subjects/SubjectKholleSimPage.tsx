import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, Pause, Play, RotateCcw, Shuffle, X } from "lucide-react";
import { parisDay } from "@/content/subjects/helpers";
import { formatDuration } from "@/hooks/useLocalMap";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import MathText from "@/components/math/MathText";
import DesmosPanel from "@/components/math/DesmosPanel";
import { useSubject } from "@/components/subject/SubjectContext";
import SubjectShell from "@/components/subject/SubjectShell";

const pick = <T,>(arr: T[], n: number) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
type Phase = "setup" | "prep" | "pass" | "done";

const SubjectKholleSimPage = () => {
  const { subject, index, basePath, t: tr } = useSubject();
  const s = tr.simulator;
  const week = useMemo(() => {
    const list = subject.kholleWeeks ?? [];
    const today = parisDay();
    return [...list].sort((a, b) => b.start.localeCompare(a.start)).find((w) => w.start <= today) ?? list[0];
  }, [subject.kholleWeeks]);

  const chapters = week ? [...new Set(week.scope.map((s) => s.chapter))] : [];
  const pool = index.allExercises.filter((e) => chapters.includes(e.chapter.number) && e.source !== "exemple" && e.source !== "dm");
  const [prepMin, setPrepMin] = useState(20);
  const [passMin, setPassMin] = useState(20);
  const [count, setCount] = useState(2);
  const [phase, setPhase] = useState<Phase>("setup");
  const [question, setQuestion] = useState(week?.incontournables[0]);
  const [exos, setExos] = useState(pool.slice(0, 0));
  const [left, setLeft] = useState(0);
  const [paused, setPaused] = useState(false);
  const [desmos, setDesmos] = useState(false);

  useEffect(() => {
    if ((phase !== "prep" && phase !== "pass") || paused) return;
    const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(t);
  }, [phase, paused]);

  useEffect(() => {
    if (left > 0) return;
    if (phase === "prep") { setPhase("pass"); setLeft(passMin * 60); }
    else if (phase === "pass") setPhase("done");
  }, [left, phase, passMin]);

  if (!week) {
    return (
      <SubjectShell>
        <div className="mx-auto max-w-4xl p-6 text-muted-foreground">{s.noProgramme}</div>
      </SubjectShell>
    );
  }

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
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => set(Math.max(min, v - (unit ? 5 : 1)))}>−</Button>
        <span className="w-16 text-center font-mono text-sm tabular-nums">{v}{unit}</span>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => set(Math.min(max, v + (unit ? 5 : 1)))}>+</Button>
      </div>
    </div>
  );

  return (
    <SubjectShell>
      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">{tr.nav.simulator} · {week.label}</p>
        <h1 className="mt-0.5 font-heading text-2xl font-bold text-foreground">{s.title}</h1>

        {phase === "setup" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {s.intro(chapters.map((c) => s.chapterShort(c)).join(", "))}
              </p>
              {stepper(s.prep, prepMin, setPrepMin, 5, 60, " min")}
              {stepper(s.pass, passMin, setPassMin, 5, 60, " min")}
              {stepper(s.exercises, count, setCount, 1, 3)}
              <Button onClick={draw} className="w-full" size="lg"><Shuffle /> {s.draw}</Button>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="mb-3 text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground">{s.weekIncontournables}</p>
              <ul className="space-y-2 text-sm">
                {week.incontournables.map((q, i) => (
                  <li key={i} className="flex gap-2"><span className="text-muted-foreground">{i + 1}.</span><MathText text={q.text} /></li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {phase !== "setup" && (
          <>
            <div className="sticky top-0 z-10 -mx-4 mt-4 flex flex-wrap items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
              <span className={cn("rounded-full px-3 py-1 text-xs font-heading font-semibold uppercase", phase === "prep" ? "bg-secondary text-secondary-foreground" : phase === "pass" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
                {phase === "prep" ? s.prep : phase === "pass" ? s.phasePass : s.phaseDone}
              </span>
              <span className="font-mono text-2xl font-bold tabular-nums text-foreground">{formatDuration(left)}</span>
              {phase !== "done" && (
                <>
                  <Button variant="outline" size="sm" onClick={() => setPaused(!paused)}>{paused ? <><Play /> {s.resume}</> : <><Pause /> {s.pause}</>}</Button>
                  <Button variant="outline" size="sm" onClick={() => setLeft(0)}>{phase === "prep" ? s.goToBoard : s.finish}</Button>
                </>
              )}
              {subject.features.calculator && (
                <Button variant={desmos ? "secondary" : "outline"} size="sm" onClick={() => setDesmos(!desmos)} className="ml-auto">
                  {desmos ? <><X /> {s.hideDesmos}</> : <><Calculator /> Desmos</>}
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setPhase("setup")}><RotateCcw /> {s.newDraw}</Button>
            </div>
            <div className={cn("mt-6 grid gap-6", desmos && "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]")}>
              <div className="space-y-4">
                {question && (
                  <article className="rounded-2xl border border-primary/40 bg-card p-5">
                    <p className="mb-2 text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground">{s.courseQuestion}</p>
                    <MathText text={question.text} />
                  </article>
                )}
                {exos.map((e, i) => (
                  <article key={e.id} className="rounded-2xl border border-border bg-card p-5">
                    <div className="mb-2 flex items-center justify-between text-xs font-heading font-semibold uppercase text-muted-foreground">
                      <span>{s.exerciseLabel(i + 1, e.chapter.number)}</span>
                      <Link to={`${basePath}/exo/${index.exerciseUid(e.id)}`} className="font-mono hover:text-foreground">
                        {index.formatUid(e.id)}
                      </Link>
                    </div>
                    <MathText text={e.statement} />
                  </article>
                ))}
              </div>
              {desmos && (
                <div className="h-[70dvh] overflow-hidden rounded-2xl border border-border">
                  <DesmosPanel onClose={() => setDesmos(false)} strings={tr.desmos} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </SubjectShell>
  );
};

export default SubjectKholleSimPage;
