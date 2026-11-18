import { chapters as mathChapters } from "@/content/math";
import { bonusAnswers, bonusSheets } from "@/content/math/bonus";
import { devoirs } from "@/content/math/dm";
import { coursDocs, DRIVE_FOLDER_URL, resourceDocs, tdDocs } from "@/content/math/documents";
import { formulaire } from "@/content/math/formulaire";
import { hints } from "@/content/math/hints";
import { kholleWeeks, KHOLLE_NOTE } from "@/content/math/kholles";
import { indexedExercises } from "@/content/math/numbering";
import type { SubjectConfig } from "./types";

export const mathUidMap: Record<string, number> = Object.fromEntries(
  indexedExercises.map((e) => [e.id, e.uid]),
);

export const mathsSubject: SubjectConfig = {
  slug: "maths",
  name: "Maths",
  fullName: "Mathématiques — MPSI",
  description: "Banque d'exercices de mathématiques (cours, exemples, TD, DM, khôlles et formulaire).",
  professor: "Foro Agora",
  institution: "CPGE MPSI",
  level: "CPGE MPSI",
  isCpge: true,
  locale: "fr",
  // French-only classroom: never translated, no language switch.
  lockLocale: true,
  aiContext: "en MPSI en mathématiques",
  storagePrefix: "fa_math",
  dailyGoalDefault: 5,
  features: {
    calculator: true,
    coursTdSplit: true,
    kholles: true,
    kholleSimulator: true,
    formulaire: true,
    assignments: true,
    resources: true,
    printableSheet: true,
    aiPrompt: true,
  },
  chapters: mathChapters.map((c) => ({
    id: c.id,
    number: c.number,
    title: c.title,
    summary: c.summary,
    notes: c.notes,
    docs: {
      cours: coursDocs[c.number],
      td: tdDocs[c.number],
    },
    exercises: c.exercises,
  })),
  hints,
  answers: bonusAnswers,
  formulaire,
  assignments: devoirs,
  bonusSheets,
  resourceDocs,
  driveFolderUrl: DRIVE_FOLDER_URL,
  kholleWeeks,
  kholleNote: KHOLLE_NOTE,
  uidMap: mathUidMap,
};
