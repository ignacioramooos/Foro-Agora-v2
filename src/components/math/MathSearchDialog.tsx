import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import MathText from "./MathText";
import { formatUid, searchExercises } from "@/content/math/numbering";
import { useMathFlags } from "@/hooks/useMathFlags";

/** Inline-only LaTeX preview (display math flattened) for list rows. */
export const plainPreview = (s: string) => s.replace(/\$\$([\s\S]*?)\$\$/g, (_, m) => `$${m}$`).replace(/\s*\n+\s*/g, " ");
export const PreviewText = ({ text, className }: { text: string; className?: string }) => (
  <div className={"line-clamp-2 overflow-hidden " + (className ?? "")}><MathText text={plainPreview(text)} /></div>
);

const MathSearchDialog = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { flags } = useMathFlags();
  const results = useMemo(() => (query.trim() ? searchExercises(query).slice(0, 40) : []), [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (uid: number) => { setOpen(false); setQuery(""); navigate(`/maths/exo/${uid}`); };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Chercher un exercice" title="Chercher un exercice (Ctrl+K)">
        <Search />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl gap-3 p-4 sm:p-5">
          <DialogTitle className="font-heading">Chercher un exercice</DialogTitle>
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && results[0]) go(results[0].uid); }}
            placeholder="Mot-clé, #42, « chap 3 td »…"
          />
          <div className="max-h-[60dvh] overflow-y-auto">
            {query.trim() && results.length === 0 && <p className="p-3 text-sm text-muted-foreground">Aucun exercice trouvé.</p>}
            {!query.trim() && <p className="p-3 text-sm text-muted-foreground">Tape un mot de l'énoncé, un numéro (#42) ou un chapitre.</p>}
            <ul className="space-y-1">
              {results.map((e) => (
                <li key={e.id}>
                  <button onClick={() => go(e.uid)} className="w-full rounded-md p-2.5 text-left hover:bg-muted">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                      <span className="font-mono">{formatUid(e.id)}</span>
                      <span>Chap. {e.chapter.number} · {e.source === "cours" ? "Cours" : e.source === "dm" ? "DM" : "TD"} {e.number}</span>
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

export default MathSearchDialog;
