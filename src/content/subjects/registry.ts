import { buildSubjectIndex, type SubjectIndex } from "./helpers";
import type { ClassroomAccessConfig, ClassroomSummary, SubjectConfig } from "./types";

/**
 * Registre central des classes hébergées sur /classroom/:slug.
 * Chaque classe est chargée paresseusement (code-split) pour supporter 50+ classes
 * sans alourdir le bundle initial.
 */
export const classrooms: ClassroomSummary[] = [
  {
    slug: "maths",
    name: "Maths",
    fullName: "Mathématiques — MPSI",
    description:
      "Programme complet de première année (MPSI) : cours, TD, khôlles, DM, formulaire et suivi de progression.",
    professor: "Foro Agora",
    institution: "CPGE MPSI",
    level: "CPGE MPSI",
    isCpge: true,
    locale: "fr",
    chaptersCount: 9,
    exercisesCount: 434,
    features: {
      calculator: true,
      coursTdSplit: true,
      kholles: true,
      kholleSimulator: true,
      formulaire: true,
      assignments: true,
      resources: true,
      printableSheet: true,
      aiPrompt: true,
    },
    load: async () => (await import("./maths")).mathsSubject,
  },
  {
    slug: "modele",
    name: "Modèle",
    fullName: "Matière modèle — Exemple de plateforme",
    description:
      "Gabarit prêt à l'emploi pour héberger une nouvelle matière ou la classe d'un professeur sur Foro Agora.",
    professor: "Professeur exemple",
    institution: "Établissement / Ouvert à tous",
    level: "Tout niveau",
    isCpge: false,
    locale: "fr",
    chaptersCount: 1,
    exercisesCount: 2,
    features: {
      calculator: true,
      coursTdSplit: false,
      kholles: false,
      kholleSimulator: false,
      formulaire: true,
      assignments: false,
      resources: false,
      printableSheet: true,
      aiPrompt: true,
    },
    load: async () => (await import("./_template")).templateSubject,
  },
];

const subjectCache = new Map<string, SubjectConfig>();
const indexCache = new Map<string, SubjectIndex>();

export const getClassroomSummary = (slug: string): ClassroomSummary | undefined =>
  classrooms.find((c) => c.slug === slug);

export const loadClassroom = async (slug: string): Promise<SubjectConfig | undefined> => {
  const cached = subjectCache.get(slug);
  if (cached) return cached;

  const entry = getClassroomSummary(slug);
  if (!entry) return undefined;

  const subject = await entry.load();
  subjectCache.set(slug, subject);
  return subject;
};

export const getSubjectIndex = (subject: SubjectConfig): SubjectIndex => {
  let cached = indexCache.get(subject.slug);
  if (!cached) {
    cached = buildSubjectIndex(subject, subject.uidMap);
    indexCache.set(subject.slug, cached);
  }
  return cached;
};

/**
 * Checks whether a user can access a classroom.
 * Public by default; private classrooms can require sign-in or an email/domain allowlist.
 */
export const canAccessClassroom = (
  access: ClassroomAccessConfig | undefined,
  userEmail: string | undefined,
  isAdmin = false,
): boolean => {
  if (!access || access.mode === "public") return true;
  if (!userEmail) return false;
  if (isAdmin) return true;
  if (access.mode === "authenticated") return true;

  const normalized = userEmail.trim().toLowerCase();
  const domain = normalized.split("@")[1] ?? "";
  const emailMatch = access.allowedEmails?.some((e) => e.trim().toLowerCase() === normalized) ?? false;
  const domainMatch = access.allowedDomains?.some((d) => d.trim().toLowerCase() === domain) ?? false;
  return emailMatch || domainMatch;
};

const MCP_BASE_URL = "https://pxabjrkyzmtcwbbbvmvo.supabase.co/functions/v1";

/** Returns the hosted MCP endpoint URL for a classroom slug. */
export const getClassroomMcpUrl = (slug: string): string =>
  slug === "maths"
    ? `${MCP_BASE_URL}/foroagora-math`
    : `${MCP_BASE_URL}/foroagora-classroom?slug=${encodeURIComponent(slug)}`;
