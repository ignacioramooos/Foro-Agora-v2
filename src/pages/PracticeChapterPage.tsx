import { Link, Navigate, useParams } from "react-router-dom";
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

  if (!chapter) return <MathShell><p className="p-6 text-muted-foreground">Chapitre introuvable.</p></MathShell>;
  if (tab !== "cours" && tab !== "td") return <Navigate to={`/maths/chapitre/${chapter.id}/cours`} replace />;

  const isCours = tab === "cours";
  const exercises = chapter.exercises.filter((e) => (isCours ? e.source === "cours" : e.source !== "cours"));
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
        <span className="text-sm text-muted-foreground">{done}/{exercises.length} exercices faits</span>
      </div>
    </div>
  );

  const list = (
    <div className="space-y-4 p-4 sm:p-6">
      {exercises.length === 0 && <p className="text-sm text-muted-foreground">Aucun exercice pour cette partie.</p>}
      {exercises.map((e) => (
        <ExerciseCard key={e.id} exercise={{ ...e, chapter }} done={!!progress[e.id]} onToggle={() => toggle(e.id)} />
      ))}
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
            <ResizablePanel defaultSize={45} minSize={30}><div className="h-full overflow-y-auto">{list}</div></ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={55} minSize={30}>{viewer}</ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </MathShell>
  );
};

export default PracticeChapterPage;
