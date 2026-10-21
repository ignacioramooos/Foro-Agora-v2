import type { MathExercise } from "../types";
const r = String.raw;
export const chapitre2Exemples: MathExercise[] = [
  { id: "ch2-exemple-1", number: "1.2", source: "exemple", statement: r`1. Ensembles concrets : ensemble des lettres de l’alphabet $\mathcal{A} = \{a,b,c,\ldots\}$ : on a $y \in \mathcal{A}$ et $3 \notin \mathcal{A}$ ; ensemble des villes de la Côte d’Azur, ensemble des atomes dans l’univers...

2. Ensembles de nombres : $\mathbb{N}$, $\mathbb{R}_+$, $\{-5;3;4;7\}$, $]-3,4]$, $\mathbb{C}^*$, $\left\{\dfrac{\pi}{2}+k\pi,\ k\in\mathbb{Z}\right\}$, $\{2\}$ etc.

3. Ensembles de points en géométrie (le plan, l’espace, une droite, une hyperbole,...)

4. Ensembles de fonctions : ensemble des fonctions définies sur $\mathbb{R}$, ensemble des fonctions paires, ensemble des solutions de l’équation différentielle $y' + xy = 0$, etc.` },
  { id: "ch2-exemple-2", number: "1.5", source: "exemple", statement: r`Les ensembles $\mathbb{N}$, $\mathbb{N}^*$, $\mathbb{Z}$, et $\mathbb{Q}$ sont dénombrables, mais $\mathbb{R}$ ne l’est pas.` },
  { id: "ch2-exemple-3", number: "3.2", source: "exemple", statement: r`Soit $E = \{1,2\}$. Alors $\mathcal{P}(E) = \{\varnothing,\{1\},\{2\},\{1,2\}\}$.` },
  { id: "ch2-exemple-4", number: "4.2", source: "exemple", statement: r`Si $A = \{0,1,2\}$ et $B = \{1,2,3\}$, quel est l’ensemble $A \cup B$ ?` },
  { id: "ch2-exemple-5", number: "4.6", source: "exemple", statement: r`Reprenons les ensembles de l’exemple 4.2. Quel est l’ensemble $A \cap B$ ?` },
  { id: "ch2-exemple-6", number: "4.12", source: "exemple", statement: r`▹ $\mathbb{N}^* = \mathbb{N}\setminus\{0\}$

▹ Si $A = \{1,2,3,6\}$ et $B = \{2,6,7\}$ , quel est l’ensemble $A\setminus B$ ?

▹ Si $E$ est un ensemble alors quel est l’ensemble $E\setminus E$ ?` },
  { id: "ch2-exemple-7", number: "4.18", source: "exemple", statement: r`Notons $E$ l’ensemble des candidats au concours Mines-Ponts en filière MP, $I$ le sous-ensemble de $E$ des candidats ayant choisi l’option informatique et $S$ le sous-ensemble de $E$ des candidats ayant choisi l’option SI. $(I,S)$ forme une partition de $E$.` },
  { id: "ch2-exemple-8", number: "4.21", source: "exemple", statement: r`• Si $E = \{0,2\}$ et $F = \{0,1,2,3\}$, quel est l’ensemble $E \times F$ ?

• $\mathbb{N}\times\mathbb{N} = \coprod_{n\in\mathbb{N}}\left\{(i,j)\in\mathbb{N}^2,i+j=n\right\}$.` },
  { id: "ch2-exemple-9", number: "4.24", source: "exemple", statement: r`• L’ensemble $\mathbb{R}^3$ est l’ensemble des triplets de réels (ensemble utilisé pour la géométrie dans l’espace).

• L’ensemble $\mathbb{R}^n$, avec $n \in \mathbb{N}^*$ est l’ensemble des $n$-uplets de réels.` },
  { id: "ch2-exemple-10", number: "5.2", source: "exemple", statement: r`Voici trois exemples d’applications :

• $f : \begin{array}{ccc}\mathbb{R}_+^* & \longrightarrow & \mathbb{R}\\ x & \longmapsto & \ln(x)\end{array}$

• L’application de $\{0,1,2\}$ dans $\{0,1,2\}$ qui à 0 associe 1, à 1 associe 2, et à 2 associe 0.

• Soit $\mathcal{V} = \{\text{Barcelone, Reykjavik, Le Havre, Madrid, Paris, Strasbourg}\}$ et $\mathcal{P} = \{\text{Allemagne, Espagne, France, Islande}\}$. On peut considérer l’application $f : \mathcal{V} \to \mathcal{P}$ qui à une ville associe son pays.` },
  { id: "ch2-exemple-11", number: "5.9", source: "exemple", statement: r`Soit $f : \begin{array}{ccc}\mathbb{R}_+ & \longrightarrow & \mathbb{R}\\ x & \longmapsto & \sqrt{x+1}\end{array}$

L’ensemble de départ est $\mathbb{R}_+$, l’ensemble d’arrivée est $\mathbb{R}$.

• Soit $A = [0;3]$. Quel est l’image de $A$ par $f$ ?

• Soit $B = [2;5]$. Quelle est l’image réciproque de $B$ par $f$ ?` },
  { id: "ch2-exemple-12", number: "5.14", source: "exemple", statement: r`De quel ensemble la fonction $1 - \mathbb{1}_A$ est-elle la fonction indicatrice ?` },
  { id: "ch2-exemple-13", number: "5.17", source: "exemple", statement: r`On peut considérer la famille de nombres réels $(a_{m,n})_{m\in\mathbb{N},n\in\mathbb{N}}$ définie par :

$$a_{m,n} = \frac{1}{m+n+1}$$

On a par exemple $a_{4,2} = \dfrac{1}{7}$.` },
  { id: "ch2-exemple-14", number: "6.2", source: "exemple", statement: r`Soit $f$ l’application définie sur $\mathbb{R}$ par :

$$\forall x \in \mathbb{R}^*,\ f(x) = \ln(|x|)\text{ et }f(0) = 0$$

Alors si on note $g$ la restriction de $f$ à $\mathbb{R}^{-*}$, on a :

$$\forall x \in \mathbb{R}^{-*},\ g(x) = \ln(-x)$$` },
  { id: "ch2-exemple-15", number: "6.4", source: "exemple", statement: r`La fonction $\ln$ n’est définie que sur $\mathbb{R}^{+*}$. On peut la prolonger sur tout $\mathbb{R}^+$ en posant :

$$f : \begin{array}{ccc}\mathbb{R}^+ & \longrightarrow & \mathbb{R}\\ x & \longmapsto & \begin{cases}\ln(x)&\text{si }x>0\\0&\text{si }x=0\end{cases}\end{array}$$` },
  { id: "ch2-exemple-16", number: "6.7", source: "exemple", statement: r`On reprend l’exemple ci-dessus d’une application $f : \mathcal{V}\to\mathcal{P}$ qui à une ville associe son pays, avec $\mathcal{V} = \{\text{Barcelone, Reykjavik, Le Havre, Madrid, Paris, Strasbourg}\}$ et $\mathcal{P} = \{\text{Allemagne, Espagne, France, Islande}\}$. Soit $\mathcal{C} = \{\text{Berlin, Madrid, Paris, Reykjavik}\}$ et $g : \mathcal{P}\to\mathcal{C}$ l’application qui à un pays associe sa capitale.

Alors l’application $g\circ f$ associe à une ville la capitale dont elle dépend.` },
  { id: "ch2-exemple-17", number: "6.8", source: "exemple", statement: r`Soit $f : x \mapsto e^x$ et $g : x \mapsto x^2$. A t-on l’égalité $f\circ g = g\circ f$ ?` },
  { id: "ch2-exemple-18", number: "7.2", source: "exemple", statement: r`La première application est injective mais pas la deuxième :

[Figure : deux diagrammes d’applications de A vers B ; à gauche, trois éléments ont des images distinctes parmi quatre éléments ; à droite, deux des quatre éléments ont la même image parmi trois éléments.]` },
  { id: "ch2-exemple-19", number: "7.9", source: "exemple", statement: r`La deuxième application est surjective mais pas la première :

[Figure : deux diagrammes d’applications de A vers B ; à gauche, trois éléments ont des images distinctes et un des quatre éléments de B n’a pas d’antécédent ; à droite, les trois éléments de B ont un antécédent parmi les quatre éléments de A.]` },
  { id: "ch2-exemple-20", number: "7.20", source: "exemple", statement: r`Soit $f : \mathbb{N}\to\mathbb{N}$, définie par : $f(n) = \begin{cases}n+1&\text{si }n\text{ est pair}\\n-1&\text{si }n\text{ est impair}\end{cases}$

Montrer que $f$ est bijective.` },
  { id: "ch2-exemple-21", number: "8.3", source: "exemple", statement: r`1. L’égalité est une relation binaire sur tout ensemble $E$.

2. $\leq$ est une relation binaire sur $\mathbb{R}$.

3. Dans $\mathbb{N}$, on connait la relation binaire de divisibilité, notée $\mid$ et définie, pour tout $(a,b)\in\mathbb{N}^2$ par : $a\mid b$ ($a$ divise $b$) lorsqu’il existe $q\in\mathbb{N}$ tel que $b=aq$.

4. ”Est parallèle à” est une relation binaire sur $\mathcal{D}$, ensemble des droites d’un plan donné.

5. Soit $E$ un ensemble. L’inclusion est une relation binaire sur $\mathcal{P}(E)$.` },
  { id: "ch2-exemple-22", number: "8.5", source: "exemple", statement: r`1. Soit $E$ un ensemble. L’inclusion est une relation binaire sur $\mathcal{P}(E)$. Elle est réflexive, anti-symétrique et transitive mais non symétrique.

2. La relation de divisibilité dans $\mathbb{Z}$ est une relation binaire : elle est réflexive et transitive mais ni symétrique ni antisymétrique (car $-k$ et $k$ se divisent l’un l’autre).` },
  { id: "ch2-exemple-23", number: "8.7", source: "exemple", statement: r`1. L’égalité est une relation d’équivalence.

2. Le fait d’avoir le même signe sur $\mathbb{Z}$ est une relation d’équivalence.

3. Sur $\mathbb{R}$, on définit une relation binaire par : $\forall(x,y)\in\mathbb{R}^2,\ x\mathcal{R}y \Leftrightarrow x\equiv y\ [2\pi]$ ; c’est une relation d’équivalence.` },
  { id: "ch2-exemple-24", number: "8.9", source: "exemple", statement: r`1. Si $\mathcal{R}$ est l’égalité, les classes d’équivalences sont précisément les singletons.

2. Plaçons nous dans le cas $E = \mathbb{Z}$ et $a\mathcal{R}b \Leftrightarrow a = \pm b$. Les classes d’équivalence sont les paires $\{n,-n\}$, pour $n\in\mathbb{N}^*$, et le singleton $\{0\}$.

3. Plaçons nous dans le cas $E = \mathbb{N}$, fixons un entier naturel $k>0$ et considérons $a\mathcal{R}b \Leftrightarrow a\equiv b\ [k]$, c’est à dire la restriction à $\mathbb{N}$ de la congruence modulo $k$. Les classes d’équivalence sont les ensembles $k\mathbb{N}+r = \{kn+r,\ n\in\mathbb{N}\}$, pour $r\in\{0,1,\ldots,k-1\}$.` },
  { id: "ch2-exemple-25", number: "8.14", source: "exemple", statement: r`1. Sur $\mathbb{R}$, $\leq$ est une relation d’ordre.

2. L’inclusion est une relation d’ordre sur $\mathcal{P}(E)$.` },
  { id: "ch2-exemple-26", number: "8.17", source: "exemple", statement: r`1. Sur $\mathbb{R}$, $\leq$ est une relation d’ordre totale.

2. Si l’on définit sur $\mathcal{F}(\mathbb{R},\mathbb{R})$ la relation $\leq$ par : $f\leq g \Leftrightarrow \forall x\in\mathbb{R},\ f(x)\leq g(x)$, alors il s’agit d’une relation d’ordre partielle.

3. La relation de divisibilité sur $\mathbb{N}$ est une relation d’ordre partielle car 2 et 3 ne se divisent pas.` },
  { id: "ch2-exemple-27", number: "8.20", source: "exemple", statement: r`1. Le sous-ensemble $]-\infty,1[$ de $\mathbb{R}$ admet une infinité de majorants mais aucun plus grand élément. Il n’admet aucun minorant et donc aucun plus petit élément.

2. Comme on le voit dans l’exemple précédent, il existe des parties de $\mathbb{R}$ qui sont majorées mais n’admettent aucun plus grand élément. Néanmoins, pour $]-\infty,1[\subset\mathbb{R}$, 1 est remarquable car c’est le plus petit des majorants. Nous le nommerons bientôt borne supérieure de $]-\infty,1[$.

3. Dans $\mathbb{N}$ muni de la relation d’ordre "divisibilité", l’ensemble $\{2,6,10\}$ a comme plus petit élément 2 et comme majorant 30, mais ne possède pas de plus grand élément.

4. Dans $\mathcal{P}(E)$, muni de l’inclusion. Soit $\mathcal{A}$ un sous-ensemble de $\mathcal{P}(E)$. Alors $\displaystyle\bigcup_{A\in\mathcal{A}} A$ est un majorant de $\mathcal{A}$ et $\displaystyle\bigcap_{A\in\mathcal{A}} A$ est un minorant de $\mathcal{A}$.` },
];
