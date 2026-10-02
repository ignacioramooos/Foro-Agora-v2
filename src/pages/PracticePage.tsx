import { useEffect, useMemo, useState } from "react";
import MathShell from "@/components/math/MathShell";
import { Calculator, ChevronLeft, ChevronRight, Flame, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import { dailyPool, parisDay, computeStreak, seededShuffle } from "@/content/math";
import { useMathProgress } from "@/hooks/useMathProgress";
import { useMathGoal } from "@/hooks/useMathGoal";
import ExerciseCard from "@/components/math/ExerciseCard";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DesmosPanel from "@/components/math/DesmosPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import MathsAdBanner from "@/components/math/MathsAdBanner";

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
  const chapterId = "all";
  const [extra, setExtra] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [calculatorOpen, setCalculatorOpen] = useState(() => localStorage.getItem("fa_math_calculator_open") !== "false");
  const isMobile = useIsMobile();
  const { progress, toggle, isLoggedIn } = useMathProgress();
  const { goal } = useMathGoal();

  const completedIds = useMemo(() => new Set(Object.keys(progress)), [progress]);
  const pool = useMemo(() => dailyPool(chapterId, today, completedIds), [chapterId, completedIds, today]);
  const daily = pool.slice(0, goal);
  const rest = pool.slice(goal);
  const more = rest.slice(0, extra);
  const [shuffleSeed, setShuffleSeed] = useState<string | null>(null);
  const ordered = [...daily, ...more];
  const visible = useMemo(() => (shuffleSeed ? seededShuffle(ordered, shuffleSeed) : ordered), [shuffleSeed, ordered.map((e) => e.id).join()]);
  const activeExercise = visible[Math.min(activeIndex, Math.max(visible.length - 1, 0))];

  const dailyDone = daily.filter((e) => progress[e.id]).length;
  const streak = computeStreak(Object.values(progress), today);
  const phrase = phrases[parseInt(today.replace(/-/g, ""), 10) % phrases.length];
  const allDone = daily.length > 0 && dailyDone === daily.length;

  useEffect(() => setActiveIndex(0), [goal]);

  const setCalculator = (open: boolean) => {
    setCalculatorOpen(open);
    localStorage.setItem("fa_math_calculator_open", String(open));
  };

  const workspace = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-8 lg:px-10">
        {activeExercise ? (
          <div className="mx-auto flex w-full max-w-4xl flex-col lg:pt-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm text-muted-foreground">Exercice {activeIndex + 1} sur {visible.length}</p>
                <Button variant="outline" size="sm" onClick={() => { setShuffleSeed(String(Math.random())); setActiveIndex(0); }}><Shuffle /> Mélanger</Button>
                {shuffleSeed && <button className="text-xs text-muted-foreground underline hover:text-foreground" onClick={() => { setShuffleSeed(null); setActiveIndex(0); }}>Revenir à la sélection du jour</button>}
              </div>
              {!isMobile && (
                <Button
                  variant={calculatorOpen ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setCalculator(!calculatorOpen)}
                  aria-pressed={calculatorOpen}
                >
                  <Calculator /> Calculatrice
                </Button>
              )}
            </div>
            <ExerciseCard exercise={activeExercise} done={!!progress[activeExercise.id]} onToggle={() => toggle(activeExercise.id)} />
            <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
              <Button variant="outline" onClick={() => setActiveIndex((index) => Math.max(0, index - 1))} disabled={activeIndex === 0}><ChevronLeft /> Précédent</Button>
              {activeIndex < visible.length - 1 ? (
                <Button onClick={() => setActiveIndex((index) => index + 1)}>Suivant <ChevronRight /></Button>
              ) : visible.length < pool.length ? (
                <Button onClick={() => { setExtra((count) => count + goal); setActiveIndex(visible.length); }}>Plus d'exercices <ChevronRight /></Button>
              ) : null}
            </div>
          </div>
        ) : <p className="m-auto text-muted-foreground">Aucun exercice pour l'instant.</p>}
      </div>
    </div>
  );

  const stats = (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0"><h1 className="font-heading text-xl font-bold text-foreground">Aléatoire</h1><p className="mt-1 text-sm text-muted-foreground">{phrase}</p></div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-semibold text-foreground">
          <Flame className={cn("h-4 w-4", streak > 0 ? "text-accent" : "text-muted-foreground")} /> {streak}
        </div>
      </div>
      <div className="mt-3">
        <div className="mb-1.5 flex justify-between text-sm"><span className="text-muted-foreground">Aujourd'hui</span><span className="font-semibold text-foreground">{dailyDone}/{daily.length}</span></div>
        <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-secondary transition-all duration-500" style={{ width: `${daily.length ? (dailyDone / daily.length) * 100 : 0}%` }} /></div>
      </div>
      <p className="mt-2 hidden items-center gap-1.5 text-xs text-muted-foreground lg:flex"><Shuffle className="h-3.5 w-3.5" /> Mélange quotidien de tous les chapitres</p>
      {allDone && <p className="mt-3 rounded-md bg-muted p-3 text-sm font-medium text-foreground">C'est fait pour aujourd'hui.</p>}
      {!isLoggedIn && <p className="mt-3 hidden text-xs text-muted-foreground lg:block">Connecte-toi (en haut à droite) pour synchroniser ta série.</p>}
    </div>
  );

  return (
    <MathShell top={stats}>
      <div className="px-4 pt-4 sm:px-8 lg:px-10"><MathsAdBanner /></div>
      <div className="min-h-[620px] lg:h-full lg:min-h-0">
        {isMobile ? (
          <>
            {workspace}
            <Sheet><SheetTrigger asChild><Button className="fixed bottom-4 right-4 z-40 shadow-lg"><Calculator /> Desmos</Button></SheetTrigger><SheetContent side="bottom" className="h-[92dvh] p-0"><DesmosPanel /></SheetContent></Sheet>
          </>
        ) : calculatorOpen ? (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={62} minSize={42}>{workspace}</ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={38} minSize={25}><DesmosPanel onClose={() => setCalculator(false)} /></ResizablePanel>
          </ResizablePanelGroup>
        ) : workspace}
      </div>
    </MathShell>
  );
};

export default PracticePage;
