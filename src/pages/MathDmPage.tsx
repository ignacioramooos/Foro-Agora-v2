import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { chapters } from "@/content/math";
import { devoirs } from "@/content/math/dm";
import { useMathProgress } from "@/hooks/useMathProgress";
import MathShell from "@/components/math/MathShell";
import MathText from "@/components/math/MathText";
import ExerciseCard from "@/components/math/ExerciseCard";
import DocumentViewer from "@/components/math/DocumentViewer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MathDmPage = () => {
  const { id } = useParams();
  const { progress, toggle } = useMathProgress();
  const [showCorrection, setShowCorrection] = useState(false);

  if (!id && devoirs[0]) return <Navigate to={`/maths/dm/${devoirs[0].id}`} replace />;
  const dm = devoirs.find((d) => d.id === id);
  const chapter = chapters.find((c) => c.number === dm?.chapter) ?? chapters[0];

  return (
    <MathShell>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-10">
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">Devoirs maison</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {devoirs.map((d) => (
            <Link key={d.id} to={`/maths/dm/${d.id}`} className={cn("rounded-full border px-4 py-1.5 text-sm font-semibold", d.id === id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground")}>{d.title}</Link>
          ))}
        </div>

        {!dm ? <p className="mt-8 text-muted-foreground">Devoir introuvable.</p> : (
          <>
            <div className="mt-8">
              <h2 className="font-heading text-xl font-bold text-foreground">{dm.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{dm.due} · {dm.questions.filter((q) => progress[q.id]).length}/{dm.questions.length} questions faites</p>
              {dm.intro && <MathText text={dm.intro} className="mt-3 text-foreground" />}
            </div>
            <div className="mt-5 space-y-4">
              {dm.questions.map((q) => <ExerciseCard key={q.id} exercise={{ ...q, chapter }} done={!!progress[q.id]} onToggle={() => toggle(q.id)} />)}
            </div>

            <h3 className="mt-10 font-heading text-lg font-bold text-foreground">Énoncé original</h3>
            <DocumentViewer docId={dm.docId} title={`${dm.title} — énoncé`} className="mt-3" frameClassName="min-h-[60dvh]" />

            {dm.correctionDocId && (
              <div className="mt-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-heading text-lg font-bold text-foreground">Corrigé</h3>
                  <Button variant={showCorrection ? "secondary" : "default"} onClick={() => setShowCorrection((v) => !v)}>
                    {showCorrection ? <><EyeOff /> Masquer le corrigé</> : <><Eye /> Afficher le corrigé</>}
                  </Button>
                </div>
                {!showCorrection && <p className="mt-2 text-sm text-muted-foreground">Essaie d'abord de tout faire seul, puis compare.</p>}
                {showCorrection && <DocumentViewer docId={dm.correctionDocId} title={`${dm.title} — corrigé`} className="mt-3" frameClassName="min-h-[70dvh]" />}
              </div>
            )}
          </>
        )}
      </div>
    </MathShell>
  );
};

export default MathDmPage;
