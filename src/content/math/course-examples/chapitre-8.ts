import type { MathExercise } from "../types";
const r = String.raw;
export const chapitre8Exemples: MathExercise[] = [
  { id: "ch8-exemple-1", number: "2.4", source: "exemple", statement: r`Soient $f$ et $g$ les fonctions définies sur $\mathbb{R}$ par $f(x)=x^2+1$ et $g(x)=x+3$. Déterminer $f\circ g$ et $g\circ f$.` },
  { id: "ch8-exemple-2", number: "2.6", source: "exemple", statement: r`Soient $f$ la fonction définie sur $\mathbb{R}$ par $f(x)=2x-3$ et $g$ la fonction définie sur $\mathbb{R}^{+*}$ définie par $g(x)=\ln x$. Peut-on définir $f\circ g$ ? $g\circ f$ ?` },
  { id: "ch8-exemple-3", number: "2.8", source: "exemple", statement: r`La fonction exponentielle est bijective de $\mathbb{R}$ sur $\mathbb{R}^{+*}$.` },
  { id: "ch8-exemple-4", number: "2.11", source: "exemple", statement: r`La fonction logarithme est la fonction réciproque de la fonction exponentielle.

En effet : $\forall x\in\mathbb{R},\ln(\exp x)=x$ et $\forall x\in\mathbb{R}^{+*},\exp(\ln x)=x$

[Figure : courbes de l’exponentielle et du logarithme népérien, avec la droite d’équation $y=x$.]` },
  { id: "ch8-exemple-5", number: "2.13", source: "exemple", statement: r`$\mathbb{R}$, $[-1,1]$ et $\mathbb{R}^*$ sont des ensembles symétriques par rapport à zéro mais $[2,+\infty[$ n’en est pas un.` },
  { id: "ch8-exemple-6", number: "2.15", source: "exemple", statement: r`La fonction $f$ définie pour tout $x\in\mathbb{R}$ par $f(x)=x^2+1$ est paire : $\mathbb{R}$ est symétrique par rapport à zéro et pour tout $x\in\mathbb{R}$, $f(-x)=(-x)^2+1=(-1)^2x^2+1=x^2+1=f(x)$.

Exemple de représentation graphique d’une fonction paire

[Figure : parabole $y=x^2+1$, avec les points d’abscisses $-x$ et $x$ de même ordonnée.]` },
  { id: "ch8-exemple-7", number: "2.16", source: "exemple", statement: r`La fonction cube $f$ définie pour tout $x\in\mathbb{R}$ par $f(x)=x^3$ est impaire : $\mathbb{R}$ est symétrique par rapport à zéro et pour tout $x\in\mathbb{R}$, $f(-x)=(-x)^3=-x^3=-f(x)$.

Exemple de représentation graphique d’une fonction impaire

[Figure : courbe de la fonction cube, avec les points d’abscisses $-x$ et $x$ symétriques par rapport à l’origine.]` },
  { id: "ch8-exemple-8", number: "2.19", source: "exemple", statement: r`Les fonctions $\cos$ et $\sin$ sont $2\pi$ périodiques.` },
  { id: "ch8-exemple-9", number: "2.23", source: "exemple", statement: r`Soit $f$ la fonction définie pour tout $x\in\mathbb{R}$ par $f(x)=x^2+1$. Alors $1$ est un minorant de $f$ car pour tout $x\in\mathbb{R}$, $f(x)=x^2+1\geq 1$.` },
  { id: "ch8-exemple-10", number: "2.26", source: "exemple", statement: r`Dans l’exemple 2.23, $1$ est le minimum de la fonction $f$ sur $\mathbb{R}$` },
  { id: "ch8-exemple-11", number: "2.30", source: "exemple", statement: r`Considérons la fonction inverse $f:x\mapsto\dfrac{1}{x}$ sur $\mathbb{R}^{+*}$. Elle est toujours positive, donc minorée par $0$. Tout réel négatif est également un minorant pour $f$. $0$ est le minorant le plus grand, mais $0$ n’est pas un minimum car $\forall x\in\mathbb{R}^{+*}:\dfrac{1}{x}\neq 0$. On a donc : $\displaystyle\inf_{x\in\mathbb{R}^{+*}}f(x)=0$.` },
  { id: "ch8-exemple-12", number: "3.2", source: "exemple", statement: r`Donner la dérivée de la fonction $f$ définie pour tout $x\in\mathbb{R}$ par $f(x)=(x+1)e^x$.` },
  { id: "ch8-exemple-13", number: "3.9", source: "exemple", statement: r`A l’aide du tableau de variation de la fonction $\exp$, expliquer pourquoi celle-ci est bijective de $\mathbb{R}$ sur $\mathbb{R}^{+*}$.` },
  { id: "ch8-exemple-14", number: "3.12", source: "exemple", statement: r`La fonction inverse est de classe $\mathcal{C}^1$ sur $]0;+\infty[$.` },
  { id: "ch8-exemple-15", number: "3.15", source: "exemple", statement: r`La fonction exponentielle est $n$ fois dérivable pour tout $n\in\mathbb{N}^*$.` },
  { id: "ch8-exemple-16", number: "4.41", source: "exemple", statement: r`$$\frac{|-7\times 6|}{|(-6)|^2}=$$` },
  { id: "ch8-exemple-17", number: "7.10", source: "exemple", statement: r`Soit $a\in\mathbb{C}$. $f:\begin{aligned}\mathbb{R}&\to\mathbb{C}\\t&\mapsto e^{at}\end{aligned}$ est dérivable et $f':\begin{aligned}\mathbb{R}&\to\mathbb{C}\\t&\mapsto ae^{at}\end{aligned}$.` },
];
