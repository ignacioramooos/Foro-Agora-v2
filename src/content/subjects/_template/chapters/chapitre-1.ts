import type { SubjectChapter } from "../../types";

const chapitre1: SubjectChapter = {
  id: "chapitre-1",
  number: 1,
  title: "Premier chapitre (exemple)",
  summary: "Introduction et exercices fondamentaux.",
  // Optionnel : documents Google Drive associés au chapitre
  // docs: {
  //   cours: { id: "GOOGLE_DRIVE_FILE_ID", title: "Chapitre 1 — Cours" },
  //   td: { id: "GOOGLE_DRIVE_FILE_ID", title: "Chapitre 1 — TD" },
  // },
  exercises: [
    {
      // IMPORTANT : ne jamais modifier l'id une fois publié (la progression des élèves en dépend).
      id: "template-ch1-ex1",
      number: "1",
      source: "exo",
      statement:
        "Calculer l'énergie cinétique d'un solide de masse $m = 2\\,\\text{kg}$ se déplaçant à la vitesse $v = 3\\,\\text{m}\\cdot\\text{s}^{-1}$ :\n$$E_c = \\frac{1}{2} m v^2$$",
      hints: [
        "Vérifie que les unités sont bien dans le Système International (kg et m/s).",
        "Remplace $m$ par $2$ et $v$ par $3$ dans la formule.",
      ],
      answer: "$E_c = \\frac{1}{2} \\times 2 \\times 3^2 = 9\\,\\text{J}$.",
    },
    {
      id: "template-ch1-ex2",
      number: "2",
      source: "exo",
      statement:
        "Résoudre sur $\\mathbb{R}$ l'équation différentielle suivante :\n$$y'(t) + 2 y(t) = 0, \\qquad y(0) = 5.$$",
      hints: [
        "C'est une équation différentielle linéaire du premier ordre à coefficients constants.",
      ],
      answer: "$y(t) = 5 e^{-2t}$ pour tout $t \\in \\mathbb{R}$.",
    },
  ],
};

export default chapitre1;
