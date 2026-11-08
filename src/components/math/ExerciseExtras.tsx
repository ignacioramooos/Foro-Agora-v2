import { useEffect, useRef, useState } from "react";
import { Lightbulb, Pause, Play, RotateCcw, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { hints } from "@/content/math/hints";
import { formatDuration, useLocalMap } from "@/hooks/useLocalMap";
import MathText from "./MathText";

/** Progressive hints (Foro Agora), shown only when the exercise has some. */
export const ExerciseHints = ({ id }: { id: string }) => {
  const [level, setLevel] = useState(0);
  const h = hints[id];
  if (!h) return null;
  return (
    <div className="mt-4 space-y-2">
      {h.slice(0, level).map((t, i) => (
        <div key={i} className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm">
          <p className="mb-1 text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground">
            Indice {i + 1} · {i === 0 ? "stratégie" : "premier pas"}
          </p>
          <MathText text={t} />
        </div>
      ))}
      {level < h.length && (
        <button type="button" onClick={() => setLevel(level + 1)}
          className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground">
          <Lightbulb className="h-3.5 w-3.5" /> {level === 0 ? "Voir un indice" : "Indice suivant"}
        </button>
      )}
      {level > 0 && <p className="text-[11px] text-muted-foreground">Indices Foro Agora — ils ne viennent pas des documents du professeur.</p>}
    </div>
  );
};

/** Discreet per-exercise stopwatch; total time saved on this device. */
export const ExerciseTimer = ({ id }: { id: string }) => {
  const [times, setTime] = useLocalMap<number>("fa_math_times");
  const saved = times[id] ?? 0;
  const [running, setRunning] = useState(false);
  const [extra, setExtra] = useState(0);
  const startRef = useRef(0);
  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now();
    const t = setInterval(() => setExtra((Date.now() - startRef.current) / 1000), 1000);
    return () => clearInterval(t);
  }, [running]);
  const stop = () => {
    setTime(id, saved + (Date.now() - startRef.current) / 1000);
    setExtra(0);
    setRunning(false);
  };
  useEffect(() => () => {
    if (startRef.current && running) setTime(id, saved + (Date.now() - startRef.current) / 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);
  const total = saved + (running ? extra : 0);
  return (
    <div className={cn("inline-flex items-center gap-0.5 rounded-full border px-1 py-0.5 text-xs", running ? "border-primary/50 text-foreground" : "border-border text-muted-foreground")}>
      <Timer className="ml-1.5 h-3.5 w-3.5" />
      <span className="min-w-[2.6rem] px-1 text-center font-mono tabular-nums">{formatDuration(total)}</span>
      <button type="button" onClick={() => (running ? stop() : setRunning(true))} aria-label={running ? "Mettre en pause le chronomètre" : "Lancer le chronomètre"} className="rounded-full p-1 hover:bg-muted">
        {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </button>
      {total > 0 && !running && (
        <button type="button" onClick={() => setTime(id, undefined)} aria-label="Remettre le chronomètre à zéro" className="rounded-full p-1 hover:bg-muted">
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};
