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

declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response> | Response) => void;
};

const formatExerciseMarkdown = (e: IndexedExercise, full = true) => {
  const typeLabel =
    e.source === "cours"
      ? "Cours"
      : e.source === "dm"
      ? "Devoir Maison"
      : "Travaux Dirigés (TD)";
  let out = `### Exercise ${e.formattedUid} (Chapitre ${e.chapter.number} — ${typeLabel} n°${e.number})\n`;
  out += `- **Internal ID**: \`${e.id}\`\n`;
  out += `- **Chapter**: ${e.chapter.number}. ${e.chapter.title}\n`;
  out += `- **Source Type**: ${typeLabel}\n`;
  out += `- **Web Link**: ${e.url}\n\n`;
  out += `**Énoncé :**\n\n${e.statement}\n`;
  return out;
};

const toolsDefinitions = [
  {
    name: "list_chapters",
    description:
      "List all 7 mathematics chapters in the CPGE (MPSI) curriculum on Foro Ágora with summaries, exercise breakdown, and Google Drive document links.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "get_chapter",
    description:
      "Get full details of a specific chapter: summary, notes, Drive PDF links, and a complete listing of its exercises with public #NNN IDs.",
    inputSchema: {
      type: "object",
      properties: {
        chapter: {
          type: ["number", "string"],
          description: "Chapter number (1 to 7) or ID ('chapitre-1', 'chapitre-2', etc.)",
        },
        include_statements: {
          type: "boolean",
          description: "If true, includes the complete LaTeX statements of all exercises in the chapter",
        },
      },
      required: ["chapter"],
    },
  },
  {
    name: "get_exercise",
    description:
      "Retrieve the complete LaTeX statement and metadata of a specific math exercise by its public number (e.g. 14, '#014') or internal ID (e.g. 'ch1-ex14', 'ch2-cours-ex3', 'dm1-q1').",
    inputSchema: {
      type: "object",
      properties: {
        identifier: {
          type: ["number", "string"],
          description: "Public exercise number (e.g. 14, '#014') or internal ID ('ch1-ex14', 'dm1-q1')",
        },
      },
      required: ["identifier"],
    },
  },
  {
    name: "search_exercises",
    description:
      "Search math exercises by LaTeX/text keywords, concept, public #NNN UID, chapter number, and source type (cours, td, dm).",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search keywords or formula (e.g. 'récurrence', 'injectivité', '#042')",
        },
        chapter: {
          type: "integer",
          minimum: 1,
          maximum: 7,
          description: "Filter by chapter number (1 to 7)",
        },
        source: {
          type: "string",
          enum: ["cours", "td", "dm"],
          description: "Filter by exercise origin",
        },
        limit: {
          type: "integer",
          default: 10,
          description: "Maximum number of results to return",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_daily_workout",
    description:
      "Get the 5 daily workout exercises generated for a specific date (matching the deterministic pool shown on foroagora.org/maths).",
    inputSchema: {
      type: "object",
      properties: {
        date: {
          type: "string",
          description: "Date in YYYY-MM-DD format (defaults to today in Europe/Paris)",
        },
        chapter: {
          type: ["number", "string"],
          description: "Filter to a specific chapter number (1-7) or 'all'",
        },
      },
    },
  },
  {
    name: "list_dms",
    description:
      "List all published homework problem sets (Devoirs Maison / DM) with due dates, chapters, and Drive document links.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "get_dm",
    description:
      "Retrieve a specific Devoir Maison (DM) with all multi-part questions, statements, due dates, and correction links.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: ["string", "number"],
          description: "DM identifier (e.g. 'dm-1', 'dm-2' or 1, 2)",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "list_kholles",
    description:
      "List weekly oral examination (khôlle) programs with dates, chapter scopes, and mandatory core proofs ('incontournables').",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "get_kholle",
    description:
      "Get details and core oral exam questions for a specific khôlle week (by start date, e.g. '2026-10-12', or 'latest').",
    inputSchema: {
      type: "object",
      properties: {
        id_or_date: {
          type: "string",
          description: "Start date of the week in YYYY-MM-DD format (e.g. '2026-10-12') or 'latest'",
        },
      },
      required: ["id_or_date"],
    },
  },
  {
    name: "list_documents",
    description:
      "List all official Google Drive PDF documents (Course polycopiés, TD sheets, Trigonometry formula book, Mathematical writing guide) with preview and view URLs.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["all", "cours", "td", "resources"],
          default: "all",
          description: "Filter document category",
        },
      },
    },
  },
  {
    name: "get_math_stats",
    description: "Get curriculum statistics and coverage of the Foro Ágora Math database.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
];

async function executeTool(name: string, args: Record<string, unknown> = {}): Promise<{ text: string; isError?: boolean }> {
  switch (name) {
    case "list_chapters": {
      let md = `# Foro Ágora — Programme de Mathématiques (MPSI / Math Sup)\n\n`;
      for (const c of chapters) {
        const coursCount = c.exercises.filter((e) => e.source === "cours").length;
        const tdCount = c.exercises.filter((e) => e.source !== "cours" && e.source !== "dm").length;
        const coursDoc = coursDocs[c.number];
        const tdDoc = tdDocs[c.number];
        md += `## Chapitre ${c.number} : ${c.title}\n`;
        md += `- **Identifiant** : \`${c.id}\`\n`;
        md += `- **Résumé** : ${c.summary}\n`;
        md += `- **Exercices** : ${c.exercises.length} au total (${coursCount} cours, ${tdCount} TD)\n`;
        if (coursDoc) md += `- **Polycopié de cours (Drive)** : [${coursDoc.title}](${driveViewUrl(coursDoc.id)})\n`;
        if (tdDoc) md += `- **Planche de TD (Drive)** : [${tdDoc.title}](${driveViewUrl(tdDoc.id)})\n`;
        md += `\n`;
      }
      return { text: md };
    }

    case "get_chapter": {
      const chap = getChapter(args.chapter as string | number);
      if (!chap) return { text: `Chapter '${args.chapter}' not found. Valid: 1 to 7.`, isError: true };
      const coursDoc = coursDocs[chap.number];
      const tdDoc = tdDocs[chap.number];
      let md = `# Chapitre ${chap.number} : ${chap.title}\n\n`;
      md += `**Résumé** : ${chap.summary}\n\n`;
      if (chap.notes?.length) {
        md += `### Notes de cours\n`;
        for (const n of chap.notes) md += `- ${n}\n`;
        md += `\n`;
      }
      if (coursDoc) md += `- Cours complet : [${coursDoc.title}](${driveViewUrl(coursDoc.id)})\n`;
      if (tdDoc) md += `- Planche de TD : [${tdDoc.title}](${driveViewUrl(tdDoc.id)})\n`;
      md += `\n`;

      const chapExercises = allExercises.filter((e) => e.chapter.id === chap.id);
      md += `### Exercices (${chapExercises.length} au total)\n\n`;
      for (const e of chapExercises) {
        if (args.include_statements) {
          md += formatExerciseMarkdown(e) + "\n---\n\n";
        } else {
          const typeLabel = e.source === "cours" ? "Cours" : e.source === "dm" ? "DM" : "TD";
          md += `- **${e.formattedUid}** [${typeLabel} ${e.number}] : ${e.statement.split("\n")[0].slice(0, 100)}... ([Fiche](${e.url}))\n`;
        }
      }
      return { text: md };
    }

    case "get_exercise": {
      const ex = getExercise(args.identifier as string | number);
      if (!ex) return { text: `Exercise '${args.identifier}' not found. Provide public UID (1-202) or internal ID.`, isError: true };
      return { text: formatExerciseMarkdown(ex) };
    }

    case "search_exercises": {
      const results = searchExercises(String(args.query ?? ""), {
        chapter: typeof args.chapter === "number" ? args.chapter : undefined,
        source: args.source as "cours" | "td" | "dm" | undefined,
        limit: typeof args.limit === "number" ? args.limit : 10,
      });
      if (!results.length) return { text: `Aucun exercice trouvé pour "${args.query}".` };
      let md = `# Résultats de recherche : "${args.query}" (${results.length} trouvés)\n\n`;
      for (const e of results) md += formatExerciseMarkdown(e) + "\n---\n\n";
      return { text: md };
    }

    case "get_daily_workout": {
      const resolvedDate = typeof args.date === "string" ? args.date : parisDateString();
      const ch = (args.chapter as string | number | undefined) ?? "all";
      const workout = getDailyWorkout(resolvedDate, ch);
      let md = `# Entraînement du Jour — ${resolvedDate}\n\n`;
      for (let i = 0; i < workout.length; i++) {
        md += `## Exercice ${i + 1} / ${workout.length}\n`;
        md += formatExerciseMarkdown(workout[i]) + "\n---\n\n";
      }
      return { text: md };
    }

    case "list_dms": {
      let md = `# Devoirs Maison (DM)\n\n`;
      for (const d of devoirs) {
        md += `## ${d.title} (\`${d.id}\`)\n`;
        md += `- **Échéance** : ${d.due} | **Chapitre** : ${d.chapter}\n`;
        md += `- **Sujet Drive** : [Consulter](${driveViewUrl(d.docId)})\n`;
        if (d.correctionDocId) md += `- **Corrigé Drive** : [Consulter](${driveViewUrl(d.correctionDocId)})\n`;
        md += `\n`;
      }
      return { text: md };
    }

    case "get_dm": {
      const dm = getDm(args.id as string | number);
      if (!dm) return { text: `DM '${args.id}' introuvable.`, isError: true };
      let md = `# ${dm.title}\n\n`;
      md += `- **Échéance** : ${dm.due} | **Chapitre** : ${dm.chapter}\n`;
      md += `- **Sujet Drive** : [Ouvrir le PDF](${driveViewUrl(dm.docId)})\n`;
      if (dm.correctionDocId) md += `- **Corrigé officiel** : [Ouvrir le corrigé](${driveViewUrl(dm.correctionDocId)})\n`;
      if (dm.intro) md += `\n> ${dm.intro}\n`;
      md += `\n---\n\n`;
      for (const q of dm.questions) {
        const indexed = getExercise(q.id);
        md += `### Question ${q.number} ${indexed ? `(${indexed.formattedUid})` : ""}\n\n${q.statement}\n\n---\n\n`;
      }
      return { text: md };
    }

    case "list_kholles": {
      let md = `# Programme des Interrogations Orales (Khôlles)\n\n> ${KHOLLE_NOTE}\n\n`;
      for (const k of kholleWeeks) {
        md += `## ${k.label} (ID: \`${k.id}\`)\n`;
        md += `- **Programme** : ${k.scope.map((s) => s.text).join(", ")}\n`;
        md += `- **Incontournables** :\n`;
        for (const inc of k.incontournables) md += `  - ${inc.text}\n`;
        md += `- **Document officiel** : [Google Drive](${driveViewUrl(k.docId)})\n\n`;
      }
      return { text: md };
    }

    case "get_kholle": {
      const k = String(args.id_or_date).toLowerCase() === "latest" ? kholleWeeks[0] : getKholle(String(args.id_or_date));
      if (!k) return { text: `Semaine de khôlle '${args.id_or_date}' introuvable.`, isError: true };
      let md = `# ${k.label}\n\n**Date** : ${k.start} | **ID** : \`${k.id}\`\n\n> ${KHOLLE_NOTE}\n\n`;
      md += `### Questions de cours incontournables :\n`;
      for (let i = 0; i < k.incontournables.length; i++) {
        md += `${i + 1}. ${k.incontournables[i].text}\n`;
      }
      md += `\n[Ouvrir le PDF du colleur](${driveViewUrl(k.docId)})\n`;
      return { text: md };
    }

    case "list_documents": {
      const cat = (args.category as string) ?? "all";
      let md = `# Documents et Polycopiés Officiels — Google Drive\n\n`;
      if (cat === "all" || cat === "cours") {
        md += `## Polycopiés de Cours\n`;
        for (const [ch, doc] of Object.entries(coursDocs)) {
          md += `- **${doc.title}** : [Voir le PDF](${driveViewUrl(doc.id)})\n`;
        }
        md += `\n`;
      }
      if (cat === "all" || cat === "td") {
        md += `## Planches de TD\n`;
        for (const [ch, doc] of Object.entries(tdDocs)) {
          md += `- **${doc.title}** : [Voir le PDF](${driveViewUrl(doc.id)})\n`;
        }
        md += `\n`;
      }
      if (cat === "all" || cat === "resources") {
        md += `## Fiches Méthodologiques\n`;
        for (const doc of resourceDocs) {
          md += `- **${doc.title}** : ${doc.description} ([Lien Drive](${driveViewUrl(doc.id)}))\n`;
        }
      }
      return { text: md };
    }

    case "get_math_stats": {
      const s = getMathStats();
      let md = `# Statistiques de la Base de Mathématiques — Foro Ágora\n\n`;
      md += `- **Curriculum** : ${s.curriculum}\n`;
      md += `- **Total de chapitres** : ${s.totalChapters}\n`;
      md += `- **Total d'exercices** : ${s.totalExercises} (Cours: ${s.breakdown.coursExercises}, TD: ${s.breakdown.tdExercises}, DM: ${s.breakdown.dmExercises})\n`;
      md += `- **Devoirs Maison** : ${s.totalDms}\n`;
      md += `- **Semaines de khôlle** : ${s.totalKholleWeeks}\n`;
      md += `- **Documents officiels** : ${s.totalDriveDocuments}\n`;
      return { text: md };
    }

    default:
      return { text: `Tool '${name}' unknown`, isError: true };
  }
}

async function handleJsonRpc(body: any, hostUrl: string) {
  const { id, method, params } = body;

  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: { listChanged: false },
          prompts: { listChanged: false },
          resources: { listChanged: false },
        },
        serverInfo: {
          name: "foroagora-math",
          version: "1.0.0",
        },
      },
    };
  }

  if (method === "notifications/initialized") {
    return null;
  }

  if (method === "ping") {
    return { jsonrpc: "2.0", id, result: {} };
  }

  if (method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        tools: toolsDefinitions,
      },
    };
  }

  if (method === "tools/call") {
    const { name, arguments: toolArgs } = params ?? {};
    const res = await executeTool(name, toolArgs ?? {});
    return {
      jsonrpc: "2.0",
      id,
      result: {
        content: [{ type: "text", text: res.text }],
        isError: res.isError ?? false,
      },
    };
  }

  if (method === "resources/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        resources: [
          { uri: "math://chapters", name: "Chapters Catalog", mimeType: "application/json" },
          { uri: "math://stats", name: "Math Curriculum Statistics", mimeType: "application/json" },
          { uri: "math://kholles/latest", name: "Latest Oral Exam Week", mimeType: "application/json" },
        ],
      },
    };
  }

  if (method === "resources/read") {
    const uri = params?.uri;
    let text = "";
    if (uri === "math://chapters") text = JSON.stringify(chapters, null, 2);
    else if (uri === "math://stats") text = JSON.stringify(getMathStats(), null, 2);
    else if (uri === "math://kholles/latest") text = JSON.stringify(kholleWeeks[0], null, 2);
    return {
      jsonrpc: "2.0",
      id,
      result: {
        contents: [{ uri, mimeType: "application/json", text }],
      },
    };
  }

  if (method === "prompts/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        prompts: [
          {
            name: "solve-exercise",
            description: "Solve a specific Foro Ágora math exercise with rigorous French CPGE mathematical standards.",
            arguments: [{ name: "identifier", description: "Public UID or internal ID", required: true }],
          },
        ],
      },
    };
  }

  return {
    jsonrpc: "2.0",
    id,
    error: {
      code: -32601,
      message: `Method '${method}' not found`,
    },
  };
}

// Universal Deno.serve handler for Supabase Edge Functions
Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const acceptHeader = req.headers.get("accept") || "";

  // SSE Stream Transport (GET with accept: text/event-stream or /sse)
  if (req.method === "GET" && (acceptHeader.includes("text/event-stream") || url.pathname.endsWith("/sse"))) {
    const sessionId = crypto.randomUUID();
    const endpointUrl = `${url.origin}${url.pathname}?sessionId=${sessionId}`;

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        // Send initial endpoint announcement as per MCP SSE spec
        controller.enqueue(encoder.encode(`event: endpoint\ndata: ${endpointUrl}\n\n`));
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  }

  // Handle JSON-RPC POST (Streamable HTTP / MCP POST)
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const response = await handleJsonRpc(body, url.origin);
      if (!response) {
        return new Response(null, { status: 204, headers: corsHeaders });
      }
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (e: any) {
      return new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          id: null,
          error: { code: -32700, message: "Parse error", data: e?.message },
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  }

  // General GET (Metadata / Info / Health)
  return new Response(
    JSON.stringify(
      {
        status: "active",
        name: "foroagora-math",
        description: "Foro Ágora Math Database MCP Server for Gemini and AI Assistants",
        version: "1.0.0",
        mcpEndpoint: url.href,
        tools: toolsDefinitions.map((t) => t.name),
        chaptersCount: chapters.length,
        exercisesCount: allExercises.length,
      },
      null,
      2,
    ),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
