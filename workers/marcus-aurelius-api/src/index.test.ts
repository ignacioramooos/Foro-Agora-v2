import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { handleRequest } from "./index";

async function call(path: string, method = "GET") {
  const req = new Request(`https://marcus-api.foroagora.org${path}`, { method });
  const res = await handleRequest(req);
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  return { status: res.status, headers: res.headers, json };
}

describe("Foro Ágora Marcus Aurelius API", () => {
  it("returns API overview on / and /v1", async () => {
    const r1 = await call("/");
    assert.equal(r1.status, 200);
    assert.equal(r1.json.work.totalBooks, 12);
    assert.equal(r1.json.work.totalQuotes, 486);
    assert.equal(r1.json.work.language, "es");

    const r2 = await call("/v1");
    assert.equal(r2.status, 200);
    assert.equal(r2.json.service, "foroagora-marcus-api");
  });

  it("handles CORS preflight and rejects non-GET methods", async () => {
    const opts = await call("/v1/quotes", "OPTIONS");
    assert.equal(opts.status, 204);
    assert.equal(opts.headers.get("Access-Control-Allow-Origin"), "*");

    const post = await call("/v1/quotes", "POST");
    assert.equal(post.status, 405);
  });

  it("lists all 12 books in order with accurate counts", async () => {
    const res = await call("/v1/books");
    assert.equal(res.status, 200);
    assert.equal(res.json.books.length, 12);
    assert.equal(res.json.books[0].book, 1);
    assert.equal(res.json.books[0].roman, "I");
    assert.equal(res.json.books[11].book, 12);
    assert.equal(res.json.books[11].roman, "XII");
    const sum = res.json.books.reduce((acc: number, b: { quoteCount: number }) => acc + b.quoteCount, 0);
    assert.equal(sum, 486);
  });

  it("fetches a book by Arabic or Roman numeral", async () => {
    const byNum = await call("/v1/books/1");
    const byRoman = await call("/v1/books/i");
    assert.equal(byNum.status, 200);
    assert.equal(byRoman.status, 200);
    assert.equal(byNum.json.points.length, 17);
    assert.equal(byRoman.json.points[0].id, "1.1");
    assert.match(byRoman.json.points[0].text, /abuelo Vero/);
  });

  it("fetches a single quote by book/point and by ref formats", async () => {
    const a = await call("/v1/books/11/points/16");
    const b = await call("/v1/quotes/11.16");
    const c = await call("/v1/quotes/XI:16");
    const d = await call("/v1/quotes/11-16");
    assert.equal(a.status, 200);
    assert.equal(b.status, 200);
    assert.equal(c.status, 200);
    assert.equal(d.status, 200);
    assert.equal(a.json.quote.text, b.json.quote.text);
    assert.equal(b.json.quote.text, c.json.quote.text);
    assert.equal(c.json.quote.text, d.json.quote.text);
    assert.match(a.json.quote.text, /vivir feliz/);
  });

  it("supports accent-insensitive search and length filters", async () => {
    const res = await call("/v1/quotes?q=razon%20naturaleza&maxLength=300&limit=5");
    assert.equal(res.status, 200);
    assert.ok(res.json.quotes.length > 0);
    for (const q of res.json.quotes) {
      assert.ok(q.charCount <= 300);
    }
  });

  it("returns deterministic daily quote and valid random quotes", async () => {
    const d1 = await call("/v1/quotes/daily?date=2026-11-15");
    const d2 = await call("/v1/quotes/daily?date=2026-11-15");
    assert.equal(d1.status, 200);
    assert.equal(d1.json.quote.id, d2.json.quote.id);

    const rand = await call("/v1/quotes/random?count=3&book=IV");
    assert.equal(rand.status, 200);
    assert.equal(rand.json.quotes.length, 3);
    for (const q of rand.json.quotes) {
      assert.equal(q.book, 4);
    }
  });

  it("returns OpenAPI 3.1 spec and 404/400 on invalid inputs", async () => {
    const spec = await call("/v1/openapi.json");
    assert.equal(spec.status, 200);
    assert.equal(spec.json.openapi, "3.1.0");

    const badLang = await call("/v1/quotes?lang=fr");
    assert.equal(badLang.status, 400);

    const missingBook = await call("/v1/books/13");
    assert.equal(missingBook.status, 404);

    const missingQuote = await call("/v1/quotes/1.999");
    assert.equal(missingQuote.status, 404);
  });
});
