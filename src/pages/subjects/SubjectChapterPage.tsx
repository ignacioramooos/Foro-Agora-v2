import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowUp, PanelRightClose, PanelRightOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSubject } from "@/components/subject/SubjectContext";
import SubjectShell from "@/components/subject/SubjectShell";
import SubjectExerciseCard from "@/components/subject/SubjectExerciseCard";
import SubjectDocumentViewer from "@/components/subject/SubjectDocumentViewer";

const SubjectChapterPage = () => {
  const { chapterId = "", tab } = useParams();
  const { subject, index, basePath, storagePrefix, progress, toggleProgress, t } = useSubject();
  const chapter = index.getChapter(chapterId);
  const isMobile = useIsMobile();
  const [kind, setKind] = useState<"all" | "exemple" | "exercice">("all");
  const listRef = useRef<HTMLDivElement>(null);
  const docKey = `${storagePrefix}_doc_open`;
  const [docOpen, setDocOpen] = useState(() => typeof window === "undefined" || localStorage.getItem(docKey) !== "false");
  const toggleDoc = () =>
    setDocOpen((o) => {
      localStorage.setItem(docKey, String(!o));
      return !o;
    });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        toggleDoc();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!chapter) return <SubjectShell><p className="p-6 text-muted-foreground">{t.chapter.notFound}</p></SubjectShell>;

  const hasCoursTd = !!subject.features.coursTdSplit;
  if (hasCoursTd && tab !== "cours" && tab !== "td") {
    return <Navigate to={`${basePath}/chapitre/${chapter.id}/cours`} replace />;
  }

  const isCours = hasCoursTd && tab === "cours";
  const inTab = hasCoursTd
    ? chapter.exercises.filter((e) => (isCours ? e.source === "cours" || e.source === "exemple" : e.source !== "cours" && e.source !== "exemple"))
    : chapter.exercises;

  const exampleCount = inTab.filter((e) => e.source === "exemple").length;
  const exercises = inTab.filter((e) => !isCours || kind === "all" || (kind === "exemple" ? e.source === "exemple" : e.source !== "exemple"));

  const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";
  const jumpTo = (exId: string) => document.getElementById(`ex-${exId}`)?.scrollIntoView({ behavior, block: "start" });
  const toTop = () => {
    listRef.current?.scrollTo({ top: 0, behavior });
    window.scrollTo({ top: 0, behavior });
  };

  const doc = hasCoursTd ? (isCours ? chapter.docs?.cours : chapter.docs?.td) : chapter.docs?.cours ?? chapter.docs?.td;
  const done = exercises.filter((e) => progress[e.id]).length;

  const header = (
    <div className="border-b border-border px-4 py-4 sm:px-6">
      <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">{t.chapter.chapterLabel(chapter.number)}</p>
      <h1 className="mt-0.5 font-heading text-xl font-bold text-foreground sm:text-2xl">{chapter.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {hasCoursTd && (
          <div className="inline-flex rounded-md border border-border p-0.5" role="tablist">
            {(["cours", "td"] as const).map((tabId) => (
              <Link
                key={tabId}
                to={`${basePath}/chapitre/${chapter.id}/${tabId}`}
                role="tab"
                aria-selected={tab === tabId}
                className={cn(
                  "rounded px-4 py-1.5 text-sm font-semibold transition-colors",
                  tab === tabId ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tabId === "cours" ? t.nav.cours : t.nav.td}
              </Link>
            ))}
          </div>
        )}
        {isCours && exampleCount > 0 && (
          <div className="inline-flex rounded-md border border-border p-0.5">
            {([
              ["all", t.chapter.all],
              ["exemple", t.chapter.examplesCount(exampleCount)],
              ["exercice", t.chapter.exercisesLabel],
            ] as const).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                aria-pressed={kind === k}
                className={cn(
                  "rounded px-3 py-1.5 text-sm font-semibold transition-colors",
                  kind === k ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <span className="text-sm text-muted-foreground">{t.chapter.doneCount(done, exercises.length)}</span>
        {exercises.length > 1 && (
          <select
            aria-label={t.chapter.jumpTo}
            className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground"
            value=""
            onChange={(ev) => ev.target.value && jumpTo(ev.target.value)}
          >
            <option value="">{t.chapter.jumpTo}</option>
            {exercises.map((e) => (
              <option key={e.id} value={e.id}>
                {e.source === "exemple" ? t.card.exemple : t.card.exercise} {e.number}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );

  const list = (
    <div className="relative space-y-4 p-4 sm:p-6">
      {exercises.length === 0 && <p className="text-sm text-muted-foreground">{t.chapter.empty}</p>}
      {exercises.map((e) => (
        <div key={e.id} id={`ex-${e.id}`} className="scroll-mt-4">
          <SubjectExerciseCard
            exercise={{ ...e, chapter }}
            done={!!progress[e.id]}
            onToggle={() => toggleProgress(e.id)}
          />
        </div>
      ))}
      {exercises.length > 2 && (
        <div className="sticky bottom-4 flex justify-end">
          <button
            type="button"
            onClick={toTop}
            aria-label={t.chapter.backToTop}
            className="rounded-full border border-border bg-card p-2.5 text-muted-foreground shadow-md transition-transform hover:text-foreground active:scale-95"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );

  const viewer = doc ? (
    <SubjectDocumentViewer
      docId={doc.id}
      title={doc.title}
      className="h-full border-0"
      frameClassName={isMobile ? "min-h-[75dvh]" : "min-h-0"}
    />
  ) : null;

  return (
    <SubjectShell>
      {isMobile ? (
        <div>
          {header}
          {viewer ? (
            <Tabs defaultValue="exercices" key={tab ?? chapter.id} className="pt-3">
              <TabsList className="mx-4 grid grid-cols-2">
                <TabsTrigger value="exercices">{t.chapter.tabExercises}</TabsTrigger>
                <TabsTrigger value="document">{t.chapter.tabDocument}</TabsTrigger>
              </TabsList>
              <TabsContent value="exercices">{list}</TabsContent>
              <TabsContent value="document" className="px-4 pb-6">{viewer}</TabsContent>
            </Tabs>
          ) : (
            list
          )}
        </div>
      ) : (
        <div ref={listRef} className="h-full overflow-y-auto scroll-smooth motion-reduce:scroll-auto">
          {header}
          {viewer ? (
            <div
              className={cn(
                "grid items-start transition-[grid-template-columns] duration-200 ease-out motion-reduce:transition-none",
                docOpen ? "grid-cols-[minmax(0,45fr)_minmax(0,55fr)]" : "grid-cols-[minmax(0,1fr)_44px]",
              )}
            >
              <div className={cn("min-w-0", !docOpen && "mx-auto w-full max-w-4xl")}>{list}</div>
              <div className="sticky top-0 flex h-[calc(100dvh-5rem)] min-w-0 flex-col border-l border-border bg-card">
                <div className={cn("flex border-b border-border p-1.5", docOpen ? "justify-start" : "justify-center")}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={toggleDoc}
                    aria-expanded={docOpen}
                    aria-label={docOpen ? t.chapter.hideDoc : t.chapter.showDoc}
                    title={`${docOpen ? t.chapter.hideDoc : t.chapter.showDoc} (Ctrl+Shift+D)`}
                  >
                    {docOpen ? <PanelRightClose /> : <PanelRightOpen />}
                  </Button>
                </div>
                {docOpen ? (
                  <div className="min-h-0 flex-1">{viewer}</div>
                ) : (
                  <button
                    type="button"
                    onClick={toggleDoc}
                    className="flex flex-1 items-start justify-center pt-4 text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground [writing-mode:vertical-rl]"
                  >
                    {isCours ? t.chapter.docCourse : t.chapter.docTd}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-4xl">{list}</div>
          )}
        </div>
      )}
    </SubjectShell>
  );
};

export default SubjectChapterPage;
