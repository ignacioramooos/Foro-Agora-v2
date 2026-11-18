import type { SubjectLocale } from "./i18n";
import type { ClassroomSummary, SubjectConfig, SubjectExercise } from "./types";

/**
 * Applies a classroom's optional `translations[locale]` overlay to its content.
 * The base content (written in `subject.locale`) is returned untouched when no overlay exists,
 * so classrooms without translations (e.g. Maths) always show their original text.
 */
export const localizeSubject = (subject: SubjectConfig, locale: SubjectLocale): SubjectConfig => {
  const tr = subject.translations?.[locale];
  if (!tr || locale === (subject.locale ?? "fr")) return subject;

  const exOverrides = tr.exercises ?? {};
  const localizeExercise = (e: SubjectExercise): SubjectExercise => {
    const o = exOverrides[e.id];
    return o ? { ...e, ...o } : e;
  };

  const hints = subject.hints ? { ...subject.hints } : undefined;
  const answers = subject.answers ? { ...subject.answers } : undefined;
  for (const [id, o] of Object.entries(exOverrides)) {
    if (o.hints && hints && hints[id]) hints[id] = o.hints;
    if (o.answer && answers && answers[id]) answers[id] = o.answer;
  }

  return {
    ...subject,
    name: tr.name ?? subject.name,
    fullName: tr.fullName ?? subject.fullName,
    description: tr.description ?? subject.description,
    professor: tr.professor ?? subject.professor,
    institution: tr.institution ?? subject.institution,
    level: tr.level ?? subject.level,
    aiContext: tr.aiContext ?? subject.aiContext,
    phrases: tr.phrases ?? subject.phrases,
    hints,
    answers,
    chapters: subject.chapters.map((c) => {
      const co = tr.chapters?.[c.id];
      return {
        ...c,
        title: co?.title ?? c.title,
        summary: co?.summary ?? c.summary,
        notes: co?.notes ?? c.notes,
        exercises: c.exercises.map(localizeExercise),
      };
    }),
    formulaire: subject.formulaire?.map((s) => {
      const so = tr.formulaire?.[s.id];
      return {
        ...s,
        title: so?.title ?? s.title,
        items: s.items.map((it) => ({ ...it, ...(so?.items?.[it.id] ?? {}) })),
      };
    }),
    assignments: subject.assignments?.map((a) => ({ ...a, questions: a.questions.map(localizeExercise) })),
    bonusSheets: subject.bonusSheets?.map((b) => ({ ...b, questions: b.questions.map(localizeExercise) })),
  };
};

/** Applies `translations[locale]` to the lightweight directory card of a classroom. */
export const localizeSummary = (summary: ClassroomSummary, locale: SubjectLocale): ClassroomSummary => {
  const tr = summary.translations?.[locale];
  if (!tr || locale === (summary.locale ?? "fr")) return summary;
  return { ...summary, ...tr };
};
