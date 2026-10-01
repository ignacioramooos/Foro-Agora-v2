import type { MathExercise } from "../types";

const r = String.raw;

// ============ Chapitre 3 — Exercices du COURS ============
export const chapitre3CoursExercises: MathExercise[] = [
  {
    id: "ch3-cours-ex1",
    number: "1",
    source: "cours",
    statement: r`Pour chacun des systèmes linéaires suivants, préciser le nombre d'équations, le nombre d'inconnues puis résoudre le système.
$$(S_1) \begin{cases} 2x_1 - 4x_2 = 8 \\ -x_1 + 2x_2 = -1 \end{cases} \qquad (S_2) \begin{cases} 2x_1 - 2x_2 = 0 \\ x_1 - x_2 = 0 \end{cases} \qquad (S_3) \begin{cases} x_1 - 2x_2 = 4 \\ 2x_1 + x_2 = 5 \end{cases}$$`,
  },
  {
    id: "ch3-cours-ex2",
    number: "2",
    source: "cours",
    statement: r`Utiliser la méthode du pivot de Gauss pour résoudre le système suivant :
$$(S_2) \begin{cases} x_1 + x_2 \qquad\ - 3x_4 = -1 \\ -x_1 + x_2 - 3x_3 + 2x_4 = -2 \\ x_1 + 2x_2 \qquad\ - 5x_4 = -1 \end{cases}$$`,
  },
];

// ============ Chapitre 4 — Exercices du COURS ============
export const chapitre4CoursExercises: MathExercise[] = [
  {
    id: "ch4-cours-ex1",
    number: "1",
    source: "cours",
    statement: r`Parmi les sommes suivantes, donner celles qui sont égales à $\displaystyle\sum_{i=0}^{n} \frac{1}{2n-i}$ :
$$\sum_{k=n}^{2n} \frac{1}{k}, \qquad \sum_{k=0}^{n} \frac{1}{n+k}, \qquad \sum_{i=-n}^{0} \frac{1}{n-i}$$`,
  },
  {
    id: "ch4-cours-ex2",
    number: "2",
    source: "cours",
    statement: r`Combien y a-t-il d'entiers entre $11$ et $22$ ?`,
  },
  {
    id: "ch4-cours-ex3",
    number: "3",
    source: "cours",
    statement: r`Donner la valeur de $\displaystyle\sum_{k=0}^{100} 10$.`,
  },
  {
    id: "ch4-cours-ex4",
    number: "4",
    source: "cours",
    statement: r`Calculer pour $n \in \mathbb{N}^*$, la somme $\displaystyle S_n = \sum_{k=1}^{n} \ln\left(1 + \frac{1}{k}\right)$.`,
  },
  {
    id: "ch4-cours-ex5",
    number: "5",
    source: "cours",
    statement: r`Pour $n \in \mathbb{N}$, $n \geqslant 2$, calculer $\displaystyle\sum_{k=2}^{n} \frac{1}{k(k-1)}$ (on transformera judicieusement $\displaystyle\frac{1}{k(k-1)}$...).`,
  },
  {
    id: "ch4-cours-ex6",
    number: "6",
    source: "cours",
    statement: r`Écrire avec le symbole $\displaystyle\prod$ les produits suivants :
• $P_1 = 1^2 \times 2^2 \times \cdots \times 99^2 \times 100^2$
• $P_2 = 1 \times 3 \times 5 \times \cdots \times 27 \times 29$`,
  },
  {
    id: "ch4-cours-ex7",
    number: "7",
    source: "cours",
    statement: r`Écrire avec des points de suspension les produits suivants :
• $\displaystyle\prod_{k=5}^{20} (2k^3)$
• $\displaystyle\prod_{i=1}^{100} \frac{i}{i+1}$`,
  },
  {
    id: "ch4-cours-ex8",
    number: "8",
    source: "cours",
    statement: r`Simplifier l'expression $\dfrac{5!\,3!}{4!\,2!}$.`,
  },
  {
    id: "ch4-cours-ex9",
    number: "9",
    source: "cours",
    statement: r`Pour $n \in \mathbb{N}^*$, simplifier l'expression $\dfrac{(2n+1)!\,n!}{(n+1)!\,(2n)!}$.`,
  },
  {
    id: "ch4-cours-ex10",
    number: "10",
    source: "cours",
    statement: r`Simplifier $\displaystyle\prod_{k=1}^{n} \frac{k(k+2)}{(k+1)^2}$.`,
  },
  {
    id: "ch4-cours-ex11",
    number: "11",
    source: "cours",
    statement: r`Calculer $(x+1)^3$, $(x-1)^3$, $(x+2)^4$.`,
  },
  {
    id: "ch4-cours-ex12",
    number: "12",
    source: "cours",
    statement: r`Exprimer, pour tout $n$ de $\mathbb{N}^*$ : $\displaystyle\sum_{i=1}^{n} \sum_{j=1}^{n} ij$ en fonction de $n$.`,
  },
  {
    id: "ch4-cours-ex13",
    number: "13",
    source: "cours",
    statement: r`Calculer $\displaystyle\sum_{i=1}^{n} \sum_{j=1}^{n} (i+j)$.`,
  },
  {
    id: "ch4-cours-ex14",
    number: "14",
    source: "cours",
    statement: r`Soit $n \in \mathbb{N}$. Calculer $\displaystyle\sum_{p=0}^{n} \sum_{k=0}^{p} \binom{p}{k}$.`,
  },
  {
    id: "ch4-cours-ex15",
    number: "15",
    source: "cours",
    statement: r`Calculer $\displaystyle\sum_{1 \leq i \leq j \leq n} \frac{i}{j}$.`,
  },
  {
    id: "ch4-cours-ex16",
    number: "16",
    source: "cours",
    statement: r`Calculer $\displaystyle\sum_{\substack{1 \leq i \leq p \\ 1 \leq j \leq q}} 2^{i+j}$.`,
  },
];
