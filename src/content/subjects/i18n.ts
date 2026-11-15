export type SubjectLocale = "fr" | "en" | "es" | "pt";

export const LOCALE_LABELS: Record<SubjectLocale, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
  pt: "Português",
};

export interface SubjectStrings {
  nav: {
    daily: string;
    chapters: string;
    tools: string;
    cours: string;
    td: string;
    exercises: string;
    index: string;
    kholles: string;
    simulator: string;
    formulaire: string;
    progression: string;
    assignments: string;
    resources: string;
    printable: string;
    menu: string;
    showMenu: string;
    hideMenu: string;
    allClasses: string;
  };
  practice: {
    title: string;
    today: string;
    dailyMix: string;
    allDone: string;
    signInSync: string;
    exerciseOf: (i: number, total: number) => string;
    shuffle: string;
    backToDaily: string;
    calculator: string;
    close: string;
    previous: string;
    next: string;
    moreExercises: string;
    empty: string;
    phrases: string[];
  };
  card: {
    sources: {
      cours: string;
      exemple: string;
      dm: string;
      bonus: string;
      td: string;
      exo: string;
    };
    chapShort: string;
    question: string;
    exemple: string;
    exercise: string;
    flagAdd: string;
    flagRemove: string;
    showHint: string;
    nextHint: string;
    hintLabel: (n: number, strategy: boolean) => string;
    hintDisclaimer: string;
    showAnswer: string;
    hideAnswer: string;
    answerLabel: string;
    reviewChapter: string;
    copyGemini: string;
    copiedTitle: string;
    copiedDesc: string;
    copyFailedTitle: string;
    copyFailedDesc: string;
    done: string;
    markDone: string;
    geminiPrompt: (aiContext: string, chapterTitle: string, statement: string) => string;
    timerStart: string;
    timerPause: string;
    timerReset: string;
  };
  chapter: {
    notFound: string;
    chapterLabel: (n: number) => string;
    all: string;
    examplesCount: (n: number) => string;
    exercisesLabel: string;
    doneCount: (done: number, total: number) => string;
    jumpTo: string;
    empty: string;
    backToTop: string;
    tabExercises: string;
    tabDocument: string;
    showDoc: string;
    hideDoc: string;
    docCourse: string;
    docTd: string;
  };
  index: {
    title: string;
    summary: (total: number, done: number, flagged: number) => string;
    searchPlaceholder: string;
    allChapters: string;
    allSources: string;
    allStates: string;
    todo: string;
    done: string;
    flagged: string;
    flaggedSection: string;
    allExercises: string;
    results: (n: number) => string;
    noMatch: string;
  };
  progress: {
    eyebrow: string;
    title: string;
    exercisesDone: string;
    dayStreak: (n: number) => string;
    flaggedOpen: string;
    timedPractice: string;
    staleFlags: string;
    avgTime: string;
  };
  planche: {
    eyebrow: string;
    title: string;
    subtitle: (max: number) => string;
    searchPlaceholder: string;
    filterFlags: string;
    filterAll: string;
    noFlags: string;
    noResults: string;
    selectedCount: (n: number, max: number) => string;
    spaceToAnswer: string;
    printPdf: string;
    sheetHeader: string;
    previewEmpty: string;
    remove: string;
  };
  formulaire: {
    eyebrow: string;
    title: string;
    subtitle: (known: number, total: number) => string;
    allSections: string;
    flashcards: string;
    onlyReview: string;
    reveal: string;
    knewIt: string;
    toReview: string;
  };
  assignments: {
    title: string;
    notFound: string;
    questionsDone: (done: number, total: number) => string;
    originalStatement: string;
    correction: string;
    showCorrection: string;
    hideCorrection: string;
    tryFirst: string;
  };
  resources: {
    title: string;
    subtitle: string;
    driveFolder: string;
    bonusTitle: string;
    bonusSubtitle: (count: number) => string;
    bonusPageDesc: string;
    bonusNotFound: string;
    bonusTip: string;
    originalDoc: string;
    backToResources: string;
  };
  exercisePage: {
    backToIndex: string;
    notFound: string;
    viewAssignment: string;
    viewSheet: string;
    previous: string;
    next: string;
  };
  search: {
    title: string;
    ariaLabel: string;
    placeholder: string;
    empty: string;
    hint: string;
  };
  settings: {
    ariaLabel: string;
    title: string;
    description: string;
    dailyGoal: string;
    goalHint: string;
  };
  docViewer: {
    fullscreen: string;
    openDrive: string;
    fallbackPrefix: string;
    fallbackLink: string;
  };
  theme: {
    toLight: string;
    toDark: string;
  };
}

const strings: Record<SubjectLocale, SubjectStrings> = {
  fr: {
    nav: {
      daily: "Aléatoire",
      chapters: "Chapitres",
      tools: "Préparation",
      cours: "Cours",
      td: "TD",
      exercises: "Exercices",
      index: "Index des exercices",
      kholles: "Khôlles",
      simulator: "Khôlle blanche",
      formulaire: "Formulaire",
      progression: "Progression",
      assignments: "Devoirs",
      resources: "Ressources",
      printable: "Planche papier",
      menu: "Menu",
      showMenu: "Afficher le menu",
      hideMenu: "Masquer le menu",
      allClasses: "Toutes les classes",
    },
    practice: {
      title: "Aléatoire",
      today: "Aujourd'hui",
      dailyMix: "Mélange quotidien de tous les chapitres",
      allDone: "C'est fait pour aujourd'hui.",
      signInSync: "Connecte-toi (en haut à droite) pour synchroniser ta série.",
      exerciseOf: (i, t) => `Exercice ${i} sur ${t}`,
      shuffle: "Mélanger",
      backToDaily: "Revenir à la sélection du jour",
      calculator: "Calculatrice",
      close: "Fermer",
      previous: "Précédent",
      next: "Suivant",
      moreExercises: "Plus d'exercices",
      empty: "Aucun exercice pour l'instant.",
      phrases: [
        "La régularité bat le talent.",
        "Un exercice à la fois.",
        "Se tromper, c'est aussi s'entraîner.",
        "Ce qui est dur aujourd'hui sera facile demain.",
        "Cinq exercices. Tous les jours.",
        "Pas besoin d'aller vite, il faut être régulier.",
        "Comprendre vaut mieux que mémoriser.",
      ],
    },
    card: {
      sources: { cours: "Cours", exemple: "Exemple", dm: "DM", bonus: "Bonus", td: "TD", exo: "Exercice" },
      chapShort: "Chap.",
      question: "Question",
      exemple: "Exemple",
      exercise: "Exercice",
      flagAdd: "Marquer pour y revenir",
      flagRemove: "Retirer le drapeau",
      showHint: "Voir un indice",
      nextHint: "Indice suivant",
      hintLabel: (n, strategy) => `Indice ${n} · ${strategy ? "stratégie" : "premier pas"}`,
      hintDisclaimer: "Indices Foro Agora — ils ne viennent pas des documents du professeur.",
      showAnswer: "Voir la réponse",
      hideAnswer: "Masquer la réponse",
      answerLabel: "Réponse",
      reviewChapter: "Revoir le chap.",
      copyGemini: "Copier pour Gemini",
      copiedTitle: "Exercice copié ✓",
      copiedDesc: "Colle-le dans Gemini (Ctrl+V / Cmd+V).",
      copyFailedTitle: "Copie impossible",
      copyFailedDesc: "Copie l'énoncé manuellement puis colle-le dans Gemini.",
      done: "Fait",
      markDone: "Marquer comme fait",
      geminiPrompt: (ctx, chap, stmt) =>
        `Je m'entraîne ${ctx}. Explique-moi pas à pas comment résoudre cet exercice, en justifiant chaque étape et sans sauter de calculs. À la fin, donne-moi un conseil pour les exercices similaires.\n\nChapitre : ${chap}\nExercice : ${stmt}`,
      timerStart: "Lancer le chronomètre",
      timerPause: "Mettre en pause le chronomètre",
      timerReset: "Remettre le chronomètre à zéro",
    },
    chapter: {
      notFound: "Chapitre introuvable.",
      chapterLabel: (n) => `Chapitre ${n}`,
      all: "Tout",
      examplesCount: (n) => `Exemples (${n})`,
      exercisesLabel: "Exercices",
      doneCount: (d, t) => `${d}/${t} faits`,
      jumpTo: "Aller à…",
      empty: "Aucun exercice pour cette partie.",
      backToTop: "Remonter en haut",
      tabExercises: "Exercices",
      tabDocument: "Document",
      showDoc: "Afficher le document",
      hideDoc: "Masquer le document",
      docCourse: "Document du cours",
      docTd: "Document du TD",
    },
    index: {
      title: "Index des exercices",
      summary: (total, done, flagged) => `${total} exercices · ${done} faits · ${flagged} marqués`,
      searchPlaceholder: "Chercher : mot-clé, #42, chapitre…",
      allChapters: "Tous",
      allSources: "Toutes sources",
      allStates: "Tous états",
      todo: "Non faits",
      done: "Faits",
      flagged: "Marqués",
      flaggedSection: "Marqués",
      allExercises: "Tous les exercices",
      results: (n) => `${n} résultat${n > 1 ? "s" : ""}`,
      noMatch: "Aucun exercice ne correspond.",
    },
    progress: {
      eyebrow: "Bilan",
      title: "Progression",
      exercisesDone: "exercices faits",
      dayStreak: (n) => (n > 1 ? "jours d'affilée" : "jour d'affilée"),
      flaggedOpen: "drapeaux à reprendre",
      timedPractice: "temps chronométré",
      staleFlags: "Drapeaux posés il y a plus de 7 jours",
      avgTime: "Temps moyen par exercice chronométré",
    },
    planche: {
      eyebrow: "Mode papier",
      title: "Planche à imprimer",
      subtitle: (max) => `Choisis jusqu'à ${max} exercices, puis imprime ou enregistre en PDF pour t'entraîner sur papier.`,
      searchPlaceholder: "Chercher (numéro, mot…)",
      filterFlags: "Drapeaux",
      filterAll: "Tout",
      noFlags: "Aucun exercice marqué d'un drapeau. Change de filtre.",
      noResults: "Aucun résultat.",
      selectedCount: (n, max) => `${n}/${max} sélectionnés`,
      spaceToAnswer: "Espace pour répondre",
      printPdf: "Imprimer / PDF",
      sheetHeader: "Planche d'entraînement — Nom : ……………………… Date : ………………",
      previewEmpty: "L'aperçu de ta planche apparaîtra ici.",
      remove: "Retirer",
    },
    formulaire: {
      eyebrow: "Révisions",
      title: "Formulaire",
      subtitle: (known, total) =>
        `Les formules à connaître par cœur. En mode flashcards, la formule est cachée : essaie de la retrouver, puis révèle-la. ${known}/${total} sues.`,
      allSections: "Toutes les sections",
      flashcards: "Flashcards",
      onlyReview: "Seulement « à revoir »",
      reveal: "Révéler",
      knewIt: "Je savais",
      toReview: "À revoir",
    },
    assignments: {
      title: "Devoirs",
      notFound: "Devoir introuvable.",
      questionsDone: (d, t) => `${d}/${t} questions faites`,
      originalStatement: "Énoncé original",
      correction: "Corrigé",
      showCorrection: "Afficher le corrigé",
      hideCorrection: "Masquer le corrigé",
      tryFirst: "Essaie d'abord de tout faire seul, puis compare.",
    },
    resources: {
      title: "Ressources",
      subtitle: "Fiches et documents utiles pour toute l'année.",
      driveFolder: "Dossier Google Drive",
      bonusTitle: "Exercices bonus",
      bonusSubtitle: (c) => `${c} fiche${c > 1 ? "s" : ""} d'entraînement avec réponses`,
      bonusPageDesc: "Fiches d'entraînement supplémentaires, avec leurs réponses.",
      bonusNotFound: "Fiche introuvable.",
      bonusTip: "Cherche d'abord seul, puis ouvre « Voir la réponse » pour comparer.",
      originalDoc: "Document original",
      backToResources: "Ressources",
    },
    exercisePage: {
      backToIndex: "Index des exercices",
      notFound: "Exercice introuvable.",
      viewAssignment: "Voir le devoir complet",
      viewSheet: "Voir la fiche complète",
      previous: "Précédent",
      next: "Suivant",
    },
    search: {
      title: "Chercher un exercice",
      ariaLabel: "Chercher un exercice",
      placeholder: "Mot-clé, #42, « chap 3 »…",
      empty: "Aucun exercice trouvé.",
      hint: "Tape un mot de l'énoncé, un numéro (#42) ou un chapitre.",
    },
    settings: {
      ariaLabel: "Ouvrir les paramètres",
      title: "Paramètres",
      description: "Adapte ton rythme de travail quotidien.",
      dailyGoal: "Objectif quotidien",
      goalHint: "Entre 1 et 30 exercices par jour.",
    },
    docViewer: {
      fullscreen: "Plein écran",
      openDrive: "Google Drive",
      fallbackPrefix: "Le document ne s'affiche pas ?",
      fallbackLink: "Ouvre-le dans Google Drive",
    },
    theme: {
      toLight: "Passer au mode clair",
      toDark: "Passer au mode sombre",
    },
  },
  en: {
    nav: {
      daily: "Daily mix",
      chapters: "Chapters",
      tools: "Study tools",
      cours: "Lectures",
      td: "Problem sets",
      exercises: "Exercises",
      index: "Exercise index",
      kholles: "Oral exams",
      simulator: "Oral simulator",
      formulaire: "Formula sheet",
      progression: "Progress",
      assignments: "Assignments",
      resources: "Resources",
      printable: "Printable sheet",
      menu: "Menu",
      showMenu: "Show menu",
      hideMenu: "Hide menu",
      allClasses: "All classes",
    },
    practice: {
      title: "Daily mix",
      today: "Today",
      dailyMix: "Daily mix across all chapters",
      allDone: "All done for today.",
      signInSync: "Sign in (top right) to sync your streak.",
      exerciseOf: (i, t) => `Exercise ${i} of ${t}`,
      shuffle: "Shuffle",
      backToDaily: "Back to today's selection",
      calculator: "Calculator",
      close: "Close",
      previous: "Previous",
      next: "Next",
      moreExercises: "More exercises",
      empty: "No exercises yet.",
      phrases: [
        "Consistency beats talent.",
        "One exercise at a time.",
        "Making mistakes is part of training.",
        "What feels hard today will feel easy tomorrow.",
        "Five exercises. Every day.",
        "No need to rush—just stay consistent.",
        "Understanding beats memorizing.",
      ],
    },
    card: {
      sources: { cours: "Lecture", exemple: "Example", dm: "Homework", bonus: "Bonus", td: "Problem set", exo: "Exercise" },
      chapShort: "Ch.",
      question: "Question",
      exemple: "Example",
      exercise: "Exercise",
      flagAdd: "Flag to revisit later",
      flagRemove: "Remove flag",
      showHint: "Show a hint",
      nextHint: "Next hint",
      hintLabel: (n, strategy) => `Hint ${n} · ${strategy ? "strategy" : "first step"}`,
      hintDisclaimer: "Foro Agora hints — not from the professor's original handout.",
      showAnswer: "Show answer",
      hideAnswer: "Hide answer",
      answerLabel: "Answer",
      reviewChapter: "Review ch.",
      copyGemini: "Copy for Gemini",
      copiedTitle: "Exercise copied ✓",
      copiedDesc: "Paste it into Gemini (Ctrl+V / Cmd+V).",
      copyFailedTitle: "Copy failed",
      copyFailedDesc: "Copy the statement manually and paste it into Gemini.",
      done: "Done",
      markDone: "Mark as done",
      geminiPrompt: (ctx, chap, stmt) =>
        `I am practicing ${ctx}. Explain step by step how to solve this exercise, justifying each step without skipping calculations. At the end, give me a tip for similar exercises.\n\nChapter: ${chap}\nExercise: ${stmt}`,
      timerStart: "Start timer",
      timerPause: "Pause timer",
      timerReset: "Reset timer",
    },
    chapter: {
      notFound: "Chapter not found.",
      chapterLabel: (n) => `Chapter ${n}`,
      all: "All",
      examplesCount: (n) => `Examples (${n})`,
      exercisesLabel: "Exercises",
      doneCount: (d, t) => `${d}/${t} done`,
      jumpTo: "Jump to…",
      empty: "No exercises in this section.",
      backToTop: "Back to top",
      tabExercises: "Exercises",
      tabDocument: "Document",
      showDoc: "Show document",
      hideDoc: "Hide document",
      docCourse: "Lecture notes",
      docTd: "Problem set",
    },
    index: {
      title: "Exercise index",
      summary: (total, done, flagged) => `${total} exercises · ${done} done · ${flagged} flagged`,
      searchPlaceholder: "Search: keyword, #42, chapter…",
      allChapters: "All",
      allSources: "All sources",
      allStates: "All states",
      todo: "To do",
      done: "Done",
      flagged: "Flagged",
      flaggedSection: "Flagged",
      allExercises: "All exercises",
      results: (n) => `${n} result${n !== 1 ? "s" : ""}`,
      noMatch: "No matching exercises.",
    },
    progress: {
      eyebrow: "Overview",
      title: "Progress",
      exercisesDone: "exercises done",
      dayStreak: (n) => (n !== 1 ? "day streak" : "day streak"),
      flaggedOpen: "flagged to review",
      timedPractice: "timed practice",
      staleFlags: "Flagged more than 7 days ago",
      avgTime: "Average time per timed exercise",
    },
    planche: {
      eyebrow: "Paper mode",
      title: "Printable worksheet",
      subtitle: (max) => `Pick up to ${max} exercises, then print or save as PDF to practice on paper.`,
      searchPlaceholder: "Search (number, keyword…)",
      filterFlags: "Flagged",
      filterAll: "All",
      noFlags: "No flagged exercises yet. Change the filter.",
      noResults: "No results.",
      selectedCount: (n, max) => `${n}/${max} selected`,
      spaceToAnswer: "Answer space",
      printPdf: "Print / PDF",
      sheetHeader: "Practice sheet — Name: ……………………… Date: ………………",
      previewEmpty: "Your worksheet preview will appear here.",
      remove: "Remove",
    },
    formulaire: {
      eyebrow: "Review",
      title: "Formula sheet",
      subtitle: (known, total) =>
        `Key formulas to know by heart. In flashcard mode, formulas are hidden: try to recall them, then reveal. ${known}/${total} known.`,
      allSections: "All sections",
      flashcards: "Flashcards",
      onlyReview: "Only \"to review\"",
      reveal: "Reveal",
      knewIt: "Knew it",
      toReview: "Review again",
    },
    assignments: {
      title: "Assignments",
      notFound: "Assignment not found.",
      questionsDone: (d, t) => `${d}/${t} questions done`,
      originalStatement: "Original handout",
      correction: "Solutions",
      showCorrection: "Show solutions",
      hideCorrection: "Hide solutions",
      tryFirst: "Try solving everything on your own first, then compare.",
    },
    resources: {
      title: "Resources",
      subtitle: "Useful handouts and documents for the whole course.",
      driveFolder: "Google Drive folder",
      bonusTitle: "Bonus exercises",
      bonusSubtitle: (c) => `${c} extra practice sheet${c !== 1 ? "s" : ""} with answers`,
      bonusPageDesc: "Extra practice sheets with official answers.",
      bonusNotFound: "Sheet not found.",
      bonusTip: "Try on your own first, then open \"Show answer\" to compare.",
      originalDoc: "Original document",
      backToResources: "Resources",
    },
    exercisePage: {
      backToIndex: "Exercise index",
      notFound: "Exercise not found.",
      viewAssignment: "View full assignment",
      viewSheet: "View full sheet",
      previous: "Previous",
      next: "Next",
    },
    search: {
      title: "Search exercises",
      ariaLabel: "Search exercises",
      placeholder: "Keyword, #42, \"ch 3\"…",
      empty: "No exercises found.",
      hint: "Type a word from the statement, a number (#42), or a chapter.",
    },
    settings: {
      ariaLabel: "Open settings",
      title: "Settings",
      description: "Adjust your daily study pace.",
      dailyGoal: "Daily goal",
      goalHint: "Between 1 and 30 exercises per day.",
    },
    docViewer: {
      fullscreen: "Fullscreen",
      openDrive: "Google Drive",
      fallbackPrefix: "Document not loading?",
      fallbackLink: "Open it in Google Drive",
    },
    theme: {
      toLight: "Switch to light mode",
      toDark: "Switch to dark mode",
    },
  },
  es: {
    nav: {
      daily: "Aleatorio",
      chapters: "Capítulos",
      tools: "Preparación",
      cours: "Teoría",
      td: "Práctica",
      exercises: "Ejercicios",
      index: "Índice de ejercicios",
      kholles: "Exámenes orales",
      simulator: "Simulador oral",
      formulaire: "Formulario",
      progression: "Progreso",
      assignments: "Tareas",
      resources: "Recursos",
      printable: "Hoja imprimible",
      menu: "Menú",
      showMenu: "Mostrar menú",
      hideMenu: "Ocultar menú",
      allClasses: "Todas las clases",
    },
    practice: {
      title: "Aleatorio",
      today: "Hoy",
      dailyMix: "Mezcla diaria de todos los capítulos",
      allDone: "Listo por hoy.",
      signInSync: "Inicia sesión (arriba a la derecha) para sincronizar tu racha.",
      exerciseOf: (i, t) => `Ejercicio ${i} de ${t}`,
      shuffle: "Mezclar",
      backToDaily: "Volver a la selección del día",
      calculator: "Calculadora",
      close: "Cerrar",
      previous: "Anterior",
      next: "Siguiente",
      moreExercises: "Más ejercicios",
      empty: "Aún no hay ejercicios.",
      phrases: [
        "La constancia supera al talento.",
        "Un ejercicio a la vez.",
        "Equivocarse también es entrenar.",
        "Lo que hoy cuesta mañana será fácil.",
        "Cinco ejercicios. Todos los días.",
        "No hace falta ir rápido, sino ser constante.",
        "Entender vale más que memorizar.",
      ],
    },
    card: {
      sources: { cours: "Teoría", exemple: "Ejemplo", dm: "Tarea", bonus: "Bonus", td: "Práctica", exo: "Ejercicio" },
      chapShort: "Cap.",
      question: "Pregunta",
      exemple: "Ejemplo",
      exercise: "Ejercicio",
      flagAdd: "Marcar para repasar",
      flagRemove: "Quitar marca",
      showHint: "Ver una pista",
      nextHint: "Siguiente pista",
      hintLabel: (n, strategy) => `Pista ${n} · ${strategy ? "estrategia" : "primer paso"}`,
      hintDisclaimer: "Pistas Foro Agora — no provienen del material original del profesor.",
      showAnswer: "Ver respuesta",
      hideAnswer: "Ocultar respuesta",
      answerLabel: "Respuesta",
      reviewChapter: "Repasar cap.",
      copyGemini: "Copiar para Gemini",
      copiedTitle: "Ejercicio copiado ✓",
      copiedDesc: "Pégalo en Gemini (Ctrl+V / Cmd+V).",
      copyFailedTitle: "No se pudo copiar",
      copyFailedDesc: "Copia el enunciado manualmente y pégalo en Gemini.",
      done: "Hecho",
      markDone: "Marcar como hecho",
      geminiPrompt: (ctx, chap, stmt) =>
        `Estoy practicando ${ctx}. Explícame paso a paso cómo resolver este ejercicio, justificando cada paso y sin saltar cálculos. Al final, dame un consejo para ejercicios similares.\n\nCapítulo: ${chap}\nEjercicio: ${stmt}`,
      timerStart: "Iniciar cronómetro",
      timerPause: "Pausar cronómetro",
      timerReset: "Reiniciar cronómetro",
    },
    chapter: {
      notFound: "Capítulo no encontrado.",
      chapterLabel: (n) => `Capítulo ${n}`,
      all: "Todo",
      examplesCount: (n) => `Ejemplos (${n})`,
      exercisesLabel: "Ejercicios",
      doneCount: (d, t) => `${d}/${t} hechos`,
      jumpTo: "Ir a…",
      empty: "No hay ejercicios en esta sección.",
      backToTop: "Volver arriba",
      tabExercises: "Ejercicios",
      tabDocument: "Documento",
      showDoc: "Mostrar documento",
      hideDoc: "Ocultar documento",
      docCourse: "Apuntes del curso",
      docTd: "Guía de práctica",
    },
    index: {
      title: "Índice de ejercicios",
      summary: (total, done, flagged) => `${total} ejercicios · ${done} hechos · ${flagged} marcados`,
      searchPlaceholder: "Buscar: palabra clave, #42, capítulo…",
      allChapters: "Todos",
      allSources: "Todas las fuentes",
      allStates: "Todos los estados",
      todo: "Pendientes",
      done: "Hechos",
      flagged: "Marcados",
      flaggedSection: "Marcados",
      allExercises: "Todos los ejercicios",
      results: (n) => `${n} resultado${n !== 1 ? "s" : ""}`,
      noMatch: "Ningún ejercicio coincide.",
    },
    progress: {
      eyebrow: "Resumen",
      title: "Progreso",
      exercisesDone: "ejercicios hechos",
      dayStreak: (n) => (n !== 1 ? "días seguidos" : "día seguido"),
      flaggedOpen: "marcados para repasar",
      timedPractice: "tiempo cronometrado",
      staleFlags: "Marcados hace más de 7 días",
      avgTime: "Tiempo promedio por ejercicio cronometrado",
    },
    planche: {
      eyebrow: "Modo papel",
      title: "Hoja para imprimir",
      subtitle: (max) => `Elige hasta ${max} ejercicios e imprime o guarda en PDF para practicar en papel.`,
      searchPlaceholder: "Buscar (número, palabra…)",
      filterFlags: "Marcados",
      filterAll: "Todo",
      noFlags: "No hay ejercicios marcados. Cambia el filtro.",
      noResults: "Sin resultados.",
      selectedCount: (n, max) => `${n}/${max} seleccionados`,
      spaceToAnswer: "Espacio para responder",
      printPdf: "Imprimir / PDF",
      sheetHeader: "Hoja de práctica — Nombre: ……………………… Fecha: ………………",
      previewEmpty: "La vista previa de tu hoja aparecerá aquí.",
      remove: "Quitar",
    },
    formulaire: {
      eyebrow: "Repaso",
      title: "Formulario",
      subtitle: (known, total) =>
        `Fórmulas clave para recordar. En modo flashcards, la fórmula se oculta: intenta recordarla y luego revélala. ${known}/${total} sabidas.`,
      allSections: "Todas las secciones",
      flashcards: "Flashcards",
      onlyReview: "Solo «a repasar»",
      reveal: "Revelar",
      knewIt: "La sabía",
      toReview: "Repasar",
    },
    assignments: {
      title: "Tareas",
      notFound: "Tarea no encontrada.",
      questionsDone: (d, t) => `${d}/${t} preguntas hechas`,
      originalStatement: "Enunciado original",
      correction: "Solución",
      showCorrection: "Ver solución",
      hideCorrection: "Ocultar solución",
      tryFirst: "Intenta resolverlo por tu cuenta primero y luego compara.",
    },
    resources: {
      title: "Recursos",
      subtitle: "Guías y documentos útiles para todo el curso.",
      driveFolder: "Carpeta de Google Drive",
      bonusTitle: "Ejercicios bonus",
      bonusSubtitle: (c) => `${c} ficha${c !== 1 ? "s" : ""} extra con respuestas`,
      bonusPageDesc: "Fichas de entrenamiento adicionales con sus respuestas.",
      bonusNotFound: "Ficha no encontrada.",
      bonusTip: "Intenta primero por tu cuenta y luego abre «Ver respuesta» para comparar.",
      originalDoc: "Documento original",
      backToResources: "Recursos",
    },
    exercisePage: {
      backToIndex: "Índice de ejercicios",
      notFound: "Ejercicio no encontrado.",
      viewAssignment: "Ver tarea completa",
      viewSheet: "Ver ficha completa",
      previous: "Anterior",
      next: "Siguiente",
    },
    search: {
      title: "Buscar ejercicio",
      ariaLabel: "Buscar ejercicio",
      placeholder: "Palabra clave, #42, «cap 3»…",
      empty: "No se encontraron ejercicios.",
      hint: "Escribe una palabra del enunciado, un número (#42) o un capítulo.",
    },
    settings: {
      ariaLabel: "Abrir configuración",
      title: "Configuración",
      description: "Ajusta tu ritmo de trabajo diario.",
      dailyGoal: "Objetivo diario",
      goalHint: "Entre 1 y 30 ejercicios por día.",
    },
    docViewer: {
      fullscreen: "Pantalla completa",
      openDrive: "Google Drive",
      fallbackPrefix: "¿No carga el documento?",
      fallbackLink: "Ábrelo en Google Drive",
    },
    theme: {
      toLight: "Cambiar a modo claro",
      toDark: "Cambiar a modo oscuro",
    },
  },
  pt: {
    nav: {
      daily: "Aleatório",
      chapters: "Capítulos",
      tools: "Preparação",
      cours: "Teoria",
      td: "Listas",
      exercises: "Exercícios",
      index: "Índice de exercícios",
      kholles: "Provas orais",
      simulator: "Simulador oral",
      formulaire: "Formulário",
      progression: "Progresso",
      assignments: "Trabalhos",
      resources: "Recursos",
      printable: "Folha para imprimir",
      menu: "Menu",
      showMenu: "Mostrar menu",
      hideMenu: "Ocultar menu",
      allClasses: "Todas as turmas",
    },
    practice: {
      title: "Aleatório",
      today: "Hoje",
      dailyMix: "Mistura diária de todos os capítulos",
      allDone: "Tudo feito por hoje.",
      signInSync: "Entre na sua conta (canto superior direito) para sincronizar sua sequência.",
      exerciseOf: (i, t) => `Exercício ${i} de ${t}`,
      shuffle: "Embaralhar",
      backToDaily: "Voltar à seleção do dia",
      calculator: "Calculadora",
      close: "Fechar",
      previous: "Anterior",
      next: "Próximo",
      moreExercises: "Mais exercícios",
      empty: "Nenhum exercício por enquanto.",
      phrases: [
        "A constância vence o talento.",
        "Um exercício de cada vez.",
        "Errar também faz parte do treino.",
        "O que hoje é difícil amanhã será fácil.",
        "Cinco exercícios. Todos os dias.",
        "Não precisa ter pressa, basta ter regularidade.",
        "Entender vale mais que decorar.",
      ],
    },
    card: {
      sources: { cours: "Teoria", exemple: "Exemplo", dm: "Trabalho", bonus: "Bônus", td: "Lista", exo: "Exercício" },
      chapShort: "Cap.",
      question: "Questão",
      exemple: "Exemplo",
      exercise: "Exercício",
      flagAdd: "Marcar para revisar",
      flagRemove: "Remover marcação",
      showHint: "Ver uma dica",
      nextHint: "Próxima dica",
      hintLabel: (n, strategy) => `Dica ${n} · ${strategy ? "estratégia" : "primeiro passo"}`,
      hintDisclaimer: "Dicas Foro Agora — não vêm do material original do professor.",
      showAnswer: "Ver resposta",
      hideAnswer: "Ocultar resposta",
      answerLabel: "Resposta",
      reviewChapter: "Revisar cap.",
      copyGemini: "Copiar para Gemini",
      copiedTitle: "Exercício copiado ✓",
      copiedDesc: "Cole no Gemini (Ctrl+V / Cmd+V).",
      copyFailedTitle: "Falha ao copiar",
      copyFailedDesc: "Copie o enunciado manualmente e cole no Gemini.",
      done: "Feito",
      markDone: "Marcar como feito",
      geminiPrompt: (ctx, chap, stmt) =>
        `Estou praticando ${ctx}. Explique passo a passo como resolver este exercício, justificando cada etapa e sem pular cálculos. No final, dê uma dica para exercícios semelhantes.\n\nCapítulo: ${chap}\nExercício: ${stmt}`,
      timerStart: "Iniciar cronômetro",
      timerPause: "Pausar cronômetro",
      timerReset: "Zerar cronômetro",
    },
    chapter: {
      notFound: "Capítulo não encontrado.",
      chapterLabel: (n) => `Capítulo ${n}`,
      all: "Tudo",
      examplesCount: (n) => `Exemplos (${n})`,
      exercisesLabel: "Exercícios",
      doneCount: (d, t) => `${d}/${t} feitos`,
      jumpTo: "Ir para…",
      empty: "Nenhum exercício nesta seção.",
      backToTop: "Voltar ao topo",
      tabExercises: "Exercícios",
      tabDocument: "Documento",
      showDoc: "Mostrar documento",
      hideDoc: "Ocultar documento",
      docCourse: "Notas de aula",
      docTd: "Lista de exercícios",
    },
    index: {
      title: "Índice de exercícios",
      summary: (total, done, flagged) => `${total} exercícios · ${done} feitos · ${flagged} marcados`,
      searchPlaceholder: "Buscar: palavra-chave, #42, capítulo…",
      allChapters: "Todos",
      allSources: "Todas as fontes",
      allStates: "Todos os estados",
      todo: "Pendentes",
      done: "Feitos",
      flagged: "Marcados",
      flaggedSection: "Marcados",
      allExercises: "Todos os exercícios",
      results: (n) => `${n} resultado${n !== 1 ? "s" : ""}`,
      noMatch: "Nenhum exercício corresponde.",
    },
    progress: {
      eyebrow: "Resumo",
      title: "Progresso",
      exercisesDone: "exercícios feitos",
      dayStreak: (n) => (n !== 1 ? "dias seguidos" : "dia seguido"),
      flaggedOpen: "marcados para revisar",
      timedPractice: "tempo cronometrado",
      staleFlags: "Marcados há mais de 7 dias",
      avgTime: "Tempo médio por exercício cronometrado",
    },
    planche: {
      eyebrow: "Modo papel",
      title: "Folha para imprimir",
      subtitle: (max) => `Escolha até ${max} exercícios e imprima ou salve em PDF para praticar no papel.`,
      searchPlaceholder: "Buscar (número, palavra…)",
      filterFlags: "Marcados",
      filterAll: "Tudo",
      noFlags: "Nenhum exercício marcado. Altere o filtro.",
      noResults: "Sem resultados.",
      selectedCount: (n, max) => `${n}/${max} selecionados`,
      spaceToAnswer: "Espaço para responder",
      printPdf: "Imprimir / PDF",
      sheetHeader: "Folha de treino — Nome: ……………………… Data: ………………",
      previewEmpty: "A pré-visualização da sua folha aparecerá aqui.",
      remove: "Remover",
    },
    formulaire: {
      eyebrow: "Revisão",
      title: "Formulário",
      subtitle: (known, total) =>
        `Fórmulas essenciais para saber de cor. No modo flashcards, a fórmula fica oculta: tente lembrar e depois revele. ${known}/${total} sabidas.`,
      allSections: "Todas as seções",
      flashcards: "Flashcards",
      onlyReview: "Apenas «revisar»",
      reveal: "Revelar",
      knewIt: "Eu sabia",
      toReview: "Revisar",
    },
    assignments: {
      title: "Trabalhos",
      notFound: "Trabalho não encontrado.",
      questionsDone: (d, t) => `${d}/${t} questões feitas`,
      originalStatement: "Enunciado original",
      correction: "Gabarito",
      showCorrection: "Ver gabarito",
      hideCorrection: "Ocultar gabarito",
      tryFirst: "Tente resolver tudo sozinho primeiro e depois compare.",
    },
    resources: {
      title: "Recursos",
      subtitle: "Materiais e documentos úteis para todo o curso.",
      driveFolder: "Pasta do Google Drive",
      bonusTitle: "Exercícios bônus",
      bonusSubtitle: (c) => `${c} lista${c !== 1 ? "s" : ""} extra com respostas`,
      bonusPageDesc: "Listas extras de treino com respostas.",
      bonusNotFound: "Lista não encontrada.",
      bonusTip: "Tente primeiro sozinho e depois abra «Ver resposta» para comparar.",
      originalDoc: "Documento original",
      backToResources: "Recursos",
    },
    exercisePage: {
      backToIndex: "Índice de exercícios",
      notFound: "Exercício não encontrado.",
      viewAssignment: "Ver trabalho completo",
      viewSheet: "Ver lista completa",
      previous: "Anterior",
      next: "Próximo",
    },
    search: {
      title: "Buscar exercício",
      ariaLabel: "Buscar exercício",
      placeholder: "Palabra-chave, #42, «cap 3»…",
      empty: "Nenhum exercício encontrado.",
      hint: "Digite uma palavra do enunciado, um número (#42) ou um capítulo.",
    },
    settings: {
      ariaLabel: "Abrir configurações",
      title: "Configurações",
      description: "Adapte seu ritmo diário de estudo.",
      dailyGoal: "Meta diária",
      goalHint: "Entre 1 e 30 exercícios por dia.",
    },
    docViewer: {
      fullscreen: "Tela cheia",
      openDrive: "Google Drive",
      fallbackPrefix: "O documento não carregou?",
      fallbackLink: "Abra no Google Drive",
    },
    theme: {
      toLight: "Mudar para modo claro",
      toDark: "Mudar para modo escuro",
    },
  },
};

export const getSubjectStrings = (locale: SubjectLocale = "fr"): SubjectStrings =>
  strings[locale] ?? strings.fr;
