import { useState } from "react";
import { Check, Eye, Layers, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import MathText from "@/components/math/MathText";
import { useSubject } from "@/components/subject/SubjectContext";
import SubjectShell from "@/components/subject/SubjectShell";

const SubjectFormulairePage = () => {
  const { subject, flashcards, setFlashcard, t } = useSubject();
  const sectionsList = subject.formulaire ?? [];
  const [flash, setFlash] = useState(false);
  const [shown, setShown] = useState<Record<string, boolean>>({});
  const [section, setSection] = useState<string>("all");
  const [onlyReview, setOnlyReview] = useState(false);

  const sections = sectionsList.filter((s) => section === "all" || s.id === section);
  const total = sectionsList.reduce((n, s) => n + s.items.length, 0);
  const known = Object.values(flashcards).filter((v) => v === "ok").length;

  return (
    <SubjectShell>
      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">{t.formulaire.eyebrow}</p>
        <h1 className="mt-0.5 font-heading text-2xl font-bold text-foreground">{t.formulaire.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.formulaire.subtitle(known, total)}</p>

        <div className="sticky top-0 z-10 -mx-4 mt-4 flex flex-wrap items-center gap-2 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <select
            aria-label="Section"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground"
          >
            <option value="all">{t.formulaire.allSections}</option>
            {sectionsList.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
          <Button variant={flash ? "default" : "outline"} size="sm" onClick={() => { setFlash(!flash); setShown({}); }} aria-pressed={flash}>
            <Layers /> {t.formulaire.flashcards}
          </Button>
          {flash && (
            <Button variant={onlyReview ? "secondary" : "ghost"} size="sm" onClick={() => setOnlyReview(!onlyReview)} aria-pressed={onlyReview}>
              {t.formulaire.onlyReview}
            </Button>
          )}
        </div>

        {sections.map((s) => {
          const items = s.items.filter((f) => !flash || !onlyReview || flashcards[f.id] !== "ok");
          if (!items.length) return null;
          return (
            <section key={s.id} className="mt-6">
              <h2 className="mb-3 font-heading text-lg font-bold text-foreground">{s.title}</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {items.map((f) => {
                  const hidden = flash && !shown[f.id];
                  const state = flashcards[f.id];
                  return (
                    <article
                      key={f.id}
                      className={cn(
                        "min-w-0 rounded-2xl border bg-card p-4",
                        state === "ok" ? "border-primary/40" : state === "review" ? "border-accent/50" : "border-border",
                      )}
                    >
                      <p className="text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground">
                        <MathText text={f.name} />
                      </p>
                      {hidden ? (
                        <button
                          type="button"
                          onClick={() => setShown({ ...shown, [f.id]: true })}
                          className="mt-3 flex h-20 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" /> {t.formulaire.reveal}
                        </button>
                      ) : (
                        <div className="overflow-x-auto"><MathText text={f.tex} className="text-foreground" /></div>
                      )}
                      {flash && !hidden && (
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant={state === "ok" ? "default" : "outline"} onClick={() => setFlashcard(f.id, "ok")}>
                            <Check /> {t.formulaire.knewIt}
                          </Button>
                          <Button size="sm" variant={state === "review" ? "secondary" : "outline"} onClick={() => setFlashcard(f.id, "review")}>
                            <RotateCcw /> {t.formulaire.toReview}
                          </Button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </SubjectShell>
  );
};

export default SubjectFormulairePage;
