import { describe, expect, it } from "vitest";
import { canAccessClassroom, classrooms, getClassroomSummary, loadClassroom } from "./registry";

describe("classroom registry", () => {
  it("lists maths and modele classrooms", () => {
    expect(getClassroomSummary("maths")).toBeDefined();
    expect(getClassroomSummary("modele")).toBeDefined();
    expect(classrooms.length).toBeGreaterThanOrEqual(2);
  });

  it("lazy-loads a classroom by slug", async () => {
    const subject = await loadClassroom("modele");
    expect(subject).toBeDefined();
    expect(subject?.slug).toBe("modele");
    expect(subject?.chapters.length).toBeGreaterThan(0);
  });

  it("allows public classrooms without login", () => {
    expect(canAccessClassroom(undefined, undefined)).toBe(true);
    expect(canAccessClassroom({ mode: "public" }, undefined)).toBe(true);
  });

  it("requires login for authenticated classrooms", () => {
    expect(canAccessClassroom({ mode: "authenticated" }, undefined)).toBe(false);
    expect(canAccessClassroom({ mode: "authenticated" }, "student@example.com")).toBe(true);
  });

  it("enforces email and domain allowlists for restricted classrooms", () => {
    const access = {
      mode: "restricted" as const,
      allowedEmails: ["Prof@School.edu"],
      allowedDomains: ["students.school.edu"],
    };
    expect(canAccessClassroom(access, undefined)).toBe(false);
    expect(canAccessClassroom(access, "other@gmail.com")).toBe(false);
    expect(canAccessClassroom(access, "prof@school.edu")).toBe(true);
    expect(canAccessClassroom(access, "alice@students.school.edu")).toBe(true);
  });
});
