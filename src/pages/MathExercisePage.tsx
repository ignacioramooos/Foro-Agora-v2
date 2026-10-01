import { Link, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import MathShell from "@/components/math/MathShell";
import ExerciseCard from "@/components/math/ExerciseCard";
import { dmIdFor, getExerciseByUid, indexedExercises } from "@/content/math/numbering";
import { useMathProgress } from "@/hooks/useMathProgress";
import { Button } from "@/components/ui/button";

const MathExercisePage = () => {
  const { uid = "" } = useParams();
  const n = parseInt(uid.replace(/^#/, ""), 10);
  const exercise = getExerciseByUid(n);
  const { progress, toggle } = useMathProgress();
  const pos = exercise ? indexedExercises.indexOf(exercise) : -1;
  const prev = indexedExercises[pos - 1];
  const next = indexedExercises[pos + 1];
  const dmId = exercise ? dmIdFor(exercise.id) : undefined;

  return (
    <MathShell>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-10">
        <Link to="/maths/index" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><List className="h-4 w-4" /> Index des exercices</Link>
        {!exercise ? (
          <p className="mt-8 text-muted-foreground">Exercice introuvable.</p>
        ) : (
          <>
            <div className="mt-4">
              <ExerciseCard exercise={exercise} done={!!progress[exercise.id]} onToggle={() => toggle(exercise.id)} />
            </div>
            {dmId && <Link to={`/maths/dm/${dmId}`} className="mt-3 inline-block text-sm text-muted-foreground underline hover:text-foreground">Voir le devoir complet</Link>}
            <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
              {prev ? <Button variant="outline" asChild><Link to={`/maths/exo/${prev.uid}`}><ChevronLeft /> Précédent</Link></Button> : <span />}
              {next && <Button asChild><Link to={`/maths/exo/${next.uid}`}>Suivant <ChevronRight /></Link></Button>}
            </div>
          </>
        )}
      </div>
    </MathShell>
  );
};

export default MathExercisePage;
