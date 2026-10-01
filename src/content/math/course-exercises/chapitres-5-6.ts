import type { MathExercise } from "../types";

// ============================================================
// Chapitre 5 — Exercices de cours (source: 'cours') — c5.pdf
// ============================================================

const r = String.raw;

export const chapitre5CoursExercises: MathExercise[] = [
  { id: "ch5-cours-ex1", number: "1", source: "cours", statement: r`Sans étude de fonction, montrer que pour tout $x > 0$ on a $x + \dfrac{1}{x} \geqslant 2$.` },
  { id: "ch5-cours-ex2", number: "2", source: "cours", statement: r`Résoudre dans $\mathbb{R}$ l'inéquation $x - 1 \leqslant \sqrt{x+2}$ d'inconnue $x$.` },
  { id: "ch5-cours-ex3", number: "3", source: "cours", statement: r`Montrer que : $\forall n \in \mathbb{N}^*, \forall x_1, x_2, \ldots, x_n \in \mathbb{R}$ :
$$\left|\sum_{i=1}^{n} x_i\right| \leqslant \sum_{i=1}^{n} |x_i|$$` },
  { id: "ch5-cours-ex4", number: "4", source: "cours", statement: r`Sans étudier de fonction :
1. Donner un encadrement indépendant de $x$ de $\dfrac{3x-2}{x+1}$ sachant que $1 \leqslant x \leqslant 2$.
2. Donner une majoration indépendante de $a$ de $\dfrac{a-1}{a+2}$ sachant que $-1 \leqslant a \leqslant 2$.
3. Donner une majoration indépendante de $x$ de $\dfrac{x^2-x-2}{x+2}$ sachant que $x \in [1; 3]$.` },
  { id: "ch5-cours-ex5", number: "5", source: "cours", statement: r`Montrer par récurrence que pour tout $x \in \mathbb{R}$ et pour tout $n \in \mathbb{N}$ on a $|\sin(nx)| \leqslant n|\sin(x)|$.` },
  { id: "ch5-cours-ex6", number: "6", source: "cours", statement: r`Soit $f$ la fonction définie sur $\mathbb{R}$ : $x \mapsto \lfloor x \rfloor$. Tracer la représentation graphique de $f$ dans un repère orthonormé direct. Quelle remarque peut-on faire ?` },
  { id: "ch5-cours-ex7", number: "7", source: "cours", statement: r`Montrer que pour tout $(x,y) \in \mathbb{R}^2$, on a :
1. $\lfloor x+y \rfloor = \lfloor x \rfloor + \lfloor y \rfloor$ ou $\lfloor x+y \rfloor = \lfloor x \rfloor + \lfloor y \rfloor + 1$
2. $\lfloor \lfloor x \rfloor + y \rfloor = \lfloor x \rfloor + \lfloor y \rfloor$` },
  { id: "ch5-cours-ex8", number: "8", source: "cours", statement: r`Écrire la définition mathématique de la proposition : $A$ est une partie de $\mathbb{R}$ non majorée.` },
  { id: "ch5-cours-ex9", number: "9", source: "cours", statement: r`Pour les parties de $\mathbb{R}$ suivantes, justifier l'existence éventuelle et déterminer, le cas échéant, leur borne supérieure et leur borne inférieure :
1. $A = \left\{ \dfrac{n^2}{3n+1},\ n \in \mathbb{N} \right\}$.
2. $B = \left\{ x + \dfrac{1}{x},\ x \in \mathbb{R}_+^* \right\}$.
3. $C = \left\{ \dfrac{n}{mn+1},\ n \in \mathbb{N}^*, m \in \mathbb{N}^* \right\}$.` },
  { id: "ch5-cours-ex10", number: "10", source: "cours", statement: r`Soient $A$ et $B$ deux parties non vides de $\mathbb{R}$ telles que : $\forall (a,b) \in A \times B,\ a \leqslant b$.
1. Montrer que $\sup A$ et $\inf B$ existent.
2. Montrer que $\sup A \leqslant \inf B$.` },
  { id: "ch5-cours-ex11", number: "11", source: "cours", statement: r`Soient $A$ et $B$ deux parties non vides de $\mathbb{R}$ majorées. On note $A+B = \{a+b,\ a \in A,\ b \in B\}$. Montrer que $\sup(A+B)$ existe et que $\sup(A+B) = \sup(A) + \sup(B)$.` },
  { id: "ch5-cours-ex12", number: "12", source: "cours", statement: r`Montrer que $\sqrt{2} + \sqrt{3}$ est irrationnel.` },
];

// ============================================================
// Chapitre 6 — Exercices de cours (source: 'cours') — c6.pdf
// ============================================================

export const chapitre6CoursExercises: MathExercise[] = [
  { id: "ch6-cours-ex1", number: "1", source: "cours", statement: r`Soit $n \in \mathbb{N}$. Calculer pour $z \neq 1$ : $\displaystyle\sum_{k=0}^{n} k z^k$ à l'aide d'une somme double.` },
  { id: "ch6-cours-ex2", number: "2", source: "cours", statement: r`Calculer : $\dfrac{1}{3+2i}$, puis $\dfrac{1+i}{2-5i}$.` },
  { id: "ch6-cours-ex3", number: "3", source: "cours", statement: r`1. Décrire géométriquement l'ensemble des affixes des nombres complexes $z$ tels que $|z-a| = r$, où $a \in \mathbb{C}$ et $r \in \mathbb{R}_+^*$.
2. Même question avec l'inéquation $|z-a| \leqslant r$.` },
  { id: "ch6-cours-ex4", number: "4", source: "cours", statement: r`Soient $z_1, z_2, \ldots, z_n \in \mathbb{C}$ tels que : $\forall k \in \{1, 2, \ldots, n\},\ |z_k| \leqslant 1$ et $\dfrac{z_1+z_2+\cdots+z_n}{n} = 1$. Montrer que $\forall k \in \{1, 2, \ldots, n\},\ z_k = 1$.` },
  { id: "ch6-cours-ex5", number: "5", source: "cours", statement: r`Étudier la fonction cotan et tracer sa courbe représentative dans un repère orthonormé.` },
  { id: "ch6-cours-ex6", number: "6", source: "cours", statement: r`Résoudre l'équation :
$$\cos(x) + \sqrt{3}\sin(x) = \sqrt{2}$$` },
  { id: "ch6-cours-ex7", number: "7", source: "cours", statement: r`Montrer que $\forall x \in \mathbb{R}, |\cos(x) + \sin(x)| \leqslant \sqrt{2}$.` },
  { id: "ch6-cours-ex8", number: "8", source: "cours", statement: r`Linéariser $\cos^3(x)$ et $\sin^4(x)$. En déduire $\displaystyle\int_0^{\pi} \sin^4(x)\,dx$.` },
  { id: "ch6-cours-ex9", number: "9", source: "cours", statement: r`Exprimer $\cos(3\theta)$ en fonction de $\cos(\theta)$ et $\cos^3(\theta)$.` },
  { id: "ch6-cours-ex10", number: "10", source: "cours", statement: r`Écrire sous forme trigonométrique le nombre complexe : $z = 1 + \cos(\theta) + i\sin(\theta)$, avec $\theta \in\, ]-\pi, \pi[$.` },
  { id: "ch6-cours-ex11", number: "11", source: "cours", statement: r`Soit $x \in \mathbb{R}$ et $n \in \mathbb{N}$. Calculer les sommes suivantes :
$$A_n(x) = \sum_{k=0}^{n} \cos(kx), \qquad B_n(x) = \sum_{k=0}^{n} \sin(kx)$$
$$C_n(x) = \sum_{k=0}^{n} \binom{n}{k} \cos(kx), \qquad D_n(x) = \sum_{k=0}^{n} \binom{n}{k} \sin(kx)$$` },
  { id: "ch6-cours-ex12", number: "12", source: "cours", statement: r`[Noyau de Dirichlet] Soient $a$ et $b$ des réels, vérifiant $b \not\equiv 0\ [2\pi]$. Calculer $C = \cos(a) + \cos(a+b) + \cos(a+2b) + \cdots + \cos(a+nb)$.` },
  { id: "ch6-cours-ex13", number: "13", source: "cours", statement: r`Calculer $\displaystyle\sum_{k=0}^{n-1} (1+\omega_k)^n$, où $\omega_k = e^{2ik\pi/n}$, avec $n \in \mathbb{N}^*$.` },
  { id: "ch6-cours-ex14", number: "14", source: "cours", statement: r`Résoudre dans $\mathbb{C}$ l'équation : $e^z + 2e^{-z} = -2$.` },
  { id: "ch6-cours-ex15", number: "15", source: "cours", statement: r`Soient $A$ d'affixe $1-i$ et $B$ d'affixe $2+i$.
1. Déterminer l'équation de la droite $(AB)$.
2. Déterminer l'affixe d'un point $C$ tel que le triangle $ABC$ est rectangle en $B$.` },
  { id: "ch6-cours-ex16", number: "16", source: "cours", statement: r`Déterminer l'écriture complexe des transformations du plan suivantes :
1. La translation de vecteur d'affixe $3 + \dfrac{1}{2}i$.
2. La rotation de centre d'affixe $1 - 2i$ et d'angle $\dfrac{\pi}{3}$.
3. L'homothétie de centre d'affixe $-1 + 2i$ et de rapport $\dfrac{3}{2}$.
4. La similitude directe de centre d'affixe $1+i$, d'angle $\dfrac{\pi}{4}$ et de rapport $2$.` },
];
