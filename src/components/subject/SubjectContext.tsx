import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSubjectStrings, type SubjectLocale, type SubjectStrings } from "@/content/subjects/i18n";
import type { SubjectIndex } from "@/content/subjects/helpers";
import { getSubjectIndex } from "@/content/subjects/registry";
import { localizeSubject } from "@/content/subjects/localize";
import { readClassroomLocale, saveClassroomLocale } from "@/content/subjects/locale";
import type { SubjectConfig } from "@/content/subjects/types";
import { useLocalMap } from "@/hooks/useLocalMap";
import { useMathFlags } from "@/hooks/useMathFlags";
import { useMathGoal } from "@/hooks/useMathGoal";
import { useMathProgress } from "@/hooks/useMathProgress";

interface SubjectContextValue {
  subject: SubjectConfig;
  index: SubjectIndex;
  basePath: string;
  storagePrefix: string;
  locale: SubjectLocale;
  /** False when the classroom is locked to one language (no language switch shown). */
  canChangeLocale: boolean;
  setLocale: (locale: SubjectLocale) => void;
  t: SubjectStrings;
  progress: Record<string, string>;
  toggleProgress: (exerciseId: string) => void;
  isLoggedIn: boolean;
  flags: Record<string, string>;
  toggleFlag: (exerciseId: string) => void;
  times: Record<string, number>;
  setTime: (exerciseId: string, seconds: number | undefined) => void;
  flashcards: Record<string, "ok" | "review">;
  setFlashcard: (itemId: string, state: "ok" | "review" | undefined) => void;
  goal: number;
  setGoal: (value: number) => void;
}

const SubjectContext = createContext<SubjectContextValue | null>(null);

const normalizeGoal = (value: number) => Math.min(30, Math.max(1, Math.round(value)));

export const SubjectProvider = ({
  subject: baseSubject,
  children,
}: {
  subject: SubjectConfig;
  children: React.ReactNode;
}) => {
  const storagePrefix = baseSubject.storagePrefix ?? `fa_subject_${baseSubject.slug}`;
  const isMathSynced = baseSubject.slug === "maths" && storagePrefix === "fa_math";
  const basePath = `/classroom/${baseSubject.slug}`;

  // Language: locked classrooms (e.g. Maths) always use their own language;
  // others use the saved choice, else the visitor's browser language.
  const lockedLocale: SubjectLocale | null = baseSubject.lockLocale ? (baseSubject.locale ?? "fr") : null;
  const [chosenLocale, setLocaleState] = useState<SubjectLocale>(() =>
    readClassroomLocale(`${storagePrefix}_locale`),
  );
  const locale = lockedLocale ?? chosenLocale;
  const setLocale = useCallback(
    (next: SubjectLocale) => {
      if (lockedLocale) return;
      setLocaleState(next);
      saveClassroomLocale(next);
    },
    [lockedLocale],
  );
  const t = useMemo(() => getSubjectStrings(locale), [locale]);
  const subject = useMemo(() => localizeSubject(baseSubject, locale), [baseSubject, locale]);
  const index = useMemo(() => getSubjectIndex(subject), [subject]);

  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = previous;
    };
  }, [locale]);

  // Synced hooks for Maths (preserves Supabase sync & existing /maths state)
  const mathProgress = useMathProgress();
  const mathFlags = useMathFlags();
  const mathGoal = useMathGoal();

  // Isolated local stores for any other subject/class
  const [localProgress, setLocalProgressEntry] = useLocalMap<string>(`${storagePrefix}_progress`);
  const [localFlags, setLocalFlagEntry] = useLocalMap<string>(`${storagePrefix}_flags`);
  const [times, setTime] = useLocalMap<number>(`${storagePrefix}_times`);
  const [flashcards, setFlashcard] = useLocalMap<"ok" | "review">(`${storagePrefix}_flashcards`);

  const defaultGoal = subject.dailyGoalDefault ?? 5;
  const [localGoal, setLocalGoalState] = useState<number>(() => {
    const stored = Number(localStorage.getItem(`${storagePrefix}_daily_goal`));
    return Number.isFinite(stored) && stored >= 1 ? normalizeGoal(stored) : defaultGoal;
  });

  const setLocalGoal = useCallback(
    (value: number) => {
      const next = normalizeGoal(value);
      setLocalGoalState(next);
      localStorage.setItem(`${storagePrefix}_daily_goal`, String(next));
    },
    [storagePrefix],
  );

  const toggleLocalProgress = useCallback(
    (id: string) => {
      setLocalProgressEntry(id, localProgress[id] ? undefined : new Date().toISOString());
    },
    [localProgress, setLocalProgressEntry],
  );

  const toggleLocalFlag = useCallback(
    (id: string) => {
      setLocalFlagEntry(id, localFlags[id] ? undefined : new Date().toISOString());
    },
    [localFlags, setLocalFlagEntry],
  );


  const value: SubjectContextValue = {
    subject,
    index,
    basePath,
    storagePrefix,
    locale,
    canChangeLocale: !lockedLocale,
    setLocale,
    t,
    progress: isMathSynced ? mathProgress.progress : localProgress,
    toggleProgress: isMathSynced ? mathProgress.toggle : toggleLocalProgress,
    isLoggedIn: isMathSynced ? mathProgress.isLoggedIn : false,
    flags: isMathSynced ? mathFlags.flags : localFlags,
    toggleFlag: isMathSynced ? mathFlags.toggleFlag : toggleLocalFlag,
    times,
    setTime,
    flashcards,
    setFlashcard,
    goal: isMathSynced ? mathGoal.goal : localGoal,
    setGoal: isMathSynced ? mathGoal.setGoal : setLocalGoal,
  };

  return <SubjectContext.Provider value={value}>{children}</SubjectContext.Provider>;
};

export function useSubject() {
  const ctx = useContext(SubjectContext);
  if (!ctx) throw new Error("useSubject must be used within SubjectProvider");
  return ctx;
}
