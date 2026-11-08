import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { chapters } from "@/content/math";
import { bonusSheets } from "@/content/math/bonus";
import { useMathProgress } from "@/hooks/useMathProgress";
import MathShell from "@/components/math/MathShell";
import ExerciseCard from "@/components/math/ExerciseCard";
import DocumentViewer from "@/components/math/DocumentViewer";
import { cn } from "@/lib/utils";

const MathBonusPage = () => {
  const { id } = useParams();
  const { progress, toggle } = useMathProgress();

  if (!id && bonusSheets[0]) return <Navigate to={`/maths/ressources/bonus/${bonusSheets[0].id}`} replace />;
  const sheet = bonusSheets.find((s) => s.id === id);
  const chapter = chapters.find((c) => c.number === sheet?.chapter) ?? chapters[0];

  return (
    <MathShell>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-10">
        <Link to="/maths/ressources" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Ressources
        </Link>
        <h1 className="mt-3 font-heading text-2xl font-bold text-foreground sm:text-3xl">Exercices bonus</h1>
        <p className="mt-2 text-muted-foreground">Fiches d'entraînement en plus des TD, avec leurs réponses.</p>

        {bonusSheets.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {bonusSheets.map((s) => (
              <Link key={s.id} to={`/maths/ressources/bonus/${s.id}`} className={cn("rounded-full border px-4 py-1.5 text-sm font-semibold", s.id === id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground")}>{s.title}</Link>
            ))}
          </div>
        )}

        {!sheet ? <p className="mt-8 text-muted-foreground">Fiche introuvable.</p> : (
          <>
            <div className="mt-8">
              <h2 className="font-heading text-xl font-bold text-foreground">{sheet.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Chap. {chapter.number} · {chapter.title} · {sheet.questions.filter((q) => progress[q.id]).length}/{sheet.questions.length} faites
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Cherche d'abord seul, puis ouvre « Voir la réponse » pour comparer.</p>
            </div>
            <div className="mt-5 space-y-4">
              {sheet.questions.map((q) => <ExerciseCard key={q.id} exercise={{ ...q, chapter }} done={!!progress[q.id]} onToggle={() => toggle(q.id)} />)}
            </div>

            <h3 className="mt-10 font-heading text-lg font-bold text-foreground">Document original</h3>
            <DocumentViewer docId={sheet.docId} title={sheet.title} className="mt-3" frameClassName="min-h-[75dvh]" />
          </>
        )}
      </div>
    </MathShell>
  );
};

export default MathBonusPage;
