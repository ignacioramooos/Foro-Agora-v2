import type { MathChapter } from "../types";

const r = String.raw;

const chapter: MathChapter = {
  id: "chapitre-9",
  number: 9,
  title: "Suites numériques",
  summary: "Limites, équivalents, suites monotones, adjacentes et extraites, suites complexes et suites usuelles.",
  exercises: [
    { id: "ch9-cours-ex1", number: "1", source: "cours", statement: r`Déterminer les limites des suites suivantes :

1. $(n^3 + n^2)_{n\in\mathbb{N}}$

2. $\left(n^4 + \dfrac{1}{n}\right)_{n\in\mathbb{N}^*}$

3. $(1 + e^n)_{n\in\mathbb{N}}$

4. $(-7n^2)_{n\in\mathbb{N}}$

5. $\left(\dfrac{-5}{n} + 5 \times 3^n\right)_{n\in\mathbb{N}^*}$

6. $(n^2 - n)_{n\geq 0}$

7. $\left(n\left(\dfrac{-5}{n} + 5 \times 3^n\right)\right)_{n\in\mathbb{N}^*}$

8. $\left(\left(\dfrac{1}{2}\right)^n\left(7 + \dfrac{1}{n^2}\right)\right)_{n\in\mathbb{N}^*}$` },
    { id: "ch9-cours-ex2", number: "2", source: "cours", statement: r`Déterminer la limite des suites suivantes : $\left(\dfrac{1 + (1/2)^n}{n^2 + n}\right)_{n\in\mathbb{N}^*}$ et $\left(\dfrac{(1/2)^n}{n}\right)_{n\in\mathbb{N}^*}$.` },
    { id: "ch9-cours-ex3", number: "3", source: "cours", statement: r`Déterminer si elles existent les limites des suites dont les termes généraux sont donnés par :

1. pour tout $n \geq 0$, $u_n = 3n^{13} - n^5 + 3n + 1$.

2. pour tout $n \geq 1$, $v_n = n\ln(n) - n$.

3. pour tout $n \geq 0$, $w_n = \dfrac{n^2 - 2n + 1}{n^3 + 2n^2 + 1}$.

4. pour tout $n \geq 2$, $z_n = \dfrac{2n^3 - 4n^2 + 1}{3n^3 - 1}$.` },
    { id: "ch9-cours-ex4", number: "4", source: "cours", statement: r`Soit $(u_n)_{n\in\mathbb{N}^*}$ la suite définie par $u_n = \dfrac{\sin n}{n}$. Montrer que $(u_n)_{n\in\mathbb{N}^*}$ est convergente et déterminer sa limite.` },
    { id: "ch9-cours-ex5", number: "5", source: "cours", statement: r`Soit $(u_n)$ la suite définie par : $\forall n \geq 1, u_n = \displaystyle\sum_{k=0}^{n} \frac{n}{n^2 + k}$. Montrer que la suite $(u_n)$ converge et déterminer sa limite.` },
    { id: "ch9-cours-ex6", number: "6", source: "cours", statement: r`On pose : $\forall n \geq 1, u_n = \displaystyle\sum_{k=1}^{n} e^{1/k}$. Montrer que : $\displaystyle\lim_{n\to+\infty} u_n = +\infty$.` },
    { id: "ch9-cours-ex7", number: "7", source: "cours", statement: r`Soit la suite $(u_n)$ définie par : $\forall n \in \mathbb{N}^*, u_n = n - (\ln n)^2$. Donner un équivalent de $u_n$.` },
    { id: "ch9-cours-ex8", number: "8", source: "cours", statement: r`Soit $k$ un entier naturel donné. Calculer la limite de $\dfrac{\binom{n}{k}}{n^k}$ lorsque $n$ tend vers $+\infty$.` },
    { id: "ch9-cours-ex9", number: "9", source: "cours", statement: r`Montrer que : $\displaystyle\lim_{n\to+\infty} \left(1 + \frac{x}{n}\right)^n = e^x$, pour $x$ réel strictement positif.` },
    { id: "ch9-cours-ex10", number: "10", source: "cours", statement: r`Déterminer, si elles existent, les limites des suites dont les termes généraux sont donnés par :

1. Pour tout $n \geq 1$, $u_n = \dfrac{3\ln(n)}{n^2}$.

2. Pour tout $n \geq 2$, $v_n = \dfrac{e^n}{n^{2023}}$.

3. Pour tout $n \geq 0$, $w_n = \dfrac{n^2 + 2e^{2n}}{3n^{14} + e^n}$.

4. Pour tout $n \geq 0$, $z_n = \dfrac{\ln(n) + n}{n^2 + e^n}$.` },
    { id: "ch9-cours-ex11", number: "11", source: "cours", statement: r`Soient les suites $(u_n)$ et $(v_n)$ définies par : $\forall n \in \mathbb{N}^*, u_n = \binom{2n}{n}$ et $v_n = \dfrac{\binom{2n}{n}}{4^n}$. Etudier les variations de ces suites.` },
    { id: "ch9-cours-ex12", number: "12", source: "cours", statement: r`Soit $(x_n)$ la suite définie par : $x_0 = 2$ et $\forall n \in \mathbb{N}, x_{n+1} = \dfrac{x_n}{1 + nx_n^2}$. Montrer que la suite $(x_n)$ est positive et en déduire qu'elle converge.` },
    { id: "ch9-cours-ex13", number: "13", source: "cours", statement: r`On considère les suites $(a_n)$ et $(b_n)$ définies par : $\forall n \in \mathbb{N}^*, a_n = \displaystyle\sum_{k=0}^{n} \frac{1}{k!}$ et $b_n = a_n + \dfrac{1}{n!}$.
Montrer que ces deux suites sont convergentes et de même limite.` },
    { id: "ch9-cours-ex14", number: "14", source: "cours", statement: r`On définit la suite $(S_n)_{n\in\mathbb{N}^*}$ par : $\forall n \in \mathbb{N}^*, S_n = \displaystyle\sum_{k=1}^{n} \frac{(-1)^k}{k}$.
Montrer que les suites $(S_{2n})_{n\in\mathbb{N}^*}$ et $(S_{2n+1})_{n\in\mathbb{N}}$ sont adjacentes puis conclure que la suite $(S_n)_{n\in\mathbb{N}^*}$ converge.` },
    { id: "ch9-cours-ex15", number: "15", source: "cours", statement: r`Soient $(u_n)$ une suite bornée et $\ell \in \mathbb{R}$ tels que si une suite extraite de $(u_n)$ converge, alors elle converge vers $\ell$. Nous allons montrer par l'absurde que $(u_n)$ converge vers $\ell$.

1. Supposons que $(u_n)$ ne converge pas vers $\ell$. Montrer que $\exists \varepsilon > 0$ tel que $I_{\ell,\varepsilon} = \{n \in \mathbb{N}, |u_n - \ell| > \varepsilon\}$ est infini. On note alors $I_{\ell,\varepsilon} = \{\varphi(k), k \in \mathbb{N}\}$, avec $\varphi$ strictement croissante.

2. On pose $\forall k \in \mathbb{N}, v_k = u_{\varphi(k)}$. Montrer qu'il existe une suite extraite de $(v_k)$ qui converge et que sa limite est différente de $\ell$.

3. En déduire une contradiction.` },
    { id: "ch9-cours-ex16", number: "16", source: "cours", statement: r`Montrer que $A = \left\{\dfrac{p}{\ln n}, p \in \mathbb{Z}, n \in \mathbb{N}, n \geq 2\right\}$. $A$ est dense dans $\mathbb{R}$.` },
    { id: "ch9-cours-ex17", number: "17", source: "cours", statement: r`Soit $z = x + iy \in \mathbb{C}$, avec $(x, y) \in \mathbb{R}^2$. On pose pour tout $n \in \mathbb{N}^*$ : $z_n = 1 + \dfrac{z}{n}$.

1. Montrer qu'on a, à partir d'un certain rang : $z_n = \sqrt{1 + 2\dfrac{x}{n} + \dfrac{|z|^2}{n^2}}\, e^{i\arctan\left(\frac{y}{n+x}\right)}$.

2. Montrer que $\displaystyle\lim_{n\to+\infty} \left(1 + 2\frac{x}{n} + \frac{|z|^2}{n^2}\right)^{\frac{n}{2}} = e^x$ et que $\displaystyle\lim_{n\to+\infty} n\arctan\left(\frac{y}{n+x}\right) = y$.

3. En conclure que $\displaystyle\lim_{n\to+\infty} \left(1 + \frac{z}{n}\right)^n = e^z$.` },
    { id: "ch9-cours-ex18", number: "18", source: "cours", statement: r`Déterminer $\theta \in [0; 2\pi[$ tel que la limite de $(1 - e^{i\theta})^n$, lorsque $n$ tend vers $+\infty$, existe.` },
    { id: "ch9-cours-ex19", number: "19", source: "cours", statement: r`On définit la suite $(u_n)$ par $u_0 = \alpha > 0$ et $\forall n \in \mathbb{N}, u_{n+1} = 2u_n^{\frac{1}{3}}$. Exprimer $u_n$ en fonction de $n$ pour tout $n \in \mathbb{N}$ et déterminer, si elle existe, la limite de la suite $(u_n)$.` },
    { id: "ch9-cours-ex20", number: "20", source: "cours", statement: r`Soit $(u_n)$ la suite de Fibonacci définie par : $u_0 = u_1 = 1$ et $\forall n \in \mathbb{N} : u_{n+2} = u_{n+1} + u_n$.
Déterminer $u_n$ en fonction de $n$, pour tout $n$.` },
    { id: "ch9-cours-ex21", number: "21", source: "cours", statement: r`Montrer qu'on définit bien une suite $(u_n)_{n\in\mathbb{N}}$ par : $\begin{cases} u_0 > 1 \\ \forall n \in \mathbb{N}, u_{n+1} = \ln(u_n) + 1 \end{cases}$` },
    { id: "ch9-cours-ex22", number: "22", source: "cours", statement: r`On considère la suite $(u_n)$ par $u_0 \leq 1$ et $\forall n \in \mathbb{N}, u_{n+1} = u_n + \ln(2 - u_n)$. Montrer que la suite est bien définie, étudier sa monotonie et sa convergence.` },
    { id: "ch9-ex1", number: "1", statement: r`Etudier la limite de la suite $(u_n)$ dans les cas suivants :

1. $\forall n \geq 2, u_n = \dfrac{n+1}{\sqrt{n^3 - 2n + 1}}$

2. $\forall n \in \mathbb{N}, u_n = \dfrac{a^n - b^n}{a^n + b^n}$, où $0 < a < b$

3. $\forall n \in \mathbb{N}, u_n = n\left(2 + \cos\left(\dfrac{n\pi}{12}\right)\right)$

4. $\forall n \geq 1, u_n = \dfrac{n^2(\ln(n+1) - \ln(n))}{\sqrt{n^2 + 1}}$` },
    { id: "ch9-ex2", number: "2", statement: r`Suite harmonique

Soit la suite $(H_n)_{n\in\mathbb{N}^*}$ de terme général $H_n = \displaystyle\sum_{k=1}^{n} \frac{1}{k}$. La suite $(H_n)_{n\in\mathbb{N}^*}$ est appelée la suite harmonique.

1. Montrer que $(H_n)$ est croissante.

2. On veut maintenant montrer que $(H_n)$ diverge vers $+\infty$ par deux méthodes :

(a) Montrer que pour tout $p \in \mathbb{N}^*$ on a $H_{2p} - H_p \geqslant \frac{1}{2}$. En déduire le résultat en utilisant le 1).

(b) i. Soit $k \in \mathbb{N}^*$. Montrez que $\displaystyle\int_k^{k+1} \frac{1}{t}\,dt \leqslant \frac{1}{k}$.

ii. En déduire que pour tout $n \in \mathbb{N}^*$ on a $\ln(n+1) = \displaystyle\int_1^{n+1} \frac{1}{t}\,dt \leqslant H_n$.

iii. En déduire le résultat.

3. On pose : $\forall n \in \mathbb{N}^*, v_n = \displaystyle\sum_{k=1}^{n} \frac{1}{k} - \ln(n)$.

(a) Montrer que pour tout $n \in \mathbb{N}^*$ on a $\ln\left(\dfrac{n+1}{n}\right) \geqslant \dfrac{1}{n+1}$ .

(b) Montrer que $v$ est décroissante et minorée. En déduire que $(v_n)$ converge.

La limite de $(v_n)$ est appelée la constante d'Euler (souvent notée $\gamma$).` },
    { id: "ch9-ex3", number: "3", statement: r`Suite de Césaro et application à l'étude d'une suite récurrente

1. Soit $(v_n)_{n\geq 1}$ une suite réelle. Pour $n \geq 1$, on pose : $w_n = \dfrac{v_1 + v_2 + \cdots + v_n}{n}$.
Montrer que si la suite $(v_n)$ converge vers un réel $\alpha$, alors la suite $(w_n)$ converge vers $\alpha$.
La suite $(w_n)$ s'appelle la suite de Césaro associée à $(v_n)$.
(Indication : on pourra revenir à la définition de la limite telle que vue dans le cours).

2. On considère la suite $(u_n)$ définie par : $\begin{cases} u_0 \in \left]0; \dfrac{\sqrt{2}}{2}\right[ \\ \forall n \in \mathbb{N}, u_{n+1} = u_n - 2u_n^3 \end{cases}$

(a) Montrer que $\left]0; \dfrac{\sqrt{2}}{2}\right[$ est un intervalle stable par la fonction $f$ définie par : $f(x) = x - 2x^3$.

(b) Montrer que : $\forall n \in \mathbb{N}, 0 < u_{n+1} < u_n < \dfrac{\sqrt{2}}{2}$. En déduire que la suite $(u_n)$ est convergente et déterminer sa limite.

(c) Pour $n \geq 1$, on pose : $v_n = \dfrac{1}{u_n^2} - \dfrac{1}{u_{n-1}^2}$. Montrer que $(v_n)$ est convergente et déterminer sa limite.

(d) A l'aide de la suite de Césaro associée à $(v_n)$, montrer que : $u_n \underset{n\to+\infty}{\sim} \dfrac{1}{2\sqrt{n}}$.` },
    { id: "ch9-ex4", number: "4", statement: r`Suite implicite

Soit $f$ la fonction définie sur $]0; +\infty[$ par : $f(x) = x + \ln x$.

1. Montrer que $f$ est une bijection strictement croissante de $]0; +\infty[$ sur $\mathbb{R}$.

2. Pour tout $n \in \mathbb{N}^*$, on note $x_n$ l'unique solution de l'équation : $x + \ln x = n$.
Calculer $x_1$. Etudier la monotonie et la convergence de la suite $(x_n)$.

3. (a) Pour tout $n \in \mathbb{N}^*$, comparer $f(n)$ et $n$. En déduire que : $x_n \leq n$.

(b) En déduire que : $\forall n \in \mathbb{N}^*, n - \ln n \leq x_n$.

(c) Donner un équivalent de $x_n$ lorsque $n$ est au voisinage de $+\infty$.` },
    { id: "ch9-ex5", number: "5", statement: r`On définit la suite $(u_n)$ par : $\begin{cases} u_0 = \dfrac{3}{2} \\ \forall n \in \mathbb{N}, u_{n+1} = \dfrac{1}{2}\left(u_n + \dfrac{2}{u_n}\right) \end{cases}$

1. Montrer que : $\forall n \in \mathbb{N}, u_n \in \left[\sqrt{2}; +\infty\right[$.

2. Montrer que $(u_n)$ est décroissante.

3. En déduire que $(u_n)$ est convergente et déterminer sa limite.` },
    { id: "ch9-ex6", number: "6", statement: r`On définit la suite $(u_n)$ par : $u_0 = 0$ et $\forall n \in \mathbb{N}, u_{n+1} = \sqrt{12 - u_n}$.

1. Etudier la fonction : $x \mapsto \sqrt{12 - x}$ (domaine de définition, variations, points fixes, graphe).

2. Montrer que la suite $(u_n)$ est bien définie.

3. (a) Etudier la monotonie des suites $(u_{2n})$ et $(u_{2n+1})$.

(b) On admet que : $\forall n \geq 1, |u_{2n+1} - u_{2n}| \leq \dfrac{1}{4\sqrt{2}}|u_{2n} - u_{2n-1}|$ (ce résultat pourra être démontré ultérieurement avec l'inégalité des accroissements finis). En déduire que les suites $(u_{2n})$ et $(u_{2n+1})$ sont adjacentes.

4. La suite $(u_n)$ est-elle convergente ? Si oui, quelle est sa limite ?` },
    { id: "ch9-ex7", number: "7", statement: r`On dit d'une suite de réels $(u_n)_{n\in\mathbb{N}}$ qu'elle est de Cauchy si :
$$\forall \varepsilon > 0,\ \exists N \in \mathbb{N},\ \forall (p, q) \in \mathbb{N}^2,\ (p \geq N \text{ et } q \geq N) \Rightarrow |u_p - u_q| \leq \varepsilon.$$

1. Montrer qu'une suite de réels convergente est de Cauchy.

2. On veut démontrer que la réciproque du résultat précédent est vraie.

(a) Montrer que toute suite de Cauchy est bornée.

(b) En déduire que toute suite de Cauchy converge.

Du fait de ce résultat, on dit que $\mathbb{R}$ – ou plutôt $\mathbb{R}$ muni de la valeur absolue – est complet.

3. Soit $(u_n)$ une suite réelle telle que : $\forall p \in \mathbb{N},\ u_{n+p} - u_n \underset{n\to+\infty}{\longrightarrow} 0$.
La suite $(u_n)$ est-elle de Cauchy ?` },
    { id: "ch9-ex8", number: "8", statement: r`Dans chacun des cas suivants, exprimer $u_n$ en fonction de $n$.

1. $u_1 = 1$, $u_2 = 0$, et $\forall n \geq 1, u_{n+2} = u_{n+1} - \dfrac{1}{4}u_n$

2. $u_0 = 1$, $u_1 = 0$, et $\forall n \in \mathbb{N}, u_{n+2} - 2\sqrt{2}u_{n+1} + 4u_n = 0$` },
    { id: "ch9-ex9", number: "9", statement: r`On considère les suites $(x_n)$ et $(y_n)$ définies par :
$$x_0 = 2, y_0 = -1 \text{ et : } \forall n \in \mathbb{N}, \begin{cases} x_{n+1} = -2x_n + y_n \\ y_{n+1} = 2x_n - 3y_n \end{cases}$$

1. Déterminer deux réels $a$ et $b$ tels que : $\forall n \in \mathbb{N}, x_{n+2} = ax_{n+1} + bx_n$.

2. En déduire une expression de $x_n$, puis de $y_n$ en fonction de $n$.` },
    { id: "ch9-ex10", number: "10", statement: r`Soient $(x_n),(y_n) \in \mathbb{R}^{\mathbb{N}}$ vérifiant : $x_{n+1} = \frac{1}{2}(x_n - y_n)$ et $y_{n+1} = \frac{1}{2}(x_n + y_n)$ pour tout $n \in \mathbb{N}$. Étudier la convergence de la suite $(x_n + iy_n)$, puis celles de $(x_n)$ et de $(y_n)$.` },
  ],
};

export default chapter;
