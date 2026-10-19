import type { MathChapter } from "../types";

const r = String.raw;

const chapter: MathChapter = {
  id: "chapitre-8",
  number: 8,
  title: "Fonctions d'une variable réelle",
  summary: "Ensemble de définition, monotonie, dérivabilité, fonctions usuelles et trigonométrie.",
  exercises: [
    { id: "ch8-cours-ex1", number: "1", source: "cours", statement: r`Donner l'ensemble de définition de la fonction définie par $f(x) = \dfrac{x-1}{\sqrt{2x-3}}$.` },
    { id: "ch8-cours-ex2", number: "2", source: "cours", statement: r`Soit $f$ la fonction définie pour tout $x \in \mathbb{R}$ par $f(x) = x^2 - 4x$. Donner le (ou les) antécédents de $-5$ par $f$.` },
    { id: "ch8-cours-ex3", number: "3", source: "cours", statement: r`Soit $f \in \mathbb{R}^{\mathbb{R}}$. On considère les applications $\alpha$, $\beta$, $\gamma$ et $\delta$ définies pour tout $x \in \mathbb{R}$ par :
$$\alpha(x) = f(x-1), \qquad \beta(x) = f(x) - 1, \qquad \gamma(x) = f(1-x), \qquad \delta(x) = 1 - f(x)$$
Comment les graphes de ces quatre applications se déduisent-ils de celui de $f$ ?` },
    { id: "ch8-cours-ex4", number: "4", source: "cours", statement: r`Montrer que toute fonction $f : \mathbb{R} \to \mathbb{R}$ peut s'écrire de manière unique $p + i$, avec $p : \mathbb{R} \to \mathbb{R}$ paire et $i : \mathbb{R} \to \mathbb{R}$ impaire.` },
    { id: "ch8-cours-ex5", number: "5", source: "cours", statement: r`On considère une fonction $f$ dont la représentation graphique est donnée ci-dessous.
[Figure : axes des abscisses $x$ et des ordonnées $y$ ; la courbe part du bas à gauche, passe par l'origine, atteint un maximum près de $(1,1)$, puis décroît en s'approchant de l'axe des abscisses quand $x$ augmente.]

En utilisant la représentation graphique, la fonction $f$ semble-t-elle

1. majorée sur $\mathbb{R}$ ? Si oui, déterminer tous les majorants et le plus petit d'entre eux.

2. minorée sur $\mathbb{R}$ ? sur $[1,+\infty[$ ? Si oui, déterminer tous les minorants.

3. bornée sur $\mathbb{R}$ ? sur $[1,+\infty[$ ?` },
    { id: "ch8-cours-ex6", number: "6", source: "cours", statement: r`1. Que peut-on dire de la monotonie des fonctions affines ?

2. Que peut-on dire de la monotonie de la fonction inverse ?` },
    { id: "ch8-cours-ex7", number: "7", source: "cours", statement: r`Donner la dérivée des fonctions $h$ et $m$ définies pour tout $x \in \mathbb{R}$ par $h(x) = e^{3x-2}$ et $m(x) = \ln(x^2 + 3)$.` },
    { id: "ch8-cours-ex8", number: "8", source: "cours", statement: r`Étudier le sens de variation de la fonction de l'exemple 3.2.` },
    { id: "ch8-cours-ex9", number: "9", source: "cours", statement: r`Montrer que la fonction inverse est $n$ fois dérivable sur $\mathbb{R}^{+*}$ et sur $\mathbb{R}^{-*}$ pour tout $n \in \mathbb{N}^*$. Déterminer la dérivée $n$-ième.` },
    { id: "ch8-cours-ex10", number: "10", source: "cours", statement: r`Donner l'allure des fonctions $f$ et $g$ définies pour tout $x \in \mathbb{R}$ par $f(x) = x^4$ et $g(x) = x^5$.` },
    { id: "ch8-cours-ex11", number: "11", source: "cours", statement: r`Dresser le tableau de signe de la fonction $\ln$.` },
    { id: "ch8-cours-ex12", number: "12", source: "cours", statement: r`Sachant que $\ln(2) \approx 0.69$, donner une valeur approchée de $\ln(4)$, $\ln(8)$ et de $\ln(1/2)$.` },
    { id: "ch8-cours-ex13", number: "13", source: "cours", statement: r`Simplifier l'expression $\ln\left(\dfrac{\sqrt{5}-1}{2}\right) + \ln\left(\dfrac{\sqrt{5}+1}{2}\right)$.` },
    { id: "ch8-cours-ex14", number: "14", source: "cours", statement: r`Résoudre l'inéquation $0 \leq \ln(x^2 + x + 5)$.` },
    { id: "ch8-cours-ex15", number: "15", source: "cours", statement: r`Résoudre l'équation $e^{2x} - 8 = 0$.` },
    { id: "ch8-cours-ex16", number: "16", source: "cours", statement: r`Exprimer sans valeur absolue et selon les valeurs de $x$, l'expression $A(x) = \left|x^2 - 4x + 3\right|$.` },
    { id: "ch8-cours-ex17", number: "17", source: "cours", statement: r`Résoudre l'équation $\left|3x + 2\right| = 7$.` },
    { id: "ch8-cours-ex18", number: "18", source: "cours", statement: r`Résoudre l'inéquation $\left|2x + 1\right| \geq 3$.` },
    { id: "ch8-cours-ex19", number: "19", source: "cours", statement: r`Etablir que : $\forall x \in [0,+\infty[$, $\operatorname{sh}(x) \geqslant x$ ainsi que $\forall x \in \mathbb{R}$, $\operatorname{ch}(x) \geqslant 1 + \dfrac{x^2}{2}$.` },
    { id: "ch8-cours-ex20", number: "20", source: "cours", statement: r`1. Soit $f$ une fonction définie, dérivable sur $\mathbb{R}$, à valeurs dans $\mathbb{C}$, $a \in \mathbb{C}$ vérifiant : $\forall x \in \mathbb{R}$, $f'(x) = af(x)$. Montrer qu'il existe $k \in \mathbb{C}$ tel que, $\forall x \in \mathbb{R}$, $f(x) = ke^{ax}$.

2. On veut déterminer les fonctions définies et dérivables sur $\mathbb{R}$, à valeurs complexes telles que :
$$\forall (x,y) \in \mathbb{R}^2, \ f\left(\frac{x-y}{2}\right) f\left(\frac{x+y}{2}\right) = f(x)$$

(a) Montrer que si $f$ n'est pas la fonction nulle, $f(0) = 1$.

(b) Montrer que $\forall (x,y) \in \mathbb{R}^2$, $f'\left(\frac{x-y}{2}\right) f\left(\frac{x+y}{2}\right) = f\left(\frac{x-y}{2}\right) f'\left(\frac{x+y}{2}\right)$.

(c) En déduire que, si $f$ n'est pas la fonction nulle alors, $\forall x \in \mathbb{R}$, $f(x) = e^{f'(0)x}$.

(d) Conclure.` },
    { id: "ch8-cours-ex21", number: "21", source: "cours", statement: r`Montrer que pour tout $x$ réel :
$$(1 + ix)\exp(-i\arctan(x)) = \sqrt{1+x^2}$$
En déduire une simplification de $\cos(\arctan(x))$ et $\sin(\arctan(x))$.` },
    { id: "ch8-ex1", number: "1", statement: r`Soit $f$ une fonction définie sur $\mathbb{R}$.

1. Justifier que si $f$ est paire, alors elle n'est pas bijective. Une fonction périodique peut-elle être bijective ?

2. Supposons que $f$ soit impaire et bijective de $\mathbb{R}$ dans $\mathbb{R}$. Montrer que sa bijection réciproque est elle-même impaire.` },
    { id: "ch8-ex2", number: "2", statement: r`Vrai ou Faux ?

1. Soit $f : D \to \mathbb{R}$ où $D$ est un domaine non vide de $\mathbb{R}$.

(a) $f$ est croissante ou $f$ est décroissante.

(b) $f$ peut être croissante et être décroissante.

2. Une fonction croissante est dérivable et sa dérivée est positive.

3. Le produit de deux fonctions croissantes est croissante.

4. Soit $f : D \to \mathbb{R}$ une fonction dérivable. $f$ est strictement croissante si et seulement si pour tout $x \in D$ on a $f'(x) > 0$.

5. Soit $f : D \to \mathbb{R}$ où $D$ est un domaine non vide de $\mathbb{R}$. Si $f$ est dérivable et pour tout $x \in D$ on a $f'(x) \geqslant 0$, alors $f$ est croissante.

6. Les fonctions $f$ et $g$ qui apparaissent ci-après sont des fonctions de $\mathbb{R}$ dans $\mathbb{R}$.

(a) Si $f$ ou $g$ est une fonction constante, alors $g \circ f$ est une fonction constante.

(b) Si $g \circ f$ est une fonction constante, alors $f$ ou $g$ est une fonction constante.` },
    { id: "ch8-ex3", number: "3", statement: r`Vrai ou Faux ?

Soit $f$ une fonction dérivable définie sur un intervalle non trivial $I$.

1. Si $f'$ est bornée, alors $f$ est bornée.

2. Si $f$ est bornée, alors $f'$ est bornée.` },
    { id: "ch8-ex4", number: "4", statement: r`Soit $h$ la fonction définie sur $\mathbb{R}$ par : $h(x) = \exp(e^x)$ et soit $E$ l'ensemble des fonctions $f$ définies sur $]1;+\infty[$ et vérifiant : $\forall x \in\, ]1;+\infty[\,,\ f(x) = f(x^2)$.

1. Montrer que l'ensemble $E$ n'est pas vide.

2. Soit $f$ une fonction définie sur $]1;+\infty[$. Montrer que $f$ appartient à $E$ si et seulement si $f \circ h$ est ln 2-périodique.` },
    { id: "ch8-ex5", number: "5", statement: r`Résoudre dans $\mathbb{R}$ l'équation : $5e^{-3x} - 7e^{-x} + 2e^{x} = 0$.` },
    { id: "ch8-ex6", number: "6", statement: r`Montrer que pour tout $x > 0$, on a $\ln(1+x) > x - \dfrac{x^2}{2}$.` },
    { id: "ch8-ex7", number: "7", statement: r`Montrer que la fonction définie sur $\mathbb{R}$ : $x \mapsto x\sin(x)$ n'est pas bornée.` },
    { id: "ch8-ex8", number: "8", statement: r`Vrai ou Faux ?

1. Soit $D$ une partie non vide de $\mathbb{R}$ symétrique par rapport à 0, $f : D \to \mathbb{R}$.

(a) Si $f$ est impaire et $0 \in D$, alors $f(0) \neq 1$.

(b) Si $f$ est paire et $0 \in D$, alors $f(0) \neq 0$.

2. Soient $f$ et $g$ des fonctions définies sur $\mathbb{R}$.

(a) Si $g \circ f$ est paire, alors $f$ est paire ou $g$ est paire.

(b) Si $g \circ f$ est paire et $f$ est paire, alors $g$ est paire.

(c) Si $g \circ f$ est paire et $g$ est paire, alors $f$ est paire.` },
    { id: "ch8-ex9", number: "9", statement: r`Déterminer les fonctions $f$ définies et strictement croissantes sur $\mathbb{R}$, à valeurs dans $\mathbb{R}$, telles que : $\forall x \in \mathbb{R}$, $(f \circ f)(x) = x$.` },
    { id: "ch8-ex10", number: "10", statement: r`Résoudre, pour $x \in \mathbb{R}$, $\ln \dfrac{x+3}{4} = \dfrac{1}{2}(\ln x + \ln 3)$.` },
    { id: "ch8-ex11", number: "11", statement: r`Résoudre, pour $x \in \mathbb{R}$, $\ln \left|2x + 1\right| + \ln \left|x + 3\right| < \ln 3$.` },
    { id: "ch8-ex12", number: "12", statement: r`Étude de la fonction $x \mapsto x^x$.` },
    { id: "ch8-ex13", number: "13", statement: r`Résoudre
$$x^{\sqrt{x}} = \left(\sqrt{x}\right)^x$$` },
    { id: "ch8-ex14", number: "14", statement: r`Montrer : $\forall x \in\, ]0,1[$, $x^x(1-x)^{1-x} \geqslant \dfrac{1}{2}$.` },
    { id: "ch8-ex15", number: "15", statement: r`Résoudre dans $\mathbb{R}$ l'équation : $-2\sin^2(x) - 3\cos(x) + 4 = 0$.` },
    { id: "ch8-ex16", number: "16", statement: r`Résoudre
$$\sin\left(x + \dfrac{3\pi}{4}\right) = \cos\dfrac{x}{4}$$` },
    { id: "ch8-ex17", number: "17", statement: r`Résoudre dans $\mathbb{R}$ l'équation : $\arcsin x = \arccos 2x$.` },
    { id: "ch8-ex18", number: "18", statement: r`1. Montrer que : $\forall x > 0$, $\arctan x + \arctan \dfrac{1}{x} = \dfrac{\pi}{2}$

2. Montrer que : $\forall x \in [-1;1]$, $\arcsin x + \arccos x = \dfrac{\pi}{2}$` },
    { id: "ch8-ex19", number: "19", statement: r`Déterminer, pour $(a,b) \in \mathbb{R}^2$, $\operatorname{ch}(a+b)$ en fonction de $\operatorname{ch}(a)$, $\operatorname{ch}(b)$, $\operatorname{sh}(a)$ et $\operatorname{sh}(b)$.` },
    { id: "ch8-ex20", number: "20", statement: r`Montrer que l'application $[0,+\infty[ \to [1,+\infty[$, $x \mapsto \operatorname{ch}(x)$ est bijective, que sa réciproque (notée argch) est dérivable sur $]1,+\infty[$ et que :

$$\forall x \in\, ]1,+\infty[, \ \operatorname{argch}'(x) = \dfrac{1}{\sqrt{x^2 - 1}}$$

En déduire que :

$$\forall x \in\, ]1,+\infty[, \ \operatorname{argch}(x) = \ln\left(x + \sqrt{x^2 - 1}\right)$$` },
  ],
};

export default chapter;
