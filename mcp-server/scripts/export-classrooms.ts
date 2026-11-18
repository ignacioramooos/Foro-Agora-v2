import fs from "node:fs";
import path from "node:path";
import { classrooms, getSubjectIndex } from "../../src/content/subjects/registry";
import { formulaire as mathFormulaire } from "../../src/content/math/formulaire";
import { hints as mathHints } from "../../src/content/math/hints";

const outDir = path.resolve(process.cwd(), "public/classrooms");
fs.mkdirSync(outDir, { recursive: true });

interface ExportedClassroomPayload {
  slug: string;
  name: string;
  fullName: string;
  description: string;
  professor?: string;
  institution?: string;
  level?: string;
  locale: string;
  chapters: Array<{
    id: string;
    number: number;
    title: string;
    summary: string;
    exercisesCount: number;
  }>;
  exercises: Array<{
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
  }>;
  formulaire: Array<{
    id: string;
    title: string;
    items: Array<{ id: string; name: string; tex: string }>;
  }>;
}

async function main() {
  const manifest: Array<{
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
  }> = [];

  for (const summary of classrooms) {
    const isPrivate = summary.access && summary.access.mode !== "public";
    if (isPrivate) {
      // Never export private classroom payloads to public static JSON.
      continue;
    }

    let payload: ExportedClassroomPayload | null = null;

    if (summary.slug === "maths") {
      // Maths uses Vite's import.meta.glob and is already exported to public/math-db.json by export.ts.
      const mathDbPath = path.resolve(process.cwd(), "public/math-db.json");
      if (fs.existsSync(mathDbPath)) {
        const mathDb = JSON.parse(fs.readFileSync(mathDbPath, "utf8"));
        payload = {
          slug: "maths",
          name: summary.name,
          fullName: summary.fullName,
          description: summary.description,
          professor: summary.professor,
          institution: summary.institution,
          level: summary.level,
          locale: summary.locale ?? "fr",
          chapters: (mathDb.chapters ?? []).map((c: any) => ({
            id: c.id,
            number: c.number,
            title: c.title,
            summary: c.summary,
            exercisesCount: c.exercises?.length ?? 0,
          })),
          exercises: (mathDb.allExercises ?? []).map((e: any) => ({
            uid: e.uid,
            formattedUid: e.formattedUid,
            id: e.id,
            number: String(e.number ?? ""),
            source: e.source ?? "td",
            chapterNumber: e.chapter?.number ?? 0,
            chapterTitle: e.chapter?.title ?? "",
            statement: e.statement ?? "",
            hints: mathHints[e.id] ? [...mathHints[e.id]] : undefined,
            answer: e.answer,
            url: `https://foroagora.org/classroom/maths/exo/${e.uid}`,
          })),
          formulaire: mathFormulaire,
        };
      }
    } else {
      const subject = await summary.load();
      const index = getSubjectIndex(subject);
      payload = {
        slug: subject.slug,
        name: subject.name,
        fullName: subject.fullName,
        description: subject.description,
        professor: subject.professor,
        institution: subject.institution,
        level: subject.level,
        locale: subject.locale ?? "fr",
        chapters: index.chapters.map((c) => ({
          id: c.id,
          number: c.number,
          title: c.title,
          summary: c.summary,
          exercisesCount: c.exercises.length,
        })),
        exercises: index.indexedExercises.map((e) => ({
          uid: e.uid,
          formattedUid: e.formattedUid,
          id: e.id,
          number: e.number,
          source: e.source,
          chapterNumber: e.chapter.number,
          chapterTitle: e.chapter.title,
          statement: e.statement,
          hints: e.hints,
          answer: e.answer,
          url: `https://foroagora.org/classroom/${subject.slug}/exo/${e.uid}`,
        })),
        formulaire: subject.formulaire ?? [],
      };
    }

    if (!payload) continue;

    fs.writeFileSync(path.join(outDir, `${payload.slug}.json`), JSON.stringify(payload));
    manifest.push({
      slug: payload.slug,
      name: payload.name,
      fullName: payload.fullName,
      description: payload.description,
      professor: payload.professor,
      institution: payload.institution,
      level: payload.level,
      locale: payload.locale,
      chaptersCount: payload.chapters.length,
      exercisesCount: payload.exercises.length,
      url: `https://foroagora.org/classroom/${payload.slug}`,
      dbUrl: `/classrooms/${payload.slug}.json`,
    });
  }

  fs.writeFileSync(path.join(outDir, "index.json"), JSON.stringify({ classrooms: manifest }, null, 2));
  console.log(`Exported ${manifest.length} public classroom(s) to public/classrooms/.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
