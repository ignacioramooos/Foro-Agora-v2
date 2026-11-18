import { describe, expect, it } from "vitest";
import { detectBrowserLocale } from "./locale";
import { localizeSubject } from "./localize";
import { getClassroomSummary, loadClassroom } from "./registry";

describe("classroom language", () => {
  it("uses the visitor's browser language when supported", () => {
    expect(detectBrowserLocale(["es-UY", "en"])).toBe("es");
    expect(detectBrowserLocale(["pt-BR"])).toBe("pt");
    expect(detectBrowserLocale(["fr-FR"])).toBe("fr");
    expect(detectBrowserLocale(["en-US"])).toBe("en");
  });

  it("picks the first supported language in the visitor's list", () => {
    expect(detectBrowserLocale(["de-DE", "pt-PT", "en"])).toBe("pt");
  });

  it("falls back to English for unsupported languages", () => {
    expect(detectBrowserLocale(["de-DE", "ja"])).toBe("en");
    expect(detectBrowserLocale([])).toBe("en");
  });

  it("keeps the Maths classroom French-only", async () => {
    expect(getClassroomSummary("maths")?.lockLocale).toBe(true);
    const maths = await loadClassroom("maths");
    expect(maths?.lockLocale).toBe(true);
    expect(maths?.locale).toBe("fr");
  });

  it("translates the sample classroom content", async () => {
    const modele = (await loadClassroom("modele"))!;
    expect(modele.lockLocale).toBeFalsy();
    for (const locale of ["en", "es", "pt"] as const) {
      const localized = localizeSubject(modele, locale);
      expect(localized.name).not.toBe(modele.name);
      expect(localized.chapters[0].title).not.toBe(modele.chapters[0].title);
      localized.chapters[0].exercises.forEach((e, i) => {
        const original = modele.chapters[0].exercises[i];
        expect(e.id).toBe(original.id);
        expect(e.statement).not.toBe(original.statement);
      });
    }
    expect(localizeSubject(modele, "fr")).toBe(modele);
  });
});
