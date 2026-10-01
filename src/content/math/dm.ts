import type { MathExercise } from "./types";

export interface Devoir {
  id: string;
  title: string;
  due: string;
  chapter: number;
  docId: string;
  correctionDocId?: string;
  intro?: string;
  /** Ids must never change (saved progress). */
  questions: MathExercise[];
}

export const devoirs: Devoir[] = [
  {
    id: "dm-1",
    title: "DM n°1",
    due: "À rendre pour le 17/09/2026",
    chapter: 1,
    docId: "1hCBDkGOOQieeexzJgAbGFV4KMF-V5eUn",
    correctionDocId: "1hX5NuMAy2ESkfWbkuLRf5V4ysk7QqeaU",
    intro: "Les questions sont indépendantes.",
    questions: [
      { id: "dm1-q1", number: "1", source: "dm", statement: "Montrer par récurrence que pour tout $n \\in \\mathbb{N}^*$ on a $$\\sum_{k=1}^{n} (-1)^k k^2 = (-1)^n \\frac{n(n+1)}{2}.$$" },
      { id: "dm1-q2", number: "2", source: "dm", statement: "Pour chacune des assertions, écrire sa négation puis préciser si l'assertion est vraie ou pas (en justifiant) :\n\n(a) $\\forall x \\in \\left]0;1\\right[,\\ \\exists y \\in \\left]0;1\\right[,\\ y < x$.\n\n(b) $\\forall x \\in \\mathbb{R}_+,\\ x^2 \\geqslant x$.\n\n(c) $\\forall x \\in \\mathbb{R},\\ \\big((\\forall \\varepsilon > 0,\\ x < \\varepsilon) \\Rightarrow x \\leqslant 0\\big)$." },
      { id: "dm1-q3", number: "3", source: "dm", statement: "Soient $$A = \\left\\{ 1 - \\frac{1}{n(n+1)},\\ n \\in \\mathbb{N}^* \\right\\} \\quad \\text{et} \\quad B = \\left\\{ 1 - \\frac{1}{n} + \\frac{1}{m},\\ (n,m) \\in (\\mathbb{N}^*)^2 \\right\\}.$$ Montrer que $A \\subset B$. A-t-on $A = B$ ?" },
      { id: "dm1-q4", number: "4", source: "dm", statement: "Soient $A$, $B$ et $C$ des parties d'un ensemble $E$ telles que $A \\setminus B = A \\setminus C$ et $B \\setminus A = C \\setminus A$. Montrer que $B = C$." },
    ],
  },
];
