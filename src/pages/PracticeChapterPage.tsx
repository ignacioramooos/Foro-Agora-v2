import { useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { getChapter } from "@/content/math";
import { coursDocs, tdDocs } from "@/content/math/documents";
import { useMathProgress } from "@/hooks/useMathProgress";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import ExerciseCard from "@/components/math/ExerciseCard";
import DocumentViewer from "@/components/math/DocumentViewer";
import MathShell from "@/components/math/MathShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const PracticeChapterPage = () => {
  const { id = "", tab } = useParams();
  const chapter = getChapter(id);
  const { progress, toggle } = useMathProgress();
  const isMobile = useIsMobile();
  const [kind, setKind] = useState<"all" | "exemple" | "exercice">("all");
  const listRef = useRef<HTMLDivElement>(null);

  if (!chapter) return <MathShell><p className="p-6 text-muted-foreground">Chapitre introuvable.</p></MathShell>;
  if (tab !== "cours" && tab !== "td") return <Navigate to={`/maths/chapitre/${chapter.id}/cours`} replace />;

  const isCours = tab === "cours";
  const inTab = chapter.exercises.filter((e) => (isCours ? e.source === "cours" || e.source === "exemple" : e.source !== "cours" && e.source !== "exemple"));
  const exampleCount = inTab.filter((e) => e.source === "exemple").length;
  const exercises = inTab.filter((e) => !isCours || kind === "all" || (kind === "exemple" ? e.source === "exemple" : e.source !== "exemple"));
  const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";
  const jumpTo = (exId: string) => document.getElementById(`ex-${exId}`)?.scrollIntoView({ behavior, block: "start" });
  const toTop = () => {
    listRef.current?.scrollTo({ top: 0, behavior });
    window.scrollTo({ top: 0, behavior });
  };
  const doc = (isCours ? coursDocs : tdDocs)[chapter.number];
  const done = exercises.filter((e) => progress[e.id]).length;

  const header = (
    <div className="border-b border-border px-4 py-4 sm:px-6">
      <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">Chapitre {chapter.number}</p>
      <h1 className="mt-0.5 font-heading text-xl font-bold text-foreground sm:text-2xl">{chapter.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-md border border-border p-0.5" role="tablist">
          {(["cours", "td"] as const).map((t) => (
            <Link key={t} to={`/maths/chapitre/${chapter.id}/${t}`} role="tab" aria-selected={tab === t}
              className={cn("rounded px-4 py-1.5 text-sm font-semibold transition-colors", tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
              {t === "cours" ? "Cours" : "TD"}
            </Link>
          ))}
        </div>
        {isCours && exampleCount > 0 && (
          <div className="inline-flex rounded-md border border-border p-0.5">
            {([["all", "Tout"], ["exemple", `Exemples (${exampleCount})`], ["exercice", "Exercices"]] as const).map(([k, label]) => (
              <button key={k} type="button" onClick={() => setKind(k)} aria-pressed={kind === k}
                className={cn("rounded px-3 py-1.5 text-sm font-semibold transition-colors", kind === k ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground")}>
                {label}
              </button>
            ))}
          </div>
        )}
        <span className="text-sm text-muted-foreground">{done}/{exercises.length} faits</span>
        {exercises.length > 1 && (
          <select aria-label="Aller à" className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground" value="" onChange={(ev) => ev.target.value && jumpTo(ev.target.value)}>
            <option value="">Aller à…</option>
            {exercises.map((e) => <option key={e.id} value={e.id}>{e.source === "exemple" ? "Exemple" : "Exercice"} {e.number}</option>)}
          </select>
        )}
      </div>
    </div>
  );

  const list = (
    <div className="relative space-y-4 p-4 sm:p-6">
      {exercises.length === 0 && <p className="text-sm text-muted-foreground">Aucun exercice pour cette partie.</p>}
      {exercises.map((e) => (
        <div key={e.id} id={`ex-${e.id}`} className="scroll-mt-4">
          <ExerciseCard exercise={{ ...e, chapter }} done={!!progress[e.id]} onToggle={() => toggle(e.id)} />
        </div>
      ))}
      {exercises.length > 2 && (
        <div className="sticky bottom-4 flex justify-end">
          <button type="button" onClick={toTop} aria-label="Remonter en haut" className="rounded-full border border-border bg-card p-2.5 text-muted-foreground shadow-md transition-transform hover:text-foreground active:scale-95">
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );

  const viewer = doc ? <DocumentViewer docId={doc.id} title={doc.title} className="h-full border-0" frameClassName={isMobile ? "min-h-[75dvh]" : "min-h-0"} /> : null;

  return (
    <MathShell>
      {isMobile ? (
        <div>
          {header}
          <Tabs defaultValue="exercices" key={tab} className="pt-3">
            <TabsList className="mx-4 grid grid-cols-2"><TabsTrigger value="exercices">Exercices</TabsTrigger><TabsTrigger value="document">Document</TabsTrigger></TabsList>
            <TabsContent value="exercices">{list}</TabsContent>
            <TabsContent value="document" className="px-4 pb-6">{viewer}</TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="flex h-full min-h-0 flex-col">
          {header}
          <ResizablePanelGroup direction="horizontal" className="min-h-0 flex-1">
            <ResizablePanel defaultSize={45} minSize={30}><div ref={listRef} className="h-full overflow-y-auto scroll-smooth motion-reduce:scroll-auto">{list}</div></ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={55} minSize={30}>{viewer}</ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </MathShell>
  );
};

export default PracticeChapterPage;
