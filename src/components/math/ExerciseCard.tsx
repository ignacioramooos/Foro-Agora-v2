import { Link } from "react-router-dom";
import { BookOpen, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import MathText from "./MathText";
import type { ExerciseWithChapter } from "@/content/math";

const buildPrompt = (e: ExerciseWithChapter) =>
  `Soy estudiante y estoy practicando matemática. Explicame paso a paso cómo resolver este ejercicio, justificando cada paso, sin saltearte cálculos. Al final, dame un consejo para ejercicios similares.\n\nTema: ${e.chapter.title}\nEjercicio: ${e.statement}`;

const ExerciseCard = ({ exercise, done, onToggle }: { exercise: ExerciseWithChapter; done: boolean; onToggle: () => void }) => {
  const openGemini = async () => {
    const prompt = buildPrompt(exercise);
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success("Prompt copiado. Si no aparece en Gemini, pegalo.");
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
        Cap. {exercise.chapter.number} · Ejercicio {exercise.number}
      </p>
      <MathText text={exercise.statement} className="text-base sm:text-lg text-foreground" />

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Link
          to={`/practica/capitulo/${exercise.chapter.id}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <BookOpen className="h-3.5 w-3.5" /> Aprender cap. {exercise.chapter.number}
        </Link>
        <button
          onClick={openGemini}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" /> Ayuda con Gemini
        </button>
        <button
          onClick={onToggle}
          aria-pressed={done}
          className={cn(
            "ml-auto inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-heading font-semibold transition-colors",
            done ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          )}
        >
          <Check className="h-4 w-4" /> {done ? "Hecho" : "Marcar hecho"}
        </button>
      </div>
    </article>
  );
};

export default ExerciseCard;
