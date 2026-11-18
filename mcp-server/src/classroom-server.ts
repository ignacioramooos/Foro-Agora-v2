import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  findClassroomChapter,
  findClassroomExercise,
  formatClassroomExerciseMarkdown,
  getClassroomDailyWorkout,
  loadClassroomDb,
  loadClassroomManifest,
  searchClassroomExercises,
  type ClassroomDb,
} from "./classroom.js";

/**
 * Builds an MCP server scoped to a specific Foro Agora Classroom slug,
 * or to all public classrooms when `slug === "all"`.
 */
export function createClassroomMcpServer(slug: string): {
  server: McpServer;
  serverName: string;
} {
  const isAll = slug === "all";
  const serverName = isAll ? "foroagora-classroom" : `foroagora-classroom-${slug}`;
  const server = new McpServer({
    name: serverName,
    version: "1.0.0",
  });

  const getDb = (requestedSlug?: string): ClassroomDb => {
    const target = isAll ? requestedSlug : slug;
    if (!target) {
      throw new Error("Missing 'classroom' slug parameter.");
    }
    return loadClassroomDb(target);
  };

  server.tool(
    "list_classrooms",
    "List all available public Foro Agora Classrooms with chapter counts, exercise counts, and links.",
    {},
    async () => {
      const manifest = loadClassroomManifest();
      if (manifest.length === 0) {
        return { content: [{ type: "text", text: "No public classrooms exported yet." }] };
      }
      let md = `# Foro Agora Classrooms\n\n`;
      for (const c of manifest) {
        md += `- **${c.fullName}** (\`${c.slug}\`) — ${c.chaptersCount} chapters, ${c.exercisesCount} exercises · ${c.url}\n`;
        if (c.description) md += `  ${c.description}\n`;
      }
      return { content: [{ type: "text", text: md }] };
    },
  );

  const slugParam = isAll
    ? { classroom: z.string().describe("Classroom slug (e.g. 'maths', 'modele')") }
    : { classroom: z.string().optional().describe(`Classroom slug (defaults to '${slug}')`) };

  server.tool(
    "list_chapters",
    "List all chapters in the classroom with summaries and exercise counts.",
    slugParam,
    async ({ classroom }) => {
      const db = getDb(classroom);
      let md = `# ${db.fullName}\n\n${db.description}\n\n`;
      for (const c of db.chapters) {
        md += `## Chapter ${c.number}: ${c.title}\n`;
        if (c.summary) md += `${c.summary}\n`;
        md += `- Exercises: ${c.exercisesCount}\n`;
        md += `- Link: https://foroagora.org/classroom/${db.slug}/chapitre/${c.id}\n\n`;
      }
      return { content: [{ type: "text", text: md }] };
    },
  );

  server.tool(
    "get_chapter",
    "Get details of a chapter and list its exercises with public #NNN IDs and optional full LaTeX statements.",
    {
      ...slugParam,
      chapter: z.union([z.number(), z.string()]).describe("Chapter number (1, 2, ...) or ID"),
      include_statements: z.boolean().optional().default(false).describe("Include full LaTeX statements"),
    },
    async ({ classroom, chapter, include_statements }) => {
      const db = getDb(classroom);
      const ch = findClassroomChapter(db, chapter);
      if (!ch) {
        return {
          content: [{ type: "text", text: `Chapter '${chapter}' not found in classroom '${db.slug}'.` }],
          isError: true,
        };
      }
      const exs = db.exercises.filter((e) => e.chapterNumber === ch.number);
      let md = `# Chapter ${ch.number}: ${ch.title}\n\n${ch.summary}\n\n`;
      for (const e of exs) {
        if (include_statements) {
          md += `${formatClassroomExerciseMarkdown(e, { includeHints: true })}\n---\n\n`;
        } else {
          md += `- **${e.formattedUid}** (\`${e.id}\`, ${e.source} n°${e.number}) — ${e.url}\n`;
        }
      }
      return { content: [{ type: "text", text: md }] };
    },
  );

  server.tool(
    "get_exercise",
    "Retrieve an exercise by public number (e.g. 14 or '#014') or internal ID.",
    {
      ...slugParam,
      identifier: z.union([z.number(), z.string()]).describe("Public #NNN or internal exercise ID"),
      include_hints: z.boolean().optional().default(true),
      include_answer: z.boolean().optional().default(false),
    },
    async ({ classroom, identifier, include_hints, include_answer }) => {
      const db = getDb(classroom);
      const ex = findClassroomExercise(db, identifier);
      if (!ex) {
        return {
          content: [{ type: "text", text: `Exercise '${identifier}' not found in classroom '${db.slug}'.` }],
          isError: true,
        };
      }
      return {
        content: [
          {
            type: "text",
            text: formatClassroomExerciseMarkdown(ex, {
              includeHints: include_hints,
              includeAnswer: include_answer,
            }),
          },
        ],
      };
    },
  );

  server.tool(
    "search_exercises",
    "Search exercises in a classroom by keywords, theorem names, or IDs.",
    {
      ...slugParam,
      query: z.string().describe("Search query"),
      chapter: z.number().optional().describe("Optional chapter number filter"),
      source: z.string().optional().describe("Optional source filter (td, cours, exo, dm, bonus)"),
      limit: z.number().optional().default(10).describe("Maximum results"),
    },
    async ({ classroom, query, chapter, source, limit }) => {
      const db = getDb(classroom);
      const results = searchClassroomExercises(db, query, { chapter, source, limit });
      if (results.length === 0) {
        return { content: [{ type: "text", text: `No exercises matched '${query}' in '${db.slug}'.` }] };
      }
      const md = results
        .map((e) => formatClassroomExerciseMarkdown(e, { includeHints: false }))
        .join("\n---\n\n");
      return { content: [{ type: "text", text: md }] };
    },
  );

  server.tool(
    "get_daily_workout",
    "Get the deterministic daily exercise set for a classroom.",
    {
      ...slugParam,
      date: z.string().optional().describe("Optional YYYY-MM-DD date (defaults to today in Europe/Paris)"),
      chapter: z.number().optional().describe("Optional chapter number filter"),
    },
    async ({ classroom, date, chapter }) => {
      const db = getDb(classroom);
      const workout = getClassroomDailyWorkout(db, date, chapter);
      let md = `# Daily Workout (${workout.date}) — ${db.fullName}\n\n`;
      md += workout.exercises
        .map((e) => formatClassroomExerciseMarkdown(e, { includeHints: true }))
        .join("\n---\n\n");
      return { content: [{ type: "text", text: md }] };
    },
  );

  server.tool(
    "get_formulaire",
    "Retrieve the formula sheets / flashcards for the classroom.",
    slugParam,
    async ({ classroom }) => {
      const db = getDb(classroom);
      if (db.formulaire.length === 0) {
        return { content: [{ type: "text", text: `No formula sheet defined for '${db.slug}'.` }] };
      }
      let md = `# Formulaire — ${db.fullName}\n\n`;
      for (const section of db.formulaire) {
        md += `## ${section.title}\n`;
        for (const item of section.items) {
          md += `- **${item.name}**: ${item.tex}\n`;
        }
        md += "\n";
      }
      return { content: [{ type: "text", text: md }] };
    },
  );

  server.tool(
    "get_classroom_stats",
    "Return overview statistics and links for the classroom.",
    slugParam,
    async ({ classroom }) => {
      const db = getDb(classroom);
      const stats = {
        slug: db.slug,
        fullName: db.fullName,
        professor: db.professor,
        institution: db.institution,
        level: db.level,
        locale: db.locale,
        chaptersCount: db.chapters.length,
        exercisesCount: db.exercises.length,
        formulaeCount: db.formulaire.reduce((sum, s) => sum + s.items.length, 0),
        webUrl: `https://foroagora.org/classroom/${db.slug}`,
      };
      return { content: [{ type: "text", text: JSON.stringify(stats, null, 2) }] };
    },
  );

  return { server, serverName };
}
