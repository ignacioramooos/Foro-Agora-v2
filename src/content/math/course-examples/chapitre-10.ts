import type { MathExercise } from "../types";
const r = String.raw;
export const chapitre10Exemples: MathExercise[] = [
  { id: "ch10-exemple-1", number: "1.5", source: "exemple", statement: r`$\displaystyle\lim_{x\to 2} 2x + 1 = 5$` },
  { id: "ch10-exemple-2", number: "1.8", source: "exemple", statement: r`$\displaystyle\lim_{x\to 0} \ln x = -\infty$` },
  { id: "ch10-exemple-3", number: "1.10", source: "exemple", statement: r`Si on reprend l'exemple précédent, la droite d'équation $x = 0$ est une asymptote verticale à la courbe représentative de ln en 0.` },
  { id: "ch10-exemple-4", number: "1.12", source: "exemple", statement: r`En notant $E(x)$ la partie entière de $x$, on a : $\displaystyle\lim_{x\to 1^+} E(x) = 1$ et $\displaystyle\lim_{x\to 1^-} E(x) = 0$` },
  { id: "ch10-exemple-5", number: "1.15", source: "exemple", statement: r`La fonction partie entière n'admet donc pas de limite en 1.` },
  { id: "ch10-exemple-6", number: "1.17", source: "exemple", statement: r`$\displaystyle\lim_{x\to+\infty} \arctan x = \frac{\pi}{2}$` },
  { id: "ch10-exemple-7", number: "1.19", source: "exemple", statement: r`$\displaystyle\lim_{x\to-\infty} \arctan x = -\frac{\pi}{2}$` },
  { id: "ch10-exemple-8", number: "1.21", source: "exemple", statement: r`Si on reprend l'exemple précédent, la droite d'équation $y = \dfrac{\pi}{2}$ est une asymptote horizontale à la courbe représentative de arctan en $+\infty$ et la droite d'équation $y = -\dfrac{\pi}{2}$ est une asymptote horizontale à la courbe représentative de arctan en $-\infty$ .` },
  { id: "ch10-exemple-9", number: "1.24", source: "exemple", statement: r`• $\displaystyle\lim_{x\to+\infty} \ln x = +\infty$

• $\displaystyle\lim_{x\to+\infty} -x^2 = -\infty$` },
  { id: "ch10-exemple-10", number: "1.26", source: "exemple", statement: r`• $\displaystyle\lim_{x\to-\infty} -x^2 = -\infty$

• $\displaystyle\lim_{x\to-\infty} x^2 = +\infty$` },
  { id: "ch10-exemple-11", number: "1.35", source: "exemple", statement: r`Pour tout $x \in \mathbb{R}$, $\lfloor x \rfloor \leq x \leq \lfloor x \rfloor + 1$. Ainsi, pour tout $x \in \mathbb{R}$, $\lfloor x \rfloor \geq x - 1$. Or, on sait que :
$$\lim_{x\to+\infty} x - 1 = +\infty$$
Par minoration, on a alors :
$$\lim_{x\to+\infty} \lfloor x \rfloor = +\infty$$` },
  { id: "ch10-exemple-12", number: "1.38", source: "exemple", statement: r`Montrer que $\displaystyle\lim_{x\to 0} \frac{x}{2 - \cos\frac{1}{x}} = 0$.` },
  { id: "ch10-exemple-13", number: "2.3", source: "exemple", statement: r`Equivalents classiques

• Un polynôme non nul est équivalent au voisinage de 0 à son monôme de plus bas degré.

• Un polynôme non nul est équivalent au voisinage de $\pm\infty$ à son monôme de plus haut degré.

• $$\ln(1+x) \underset{x\to 0}{\sim} x \qquad e^x - 1 \underset{x\to 0}{\sim} x \qquad (1+x)^\alpha - 1 \underset{x\to 0}{\sim} \alpha x \ (\text{avec } \alpha \neq 0)$$
$$\sin x \underset{x\to 0}{\sim} x \qquad 1 - \cos x \underset{x\to 0}{\sim} \frac{1}{2}x^2 \qquad \tan x \underset{x\to 0}{\sim} x$$` },
  { id: "ch10-exemple-14", number: "2.7", source: "exemple", statement: r`Soient $f$ et $g$ deux fonctions définies sur $\mathbb{R}$ par : $f(x) = x^2 + x$ et $g(x) = -x^2 + 1$. Donner un équivalent de $f(x) + g(x)$ au voisinage de $+\infty$.` },
  { id: "ch10-exemple-15", number: "2.8", source: "exemple", statement: r`A-t-on : $e^{x+1} \underset{x\to+\infty}{\sim} e^x$ ?` },
  { id: "ch10-exemple-16", number: "2.11", source: "exemple", statement: r`$x \underset{x\to+\infty}{=} o(x^2)$` },
  { id: "ch10-exemple-17", number: "2.17", source: "exemple", statement: r`On a : $\ln(x) \underset{x\to+\infty}{=} O(x)$.` },
  { id: "ch10-exemple-18", number: "3.3", source: "exemple", statement: r`Soit la fonction $f$ définie sur $\mathbb{R}$ par : $f(x) = e^x - 1$ si $x < 0$ et $f(x) = x^2$ si $x \geq 0$. La fonction $f$ est-elle continue en 0 ?` },
  { id: "ch10-exemple-19", number: "3.4", source: "exemple", statement: r`La fonction partie entière n'est pas continue en tout entier $k \in \mathbb{Z}$.
En effet : $\displaystyle\lim_{x\to k^-} E(x) = k - 1$ et $\displaystyle\lim_{x\to k^+} E(x) = k$.` },
  { id: "ch10-exemple-20", number: "3.11", source: "exemple", statement: r`La fonction $f$, définie sur $]0;+\infty[$ par : $f(x) = x\ln x$ est prolongeable par continuité en 0 (à droite), en posant : $f(0) = 0$.` },
  { id: "ch10-exemple-21", number: "3.15", source: "exemple", statement: r`Soit $f$ la fonction définie pour tout $x \in [-1, 2]$ par $f(x) = x^3 + x^2 - x$.
Montrer l'existence d'un réel $c \in [-1;2]$ tel que : $f(c) = 5$.` },
  { id: "ch10-exemple-22", number: "3.23", source: "exemple", statement: r`• Soit $f : \mathbb{R} \longrightarrow \mathbb{R}$ définie par $f(x) = 2x + 3$. Déterminer $f([1,2])$.

• Déterminer $g([-1,3])$ où g est la fonction carré.` },
  { id: "ch10-exemple-23", number: "3.26", source: "exemple", statement: r`• La fonction ln est définie comme la primitive sur $\mathbb{R}^{+*}$ de la fonction $x \mapsto \dfrac{1}{x}$ s'annulant en 1. Elle est donc continue sur $]0;+\infty[$. Elle est également strictement croissante sur cet intervalle. Elle réalise une bijection de $]0;+\infty[$ vers $\mathbb{R}$. Sa réciproque, la fonction exp est donc continue sur $\mathbb{R}$.

• La fonction tan est continue et strictement croissante sur $\left]-\dfrac{\pi}{2};\dfrac{\pi}{2}\right[$. Elle réalise donc une bijection de $\left]-\dfrac{\pi}{2};\dfrac{\pi}{2}\right[$ sur $\tan\left(\left]-\dfrac{\pi}{2};\dfrac{\pi}{2}\right[\right) = \mathbb{R}$. Sa réciproque, la fonction arctan est donc continue et strictement croissante sur $\mathbb{R}$.` },
  { id: "ch10-exemple-24", number: "3.27", source: "exemple", statement: r`Si $f$ est une fonction continue et strictement monotone sur un intervalle $[a;b]$ avec $a < b$, et si $f(a)f(b) \leq 0$ ($f(a)$ et $f(b)$ de signes opposés), alors l'équation $f(x) = 0$ admet une et une seule solution dans $[a;b]$.` },
  { id: "ch10-exemple-25", number: "3.31", source: "exemple", statement: r`1. La fonction $x \mapsto x^2$ définie sur $I = [-1;1]$ est uniformément continue. En effet, soit $\varepsilon > 0$, on cherche $\eta$ tel que $\forall (x,y) \in I^2, |x - y| \leq \eta \Rightarrow \left|x^2 - y^2\right| \leq \varepsilon$. Or $\left|x^2 - y^2\right| = |x + y|\,|x - y|$ sur $I$. Donc $\eta = \frac{\varepsilon}{2}$ convient.
Par contre, $x \mapsto x^2$ n'est pas uniformément continue sur $\mathbb{R}$.

2. La négation de continuité uniforme donne :
$$\exists \varepsilon > 0, \forall \eta > 0, \exists (x,y) \in I^2, |x - y| \leq \eta \text{ et } |f(x) - f(y)| > \varepsilon$$
Si on peut trouver deux suites $(x_n)$ et $(y_n)$ telles que $x_n - y_n \to 0$ et $f(x_n) - f(y_n) \not\to 0$, alors on a prouvé la non continuité uniforme de $f$ sur $I$.
Par exemple, la fonction $x \mapsto \dfrac{1}{x}$ définie sur $\mathbb{R}^{+*}$ n'est pas uniformément continue. En effet, soit $x_n = \dfrac{1}{2n}$ et $y_n = \dfrac{1}{n}$. On a $\left|\dfrac{1}{x_n} - \dfrac{1}{y_n}\right| = |2n - n| = n$, donc quel que soit $\eta > 0$, $|x_n - y_n| \leq \eta$ n'empêchera pas d'avoir $\left|\dfrac{1}{x_n} - \dfrac{1}{y_n}\right| \to +\infty$.` },
  { id: "ch10-exemple-26", number: "3.34", source: "exemple", statement: r`Les fonctions suivantes sont-elles lipschitziennes ?

1) $x \mapsto x$ sur $\mathbb{R}$

2) $x \mapsto |x|$ sur $\mathbb{R}$

3) $x \mapsto x^2$ sur $\mathbb{R}$

4) $x \mapsto x^2$ sur $[0;1]$` },
  { id: "ch10-exemple-27", number: "4.6", source: "exemple", statement: r`Soit $f(t) = \ln(1+t)\left(1 + \dfrac{i}{t}\right)$. On a $\displaystyle\lim_{t\to 0} \mathrm{Re}(f(t)) = 0$ et $\displaystyle\lim_{t\to 0} \mathrm{Im}(f(t)) = 1$ donc $\displaystyle\lim_{t\to 0} f(t) = i$.` },
];
