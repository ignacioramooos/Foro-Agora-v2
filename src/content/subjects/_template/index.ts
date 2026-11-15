import type { SubjectConfig } from "../types";
import chapitre1 from "./chapters/chapitre-1";
import { templateFormulaire } from "./formulaire";

/**
 * TEMPLATE DE MATIÈRE / CLASSE FORO AGORA
 * ---------------------------------------
 * Pour créer une nouvelle matière (Physique, Chimie, SII, ou la classe d'un professeur) :
 * 1. Duplique ce dossier `_template/` vers `src/content/subjects/<slug>/` (ex: `physique/`).
 * 2. Modifie `slug`, `name`, `fullName`, `professor`, `institution`, `level`, `aiContext`.
 * 3. Ajoute tes chapitres dans `chapters/` et importe-les ci-dessous.
 * 4. Active uniquement les modules utiles dans `features` (les options CPGE comme `kholles`
 *    et `kholleSimulator` sont désactivées par défaut).
 * 5. Enregistre ta matière dans `src/content/subjects/registry.ts`.
 */
export const templateSubject: SubjectConfig = {
  slug: "modele",
  name: "Modèle",
  fullName: "Matière modèle — Exemple de plateforme",
  description:
    "Gabarit prêt à l'emploi pour héberger une nouvelle matière ou la classe d'un professeur sur Foro Agora.",
  professor: "Professeur exemple",
  institution: "Établissement / Ouvert à tous",
  level: "Tout niveau",
  isCpge: false,
  aiContext: "dans cette matière",
  // Laisser par défaut (`fa_subject_<slug>`) pour isoler la progression de chaque classe.
  storagePrefix: "fa_subject_modele",
  dailyGoalDefault: 5,
  features: {
    // Calculatrice graphique Desmos (utile en Maths / Physique, optionnelle ailleurs)
    calculator: true,
    // Séparer Cours et TD par chapitre (utile en CPGE ; mettre `false` pour une liste unifiée)
    coursTdSplit: false,
    // Modules exclusifs CPGE (désactivés par défaut pour les classes générales)
    kholles: false,
    kholleSimulator: false,
    // Outils universels d'entraînement
    formulaire: true,
    assignments: false,
    resources: false,
    printableSheet: true,
    aiPrompt: true,
  },
  chapters: [chapitre1],
  formulaire: templateFormulaire,
};
