import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Dumbbell, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSubject } from "@/components/subject/SubjectContext";
import SubjectShell from "@/components/subject/SubjectShell";
import SubjectDocumentViewer from "@/components/subject/SubjectDocumentViewer";

const SubjectResourcesPage = () => {
  const { subject, basePath, t } = useSubject();
  const docs = subject.resourceDocs ?? [];
  const bonusSheets = subject.bonusSheets ?? [];
  const [active, setActive] = useState(docs[0]?.id);
  const doc = docs.find((d) => d.id === active);

  return (
    <SubjectShell>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">{t.resources.title}</h1>
            <p className="mt-2 text-muted-foreground">{t.resources.subtitle}</p>
          </div>
          {subject.driveFolderUrl && (
            <Button asChild variant="outline">
              <a href={subject.driveFolderUrl} target="_blank" rel="noopener noreferrer">
                <FolderOpen /> {t.resources.driveFolder}
              </a>
            </Button>
          )}
        </div>

        {bonusSheets.length > 0 && (
          <Link
            to={`${basePath}/ressources/bonus`}
            className="mt-6 flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Dumbbell className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading font-semibold text-foreground">{t.resources.bonusTitle}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {t.resources.bonusSubtitle(bonusSheets.length)} · {bonusSheets.map((b) => b.title.replace(/^Entraînement : /, "")).join(", ")}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </Link>
        )}

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {docs.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActive(d.id)}
              className={cn(
                "rounded-2xl border bg-card p-4 text-left transition-colors",
                d.id === active ? "border-primary" : "border-border hover:border-foreground/30",
              )}
            >
              <p className="font-heading font-semibold text-foreground">{d.title}</p>
              {d.description && <p className="mt-1 text-sm text-muted-foreground">{d.description}</p>}
            </button>
          ))}
        </div>

        {doc && <SubjectDocumentViewer key={doc.id} docId={doc.id} title={doc.title} className="mt-6" frameClassName="min-h-[75dvh]" />}
      </div>
    </SubjectShell>
  );
};

export default SubjectResourcesPage;
