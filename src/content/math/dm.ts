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
    id: "dm-2",
    title: "DM n°2",
    due: "À rendre pour le 08/10/2026",
    chapter: 4,
    docId: "1I-fxsEXbZn5HloCtTrT5Lg9Xe_jibhfC",
    questions: [
      { id: "dm2-e1q1", number: "1.1", source: "dm", statement: "**Exercice 1 - Des comparaisons de moyennes**\n\nDans cet exercice, $n$ est un entier naturel non nul.\n\n1. *Inégalité de Tchebychev* - On considère des réels $x_1 \\geq \\dots \\geq x_n$ et $y_1 \\geq \\dots \\geq y_n$.\n\n(a) Montrer que pour tout couple $(i,j) \\in [\\![1,n]\\!]^2$, $(x_i - x_j)(y_i - y_j) \\geq 0$.\n\n(b) En déduire que : $$n\\sum_{i=1}^{n} x_i y_i - \\left(\\sum_{i=1}^{n} x_i\\right)\\left(\\sum_{i=1}^{n} y_i\\right) \\geq 0.$$\n\n(c) En conclure que : $$\\frac{1}{n}\\sum_{i=1}^{n} x_i y_i \\geq \\left(\\frac{1}{n}\\sum_{i=1}^{n} x_i\\right)\\left(\\frac{1}{n}\\sum_{i=1}^{n} y_i\\right).$$" },
      { id: "dm2-e1q2", number: "1.2", source: "dm", statement: "**Exercice 1 - Des comparaisons de moyennes**\n\nDans cet exercice, $n$ est un entier naturel non nul.\n\n2. *Inégalité de Steffensen* - On considère des réels $x_1 \\geq \\dots \\geq x_n \\geq 0$ et $y_1, \\dots, y_n$ appartenant à $[0,1]$. Soit $k \\in [\\![1,n]\\!]$ tel que $\\displaystyle\\sum_{i=1}^{n} y_i \\leq k$.\n\n(a) Montrer que $$\\sum_{i=1}^{n} x_i y_i = \\sum_{i=1}^{k} x_i - \\sum_{i=1}^{k} x_i(1-y_i) + \\sum_{i=k+1}^{n} x_i y_i.$$\n\n(b) Etablir que $$\\sum_{i=k+1}^{n} x_i y_i \\leq x_k \\sum_{i=k+1}^{n} y_i \\quad \\text{et que} \\quad \\sum_{i=1}^{k} x_i(1-y_i) \\geq x_k \\sum_{i=1}^{k} (1-y_i).$$\n\n(c) En conclure que : $$\\frac{1}{n}\\sum_{i=1}^{n} x_i y_i \\leq \\frac{1}{n}\\sum_{i=1}^{k} x_i.$$" },
      { id: "dm2-e1q3", number: "1.3", source: "dm", statement: "**Exercice 1 - Des comparaisons de moyennes**\n\nDans cet exercice, $n$ est un entier naturel non nul.\n\n3. *Application* - Dans cette question $n \\geq 2$. Soit $x_1 \\geq \\dots \\geq x_n \\geq 0$ des réels non tous nuls.\n\n(a) Montrer que : $$\\sum_{i=1}^{n} x_i \\leq \\sqrt{n}\\sqrt{\\sum_{i=1}^{n} x_i^2}.$$\n\n(b) On note, pour tout $x$ réel, $\\lceil x \\rceil$ le plus petit entier $k$ tel que $x \\leq k$.\n\nÉtablir que : $2 \\leq \\lceil \\sqrt{n}\\, \\rceil \\leq n$ (on pourra remarquer que $\\lceil \\sqrt{n}\\, \\rceil = p+1$ avec $p \\in \\mathbb{N}^*$ et $p^2+1 \\leq n$).\n\n(c) En déduire que : $$\\frac{1}{n}\\sum_{i=1}^{n} x_i \\leq \\sqrt{\\frac{1}{n}\\sum_{i=1}^{n} x_i^2} \\leq \\frac{1}{\\sqrt{n}}\\sum_{i=1}^{\\lceil \\sqrt{n}\\, \\rceil} x_i.$$" },
      { id: "dm2-e2q1", number: "2.1", source: "dm", statement: "**Exercice 2 - (facultatif) Polynômes factoriels ascendants**\n\nPour tous $x$ réel et $k \\in \\mathbb{N}$, on définit la notation $x^{[k]}$ par : $$x^{[k]} = \\begin{cases} \\displaystyle\\prod_{i=0}^{k-1} (x+i) & \\text{si } k \\neq 0 \\\\ 1 & \\text{si } k = 0 \\end{cases}$$\n\n1. (a) Établir que pour tous $x$ réel et $k$ entier naturel : $x^{[k+1]} = x(x+1)^{[k]} = (x+k)x^{[k]}$\n\n(b) Montrer que, pour tous $x$ réel, $n$ entier naturel : $$\\sum_{k=0}^{n} \\frac{x^{[k]}}{k!} = \\frac{(x+1)^{[n]}}{n!}$$\n\n(c) Montrer que si $p$ et $k$ sont deux entiers naturels, $\\binom{p+k}{p} = \\dfrac{(p+1)^{[k]}}{k!}$. En déduire que, pour tout $(n,p) \\in \\mathbb{N}^2$ avec $p \\leq n$ : $$\\sum_{i=p}^{n} \\binom{i}{p} = \\sum_{k=0}^{n-p} \\binom{p+k}{p} = \\binom{n+1}{p+1}$$" },
      { id: "dm2-e2q2", number: "2.2", source: "dm", statement: "**Exercice 2 - (facultatif) Polynômes factoriels ascendants**\n\nPour tous $x$ réel et $k \\in \\mathbb{N}$, on définit la notation $x^{[k]}$ par : $$x^{[k]} = \\begin{cases} \\displaystyle\\prod_{i=0}^{k-1} (x+i) & \\text{si } k \\neq 0 \\\\ 1 & \\text{si } k = 0 \\end{cases}$$\n\n2. (a) Établir que pour tous $x$ et $y$ réels, $k$ et $n$ entiers naturels tels que $k \\leq n$ : $$(x+y+n)x^{[k]}y^{[n-k]} = x^{[k+1]}y^{[n-k]} + x^{[k]}y^{[n-k+1]}$$\n\n(b) Démontrer que, pour tous $x$ et $y$ réels, $n$ entier naturel : $$(x+y)^{[n]} = \\sum_{k=0}^{n} \\binom{n}{k} x^{[k]} y^{[n-k]} \\quad \\text{(Identité de Norlund)}$$" },
    ],
  },
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
