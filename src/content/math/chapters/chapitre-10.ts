import type { MathChapter } from "../types";

const r = String.raw;

const chapter: MathChapter = {
  id: "chapitre-10",
  number: 10,
  title: "Limites et continuité",
  summary: "Limites d'une fonction, opérations, composition et ordre, équivalents et négligeabilité, continuité, théorème des valeurs intermédiaires.",
  exercises: [
    { id: "ch10-cours-ex1", number: "1", source: "cours", statement: r`Déterminer, quand cela est possible, la limite des fonctions suivantes.

1. $f(x) = |x| + \ln(x)$ en 1.

2. $f(x) = \dfrac{1}{x} + e^{-x}$ en $+\infty$.

3. $f(x) = \dfrac{1}{x} + x^5$ en $0^+$ et en $0^-$.

4. $f(x) = x^2 + \ln(x)$ en $+\infty$.

5. $f(x) = xe^x$ en 1 et $+\infty$.

6. $g(x) = \dfrac{-7}{x}$ en $0^+$.

7. $f(x) = \frac{1}{x-2}$ en $2^+$ puis en $2^-$.

8. $f(x) = \frac{1}{(x-2)^2}$ en $2^+$ puis en $2^-$.

9. $f(x) = \dfrac{x^2 + 5}{1 + \dfrac{1}{x}}$ en $+\infty$.

10. $g(x) = \dfrac{x^2 - 3}{x - 1}$ en $1^+$ et $1^-$.` },
    { id: "ch10-cours-ex2", number: "2", source: "cours", statement: r`Étudier la convergence de la suite $\left(\sqrt{2 + \frac{3}{n^2}}\right)_{n\in\mathbb{N}^*}$.` },
    { id: "ch10-cours-ex3", number: "3", source: "cours", statement: r`Étudier la convergence de la suite $\left(1 - e^{-\sqrt{n}}\right)_{n\in\mathbb{N}}$.` },
    { id: "ch10-cours-ex4", number: "4", source: "cours", statement: r`Étudier les limites suivantes :

1. $e^{\frac{1}{x}}$ quand $x$ tend vers $+\infty$.

2. $\ln(2 - x)$ quand $x$ tend vers 2.` },
    { id: "ch10-cours-ex5", number: "5", source: "cours", statement: r`Calculer : $\displaystyle\lim_{x\to+\infty} \frac{\lfloor x \rfloor}{x + 1}$.` },
    { id: "ch10-cours-ex6", number: "6", source: "cours", statement: r`Déterminer si les limites suivantes existent et le cas échéant, déterminer leur valeur (on distinguera limite à gauche et limite à droite lorsque c'est pertinent).

1. $\displaystyle\lim_{x\to 0} \frac{(\ln x)^2}{e^x}$

2. $\displaystyle\lim_{x\to+\infty} \frac{(\ln x)^2}{e^x}$

3. $\displaystyle\lim_{x\to+\infty} \frac{\sqrt{x}}{e^x - 1}$

4. $\displaystyle\lim_{x\to 0} \frac{x^2 + x + \ln x}{3\ln x}$` },
    { id: "ch10-cours-ex7", number: "7", source: "cours", statement: r`Considérons sur $]0;+\infty[$ les fonctions $f$ et $g$ définies par : $f(x) = x^2 - \ln x$ et $g(x) = x^2$. Les fonctions $f$ et $g$ sont-elles équivalentes au voisinage de $+\infty$ ?` },
    { id: "ch10-cours-ex8", number: "8", source: "cours", statement: r`Donner un équivalent au voisinage de $+\infty$ de : $f(x) = \dfrac{x^3 + 2x^2 + x - 2}{x^4 + 2x^2 + 1}$.` },
    { id: "ch10-cours-ex9", number: "9", source: "cours", statement: r`Peut-on prolonger par continuité en 0 la fonction $f$ définie sur $\mathbb{R}^{+*}$ par : $f(x) = x^x$ ?
Peut-on prolonger par continuité en 0 la fonction $f$ définie sur $\mathbb{R}^*$ par : $f(x) = \dfrac{e^x - 1}{x^3}$ ?` },
    { id: "ch10-cours-ex10", number: "10", source: "cours", statement: r`Montrer qu'un polynôme de degré impair possède au moins une racine réelle.` },
    { id: "ch10-cours-ex11", number: "11", source: "cours", statement: r`Soit $f$ la fonction définie par : $f(x) = (\ln x)^2 + 1$. Déterminer $f(]0, e])$ et $f([e^2, +\infty[)$.` },
    { id: "ch10-ex1", number: "1", statement: r`Étudier la fonction $f$ définie par $f(x) = x^{x^2}$ (étude de variations et limites éventuelles).` },
    { id: "ch10-ex2", number: "2", statement: r`Soit $f : \mathbb{R} \to \mathbb{R}$ une fonction périodique telle que $f$ admette une limite finie en $+\infty$. Montrer que $f$ est constante.` },
    { id: "ch10-ex3", number: "3", statement: r`1. On suppose qu'on a une fonction $f$ définie au voisinage de $+\infty$ et vérifiant :
$$f(x) \underset{x\to+\infty}{=} \frac{\ln(x) + 1}{x^2} - \frac{2}{x} + O\left(\frac{1}{x^2}\right)$$
Pouvez-vous donner un équivalent simple de $f$ en $+\infty$ ?

2. On suppose qu'on a une fonction $g$ définie au voisinage de 0 et vérifiant :
$$g(x) \underset{x\to 0}{=} \frac{x^2}{2} + x^2\ln(x) + o\left(x^2\right)$$
Pouvez-vous donner un équivalent simple de $g$ en 0 ?` },
    { id: "ch10-ex4", number: "4", statement: r`Donner un équivalent de $f(x)$ au point $a$ pour :

a. $f(x) = \dfrac{\ln(1 + \sqrt{x})}{x}$ et $a = 0$,

b. $f(x) = \dfrac{\ln(1 + x + x^2)}{x^2}$ et $a = 0$,

c. $f(x) = \sqrt{x + 4}\,\tan x$ et $a = 0$,

d. $f(x) = x^2\left(e^{\frac{1}{x}} - 1\right)$ et $a = +\infty$.` },
    { id: "ch10-ex5", number: "5", statement: r`Dans chacun des cas suivants, déterminer les limites de la fonction aux bornes de son ensemble de définition.

1. $f(x) = \dfrac{x^2 + 1}{x - 1}$

2. $f(x) = \dfrac{\ln x}{x^2 - 1}$

3. $f(x) = x^{1/x}$

4. $f(x) = \dfrac{x^2 - 1}{\sqrt{3x^2 + 1} - 2}$

5. $f(x) = x + \cos x$

6. $f(x) = \dfrac{x - 9}{\sqrt{x} - 3}$` },
    { id: "ch10-ex6", number: "6", statement: r`Etudier la continuité en 0 des fonctions définies respectivement sur $\mathbb{R}$ et $[0;1[$ :

1. $f(x) = \begin{cases} \dfrac{\ln(1 + e^{1/x})}{e^{1/x}} & \text{si} \quad x \neq 0 \\ 0 & \text{si} \quad x = 0 \end{cases}$

2. $g(x) = \begin{cases} \dfrac{e^x - 1}{x^x - 1} & \text{si} \quad x \in ]0;1[ \\ 0 & \text{si} \quad x = 0 \end{cases}$` },
    { id: "ch10-ex7", number: "7", statement: r`Soit f une fonction continue sur $[0;1]$ à valeurs dans $[0;1]$. Montrer qu'il existe au moins un réel $x_0$ dans $[0;1]$ tel que $f(x_0) = x_0$.` },
    { id: "ch10-ex8", number: "8", statement: r`Montrer que l'équation $x^2e^x = 1$ admet une unique solution sur $\mathbb{R}$ que l'on notera $\alpha$. Vérifier que $\alpha \in [0;1]$.` },
    { id: "ch10-ex9", number: "9", statement: r`Montrer que l'équation $\ln x = -x$ admet une unique solution sur $]0;+\infty[$.` },
    { id: "ch10-ex10", number: "10", statement: r`Soit $f$ la fonction définie par : $f(x) = \dfrac{\sqrt{\ln x}}{x}$. Montrer que $f$ réalise une bijection de $[\sqrt{e};+\infty[$ sur un intervalle que l'on déterminera.` },
    { id: "ch10-ex11", number: "11", statement: r`Pour quelle valeur de $a$ la fonction
$$f : \begin{array}{ccl} \mathbb{R}^* & \to & \mathbb{R} \\ x & \mapsto & \begin{cases} \dfrac{\sin(ax)}{2x} & \text{si } x < 0 \\[2mm] \dfrac{e^{3x} - 1}{x} & \text{si } x > 0 \end{cases} \end{array}$$
est-elle prolongeable par continuité en 0 ?` },
    { id: "ch10-ex12", number: "12", statement: r`Soit $f : \begin{array}{ccl} \mathbb{R}^{+*} & \to & \mathbb{R} \\ x & \mapsto & xE\left(\dfrac{1}{x}\right) \end{array}$.

1. Montrer que $f$ n'est pas continue en $\dfrac{1}{k}$ où $k \in \mathbb{N}^*$.

2. Montrer que $f$ admet un prolongement par continuité en 0 noté $\tilde{f}$.` },
    { id: "ch10-ex13", number: "13", statement: r`Étudier la définition et la continuité de chacune des fonctions suivantes, ainsi que les éventuels prolongements par continuité aux bornes :
$$f : x \mapsto \sqrt{(1 - x)\arcsin(1 - x)}, \quad g : x \mapsto e^{-\frac{1}{x^2}}, \quad h : x \mapsto \frac{x\ln x}{x - 1}, \quad j : x \mapsto \left(x(\ln x)^2 + 1\right)^{\frac{1}{\ln x}}.$$` },
    { id: "ch10-ex14", number: "14", statement: r`1. Déterminer tous les endomorphismes de groupe continus de $\mathbb{R}$.

2. En déduire tous les morphismes de groupes continus de $(\mathbb{R}, +)$ dans $(\mathbb{R}_+^*, \times)$.` },
    { id: "ch10-ex15", number: "15", statement: r`Soit $f$ une fonction continue et strictement positive sur un intervalle fermé $[a, b]$.

1. Montrer que la fonction $\dfrac{1}{f}$ est bornée sur $[a, b]$.

2. Montrer que le résultat est faux si l'on ne suppose pas que $f$ est continue.

3. Montrer que le résultat est faux si l'on remplace $[a, b]$ par un intervalle ouvert.` },
    { id: "ch10-ex16", number: "16", statement: r`Soit $f : \mathbb{R} \to \mathbb{R}$ une fonction continue dont toutes les valeurs sont des nombres rationnels. Montrer que $f$ est constante.` },
    { id: "ch10-ex17", number: "17", statement: r`Une fonction implicite

1. Montrer qu'il existe une fonction $f$ définie et continue sur $\mathbb{R}_+$, telle que : $\forall x \in \mathbb{R}_+,\ f(x)e^{f(x)} = x$. A-t-on unicité de $f$ ?

2. Étudier $\displaystyle\lim_{x\to+\infty} \frac{f(x)}{\ln x}$, puis déterminer un équivalent en $+\infty$ de $f(x) - \ln x$.

3. Déterminer un équivalent de $f$ en $0^+$.` },
    { id: "ch10-ex18", number: "18", statement: r`Soit $f : \mathbb{R} \to \mathbb{R}$ une fonction continue et périodique. Montrer que $f$ est uniformément continue sur $\mathbb{R}$.` },
    { id: "ch10-ex19", number: "19", statement: r`1. Soit $f : \mathbb{R}^+ \to \mathbb{R}$ une fonction uniformément continue sur $\mathbb{R}_+$. Montrer que $f(x) \underset{x\to+\infty}{=} O(x)$.

2. En déduire que l'exponentielle n'est pas uniformément continue sur $\mathbb{R}_+$.` },
  ],
};

export default chapter;
