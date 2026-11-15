export function buildOpenApiSpec(origin: string) {
  return {
    openapi: "3.1.0",
    info: {
      title: "Foro Ágora — Marcus Aurelius Meditations API",
      version: "1.0.0",
      description:
        "Public REST API serving the complete Meditations (Meditaciones) of Marcus Aurelius in Spanish, organized book by book (Libros I–XII) and point by point (486 sections). Part of the Foro Ágora ecosystem.",
      license: {
        name: "Public Domain (text)",
      },
    },
    servers: [{ url: origin }],
    paths: {
      "/v1": {
        get: {
          summary: "API metadata and endpoints index",
          responses: { "200": { description: "API overview" } },
        },
      },
      "/v1/health": {
        get: {
          summary: "Health check",
          responses: { "200": { description: "Service health status" } },
        },
      },
      "/v1/books": {
        get: {
          summary: "List all 12 books of Meditations",
          responses: { "200": { description: "List of books I–XII" } },
        },
      },
      "/v1/books/{book}": {
        get: {
          summary: "Get a book and its points",
          parameters: [
            {
              name: "book",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Book number (1–12) or Roman numeral (I–XII)",
            },
            {
              name: "includeQuotes",
              in: "query",
              schema: { type: "boolean", default: true },
            },
            { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100 } },
            { name: "offset", in: "query", schema: { type: "integer", minimum: 0 } },
          ],
          responses: {
            "200": { description: "Book details and points" },
            "404": { description: "Book not found" },
          },
        },
      },
      "/v1/books/{book}/points/{point}": {
        get: {
          summary: "Get a specific point within a book",
          parameters: [
            { name: "book", in: "path", required: true, schema: { type: "string" } },
            { name: "point", in: "path", required: true, schema: { type: "integer", minimum: 1 } },
          ],
          responses: {
            "200": { description: "Single quote" },
            "404": { description: "Book or point not found" },
          },
        },
      },
      "/v1/quotes": {
        get: {
          summary: "Search and filter quotes",
          parameters: [
            { name: "q", in: "query", schema: { type: "string" }, description: "Accent-insensitive search terms" },
            { name: "book", in: "query", schema: { type: "string" }, description: "Filter by book (1–12 or I–XII)" },
            { name: "minLength", in: "query", schema: { type: "integer", minimum: 1 } },
            { name: "maxLength", in: "query", schema: { type: "integer", minimum: 1 } },
            { name: "lang", in: "query", schema: { type: "string", default: "es" } },
            { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 20 } },
            { name: "offset", in: "query", schema: { type: "integer", minimum: 0, default: 0 } },
          ],
          responses: { "200": { description: "Paginated quotes" } },
        },
      },
      "/v1/quotes/random": {
        get: {
          summary: "Get one or more random quotes",
          parameters: [
            { name: "count", in: "query", schema: { type: "integer", minimum: 1, maximum: 20, default: 1 } },
            { name: "book", in: "query", schema: { type: "string" } },
            { name: "q", in: "query", schema: { type: "string" } },
            { name: "minLength", in: "query", schema: { type: "integer", minimum: 1 } },
            { name: "maxLength", in: "query", schema: { type: "integer", minimum: 1 } },
          ],
          responses: { "200": { description: "Random quote(s)" } },
        },
      },
      "/v1/quotes/daily": {
        get: {
          summary: "Get the deterministic quote of the day",
          parameters: [
            { name: "date", in: "query", schema: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" } },
            { name: "tz", in: "query", schema: { type: "string", default: "UTC" } },
            { name: "book", in: "query", schema: { type: "string" } },
            { name: "maxLength", in: "query", schema: { type: "integer", minimum: 1 } },
          ],
          responses: { "200": { description: "Daily quote" } },
        },
      },
      "/v1/quotes/{ref}": {
        get: {
          summary: "Get a quote by reference (e.g. 4.3, 4:3, 4-3, IV.3)",
          parameters: [
            { name: "ref", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "Single quote" },
            "404": { description: "Quote not found" },
          },
        },
      },
    },
  };
}
