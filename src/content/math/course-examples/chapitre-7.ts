import type { MathExercise } from "../types";
const r = String.raw;
export const chapitre7Exemples: MathExercise[] = [
  { id: "ch7-exemple-1", number: "1.2", source: "exemple", statement: r`• Sur $\mathbb{N}$, $+$, $\times$ sont des l.c.i. En revanche, $-$ et $:$ ne sont pas des l.c.i sur $\mathbb{N}$ (elles ne sont pas toujours définies).

• Sur $\mathbb{Z}$, $+$, $\times$, $-$ sont des l.c.i. En revanche, $:$ n’en est pas une. Autre exemple : l’application $\mathbb{Z}\times\mathbb{Z}\to\mathbb{Z}$, définie par : $x*y=x-2y+3x^2y$, est une l.c.i.

• Sur $\mathbb{R}$, $+$, $\times$, $-$ sont des l.c.i. En revanche, $:$ n’en est pas une.

• Sur $\mathbb{R}_+^*$ : $+$, $\times$, et $:$ sont des l.c.i. De plus, l’application puissance définie $\mathbb{R}_+^*\times\mathbb{R}_+^*\to\mathbb{R}_+^*$ par : $x*y=x^y$ est aussi une l.c.i.

• Sur $\mathcal{F}(\mathbb{R},\mathbb{R})$ : $+$, $-$, $\times$, $\circ$ sont des l.c.i.

• Sur $\overrightarrow{\mathcal{E}}$ ensemble des vecteurs de l’espace : $+$ et $\wedge$ mais pas le produit scalaire car $\vec{u}\cdot\vec{v}\notin\overrightarrow{\mathcal{E}}$.

• Sur $\mathcal{P}(F)$ où $F$ est un ensemble : $\cap$ et $\cup$.` },
  { id: "ch7-exemple-2", number: "1.5", source: "exemple", statement: r`1. Sur $\mathbb{R}$, $+$ et $\times$ sont associatives et commutatives car on a toujours $(x+y)+z=x+(y+z)$, $x+y=y+x$, $(x\times y)\times z=x\times(y\times z)$ et $x\times y=y\times x$.
Par contre $-$ n’est ni associative ni commutative car par exemple : $(3-2)-1\ne 3-(2-1)$ et $3-2\ne 2-3$.

2. Sur $\mathcal{F}(\mathbb{R},\mathbb{R})$, la composition est associative : on a toujours $(f\circ g)\circ h=f\circ(g\circ h)$. En effet si $x\in\mathbb{R}$ alors $[(f\circ g)\circ h](x)=(f\circ g)\big(h(x)\big)=f\big(g(h(x))\big)$ et $[f\circ(g\circ h)](x)=f\big((g\circ h)(x)\big)=f\big(g(h(x))\big)$.

3. Par contre $\circ$ n’est pas commutative car en général $f\circ g\ne g\circ f$. Prenons par exemple $f=\exp$ et $g:x\mapsto x+1$. On a $(f\circ g)(x)=e^{x+1}$ alors que $(g\circ f)(x)=e^x+1$.

4. Sur $\overrightarrow{\mathcal{E}}$, $+$ est associative et commutative, par contre $\wedge$ n’est ni l’un ni l’autre : en général $\vec{u}\wedge\vec{v}\ne\vec{v}\wedge\vec{u}$ et $(\vec{u}\wedge\vec{v})\wedge\vec{w}\ne\vec{u}\wedge(\vec{v}\wedge\vec{w})$

5. Sur $\mathcal{P}(F)$, $\cap$ et $\cup$ sont associatives et commutatives.` },
  { id: "ch7-exemple-3", number: "1.8", source: "exemple", statement: r`1. Sur $\mathbb{R}$, $0$ est élément neutre pour $+$ car on a toujours $x+0=0+x=x$. Et $1$ est élément neutre pour $\times$ car on a toujours $x\times1=1\times x=x$.

2. Sur $\mathcal{F}(\mathbb{R},\mathbb{R})$, la fonction $\operatorname{Id}_E:x\mapsto x$ est élément neutre pour $\circ$ car on a toujours $f\circ\operatorname{Id}_E=f$ et $\operatorname{Id}_E\circ f=f$.

3. Sur $\mathcal{P}(F)$, $\cap$ a pour élément neutre $F$ car pour tout $A\subset F$, $A\cap F=F\cap A=A$. Et $\cup$ a pour élément neutre $\emptyset$ car pour tout $A\subset F$ on a $A\cup\emptyset=\emptyset\cup A=A$.` },
  { id: "ch7-exemple-4", number: "1.12", source: "exemple", statement: r`1. Soit $\mathbb{R}$ muni de la loi $+$ qui a $0$ pour élément neutre. Soit $x\in\mathbb{R}$, alors $x+(-x)=0$ et $(-x)+x=0$ donc $x$ admet pour symétrique $-x$. Dans le cas de l’addition, on ne parle pas d’inverse mais d’opposé et on n’écrit pas $x^{-1}$ mais $-x$.

2. Soit $\mathbb{N}$ muni de la loi $+$ qui a $0$ pour élément neutre mais aucun élément n’admet d’opposé, sauf $0$ lui-même qui a pour opposé $0$.

3. Soit $\mathbb{R}$ muni de la loi $\times$ qui a $1$ pour élément neutre. L’élément $0$ n’a pas d’inverse pour $\times$ : il n’existe aucun réel $y$ tel que $0\times y=y\times0=1$. Par contre tous les éléments $x\in\mathbb{R}^*$ ont un inverse qui est $x^{-1}=\dfrac{1}{x}$ car $x\times\dfrac{1}{x}=\dfrac{1}{x}\times x=1$.

4. Soit $\mathcal{F}(\mathbb{R},\mathbb{R})$ muni de la loi $\circ$ qui a $\operatorname{Id}_E:x\mapsto x$ pour élément neutre. Alors $f\in\mathcal{F}(\mathbb{R},\mathbb{R})$ est symétrisable s’il existe $g$ tel que $f\circ g=\operatorname{Id}_E$ et $g\circ f=\operatorname{Id}_E$. Ceci se produit si et seulement si $f$ est bijective, et dans ce cas son symétrique pour $\circ$ est la bijection réciproque $f^{-1}$.

Attention : Il ne suffit pas d’avoir $x*y=e$ pour dire que $y$ est un inverse de $x$.
Par exemple prenons dans $\mathcal{F}(\mathbb{R},\mathbb{R})$ les fonctions $f:x\mapsto e^x$ et $g:x\mapsto\ln(x)$ si $x>0$ et $0$ sinon.
On a $g\circ f=\operatorname{Id}_{\mathbb{R}}$ mais $f\circ g\ne\operatorname{Id}_{\mathbb{R}}$.
En fait ni $f$ ni $g$ ne sont inversibles (ce ne sont pas des bijections !) mais $f$ admet un inverse à gauche ($g$) et $g$ possède un inverse à droite ($f$).` },
  { id: "ch7-exemple-5", number: "1.14", source: "exemple", statement: r`Dans le cas $E=\mathcal{F}(\mathbb{R},\mathbb{R})$ muni de la loi $\circ$, les éléments inversibles sont les bijections.
On obtient (ou on retrouve) ainsi :

• Que la composée de deux bijections est une bijection, et que la bijection réciproque de $f\circ g$ est $g^{-1}\circ f^{-1}$.

• Que si $f$ est une bijection alors $f^{-1}$ aussi, et que $(f^{-1})^{-1}=f$.` },
  { id: "ch7-exemple-6", number: "1.17", source: "exemple", statement: r`1. Dans les ensembles de nombres classiques, la loi $\times$ est distributive sur la loi $+$.
On sait bien en effet que pour trois éléments quelconques $x$, $y$ et $z$ de $\mathbb{C}$, on a $x\times(y+z)=x\times y+x\times z$ et $(y+z)\times x=y\times x+z\times x$.

2. Par contre, dans $\mathcal{F}(\mathbb{R},\mathbb{R})$, la lci $\circ$ n’est pas distributive sur $+$. En effet si l’on prend $f=\exp$, $g=\operatorname{Id}_{\mathbb{R}}$ et $h=-\operatorname{Id}_{\mathbb{R}}$ alors, pour tout réel $x$, on a :
$$\begin{aligned}
\big(f\circ(g+h)\big)(x)&=f\big((g+h)(x)\big)\\
&=f\big(g(x)+h(x)\big)\\
&=f(x-x)=f(0)\\
&=1,
\end{aligned}$$
tandis qu’on a :
$$\begin{aligned}
\big((f\circ g)+(f\circ h)\big)(x)&=(f\circ g)(x)+(f\circ h)(x)\\
&=f\big(g(x)\big)+f\big(h(x)\big)\\
&=f(x)+f(-x)=e^x+e^{-x}.
\end{aligned}$$
Il est clair qu’on n’a pas toujours $e^x+e^{-x}=1$ (c’est par exemple faux pour $x=0$), ce qui signifie que $f\circ(g+h)\ne(f\circ g)+(f\circ h)$.
Ainsi $\circ$ n’est pas distributive à gauche sur $+$, donc pas distributive.` },
  { id: "ch7-exemple-7", number: "1.19", source: "exemple", statement: r`1. $\mathbb{N}$ est stable pour la loi $+$ de $\mathbb{R}$. En effet, $\forall(m,n)\in\mathbb{N}^2$, $m+n\in\mathbb{N}$.

2. La loi $+$ usuelle de $\mathbb{Z}$ induit une l.c.i dans l’ensemble des entiers relatifs pairs car cet ensemble est stable pour la loi $+$. En effet, la somme de deux entiers relatifs pairs est paire.` },
  { id: "ch7-exemple-8", number: "2.2", source: "exemple", statement: r`1. $(\mathbb{N},+)$ n’est pas un groupe puisque seul $0$ a un opposé. Par contre $(\mathbb{Z},+)$, $(\mathbb{Q},+)$, $(\mathbb{R},+)$ et $(\mathbb{C},+)$ sont des groupes, qui sont commutatifs.

2. $(\mathbb{R},\times)$ n’est pas un groupe puisque $0$ n’a pas d’inverse. Par contre si l’on remplace $\mathbb{R}$ par $\mathbb{R}^*$, $\times$ est toujours une l.c.i. puisque si $x,y\in\mathbb{R}^*$ alors $x\times y\in\mathbb{R}^*$. On a toujours $1$ comme élément neutre et cette fois tout élément a un inverse. Ainsi $(\mathbb{R}^*,\times)$ est un groupe, de même que $(\mathbb{C}^*,\times)$, $(\mathbb{Q}^*,\times)$, $(\mathbb{R}_+^*,\times)$ et $(\mathbb{Q}_+^*,\times)$.

3. $(\{-1,1\},\times)$ est un groupe, fini, contrairement aux précédents.` },
  { id: "ch7-exemple-9", number: "2.3", source: "exemple", statement: r`$(\mathcal{F}(\mathbb{R},\mathbb{R}),\circ)$ n’est pas un groupe car toute fonction n’est pas bijective. Par contre l’ensemble des bijections $\mathbb{R}\to\mathbb{R}$ est un groupe, qui n’est pas commutatif (contre-exemple avec $x\mapsto x+1$ et $x\mapsto x^3$).` },
  { id: "ch7-exemple-10", number: "2.7", source: "exemple", statement: r`$(\mathbb{Z}\times\mathbb{Z},+)$ ou $(\mathbb{R}\times\mathbb{R},+)$ sont des groupes.` },
  { id: "ch7-exemple-11", number: "2.16", source: "exemple", statement: r`1. Soit $G$ un groupe d’élément neutre $e$. Alors $\{e\}$ et $G$ sont deux sous-groupes de $G$.

2. $H=\{x\in G,\forall y\in G:x*y=y*x\}$ est un sous-groupe de $G$, on l’appelle le centre du groupe $G$.

3. Dans le groupe $(\mathbb{R},+)$ : $\mathbb{Z}$ est un sous-groupe car il est non vide, si $x\in\mathbb{Z}$ et $y\in\mathbb{Z}$ alors $x+y\in\mathbb{Z}$, et si $x\in\mathbb{Z}$ alors $-x\in\mathbb{Z}$.
Par contre $(\mathbb{N},+)$ n’est pas un sous-groupe car si $x\in\mathbb{N}$ alors on n’a pas forcément $-x\in\mathbb{N}$.

4. Dans le groupe $(\mathbb{C}^*,\times)$, soit $\mathbb{U}\subset\mathbb{C}^*$ l’ensemble des complexes de module $1$. C’est un sous-groupe car il est non vide ; si $z,z'\in\mathbb{U}$ alors $|z|=1$ et $|z'|=1$ donc $|zz'|=1$ et on a bien $zz'\in\mathbb{U}$ ; enfin, si $z\in\mathbb{U}$ alors $\left|\dfrac{1}{z}\right|=\dfrac{1}{|z|}=1$ donc $\dfrac{1}{z}\in\mathbb{U}$.
On peut encore obtenir que $\mathbb{U}_n$ est un sous-groupe de $(\mathbb{U},\times)$ et donc de $(\mathbb{C}^*,\times)$.
Attention : $\mathbb{U}$ est un groupe inclus dans $\mathbb{C}$ mais n’est pas un sous-groupe de $\mathbb{C}$ ! En effet $\mathbb{U}$ est un groupe pour $\times$ mais $\mathbb{C}$ est un groupe pour $+$.

5. Soit $E$ un ensemble quelconque. Pour $x\in E$, montrer que $Stab(x)=\{\sigma\in S_E,\ \sigma(x)=x\}$ est un sous-groupe de $S_E$.` },
  { id: "ch7-exemple-12", number: "2.22", source: "exemple", statement: r`1. $t\mapsto e^{it}$ est un morphisme de $(\mathbb{R},+)$ vers $(\mathbb{C}^*,\times)$.

2. Morphismes de $(\mathbb{C},+)$ vers $(\mathbb{R},+)$ : $\operatorname{Re}$ et $\operatorname{Im}$.

3. $z\mapsto\bar{z}$ est un morphisme de $(\mathbb{C},+)$ dans lui-même, et de $(\mathbb{C}^*,\times)$ dans lui-même.

4. Morphisme de $(\mathbb{Z},+)$ vers $(\mathbb{Z},+)$ : la multiplication par $3$, par tout $n\in\mathbb{Z}$.` },
  { id: "ch7-exemple-13", number: "2.24", source: "exemple", statement: r`1. Les endomorphismes du groupe $(\mathbb{R},+)$ sont toutes les fonctions $f:\mathbb{R}\to\mathbb{R}$ telles que :
$$\forall(x,y)\in\mathbb{R}^2,\ f(x+y)=f(x)+f(y)$$

2. $\exp:\mathbb{R}\to\mathbb{R}_+^*$ est un morphisme de $(\mathbb{R},+)$ dans $(\mathbb{R}_+^*,\times)$ qui est bijectif. C’est donc un isomorphisme entre ces deux groupes. Son application réciproque est $\ln:\mathbb{R}_+^*\to\mathbb{R}$ qui est un isomorphisme : $\ln(x\times y)=\ln x+\ln y$.

3. Soit $\mathbb{R}_n[X]$ l’ensemble des polynômes à coefficients réels et de degré $\le n$.
L’application $a_0+a_1X+a_2X^2+...+a_nX^n\mapsto(a_0,a_1,a_2,...,a_n)$ est un isomorphisme de $(\mathbb{R}_n[X],+)$ dans $(\mathbb{R}^{n+1},+)$.` },
  { id: "ch7-exemple-14", number: "3.3", source: "exemple", statement: r`1. $(\mathbb{Z},+,\times)$ est un anneau car :

• $(\mathbb{Z},+)$ est un groupe abélien ;

• $\times$ est bien une l.c.i associative et qui admet $1$ comme élément neutre ;

• dans $\mathbb{Z}$, la multiplication est bien distributive par rapport à l’addition.

La multiplication étant commutative, c’est même un anneau commutatif.

2. De même $(\mathbb{Q},+,\times)$, $(\mathbb{R},+,\times)$ et $(\mathbb{C},+,\times)$ sont des anneaux commutatifs.

3. $(\mathcal{F}(\mathbb{R},\mathbb{R}),+,\times)$ est également un anneau commutatif. L’élément nul est la fonction nulle et l’élément unité est la fonction constante égale à $1$.

4. L’ensemble des suites complexes est un anneau commutatif.

5. On note $\mathbb{R}[X]$ l’ensemble des polynômes à coefficients réels, il est muni de lois $+$ et $\times$ et $(\mathbb{R}[X],+,\times)$ est un anneau commutatif.` },
  { id: "ch7-exemple-15", number: "3.6", source: "exemple", statement: r`$(\mathcal{M}_2(\mathbb{R}),+,\times)$ est-il intègre ?` },
  { id: "ch7-exemple-16", number: "3.11", source: "exemple", statement: r`1. Si $(A,+,\times)$ est un anneau, $A$ est un sous-anneau (dit trivial) de $A$.

2. $(\mathbb{Z},+,\times)$ est un anneau commutatif. $(\mathbb{Z},+,\times)$ est un sous-anneau de $(\mathbb{Q},+,\times)$, lui même sous-anneau de $(\mathbb{R},+,\times)$, lui même sous-anneau de $(\mathbb{C},+,\times)$ qui est un anneau commutatif (mieux : $\mathbb{Q}$, $\mathbb{R}$ et $\mathbb{C}$ sont en fait des corps -voir plus loin mais on le sait déjà).

3. $(\mathbb{R}^{\mathbb{N}},+,\times)$ est un anneau commutatif. L’ensemble des suites réelles bornées, l’ensemble des suites réelles convergentes sont des sous-anneaux de $(\mathbb{R}^{\mathbb{N}},+,\times)$.

4. Soit $D$ une partie de $\mathbb{R}$. $(\mathcal{F}(D,\mathbb{R}),+,\times)$ est un anneau commutatif. $\mathcal{B}(D,\mathbb{R})$, $\mathcal{D}(D,\mathbb{R})$, $\mathcal{C}^{\infty}(D,\mathbb{R})$ sont des sous-anneaux de $(\mathcal{F}(D,\mathbb{R}),+,\times)$.` },
  { id: "ch7-exemple-17", number: "3.16", source: "exemple", statement: r`[Anneau des entiers de Gauss]
On note $\mathbb{Z}[i]$ la partie $\left\{a+ib,(a,b)\in\mathbb{Z}^2\right\}$ de $\mathbb{C}$. Montrer que $\mathbb{Z}[i]$ est un anneau pour les lois usuelles $+$ et $\times$. $(\mathbb{Z}[i],+,\times)$ est appelé l’anneau des entiers de Gauss.` },
  { id: "ch7-exemple-18", number: "3.18", source: "exemple", statement: r`1. On retrouve le fait que $(\mathbb{R}^*,\times)$ est un groupe, de même que $(\mathbb{Q}^*,\times)$ et $(\mathbb{C}^*,\times)$.

2. Dans le cas de $\mathbb{Z}$, les seuls inversibles sont $-1$ et $1$, on trouve donc le groupe à deux éléments $(\{-1,1\},\times)$.

3. Soit $A=\mathbb{Z}[i]$ muni de l’addition et de la multiplication habituelles. On a $A^*=\{1,-1,i,-i\}$ et on peut se rendre compte que $\{1,-1,i,-i\}$ est bien un groupe multiplicatif.` },
  { id: "ch7-exemple-19", number: "3.22", source: "exemple", statement: r`1. $A$ étant un anneau, $Id_A$ est un isomorphisme d’anneaux.

2. Soit $D$ une partie de $\mathbb{R}$ et $a\in D$ (fixé). L’application $\begin{array}{rcl}\mathcal{F}(D,\mathbb{R})&\to&\mathbb{R}\\f&\mapsto&f(a)\end{array}$ est un morphisme d’anneaux de $(\mathcal{F}(D,\mathbb{R}),+,\times)$ dans $(\mathbb{R},+,\times)$ (il est appelé morphisme d’évaluation en $a$).

3. $\mathcal{C}$ désignant l’ensemble des suites réelles convergentes, l’application $\begin{array}{rcl}\mathcal{C}&\to&\mathbb{R}\\u&\mapsto&\lim(u)\end{array}$ est un morphisme d’anneaux de $(\mathcal{C},+,\times)$ dans $(\mathbb{R},+,\times)$.` },
  { id: "ch7-exemple-20", number: "4.9", source: "exemple", statement: r`Quelques corps usuels :

1. $(\mathbb{Q},+,\times)$ est un corps ; c’est un sous-corps de $(\mathbb{R},+,\times)$, lui même sous-corps de $(\mathbb{C},+,\times)$.

2. On note $\mathbb{R}(X)$ l’ensemble des fractions rationnelles, c’est-à-dire l’ensemble des éléments de la forme $\dfrac{P}{Q}$ où $P\in\mathbb{R}[X]$ et $Q\in(\mathbb{R}[X])\setminus\{0\}$.
Sur $\mathbb{R}(X)$ on définit : une addition : $\dfrac{P_1}{Q_1}+\dfrac{P_2}{Q_2}=\dfrac{P_1Q_2+P_2Q_1}{Q_1Q_2}$, et une multiplication : $\dfrac{P_1}{Q_1}\dfrac{P_2}{Q_2}=\dfrac{P_1P_2}{Q_1Q_2}$.
On vérifie alors que $(\mathbb{R}(X),+,\times)$ est un corps.

3. Soit $E=\left\{M\in\mathcal{M}_2(\mathbb{R}),M=\begin{pmatrix}a&b\\-b&a\end{pmatrix},(a,b)\in\mathbb{R}^2\right\}$. $(E,+,\times)$ est un corps.

4. $\begin{array}{rcl}\mathbb{C}&\to&\mathbb{C}\\z&\mapsto&\bar{z}\end{array}$ est un isomorphisme de corps.` },
];
