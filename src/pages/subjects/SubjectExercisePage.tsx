import { Link, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubject } from "@/components/subject/SubjectContext";
import SubjectShell from "@/components/subject/SubjectShell";
import SubjectExerciseCard from "@/components/subject/SubjectExerciseCard";

const SubjectExercisePage = () => {
  const { uid = "" } = useParams();
  const { index, basePath, progress, toggleProgress, t } = useSubject();
  const n = parseInt(uid.replace(/^#/, ""), 10);
  const exercise = index.getExerciseByUid(n);
  const pos = exercise ? index.indexedExercises.indexOf(exercise) : -1;
  const prev = index.indexedExercises[pos - 1];
  const next = index.indexedExercises[pos + 1];
  const dmId = exercise ? index.dmIdFor(exercise.id) : undefined;
  const bonusId = exercise ? index.bonusSheetIdFor(exercise.id) : undefined;

  return (
    <SubjectShell>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-10">
        <Link to={`${basePath}/index`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <List className="h-4 w-4" /> {t.exercisePage.backToIndex}
        </Link>
        {!exercise ? (
          <p className="mt-8 text-muted-foreground">{t.exercisePage.notFound}</p>
        ) : (
          <>
            <div className="mt-4">
              <SubjectExerciseCard
                exercise={exercise}
                done={!!progress[exercise.id]}
                onToggle={() => toggleProgress(exercise.id)}
              />
            </div>
            {dmId && (
              <Link to={`${basePath}/devoirs/${dmId}`} className="mt-3 inline-block text-sm text-muted-foreground underline hover:text-foreground">
                {t.exercisePage.viewAssignment}
              </Link>
            )}
            {bonusId && (
              <Link to={`${basePath}/ressources/bonus/${bonusId}`} className="mt-3 inline-block text-sm text-muted-foreground underline hover:text-foreground">
                {t.exercisePage.viewSheet}
              </Link>
            )}
            <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
              {prev ? (
                <Button variant="outline" asChild>
                  <Link to={`${basePath}/exo/${prev.uid}`}><ChevronLeft /> {t.exercisePage.previous}</Link>
                </Button>
              ) : (
                <span />
              )}
              {next && (
                <Button asChild>
                  <Link to={`${basePath}/exo/${next.uid}`}>{t.exercisePage.next} <ChevronRight /></Link>
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </SubjectShell>
  );
};

export default SubjectExercisePage;
