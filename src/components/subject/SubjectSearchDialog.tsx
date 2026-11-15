import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PreviewText } from "@/components/math/MathSearchDialog";
import { useSubject } from "./SubjectContext";

const sourceLabel = (source?: string) => {
  if (source === "cours") return "Cours";
  if (source === "exemple") return "Exemple";
  if (source === "dm") return "DM";
  if (source === "bonus") return "Bonus";
  if (source === "exo") return "Exercice";
  return "TD";
};

const SubjectSearchDialog = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { index, flags, basePath, t } = useSubject();
  const results = useMemo(() => (query.trim() ? index.searchExercises(query).slice(0, 40) : []), [query, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (uid: number) => {
    setOpen(false);
    setQuery("");
    navigate(`${basePath}/exo/${uid}`);
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label={t.search.ariaLabel} title={`${t.search.ariaLabel} (Ctrl+K)`}>
        <Search />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl gap-3 p-4 sm:p-5">
          <DialogTitle className="font-heading">{t.search.title}</DialogTitle>
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && results[0]) go(results[0].uid); }}
            placeholder={t.search.placeholder}
          />
          <div className="max-h-[60dvh] overflow-y-auto">
            {query.trim() && results.length === 0 && <p className="p-3 text-sm text-muted-foreground">{t.search.empty}</p>}
            {!query.trim() && <p className="p-3 text-sm text-muted-foreground">{t.search.hint}</p>}
            <ul className="space-y-1">
              {results.map((e) => (
                <li key={e.id}>
                  <button onClick={() => go(e.uid)} className="w-full rounded-md p-2.5 text-left hover:bg-muted">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                      <span className="font-mono">{index.formatUid(e.id)}</span>
                      <span>{t.card.chapShort} {e.chapter.number} · {t.card.sources[e.source ?? "td"] ?? sourceLabel(e.source)} {e.number}</span>
                      {flags[e.id] && <Flag className="h-3.5 w-3.5 fill-current text-accent" />}
                    </div>
                    <PreviewText text={e.statement} className="mt-0.5 text-sm text-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubjectSearchDialog;
