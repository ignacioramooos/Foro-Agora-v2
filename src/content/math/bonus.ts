import type { MathExercise } from "./types";

/**
 * Bonus training sheets (Ressources → Exercices bonus).
 * Statements and answers are copied verbatim from the original documents.
 * Ids must never change (saved progress references them).
 */
export interface BonusSheet {
  id: string;
  title: string;
  description: string;
  chapter: number;
  docId: string;
  questions: MathExercise[];
  /** Official answers from the document, keyed by question id. */
  answers: Record<string, string>;
}

const DERIV_INTRO = "Entraînement : Calculs de dérivées\n\nPour chacune des fonctions suivantes, déterminer sur quel domaine elle est dérivable et calculer sa dérivée :";

const derivFns: [string, string, string][] = [
  ["a", "a(x) = \\dfrac{\\cos x}{x^2 - 4}", "$\\mathbb{R} \\setminus \\{-2; 2\\}$, $a'(x) = \\dfrac{-(x^2 - 4)\\sin x - 2x\\cos x}{(x^2 - 4)^2}$"],
  ["b", "b(x) = (e^x + x^2)\\ln(x)", "$\\mathbb{R}_+^*$, $b'(x) = (e^x + 2x)\\ln(x) + \\dfrac{e^x + x^2}{x}$"],
  ["c", "c(x) = \\dfrac{5x^4}{3 + \\sqrt{x}}", "$\\mathbb{R}_+^*$, $c'(x) = \\dfrac{5x^3(24 + 7\\sqrt{x})}{2(3 + \\sqrt{x})^2}$"],
  ["d", "d(x) = \\cos(3x - 5)", "$\\mathbb{R}$, $d'(x) = -3\\sin(3x - 5)$"],
  ["e", "e(x) = \\ln(-x)", "$\\mathbb{R}_-^*$, $e'(x) = \\dfrac{1}{x}$"],
  ["f", "f(x) = e^{3x^2 + \\sin x}", "$\\mathbb{R}$, $f'(x) = (6x + \\cos x)e^{3x^2 + \\sin x}$"],
  ["g", "g(x) = \\ln\\left(\\dfrac{2x}{x - 1}\\right)", "$]-\\infty, 0[\\cup]1, +\\infty[$, $g'(x) = \\dfrac{-1}{x(x - 1)}$"],
  ["h", "h(x) = e^{x - 7}", "$\\mathbb{R}$, $h'(x) = e^{x - 7}$"],
  ["i", "i(x) = \\sqrt{x^2 - 6x + 8}", "$]-\\infty, 2[\\cup]4, +\\infty[$, $i'(x) = \\dfrac{x - 3}{\\sqrt{x^2 - 6x + 8}}$"],
  ["j", "j(x) = (\\tan x)^4", "$\\mathcal{D}_{\\tan}$, $j'(x) = 4(1 + \\tan^2 x)\\tan^3 x$"],
  ["k", "k(x) = \\sqrt{\\dfrac{1 - x}{1 + x}}", "$]-1; 1[$, $k'(x) = \\dfrac{-1}{(1 + x)\\sqrt{1 - x^2}}$"],
  ["l", "\\ell(x) = \\tan(5x + 2)", "$\\mathbb{R} \\setminus \\left\\{\\dfrac{\\pi}{10} - \\dfrac{2}{5} + \\dfrac{k\\pi}{5},\\ k \\in \\mathbb{Z}\\right\\}$, $\\ell'(x) = \\dfrac{5}{\\cos^2(5x + 2)}$"],
  ["m", "m(x) = x\\ln x - x", "$\\mathbb{R}_+^*$, $m'(x) = \\ln x$"],
  ["n", "n(x) = \\ln\\left((1 + x^2)e^x\\right)", "$\\mathbb{R}$, $n'(x) = \\dfrac{(1 + x)^2}{1 + x^2}$"],
  ["o", "o(x) = \\ln\\left(\\sqrt{x^2 + 3} - x\\right)", "$\\mathbb{R}$, $o'(x) = -\\dfrac{1}{\\sqrt{x^2 + 3}}$"],
  ["p", "p(x) = 4^x", "$\\mathbb{R}$, $p'(x) = 2\\ln(2)\\,4^x$"],
  ["q", "q(x) = (2x + 1)^{x + 3}", "$\\left]-\\dfrac{1}{2}; +\\infty\\right[$, $q'(x) = \\big((2x + 1)\\ln(2x + 1) + (2x + 6)\\big)(2x + 1)^{x + 2}$"],
  ["r", "r(x) = (\\ln x)^{\\ln x}", "$]1; +\\infty[$, $r'(x) = \\dfrac{\\ln(\\ln x) + 1}{x}(\\ln x)^{\\ln x}$"],
  ["s", "s(x) = \\operatorname{th} x - \\dfrac{1}{3}\\operatorname{th}^3 x", "$\\mathbb{R}$, $s'(x) = (1 - \\operatorname{th}^2 x)^2$"],
  ["t", "t(x) = \\ln(\\operatorname{ch} x)", "$\\mathbb{R}$, $t'(x) = \\operatorname{th} x$"],
  ["u", "u(x) = \\arccos\\left(\\sin(x)\\right)", "$\\mathbb{R} \\setminus \\left\\{-\\dfrac{\\pi}{2} + 2k\\pi; \\dfrac{\\pi}{2} + 2k\\pi\\right\\}$, $u'(x) = -\\dfrac{\\cos(x)}{|\\cos(x)|}$ (à simplifier en prenant garde)"],
  ["v", "v(x) = \\arccos\\left(\\dfrac{1 - x^2}{1 + x^2}\\right)", "$\\mathbb{R}^*$, $v'(x) = \\dfrac{2x}{|x|(1 + x^2)}$ (à simplifier en prenant garde)"],
  ["w", "w(x) = \\arcsin\\left(\\operatorname{th}(x)\\right)", "$\\mathbb{R}$, $w'(x) = \\sqrt{1 - \\operatorname{th}^2(x)}$"],
  ["y", "y(x) = \\arctan\\sqrt{x}", "$\\mathbb{R}_+^*$, $y'(x) = \\dfrac{1}{2\\sqrt{x}(1 + x)}$"],
  ["z", "z(x) = \\arctan\\left(\\dfrac{3x + 4}{2x - 6}\\right)", "$\\mathbb{R} \\setminus \\{3\\}$, $z'(x) = \\dfrac{-2}{x^2 + 4}$"],
];

export const bonusSheets: BonusSheet[] = [
  {
    id: "derivees",
    title: "Entraînement : Calculs de dérivées",
    description: "25 fonctions : domaine de dérivabilité et dérivée, avec les réponses.",
    chapter: 8,
    docId: "16_byluyRsyGAW-AJYzgx3YqWuTNB8ckh",
    questions: derivFns.map(([k, fn]) => ({
      id: `bonus-derivees-${k}`,
      number: k === "l" ? "ℓ" : k,
      source: "bonus" as const,
      statement: `${DERIV_INTRO}\n\n$$${fn}$$`,
    })),
    answers: Object.fromEntries(derivFns.map(([k, , ans]) => [`bonus-derivees-${k}`, ans])),
  },
];

export const bonusAnswers: Record<string, string> = Object.assign({}, ...bonusSheets.map((s) => s.answers));
export const bonusSheetIdFor = (exerciseId: string) => bonusSheets.find((s) => s.questions.some((q) => q.id === exerciseId))?.id;
