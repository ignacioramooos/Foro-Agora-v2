import type { MathExercise } from "../types";
const r = String.raw;
export const chapitre9Exemples: MathExercise[] = [
  { id: "ch9-exemple-1", number: "2.8", source: "exemple", statement: r`Soit $(u_n)_{n\in\mathbb{N}}$ une suite convergente vers 4. Alors $\displaystyle\lim_{n\to+\infty} \frac{1}{u_n} = \frac{1}{4}$.` },
  { id: "ch9-exemple-2", number: "2.19", source: "exemple", statement: r`Soient $(u_n)_{n\in\mathbb{N}}$ et $(v_n)_{n\in\mathbb{N}}$ deux suites telles que : $\forall n \in \mathbb{N}, u_n \in [0;1]$ et $v_n \in [0;1]$, avec $\displaystyle\lim_{n\to+\infty} u_n v_n = 1$. Alors $\displaystyle\lim_{n\to+\infty} u_n = 1$ et $\displaystyle\lim_{n\to+\infty} v_n = 1$.` },
  { id: "ch9-exemple-3", number: "2.22", source: "exemple", statement: r`La suite $(u_n)_{n\in\mathbb{N}^*}$ définie par : $\forall n \in \mathbb{N}^*; u_n = \dfrac{1}{n!}\left(\displaystyle\sum_{k=1}^{n} k!\right)$ converge vers 1.` },
  { id: "ch9-exemple-4", number: "3.3", source: "exemple", statement: r`Equivalents usuels

• Si $(u_n)$ est une suite qui converge vers 0, on a :
$$\ln(1+u_n) \underset{n\to+\infty}{\sim} u_n \qquad e^{u_n} - 1 \underset{n\to+\infty}{\sim} u_n \qquad (1+u_n)^a - 1 \underset{n\to+\infty}{\sim} au_n \ (\text{avec } a \neq 0)$$
$$\sin u_n \underset{n\to+\infty}{\sim} u_n \qquad 1 - \cos u_n \underset{n\to+\infty}{\sim} \frac{1}{2}u_n^2 \qquad \tan u_n \underset{n\to+\infty}{\sim} u_n$$
$$\arctan u_n \underset{n\to+\infty}{\sim} u_n \qquad \arcsin u_n \underset{n\to+\infty}{\sim} u_n$$

• Une suite polynômiale est toujours équivalente à son terme de plus haut degré.` },
  { id: "ch9-exemple-5", number: "3.6", source: "exemple", statement: r`• $n + 1 \underset{n\to+\infty}{\sim} n + 2$ et $-n \underset{n\to+\infty}{\sim} -n$ , et pourtant on n'a pas $1 \underset{n\to+\infty}{\sim} 2$ !

• $n^2 + n \underset{n\to+\infty}{\sim} n^2$ or $\exp(n^2 + n)$ n'est pas équivalent à $\exp(n^2)$ en $+\infty$.` },
  { id: "ch9-exemple-6", number: "3.9", source: "exemple", statement: r`$n \underset{n\to+\infty}{=} o(n^2)$` },
  { id: "ch9-exemple-7", number: "3.16", source: "exemple", statement: r`Déterminer un équivalent de : $2^n - 12n^2 - 3\ln(n)$ au voisinage de $+\infty$.` },
  { id: "ch9-exemple-8", number: "3.19", source: "exemple", statement: r`$\ln(1 + 3n) \underset{n\to+\infty}{=} O(n)$ car $\forall x \in \mathbb{R}_+^*,\ \ln(1 + x) \leq x$.` },
  { id: "ch9-exemple-9", number: "4.9", source: "exemple", statement: r`Les suites $(u_{2n})$ et $(u_{2n+1})$ sont des suites extraites de la suite $(u_n)$.` },
  { id: "ch9-exemple-10", number: "4.11", source: "exemple", statement: r`La suite $(u_n)_{n\in\mathbb{N}}$ définie par $u_n = (-1)^n$ diverge.` },
  { id: "ch9-exemple-11", number: "5.6", source: "exemple", statement: r`$\mathbb{D}$, $\mathbb{Q}$, $\mathbb{R} \setminus \mathbb{Q}$ sont denses dans $\mathbb{R}$.` },
  { id: "ch9-exemple-12", number: "6.9", source: "exemple", statement: r`Si $(\theta_n)$ est une suite réelle convergente vers un réel $\theta$, alors la suite $(e^{i\theta_n})$ converge vers $e^{i\theta}$.` },
  { id: "ch9-exemple-13", number: "7.4", source: "exemple", statement: r`Soit $(u_n)$ une suite arithmétique de raison 4 et de premier terme $u_0 = 1$. Calculer $u_{29}$.` },
  { id: "ch9-exemple-14", number: "7.6", source: "exemple", statement: r`Soit $(u_n)$ une suite arithmétique de raison 4 telle que : $u_{10} = 1$. Calculer $u_{20}$.` },
  { id: "ch9-exemple-15", number: "7.8", source: "exemple", statement: r`Calculer : $S = 2 + 5 + 8 + \cdots + 20$.` },
  { id: "ch9-exemple-16", number: "7.12", source: "exemple", statement: r`Soit $(u_n)$ une suite géométrique de raison 2 et de premier terme $u_0 = 3$. Calculer $u_{12}$.` },
  { id: "ch9-exemple-17", number: "7.14", source: "exemple", statement: r`Soit $(u_n)$ une suite géométrique de raison 2 telle que : $u_{10} = 4$. Calculer $u_{20}$.` },
  { id: "ch9-exemple-18", number: "7.16", source: "exemple", statement: r`Calculer : $S = 4 + 8 + 16 + \cdots + 64$.` },
  { id: "ch9-exemple-19", number: "7.21", source: "exemple", statement: r`Donner une expression explicite de la suite $(u_n)$, définie par : $u_0 = -1$, et $\forall n \in \mathbb{N}, u_{n+1} = 2u_n - 3$. En déduire la limite de cette suite.` },
  { id: "ch9-exemple-20", number: "7.25", source: "exemple", statement: r`Une suite arithmético-géométrique est de la forme : $u_{n+1} = f(u_n)$ avec : $\forall x \in \mathbb{R}, f(x) = ax + b$.` },
];
