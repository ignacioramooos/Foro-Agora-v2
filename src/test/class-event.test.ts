import { describe, expect, it } from "vitest";
import {
  EVENT_ADDRESS,
  formatEventDate,
  formatEventTimeRange,
  getAppleCalendarDataUrl,
  getEventAuthPath,
  getGoogleCalendarUrl,
  getGoogleMapsEmbedUrl,
  getGoogleMapsUrl,
  isEventRegistrationPath,
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

  it("identifies the event form so new event users can bypass general onboarding", () => {
    expect(isEventRegistrationPath("/registro", "?class=class-22-july")).toBe(true);
    expect(isEventRegistrationPath("/registro", "")).toBe(false);
    expect(isEventRegistrationPath("/dashboard", "?class=class-22-july")).toBe(false);
  });

  it("builds calendar links with the confirmed time and INJU address", () => {
    const googleCalendar = new URL(getGoogleCalendarUrl(classSession));
    expect(googleCalendar.hostname).toBe("calendar.google.com");
    expect(googleCalendar.searchParams.get("dates")).toBe("20260722T210000Z/20260722T230000Z");
    expect(googleCalendar.searchParams.get("location")).toContain(EVENT_ADDRESS);

    const appleCalendar = decodeURIComponent(getAppleCalendarDataUrl(classSession).split(",")[1]);
    expect(appleCalendar).toContain("DTSTART:20260722T210000Z");
    expect(appleCalendar).toContain("DTEND:20260722T230000Z");
    expect(appleCalendar).toContain("Av. 18 de Julio 1865");
  });

  it("builds clickable and embeddable Google Maps links for INJU", () => {
    expect(new URL(getGoogleMapsUrl()).searchParams.get("query")).toContain(EVENT_ADDRESS);
    expect(getGoogleMapsEmbedUrl()).toContain("output=embed");
    expect(decodeURIComponent(getGoogleMapsEmbedUrl())).toContain("Instituto Nacional de la Juventud - INJU");
  });

  it("normalizes and validates a Uruguayan cédula", () => {
    expect(normalizeCedula("1.234.567-2")).toBe("12345672");
    expect(isValidUruguayanCedula("1.234.567-2")).toBe(true);
    expect(isValidUruguayanCedula("1.234.567-3")).toBe(false);
  });
});
