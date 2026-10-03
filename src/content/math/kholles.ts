export interface KholleWeek {
  id: string;
  /** Monday of the week, YYYY-MM-DD. */
  start: string;
  label: string;
  docId: string;
  scope: { chapter: number; text: string }[];
  incontournables: { text: string; chapter?: number }[];
}

// Add a new week at the top of this list.
export const kholleWeeks: KholleWeek[] = [
  {
    id: "2026-10-05",
    start: "2026-10-05",
    label: "Semaine du 05/10/2026",
    docId: "1xSOaBTzFSbyU3i1KuAdX0o0eizWQrUq7",
    scope: [
      { chapter: 5, text: "Le chapitre 5 : Les nombres réels, en entier" },
      { chapter: 6, text: "Le chapitre 6 : Les nombres complexes, jusqu'au paragraphe II.D inclus" },
    ],
    incontournables: [
      { chapter: 5, text: "Toute partie non vide de $\\mathbb{N}$ admet un plus petit élément (avec démonstration)." },
      { chapter: 5, text: "Caractérisation des parties bornées (avec la démonstration)" },
      { chapter: 5, text: "Caractérisation de la borne supérieure, de la borne inférieure" },
      { chapter: 6, text: "Inégalité triangulaire dans $\\mathbb{C}$ (avec la démonstration)" },
      { chapter: 6, text: "Fonctions trigonométriques : propriétés, étude et courbe représentative" },
    ],
  },
  {
    id: "2026-09-28",
    start: "2026-09-28",
    label: "Semaine du 28/09/2026",
    docId: "1xMFTS7c-Kn44EL_9kfgiTwqF--7qLP4t",
    scope: [
      { chapter: 4, text: "Chapitre 4 : Sommes et produits, en entier." },
      { chapter: 5, text: "Chapitre 5 : Les nombres réels, jusqu'au paragraphe II.D inclus." },
    ],
    incontournables: [
      { chapter: 4, text: "Triangle de Pascal, propriétés remarquables." },
      { chapter: 4, text: "Formule du binôme de Newton (avec démonstration) : $(a+b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^k b^{n-k}$." },
      { chapter: 5, text: "Valeur absolue : définition et propriétés (avec démonstration de l'inégalité triangulaire $|x+y| \\leqslant |x| + |y|$)." },
      { chapter: 5, text: "Partie entière d'un nombre réel : définition et propriétés ($\\lfloor x \\rfloor \\leqslant x < \\lfloor x \\rfloor + 1$)." },
    ],
  },
  {
    id: "2026-09-21",
    start: "2026-09-21",
    label: "Semaine du 21/09/2026",
    docId: "1kOW5P7a_zImfDUnhWbbOFmWMW0v_q9AY",
    scope: [
      { chapter: 2, text: "Chapitre 2 : Ensembles, applications, relations, en entier." },
      { chapter: 3, text: "Chapitre 3 : Systèmes linéaires, en entier." },
    ],
    incontournables: [
      { chapter: 2, text: "Injection, surjection, bijection (définitions)." },
      { chapter: 2, text: "Soient $f : E \\to F$ et $g : F \\to G$. Si $f$ et $g$ sont injectives, $g \\circ f$ est injective." },
      { chapter: 2, text: "Soient $f : E \\to F$ et $g : F \\to G$. Si $f$ et $g$ sont surjectives, $g \\circ f$ est surjective." },
      { chapter: 2, text: "Relation d'équivalence, classe d'équivalence, exemples." },
      { chapter: 2, text: "Définition d'une relation d'ordre, ordre partiel, ordre total." },
    ],
  },
  {
    id: "2026-09-14",
    start: "2026-09-14",
    label: "Semaine du 14/09/2026",
    docId: "1IGGq9kqSv7yKBMnIiTaJgtwk4yiQUWMR",
    scope: [
      { chapter: 1, text: "Chapitre 1 : Logique et raisonnements mathématiques, en entier." },
      { chapter: 2, text: "Chapitre 2 : Ensembles, applications et relations, jusqu'au paragraphe V inclus." },
    ],
    incontournables: [
      { chapter: 1, text: "Montrer que : $n^2$ pair $\\Rightarrow$ $n$ pair (ch. 1, exercice 14)." },
      { chapter: 1, text: "Résoudre dans $\\mathbb{R}$ l'équation : $|x+3| - |x-1| - |2x+1| = 0$ (ch. 1, exercice 17)." },
      { chapter: 2, text: "Lois de Morgan (avec la démonstration)." },
      { chapter: 2, text: "Image directe d'une partie $A$ d'un ensemble $E$ par une application $f : E \\to F$, image réciproque d'une partie $B$ d'un ensemble $F$ par une application $f : E \\to F$." },
    ],
  },
];

export const KHOLLE_NOTE = "Les étudiants seront interrogés pendant 1 heure sur une question de cours et sur des exercices d'application. NB : un cours non su entraînera une note inférieure à 10/20.";
