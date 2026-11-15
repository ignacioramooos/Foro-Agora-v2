import { buildSubjectIndex, type SubjectIndex } from "./helpers";
import { mathsSubject, mathUidMap } from "./maths";
import { templateSubject } from "./_template";
import type { SubjectConfig } from "./types";

/**
 * Registre central des matières et classes hébergées sur /classes/:slug.
 * Pour publier une nouvelle matière : importer sa config et l'ajouter au tableau `subjects`.
 */
export const subjects: SubjectConfig[] = [mathsSubject, templateSubject];

const indexCache = new Map<string, SubjectIndex>();

export const getSubject = (slug: string): SubjectConfig | undefined =>
  subjects.find((s) => s.slug === slug);

export const getSubjectIndex = (subject: SubjectConfig): SubjectIndex => {
  let cached = indexCache.get(subject.slug);
  if (!cached) {
    const uidMap = subject.slug === "maths" ? mathUidMap : undefined;
    cached = buildSubjectIndex(subject, uidMap);
    indexCache.set(subject.slug, cached);
  }
  return cached;
};
