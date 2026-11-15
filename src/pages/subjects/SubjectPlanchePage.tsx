import { useMemo, useState } from "react";
import { Flag, Printer, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MathText from "@/components/math/MathText";
import { useSubject } from "@/components/subject/SubjectContext";
import SubjectShell from "@/components/subject/SubjectShell";

const MAX = 10;

const SubjectPlanchePage = () => {
  const { subject, index, flags, t } = useSubject();
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [chapter, setChapter] = useState("flags");
  const [space, setSpace] = useState(true);

  const candidates = useMemo(() => {
    let list = query.trim() ? index.searchExercises(query) : index.indexedExercises;
    if (chapter === "flags") list = list.filter((e) => flags[e.id]);
    else if (chapter !== "all") list = list.filter((e) => e.chapter.id === chapter);
    return list.slice(0, 80);
  }, [query, chapter, flags, index]);

  const picked = selected.map((id) => index.indexedExercises.find((e) => e.id === id)!).filter(Boolean);
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= MAX ? s : [...s, id]));

  return (
    <SubjectShell>
      <style>{`@media print {
        @page { size: A4; margin: 16mm; }
        body * { visibility: hidden !important; }
        #planche, #planche * { visibility: visible !important; }
        #planche { position: absolute; inset: 0; background: #fff; color: #000; }
      }`}</style>
      <div className="mx-auto grid max-w-7xl gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="min-w-0 print:hidden">
          <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">{t.planche.eyebrow}</p>
          <h1 className="mt-0.5 font-heading text-2xl font-bold text-foreground">{t.planche.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.planche.subtitle(MAX)}</p>
          <div className="mt-4 flex gap-2">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.planche.searchPlaceholder}
                className="pl-9"
              />
            </div>
            <select
              aria-label="Filter"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="h-10 rounded-md border border-border bg-background px-2 text-sm text-foreground"
            >
              <option value="flags">{t.planche.filterFlags}</option>
              <option value="all">{t.planche.filterAll}</option>
              {index.chapters.map((c) => (
                <option key={c.id} value={c.id}>{t.card.chapShort} {c.number}</option>
              ))}
            </select>
          </div>
          <ul className="mt-3 max-h-[60dvh] space-y-1 overflow-y-auto rounded-xl border border-border bg-card p-2">
            {candidates.length === 0 && (
              <li className="p-3 text-sm text-muted-foreground">
                {chapter === "flags" ? t.planche.noFlags : t.planche.noResults}
              </li>
            )}
            {candidates.map((e) => {
              const on = selected.includes(e.id);
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => toggle(e.id)}
                    aria-pressed={on}
                    disabled={!on && selected.length >= MAX}
                    className={cn(
                      "flex w-full items-baseline gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors disabled:opacity-50",
                      on ? "bg-primary/10" : "hover:bg-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 translate-y-0.5 items-center justify-center rounded border",
                        on ? "border-primary bg-primary" : "border-border",
                      )}
                    />
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">{index.formatUid(e.id)}</span>
                    {flags[e.id] && <Flag className="h-3 w-3 shrink-0 fill-current text-accent" />}
                    <span className="min-w-0 truncate text-foreground">
                      {t.card.chapShort} {e.chapter.number} · {e.source === "exemple" ? t.card.exemple : t.card.exercise} {e.number}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2 print:hidden">
            <span className="text-sm text-muted-foreground">{t.planche.selectedCount(picked.length, MAX)}</span>
            <label className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={space} onChange={(e) => setSpace(e.target.checked)} /> {t.planche.spaceToAnswer}
            </label>
            <Button onClick={() => window.print()} disabled={!picked.length}>
              <Printer /> {t.planche.printPdf}
            </Button>
          </div>
          <div id="planche" className="rounded-2xl border border-border bg-card p-6 sm:p-10 print:rounded-none print:border-0 print:p-0">
            <header className="mb-6 border-b border-border pb-3">
              <p className="font-heading text-lg font-bold">Foro Agora · {subject.name}</p>
              <p className="text-sm text-muted-foreground">{t.planche.sheetHeader}</p>
            </header>
            {picked.length === 0 && <p className="text-sm text-muted-foreground print:hidden">{t.planche.previewEmpty}</p>}
            <ol className="space-y-6">
              {picked.map((e, i) => (
                <li key={e.id} className="break-inside-avoid">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <span>{t.card.exercise} {i + 1}</span>
                    <span className="font-mono text-xs font-normal text-muted-foreground">
                      {index.formatUid(e.id)} · {t.card.chapShort} {e.chapter.number}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggle(e.id)}
                      aria-label={t.planche.remove}
                      className="ml-auto rounded p-1 text-muted-foreground hover:bg-muted print:hidden"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <MathText text={e.statement} />
                  {space && <div className="mt-3 h-48 rounded border border-dashed border-border print:h-[70mm]" />}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </SubjectShell>
  );
};

export default SubjectPlanchePage;
