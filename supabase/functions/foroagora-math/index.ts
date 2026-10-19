const DATA_URL = "https://raw.githubusercontent.com/ignacioramooos/Foro-Agora-v2/main/public/math-db.json";

interface MathDB {
  stats: any;
  chapters: any[];
  allExercises: any[];
  devoirs: any[];
  kholleWeeks: any[];
  coursDocs: Record<string, { id: string; title: string }>;
  tdDocs: Record<string, { id: string; title: string }>;
  resourceDocs: { id: string; title: string; description: string }[];
}

let cachedDb: MathDB | null = null;
let lastFetch = 0;

async function getDb(): Promise<MathDB> {
  const now = Date.now();
  if (cachedDb && now - lastFetch < 3600000) {
    return cachedDb;
  }
  const res = await fetch(DATA_URL, { headers: { "User-Agent": "foroagora-mcp-edge" } });
  if (!res.ok) {
    if (cachedDb) return cachedDb;
    throw new Error(`Failed to load math database: HTTP ${res.status}`);
  }
  cachedDb = (await res.json()) as MathDB;
  lastFetch = now;
  return cachedDb;
}

const driveViewUrl = (id: string) => `https://drive.google.com/file/d/${id}/view`;
const drivePreviewUrl = (id: string) => `https://drive.google.com/file/d/${id}/preview`;

const formatExerciseMarkdown = (e: any) => {
  const typeLabel =
    e.source === "cours" ? "Cours" : e.source === "dm" ? "Devoir Maison" : "Travaux Dirigés (TD)";
  let out = `### Exercise ${e.formattedUid} (Chapitre ${e.chapter.number} — ${typeLabel} n°${e.number})\n`;
  out += `- **Internal ID**: \`${e.id}\`\n`;
  out += `- **Chapter**: ${e.chapter.number}. ${e.chapter.title}\n`;
  out += `- **Source Type**: ${typeLabel}\n`;
  out += `- **Web Link**: ${e.url}\n\n`;
  out += `**Énoncé :**\n\n${e.statement}\n`;
  return out;
};

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

const seededShuffle = <T>(items: T[], seed: string): T[] => {
  const rand = seededRandom(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const parisDateString = (d = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(d);

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
  const db = await getDb();

  switch (name) {
    case "list_chapters": {
      let md = `# Foro Ágora — Programme de Mathématiques (MPSI / Math Sup)\n\n`;
      for (const c of db.chapters) {
        const coursCount = c.exercises.filter((e: any) => e.source === "cours").length;
        const tdCount = c.exercises.filter((e: any) => e.source !== "cours" && e.source !== "dm").length;
        const coursDoc = db.coursDocs[String(c.number)];
        const tdDoc = db.tdDocs[String(c.number)];
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
      const q = String(args.chapter ?? "").trim().toLowerCase();
      const num = parseInt(q.replace(/^chapitre-?/, ""), 10);
      const chap = db.chapters.find((c: any) => c.number === num || c.id === q || c.id === `chapitre-${q}`);
      if (!chap) return { text: `Chapter '${args.chapter}' not found. Valid: 1 to 7.`, isError: true };

      const coursDoc = db.coursDocs[String(chap.number)];
      const tdDoc = db.tdDocs[String(chap.number)];
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

      const chapExercises = db.allExercises.filter((e: any) => e.chapter.id === chap.id);
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
      const raw = String(args.identifier ?? "").trim();
      const clean = raw.replace(/^#/, "");
      let ex = null;
      if (/^\d+$/.test(clean)) {
        const uid = parseInt(clean, 10);
        ex = db.allExercises.find((e: any) => e.uid === uid);
      } else {
        ex = db.allExercises.find((e: any) => e.id.toLowerCase() === raw.toLowerCase());
      }
      if (!ex) return { text: `Exercise '${args.identifier}' not found. Provide public UID (1-202) or internal ID.`, isError: true };
      return { text: formatExerciseMarkdown(ex) };
    }

    case "search_exercises": {
      const q = stripAccents(String(args.query ?? "").trim()).replace(/^#/, "");
      let list = db.allExercises;
      if (typeof args.chapter === "number") list = list.filter((e: any) => e.chapter.number === args.chapter);
      if (typeof args.source === "string") list = list.filter((e: any) => e.source === args.source);

      if (/^\d+$/.test(q)) {
        const uid = parseInt(q, 10);
        const match = list.filter((e: any) => e.uid === uid);
        if (match.length) {
          let md = `# Résultat pour #${uid}\n\n` + formatExerciseMarkdown(match[0]);
          return { text: md };
        }
      }

      const terms = q.split(/\s+/).filter(Boolean);
      const limit = typeof args.limit === "number" ? args.limit : 10;
      const matched = list.filter((e: any) => {
        const srcText = e.source === "cours" ? "cours" : e.source === "dm" ? "dm" : "td";
        const hay = stripAccents(
          `${e.statement} ${e.chapter.title} chapitre ${e.chapter.number} chap ${e.chapter.number} ${srcText} exercice ${e.number} ${e.formattedUid} ${e.id}`,
        );
        return terms.every((t) => hay.includes(t));
      });

      if (!matched.length) return { text: `Aucun exercice trouvé pour "${args.query}".` };
      let md = `# Résultats de recherche : "${args.query}" (${matched.length} trouvés)\n\n`;
      for (const e of matched.slice(0, limit)) md += formatExerciseMarkdown(e) + "\n---\n\n";
      return { text: md };
    }

    case "get_daily_workout": {
      const resolvedDate = typeof args.date === "string" ? args.date : parisDateString();
      const ch = args.chapter ?? "all";
      let pool = db.allExercises;
      if (ch !== "all") {
        const num = parseInt(String(ch).replace(/^chapitre-?/, ""), 10);
        pool = pool.filter((e: any) => e.chapter.number === num);
      }
      const shuffled = seededShuffle(pool, `${resolvedDate}:${ch}`).slice(0, 5);
      let md = `# Entraînement du Jour — ${resolvedDate}\n\n`;
      for (let i = 0; i < shuffled.length; i++) {
        md += `## Exercice ${i + 1} / ${shuffled.length}\n`;
        md += formatExerciseMarkdown(shuffled[i]) + "\n---\n\n";
      }
      return { text: md };
    }

    case "list_dms": {
      let md = `# Devoirs Maison (DM)\n\n`;
      for (const d of db.devoirs) {
        md += `## ${d.title} (\`${d.id}\`)\n`;
        md += `- **Échéance** : ${d.due} | **Chapitre** : ${d.chapter}\n`;
        md += `- **Sujet Drive** : [Consulter](${driveViewUrl(d.docId)})\n`;
        if (d.correctionDocId) md += `- **Corrigé Drive** : [Consulter](${driveViewUrl(d.correctionDocId)})\n`;
        md += `\n`;
      }
      return { text: md };
    }

    case "get_dm": {
      const q = String(args.id ?? "").trim().toLowerCase();
      const num = q.replace(/^dm-?/, "");
      const dm = db.devoirs.find((d: any) => d.id === q || d.id === `dm-${q}` || d.id === `dm-${num}`);
      if (!dm) return { text: `DM '${args.id}' introuvable.`, isError: true };
      let md = `# ${dm.title}\n\n`;
      md += `- **Échéance** : ${dm.due} | **Chapitre** : ${dm.chapter}\n`;
      md += `- **Sujet Drive** : [Ouvrir le PDF](${driveViewUrl(dm.docId)})\n`;
      if (dm.correctionDocId) md += `- **Corrigé officiel** : [Ouvrir le corrigé](${driveViewUrl(dm.correctionDocId)})\n`;
      if (dm.intro) md += `\n> ${dm.intro}\n`;
      md += `\n---\n\n`;
      for (const qItem of dm.questions) {
        const indexed = db.allExercises.find((e: any) => e.id === qItem.id);
        md += `### Question ${qItem.number} ${indexed ? `(${indexed.formattedUid})` : ""}\n\n${qItem.statement}\n\n---\n\n`;
      }
      return { text: md };
    }

    case "list_kholles": {
      let md = `# Programme des Interrogations Orales (Khôlles)\n\n`;
      for (const k of db.kholleWeeks) {
        md += `## ${k.label} (ID: \`${k.id}\`)\n`;
        md += `- **Programme** : ${k.scope.map((s: any) => s.text).join(", ")}\n`;
        md += `- **Incontournables** :\n`;
        for (const inc of k.incontournables) md += `  - ${inc.text}\n`;
        md += `- **Document officiel** : [Google Drive](${driveViewUrl(k.docId)})\n\n`;
      }
      return { text: md };
    }

    case "get_kholle": {
      const q = String(args.id_or_date ?? "").toLowerCase();
      const k = q === "latest" ? db.kholleWeeks[0] : db.kholleWeeks.find((w: any) => w.id === q || w.start === q);
      if (!k) return { text: `Semaine de khôlle '${args.id_or_date}' introuvable.`, isError: true };
      let md = `# ${k.label}\n\n**Date** : ${k.start} | **ID** : \`${k.id}\`\n\n`;
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
        for (const [ch, doc] of Object.entries(db.coursDocs)) {
          md += `- **${doc.title}** : [Voir le PDF](${driveViewUrl(doc.id)})\n`;
        }
        md += `\n`;
      }
      if (cat === "all" || cat === "td") {
        md += `## Planches de TD\n`;
        for (const [ch, doc] of Object.entries(db.tdDocs)) {
          md += `- **${doc.title}** : [Voir le PDF](${driveViewUrl(doc.id)})\n`;
        }
        md += `\n`;
      }
      if (cat === "all" || cat === "resources") {
        md += `## Fiches Méthodologiques\n`;
        for (const doc of db.resourceDocs) {
          md += `- **${doc.title}** : ${doc.description} ([Lien Drive](${driveViewUrl(doc.id)}))\n`;
        }
      }
      return { text: md };
    }

    case "get_math_stats": {
      const s = db.stats;
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

async function handleJsonRpc(body: any) {
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
    const db = await getDb();
    const uri = params?.uri;
    let text = "";
    if (uri === "math://chapters") text = JSON.stringify(db.chapters, null, 2);
    else if (uri === "math://stats") text = JSON.stringify(db.stats, null, 2);
    else if (uri === "math://kholles/latest") text = JSON.stringify(db.kholleWeeks[0], null, 2);
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

// @ts-ignore Deno declaration
Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const PUBLIC_HOST = "pxabjrkyzmtcwbbbvmvo.supabase.co";
  const canonicalUrl = `https://${PUBLIC_HOST}/functions/v1/foroagora-math`;
  const acceptHeader = req.headers.get("accept") || "";

  // SSE Stream Transport (GET with accept: text/event-stream or /sse)
  if (req.method === "GET" && (acceptHeader.includes("text/event-stream") || url.pathname.endsWith("/sse"))) {
    const sessionId = crypto.randomUUID();
    const endpointUrl = `${canonicalUrl}?sessionId=${sessionId}`;

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
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
      const response = await handleJsonRpc(body);
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

  // General GET (Info & health check)
  const db = await getDb();
  return new Response(
    JSON.stringify(
      {
        status: "active",
        name: "foroagora-math",
        description: "Foro Ágora Math MCP Server for Gemini Web and AI Assistants",
        version: "1.0.0",
        mcpEndpoint: canonicalUrl,
        tools: toolsDefinitions.map((t) => t.name),
        chaptersCount: db.chapters.length,
        exercisesCount: db.allExercises.length,
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
