import type { MathExercise } from "../types";
const r = String.raw;
export const chapitre5Exemples: MathExercise[] = [
  { id: "ch5-exemple-1", number: "1.3", source: "exemple", statement: r`$\frac{2}{3}$ est une fraction irréductible, $\frac{10}{22}$ ne l’est pas.` },
  { id: "ch5-exemple-2", number: "2.7", source: "exemple", statement: r`Lequel des réels $X=\sqrt{21}+\sqrt{10}$ et $Y=\sqrt{24}+\sqrt{7}$ est le plus grand ? Sans utiliser la calculette bien sûr...` },
  { id: "ch5-exemple-3", number: "2.20", source: "exemple", statement: r`• $\operatorname{pge}([0;1])=1$

• $[0;+\infty[$ n’a pas de plus grand élément.

• $[0;1[$ n’a pas de plus grand élément.` },
  { id: "ch5-exemple-4", number: "2.22", source: "exemple", statement: r`$[0;1]$ et $[0;1[$ sont majorés dans $\mathbb{R}$.` },
  { id: "ch5-exemple-5", number: "2.23", source: "exemple", statement: r`$\mathbb{Z},\mathbb{Q},\mathbb{R}$ ne sont ni majorés, ni minorés.` },
  { id: "ch5-exemple-6", number: "2.26", source: "exemple", statement: r`Les parties suivantes sont elles majorées ? minorées ? bornées ? Admettent-elles un maximum, un minimum ?
$$\{-2;-\sqrt{2};\pi\},\ [0,1[,\ ]-\infty;1[,\ [0;1]\cup[-5;-\sqrt{3}[,\ \mathbb{N},\ \left\{\frac{1}{n}/n\in\mathbb{N}^*\right\}$$` },
  { id: "ch5-exemple-7", number: "2.28", source: "exemple", statement: r`• $\sup_{\mathbb{R}}([0;1[)=1$

• $\sup_{\mathbb{R}}([0;1])=1$

• $([0;+\infty[)$ n’a pas de borne supérieure.` },
  { id: "ch5-exemple-8", number: "2.37", source: "exemple", statement: r`• $\mathbb{R}=]-\infty;+\infty[$

• $[a;a]=\{a\}$

• $]a;a[=\varnothing$` },
  { id: "ch5-exemple-9", number: "2.39", source: "exemple", statement: r`Dans la figure ci-dessous, $E_1$ est convexe, $E_2$ ne l’est pas.

[Figure : $E_1$ est une région ovale contenant les segments reliant ses points ; $E_2$ est une région courbée dont un segment reliant deux points sort de la région.]` },
  { id: "ch5-exemple-10", number: "2.44", source: "exemple", statement: r`Soient $I$ et $J$ deux intervalles. Alors $I+J=\{x+y,x\in I,y\in J\}$ est un intervalle.` },
  { id: "ch5-exemple-11", number: "3.3", source: "exemple", statement: r`$\sqrt{p}$ avec $p$ premier est également irrationnel, tout comme $e$ et $\pi$.` },
  { id: "ch5-exemple-12", number: "3.8", source: "exemple", statement: r`Soit $A=\left\{\frac{p}{\ln n},p\in\mathbb{Z},n\in\mathbb{N},n\geq2\right\}$. $A$ est dense dans $\mathbb{R}$.` },
  { id: "ch5-exemple-13", number: "3.13", source: "exemple", statement: r`1. Donner les 5 premiers termes de l’approximation décimale par défaut et par excès de $\sqrt{2}$, de $\frac{2}{3}$, de $-\frac{2}{3}$.

2. Que dire de la suite des approximations décimales par défaut d’un nombre entier relatif ? D’un nombre décimal ?` },
];
