import type { SubjectLocale } from "./i18n";

export const SUPPORTED_LOCALES: SubjectLocale[] = ["fr", "en", "es", "pt"];

/** Shared localStorage key so the /classroom directory and every translatable classroom use the same language. */
export const CLASSROOM_LOCALE_KEY = "fa_classes_locale";

const isSupported = (value: unknown): value is SubjectLocale =>
  typeof value === "string" && (SUPPORTED_LOCALES as string[]).includes(value);

/** Picks the first supported language from the browser's preferred languages, falling back to English. */
export const detectBrowserLocale = (
  languages: readonly string[] | undefined = typeof navigator !== "undefined"
    ? navigator.languages?.length
      ? navigator.languages
      : [navigator.language]
    : undefined,
): SubjectLocale => {
  for (const lang of languages ?? []) {
    const base = lang?.toLowerCase().split(/[-_]/)[0];
    if (isSupported(base)) return base;
  }
  return "en";
};

const readStorage = (key: string): string | null => {
  try {
    return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
};

/** Saved choice first (shared key, then an optional legacy per-classroom key), otherwise the visitor's browser language. */
export const readClassroomLocale = (legacyKey?: string): SubjectLocale => {
  const shared = readStorage(CLASSROOM_LOCALE_KEY);
  if (isSupported(shared)) return shared;
  if (legacyKey) {
    const legacy = readStorage(legacyKey);
    if (isSupported(legacy)) return legacy;
  }
  return detectBrowserLocale();
};

export const saveClassroomLocale = (locale: SubjectLocale) => {
  try {
    localStorage.setItem(CLASSROOM_LOCALE_KEY, locale);
  } catch {
    /* storage unavailable */
  }
};
