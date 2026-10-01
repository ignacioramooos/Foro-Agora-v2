export interface MathExercise {
  /** Stable id, e.g. "cap1-ej3". Never change once published (progress depends on it). */
  id: string;
  number: string;
  /** Text with inline $...$ and display $$...$$ LaTeX. */
  statement: string;
}

export interface MathChapter {
  id: string;
  number: number;
  title: string;
  summary: string;
  /** Optional path under /public, e.g. "/practica/cap1.pdf" */
  pdfUrl?: string;
  /** Optional learning notes shown on the chapter page (supports LaTeX). */
  notes?: string[];
  exercises: MathExercise[];
}
