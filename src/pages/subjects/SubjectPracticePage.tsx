import { useEffect, useMemo, useState } from "react";
import { Calculator, ChevronLeft, ChevronRight, Flame, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import { computeStreak, DEFAULT_PHRASES, parisDay, seededShuffle } from "@/content/subjects/helpers";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DesmosPanel from "@/components/math/DesmosPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSubject } from "@/components/subject/SubjectContext";
import SubjectShell from "@/components/subject/SubjectShell";
import SubjectExerciseCard from "@/components/subject/SubjectExerciseCard";

const SubjectPracticePage = () => {
  const today = parisDay();
  const { subject, index, storagePrefix, progress, toggleProgress, isLoggedIn, goal, t } = useSubject();
  const [extra, setExtra] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const calcKey = `${storagePrefix}_calculator_open`;
  const [calculatorOpen, setCalculatorOpen] = useState(() => localStorage.getItem(calcKey) !== "false");
  const isMobile = useIsMobile();

  const completedIds = useMemo(() => new Set(Object.keys(progress)), [progress]);
  const pool = useMemo(() => index.dailyPool("all", today, completedIds), [index, completedIds, today]);
  const daily = pool.slice(0, goal);
  const rest = pool.slice(goal);
  const more = rest.slice(0, extra);
  const [shuffleSeed, setShuffleSeed] = useState<string | null>(null);
  const ordered = [...daily, ...more];
  const visible = useMemo(
    () => (shuffleSeed ? seededShuffle(ordered, shuffleSeed) : ordered),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shuffleSeed, ordered.map((e) => e.id).join()],
  );
  const activeExercise = visible[Math.min(activeIndex, Math.max(visible.length - 1, 0))];

  const dailyDone = daily.filter((e) => progress[e.id]).length;
  const streak = computeStreak(Object.values(progress), today);
  const phrasePool = subject.phrases?.length ? subject.phrases : t.practice.phrases.length ? t.practice.phrases : DEFAULT_PHRASES;
  const phrase = phrasePool[parseInt(today.replace(/-/g, ""), 10) % phrasePool.length];
  const allDone = daily.length > 0 && dailyDone === daily.length;
  const hasCalculator = !!subject.features.calculator;

  useEffect(() => setActiveIndex(0), [goal, subject.slug]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight") setActiveIndex((i) => Math.min(i + 1, visible.length - 1));
      if (e.key === "ArrowLeft") setActiveIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible.length]);

  const setCalculator = (open: boolean) => {
    setCalculatorOpen(open);
    localStorage.setItem(calcKey, String(open));
  };

  const workspace = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-8 lg:px-10">
        {activeExercise ? (
          <div className="mx-auto flex w-full max-w-4xl flex-col lg:pt-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm text-muted-foreground">{t.practice.exerciseOf(activeIndex + 1, visible.length)}</p>
                <Button variant="outline" size="sm" onClick={() => { setShuffleSeed(String(Math.random())); setActiveIndex(0); }}>
                  <Shuffle /> {t.practice.shuffle}
                </Button>
                {shuffleSeed && (
                  <button
                    className="text-xs text-muted-foreground underline hover:text-foreground"
                    onClick={() => { setShuffleSeed(null); setActiveIndex(0); }}
                  >
                    {t.practice.backToDaily}
                  </button>
                )}
              </div>
              {!isMobile && hasCalculator && (
                <Button
                  variant={calculatorOpen ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setCalculator(!calculatorOpen)}
                  aria-pressed={calculatorOpen}
                >
                  <Calculator /> {t.practice.calculator}
                </Button>
              )}
            </div>
            <SubjectExerciseCard
              exercise={activeExercise}
              done={!!progress[activeExercise.id]}
              onToggle={() => toggleProgress(activeExercise.id)}
            />
            <div className="sticky bottom-0 z-10 mt-5 flex items-center justify-between border-t border-border bg-background/95 py-4 backdrop-blur">
              <Button variant="outline" onClick={() => setActiveIndex((i) => Math.max(0, i - 1))} disabled={activeIndex === 0}>
                <ChevronLeft /> {t.practice.previous}
              </Button>
              {activeIndex < visible.length - 1 ? (
                <Button onClick={() => setActiveIndex((i) => i + 1)}>
                  {t.practice.next} <ChevronRight />
                </Button>
              ) : visible.length < pool.length ? (
                <Button onClick={() => { setExtra((c) => c + goal); setActiveIndex(visible.length); }}>
                  {t.practice.moreExercises} <ChevronRight />
                </Button>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="m-auto text-muted-foreground">{t.practice.empty}</p>
        )}
      </div>
    </div>
  );

  const stats = (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-heading text-xl font-bold text-foreground">{t.practice.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{phrase}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-semibold text-foreground">
          <Flame className={cn("h-4 w-4", streak > 0 ? "text-accent" : "text-muted-foreground")} /> {streak}
        </div>
      </div>
      <div className="mt-3">
        <div className="mb-1.5 flex justify-between text-sm">
          <span className="text-muted-foreground">{t.practice.today}</span>
          <span className="font-semibold text-foreground">{dailyDone}/{daily.length}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-secondary transition-all duration-500"
            style={{ width: `${daily.length ? (dailyDone / daily.length) * 100 : 0}%` }}
          />
        </div>
      </div>
      <p className="mt-2 hidden items-center gap-1.5 text-xs text-muted-foreground lg:flex">
        <Shuffle className="h-3.5 w-3.5" /> {t.practice.dailyMix}
      </p>
      {allDone && <p className="mt-3 rounded-md bg-muted p-3 text-sm font-medium text-foreground">{t.practice.allDone}</p>}
      {subject.slug === "maths" && !isLoggedIn && (
        <p className="mt-3 hidden text-xs text-muted-foreground lg:block">{t.practice.signInSync}</p>
      )}
    </div>
  );

  return (
    <SubjectShell top={stats}>
      <div className="min-h-[620px] lg:h-full lg:min-h-0">
        {isMobile ? (
          <>
            {workspace}
            {hasCalculator && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="fixed bottom-4 right-4 z-40 shadow-lg">
                    <Calculator /> Desmos
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[92dvh] p-0">
                  <DesmosPanel />
                </SheetContent>
              </Sheet>
            )}
          </>
        ) : hasCalculator && calculatorOpen ? (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={62} minSize={42}>{workspace}</ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={38} minSize={25}><DesmosPanel onClose={() => setCalculator(false)} /></ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          workspace
        )}
      </div>
    </SubjectShell>
  );
};

export default SubjectPracticePage;
