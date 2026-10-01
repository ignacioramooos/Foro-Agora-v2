import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Flag } from "lucide-react";
import MathShell from "@/components/math/MathShell";
import { plainPreview } from "@/components/math/MathSearchDialog";
import { chapters } from "@/content/math";
import { formatUid, indexedExercises, searchExercises, type IndexedExercise } from "@/content/math/numbering";
import { useMathProgress } from "@/hooks/useMathProgress";
import { useMathFlags } from "@/hooks/useMathFlags";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Src = "all" | "cours" | "td" | "dm";
type State = "all" | "done" | "todo" | "flagged";

const srcOf = (e: IndexedExercise) => (e.source === "cours" ? "cours" : e.source === "dm" ? "dm" : "td");

const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} aria-pressed={active}
    className={cn("rounded-full border px-3 py-1 text-sm font-semibold transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground")}>
    {children}
  </button>
);

const Row = ({ e, done, flagged }: { e: IndexedExercise; done: boolean; flagged: boolean }) => (
  <li>
    <Link to={`/maths/exo/${e.uid}`} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-foreground/30">
      <span className="w-12 shrink-0 pt-0.5 font-mono text-xs font-semibold text-muted-foreground">{formatUid(e.id)}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-muted-foreground">Chap. {e.chapter.number} · {srcOf(e).toUpperCase().replace("COURS", "Cours")} {e.number}</p>
        <p className="mt-0.5 line-clamp-2 text-sm text-foreground">{plainPreview(e.statement, 180)}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
        {flagged && <Flag className="h-4 w-4 fill-current text-accent" aria-label="Marqué" />}
        {done && <Check className="h-4 w-4 text-primary" aria-label="Fait" />}
      </div>
    </Link>
  </li>
);

const MathIndexPage = () => {
  const { progress } = useMathProgress();
  const { flags } = useMathFlags();
  const [query, setQuery] = useState("");
  const [chapter, setChapter] = useState<number | "all">("all");
  const [src, setSrc] = useState<Src>("all");
  const [state, setState] = useState<State>("all");

  const list = useMemo(() => searchExercises(query).filter((e) =>
    (chapter === "all" || e.chapter.number === chapter) &&
    (src === "all" || srcOf(e) === src) &&
    (state === "all" || (state === "done" ? !!progress[e.id] : state === "todo" ? !progress[e.id] : !!flags[e.id])),
  ), [query, chapter, src, state, progress, flags]);

  const flagged = indexedExercises.filter((e) => flags[e.id]);
  const showFlaggedTop = flagged.length > 0 && state === "all" && !query && chapter === "all" && src === "all";

  return (
    <MathShell>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-10">
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">Index des exercices</h1>
        <p className="mt-1 text-sm text-muted-foreground">{indexedExercises.length} exercices · {Object.keys(progress).length} faits · {flagged.length} marqués</p>

        <Input className="mt-5" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Chercher : mot-clé, #42, chapitre…" />
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip active={chapter === "all"} onClick={() => setChapter("all")}>Tous</Chip>
          {chapters.map((c) => <Chip key={c.id} active={chapter === c.number} onClick={() => setChapter(c.number)}>Chap. {c.number}</Chip>)}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["all", "cours", "td", "dm"] as Src[]).map((s) => <Chip key={s} active={src === s} onClick={() => setSrc(s)}>{s === "all" ? "Toutes sources" : s === "cours" ? "Cours" : s.toUpperCase()}</Chip>)}
          <span className="mx-1 hidden w-px bg-border sm:block" />
          {(["all", "todo", "done", "flagged"] as State[]).map((s) => <Chip key={s} active={state === s} onClick={() => setState(s)}>{{ all: "Tous états", todo: "Non faits", done: "Faits", flagged: "Marqués" }[s]}</Chip>)}
        </div>

        {showFlaggedTop && (
          <section className="mt-8">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-foreground"><Flag className="h-4 w-4 fill-current text-accent" /> Marqués</h2>
            <ul className="mt-3 space-y-2">{flagged.map((e) => <Row key={e.id} e={e} done={!!progress[e.id]} flagged />)}</ul>
          </section>
        )}

        <section className="mt-8">
          {showFlaggedTop && <h2 className="font-heading text-lg font-bold text-foreground">Tous les exercices</h2>}
          <p className="mt-1 text-sm text-muted-foreground">{list.length} résultat{list.length > 1 ? "s" : ""}</p>
          {list.length === 0 && <p className="mt-4 text-muted-foreground">Aucun exercice ne correspond.</p>}
          <ul className="mt-3 space-y-2">{list.map((e) => <Row key={e.id} e={e} done={!!progress[e.id]} flagged={!!flags[e.id]} />)}</ul>
        </section>
      </div>
    </MathShell>
  );
};

export default MathIndexPage;
