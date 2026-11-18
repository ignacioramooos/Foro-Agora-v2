import type { SubjectLocale } from "../i18n";
import type { ClassroomSummaryTranslation } from "../types";

/** Directory-card text of the sample classroom in other languages (original text is French). */
export const templateSummaryTranslations: Partial<Record<SubjectLocale, ClassroomSummaryTranslation>> = {
  en: {
    name: "Template",
    fullName: "Sample subject — Platform demo",
    description: "A ready-to-use template for hosting a new subject or a teacher's class on Foro Agora.",
    professor: "Sample teacher",
    institution: "School / Open to everyone",
    level: "All levels",
  },
  es: {
    name: "Plantilla",
    fullName: "Materia modelo — Ejemplo de plataforma",
    description: "Plantilla lista para usar para alojar una nueva materia o la clase de un profesor en Foro Agora.",
    professor: "Profesor de ejemplo",
    institution: "Institución / Abierta a todos",
    level: "Todos los niveles",
  },
  pt: {
    name: "Modelo",
    fullName: "Disciplina modelo — Exemplo de plataforma",
    description: "Modelo pronto para usar para hospedar uma nova disciplina ou a turma de um professor no Foro Agora.",
    professor: "Professor exemplo",
    institution: "Instituição / Aberta a todos",
    level: "Todos os níveis",
  },
};
