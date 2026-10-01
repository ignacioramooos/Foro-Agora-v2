import type { MathChapter } from "../types";
import { ch2CoursExercises } from "../course-exercises/chapitres-1-2";

const r = String.raw;

const chapter: MathChapter = {
  id: "chapitre-2",
  number: 2,
  title: "Ensembles, applications et relations",
  summary: "Opérations sur les ensembles, injectivité, surjectivité, bijectivité, fonctions indicatrices, relations d'ordre et d'équivalence.",
  pdfUrl: "/practica/c2.pdf",
  exercises: [
    ...ch2CoursExercises,
    { id: "ch2-ex1", number: "1", statement: r`Soit $x$ un objet quelconque. Expliciter les ensembles $\mathcal{P}(\{x\})$ et $\mathcal{P}\big(\mathcal{P}(\{x\})\big)$.` },
    { id: "ch2-ex2", number: "2", statement: r`Montrer que :
$$\left\{ x \in \mathbb{R},\ \exists n \in \mathbb{N}^*,\ x \geq \frac{1}{n} \right\} = \,]0, +\infty[.$$` },
    { id: "ch2-ex3", number: "3", statement: r`Soient $E$ un ensemble et $A$, $B$ et $C$ trois parties de $E$. Simplifier les expressions suivantes :
$$A \cap \big(\overline{A} \cup B\big),\quad A \cup \big(\overline{A} \cap B\big),\quad A \cap \big(\overline{A} \cup B\big) \cap \big(\overline{A} \cup \overline{B} \cup C\big),\quad A \cup \big(\overline{A} \cap B\big) \cup \big(\overline{A} \cap \overline{B} \cap C\big)$$` },
    { id: "ch2-ex4", number: "4", statement: r`Soient $A$ et $B$ deux parties d'un ensemble $E$. On appelle différence symétrique de $A$ et $B$, notée $A \Delta B$, l'ensemble $(A \setminus B) \cup (B \setminus A)$.
1. Montrer que : $A \Delta B = (A \cup B) \setminus (A \cap B)$.
2. Montrer que : $\overline{A} \Delta \overline{B} = A \Delta B$.` },
    { id: "ch2-ex5", number: "5", statement: r`Soient $A$, $B$ et $C$ trois ensembles vérifiant $A \cap B = A \cap C$ et $A \cup B = A \cup C$. Montrer qu'on a : $B = C$.` },
    { id: "ch2-ex6", number: "6", statement: r`Soient $f : \mathbb{N} \to \mathbb{N}$ et $g : \mathbb{N} \to \mathbb{N}$ les applications définies par :
$$\forall k \in \mathbb{N},\ f(k) = 2k \quad \text{et} \quad g(k) = \begin{cases} k/2 & \text{si } k \text{ est pair} \\ (k-1)/2 & \text{si } k \text{ est impair} \end{cases}$$
1. Étudier l'injectivité, la surjectivité et la bijectivité de $f$ et de $g$.
2. Préciser les applications $g \circ f$ et $f \circ g$.
3. Étudier leur injectivité, surjectivité et bijectivité.` },
    { id: "ch2-ex7", number: "7", statement: r`Soit $A$ une partie d'un ensemble $E$. On rappelle que la fonction indicatrice de $A$ dans $E$ est l'application $\mathbb{1}_A : E \to \mathbb{R}$ définie par :
$$\mathbb{1}_A(x) = \begin{cases} 1 & \text{si } x \in A \\ 0 & \text{sinon} \end{cases}$$
De quels ensembles les fonctions suivantes sont-elles les fonctions indicatrices ?
a) $\min(\mathbb{1}_A, \mathbb{1}_B)$ b) $\max(\mathbb{1}_A, \mathbb{1}_B)$ c) $\mathbb{1}_A \cdot \mathbb{1}_B$
d) $1 - \mathbb{1}_A$ e) $\mathbb{1}_A + \mathbb{1}_B - \mathbb{1}_A \cdot \mathbb{1}_B$ f) $(\mathbb{1}_A - \mathbb{1}_B)^2$` },
    { id: "ch2-ex8", number: "8", statement: r`On définit une relation $\mathcal{R}$ sur $\mathbb{N}^*$ : pour $(a,b) \in (\mathbb{N}^*)^2$, on a $a \mathcal{R} b$ si et seulement s'il existe $n \in \mathbb{N}$ tel que $a = b^n$. La relation $\mathcal{R}$ est-elle réflexive, symétrique, antisymétrique, transitive ?` },
    { id: "ch2-ex9", number: "9", statement: r`$\leqslant$ désignant l'ordre usuel sur $\mathbb{R}$, on définit sur $\mathbb{R}^2$ la relation $\mathcal{L}$ suivante :
$$(x,y)\,\mathcal{L}\,(x',y') \iff \begin{cases} x < x' \\ \text{ou} \\ (x = x' \text{ et } y \leqslant y'). \end{cases}$$
1. Soit $(x_0, y_0) \in \mathbb{R}^2$. Visualiser dans le plan l'ensemble des $(x,y) \in \mathbb{R}^2$ tels que $(x_0,y_0)\,\mathcal{L}\,(x,y)$.
2. Montrer que $\mathcal{L}$ est un ordre sur $\mathbb{R}^2$. Il est appelé ordre lexicographique ; pourquoi ?
3. Montrer que $\mathcal{L}$ est total.` },
    { id: "ch2-ex10", number: "10", statement: r`Soit $\mathcal{P}$ le plan affine et $O$ un point de $\mathcal{P}$.
1. On définit la relation $\mathcal{R}$ sur $\mathcal{P} \setminus \{O\}$ par : $M \mathcal{R} N$ si et seulement si $O, M, N$ sont alignés. Montrer que $\mathcal{R}$ est une relation d'équivalence. Pour $M \in \mathcal{P} \setminus \{O\}$ donné, donner la classe d'équivalence de $M$.
2. La même relation est-elle encore une relation d'équivalence sur $\mathcal{P}$ ?` },
    { id: "ch2-ex11", number: "11", statement: r`Dans $E = \mathbb{Z} \times (\mathbb{Z}^*)$ on définit la relation binaire : $(m,n)\,\mathcal{S}\,(p,q)$ lorsque $mq = np$. Montrer que $\mathcal{S}$ est une relation d'équivalence. Déterminer la classe d'équivalence de $(4,6)$.` },
    { id: "ch2-ex12", number: "12", statement: r`Soit $E$ un ensemble. On note $Bij(E)$ l'ensemble des bijections de $E$ dans $E$. On définit la relation $\mathcal{R}$ sur $\mathcal{F}(E,E)$ par : $f \mathcal{R} g$ si et seulement s'il existe $\varphi \in Bij(E)$ telle que $f \circ \varphi = \varphi \circ g$.
1. Montrer que $\mathcal{R}$ est une relation d'équivalence.
2. Pour $f \in \mathcal{F}(E,E)$ donnée, donner la classe d'équivalence de $f$ (pour $\mathcal{R}$).` },
    { id: "ch2-ex13", number: "13", statement: r`Soit $f : \mathbb{R} \to \mathbb{R}$ une application injective. On définit sur $\mathbb{R}$ une relation binaire $\preceq$ par : $\forall (x,y) \in \mathbb{R}^2$, $x \preceq y$ lorsque $f(x) \leq f(y)$. Montrer que $\preceq$ est une relation d'ordre sur $\mathbb{R}$.` },
    { id: "ch2-ex14", number: "14", statement: r`Soit $\mathcal{R}$ une relation d'équivalence sur un ensemble $E$. On appelle ensemble quotient de $E$ par $\mathcal{R}$, noté $E/\mathcal{R}$, l'ensemble des classes d'équivalence : $E/\mathcal{R} = \{\overline{x}^{\mathcal{R}},\ x \in E\}$.
1. Démontrer qu'une classe d'équivalence est non vide, que tout élément de $E$ appartient à une classe d'équivalence et que deux classes sont soit confondues, soit disjointes (les classes forment une partition de $E$).
2. Sur $\mathbb{R}$, on note $\mathcal{R}_1$ la relation : $\forall x,y \in \mathbb{R}$, $x \mathcal{R}_1 y$ s'il existe $k \in \mathbb{Z}$ tel que $x = y + 2k\pi$.
(a) Démontrer que $\mathcal{R}_1$ est une relation d'équivalence. Que reconnaissez-vous en $\mathcal{R}_1$ ?
(b) Déterminer la classe d'équivalence de 0 pour $\mathcal{R}_1$.
3. Soit $n$ un entier non nul. Sur $\mathbb{Z}$, on note $\mathcal{R}_2$ la relation : $\forall a,b \in \mathbb{Z}$, $a \mathcal{R}_2 b$ s'il existe $k \in \mathbb{Z}$ tel que $a = b + kn$.
(a) Démontrer que $\mathcal{R}_2$ est une relation d'équivalence.
(b) Expliciter $\mathbb{Z}/\mathcal{R}_2$.` },
    { id: "ch2-ex15", number: "15", statement: r`Soient $E = \{a,b,c,d,e\}$ et $\mathcal{R}$ la relation sur $E$ définie par : chaque élément est en relation avec lui-même, et $a \mathcal{R} b$, $a \mathcal{R} c$, $a \mathcal{R} d$, $a \mathcal{R} e$, $b \mathcal{R} e$, $c \mathcal{R} e$ (voir le diagramme dans le TD).
1. Justifier que $\mathcal{R}$ est une relation d'ordre sur $E$. Est-elle totale ou partielle ?
2. Soit $A = \{b,c\}$, $B = \{b,d\}$ et $C = \{a,b,e\}$. Étudier pour chacune de ces parties l'existence éventuelle de majorants (les donner alors), puis celle d'un plus grand élément (à donner).` },
  ],
};

export default chapter;
