import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { getChapter } from "@/content/math";
import { useMathProgress } from "@/hooks/useMathProgress";
import { Button } from "@/components/ui/button";
import ExerciseCard from "@/components/math/ExerciseCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PracticeChapterPage = () => {
  const { id = "" } = useParams();
  const chapter = getChapter(id);
  const { progress } = useMathProgress();
  const completed = chapter?.exercises.filter((exercise) => progress[exercise.id]).length ?? 0;
  const tdExercises = chapter?.exercises.filter((exercise) => exercise.source !== "cours") ?? [];

  return (
    <div className="pb-12 pt-6 sm:pt-8">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <Link to="/maths" className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Retour à l'entraînement
        </Link>

        {!chapter ? (
          <p className="text-muted-foreground">Chapitre introuvable.</p>
        ) : (
          <>
            <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">Chapitre {chapter.number}</p>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-1">{chapter.title}</h1>
            <p className="mt-3 text-muted-foreground">{chapter.summary}</p>

            <div className="mt-5 border-y border-border py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progression personnelle</span>
                <span className="font-heading font-semibold text-foreground">{completed}/{chapter.exercises.length}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-primary transition-all" style={{ width: `${chapter.exercises.length ? completed / chapter.exercises.length * 100 : 0}%` }} />
              </div>
            </div>

            <Tabs defaultValue="cours" className="mt-6 lg:hidden">
              <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="cours">Cours</TabsTrigger><TabsTrigger value="td">TD</TabsTrigger></TabsList>
              <TabsContent value="cours" className="mt-4"><div className="flex justify-end"><Button asChild variant="outline"><a href={chapter.pdfUrl} target="_blank" rel="noopener"><FileText /> Ouvrir le cours</a></Button></div><iframe src={chapter.pdfUrl} title={chapter.title} className="mt-3 h-[70dvh] w-full border border-border bg-card" /></TabsContent>
              <TabsContent value="td" className="mt-4"><TdColumn chapter={chapter} exercises={tdExercises} progress={progress} /></TabsContent>
            </Tabs>
            <div className="mt-6 hidden min-h-[720px] grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)] gap-6 lg:grid">
              <section className="flex min-h-0 flex-col border border-border bg-card">
                <div className="flex h-14 items-center justify-between border-b border-border px-4"><h2 className="font-heading font-semibold text-foreground">Cours</h2><Button asChild variant="outline" size="sm"><a href={chapter.pdfUrl} target="_blank" rel="noopener"><FileText /> Ouvrir</a></Button></div>
                <iframe src={chapter.pdfUrl} title={chapter.title} className="min-h-[660px] flex-1 border-0" />
              </section>
              <TdColumn chapter={chapter} exercises={tdExercises} progress={progress} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const TdColumn = ({ chapter, exercises, progress }: { chapter: NonNullable<ReturnType<typeof getChapter>>; exercises: NonNullable<ReturnType<typeof getChapter>>["exercises"]; progress: Record<string, string> }) => (
  <section className="min-h-0 border border-border bg-background lg:max-h-[calc(100dvh-15rem)] lg:overflow-y-auto">
    <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <div><h2 className="font-heading font-semibold text-foreground">TD</h2><p className="text-xs text-muted-foreground">{exercises.length} exercices</p></div>
      <Button asChild variant="outline" size="sm"><a href={`/practica/td${chapter.number}.pdf`} target="_blank" rel="noopener"><FileText /> PDF</a></Button>
    </div>
    <div className="space-y-4 p-4">
      {exercises.map((exercise) => {
        const enriched = { ...exercise, chapter };
        return <ExerciseCard key={exercise.id} exercise={enriched} done={!!progress[exercise.id]} onToggle={() => undefined} />;
      })}
    </div>
  </section>
);

export default PracticeChapterPage;
