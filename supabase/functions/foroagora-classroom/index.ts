const RAW_BASE = "https://raw.githubusercontent.com/ignacioramooos/Foro-Agora-v2/main/public/classrooms";
const PUBLIC_HOST = "pxabjrkyzmtcwbbbvmvo.supabase.co";
const BASE_CANONICAL_URL = `https://${PUBLIC_HOST}/functions/v1/foroagora-classroom`;

interface ClassroomChapterData {
  id: string;
  number: number;
  title: string;
  summary: string;
  exercisesCount: number;
}

interface ClassroomExerciseData {
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

interface ClassroomFormulaireSection {
  id: string;
  title: string;
  items: Array<{ id: string; name: string; tex: string }>;
}

interface ClassroomDb {
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

interface ClassroomManifestEntry {
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

const CACHE_TTL_MS = 300_000;
let cachedManifest: { data: ClassroomManifestEntry[]; fetchedAt: number } | null = null;
const cachedClassrooms = new Map<string, { data: ClassroomDb; fetchedAt: number }>();

function getEnvJsonMap(key: string): Record<string, string> {
  try {
    // @ts-ignore Deno env
    const raw = typeof Deno !== "undefined" ? Deno.env.get(key) : undefined;
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function isSlugSafe(slug: string): boolean {
  return /^[a-z0-9-]+$/i.test(slug);
}

function checkClassroomAuth(req: Request, url: URL, slug?: string): boolean {
  const tokenMap = getEnvJsonMap("CLASSROOM_MCP_TOKENS");
  if (!slug || !tokenMap[slug]) return true;

  const authHeader = req.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : undefined;
  const queryToken = url.searchParams.get("token") ?? undefined;
  return bearer === tokenMap[slug] || queryToken === tokenMap[slug];
}

async function getManifest(force = false): Promise<ClassroomManifestEntry[]> {
  const now = Date.now();
  if (!force && cachedManifest && now - cachedManifest.fetchedAt < CACHE_TTL_MS) {
    return cachedManifest.data;
  }
  const res = await fetch(`${RAW_BASE}/index.json?t=${now}`, {
    headers: { "User-Agent": "foroagora-classroom-mcp", "Cache-Control": "no-cache" },
  });
  if (!res.ok) {
    if (cachedManifest) return cachedManifest.data;
    throw new Error(`Failed to fetch classroom index: HTTP ${res.status}`);
  }
  const parsed = (await res.json()) as { classrooms?: ClassroomManifestEntry[] };
  const list = parsed.classrooms ?? [];
  cachedManifest = { data: list, fetchedAt: now };
  return list;
}

async function getClassroomDb(slug: string, force = false): Promise<ClassroomDb> {
  if (!isSlugSafe(slug)) {
    throw new Error(`Invalid classroom slug '${slug}'.`);
  }
  const now = Date.now();
  const cached = cachedClassrooms.get(slug);
  if (!force && cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  const privateUrls = getEnvJsonMap("CLASSROOM_PRIVATE_URLS");
  const targetUrl = privateUrls[slug] ?? `${RAW_BASE}/${slug}.json?t=${now}`;
  const res = await fetch(targetUrl, {
    headers: { "User-Agent": "foroagora-classroom-mcp", "Cache-Control": "no-cache" },
  });
  if (!res.ok) {
    if (cached) return cached.data;
    throw new Error(`Classroom '${slug}' not found (HTTP ${res.status}).`);
  }
  const db = (await res.json()) as ClassroomDb;
  cachedClassrooms.set(slug, { data: db, fetchedAt: now });
  return db;
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

const formatExerciseMarkdown = (
  e: ClassroomExerciseData,
  options: { includeHints?: boolean; includeAnswer?: boolean } = {},
) => {
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
};

function buildToolsDefinitions(defaultSlug?: string) {
  const classroomProp = {
    type: "string",
    description: defaultSlug
      ? `Classroom slug (defaults to '${defaultSlug}')`
      : "Classroom slug (e.g. 'maths', 'modele')",
  };
  const requiredWithSlug = (extra: string[]) => (defaultSlug ? extra : ["classroom", ...extra]);

  return [
    {
      name: "list_classrooms",
      description: "List all available public Foro Agora Classrooms with chapter counts, exercise counts, and links.",
      inputSchema: { type: "object", properties: {}, required: [] },
    },
    {
      name: "list_chapters",
      description: "List all chapters in a classroom with summaries and exercise counts.",
      inputSchema: { type: "object", properties: { classroom: classroomProp }, required: requiredWithSlug([]) },
    },
    {
      name: "get_chapter",
      description: "Get chapter details and list exercises with public #NNN IDs and optional full LaTeX statements.",
      inputSchema: {
        type: "object",
        properties: {
          classroom: classroomProp,
          chapter: { type: ["number", "string"], description: "Chapter number (1, 2, ...) or ID" },
          include_statements: { type: "boolean", description: "Include full LaTeX statements" },
        },
        required: requiredWithSlug(["chapter"]),
      },
    },
    {
      name: "get_exercise",
      description: "Retrieve an exercise by public number (e.g. 14 or '#014') or internal ID.",
      inputSchema: {
        type: "object",
        properties: {
          classroom: classroomProp,
          identifier: { type: ["number", "string"], description: "Public #NNN or internal ID" },
          include_hints: { type: "boolean" },
          include_answer: { type: "boolean" },
        },
        required: requiredWithSlug(["identifier"]),
      },
    },
    {
      name: "search_exercises",
      description: "Search exercises in a classroom by keywords, theorem names, or IDs.",
      inputSchema: {
        type: "object",
        properties: {
          classroom: classroomProp,
          query: { type: "string" },
          chapter: { type: "number" },
          source: { type: "string" },
          limit: { type: "number" },
        },
        required: requiredWithSlug(["query"]),
      },
    },
    {
      name: "get_daily_workout",
      description: "Get the deterministic daily exercise set for a classroom.",
      inputSchema: {
        type: "object",
        properties: {
          classroom: classroomProp,
          date: { type: "string", description: "YYYY-MM-DD (defaults to today in Europe/Paris)" },
          chapter: { type: "number" },
        },
        required: requiredWithSlug([]),
      },
    },
    {
      name: "get_formulaire",
      description: "Retrieve the formula sheets / flashcards for the classroom.",
      inputSchema: { type: "object", properties: { classroom: classroomProp }, required: requiredWithSlug([]) },
    },
    {
      name: "get_classroom_stats",
      description: "Return overview statistics and web links for the classroom.",
      inputSchema: { type: "object", properties: { classroom: classroomProp }, required: requiredWithSlug([]) },
    },
  ];
}

async function executeTool(
  name: string,
  args: Record<string, any> = {},
  req: Request,
  url: URL,
  defaultSlug?: string,
  forceRefresh = false,
): Promise<{ text: string; isError?: boolean }> {
  if (name === "list_classrooms") {
    const manifest = await getManifest(forceRefresh);
    if (manifest.length === 0) return { text: "No public classrooms found." };
    let md = `# Foro Agora Classrooms\n\n`;
    for (const c of manifest) {
      md += `- **${c.fullName}** (\`${c.slug}\`) — ${c.chaptersCount} chapters, ${c.exercisesCount} exercises · ${c.url}\n`;
      if (c.description) md += `  ${c.description}\n`;
    }
    return { text: md };
  }

  const slug = (args.classroom as string | undefined) ?? defaultSlug;
  if (!slug) {
    return { text: "Missing 'classroom' slug parameter.", isError: true };
  }
  if (!checkClassroomAuth(req, url, slug)) {
    return { text: `Unauthorized: valid token required for classroom '${slug}'.`, isError: true };
  }

  const db = await getClassroomDb(slug, forceRefresh);

  if (name === "list_chapters") {
    let md = `# ${db.fullName}\n\n${db.description}\n\n`;
    for (const c of db.chapters) {
      md += `## Chapter ${c.number}: ${c.title}\n`;
      if (c.summary) md += `${c.summary}\n`;
      md += `- Exercises: ${c.exercisesCount}\n`;
      md += `- Link: https://foroagora.org/classroom/${db.slug}/chapitre/${c.id}\n\n`;
    }
    return { text: md };
  }

  if (name === "get_chapter") {
    const raw = args.chapter;
    const ch =
      typeof raw === "number"
        ? db.chapters.find((c) => c.number === raw)
        : db.chapters.find((c) => {
            const norm = String(raw).trim().toLowerCase();
            const num = parseInt(norm.replace(/^chapitre-/, ""), 10);
            return c.id.toLowerCase() === norm || (!Number.isNaN(num) && c.number === num);
          });
    if (!ch) {
      return { text: `Chapter '${raw}' not found in classroom '${db.slug}'.`, isError: true };
    }
    const exs = db.exercises.filter((e) => e.chapterNumber === ch.number);
    let md = `# Chapter ${ch.number}: ${ch.title}\n\n${ch.summary}\n\n`;
    for (const e of exs) {
      if (args.include_statements) {
        md += `${formatExerciseMarkdown(e, { includeHints: true })}\n---\n\n`;
      } else {
        md += `- **${e.formattedUid}** (\`${e.id}\`, ${e.source} n°${e.number}) — ${e.url}\n`;
      }
    }
    return { text: md };
  }

  if (name === "get_exercise") {
    const raw = args.identifier;
    let ex: ClassroomExerciseData | undefined;
    if (typeof raw === "number") {
      ex = db.exercises.find((e) => e.uid === raw);
    } else {
      const str = String(raw).trim();
      const numMatch = str.match(/^#?(\d+)$/);
      if (numMatch) {
        ex = db.exercises.find((e) => e.uid === parseInt(numMatch[1], 10));
      } else {
        ex = db.exercises.find((e) => e.id.toLowerCase() === str.toLowerCase());
      }
    }
    if (!ex) {
      return { text: `Exercise '${raw}' not found in classroom '${db.slug}'.`, isError: true };
    }
    return {
      text: formatExerciseMarkdown(ex, {
        includeHints: args.include_hints !== false,
        includeAnswer: Boolean(args.include_answer),
      }),
    };
  }

  if (name === "search_exercises") {
    const terms = stripAccents(String(args.query ?? ""))
      .split(/\s+/)
      .filter((t) => t.length > 0);
    const limit = typeof args.limit === "number" ? args.limit : 10;
    let pool = db.exercises;
    if (typeof args.chapter === "number") pool = pool.filter((e) => e.chapterNumber === args.chapter);
    if (typeof args.source === "string") pool = pool.filter((e) => e.source === args.source);

    const results =
      terms.length === 0
        ? pool.slice(0, limit)
        : pool
            .map((e) => {
              const hay = stripAccents(
                `${e.formattedUid} ${e.id} ${e.chapterTitle} ${e.statement} ${(e.hints ?? []).join(" ")}`,
              );
              let score = 0;
              for (const t of terms) if (hay.includes(t)) score += 1;
              if (terms.some((t) => e.id.toLowerCase() === t || e.formattedUid.toLowerCase() === t)) {
                score += 10;
              }
              return { e, score };
            })
            .filter((x) => x.score > 0)
            .sort((a, b) => b.score - a.score || a.e.uid - b.e.uid)
            .slice(0, limit)
            .map((x) => x.e);

    if (results.length === 0) {
      return { text: `No exercises matched '${args.query}' in '${db.slug}'.` };
    }
    return {
      text: results.map((e) => formatExerciseMarkdown(e)).join("\n---\n\n"),
    };
  }

  if (name === "get_daily_workout") {
    const date = (args.date as string | undefined) || parisDateString();
    const pool =
      typeof args.chapter === "number"
        ? db.exercises.filter((e) => e.chapterNumber === args.chapter && e.source !== "exemple")
        : db.exercises.filter((e) => e.source !== "exemple");
    const fallbackPool = pool.length > 0 ? pool : db.exercises;
    const exercises = seededShuffle(fallbackPool, `${db.slug}:${date}`).slice(0, 5);
    let md = `# Daily Workout (${date}) — ${db.fullName}\n\n`;
    md += exercises.map((e) => formatExerciseMarkdown(e, { includeHints: true })).join("\n---\n\n");
    return { text: md };
  }

  if (name === "get_formulaire") {
    if (!db.formulaire?.length) {
      return { text: `No formula sheet defined for '${db.slug}'.` };
    }
    let md = `# Formulaire — ${db.fullName}\n\n`;
    for (const section of db.formulaire) {
      md += `## ${section.title}\n`;
      for (const item of section.items) {
        md += `- **${item.name}**: ${item.tex}\n`;
      }
      md += "\n";
    }
    return { text: md };
  }

  if (name === "get_classroom_stats") {
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
    return { text: JSON.stringify(stats, null, 2) };
  }

  return { text: `Unknown tool: ${name}`, isError: true };
}

function resolveSlugFromRequest(url: URL): string | undefined {
  const querySlug = url.searchParams.get("slug") ?? url.searchParams.get("classroom");
  if (querySlug && querySlug !== "all") return querySlug.trim();

  // Support path /functions/v1/foroagora-classroom/<slug>(/sse)?
  const parts = url.pathname.split("/").filter(Boolean);
  const fnIdx = parts.indexOf("foroagora-classroom");
  if (fnIdx !== -1 && parts[fnIdx + 1] && parts[fnIdx + 1] !== "sse") {
    return parts[fnIdx + 1];
  }
  return undefined;
}

async function handleJsonRpc(
  body: any,
  req: Request,
  url: URL,
  defaultSlug?: string,
  forceRefresh = false,
) {
  const { id, method, params } = body;

  if (method === "notifications/initialized" || method === "ping") {
    if (method === "ping") return { jsonrpc: "2.0", id, result: {} };
    return null;
  }

  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: {
          name: defaultSlug ? `foroagora-classroom-${defaultSlug}` : "foroagora-classroom",
          version: "1.0.0",
        },
      },
    };
  }

  if (method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: { tools: buildToolsDefinitions(defaultSlug) },
    };
  }

  if (method === "tools/call") {
    const res = await executeTool(
      params?.name,
      params?.arguments ?? {},
      req,
      url,
      defaultSlug,
      forceRefresh,
    );
    return {
      jsonrpc: "2.0",
      id,
      result: {
        content: [{ type: "text", text: res.text }],
        isError: res.isError ?? false,
      },
    };
  }

  return {
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: `Method '${method}' not found` },
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

  const url = new URL(req.url);
  const slug = resolveSlugFromRequest(url);
  const forceRefresh = url.searchParams.get("refresh") === "1" || req.headers.get("x-refresh") === "1";

  if (!checkClassroomAuth(req, url, slug)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: valid classroom MCP token required" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const acceptHeader = req.headers.get("accept") || "";
  const canonicalEndpoint = slug ? `${BASE_CANONICAL_URL}?slug=${encodeURIComponent(slug)}` : BASE_CANONICAL_URL;

  if (req.method === "GET" && (acceptHeader.includes("text/event-stream") || url.pathname.endsWith("/sse"))) {
    const sessionId = crypto.randomUUID();
    const joiner = canonicalEndpoint.includes("?") ? "&" : "?";
    const endpointUrl = `${canonicalEndpoint}${joiner}sessionId=${sessionId}`;

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
        Connection: "keep-alive",
      },
    });
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      const response = await handleJsonRpc(body, req, url, slug, forceRefresh);
      if (!response) return new Response(null, { status: 204, headers: corsHeaders });
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

  const tools = buildToolsDefinitions(slug).map((t) => t.name);
  if (slug) {
    try {
      const db = await getClassroomDb(slug, forceRefresh);
      return new Response(
        JSON.stringify(
          {
            status: "active",
            name: `foroagora-classroom-${db.slug}`,
            classroom: db.fullName,
            mcpEndpoint: canonicalEndpoint,
            tools,
            chaptersCount: db.chapters.length,
            exercisesCount: db.exercises.length,
          },
          null,
          2,
        ),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } catch (e: any) {
      return new Response(
        JSON.stringify({ status: "error", message: e?.message ?? "Classroom not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  }

  const manifest = await getManifest(forceRefresh);
  return new Response(
    JSON.stringify(
      {
        status: "active",
        name: "foroagora-classroom",
        description: "Foro Agora Classrooms multi-subject MCP Server",
        mcpEndpoint: canonicalEndpoint,
        tools,
        classroomsCount: manifest.length,
        classrooms: manifest.map((c) => ({
          slug: c.slug,
          fullName: c.fullName,
          mcpEndpoint: `${BASE_CANONICAL_URL}?slug=${c.slug}`,
        })),
      },
      null,
      2,
    ),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
