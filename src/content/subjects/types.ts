import type { SubjectLocale } from "./i18n";

export type ExerciseSource = "td" | "cours" | "dm" | "exemple" | "bonus" | "exo";

export interface SubjectExercise {
  /** Stable id, e.g. "phys-ch1-ex1". Never change once published (progress depends on it). */
  id: string;
  /** Display number or label, e.g. "1", "2.a", "3". */
  number: string;
  /** Source category. Defaults to "exo" (or "td" when coursTdSplit is enabled). */
  source?: ExerciseSource;
  /** Text with inline $...$ and display $$...$$ LaTeX. */
  statement: string;
  /** Optional progressive hints (alternative to a separate hints map). */
  hints?: string[];
  /** Optional answer / solution shown behind "Voir la réponse". */
  answer?: string;
}

export interface SubjectDoc {
  /** Google Drive file ID. */
  id: string;
  title: string;
  description?: string;
}

export interface SubjectChapter {
  /** URL-safe slug, e.g. "chapitre-1" or "mecanique". */
  id: string;
  number: number;
  title: string;
  summary: string;
  /** Optional Google Drive documents attached to this chapter. */
  docs?: {
    cours?: SubjectDoc;
    td?: SubjectDoc;
  };
  /** Optional learning notes shown on the chapter page (supports LaTeX). */
  notes?: string[];
  exercises: SubjectExercise[];
}

export interface FormulaireItem {
  id: string;
  name: string;
  tex: string;
}

export interface FormulaireSection {
  id: string;
  title: string;
  items: FormulaireItem[];
}

export interface SubjectAssignment {
  id: string;
  title: string;
  due: string;
  chapter: number;
  docId?: string;
  correctionDocId?: string;
  intro?: string;
  questions: SubjectExercise[];
}

export interface SubjectBonusSheet {
  id: string;
  title: string;
  chapter: number;
  docId?: string;
  questions: SubjectExercise[];
}

export interface KholleScopeItem {
  text: string;
  chapter: number;
}

export interface KholleQuestion {
  text: string;
  chapter?: number;
}

export interface KholleWeek {
  id: string;
  label: string;
  start: string;
  docId?: string;
  preamble?: string;
  warning?: string;
  scope: KholleScopeItem[];
  incontournables: KholleQuestion[];
}

export interface SubjectFeatures {
  /** Split-pane Desmos graphing calculator (useful for Maths/Physics; optional for others). */
  calculator?: boolean;
  /** Split each chapter into "Cours" and "TD" tabs (CPGE convention). When false, shows a unified exercise list. */
  coursTdSplit?: boolean;
  /** CPGE-exclusive: weekly oral exam (khôlle) programmes. Off by default. */
  kholles?: boolean;
  /** CPGE-exclusive: timed oral exam simulator. Off by default. */
  kholleSimulator?: boolean;
  /** Formula sheet with Flashcards mode (enabled automatically if formulaire is non-empty unless explicitly false). */
  formulaire?: boolean;
  /** Homework / Assignments ("Devoirs") tab. */
  assignments?: boolean;
  /** Google Drive resources & bonus sheets tab. */
  resources?: boolean;
  /** Printable A4 worksheet builder ("Planche papier"). */
  printableSheet?: boolean;
  /** "Copier pour Gemini" button on exercise cards. */
  aiPrompt?: boolean;
}

export interface SubjectConfig {
  /** URL slug under /classes/:slug (e.g. "maths", "physique", "chimie", "sii"). */
  slug: string;
  /** Short display name in header & sidebar (e.g. "Maths", "Physique"). */
  name: string;
  /** Full title shown in the /classes directory (e.g. "Mathématiques — MPSI"). */
  fullName: string;
  /** Short description for the /classes directory. */
  description: string;
  /** Professor or maintainer name (e.g. "Prof. Martin" or "Foro Agora"). */
  professor?: string;
  /** School, class, or "Ouvert à tous". */
  institution?: string;
  /** Level tag, e.g. "CPGE MPSI", "Lycée", "Université", "Libre". */
  level?: string;
  /** Marks whether this class uses CPGE-specific workflows (khôlles, Cours/TD). */
  isCpge?: boolean;
  /** Default UI language ("fr" | "en" | "es" | "pt"). Users can also switch it live. */
  locale?: SubjectLocale;
  /** Language/level context injected into the "Copier pour Gemini" prompt (e.g. "en physique"). */
  aiContext?: string;
  /** Prefix for localStorage keys. Defaults to `fa_subject_${slug}`. */
  storagePrefix?: string;
  /** Default daily exercise goal (1–30). Defaults to 5. */
  dailyGoalDefault?: number;
  /** Motivational phrases rotated daily in the Practice sidebar. */
  phrases?: string[];
  /** Feature toggles for this subject. */
  features: SubjectFeatures;
  /** Chapters and their exercises. */
  chapters: SubjectChapter[];
  /** Optional frozen #NNN order of exercise IDs (like numbering.ts in Maths). */
  numberingOrder?: string[];
  /** Optional external hints map (exerciseId -> string[]). Merged with inline exercise.hints. */
  hints?: Record<string, string[]>;
  /** Optional external answers map (exerciseId -> string). Merged with inline exercise.answer. */
  answers?: Record<string, string>;
  /** Optional formula sheet sections. */
  formulaire?: FormulaireSection[];
  /** Optional homework / assignments. */
  assignments?: SubjectAssignment[];
  /** Optional bonus sheets with answers. */
  bonusSheets?: SubjectBonusSheet[];
  /** Optional Google Drive resource documents. */
  resourceDocs?: SubjectDoc[];
  /** Optional Google Drive folder URL. */
  driveFolderUrl?: string;
  /** Optional CPGE khôlle weeks. */
  kholleWeeks?: KholleWeek[];
  /** Optional CPGE khôlle note banner. */
  kholleNote?: string;
}
