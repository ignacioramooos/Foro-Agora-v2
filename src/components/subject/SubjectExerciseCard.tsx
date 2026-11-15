import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Check, Eye, EyeOff, Flag, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import MathText from "@/components/math/MathText";
import type { SubjectExerciseWithChapter } from "@/content/subjects/helpers";
import { useSubject } from "./SubjectContext";
import { SubjectExerciseHints, SubjectExerciseTimer } from "./SubjectExerciseExtras";

const ExerciseAnswer = ({ id }: { id: string }) => {
  const [open, setOpen] = useState(false);
  const { index, t } = useSubject();
  const answer = index.getAnswer(id);
  if (!answer) return null;

  return (
    <div className="mt-4 space-y-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
      >
        {open ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}{" "}
        {open ? t.card.hideAnswer : t.card.showAnswer}
      </button>
      {open && (
        <div className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm">
          <p className="mb-1 text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground">
            {t.card.answerLabel}
          </p>
          <MathText text={answer} className="min-w-0 break-words" />
        </div>
      )}
    </div>
  );
};

const SubjectExerciseCard = ({
  exercise,
  done,
  onToggle,
}: {
  exercise: SubjectExerciseWithChapter;
  done: boolean;
  onToggle: () => void;
}) => {
  const { subject, index, basePath, flags, toggleFlag, t } = useSubject();
  const flagged = !!flags[exercise.id];
  const srcKey = exercise.source ?? (subject.features.coursTdSplit ? "td" : "exo");

  const copyFallback = (text: string) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  };

  const openGemini = () => {
    const ctx = subject.aiContext ?? subject.name;
    const prompt = t.card.geminiPrompt(ctx, exercise.chapter.title, exercise.statement);
    let copied = copyFallback(prompt);
    if (!copied && navigator.clipboard) {
      navigator.clipboard.writeText(prompt).then(() => { copied = true; }).catch(() => {});
      copied = true;
    }
    if (copied) {
      toast.success(t.card.copiedTitle, { description: t.card.copiedDesc, duration: 10000 });
    } else {
      toast.error(t.card.copyFailedTitle, { description: t.card.copyFailedDesc });
    }
  };

  const chapterTarget = subject.features.coursTdSplit
    ? `${basePath}/chapitre/${exercise.chapter.id}/${exercise.source === "cours" || exercise.source === "exemple" ? "cours" : "td"}`
    : `${basePath}/chapitre/${exercise.chapter.id}`;

  const itemNoun =
    exercise.source === "dm"
      ? t.card.question
      : exercise.source === "exemple"
        ? t.card.exemple
        : t.card.exercise;

  return (
    <article
      className={cn(
        "min-w-0 overflow-hidden rounded-2xl border bg-card p-5 sm:p-6 transition-colors",
        done ? "border-primary/40 bg-primary/5" : "border-border",
      )}
    >
      <div className="mb-4 flex items-center gap-2 text-xs font-heading font-semibold uppercase text-muted-foreground">
        <span
          className={cn(
            "rounded-full px-2.5 py-1",
            exercise.source === "cours"
              ? "bg-muted text-foreground"
              : exercise.source === "exemple"
                ? "bg-accent/15 text-foreground"
                : exercise.source === "bonus"
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary text-secondary-foreground",
          )}
        >
          {t.card.sources[srcKey]}
        </span>
        <span className="min-w-0 truncate">
          {t.card.chapShort} {exercise.chapter.number} · {itemNoun}{" "}
          <span className={cn(exercise.source === "bonus" && "normal-case")}>{exercise.number}</span>
        </span>
        <Link
          to={`${basePath}/exo/${index.exerciseUid(exercise.id)}`}
          className="ml-auto shrink-0 font-mono normal-case tracking-normal hover:text-foreground"
        >
          {index.formatUid(exercise.id)}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleFlag(exercise.id)}
          aria-pressed={flagged}
          aria-label={flagged ? t.card.flagRemove : t.card.flagAdd}
          title={flagged ? t.card.flagRemove : t.card.flagAdd}
          className={cn("-my-2 h-8 w-8 shrink-0", flagged ? "text-accent" : "text-muted-foreground")}
        >
          <Flag className={cn("h-4 w-4", flagged && "fill-current")} />
        </Button>
      </div>

      <MathText text={exercise.statement} className="min-w-0 break-words text-base text-foreground sm:text-lg" />

      <SubjectExerciseHints id={exercise.id} />
      <ExerciseAnswer id={exercise.id} />

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <SubjectExerciseTimer id={exercise.id} />
        <Link
          to={chapterTarget}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <BookOpen className="h-3.5 w-3.5" /> {t.card.reviewChapter} {exercise.chapter.number}
        </Link>
        {subject.features.aiPrompt !== false && (
          <Button
            variant="outline"
            size="sm"
            onClick={openGemini}
            className="h-8 px-3 text-xs font-medium text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5" /> {t.card.copyGemini}
          </Button>
        )}
        <Button
          variant={done ? "default" : "secondary"}
          onClick={onToggle}
          aria-pressed={done}
          className="w-full sm:ml-auto sm:w-auto"
        >
          <Check className="h-4 w-4" /> {done ? t.card.done : t.card.markDone}
        </Button>
      </div>
    </article>
  );
};

export default SubjectExerciseCard;
