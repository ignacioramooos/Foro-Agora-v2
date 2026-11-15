import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubject } from "@/components/subject/SubjectContext";
import SubjectShell from "@/components/subject/SubjectShell";
import SubjectExerciseCard from "@/components/subject/SubjectExerciseCard";
import SubjectDocumentViewer from "@/components/subject/SubjectDocumentViewer";

const SubjectBonusPage = () => {
  const { sheetId } = useParams();
  const { subject, index, basePath, progress, toggleProgress, t } = useSubject();
  const bonusSheets = subject.bonusSheets ?? [];

  if (!sheetId && bonusSheets[0]) return <Navigate to={`${basePath}/ressources/bonus/${bonusSheets[0].id}`} replace />;
  const sheet = bonusSheets.find((s) => s.id === sheetId);
  const chapter = index.chapters.find((c) => c.number === sheet?.chapter) ?? index.chapters[0];

  return (
    <SubjectShell>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-10">
        <Link to={`${basePath}/ressources`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {t.resources.backToResources}
        </Link>
        <h1 className="mt-3 font-heading text-2xl font-bold text-foreground sm:text-3xl">{t.resources.bonusTitle}</h1>
        <p className="mt-2 text-muted-foreground">{t.resources.bonusPageDesc}</p>

        {bonusSheets.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {bonusSheets.map((s) => (
              <Link
                key={s.id}
                to={`${basePath}/ressources/bonus/${s.id}`}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-semibold",
                  s.id === sheetId ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {s.title}
              </Link>
            ))}
          </div>
        )}

        {!sheet ? (
          <p className="mt-8 text-muted-foreground">{t.resources.bonusNotFound}</p>
        ) : (
          <>
            <div className="mt-8">
              <h2 className="font-heading text-xl font-bold text-foreground">{sheet.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.card.chapShort} {chapter.number} · {chapter.title} · {sheet.questions.filter((q) => progress[q.id]).length}/{sheet.questions.length}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{t.resources.bonusTip}</p>
            </div>
            <div className="mt-5 space-y-4">
              {sheet.questions.map((q) => (
                <SubjectExerciseCard
                  key={q.id}
                  exercise={{ ...q, chapter }}
                  done={!!progress[q.id]}
                  onToggle={() => toggleProgress(q.id)}
                />
              ))}
            </div>

            {sheet.docId && (
              <>
                <h3 className="mt-10 font-heading text-lg font-bold text-foreground">{t.resources.originalDoc}</h3>
                <SubjectDocumentViewer docId={sheet.docId} title={sheet.title} className="mt-3" frameClassName="min-h-[75dvh]" />
              </>
            )}
          </>
        )}
      </div>
    </SubjectShell>
  );
};

export default SubjectBonusPage;
