import type { MathExercise } from "../types";

const r = String.raw;

// =====================================================================
// Chapitre 1 — Exercices du COURS (c1.pdf)
// =====================================================================
export const ch1CoursExercises: MathExercise[] = [
  { id: "ch1-cours-ex1", number: "1", source: "cours", statement: r`Ecrire « en français » les phrases suivantes.
1. $\forall x \in [1, +\infty[,\ x^2 \geq 1$.
2. $\exists n \in \mathbb{N},\ n > 100$.
3. $\exists! x \in \mathbb{R},\ x^2 - 2x + 1 = 0$.` },

  { id: "ch1-cours-ex2", number: "2", source: "cours", statement: r`Ecrire avec des quantificateurs les phrases suivantes.
1. « Quel que soit l'entier naturel $n$, $n^2$ est supérieur ou égal à $n$ ».
2. « Il existe un unique entier naturel $n$ tel que $\dfrac{n(n+1)}{2}$ soit égal à 2 ».` },

  { id: "ch1-cours-ex3", number: "3", source: "cours", statement: r`Quelle est la négation de la proposition : "Tous les élèves de cette classe font d'un instrument" ? Celle de la proposition "il existe un élève de prépa qui mesure strictement moins d'un mètre" ?` },

  { id: "ch1-cours-ex4", number: "4", source: "cours", statement: r`1. Quelle est la proposition contraire de « $\forall x \in \mathbb{R},\ 3x^2 - 1 \geq 0$ » ?
2. Quelle est la proposition contraire de « $\exists n \in \mathbb{N},\ 2^n = n + 1$ » ?` },

  { id: "ch1-cours-ex5", number: "5", source: "cours", statement: r`Montrer que la proposition « $\forall n \in \mathbb{N},\ 2^n \leq n + 1$ » est fausse.` },

  { id: "ch1-cours-ex6", number: "6", source: "cours", statement: r`Dresser la table de vérité des propositions $P$, $Q$, $(P \text{ ou } Q)$ et $(P \text{ et } Q)$.` },

  { id: "ch1-cours-ex7", number: "7", source: "cours", statement: r`« $\forall x \in \mathbb{R},\ x = x^2 \Rightarrow x \geq 0$ » est une proposition vraie. La condition suffisante est "$x = x^2$", la condition nécessaire est "$x \geq 0$". L'implication réciproque est-elle vraie ?` },

  { id: "ch1-cours-ex8", number: "8", source: "cours", statement: r`Quelle est la négation de "Je suis en prépa donc je travaille beaucoup" ?` },

  { id: "ch1-cours-ex9", number: "9", source: "cours", statement: r`Écrire la table de vérité de $(P \vee Q) \wedge R$ et celle de $P \Rightarrow (Q \wedge R)$.` },

  { id: "ch1-cours-ex10", number: "10", source: "cours", statement: r`Compléter par $\Rightarrow$, $\Leftarrow$ ou $\Leftrightarrow$.
1. $x = 1 \quad \ldots \quad x^2 = 1$.
2. $(u_n)_{n\in\mathbb{N}}$ est arithmétique de raison 2 et $u_0 = 5 \quad \ldots \quad u_3 = 11$.
3. Soit $x \in \mathbb{R}$. $x^2 - 2x + 1 = 0 \quad \ldots \quad x = 1$.` },

  { id: "ch1-cours-ex11", number: "11", source: "cours", statement: r`Soient deux réels $a$ et $b$. Montrer que : $(\forall n \in \mathbb{N},\ a^{2n} + b^{3n} = 0) \Leftrightarrow (a = b = 0)$.` },

  { id: "ch1-cours-ex12", number: "12", source: "cours", statement: r`Montrer que pour tout $x \in [1, +\infty[$, $(3x+2)^2 + 5x - 5 \geq 0$.` },

  { id: "ch1-cours-ex13", number: "13", source: "cours", statement: r`Montrer que tout nombre divisible par 3 a la somme de ses chiffres divisible par 3.` },

  { id: "ch1-cours-ex14", number: "14", source: "cours", statement: r`Soit $n \in \mathbb{N}$. Montrer l'implication suivante : $n^2$ pair $\Rightarrow$ $n$ pair.` },

  { id: "ch1-cours-ex15", number: "15", source: "cours", statement: r`Soit $x$ un réel différent de $-3$. Montrer que $\dfrac{x+1}{x+3} \neq 1$.` },

  { id: "ch1-cours-ex16", number: "16", source: "cours", statement: r`Montrons que pour tout $n \in \mathbb{Z}$, $n(n+1)$ est pair.` },

  { id: "ch1-cours-ex17", number: "17", source: "cours", statement: r`Résoudre dans $\mathbb{R}$ l'équation : $|x+3| - |x-1| - |2x+1| = 0$.` },

  { id: "ch1-cours-ex18", number: "18", source: "cours", statement: r`Déterminer l'ensemble des fonctions $f : \mathbb{R} \to \mathbb{R}$ pour lesquelles
$$\forall x, y \in \mathbb{R} : f(y - f(x)) = 2 - x - y.$$` },

  { id: "ch1-cours-ex19", number: "19", source: "cours", statement: r`Montrer que pour tout $n \in \mathbb{N}$, on a pour tout $x \in \mathbb{R}^+$, $(1+x)^n \geq 1 + nx$.` },

  { id: "ch1-cours-ex20", number: "20", source: "cours", statement: r`Montrer que la proposition $(\forall n \in \mathbb{N},\ 2^n > n^2)$ est fausse.
Montrer en revanche que pour tout entier $n \geq 5$, $2^n > n^2$.` },

  { id: "ch1-cours-ex21", number: "21", source: "cours", statement: r`Montrer par récurrence forte que tout entier naturel supérieur ou égal à 2 est divisible par un nombre premier.` },
];

// =====================================================================
// Chapitre 2 — Exercices du COURS (c2.pdf)
// =====================================================================
export const ch2CoursExercises: MathExercise[] = [
  { id: "ch2-cours-ex1", number: "1", source: "cours", statement: r`1. Écrire l'ensemble $A$ contenant les 5 premiers entiers naturels.
2. Ecrire l'ensemble $B$ des entiers relatifs plus grands que $-\sqrt{2}$.
3. Écrire de deux façons différentes l'ensemble des entiers naturels pairs.` },

  { id: "ch2-cours-ex2", number: "2", source: "cours", statement: r`Ecrire plus simplement les ensembles suivants :
$$A = \{x \in \mathbb{R}\ |\ x^2 < 7\}$$
$$B = \{z \in \mathbb{C}\ |\ \overline{z} = z\}$$
$$C = \{M \in \mathcal{P}\ |\ \overrightarrow{MA} \cdot \overrightarrow{MB} = 0\},\ \text{où } \mathcal{P} \text{ désigne l'ensemble des points du plan.}$$` },

  { id: "ch2-cours-ex3", number: "3", source: "cours", statement: r`Soient $A = \{4, 5, 7\}$ et $B = \{1, 2, 3, 4, 5, 6, 7\}$.
• $A$ et $B$ sont-ils égaux ?
• Quel ensemble est inclus dans l'autre ?
• Donner un ensemble qui contient $B$.` },

  { id: "ch2-cours-ex4", number: "4", source: "cours", statement: r`On considère les ensembles $S = \{x \in \mathbb{R},\ x \geq 3\}$ et $T = \{x \in \mathbb{R},\ (x-1)(x-3) \geq 0\}$. Montrer que $S \subset T$.` },

  { id: "ch2-cours-ex5", number: "5", source: "cours", statement: r`Montrer que $\{x^2 / x \in \mathbb{R}\} = \{y \in \mathbb{R} / y \geq 0\}$.` },

  { id: "ch2-cours-ex6", number: "6", source: "cours", statement: r`Soit $F = \{1, 2, 3\}$. Déterminer $\mathcal{P}(F)$.` },

  { id: "ch2-cours-ex7", number: "7", source: "cours", statement: r`Soit $E$ un ensemble. Qu'est-ce que l'ensemble $E \cup E$ ? $E \cup \varnothing$ ?` },

  { id: "ch2-cours-ex8", number: "8", source: "cours", statement: r`Soient $A_1 = \{1, 2, 3, 6\}$, $A_2 = \{2, 6, 7\}$, $A_3 = \{2, 6, 8\}$ et $A_4 = \{1, 2, 6, 7, 8\}$. Donner
$$\bigcup_{i=1}^{4} A_i = A_1 \cup A_2 \cup A_3 \cup A_4.$$` },

  { id: "ch2-cours-ex9", number: "9", source: "cours", statement: r`Soit $E$ un ensemble. Qu'est-ce que l'ensemble $E \cap E$ ? $E \cap \varnothing$ ?` },

  { id: "ch2-cours-ex10", number: "10", source: "cours", statement: r`En reprenant l'exercice 8, donner $\displaystyle\bigcap_{i=1}^{3} A_i$.` },

  { id: "ch2-cours-ex11", number: "11", source: "cours", statement: r`Soient $A$ et $B$ deux ensembles. Simplifier $A \cap (B \cup A)$.` },

  { id: "ch2-cours-ex12", number: "12", source: "cours", statement: r`Montrer que :
1. $A \setminus B = \varnothing$ si $A \subset B$.
2. $A = (A \setminus B) \cup (A \cap B)$ (réunion disjointe).
3. $(A \cup B) \setminus C = (A \setminus C) \cup (B \setminus C)$.` },

  { id: "ch2-cours-ex13", number: "13", source: "cours", statement: r`Soient $E = [0, 1]$ et $A = ]0, 0.2]$, quel est le complémentaire de $A$ dans $E$ ?` },

  { id: "ch2-cours-ex14", number: "14", source: "cours", statement: r`Dans $\mathbb{R}$, donner le complémentaire de $[3, 5]$.` },

  { id: "ch2-cours-ex15", number: "15", source: "cours", statement: r`Dans l'ensemble $E$ des fonctions définies sur $\mathbb{R}$ à valeurs dans $\mathbb{R}$, trouver le complémentaire :
• Du sous-ensemble $A \subset E$ formé des fonctions $f$ telles que $f(2) = 0$ ;
• Du sous-ensemble $B \subset E$ formé des fonctions paires.` },

  { id: "ch2-cours-ex16", number: "16", source: "cours", statement: r`Soit $V$ l'ensemble de toutes les villes du monde. On considère les trois sous-ensembles de $V$ suivants : $F$ l'ensemble des villes françaises, $C$ l'ensemble des capitales de pays et $B$ l'ensemble des villes dont le nom commence par B. Donner plusieurs éléments des ensembles suivants :
$$F \cap B,\quad C \cap B,\quad F \cap C,\quad C \cap B^c,\quad F \cap C \cap B,\quad F^c \cap C^c \cap B$$` },

  { id: "ch2-cours-ex17", number: "17", source: "cours", statement: r`Soit $f$ une application de $A$ dans $B$. Que vaut $f \circ \mathrm{Id}_A$ ? et $\mathrm{Id}_B \circ f$ ?` },

  { id: "ch2-cours-ex18", number: "18", source: "cours", statement: r`L'application $f$ définie par
$$f : \mathbb{R} \to \mathbb{R},\quad x \mapsto x^2$$
est-elle injective ?` },

  { id: "ch2-cours-ex19", number: "19", source: "cours", statement: r`Montrer que $f : \mathbb{R} \setminus \{1\} \to \mathbb{R},\ x \mapsto \dfrac{x+1}{x-1}$ est injective.` },

  { id: "ch2-cours-ex20", number: "20", source: "cours", statement: r`Montrer que $u : \mathbb{N} \to \mathbb{R},\ n \mapsto n^2 + 1$ est injective.` },

  { id: "ch2-cours-ex21", number: "21", source: "cours", statement: r`L'application $f_2 : \mathbb{R} \to \mathbb{R},\ x \mapsto 3(x-1)(x+5)$ est-elle injective ?` },

  { id: "ch2-cours-ex22", number: "22", source: "cours", statement: r`Soient $f : E \to F$ et $g : F \to G$. Montrer que si $g \circ f$ est injective, alors $f$ l'est.` },

  { id: "ch2-cours-ex23", number: "23", source: "cours", statement: r`Les applications suivantes sont-elles surjectives ?
$$f_1 : \mathbb{R} \to \mathbb{R},\ x \mapsto x^2 \qquad f_2 : \mathbb{R} \to \mathbb{R}^+,\ x \mapsto x^2 \qquad f_3 : \mathbb{R} \to\, ]1, +\infty[,\ x \mapsto (e^x)^2 + 1 \qquad u : \mathbb{N} \to \mathbb{N},\ n \mapsto n+1$$` },

  { id: "ch2-cours-ex24", number: "24", source: "cours", statement: r`Soient $f : E \to F$ et $g : F \to G$. Montrer que si $g \circ f$ est surjective, alors $g$ l'est.` },

  { id: "ch2-cours-ex25", number: "25", source: "cours", statement: r`La fonction $f_3$ définie dans un exemple précédent par
$$f_3 : \mathbb{R} \to\, ]1, +\infty[,\quad x \mapsto (e^x)^2 + 1$$
était surjective. Est-elle bijective ?` },

  { id: "ch2-cours-ex26", number: "26", source: "cours", statement: r`Les fonctions affines sont-elles bijectives ?` },

  { id: "ch2-cours-ex27", number: "27", source: "cours", statement: r`Déterminer la bijection réciproque de l'application $f : \mathbb{R} \to \mathbb{R}$ définie par $f(x) = 2x + 1$.` },

  { id: "ch2-cours-ex28", number: "28", source: "cours", statement: r`Soient $f : A \to B$ et $g : B \to A$. Montrer que si $g \circ f$ est injective et $f \circ g$ surjective, alors $f$ et $g$ sont bijectives.` },

  { id: "ch2-cours-ex29", number: "29", source: "cours", statement: r`Si $f_1, \ldots, f_n$ sont des applications de $E \to \mathbb{R}$, déterminer une fonction qui majore les $f_i$, pour tout $i \in \{1, \ldots, n\}$.` },
];
