import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Flag } from "lucide-react";
import { PreviewText } from "@/components/math/MathSearchDialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { IndexedSubjectExercise } from "@/content/subjects/helpers";
import { useSubject } from "@/components/subject/SubjectContext";
import SubjectShell from "@/components/subject/SubjectShell";

type Src = "all" | "exemple" | "cours" | "td" | "dm" | "bonus" | "exo";
type State = "all" | "done" | "todo" | "flagged";

const srcOf = (e: IndexedSubjectExercise, hasCoursTd: boolean) =>
  e.source ?? (hasCoursTd ? "td" : "exo");

const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "rounded-full border px-3 py-1 text-sm font-semibold transition-colors",
      active ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground",
    )}
  >
    {children}
  </button>
);

const SubjectIndexPage = () => {
  const { subject, index, basePath, progress, flags, t } = useSubject();
  const [query, setQuery] = useState("");
  const [chapter, setChapter] = useState<number | "all">("all");
  const [src, setSrc] = useState<Src>("all");
  const [state, setState] = useState<State>("all");
  const hasCoursTd = !!subject.features.coursTdSplit;

  const availableSources = useMemo(() => {
    const present = new Set(index.indexedExercises.map((e) => srcOf(e, hasCoursTd)));
    return (["all", "exemple", "cours", "td", "exo", "dm", "bonus"] as Src[]).filter(
      (s) => s === "all" || present.has(s),
    );
  }, [index.indexedExercises, hasCoursTd]);

  const list = useMemo(
    () =>
      index.searchExercises(query).filter(
        (e) =>
          (chapter === "all" || e.chapter.number === chapter) &&
          (src === "all" || srcOf(e, hasCoursTd) === src) &&
          (state === "all" ||
            (state === "done" ? !!progress[e.id] : state === "todo" ? !progress[e.id] : !!flags[e.id])),
      ),
    [index, query, chapter, src, state, progress, flags, hasCoursTd],
  );

  const flagged = index.indexedExercises.filter((e) => flags[e.id]);
  const showFlaggedTop = flagged.length > 0 && state === "all" && !query && chapter === "all" && src === "all";

  const Row = ({ e, done, isFlagged }: { e: IndexedSubjectExercise; done: boolean; isFlagged: boolean }) => {
    const s = srcOf(e, hasCoursTd);
    return (
      <li>
        <Link
          to={`${basePath}/exo/${e.uid}`}
          className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-foreground/30"
        >
          <span className="w-12 shrink-0 pt-0.5 font-mono text-xs font-semibold text-muted-foreground">
            {index.formatUid(e.id)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-muted-foreground">
              {t.card.chapShort} {e.chapter.number} · {t.card.sources[s]} {e.number}
            </p>
            <PreviewText
              text={e.source === "bonus" ? e.statement.split("\n\n").pop() ?? e.statement : e.statement}
              className="mt-0.5 text-sm text-foreground"
            />
          </div>
          <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
            {isFlagged && <Flag className="h-4 w-4 fill-current text-accent" aria-label={t.index.flagged} />}
            {done && <Check className="h-4 w-4 text-primary" aria-label={t.index.done} />}
          </div>
        </Link>
      </li>
    );
  };

  return (
    <SubjectShell>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-10">
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">{t.index.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.index.summary(index.indexedExercises.length, Object.keys(progress).length, flagged.length)}
        </p>

        <Input
          className="mt-5"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.index.searchPlaceholder}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip active={chapter === "all"} onClick={() => setChapter("all")}>{t.index.allChapters}</Chip>
          {index.chapters.map((c) => (
            <Chip key={c.id} active={chapter === c.number} onClick={() => setChapter(c.number)}>
              {t.card.chapShort} {c.number}
            </Chip>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {availableSources.length > 2 &&
            availableSources.map((s) => (
              <Chip key={s} active={src === s} onClick={() => setSrc(s)}>
                {s === "all" ? t.index.allSources : t.card.sources[s]}
              </Chip>
            ))}
          {availableSources.length > 2 && <span className="mx-1 hidden w-px bg-border sm:block" />}
          {(["all", "todo", "done", "flagged"] as State[]).map((s) => (
            <Chip key={s} active={state === s} onClick={() => setState(s)}>
              {{ all: t.index.allStates, todo: t.index.todo, done: t.index.done, flagged: t.index.flagged }[s]}
            </Chip>
          ))}
        </div>

        {showFlaggedTop && (
          <section className="mt-8">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-foreground">
              <Flag className="h-4 w-4 fill-current text-accent" /> {t.index.flaggedSection}
            </h2>
            <ul className="mt-3 space-y-2">
              {flagged.map((e) => <Row key={e.id} e={e} done={!!progress[e.id]} isFlagged />)}
            </ul>
          </section>
        )}

        <section className="mt-8">
          {showFlaggedTop && <h2 className="font-heading text-lg font-bold text-foreground">{t.index.allExercises}</h2>}
          <p className="mt-1 text-sm text-muted-foreground">{t.index.results(list.length)}</p>
          {list.length === 0 && <p className="mt-4 text-muted-foreground">{t.index.noMatch}</p>}
          <ul className="mt-3 space-y-2">
            {list.map((e) => <Row key={e.id} e={e} done={!!progress[e.id]} isFlagged={!!flags[e.id]} />)}
          </ul>
        </section>
      </div>
    </SubjectShell>
  );
};

export default SubjectIndexPage;
