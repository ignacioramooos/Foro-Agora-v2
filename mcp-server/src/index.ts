import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  chapters,
  allExercises,
  getChapter,
  getExercise,
  searchExercises,
  getDailyWorkout,
  devoirs,
  getDm,
  kholleWeeks,
  getKholle,
  KHOLLE_NOTE,
  coursDocs,
  tdDocs,
  resourceDocs,
  DRIVE_FOLDER_URL,
  drivePreviewUrl,
  driveViewUrl,
  parisDateString,
  getMathStats,
  type IndexedExercise,
} from "./data.js";

const server = new McpServer({
  name: "foroagora-math",
  version: "1.0.0",
});

const formatExerciseMarkdown = (e: IndexedExercise, full = true) => {
  const typeLabel = e.source === "cours" ? "Cours" : e.source === "dm" ? "Devoir Maison" : "Travaux Dirigés (TD)";
  let out = `### Exercise ${e.formattedUid} (Chapitre ${e.chapter.number} — ${typeLabel} n°${e.number})\n`;
  out += `- **Internal ID**: \`${e.id}\`\n`;
  out += `- **Chapter**: ${e.chapter.number}. ${e.chapter.title}\n`;
  out += `- **Source Type**: ${typeLabel}\n`;
  out += `- **Web Link**: ${e.url}\n\n`;
  out += `**Énoncé :**\n\n${e.statement}\n`;
  return out;
};

// ============================================================================
// Tool 1: list_chapters
// ============================================================================
server.tool(
  "list_chapters",
  "List all 7 mathematics chapters in the CPGE (MPSI) curriculum on Foro Ágora with summaries, exercise breakdown, and Google Drive document links.",
  {},
  async () => {
    let md = `# Foro Ágora — Programme de Mathématiques (MPSI / Math Sup)\n\n`;
    md += `Accès aux 7 chapitres du cours, leurs exercices d'application (Cours) et planches de travaux dirigés (TD).\n\n`;

    for (const c of chapters) {
      const coursCount = c.exercises.filter((e) => e.source === "cours").length;
      const tdCount = c.exercises.filter((e) => e.source !== "cours" && e.source !== "dm").length;
      const coursDoc = coursDocs[c.number];
      const tdDoc = tdDocs[c.number];

      md += `## Chapitre ${c.number} : ${c.title}\n`;
      md += `- **Identifiant** : \`${c.id}\`\n`;
      md += `- **Résumé** : ${c.summary}\n`;
      md += `- **Exercices** : ${c.exercises.length} au total (${coursCount} cours, ${tdCount} TD)\n`;
      if (coursDoc) {
        md += `- **Polycopié de cours (Drive)** : [${coursDoc.title}](${driveViewUrl(coursDoc.id)})\n`;
      }
      if (tdDoc) {
        md += `- **Planche de TD (Drive)** : [${tdDoc.title}](${driveViewUrl(tdDoc.id)})\n`;
      }
      md += `\n`;
    }

    return {
      content: [
        {
          type: "text",
          text: md,
        },
      ],
    };
  },
);

// ============================================================================
// Tool 2: get_chapter
// ============================================================================
server.tool(
  "get_chapter",
  "Get full details of a specific chapter: summary, notes, Drive PDF links, and a complete listing of its exercises with public #NNN IDs.",
  {
    chapter: z
      .union([z.number(), z.string()])
      .describe("Chapter number (1 to 7) or ID ('chapitre-1', 'chapitre-2', etc.)"),
    include_statements: z
      .boolean()
      .optional()
      .default(false)
      .describe("If true, includes the complete LaTeX statements of all exercises in the chapter"),
  },
  async ({ chapter, include_statements }) => {
    const chap = getChapter(chapter);
    if (!chap) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Chapter '${chapter}' not found. Please specify a chapter number between 1 and 7, or an ID like 'chapitre-1'.`,
          },
        ],
      };
    }

    const coursDoc = coursDocs[chap.number];
    const tdDoc = tdDocs[chap.number];

    let md = `# Chapitre ${chap.number} : ${chap.title}\n\n`;
    md += `**Identifiant** : \`${chap.id}\`\n\n`;
    md += `**Résumé** : ${chap.summary}\n\n`;

    if (chap.notes && chap.notes.length > 0) {
      md += `### Notes de cours\n`;
      for (const note of chap.notes) {
        md += `- ${note}\n`;
      }
      md += `\n`;
    }

    md += `### Documents officiels Google Drive\n`;
    if (coursDoc) {
      md += `- Cours complet : [${coursDoc.title}](${driveViewUrl(coursDoc.id)}) ([Prévisualiser](${drivePreviewUrl(coursDoc.id)}))\n`;
    }
    if (tdDoc) {
      md += `- Planche de TD : [${tdDoc.title}](${driveViewUrl(tdDoc.id)}) ([Prévisualiser](${drivePreviewUrl(tdDoc.id)}))\n`;
    }
    md += `\n`;

    const chapExercises = allExercises.filter((e) => e.chapter.id === chap.id);
    md += `### Exercices (${chapExercises.length} au total)\n\n`;

    for (const e of chapExercises) {
      if (include_statements) {
        md += formatExerciseMarkdown(e) + "\n---\n\n";
      } else {
        const typeLabel = e.source === "cours" ? "Cours" : e.source === "dm" ? "DM" : "TD";
        const preview = e.statement.split("\n")[0].slice(0, 120);
        md += `- **${e.formattedUid}** [${typeLabel} ${e.number}] : ${preview}... ([Voir sur le site](${e.url}))\n`;
      }
    }

    return {
      content: [
        {
          type: "text",
          text: md,
        },
      ],
    };
  },
);

// ============================================================================
// Tool 3: get_exercise
// ============================================================================
server.tool(
  "get_exercise",
  "Retrieve the complete LaTeX statement and metadata of a specific math exercise by its public number (e.g. 14, '#014') or internal ID (e.g. 'ch1-ex14', 'ch2-cours-ex3', 'dm1-q1').",
  {
    identifier: z
      .union([z.number(), z.string()])
      .describe("Public exercise number (e.g. 14, '#014') or internal ID ('ch1-ex14', 'ch2-cours-ex3', 'dm1-q1')"),
  },
  async ({ identifier }) => {
    const ex = getExercise(identifier);
    if (!ex) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Exercise '${identifier}' not found. Please provide a valid public UID (e.g. 1 to 202 or '#014') or an internal ID (e.g. 'ch1-ex14').`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: formatExerciseMarkdown(ex),
        },
      ],
    };
  },
);

// ============================================================================
// Tool 4: search_exercises
// ============================================================================
server.tool(
  "search_exercises",
  "Search math exercises by LaTeX/text keywords, concept, public #NNN UID, chapter number, and source type (cours, td, dm).",
  {
    query: z
      .string()
      .describe("Search keywords or formula (e.g. 'récurrence', 'injectivité', 'binôme', 'tchebychev', '#042')"),
    chapter: z
      .number()
      .int()
      .min(1)
      .max(7)
      .optional()
      .describe("Filter by chapter number (1 to 7)"),
    source: z
      .enum(["cours", "td", "dm"])
      .optional()
      .describe("Filter by exercise origin: 'cours' (embedded lecture exercise), 'td' (worksheet), 'dm' (homework)"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .default(10)
      .describe("Maximum number of results to return (default: 10)"),
  },
  async ({ query, chapter, source, limit }) => {
    const results = searchExercises(query, { chapter, source, limit });

    if (results.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `Aucun exercice ne correspond à la recherche "${query}"${chapter ? ` dans le chapitre ${chapter}` : ""}${source ? ` (source: ${source})` : ""}.`,
          },
        ],
      };
    }

    let md = `# Résultats de recherche : "${query}" (${results.length} exercice(s) trouvé(s))\n\n`;

    for (const e of results) {
      md += formatExerciseMarkdown(e) + "\n---\n\n";
    }

    return {
      content: [
        {
          type: "text",
          text: md,
        },
      ],
    };
  },
);

// ============================================================================
// Tool 5: get_daily_workout
// ============================================================================
server.tool(
  "get_daily_workout",
  "Get the 5 daily workout exercises generated for a specific date (matching the deterministic pool shown on foroagora.org/maths).",
  {
    date: z
      .string()
      .optional()
      .describe("Date in YYYY-MM-DD format (defaults to today in Europe/Paris timezone)"),
    chapter: z
      .union([z.number(), z.string()])
      .optional()
      .default("all")
      .describe("Filter to a specific chapter number (1-7) or 'all'"),
  },
  async ({ date, chapter }) => {
    const resolvedDate = date || parisDateString();
    const workout = getDailyWorkout(resolvedDate, chapter);

    let md = `# Entraînement du Jour — ${resolvedDate}\n\n`;
    md += `Sélection quotidienne de 5 exercices (${chapter === "all" ? "tous chapitres confondus" : `chapitre ${chapter}`}).\n\n`;

    for (let i = 0; i < workout.length; i++) {
      md += `## Exercice ${i + 1} / ${workout.length}\n`;
      md += formatExerciseMarkdown(workout[i]) + "\n---\n\n";
    }

    return {
      content: [
        {
          type: "text",
          text: md,
        },
      ],
    };
  },
);

// ============================================================================
// Tool 6: list_dms
// ============================================================================
server.tool(
  "list_dms",
  "List all published homework problem sets (Devoirs Maison / DM) with due dates, chapters, and Drive document links.",
  {},
  async () => {
    let md = `# Devoirs Maison (DM)\n\n`;

    for (const d of devoirs) {
      md += `## ${d.title} (\`${d.id}\`)\n`;
      md += `- **Échéance** : ${d.due}\n`;
      md += `- **Chapitre associé** : Chapitre ${d.chapter}\n`;
      md += `- **Nombre de questions** : ${d.questions.length}\n`;
      md += `- **Sujet Google Drive** : [Consulter](${driveViewUrl(d.docId)}) ([Prévisualiser](${drivePreviewUrl(d.docId)}))\n`;
      if (d.correctionDocId) {
        md += `- **Corrigé Google Drive** : [Consulter](${driveViewUrl(d.correctionDocId)}) ([Prévisualiser](${drivePreviewUrl(d.correctionDocId)}))\n`;
      }
      if (d.intro) {
        md += `- **Consigne** : *${d.intro}*\n`;
      }
      md += `\n`;
    }

    return {
      content: [
        {
          type: "text",
          text: md,
        },
      ],
    };
  },
);

// ============================================================================
// Tool 7: get_dm
// ============================================================================
server.tool(
  "get_dm",
  "Retrieve a specific Devoir Maison (DM) with all multi-part questions, statements, due dates, and correction links.",
  {
    id: z
      .union([z.string(), z.number()])
      .describe("DM identifier (e.g. 'dm-1', 'dm-2' or 1, 2)"),
  },
  async ({ id }) => {
    const dm = getDm(id);
    if (!dm) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `DM '${id}' introuvable. Devoirs disponibles : ${devoirs.map((d) => d.id).join(", ")}.`,
          },
        ],
      };
    }

    let md = `# ${dm.title}\n\n`;
    md += `- **Identifiant** : \`${dm.id}\`\n`;
    md += `- **Échéance** : ${dm.due}\n`;
    md += `- **Chapitre** : ${dm.chapter}\n`;
    md += `- **Sujet PDF Drive** : [Ouvrir le PDF](${driveViewUrl(dm.docId)})\n`;
    if (dm.correctionDocId) {
      md += `- **Corrigé officiel Drive** : [Ouvrir le corrigé](${driveViewUrl(dm.correctionDocId)})\n`;
    }
    if (dm.intro) {
      md += `\n> ${dm.intro}\n`;
    }
    md += `\n---\n\n`;

    for (const q of dm.questions) {
      const indexed = getExercise(q.id);
      md += `### Question ${q.number} ${indexed ? `(${indexed.formattedUid})` : ""}\n\n`;
      md += `${q.statement}\n\n`;
      if (indexed) {
        md += `[Voir la fiche en ligne](${indexed.url})\n\n`;
      }
      md += `---\n\n`;
    }

    return {
      content: [
        {
          type: "text",
          text: md,
        },
      ],
    };
  },
);

// ============================================================================
// Tool 8: list_kholles
// ============================================================================
server.tool(
  "list_kholles",
  "List weekly oral examination (khôlle) programs with dates, chapter scopes, and mandatory core proofs ('incontournables').",
  {},
  async () => {
    let md = `# Programme des Interrogations Orales (Khôlles)\n\n`;
    md += `> ${KHOLLE_NOTE}\n\n`;

    for (const k of kholleWeeks) {
      md += `## ${k.label} (ID: \`${k.id}\`)\n`;
      md += `- **Programme / Scope** :\n`;
      for (const s of k.scope) {
        md += `  - ${s.text}\n`;
      }
      md += `- **Questions de cours incontournables** :\n`;
      for (const inc of k.incontournables) {
        md += `  - ${inc.text}\n`;
      }
      md += `- **Document officiel du programme** : [Consulter sur Drive](${driveViewUrl(k.docId)})\n\n`;
    }

    return {
      content: [
        {
          type: "text",
          text: md,
        },
      ],
    };
  },
);

// ============================================================================
// Tool 9: get_kholle
// ============================================================================
server.tool(
  "get_kholle",
  "Get details and core oral exam questions for a specific khôlle week (by start date, e.g. '2026-10-12', or 'latest').",
  {
    id_or_date: z
      .string()
      .describe("Start date of the week in YYYY-MM-DD format (e.g. '2026-10-12') or 'latest'"),
  },
  async ({ id_or_date }) => {
    let k = id_or_date.toLowerCase() === "latest" ? kholleWeeks[0] : getKholle(id_or_date);

    if (!k) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Semaine de khôlle '${id_or_date}' introuvable. Semaines disponibles : ${kholleWeeks.map((w) => w.id).join(", ")}.`,
          },
        ],
      };
    }

    let md = `# ${k.label}\n\n`;
    md += `**Date de début** : ${k.start} | **Identifiant** : \`${k.id}\`\n\n`;
    md += `> **Consigne officielle** : ${KHOLLE_NOTE}\n\n`;

    md += `### Chapitres et paragraphes au programme\n\n`;
    for (const s of k.scope) {
      md += `- **Chapitre ${s.chapter}** : ${s.text}\n`;
    }
    md += `\n`;

    md += `### Questions de cours incontournables\n\n`;
    md += `*Ces questions et démonstrations doivent être maîtrisées parfaitement par l'étudiant sous peine d'une note inférieure à 10/20.*\n\n`;
    for (let i = 0; i < k.incontournables.length; i++) {
      const inc = k.incontournables[i];
      md += `${i + 1}. ${inc.text}${inc.chapter ? ` *(Chapitre ${inc.chapter})*` : ""}\n`;
    }
    md += `\n`;

    md += `### Document officiel du colleur\n`;
    md += `- [Ouvrir le PDF sur Google Drive](${driveViewUrl(k.docId)})\n`;
    md += `- [Prévisualiser](${drivePreviewUrl(k.docId)})\n`;

    return {
      content: [
        {
          type: "text",
          text: md,
        },
      ],
    };
  },
);

// ============================================================================
// Tool 10: list_documents
// ============================================================================
server.tool(
  "list_documents",
  "List all official Google Drive PDF documents (Course polycopiés, TD sheets, Trigonometry formula book, Mathematical writing & presentation methodology) with preview and view URLs.",
  {
    category: z
      .enum(["all", "cours", "td", "resources"])
      .optional()
      .default("all")
      .describe("Filter document category: 'cours', 'td', 'resources', or 'all'"),
  },
  async ({ category }) => {
    let md = `# Documents et Polycopiés Officiels — Google Drive\n\n`;
    md += `Dossier partagé principal : [Dossier Google Drive](${DRIVE_FOLDER_URL})\n\n`;

    if (category === "all" || category === "cours") {
      md += `## Polycopiés de Cours\n`;
      for (const [chNum, doc] of Object.entries(coursDocs)) {
        md += `- **${doc.title}** (Chapitre ${chNum}) : [Voir le PDF](${driveViewUrl(doc.id)}) | [Prévisualisation](${drivePreviewUrl(doc.id)})\n`;
      }
      md += `\n`;
    }

    if (category === "all" || category === "td") {
      md += `## Planches de Travaux Dirigés (TD)\n`;
      for (const [chNum, doc] of Object.entries(tdDocs)) {
        md += `- **${doc.title}** (Chapitre ${chNum}) : [Voir le PDF](${driveViewUrl(doc.id)}) | [Prévisualisation](${drivePreviewUrl(doc.id)})\n`;
      }
      md += `\n`;
    }

    if (category === "all" || category === "resources") {
      md += `## Fiches Méthodologiques et Formulaires\n`;
      for (const doc of resourceDocs) {
        md += `### ${doc.title}\n`;
        md += `- **Description** : ${doc.description}\n`;
        md += `- **Lien Drive** : [Consulter](${driveViewUrl(doc.id)}) | [Prévisualisation](${drivePreviewUrl(doc.id)})\n\n`;
      }
    }

    return {
      content: [
        {
          type: "text",
          text: md,
        },
      ],
    };
  },
);

// ============================================================================
// Tool 11: get_math_stats
// ============================================================================
server.tool(
  "get_math_stats",
  "Get curriculum statistics and coverage of the Foro Ágora Math database.",
  {},
  async () => {
    const stats = getMathStats();
    let md = `# Statistiques de la Base de Mathématiques — Foro Ágora\n\n`;
    md += `- **Niveau** : ${stats.curriculum}\n`;
    md += `- **Plateforme** : ${stats.institution}\n`;
    md += `- **Total de chapitres** : ${stats.totalChapters}\n`;
    md += `- **Total d'exercices** : ${stats.totalExercises}\n`;
    md += `  - Exercices de Cours intégrés : ${stats.breakdown.coursExercises}\n`;
    md += `  - Exercices de Travaux Dirigés (TD) : ${stats.breakdown.tdExercises}\n`;
    md += `  - Questions de Devoir Maison (DM) : ${stats.breakdown.dmExercises}\n`;
    md += `- **Devoirs Maison disponibles** : ${stats.totalDms}\n`;
    md += `- **Semaines de khôlle archivées** : ${stats.totalKholleWeeks}\n`;
    md += `- **Documents officiels Google Drive** : ${stats.totalDriveDocuments}\n\n`;

    md += `### Répartition par chapitre\n\n`;
    for (const c of stats.chapters) {
      md += `- **Chapitre ${c.number}** : ${c.title} (${c.exerciseCount} exercices)\n`;
    }

    return {
      content: [
        {
          type: "text",
          text: md,
        },
      ],
    };
  },
);

// ============================================================================
// MCP Resources
// ============================================================================
server.resource(
  "math-chapters",
  "math://chapters",
  async () => ({
    contents: [
      {
        uri: "math://chapters",
        mimeType: "application/json",
        text: JSON.stringify(chapters, null, 2),
      },
    ],
  }),
);

server.resource(
  "math-stats",
  "math://stats",
  async () => ({
    contents: [
      {
        uri: "math://stats",
        mimeType: "application/json",
        text: JSON.stringify(getMathStats(), null, 2),
      },
    ],
  }),
);

server.resource(
  "math-latest-kholle",
  "math://kholles/latest",
  async () => ({
    contents: [
      {
        uri: "math://kholles/latest",
        mimeType: "application/json",
        text: JSON.stringify(kholleWeeks[0], null, 2),
      },
    ],
  }),
);

// ============================================================================
// MCP Prompts
// ============================================================================
server.prompt(
  "solve-exercise",
  "Prompt template to solve a specific Foro Agora math exercise with rigorous French mathematical standards.",
  {
    identifier: z.string().describe("Exercise public UID (e.g. 14, '#014') or internal ID ('ch1-ex14')"),
  },
  async ({ identifier }) => {
    const ex = getExercise(identifier);
    if (!ex) {
      throw new Error(`Exercise '${identifier}' not found`);
    }

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Tu es un professeur agrégé et colleur en CPGE (Classes Préparatoires aux Grandes Écoles, filière MPSI).
Résous de façon parfaitement rigoureuse l'exercice suivant extrait du programme de Foro Ágora (Chapitre ${ex.chapter.number} — ${ex.chapter.title}, ${ex.formattedUid}) :

---
${ex.statement}
---

Consignes de rédaction :
1. Rédige ta démonstration en français, en respectant les exigences formelles des concours d'entrée aux grandes écoles (Mines-Ponts, CentraleSupélec, ENS).
2. Sois précis sur la quantification (préciser la nature et l'ensemble d'appartenance de chaque variable introduite).
3. Utilise le formalisme LaTeX approprié ($...$ et $$...$$).
4. Explique clairement la méthode employée (raisonnement par récurrence, contraposée, analyse-synthèse, disjonction de cas, etc.).`,
          },
        },
      ],
    };
  },
);

server.prompt(
  "kholle-session",
  "Prompt template to simulate a 1-hour oral examination (khôlle) in MPSI for a given week.",
  {
    week_id: z.string().optional().default("latest").describe("Khôlle week date (e.g. '2026-10-12') or 'latest'"),
  },
  async ({ week_id }) => {
    const k = week_id === "latest" ? kholleWeeks[0] : getKholle(week_id);
    if (!k) {
      throw new Error(`Khôlle week '${week_id}' not found`);
    }

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Tu es un colleur de mathématiques en MPSI (khôlleur). Tu interroges un élève sur le programme de la semaine : "${k.label}".

Programme officiel au tableau :
${k.scope.map((s) => `- ${s.text}`).join("\n")}

Questions de cours incontournables :
${k.incontournables.map((inc) => `- ${inc.text}`).join("\n")}

Commence l'interrogation par une question de cours tirée des incontournables, puis pose des questions d'approfondissement et des exercices d'application directe. Évalue la clarté de l'expression orale et la rigueur de la démonstration au tableau.`,
          },
        },
      ],
    };
  },
);

import http from "node:http";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

// ============================================================================
// Start Server (Stdio or SSE / HTTP)
// ============================================================================
async function startStdioServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[foroagora-math] MCP Server running on stdio");
}

async function startSseServer(port: number) {
  const transports = new Map<string, SSEServerTransport>();

  const httpServer = http.createServer(async (req, res) => {
    // CORS headers for web/tool integration
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const host = req.headers.host ?? `localhost:${port}`;
    const url = new URL(req.url ?? "/", `http://${host}`);

    if (url.pathname === "/sse" && req.method === "GET") {
      const transport = new SSEServerTransport("/messages", res);
      transports.set(transport.sessionId, transport);
      transport.onclose = () => {
        transports.delete(transport.sessionId);
      };
      await server.connect(transport);
      return;
    }

    if (url.pathname === "/messages" && req.method === "POST") {
      const sessionId = url.searchParams.get("sessionId");
      const transport = sessionId ? transports.get(sessionId) : undefined;
      if (!transport) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Session not found" }));
        return;
      }
      await transport.handlePostMessage(req, res);
      return;
    }

    if (url.pathname === "/" || url.pathname === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify(
          {
            status: "ok",
            server: "foroagora-math",
            version: "1.0.0",
            transport: "sse",
            url: `http://${host}/sse`,
            endpoints: {
              sse: `http://${host}/sse`,
              messages: `http://${host}/messages`,
              health: `http://${host}/health`,
            },
            toolsCount: 11,
          },
          null,
          2,
        ),
      );
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  });

  httpServer.listen(port, () => {
    console.log(`[foroagora-math] MCP SSE Server running at http://localhost:${port}/sse`);
    console.log(`[foroagora-math] Health check: http://localhost:${port}/health`);
  });
}

async function main() {
  const args = process.argv.slice(2);
  const isSse = args.includes("--sse") || args.includes("--port") || args.includes("-p") || Boolean(process.env.PORT) || process.env.MCP_TRANSPORT === "sse";

  let port = 3333;
  const portIdx = Math.max(args.indexOf("--port"), args.indexOf("-p"));
  if (portIdx !== -1 && args[portIdx + 1]) {
    port = parseInt(args[portIdx + 1], 10);
  } else if (process.env.PORT) {
    port = parseInt(process.env.PORT, 10);
  }

  if (isSse) {
    await startSseServer(port);
  } else {
    await startStdioServer();
  }
}

main().catch((err) => {
  console.error("[foroagora-math] Fatal server error:", err);
  process.exit(1);
});

