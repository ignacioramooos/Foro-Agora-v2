import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Dumbbell, FolderOpen } from "lucide-react";
import { bonusSheets } from "@/content/math/bonus";
import { DRIVE_FOLDER_URL, resourceDocs } from "@/content/math/documents";
import MathShell from "@/components/math/MathShell";
import DocumentViewer from "@/components/math/DocumentViewer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MathResourcesPage = () => {
  const [active, setActive] = useState(resourceDocs[0]?.id);
  const doc = resourceDocs.find((d) => d.id === active);

  return (
    <MathShell>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">Ressources</h1>
            <p className="mt-2 text-muted-foreground">Fiches utiles pour toute l'année.</p>
          </div>
          <Button asChild variant="outline"><a href={DRIVE_FOLDER_URL} target="_blank" rel="noopener noreferrer"><FolderOpen /> Dossier Google Drive</a></Button>
        </div>
        <Link to="/maths/ressources/bonus" className="mt-6 flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Dumbbell className="h-5 w-5" /></span>
          <div className="min-w-0 flex-1">
            <p className="font-heading font-semibold text-foreground">Exercices bonus</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{bonusSheets.length} fiche{bonusSheets.length > 1 ? "s" : ""} d'entraînement avec réponses · {bonusSheets.map((b) => b.title.replace(/^Entraînement : /, "")).join(", ")}</p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </Link>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {resourceDocs.map((d) => (
            <button key={d.id} type="button" onClick={() => setActive(d.id)}
              className={cn("rounded-2xl border bg-card p-4 text-left transition-colors", d.id === active ? "border-primary" : "border-border hover:border-foreground/30")}>
              <p className="font-heading font-semibold text-foreground">{d.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{d.description}</p>
            </button>
          ))}
        </div>
        {doc && <DocumentViewer key={doc.id} docId={doc.id} title={doc.title} className="mt-6" frameClassName="min-h-[75dvh]" />}
      </div>
    </MathShell>
  );
};

export default MathResourcesPage;
