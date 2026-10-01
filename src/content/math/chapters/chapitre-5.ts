import type { MathChapter } from "../types";

const r = String.raw;

const chapter: MathChapter = {
  id: "chapitre-5",
  number: 5,
  title: "Les nombres réels",
  summary: "Partie entière, bornes supérieure et inférieure, irrationalité, densité, valeur absolue.",
  pdfUrl: "/practica/c5.pdf",
  exercises: [
    { id: "ch5-ex1", number: "1", statement: r`Partie entière. On appelle partie entière d'un réel $x$, notée $E(x)$ ou $\lfloor x \rfloor$, l'entier :
$$\lfloor x \rfloor = \max(\{z \in \mathbb{Z} \mid z \leq x\})$$
On a alors, pour tout $p \in \mathbb{Z}$ : $p = \lfloor x \rfloor \iff p \leq x < p+1$.
Soit $x \in \mathbb{R}$ et $n \in \mathbb{N}^*$, montrer que :
$$E\left(\frac{\lfloor nx \rfloor}{n}\right) = \lfloor x \rfloor$$` },
    { id: "ch5-ex2", number: "2", statement: r`Soient $a$ et $b$ deux réels strictement positifs. Les ensembles suivants sont-ils majorés ? Minorés ? Si c'est possible, donner leurs bornes supérieures, inférieures.
$$\{a + nb \mid n \in \mathbb{N}\} \qquad \{a + (-1)^n b \mid n \in \mathbb{N}\} \qquad \left\{a + \frac{b}{n} \mid n \in \mathbb{N}^*\right\}$$
$$\left\{a + \frac{(-1)^n b}{n} \mid n \in \mathbb{N}^*\right\} \qquad \left\{\frac{n - \frac{1}{n}}{n + \frac{1}{n}} \mid n \in \mathbb{N}^*\right\}$$` },
    { id: "ch5-ex3", number: "3", statement: r`Vrai ou Faux ?
1. Toute partie majorée de $\mathbb{R}$ admet une borne supérieure.
2. Si une partie $A$ de $\mathbb{R}$ possède une borne supérieure $K$, tout réel strictement inférieur à $K$ est dans $A$.
3. Si une partie $A$ de $\mathbb{R}$ possède une borne supérieure $K$, et $M \in \mathbb{R}$ : $M$ majore $A$ si et seulement si $M \geqslant K$.
4. Soient $A$ et $B$ des parties de $\mathbb{R}$. On pose $AB = \{ab,\ a \in A \text{ et } b \in B\}$.
(a) Si $A$ et $B$ sont bornées alors $AB$ est bornée.
(b) Si $A$ et $B$ sont majorées alors $AB$ est majorée.
(c) Si $A$ ou $B$ est infinie alors $AB$ est infinie.` },
    { id: "ch5-ex4", number: "4", statement: r`Soient $a$, $b$, $c$ et $d$ quatre nombres rationnels tels que $d \geqslant 0$, $b \geqslant 0$ et $\sqrt{b} \notin \mathbb{Q}$. Montrer que l'on a :
$$a + \sqrt{b} = c + \sqrt{d} \Rightarrow (a = c \text{ et } b = d).$$` },
    { id: "ch5-ex5", number: "5", statement: r`Montrer que $\sqrt{2} + \sqrt{3} + \sqrt{6} \notin \mathbb{Q}$.` },
    { id: "ch5-ex6", number: "6", statement: r`Résoudre dans $\mathbb{R}$ :
$$\sqrt{3 - x} - \sqrt{x + 1} > 2.$$` },
    { id: "ch5-ex7", number: "7", statement: r`Soient $x$ et $y$ deux réels. Montrer que :
$$\max(x,y) = \frac{1}{2}(x + y + |x - y|) \quad \text{et} \quad \min(x,y) = \frac{1}{2}(x + y - |x - y|)$$` },
    { id: "ch5-ex8", number: "8", statement: r`Vrai ou Faux ?
1. Un intervalle de $\mathbb{R}$ est dense dans $\mathbb{R}$.
2. $\mathbb{R}$ est dense dans $\mathbb{R}$.
3. Si $D$ est une partie de $\mathbb{R}$ dense dans $\mathbb{R}$, alors $D$ n'est pas majorée.
4. Si $D$ est une partie de $\mathbb{R}$ dense dans $\mathbb{R}$, alors $D$ est infinie.` },
    { id: "ch5-ex9", number: "9", statement: r`Mini-problème 1 : toute fonction croissante de $[0;1]$ dans $[0;1]$ admet un point fixe.
Soit $f : [0;1] \to [0;1]$ une fonction croissante. On veut montrer qu'il existe $x_0 \in [0;1]$ tel que $f(x_0) = x_0$. On considère la partie $E = \{x \in [0;1],\ f(x) \leqslant x\}$.
1. Montrer que $E$ admet une borne inférieure. On pose $a = \inf E$. Justifier que $a \in [0;1]$.
2. Montrer que $f(a)$ est un minorant de $E$ et en déduire que $f(a) \leqslant a$.
3. On suppose $a > 0$. Justifier que pour tout $x \in [0; a[$ on a $f(x) > x$. En déduire que $f(a) \geqslant a$.
4. Conclure à l'existence d'un point fixe de $f$. Y a-t-il unicité d'un tel point fixe ?
5. Que pouvez-vous dire de l'existence de points fixes pour une fonction décroissante de $[0;1]$ dans $[0;1]$ ?` },
    { id: "ch5-ex10", number: "10", statement: r`Mini-problème 2 : recherche d'une borne inférieure. On cherche, si elle existe, la borne inférieure de la partie de $\mathbb{R}$ :
$$A = \left\{ \frac{p}{q} + 2\frac{q}{p},\ (p,q) \in (\mathbb{N}^*)^2 \right\}$$
1. Justifier que $A$ admet une borne inférieure.
2. Dresser le tableau de variations de $f : \mathbb{R}_+^* \to \mathbb{R},\ x \mapsto x + \dfrac{2}{x}$.
3. Nous allons montrer que $\inf A = 2\sqrt{2}$.
(a) Justifier que $2\sqrt{2}$ est un minorant de $A$.
(b) Soit $\varepsilon > 0$. Justifier qu'il existe un réel $x_\varepsilon \in \,]\sqrt{2}; +\infty[$ tel que $f(x_\varepsilon) = 2\sqrt{2} + \varepsilon$. En déduire l'existence d'un rationnel strictement positif $r_\varepsilon$ tel que $f(r_\varepsilon) < 2\sqrt{2} + \varepsilon$.
(c) Conclure.
4. $\inf A$ est-il le plus petit élément de $A$ ?` },
  ],
};

export default chapter;
