import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface ClassroomChapterData {
  id: string;
  number: number;
  title: string;
  summary: string;
  exercisesCount: number;
}

export interface ClassroomExerciseData {
  uid: number;
  formattedUid: string;
  id: string;
  number: string;
  source: string;
  chapterNumber: number;
  chapterTitle: string;
  statement: string;
  hints?: string[];
  answer?: string;
  url: string;
}

export interface ClassroomFormulaireSection {
  id: string;
  title: string;
  items: Array<{ id: string; name: string; tex: string }>;
}

export interface ClassroomDb {
  slug: string;
  name: string;
  fullName: string;
  description: string;
  professor?: string;
  institution?: string;
  level?: string;
  locale: string;
  chapters: ClassroomChapterData[];
  exercises: ClassroomExerciseData[];
  formulaire: ClassroomFormulaireSection[];
}

export interface ClassroomManifestEntry {
  slug: string;
  name: string;
  fullName: string;
  description: string;
  professor?: string;
  institution?: string;
  level?: string;
  locale: string;
  chaptersCount: number;
  exercisesCount: number;
  url: string;
  dbUrl: string;
}

const stripAccents = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

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

export const seededShuffle = <T>(items: T[], seed: string): T[] => {
  const rand = seededRandom(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export const parisDateString = (d = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(d);

function resolveClassroomsDir(): string {
  const candidates = [
    path.resolve(process.cwd(), "public/classrooms"),
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../public/classrooms"),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  throw new Error(
    "Could not locate public/classrooms/. Run `npm run export:classrooms` from the repository root.",
  );
}

export function loadClassroomManifest(): ClassroomManifestEntry[] {
  const dir = resolveClassroomsDir();
  const indexPath = path.join(dir, "index.json");
  if (!fs.existsSync(indexPath)) return [];
  const parsed = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  return parsed.classrooms ?? [];
}

export function loadClassroomDb(slug: string): ClassroomDb {
  const dir = resolveClassroomsDir();
  const filePath = path.join(dir, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Classroom '${slug}' not found in ${dir}.`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as ClassroomDb;
}

export function findClassroomChapter(db: ClassroomDb, chapter: string | number) {
  if (typeof chapter === "number") {
    return db.chapters.find((c) => c.number === chapter);
  }
  const normalized = String(chapter).trim().toLowerCase();
  const num = parseInt(normalized.replace(/^chapitre-/, ""), 10);
  return db.chapters.find(
    (c) => c.id.toLowerCase() === normalized || (!Number.isNaN(num) && c.number === num),
  );
}

export function findClassroomExercise(db: ClassroomDb, identifier: string | number) {
  if (typeof identifier === "number") {
    return db.exercises.find((e) => e.uid === identifier);
  }
  const raw = String(identifier).trim();
  const numMatch = raw.match(/^#?(\d+)$/);
  if (numMatch) {
    const uid = parseInt(numMatch[1], 10);
    return db.exercises.find((e) => e.uid === uid);
  }
  return db.exercises.find((e) => e.id.toLowerCase() === raw.toLowerCase());
}

export function searchClassroomExercises(
  db: ClassroomDb,
  query: string,
  options: { chapter?: number; source?: string; limit?: number } = {},
) {
  const { chapter, source, limit = 10 } = options;
  const terms = stripAccents(query)
    .split(/\s+/)
    .filter((t) => t.length > 0);

  let pool = db.exercises;
  if (chapter !== undefined) pool = pool.filter((e) => e.chapterNumber === chapter);
  if (source !== undefined) pool = pool.filter((e) => e.source === source);

  if (terms.length === 0) return pool.slice(0, limit);

  const scored = pool
    .map((e) => {
      const hay = stripAccents(
        `${e.formattedUid} ${e.id} ${e.chapterTitle} ${e.statement} ${(e.hints ?? []).join(" ")}`,
      );
      let score = 0;
      for (const t of terms) {
        if (hay.includes(t)) score += 1;
      }
      if (terms.some((t) => e.id.toLowerCase() === t || e.formattedUid.toLowerCase() === t)) {
        score += 10;
      }
      return { e, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.e.uid - b.e.uid);

  return scored.slice(0, limit).map((x) => x.e);
}

export function getClassroomDailyWorkout(
  db: ClassroomDb,
  date?: string,
  chapter?: number,
  count = 5,
) {
  const targetDate = date || parisDateString();
  const pool =
    chapter !== undefined
      ? db.exercises.filter((e) => e.chapterNumber === chapter && e.source !== "exemple")
      : db.exercises.filter((e) => e.source !== "exemple");
  const fallbackPool = pool.length > 0 ? pool : db.exercises;
  const exercises = seededShuffle(fallbackPool, `${db.slug}:${targetDate}`).slice(0, count);
  return { date: targetDate, exercises };
}

export function formatClassroomExerciseMarkdown(
  e: ClassroomExerciseData,
  options: { includeHints?: boolean; includeAnswer?: boolean } = {},
) {
  let out = `### Exercise ${e.formattedUid} (Chapitre ${e.chapterNumber} — ${e.source.toUpperCase()} n°${e.number})\n`;
  out += `- **Internal ID**: \`${e.id}\`\n`;
  out += `- **Chapter**: ${e.chapterNumber}. ${e.chapterTitle}\n`;
  out += `- **Web Link**: ${e.url}\n\n`;
  out += `**Statement:**\n\n${e.statement}\n`;
  if (options.includeHints && e.hints?.length) {
    out += `\n**Hints:**\n${e.hints.map((h, i) => `${i + 1}. ${h}`).join("\n")}\n`;
  }
  if (options.includeAnswer && e.answer) {
    out += `\n**Answer:**\n\n${e.answer}\n`;
  }
  return out;
}
