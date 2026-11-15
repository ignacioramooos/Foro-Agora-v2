import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import MathText from "@/components/math/MathText";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSubject } from "@/components/subject/SubjectContext";
import SubjectShell from "@/components/subject/SubjectShell";
import SubjectExerciseCard from "@/components/subject/SubjectExerciseCard";
import SubjectDocumentViewer from "@/components/subject/SubjectDocumentViewer";

const SubjectAssignmentsPage = () => {
  const { dmId } = useParams();
  const { subject, index, basePath, progress, toggleProgress, t } = useSubject();
  const [showCorrection, setShowCorrection] = useState(false);
  const assignments = subject.assignments ?? [];

  if (!dmId && assignments[0]) return <Navigate to={`${basePath}/devoirs/${assignments[0].id}`} replace />;
  const dm = assignments.find((d) => d.id === dmId);
  const chapter = index.chapters.find((c) => c.number === dm?.chapter) ?? index.chapters[0];

  return (
    <SubjectShell>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-10">
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">{t.assignments.title}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {assignments.map((d) => (
            <Link
              key={d.id}
              to={`${basePath}/devoirs/${d.id}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-semibold",
                d.id === dmId ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {d.title}
            </Link>
          ))}
        </div>

        {!dm ? (
          <p className="mt-8 text-muted-foreground">{t.assignments.notFound}</p>
        ) : (
          <>
            <div className="mt-8">
              <h2 className="font-heading text-xl font-bold text-foreground">{dm.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {dm.due} · {t.assignments.questionsDone(dm.questions.filter((q) => progress[q.id]).length, dm.questions.length)}
              </p>
              {dm.intro && <MathText text={dm.intro} className="mt-3 text-foreground" />}
            </div>
            <div className="mt-5 space-y-4">
              {dm.questions.map((q) => (
                <SubjectExerciseCard
                  key={q.id}
                  exercise={{ ...q, chapter }}
                  done={!!progress[q.id]}
                  onToggle={() => toggleProgress(q.id)}
                />
              ))}
            </div>

            {dm.docId && (
              <>
                <h3 className="mt-10 font-heading text-lg font-bold text-foreground">{t.assignments.originalStatement}</h3>
                <SubjectDocumentViewer docId={dm.docId} title={`${dm.title} — ${t.assignments.originalStatement}`} className="mt-3" frameClassName="min-h-[60dvh]" />
              </>
            )}

            {dm.correctionDocId && (
              <div className="mt-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-heading text-lg font-bold text-foreground">{t.assignments.correction}</h3>
                  <Button variant={showCorrection ? "secondary" : "default"} onClick={() => setShowCorrection((v) => !v)}>
                    {showCorrection ? <><EyeOff /> {t.assignments.hideCorrection}</> : <><Eye /> {t.assignments.showCorrection}</>}
                  </Button>
                </div>
                {!showCorrection && <p className="mt-2 text-sm text-muted-foreground">{t.assignments.tryFirst}</p>}
                {showCorrection && (
                  <SubjectDocumentViewer docId={dm.correctionDocId} title={`${dm.title} — ${t.assignments.correction}`} className="mt-3" frameClassName="min-h-[70dvh]" />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </SubjectShell>
  );
};

export default SubjectAssignmentsPage;
