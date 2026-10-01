import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { getChapter, chapters, parisDay } from "@/content/math";
import { kholleWeeks, KHOLLE_NOTE } from "@/content/math/kholles";
import MathShell from "@/components/math/MathShell";
import MathText from "@/components/math/MathText";
import DocumentViewer from "@/components/math/DocumentViewer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const addDays = (d: string, n: number) => {
  const x = new Date(`${d}T12:00:00Z`);
  x.setUTCDate(x.getUTCDate() + n);
  return x.toISOString().slice(0, 10);
};

const chapterLink = (n: number) => chapters.find((c) => c.number === n);

const MathKhollesPage = () => {
  const today = parisDay();
  const weeks = [...kholleWeeks].sort((a, b) => b.start.localeCompare(a.start));
  const currentId = weeks.find((w) => w.start <= today && today < addDays(w.start, 7))?.id ?? weeks.find((w) => w.start <= today)?.id;
  const [openDoc, setOpenDoc] = useState<string | null>(null);

  return (
    <MathShell>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-10">
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">Khôlles</h1>
        <p className="mt-2 text-muted-foreground">Le programme de chaque semaine et ses incontournables.</p>
        <p className="mt-3 rounded-md bg-muted p-3 text-sm text-foreground">{KHOLLE_NOTE}</p>

        <div className="mt-8 space-y-6">
          {weeks.map((w) => {
            const current = w.id === currentId;
            return (
              <section key={w.id} id={w.id} className={cn("rounded-2xl border bg-card p-5 sm:p-6", current ? "border-primary" : "border-border")}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-lg font-bold text-foreground">{w.label}</h2>
                    {current && <span className="shrink-0 whitespace-nowrap rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">Cette semaine</span>}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setOpenDoc(openDoc === w.id ? null : w.id)}>
                    <FileText /> {openDoc === w.id ? "Masquer le programme" : "Voir le programme"}
                  </Button>
                </div>

                <h3 className="mt-5 text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground">Au programme</h3>
                <ul className="mt-2 space-y-1.5">
                  {w.scope.map((s) => {
                    const c = chapterLink(s.chapter);
                    return (
                      <li key={s.text} className="flex flex-wrap items-baseline gap-x-2 text-sm text-foreground">
                        <span>{s.text}</span>
                        {c && <Link to={`/maths/chapitre/${c.id}/cours`} className="text-xs font-medium text-primary underline-offset-4 hover:underline">Réviser le cours</Link>}
                      </li>
                    );
                  })}
                </ul>

                <h3 className="mt-5 text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground">Les incontournables</h3>
                <ol className="mt-2 space-y-3">
                  {w.incontournables.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <MathText text={item.text} className="min-w-0 break-words text-foreground" />
                        {item.chapter && getChapter(chapterLink(item.chapter)?.id ?? "") && (
                          <span className="mt-0.5 block text-xs text-muted-foreground">Chapitre {item.chapter}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>

                {openDoc === w.id && <DocumentViewer docId={w.docId} title={`Programme — ${w.label}`} className="mt-5" frameClassName="min-h-[60dvh]" />}
              </section>
            );
          })}
        </div>
      </div>
    </MathShell>
  );
};

export default MathKhollesPage;
