import type { SubjectChapter, SubjectConfig, SubjectExercise } from "./types";

export interface SubjectExerciseWithChapter extends SubjectExercise {
  chapter: SubjectChapter;
}

export interface IndexedSubjectExercise extends SubjectExerciseWithChapter {
  uid: number;
}

export interface SubjectIndex {
  chapters: SubjectChapter[];
  allExercises: SubjectExerciseWithChapter[];
  indexedExercises: IndexedSubjectExercise[];
  exerciseUid: (id: string) => number;
  formatUid: (id: string) => string;
  getExerciseByUid: (uid: number) => IndexedSubjectExercise | undefined;
  getChapter: (id: string) => SubjectChapter | undefined;
  dmIdFor: (exerciseId: string) => string | undefined;
  bonusSheetIdFor: (exerciseId: string) => string | undefined;
  getHints: (exerciseId: string) => string[] | undefined;
  getAnswer: (exerciseId: string) => string | undefined;
  searchExercises: (query: string) => IndexedSubjectExercise[];
  dailyPool: (chapterId: string | "all", day: string, completedIds?: Set<string>) => SubjectExerciseWithChapter[];
}

export const DEFAULT_PHRASES = [
  "La régularité bat le talent.",
  "Un exercice à la fois.",
  "Se tromper, c'est aussi s'entraîner.",
  "Ce qui est dur aujourd'hui sera facile demain.",
  "Cinq exercices. Tous les jours.",
  "Pas besoin d'aller vite, il faut être régulier.",
  "Comprendre vaut mieux que mémoriser.",
];

export const parisDay = (date = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(date);

const seededRandom = (seed: string) => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const seededShuffle = <T,>(items: T[], seed: string): T[] => {
  const rand = seededRandom(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export const computeStreak = (completionDates: string[], today: string) => {
  const days = new Set(completionDates.map((d) => parisDay(new Date(d))));
  const cursor = new Date(`${today}T12:00:00Z`);
  if (!days.has(today)) cursor.setUTCDate(cursor.getUTCDate() - 1);
  let streak = 0;
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
};

export const drivePreviewUrl = (id: string) => `https://drive.google.com/file/d/${id}/preview`;
export const driveViewUrl = (id: string) => `https://drive.google.com/file/d/${id}/view`;

const strip = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function buildSubjectIndex(subject: SubjectConfig, uidRegistry?: Record<string, number>): SubjectIndex {
  const chapters = [...subject.chapters].sort((a, b) => a.number - b.number);
  const allExercises: SubjectExerciseWithChapter[] = chapters.flatMap((chapter) =>
    chapter.exercises.map((e) => ({ ...e, chapter })),
  );

  const fallbackChapter = chapters[0] ?? {
    id: "general",
    number: 1,
    title: "Général",
    summary: "",
    exercises: [],
  };

  const dmExercises: SubjectExerciseWithChapter[] = (subject.assignments ?? []).flatMap((d) => {
    const chapter = chapters.find((c) => c.number === d.chapter) ?? fallbackChapter;
    return d.questions.map((q) => ({ ...q, chapter }));
  });

  const bonusExercises: SubjectExerciseWithChapter[] = (subject.bonusSheets ?? []).flatMap((b) => {
    const chapter = chapters.find((c) => c.number === b.chapter) ?? fallbackChapter;
    return b.questions.map((q) => ({ ...q, chapter }));
  });

  const combined = [...allExercises, ...dmExercises, ...bonusExercises];

  const numbers: Record<string, number> = { ...(uidRegistry ?? {}) };
  if (subject.numberingOrder) {
    subject.numberingOrder.forEach((id, idx) => {
      if (!numbers[id]) numbers[id] = idx + 1;
    });
  }
  let next = Math.max(0, ...Object.values(numbers)) + 1;
  combined.forEach((e) => {
    if (!numbers[e.id]) numbers[e.id] = next++;
  });

  const indexedExercises: IndexedSubjectExercise[] = combined
    .map((e) => ({ ...e, uid: numbers[e.id] }))
    .sort((a, b) => a.uid - b.uid);

  const hintsMap: Record<string, string[]> = { ...(subject.hints ?? {}) };
  const answersMap: Record<string, string> = { ...(subject.answers ?? {}) };
  combined.forEach((e) => {
    if (e.hints?.length && !hintsMap[e.id]) hintsMap[e.id] = e.hints;
    if (e.answer && !answersMap[e.id]) answersMap[e.id] = e.answer;
  });

  const exerciseUid = (id: string) => numbers[id];
  const formatUid = (id: string) => (numbers[id] ? `#${String(numbers[id]).padStart(3, "0")}` : "");
  const getExerciseByUid = (uid: number) => indexedExercises.find((e) => e.uid === uid);
  const getChapter = (id: string) => chapters.find((c) => c.id === id);
  const dmIdFor = (exerciseId: string) =>
    (subject.assignments ?? []).find((d) => d.questions.some((q) => q.id === exerciseId))?.id;
  const bonusSheetIdFor = (exerciseId: string) =>
    (subject.bonusSheets ?? []).find((b) => b.questions.some((q) => q.id === exerciseId))?.id;
  const getHints = (exerciseId: string) => hintsMap[exerciseId];
  const getAnswer = (exerciseId: string) => answersMap[exerciseId];

  const searchExercises = (query: string) => {
    const q = strip(query.trim()).replace(/^#/, "");
    if (!q) return indexedExercises;
    if (/^\d+$/.test(q)) {
      const n = parseInt(q, 10);
      const exact = indexedExercises.filter((e) => e.uid === n);
      if (exact.length) return exact;
    }
    const terms = q.split(/\s+/);
    return indexedExercises.filter((e) => {
      const src =
        e.source === "cours"
          ? "cours"
          : e.source === "exemple"
            ? "exemple"
            : e.source === "dm"
              ? "dm"
              : e.source === "bonus"
                ? "bonus"
                : e.source === "exo"
                  ? "exercice"
                  : "td";
      const hay = strip(
        `${e.statement} ${e.chapter.title} chapitre ${e.chapter.number} chap ${e.chapter.number} ch ${e.chapter.number} chapter ${e.chapter.number} capitulo ${e.chapter.number} cap ${e.chapter.number} ${src} exercice ${e.number} exercise ${e.number} ejercicio ${e.number} exercicio ${e.number}`,
      );
      return terms.every((t) => hay.includes(t));
    });
  };

  const dailyPool = (chapterId: string | "all", day: string, completedIds: Set<string> = new Set()) => {
    const practice = allExercises.filter((e) => e.source !== "exemple");
    const pool = chapterId === "all" ? practice : practice.filter((e) => e.chapter.id === chapterId);
    if (chapterId === "all") return seededShuffle(pool, `${subject.slug}:${day}:${chapterId}`);
    const firstIncomplete = pool.findIndex((exercise) => !completedIds.has(exercise.id));
    return firstIncomplete > 0 ? [...pool.slice(firstIncomplete), ...pool.slice(0, firstIncomplete)] : pool;
  };

  return {
    chapters,
    allExercises,
    indexedExercises,
    exerciseUid,
    formatUid,
    getExerciseByUid,
    getChapter,
    dmIdFor,
    bonusSheetIdFor,
    getHints,
    getAnswer,
    searchExercises,
    dailyPool,
  };
}
