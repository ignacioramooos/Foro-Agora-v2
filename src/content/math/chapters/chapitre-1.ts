import type { MathChapter } from "../types";

const r = String.raw;

const chapter: MathChapter = {
  id: "chapitre-1",
  number: 1,
  title: "Logique et raisonnements mathématiques",
  summary: "Quantificateurs, négation, implication, contraposée, raisonnement par l'absurde, analyse-synthèse et récurrence.",
  pdfUrl: "/practica/c1.pdf",
  exercises: [
    { id: "ch1-ex1", number: "1", statement: r`Déterminer si les énoncés mathématiques qui suivent ont un sens, et les traduire en français le cas échéant. On ne demande pas de déterminer s'ils sont vrais ou faux.
1. $\forall x \in \mathbb{R},\ \exists y \in \mathbb{N},\ y \geq x$.
2. $\forall (x,y) \in \mathbb{R}^2,\ \exists z \in \mathbb{R},\ x < z < y$.
3. $\forall x \in \mathbb{R},\ x \Rightarrow 2$.
4. $\forall f \in \mathcal{F}(\mathbb{R},\mathbb{R}),\ \forall x \in \mathbb{R},\ x \leq f(x)$.
5. $\exists x \in \mathbb{R},\ \forall y \in \mathbb{R},\ x < y^2,\ \exists z \in \mathbb{R}$.
6. $\exists x \in \mathbb{R},\ \forall y \in \mathbb{R},\ y > x \Rightarrow (\forall z \in \mathbb{R}^-,\ z \leq y)$.
7. $\forall (x,y,z) \in \mathbb{Z}^3,\ (x \leq y \wedge y \leq z) \Rightarrow (x^2 \leq y^2 \vee x^2 \leq z^2)$.` },
    { id: "ch1-ex2", number: "2", statement: r`Écrire la négation de tous les énoncés de l'exercice 1 qui ont du sens.
1. $\forall x \in \mathbb{R},\ \exists y \in \mathbb{N},\ y \geq x$.
2. $\forall (x,y) \in \mathbb{R}^2,\ \exists z \in \mathbb{R},\ x < z < y$.
4. $\forall f \in \mathcal{F}(\mathbb{R},\mathbb{R}),\ \forall x \in \mathbb{R},\ x \leq f(x)$.
6. $\exists x \in \mathbb{R},\ \forall y \in \mathbb{R},\ y > x \Rightarrow (\forall z \in \mathbb{R}^-,\ z \leq y)$.
7. $\forall (x,y,z) \in \mathbb{Z}^3,\ (x \leq y \wedge y \leq z) \Rightarrow (x^2 \leq y^2 \vee x^2 \leq z^2)$.` },
    { id: "ch1-ex3", number: "3", statement: r`Réécrire les énoncés suivants uniquement à l'aide de symboles mathématiques.
1. Le nombre 5 est un entier.
2. Toute fonction définie sur $\mathbb{R}$ et à valeurs dans $\mathbb{R}$ admet une valeur réelle en 0.
3. Il existe un entier naturel plus grand que $100^{100}$.
4. Si $x$ est un réel strictement négatif alors il est strictement inférieur à sa valeur absolue.
5. La fonction $f$ préserve les inégalités larges.
6. Si $x$ appartient à l'ensemble $E$, alors $x$ est soit réel, soit de module inférieur ou égal à 1.
7. Étant donnés deux réels $m$ et $n$ quelconques vérifiant $m \leq n$, il existe un rationnel $q$ compris strictement entre $m$ et $n$ ou alors $m = n$.
8. Étant donnée une fonction $f$ de $\mathbb{R}$ dans $\mathbb{R}$ quelconque, il existe deux fonctions $g$ et $h$ de $\mathbb{R}$ dans $\mathbb{R}$ telles que pour tout $n \in \mathbb{Z}$, $g$ et $h$ sont constantes sur $[n, n+1[$ et encadrent $f$ sur $[n, n+1[$.` },
    { id: "ch1-ex4", number: "4", statement: r`1. VRAI ou FAUX. Soit la proposition $\mathcal{P}$ : « Tous les italiens sont des artistes et des mathématiciens ».
• Paul est italien, donc il est artiste.
• Paul n'est pas un mathématicien donc Paul n'est pas italien.
• Rémi n'est pas un italien, donc il n'est ni artiste, ni mathématicien.
2. Soit la proposition $\mathcal{P}$ : « Je pense donc je suis ». Quelle est la négation ?
• « Je pense et je ne suis pas ».
• « Je ne pense pas donc je ne suis pas ».
• « Je ne suis pas, donc je ne pense pas ».
3. Soit la proposition $\mathcal{Q}$ : « s'il pleut, mon jardin est mouillé ». Quelle est sa négation ?
• « S'il ne pleut pas, mon jardin n'est pas mouillé ».
• « S'il ne pleut pas, mon jardin est mouillé ».
• « Si mon jardin n'est pas mouillé, il ne pleut pas ».
• Autre réponse.` },
    { id: "ch1-ex5", number: "5", statement: r`Soit $f$ une fonction définie sur $\mathbb{R}$. Traduire à l'aide des quantificateurs les expressions suivantes :
1. La fonction $f$ ne s'annule pas.
2. La fonction $f$ est positive.
3. La fonction $f$ n'est pas positive.
4. La fonction $f$ n'est pas la fonction nulle.` },
    { id: "ch1-ex6", number: "6", statement: r`Sur une île, il y a deux types d'habitants : les menteurs qui mentent toujours et les honnêtes qui disent toujours la vérité. Un homme dit « Je suis un menteur ». Montrer par l'absurde que cet homme n'est pas un habitant de l'île.` },
    { id: "ch1-ex7", number: "7", statement: r`Trouver l'erreur. Soient $a$ et $b$ des réels non nuls tels que $a = b$. On a :
$$\begin{aligned} a = b &\Rightarrow a^2 = ab \\ &\Rightarrow a^2 - b^2 = ab - b^2 \\ &\Rightarrow (a+b)(a-b) = b(a-b) \\ &\Rightarrow a + b = b && \text{en simplifiant par } a-b \\ &\Rightarrow 2b = b && \text{car } a = b \\ &\Rightarrow 2 = 1 && \text{en simplifiant par } b \end{aligned}$$` },
    { id: "ch1-ex8", number: "8", statement: r`1. Pour tout entier $n$, le nombre $n(n+1)(2n+1)$ est-il toujours un multiple de 3 ?
2. Existe-t-il un entier $n$ tel que $n^2 + 11$ soit une puissance de 2 ?
3. Soient $P$ et $Q$ deux points et $d$ une droite du plan. Déterminer, suivant les positions de $P$, $Q$ et $d$, le nombre de points $R$ appartenant à $d$ tels que le triangle $PQR$ soit isocèle en $Q$.` },
    { id: "ch1-ex9", number: "9", statement: r`Démontrer la proposition suivante : soit $n$ un entier naturel. Si $n \geq 3$ et $n$ est premier, alors $n$ est impair.
1. En effectuant un raisonnement par contraposée.
2. En effectuant un raisonnement par l'absurde.` },
    { id: "ch1-ex10", number: "10", statement: r`Le but de cet exercice est de démontrer qu'il existe une unique fonction commutant avec toutes les fonctions de $\mathbb{R}$ dans $\mathbb{R}$, c'est-à-dire :
$$\exists! g \in \mathcal{F}(\mathbb{R};\mathbb{R}),\ \forall f \in \mathcal{F}(\mathbb{R};\mathbb{R}),\ \forall x \in \mathbb{R},\ (g \circ f)(x) = (f \circ g)(x).$$
1. Première méthode : déterminer une fonction $g$ évidente vérifiant la propriété souhaitée puis montrer qu'il n'y en a pas d'autre.
2. Deuxième méthode : traiter la question posée par analyse-synthèse.` },
    { id: "ch1-ex11", number: "11", statement: r`1. On veut démontrer que $\sqrt{2}$ est irrationnel, par un raisonnement par l'absurde.
(a) Quelle est l'hypothèse de départ ?
(b) Pourquoi peut-on dire qu'il existe deux entiers naturels $p$ et $q$ tels que $\sqrt{2} = \dfrac{p}{q}$ ? On admet que l'on peut choisir $\dfrac{p}{q}$ irréductible ($p$ et $q$ premiers entre eux).
(c) Démontrer que $p^2$ est pair.
(d) En déduire que $p$ est pair.
(e) En déduire que $q$ est pair. Pourquoi cela constitue-t-il une contradiction ?
(f) Conclure soigneusement.
2. Montrer que $\dfrac{\ln(3)}{\ln(2)}$ est irrationnel.` },
    { id: "ch1-ex12", number: "12", statement: r`Le raisonnement par récurrence.
1. Montrer que pour tout $n \in \mathbb{N}^*$, $2^{n-1} \leq n! \leq n^n$.
2. Soit $(u_n)$ définie par $u_0 = 2$ et $\forall n \in \mathbb{N},\ u_{n+1} = \dfrac{u_n}{1+u_n}$. Montrer que pour tout $n \in \mathbb{N}$, $u_n = \dfrac{2}{2n+1}$.
3. Montrer que pour tout $n \in \mathbb{N}$, il existe deux entiers naturels $a_n$ et $b_n$ tels que $(1+\sqrt{2})^n = a_n\sqrt{2} + b_n$.
4. Soit $(u_n)_{n\in\mathbb{N}}$ définie par $u_0 = \dfrac{1}{2}$ et $u_{n+1} = \dfrac{u_n}{u_n - 1}$. Montrer que $\forall n \in \mathbb{N},\ u_{2n} = \dfrac{1}{2}$ et $u_{2n+1} = -1$.` },
    { id: "ch1-ex13", number: "13", statement: r`On considère la suite de Fibonacci $(u_n)_{n\in\mathbb{N}}$ donnée par $u_0 = 0$, $u_1 = 1$ et $\forall n \in \mathbb{N},\ u_{n+2} = u_{n+1} + u_n$. Démontrer que pour tout $n \in \mathbb{N}$,
$$u_n \leqslant \left(\frac{34}{21}\right)^n.$$` },
    { id: "ch1-ex14", number: "14", statement: r`Soit $(u_n)_{n\in\mathbb{N}}$ la suite définie par
$$\begin{cases} u_0 = 2 \\ \forall n \in \mathbb{N},\ u_{n+1} = \displaystyle\sum_{k=0}^{n} (u_n)^{u_k} \end{cases}$$
Montrer que pour tout $n \in \mathbb{N}$, $u_n \in \mathbb{N}$.` },
    { id: "ch1-ex15", number: "15", statement: r`1. Montrer que, pour tout $n \in \mathbb{N}$, on a $2^n > n$.
2. Montrer que, pour tout $n \in \mathbb{N}$, on a $2^n + 1 \geqslant n^2$.` },
    { id: "ch1-ex16", number: "16", statement: r`Soit $(a_n)_{n\in\mathbb{N}^*}$ une suite d'éléments de $[0;1]$. Montrer que :
$$\forall n \in \mathbb{N}^*,\ \prod_{k=1}^{n} (1 - a_k) \geqslant 1 - \sum_{k=1}^{n} a_k.$$` },
    { id: "ch1-ex17", number: "17", statement: r`Soit $f : \,]-1;+\infty[\, \to \mathbb{R},\ x \mapsto \ln(1+x)$. Montrer que $f$ est dérivable $n$ fois sur $]-1;+\infty[$ et déterminer l'expression de $f^{(n)}$ pour tout $n \in \mathbb{N}$.` },
  ],
};

export default chapter;
