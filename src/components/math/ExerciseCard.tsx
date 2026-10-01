import { Link } from "react-router-dom";
import { BookOpen, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import MathText from "./MathText";
import type { ExerciseWithChapter } from "@/content/math";

const buildPrompt = (e: ExerciseWithChapter) =>
  `Je suis étudiant en MPSI et je m'entraîne en mathématiques. Explique-moi pas à pas comment résoudre cet exercice, en justifiant chaque étape et sans sauter de calculs. À la fin, donne-moi un conseil pour les exercices similaires.\n\nChapitre : ${e.chapter.title}\nExercice : ${e.statement}`;

const ExerciseCard = ({ exercise, done, onToggle }: { exercise: ExerciseWithChapter; done: boolean; onToggle: () => void }) => {
  const openGemini = async () => {
    const prompt = buildPrompt(exercise);
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success("Prompt copié. S'il n'apparaît pas dans Gemini, colle-le.");
    } catch {
      /* ignore */
    }
    window.open(`https://gemini.google.com/app?q=${encodeURIComponent(prompt)}`, "_blank", "noopener");
  };

  return (
    <article
      className={cn(
        "min-w-0 overflow-hidden rounded-2xl border bg-card p-5 sm:p-6 transition-colors",
        done ? "border-primary/40 bg-primary/5" : "border-border",
      )}
    >
      <div className="mb-4 flex items-center gap-2 text-xs font-heading font-semibold uppercase text-muted-foreground">
        <span className={cn("rounded-full px-2.5 py-1", exercise.source === "cours" ? "bg-muted text-foreground" : "bg-secondary text-secondary-foreground")}>
          {exercise.source === "cours" ? "Cours" : "TD"}
        </span>
        <span>Chap. {exercise.chapter.number} · Exercice {exercise.number}</span>
      </div>
      <MathText text={exercise.statement} className="min-w-0 break-words text-base text-foreground sm:text-lg" />

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Link
          to={`/maths/chapitre/${exercise.chapter.id}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <BookOpen className="h-3.5 w-3.5" /> Revoir le chap. {exercise.chapter.number}
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={openGemini}
          className="h-8 px-3 text-xs font-medium text-muted-foreground"
        >
          <Sparkles className="h-3.5 w-3.5" /> Aide avec Gemini
        </Button>
        <Button
          variant={done ? "default" : "secondary"}
          onClick={onToggle}
          aria-pressed={done}
          className="w-full sm:ml-auto sm:w-auto"
        >
          <Check className="h-4 w-4" /> {done ? "Fait" : "Marquer comme fait"}
        </Button>
      </div>
    </article>
  );
};

export default ExerciseCard;
