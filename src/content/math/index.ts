import type { MathChapter, MathExercise } from "./types";

// Every file in ./chapters is picked up automatically.
const modules = import.meta.glob<{ default: MathChapter }>("./chapters/*.ts", { eager: true });

export const chapters: MathChapter[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.number - b.number);

export interface ExerciseWithChapter extends MathExercise {
  chapter: MathChapter;
}

export const allExercises: ExerciseWithChapter[] = chapters.flatMap((chapter) =>
  chapter.exercises.map((e) => ({ ...e, chapter })),
);

export const getChapter = (id: string) => chapters.find((c) => c.id === id);

/** Today's date in Paris as YYYY-MM-DD. */
export const parisDay = (date = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(date);

export const montevideoDay = parisDay;

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

/** Ordered pool for the day: daily set first, then the rest. Same for everyone on a given day. */
export const dailyPool = (chapterId: string | "all", day: string, completedIds: Set<string> = new Set()) => {
  const pool = chapterId === "all" ? allExercises : allExercises.filter((e) => e.chapter.id === chapterId);
  if (chapterId === "all") return seededShuffle(pool, `${day}:${chapterId}`);
  const firstIncomplete = pool.findIndex((exercise) => !completedIds.has(exercise.id));
  return firstIncomplete > 0 ? [...pool.slice(firstIncomplete), ...pool.slice(0, firstIncomplete)] : pool;
};

/** Consecutive days (ending today or yesterday) with at least one completion. */
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

export const DAILY_COUNT = 5;
