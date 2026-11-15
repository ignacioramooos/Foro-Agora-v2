import rawDataset from "../data/meditations.es.json";
import { buildOpenApiSpec } from "./openapi";

export interface QuoteItem {
  id: string;
  book: number;
  roman: string;
  point: number;
  text: string;
  charCount: number;
  wordCount: number;
  language: "es";
}

export interface BookData {
  book: number;
  roman: string;
  title: string;
  quoteCount: number;
  points: Omit<QuoteItem, "language">[];
}

interface Dataset {
  work: {
    title: string;
    originalTitle: string;
    author: string;
    language: "es";
    written: string;
    license: string;
    totalBooks: number;
    totalQuotes: number;
  };
  books: BookData[];
}

const dataset = rawDataset as Dataset;

const ROMAN_TO_BOOK: Record<string, number> = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
  VIII: 8,
  IX: 9,
  X: 10,
  XI: 11,
  XII: 12,
};

const normalizeText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

interface IndexedQuote {
  quote: QuoteItem;
  normalized: string;
}

const ALL_QUOTES: IndexedQuote[] = [];
const QUOTE_BY_ID = new Map<string, QuoteItem>();
const BOOK_BY_NUMBER = new Map<number, { meta: Omit<BookData, "points">; points: QuoteItem[] }>();

for (const book of dataset.books) {
  const points: QuoteItem[] = book.points.map((p) => {
    const quote: QuoteItem = { ...p, language: "es" };
    ALL_QUOTES.push({ quote, normalized: normalizeText(quote.text) });
    QUOTE_BY_ID.set(quote.id, quote);
    return quote;
  });

  BOOK_BY_NUMBER.set(book.book, {
    meta: {
      book: book.book,
      roman: book.roman,
      title: book.title,
      quoteCount: book.quoteCount,
    },
    points,
  });
}

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

function jsonResponse(
  body: unknown,
  status = 200,
  cacheControl = "public, max-age=86400"
): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cacheControl,
      ...CORS_HEADERS,
    },
  });
}

function errorResponse(status: number, code: string, message: string): Response {
  return jsonResponse({ error: { status, code, message } }, status, "no-store");
}

function parseBookIdentifier(raw: string): number | null {
  const trimmed = raw.trim();
  if (/^\d+$/.test(trimmed)) {
    const num = Number(trimmed);
    return num >= 1 && num <= 12 ? num : null;
  }
  const upper = trimmed.toUpperCase();
  return ROMAN_TO_BOOK[upper] ?? null;
}

function parsePositiveInt(raw: string | null): number | null {
  if (raw === null || raw.trim() === "") return null;
  if (!/^\d+$/.test(raw.trim())) return null;
  const n = Number(raw.trim());
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

function parseNonNegativeInt(raw: string | null): number | null {
  if (raw === null || raw.trim() === "") return null;
  if (!/^\d+$/.test(raw.trim())) return null;
  const n = Number(raw.trim());
  return Number.isSafeInteger(n) && n >= 0 ? n : null;
}

function parseQuoteRef(raw: string): { book: number; point: number } | null {
  const match = raw.trim().match(/^([0-9]+|[ivxlcdmIVXLCDM]+)[.:-]([0-9]+)$/);
  if (!match) return null;
  const book = parseBookIdentifier(match[1]);
  const point = Number(match[2]);
  if (!book || !Number.isSafeInteger(point) || point < 1) return null;
  return { book, point };
}

function fnv1aHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function randomIndex(maxExclusive: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % maxExclusive;
}

function resolveDateString(dateParam: string | null, tzParam: string | null): string | null {
  if (dateParam) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) return null;
    const parsed = new Date(`${dateParam}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) return null;
    return dateParam;
  }
  const tz = tzParam?.trim() || "UTC";
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {
    return null;
  }
}

interface FilterResult {
  quotes: QuoteItem[];
  error?: Response;
}

function filterQuotes(params: URLSearchParams): FilterResult {
  const lang = params.get("lang");
  if (lang && lang.toLowerCase() !== "es") {
    return {
      quotes: [],
      error: errorResponse(
        400,
        "UNSUPPORTED_LANGUAGE",
        `Language '${lang}' is not supported yet. Currently available: 'es'.`
      ),
    };
  }

  let bookFilter: number | null = null;
  const rawBook = params.get("book");
  if (rawBook !== null && rawBook.trim() !== "") {
    bookFilter = parseBookIdentifier(rawBook);
    if (!bookFilter) {
      return {
        quotes: [],
        error: errorResponse(400, "INVALID_BOOK", `Invalid book '${rawBook}'. Expected 1–12 or I–XII.`),
      };
    }
  }

  let minLength: number | null = null;
  if (params.has("minLength")) {
    minLength = parsePositiveInt(params.get("minLength"));
    if (minLength === null) {
      return {
        quotes: [],
        error: errorResponse(400, "INVALID_PARAM", "Parameter 'minLength' must be a positive integer."),
      };
    }
  }

  let maxLength: number | null = null;
  if (params.has("maxLength")) {
    maxLength = parsePositiveInt(params.get("maxLength"));
    if (maxLength === null) {
      return {
        quotes: [],
        error: errorResponse(400, "INVALID_PARAM", "Parameter 'maxLength' must be a positive integer."),
      };
    }
  }

  if (minLength !== null && maxLength !== null && minLength > maxLength) {
    return {
      quotes: [],
      error: errorResponse(400, "INVALID_RANGE", "'minLength' cannot be greater than 'maxLength'."),
    };
  }

  const rawQuery = params.get("q")?.trim() || "";
  const terms = rawQuery
    ? normalizeText(rawQuery)
        .split(/\s+/)
        .filter(Boolean)
    : [];

  const matched: QuoteItem[] = [];
  for (const item of ALL_QUOTES) {
    if (bookFilter !== null && item.quote.book !== bookFilter) continue;
    if (minLength !== null && item.quote.charCount < minLength) continue;
    if (maxLength !== null && item.quote.charCount > maxLength) continue;
    if (terms.length > 0 && !terms.every((t) => item.normalized.includes(t))) continue;
    matched.push(item.quote);
  }

  return { quotes: matched };
}

export async function handleRequest(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Only GET, HEAD, and OPTIONS requests are supported.");
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const params = url.searchParams;

  // Root / v1 overview
  if (path === "/" || path === "/v1") {
    return jsonResponse({
      service: "foroagora-marcus-api",
      version: "1.0.0",
      ecosystem: "Foro Ágora",
      work: dataset.work,
      endpoints: {
        health: "/v1/health",
        openapi: "/v1/openapi.json",
        books: "/v1/books",
        bookById: "/v1/books/:book",
        bookPoint: "/v1/books/:book/points/:point",
        quotes: "/v1/quotes",
        quoteByRef: "/v1/quotes/:ref",
        randomQuote: "/v1/quotes/random",
        dailyQuote: "/v1/quotes/daily",
      },
    });
  }

  if (path === "/v1/health") {
    return jsonResponse(
      {
        ok: true,
        service: "foroagora-marcus-api",
        version: "1.0.0",
        language: dataset.work.language,
        books: dataset.work.totalBooks,
        quotes: dataset.work.totalQuotes,
      },
      200,
      "no-store"
    );
  }

  if (path === "/v1/openapi.json") {
    return jsonResponse(buildOpenApiSpec(url.origin));
  }

  // GET /v1/books
  if (path === "/v1/books") {
    const books = dataset.books.map((b) => ({
      book: b.book,
      roman: b.roman,
      title: b.title,
      quoteCount: b.quoteCount,
      firstId: `${b.book}.1`,
      lastId: `${b.book}.${b.quoteCount}`,
    }));
    return jsonResponse({
      work: dataset.work,
      books,
    });
  }

  // GET /v1/books/:book/points/:point or /v1/books/:book/:point
  const bookPointMatch = path.match(/^\/v1\/books\/([^/]+)(?:\/points)?\/(\d+)$/);
  if (bookPointMatch) {
    const bookNum = parseBookIdentifier(bookPointMatch[1]);
    const pointNum = Number(bookPointMatch[2]);
    if (!bookNum) {
      return errorResponse(404, "BOOK_NOT_FOUND", `Book '${bookPointMatch[1]}' was not found. Valid books: 1–12 or I–XII.`);
    }
    const quote = QUOTE_BY_ID.get(`${bookNum}.${pointNum}`);
    if (!quote) {
      const bookEntry = BOOK_BY_NUMBER.get(bookNum)!;
      return errorResponse(
        404,
        "QUOTE_NOT_FOUND",
        `Point ${pointNum} was not found in Book ${bookEntry.meta.roman} (valid points: 1–${bookEntry.meta.quoteCount}).`
      );
    }
    return jsonResponse({ quote });
  }

  // GET /v1/books/:book
  const bookMatch = path.match(/^\/v1\/books\/([^/]+)$/);
  if (bookMatch) {
    const bookNum = parseBookIdentifier(bookMatch[1]);
    if (!bookNum) {
      return errorResponse(404, "BOOK_NOT_FOUND", `Book '${bookMatch[1]}' was not found. Valid books: 1–12 or I–XII.`);
    }
    const entry = BOOK_BY_NUMBER.get(bookNum)!;
    const includeQuotes = params.get("includeQuotes") !== "false";

    if (!includeQuotes) {
      return jsonResponse({ book: entry.meta });
    }

    const limit = params.has("limit") ? parsePositiveInt(params.get("limit")) : entry.points.length;
    if (limit === null || limit > 100) {
      return errorResponse(400, "INVALID_PARAM", "Parameter 'limit' must be an integer between 1 and 100.");
    }
    const offset = params.has("offset") ? parseNonNegativeInt(params.get("offset")) : 0;
    if (offset === null) {
      return errorResponse(400, "INVALID_PARAM", "Parameter 'offset' must be a non-negative integer.");
    }

    const sliced = entry.points.slice(offset, offset + limit);
    return jsonResponse({
      book: entry.meta,
      pagination: {
        total: entry.points.length,
        limit,
        offset,
        returned: sliced.length,
      },
      points: sliced,
    });
  }

  // GET /v1/quotes/random
  if (path === "/v1/quotes/random") {
    const { quotes, error } = filterQuotes(params);
    if (error) return error;
    if (quotes.length === 0) {
      return errorResponse(404, "NO_MATCHING_QUOTES", "No quotes matched the provided filters.");
    }

    const count = params.has("count") ? parsePositiveInt(params.get("count")) : 1;
    if (count === null || count > 20) {
      return errorResponse(400, "INVALID_PARAM", "Parameter 'count' must be an integer between 1 and 20.");
    }

    if (count === 1 && params.get("array") !== "true") {
      const picked = quotes[randomIndex(quotes.length)];
      return jsonResponse({ quote: picked, poolSize: quotes.length }, 200, "no-store");
    }

    const pool = [...quotes];
    const targetCount = Math.min(count, pool.length);
    const picked: QuoteItem[] = [];
    for (let i = 0; i < targetCount; i++) {
      const idx = randomIndex(pool.length);
      picked.push(pool[idx]);
      pool.splice(idx, 1);
    }

    return jsonResponse(
      {
        quotes: picked,
        count: picked.length,
        poolSize: quotes.length,
      },
      200,
      "no-store"
    );
  }

  // GET /v1/quotes/daily
  if (path === "/v1/quotes/daily") {
    const dateStr = resolveDateString(params.get("date"), params.get("tz"));
    if (!dateStr) {
      return errorResponse(
        400,
        "INVALID_DATE_OR_TZ",
        "Invalid 'date' (expected YYYY-MM-DD) or 'tz' (expected valid IANA timezone)."
      );
    }

    const { quotes, error } = filterQuotes(params);
    if (error) return error;
    if (quotes.length === 0) {
      return errorResponse(404, "NO_MATCHING_QUOTES", "No quotes matched the provided filters.");
    }

    const index = fnv1aHash(`foroagora:meditations:${dateStr}`) % quotes.length;
    return jsonResponse(
      {
        date: dateStr,
        timezone: params.get("date") ? "UTC" : params.get("tz")?.trim() || "UTC",
        quote: quotes[index],
        poolSize: quotes.length,
      },
      200,
      "public, max-age=3600"
    );
  }

  // GET /v1/quotes
  if (path === "/v1/quotes") {
    const { quotes, error } = filterQuotes(params);
    if (error) return error;

    const limit = params.has("limit") ? parsePositiveInt(params.get("limit")) : 20;
    if (limit === null || limit > 100) {
      return errorResponse(400, "INVALID_PARAM", "Parameter 'limit' must be an integer between 1 and 100.");
    }
    const offset = params.has("offset") ? parseNonNegativeInt(params.get("offset")) : 0;
    if (offset === null) {
      return errorResponse(400, "INVALID_PARAM", "Parameter 'offset' must be a non-negative integer.");
    }

    const sliced = quotes.slice(offset, offset + limit);
    return jsonResponse({
      work: {
        title: dataset.work.title,
        author: dataset.work.author,
        language: dataset.work.language,
      },
      pagination: {
        total: quotes.length,
        limit,
        offset,
        returned: sliced.length,
        hasMore: offset + sliced.length < quotes.length,
      },
      quotes: sliced,
    });
  }

  // GET /v1/quotes/:ref (e.g. 4.3, IV.3, 4:3, 4-3)
  const quoteRefMatch = path.match(/^\/v1\/quotes\/([^/]+)$/);
  if (quoteRefMatch) {
    const parsed = parseQuoteRef(quoteRefMatch[1]);
    if (!parsed) {
      return errorResponse(
        400,
        "INVALID_QUOTE_REF",
        `Invalid quote reference '${quoteRefMatch[1]}'. Expected format like '4.3', '4:3', '4-3', or 'IV.3'.`
      );
    }
    const quote = QUOTE_BY_ID.get(`${parsed.book}.${parsed.point}`);
    if (!quote) {
      const bookEntry = BOOK_BY_NUMBER.get(parsed.book)!;
      return errorResponse(
        404,
        "QUOTE_NOT_FOUND",
        `Quote ${parsed.book}.${parsed.point} not found (Book ${bookEntry.meta.roman} has points 1–${bookEntry.meta.quoteCount}).`
      );
    }
    return jsonResponse({ quote });
  }

  return errorResponse(404, "NOT_FOUND", `Route '${path}' not found. See /v1 or /v1/openapi.json.`);
}

export default {
  async fetch(request: Request): Promise<Response> {
    return handleRequest(request);
  },
};
