# Foro Ágora — Marcus Aurelius API (`foroagora-marcus-api`)

Public-domain REST API serving the complete Spanish text of Marcus Aurelius' *Meditations* (*Meditaciones*), structured book by book (Libros I–XII) and point by point (486 quotes total).

Built as an isolated Cloudflare Worker inside the Foro Ágora ecosystem, with no references from the main Foro Ágora web application.

## Base URLs

- **Custom domain:** `https://marcus-api.foroagora.org`
- **Workers.dev:** `https://foroagora-marcus-api.ignacioramosgu.workers.dev`

All endpoints support CORS (`Access-Control-Allow-Origin: *`) for `GET`, `HEAD`, and `OPTIONS` requests.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` or `/v1` | Service metadata, work info, and endpoint directory |
| `GET` | `/v1/health` | Health check with book and quote counts |
| `GET` | `/v1/openapi.json` | OpenAPI 3.1.0 specification |
| `GET` | `/v1/books` | List all 12 books with point counts and ID ranges |
| `GET` | `/v1/books/:book` | Get a single book and all its points (`1`–`12` or `I`–`XII`) |
| `GET` | `/v1/books/:book/points/:point` | Get a specific point by book and point number |
| `GET` | `/v1/quotes` | List, filter, and search quotes |
| `GET` | `/v1/quotes/random` | Get a random quote (with optional filters) |
| `GET` | `/v1/quotes/daily` | Get a deterministic quote for the current UTC date (or `?date=YYYY-MM-DD`) |
| `GET` | `/v1/quotes/:ref` | Get a quote by canonical reference (e.g. `4.3` or `IV.3`) |

## Query Parameters

### `GET /v1/quotes`
- `book`: Filter by book number (`1`–`12`) or Roman numeral (`I`–`XII`, case-insensitive).
- `q`: Accent-insensitive, case-insensitive full-text search (e.g. `razon` matches `razón`).
- `maxLength`: Maximum character length (`charCount <= maxLength`).
- `minLength`: Minimum character length (`charCount >= minLength`).
- `limit`: Page size (`1`–`100`, default `20`).
- `offset`: Pagination offset (`>= 0`, default `0`).
- `lang`: Language code (currently `"es"` only; returns `400` for unsupported languages).

### `GET /v1/quotes/random`
- Supports `book`, `q`, `maxLength`, `minLength`, and `lang`.

### `GET /v1/quotes/daily`
- `date`: Optional `YYYY-MM-DD` date string (defaults to current UTC date).
- Supports `book`, `maxLength`, `minLength`, and `lang`.

## Example Requests & Responses

### `GET /v1/books/1/points/1`

```json
{
  "quote": {
    "id": "1.1",
    "book": 1,
    "roman": "I",
    "point": 1,
    "text": "Aprendí de mi abuelo Vero: su bondad y no enojarme con facilidad.",
    "charCount": 65,
    "wordCount": 12,
    "language": "es"
  }
}
```

### `GET /v1/quotes?q=razon&limit=2`

```json
{
  "work": {
    "title": "Meditaciones",
    "author": "Marco Aurelio",
    "language": "es"
  },
  "pagination": {
    "total": 106,
    "limit": 2,
    "offset": 0,
    "returned": 2,
    "hasMore": true
  },
  "quotes": [
    {
      "id": "1.8",
      "book": 1,
      "roman": "I",
      "point": 8,
      "text": "..."
    }
  ]
}
```

## Project Structure

- `data/meditations.es.json`: Complete Spanish text (12 books, 486 numbered points), sourced from the public-domain ILCE edition (`Meditaciones`, Marco Aurelio).
- `src/index.ts`: Cloudflare Worker router, search/filter/pagination logic, and CORS/caching headers.
- `src/openapi.ts`: OpenAPI 3.1.0 schema builder.
- `src/index.test.ts`: Unit tests covering routing, book/point lookups, search, daily determinism, random filtering, and error responses.
- `wrangler.jsonc`: Cloudflare Worker configuration (`foroagora-marcus-api`).

## Local Bundle & Tests

From the repository root:

```bash
./node_modules/.bin/esbuild workers/marcus-aurelius-api/src/index.ts \
  --bundle --format=esm --platform=neutral --minify \
  --outfile=workers/marcus-aurelius-api/dist/worker.js

node --test /Users/ignac/.gemini/antigravity/brain/6b75d168-201c-47dd-8344-1033bc2300b9/scratch/test.mjs
```
