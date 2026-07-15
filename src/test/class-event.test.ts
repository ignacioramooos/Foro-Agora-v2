import { describe, expect, it } from "vitest";
import {
  formatEventDate,
  formatEventTimeRange,
  getEventAuthPath,
  isValidUruguayanCedula,
  normalizeCedula,
  type ClassSession,
} from "@/lib/classEvent";

const classSession: ClassSession = {
  id: "class-22-july",
  title: "Primer encuentro de Foro Agora",
  module_number: 1,
  class_date: "2026-07-22T21:00:00.000Z",
  end_date: "2026-07-22T23:00:00.000Z",
  location: "Sala audiovisual de Casa INJU",
  max_capacity: 80,
  registration_limit: 90,
  is_active: true,
  is_featured: true,
  notes: null,
};

describe("class event helpers", () => {
  it("formats the confirmed date and time in Montevideo", () => {
    expect(formatEventDate(classSession.class_date)).toContain("22 de julio de 2026");
    expect(formatEventTimeRange(classSession)).toBe("18:00 a 20:00");
  });

  it("preserves the registration destination through authentication", () => {
    expect(getEventAuthPath(classSession.id)).toBe(
      "/auth?mode=event&returnTo=%2Fregistro%3Fclass%3Dclass-22-july"
    );
  });

  it("normalizes and validates a Uruguayan cédula", () => {
    expect(normalizeCedula("1.234.567-2")).toBe("12345672");
    expect(isValidUruguayanCedula("1.234.567-2")).toBe(true);
    expect(isValidUruguayanCedula("1.234.567-3")).toBe(false);
  });
});
