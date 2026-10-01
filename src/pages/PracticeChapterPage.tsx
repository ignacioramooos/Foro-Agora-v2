import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { getChapter } from "@/content/math";
import MathText from "@/components/math/MathText";
import { useMathProgress } from "@/hooks/useMathProgress";
import { Button } from "@/components/ui/button";

const PracticeChapterPage = () => {
  const { id = "" } = useParams();
  const chapter = getChapter(id);
  const { progress } = useMathProgress();
  const completed = chapter?.exercises.filter((exercise) => progress[exercise.id]).length ?? 0;

  return (
    <div className="pb-20 pt-10 sm:pt-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link to="/practica" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Retour à l'entraînement
        </Link>

        {!chapter ? (
          <p className="text-muted-foreground">Chapitre introuvable.</p>
        ) : (
          <>
            <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">Chapitre {chapter.number}</p>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-1">{chapter.title}</h1>
            <p className="mt-3 text-muted-foreground">{chapter.summary}</p>

            <div className="mt-7 border-y border-border py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progression personnelle</span>
                <span className="font-heading font-semibold text-foreground">{completed}/{chapter.exercises.length}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-primary transition-all" style={{ width: `${chapter.exercises.length ? completed / chapter.exercises.length * 100 : 0}%` }} />
              </div>
            </div>

            {chapter.notes?.length ? (
              <div className="mt-8 space-y-4">
                {chapter.notes.map((n, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card p-5">
                    <MathText text={n} className="text-foreground" />
                  </div>
                ))}
              </div>
            ) : null}

            {chapter.pdfUrl && (
              <div className="mt-8">
                <div className="flex flex-wrap gap-3">
                  <Button asChild><a href={chapter.pdfUrl} target="_blank" rel="noopener"><FileText /> Cours (PDF)</a></Button>
                  <Button asChild variant="outline"><a href={`/practica/td${chapter.number}.pdf`} target="_blank" rel="noopener"><FileText /> TD (PDF)</a></Button>
                </div>
                <iframe src={chapter.pdfUrl} title={chapter.title} className="mt-4 w-full h-[75vh] rounded-2xl border border-border hidden sm:block" />
              </div>
            )}

            <p className="mt-10 text-sm text-muted-foreground">{chapter.exercises.length} exercices dans ce chapitre.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PracticeChapterPage;
