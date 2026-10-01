import { Link } from "react-router-dom";
import { BookOpen, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
        "rounded-2xl border bg-card p-5 sm:p-6 transition-colors",
        done ? "border-primary/40 bg-primary/5" : "border-border",
      )}
    >
      <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground mb-3">
        Chap. {exercise.chapter.number} · Exercice {exercise.number}
      </p>
      <MathText text={exercise.statement} className="text-base sm:text-lg text-foreground" />

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Link
          to={`/practica/capitulo/${exercise.chapter.id}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <BookOpen className="h-3.5 w-3.5" /> Revoir le chap. {exercise.chapter.number}
        </Link>
        <button
          onClick={openGemini}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" /> Aide avec Gemini
        </button>
        <button
          onClick={onToggle}
          aria-pressed={done}
          className={cn(
            "ml-auto inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-heading font-semibold transition-colors",
            done ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          )}
        >
          <Check className="h-4 w-4" /> {done ? "Fait" : "Marquer comme fait"}
        </button>
      </div>
    </article>
  );
};

export default ExerciseCard;
