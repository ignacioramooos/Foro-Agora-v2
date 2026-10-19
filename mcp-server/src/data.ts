import type { MathChapter, MathExercise } from "../../src/content/math/types.js";
import c1 from "../../src/content/math/chapters/chapitre-1.js";
import c2 from "../../src/content/math/chapters/chapitre-2.js";
import c3 from "../../src/content/math/chapters/chapitre-3.js";
import c4 from "../../src/content/math/chapters/chapitre-4.js";
import c5 from "../../src/content/math/chapters/chapitre-5.js";
import c6 from "../../src/content/math/chapters/chapitre-6.js";
import c7 from "../../src/content/math/chapters/chapitre-7.js";
import c8 from "../../src/content/math/chapters/chapitre-8.js";
import { devoirs, type Devoir } from "../../src/content/math/dm.js";
import { kholleWeeks, KHOLLE_NOTE, type KholleWeek } from "../../src/content/math/kholles.js";
import {
  DRIVE_FOLDER_URL,
  coursDocs,
  tdDocs,
  resourceDocs,
  drivePreviewUrl,
  driveViewUrl,
  type DriveDoc,
} from "../../src/content/math/documents.js";

export {
  DRIVE_FOLDER_URL,
  coursDocs,
  tdDocs,
  resourceDocs,
  drivePreviewUrl,
  driveViewUrl,
  kholleWeeks,
  KHOLLE_NOTE,
  devoirs,
};
export type { MathChapter, MathExercise, Devoir, KholleWeek, DriveDoc };

export const chapters: MathChapter[] = [c1, c2, c3, c4, c5, c6, c7, c8].sort(
  (a, b) => a.number - b.number,
);

export interface IndexedExercise extends MathExercise {
  uid: number;
  formattedUid: string;
  source: "cours" | "td" | "dm";
  url: string;
  chapter: {
    id: string;
    number: number;
    title: string;
  };
  dmId?: string;
}

/** Frozen registry mapping stable exercise ID to public #NNN UID. NEVER reorder or reuse. */
export const FROZEN_REGISTRY: Record<string, number> = {
  "ch1-cours-ex1": 1,
  "ch1-cours-ex2": 2,
  "ch1-cours-ex3": 3,
  "ch1-cours-ex4": 4,
  "ch1-cours-ex5": 5,
  "ch1-cours-ex6": 6,
  "ch1-cours-ex7": 7,
  "ch1-cours-ex8": 8,
  "ch1-cours-ex9": 9,
  "ch1-cours-ex10": 10,
  "ch1-cours-ex11": 11,
  "ch1-cours-ex12": 12,
  "ch1-cours-ex13": 13,
  "ch1-cours-ex14": 14,
  "ch1-cours-ex15": 15,
  "ch1-cours-ex16": 16,
  "ch1-cours-ex17": 17,
  "ch1-cours-ex18": 18,
  "ch1-cours-ex19": 19,
  "ch1-cours-ex20": 20,
  "ch1-cours-ex21": 21,
  "ch1-ex1": 22,
  "ch1-ex2": 23,
  "ch1-ex3": 24,
  "ch1-ex4": 25,
  "ch1-ex5": 26,
  "ch1-ex6": 27,
  "ch1-ex7": 28,
  "ch1-ex8": 29,
  "ch1-ex9": 30,
  "ch1-ex10": 31,
  "ch1-ex11": 32,
  "ch1-ex12": 33,
  "ch1-ex13": 34,
  "ch1-ex14": 35,
  "ch1-ex15": 36,
  "ch1-ex16": 37,
  "ch1-ex17": 38,
  "ch2-cours-ex1": 39,
  "ch2-cours-ex2": 40,
  "ch2-cours-ex3": 41,
  "ch2-cours-ex4": 42,
  "ch2-cours-ex5": 43,
  "ch2-cours-ex6": 44,
  "ch2-cours-ex7": 45,
  "ch2-cours-ex8": 46,
  "ch2-cours-ex9": 47,
  "ch2-cours-ex10": 48,
  "ch2-cours-ex11": 49,
  "ch2-cours-ex12": 50,
  "ch2-cours-ex13": 51,
  "ch2-cours-ex14": 52,
  "ch2-cours-ex15": 53,
  "ch2-cours-ex16": 54,
  "ch2-cours-ex17": 55,
  "ch2-cours-ex18": 56,
  "ch2-cours-ex19": 57,
  "ch2-cours-ex20": 58,
  "ch2-cours-ex21": 59,
  "ch2-cours-ex22": 60,
  "ch2-cours-ex23": 61,
  "ch2-cours-ex24": 62,
  "ch2-cours-ex25": 63,
  "ch2-cours-ex26": 64,
  "ch2-cours-ex27": 65,
  "ch2-cours-ex28": 66,
  "ch2-cours-ex29": 67,
  "ch2-ex1": 68,
  "ch2-ex2": 69,
  "ch2-ex3": 70,
  "ch2-ex4": 71,
  "ch2-ex5": 72,
  "ch2-ex6": 73,
  "ch2-ex7": 74,
  "ch2-ex8": 75,
  "ch2-ex9": 76,
  "ch2-ex10": 77,
  "ch2-ex11": 78,
  "ch2-ex12": 79,
  "ch2-ex13": 80,
  "ch2-ex14": 81,
  "ch2-ex15": 82,
  "ch3-cours-ex1": 83,
  "ch3-cours-ex2": 84,
  "ch3-ex1": 85,
  "ch3-ex2": 86,
  "ch3-ex3": 87,
  "ch3-ex4": 88,
  "ch3-ex5": 89,
  "ch3-ex6": 90,
  "ch3-ex7": 91,
  "ch4-cours-ex1": 92,
  "ch4-cours-ex2": 93,
  "ch4-cours-ex3": 94,
  "ch4-cours-ex4": 95,
  "ch4-cours-ex5": 96,
  "ch4-cours-ex6": 97,
  "ch4-cours-ex7": 98,
  "ch4-cours-ex8": 99,
  "ch4-cours-ex9": 100,
  "ch4-cours-ex10": 101,
  "ch4-cours-ex11": 102,
  "ch4-cours-ex12": 103,
  "ch4-cours-ex13": 104,
  "ch4-cours-ex14": 105,
  "ch4-cours-ex15": 106,
  "ch4-cours-ex16": 107,
  "ch4-ex1": 108,
  "ch4-ex2": 109,
  "ch4-ex3": 110,
  "ch4-ex4": 111,
  "ch4-ex5": 112,
  "ch4-ex6": 113,
  "ch4-ex7": 114,
  "ch4-ex8": 115,
  "ch4-ex9": 116,
  "ch4-ex10": 117,
  "ch4-ex11": 118,
  "ch4-ex12": 119,
  "ch4-ex13": 120,
  "ch5-cours-ex1": 121,
  "ch5-cours-ex2": 122,
  "ch5-cours-ex3": 123,
  "ch5-cours-ex4": 124,
  "ch5-cours-ex5": 125,
  "ch5-cours-ex6": 126,
  "ch5-cours-ex7": 127,
  "ch5-cours-ex8": 128,
  "ch5-cours-ex9": 129,
  "ch5-cours-ex10": 130,
  "ch5-cours-ex11": 131,
  "ch5-cours-ex12": 132,
  "ch5-ex1": 133,
  "ch5-ex2": 134,
  "ch5-ex3": 135,
  "ch5-ex4": 136,
  "ch5-ex5": 137,
  "ch5-ex6": 138,
  "ch5-ex7": 139,
  "ch5-ex8": 140,
  "ch5-ex9": 141,
  "ch5-ex10": 142,
  "ch6-cours-ex1": 143,
  "ch6-cours-ex2": 144,
  "ch6-cours-ex3": 145,
  "ch6-cours-ex4": 146,
  "ch6-cours-ex5": 147,
  "ch6-cours-ex6": 148,
  "ch6-cours-ex7": 149,
  "ch6-cours-ex8": 150,
  "ch6-cours-ex9": 151,
  "ch6-cours-ex10": 152,
  "ch6-cours-ex11": 153,
  "ch6-cours-ex12": 154,
  "ch6-cours-ex13": 155,
  "ch6-cours-ex14": 156,
  "ch6-cours-ex15": 157,
  "ch6-cours-ex16": 158,
  "ch6-ex1": 159,
  "ch6-ex2": 160,
  "ch6-ex3": 161,
  "ch6-ex4": 162,
  "ch6-ex5": 163,
  "ch6-ex6": 164,
  "ch6-ex7": 165,
  "ch6-ex8": 166,
  "ch6-ex9": 167,
  "ch6-ex10": 168,
  "ch6-ex11": 169,
  "ch6-ex12": 170,
  "ch6-ex13": 171,
  "ch6-ex14": 172,
  "ch6-ex15": 173,
  "ch6-ex16": 174,
  "ch6-ex17": 175,
  "ch6-ex18": 176,
  "ch6-ex19": 177,
  "dm1-q1": 178,
  "dm1-q2": 179,
  "dm1-q3": 180,
  "dm1-q4": 181,
  "dm2-e1q1": 182,
  "dm2-e1q2": 183,
  "dm2-e1q3": 184,
  "dm2-e2q1": 185,
  "dm2-e2q2": 186,
  "ch7-cours-ex1": 187,
  "ch7-cours-ex2": 188,
  "ch7-cours-ex3": 189,
  "ch7-ex1": 190,
  "ch7-ex2": 191,
  "ch7-ex3": 192,
  "ch7-ex4": 193,
  "ch7-ex5": 194,
  "ch7-ex6": 195,
  "ch7-ex7": 196,
  "ch7-ex8": 197,
  "ch7-ex9": 198,
  "ch7-ex10": 199,
  "ch7-ex11": 200,
  "ch7-ex12": 201,
  "ch7-ex13": 202,
  "ch8-cours-ex1": 203,
  "ch8-cours-ex2": 204,
  "ch8-cours-ex3": 205,
  "ch8-cours-ex4": 206,
  "ch8-cours-ex5": 207,
  "ch8-cours-ex6": 208,
  "ch8-cours-ex7": 209,
  "ch8-cours-ex8": 210,
  "ch8-cours-ex9": 211,
  "ch8-cours-ex10": 212,
  "ch8-cours-ex11": 213,
  "ch8-cours-ex12": 214,
  "ch8-cours-ex13": 215,
  "ch8-cours-ex14": 216,
  "ch8-cours-ex15": 217,
  "ch8-cours-ex16": 218,
  "ch8-cours-ex17": 219,
  "ch8-cours-ex18": 220,
  "ch8-cours-ex19": 221,
  "ch8-cours-ex20": 222,
  "ch8-cours-ex21": 223,
  "ch8-ex1": 224,
  "ch8-ex2": 225,
  "ch8-ex3": 226,
  "ch8-ex4": 227,
  "ch8-ex5": 228,
  "ch8-ex6": 229,
  "ch8-ex7": 230,
  "ch8-ex8": 231,
  "ch8-ex9": 232,
  "ch8-ex10": 233,
  "ch8-ex11": 234,
  "ch8-ex12": 235,
  "ch8-ex13": 236,
  "ch8-ex14": 237,
  "ch8-ex15": 238,
  "ch8-ex16": 239,
  "ch8-ex17": 240,
  "ch8-ex18": 241,
  "ch8-ex19": 242,
  "ch8-ex20": 243,
  "dm3-q1": 244,
  "dm3-q2": 245,
  "dm3-q3": 246,
  "dm3-q4": 247,
};

// Build all exercises
const chapterExercises: IndexedExercise[] = chapters.flatMap((chapter) =>
  chapter.exercises.map((e) => {
    const src: "cours" | "td" = e.source === "cours" ? "cours" : "td";
    const uid = FROZEN_REGISTRY[e.id] ?? 999;
    return {
      ...e,
      source: src,
      uid,
      formattedUid: `#${String(uid).padStart(3, "0")}`,
      url: `https://foroagora.org/maths/exo/${uid}`,
      chapter: {
        id: chapter.id,
        number: chapter.number,
        title: chapter.title,
      },
    };
  }),
);

const dmExercises: IndexedExercise[] = devoirs.flatMap((d) => {
  const chapter = chapters.find((c) => c.number === d.chapter) ?? chapters[0];
  return d.questions.map((q) => {
    const uid = FROZEN_REGISTRY[q.id] ?? 999;
    return {
      ...q,
      source: "dm" as const,
      dmId: d.id,
      uid,
      formattedUid: `#${String(uid).padStart(3, "0")}`,
      url: `https://foroagora.org/maths/exo/${uid}`,
      chapter: {
        id: chapter.id,
        number: chapter.number,
        title: chapter.title,
      },
    };
  });
});

export const allExercises: IndexedExercise[] = [...chapterExercises, ...dmExercises].sort(
  (a, b) => a.uid - b.uid,
);

export const getChapter = (identifier: string | number): MathChapter | undefined => {
  if (typeof identifier === "number" || /^\d+$/.test(String(identifier))) {
    const n = Number(identifier);
    return chapters.find((c) => c.number === n);
  }
  const clean = String(identifier).trim().toLowerCase();
  return chapters.find((c) => c.id === clean || c.id === `chapitre-${clean}`);
};

export const getExercise = (identifier: string | number): IndexedExercise | undefined => {
  if (typeof identifier === "number") {
    return allExercises.find((e) => e.uid === identifier);
  }
  const raw = String(identifier).trim();
  const clean = raw.replace(/^#/, "");
  if (/^\d+$/.test(clean)) {
    const uid = parseInt(clean, 10);
    return allExercises.find((e) => e.uid === uid);
  }
  return allExercises.find((e) => e.id.toLowerCase() === raw.toLowerCase());
};

const stripAccents = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export interface SearchOptions {
  chapter?: number;
  source?: "cours" | "td" | "dm";
  limit?: number;
}

export const searchExercises = (
  query: string,
  options: SearchOptions = {},
): IndexedExercise[] => {
  const { chapter, source, limit = 20 } = options;
  const rawQuery = query.trim();
  const cleanQuery = stripAccents(rawQuery).replace(/^#/, "");

  let list = allExercises;

  if (chapter !== undefined) {
    list = list.filter((e) => e.chapter.number === chapter);
  }

  if (source !== undefined) {
    list = list.filter((e) => e.source === source);
  }

  if (!cleanQuery) {
    return list.slice(0, limit);
  }

  // Exact UID lookup
  if (/^\d+$/.test(cleanQuery)) {
    const uid = parseInt(cleanQuery, 10);
    const exact = list.filter((e) => e.uid === uid);
    if (exact.length) return exact;
  }

  const terms = cleanQuery.split(/\s+/).filter(Boolean);

  const scored = list
    .map((e) => {
      const srcText = e.source === "cours" ? "cours" : e.source === "dm" ? "dm" : "td";
      const haystack = stripAccents(
        `${e.statement} ${e.chapter.title} chapitre ${e.chapter.number} chap ${e.chapter.number} ${srcText} exercice ${e.number} ${e.formattedUid} ${e.id}`,
      );

      const matchesAll = terms.every((t) => haystack.includes(t));
      if (!matchesAll) return null;

      // Simple scoring: title match or number match ranks higher
      let score = 0;
      if (terms.some((t) => e.statement.toLowerCase().includes(t))) score += 10;
      if (terms.some((t) => e.chapter.title.toLowerCase().includes(t))) score += 5;
      return { exercise: e, score };
    })
    .filter((item): item is { exercise: IndexedExercise; score: number } => item !== null)
    .sort((a, b) => b.score - a.score || a.exercise.uid - b.exercise.uid);

  return scored.slice(0, limit).map((s) => s.exercise);
};

export const getDm = (idOrNumber: string | number): Devoir | undefined => {
  const str = String(idOrNumber).trim().toLowerCase();
  const num = str.replace(/^dm-?/, "");
  return devoirs.find((d) => d.id === str || d.id === `dm-${str}` || d.id === `dm-${num}`);
};

export const getKholle = (idOrDate: string): KholleWeek | undefined => {
  const str = idOrDate.trim().toLowerCase();
  return kholleWeeks.find((k) => k.id === str || k.start === str);
};

/** Seeded PRNG for deterministic daily pool matching Foro Agora website */
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

const seededShuffle = <T>(items: T[], seed: string): T[] => {
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

export const getDailyWorkout = (
  date = parisDateString(),
  chapterId: string | number | "all" = "all",
  count = 5,
): IndexedExercise[] => {
  let pool: IndexedExercise[];
  if (chapterId === "all") {
    pool = allExercises;
  } else {
    const chap = getChapter(chapterId);
    pool = chap ? allExercises.filter((e) => e.chapter.id === chap.id) : allExercises;
  }
  const shuffled = seededShuffle(pool, `${date}:${chapterId}`);
  return shuffled.slice(0, count);
};

export const getMathStats = () => {
  const totalExercises = allExercises.length;
  const coursExercises = allExercises.filter((e) => e.source === "cours").length;
  const tdExercises = allExercises.filter((e) => e.source === "td").length;
  const dmExercisesCount = allExercises.filter((e) => e.source === "dm").length;

  return {
    curriculum: "MPSI / Math Sup (Classes Préparatoires aux Grandes Écoles)",
    institution: "Foro Ágora (foroagora.org/maths)",
    totalChapters: chapters.length,
    totalExercises,
    breakdown: {
      coursExercises,
      tdExercises,
      dmExercises: dmExercisesCount,
    },
    totalDms: devoirs.length,
    totalKholleWeeks: kholleWeeks.length,
    totalDriveDocuments:
      Object.keys(coursDocs).length + Object.keys(tdDocs).length + resourceDocs.length,
    chapters: chapters.map((c) => ({
      number: c.number,
      title: c.title,
      exerciseCount: c.exercises.length,
    })),
  };
};
