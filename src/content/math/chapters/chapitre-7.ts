import type { MathChapter } from "../types";

const r = String.raw;

const chapter: MathChapter = {
  id: "chapitre-7",
  number: 7,
  title: "Structures algébriques usuelles",
  summary: "Lois de composition internes, groupes, morphismes, anneaux et corps.",
  exercises: [
    { id: "ch7-cours-ex1", number: "1", source: "cours", statement: r`Soit $f : \mathbb{C}^* \to \mathbb{R}^*,\ z \mapsto |z|$.

1. Montrer que $f$ est un morphisme de $(\mathbb{C}^*, \times)$ dans $(\mathbb{R}^*, \times)$.

2. Déterminer $\mathrm{Ker}\, f$ et $\mathrm{Im}\, f$.` },
    { id: "ch7-cours-ex2", number: "2", source: "cours", statement: r`On considère l'ensemble, noté $\mathcal{M}_2(\mathbb{R})$, des matrices d'ordre 2 à coefficients réels qu'on note : $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$.

On définit sur $\mathcal{M}_2(\mathbb{R})$ une loi $+$ et $\times$, par :
$$\begin{pmatrix} a & b \\ c & d \end{pmatrix} + \begin{pmatrix} a' & b' \\ c' & d' \end{pmatrix} = \begin{pmatrix} a+a' & b+b' \\ c+c' & d+d' \end{pmatrix}$$
et
$$\begin{pmatrix} a & b \\ c & d \end{pmatrix} \times \begin{pmatrix} a' & b' \\ c' & d' \end{pmatrix} = \begin{pmatrix} aa'+bc' & ab'+bd' \\ a'c+c'd & b'c+dd' \end{pmatrix}$$

Montrer que $(\mathcal{M}_2(\mathbb{R}), +, \times)$ est un anneau. Est-il commutatif ?` },
    { id: "ch7-cours-ex3", number: "3", source: "cours", statement: r`Montrer que $(\mathbb{Z}[\sqrt{2}], +, \times)$, où $\mathbb{Z}[\sqrt{2}] = \{a + b\sqrt{2},\ (a,b) \in \mathbb{Z}^2\}$ est un sous-anneau de $(\mathbb{R}, +, \times)$.` },
    { id: "ch7-ex1", number: "1", statement: r`$k$ et $k'$ étant deux réels donnés, on définit la loi $\top$ sur $\mathbb{R}$ :
$$\forall (x,y) \in \mathbb{R}^2,\ x \top y = kxy + k'(x+y)$$
Déterminer $(k, k')$ pour que $\top$ soit associative.` },
    { id: "ch7-ex2", number: "2", statement: r`Sur $\mathbb{R}^2$ on considère la loi de composition interne notée $\heartsuit$ : $(x,y) \heartsuit (x',y') = (xx', y)$.

Montrer que $\heartsuit$ est associative, admet une infinité d'éléments neutres à droite et n'admet pas d'élément neutre à gauche.` },
    { id: "ch7-ex3", number: "3", statement: r`Soit $X$ un ensemble. Déterminer les éléments inversibles de $(\mathcal{P}(X), \cap)$.` },
    { id: "ch7-ex4", number: "4", statement: r`Sur $\mathbb{R}$, on définit la loi de composition interne $*$ par $x * y = \dfrac{x^3 + y^3}{x^2 + y^2}$ pour $(x,y) \in \mathbb{R}^2 \setminus \{(0,0)\}$ et $0 * 0 = 0$.

Étudier la commutativité, l'associativité de $*$. Existe-il un élément neutre pour $*$ ? Un réel donné admet-il un symétrique pour la loi $*$ ? La multiplication usuelle de $\mathbb{R}$ est-elle distributive sur la loi $*$ ?` },
    { id: "ch7-ex5", number: "5", statement: r`Groupe à éléments involutifs

Soit $(G, .)$ un groupe d'élément neutre $e$. On suppose que pour tout $x$ de $G$, $x^2 = e$ (tout élément de $G$ est involutif). Montrer que $G$ est commutatif.` },
    { id: "ch7-ex6", number: "6", statement: r`Un groupe fini à 4 éléments

Soient les quatre applications $f_1, f_2, f_3, f_4$ de $\mathbb{C}^*$ dans $\mathbb{C}^*$ : $f_1(z) = z$, $f_2(z) = \dfrac{1}{z}$, $f_3(z) = -z$, $f_4(z) = -\dfrac{1}{z}$. Montrer que $G = \{f_1, f_2, f_3, f_4\}$ est un groupe pour la loi $\circ$.` },
    { id: "ch7-ex7", number: "7", statement: r`Les endomorphismes de $(\mathbb{Z}, +)$

1. Déterminer tous les morphismes de $(\mathbb{Z}, +)$ dans lui-même.

2. Parmi eux, lesquels sont injectifs ? Lesquels sont surjectifs ?` },
    { id: "ch7-ex8", number: "8", statement: r`Éléments nilpotents d'un anneau

Soit $(A, +, \times)$ un anneau. Un élément $x$ de $A$ est dit nilpotent lorsqu'il existe un entier naturel non nul $n$ tel que $x^n = 0_A$. Montrer que si $x$ est nilpotent alors $1_A - x$ est inversible. Démontrer que si deux éléments $x$ et $y$ de $A$ sont nilpotents et commutent, alors $xy$ et $x + y$ sont nilpotents.` },
    { id: "ch7-ex9", number: "9", statement: r`Montrer qu'un anneau $A$ n'est pas réduit à $\{0_A\}$ si et seulement si $0_A \neq 1_A$.` },
    { id: "ch7-ex10", number: "10", statement: r`1. Déterminer le groupe des éléments inversibles pour les anneaux usuels suivants : $(\mathbb{Z}, +, \times)$, $(\mathbb{Q}, +, \times)$, $(\mathcal{F}(\mathbb{R}, \mathbb{R}), +, \times)$, $(\mathbb{R}[X], +, \times)$.

2. Déterminer le groupe des éléments inversibles de l'anneau de Gauss $\mathbb{Z}[i]$.` },
    { id: "ch7-ex11", number: "11", statement: r`Corps des nombres constructibles à la règle et au compas

Soit $K$ l'ensemble des longueurs algébriques constructibles à la règle et au compas à partir de deux points distants de l'unité. On suppose que 0 et 1 sont dans $K$.

1. Montrer que $2$, $-2$, $\dfrac{1}{2}$, et $\sqrt{2}$ sont dans $K$.

2. Montrer que $K$ est un corps (on pourra faire appel au théorème de Thalès).

3. Montrer que si $x \in K \cap \mathbb{R}_+$ alors $\sqrt{x} \in K$.` },
    { id: "ch7-ex12", number: "12", statement: r`Une construction du corps des nombres complexes

On considère sur $\mathbb{R}^2$ les deux lois, notées additivement et multiplicativement :
$$(x,y) + (x',y') = (x+x', y+y') \quad \text{et} \quad (x,y) \times (x',y') = (xx' - yy', xy' + yx')$$

1. Montrer que $(\mathbb{R}^2, +, \times)$ est un corps. Préciser les éléments neutres pour l'addition et la multiplication, l'opposé d'un élément et l'inverse d'un élément non nul.

2. Montrer que l'application $\varphi : \mathbb{R} \to \mathbb{R}^2,\ x \mapsto (x, 0)$ est injective et que pour tout $(x, x') \in \mathbb{R}^2$ on a :
$$\varphi(x + x') = \varphi(x) + \varphi(x') \quad \text{et} \quad \varphi(xx') = \varphi(x)\varphi(x').$$
Le corps $\mathbb{R}^2$ muni des deux lois précédemment définies est appelé corps des nombres complexes et est noté $\mathbb{C}$. Par identification d'un réel $x$ au nombre complexe $\varphi(x) = (x, 0)$, on identifie $\mathbb{R}$ à un sous-corps de $\mathbb{C}$ ($\mathbb{R}$ s'identifiant ainsi à $\varphi(\mathbb{R}) = \mathbb{R} \times \{0\} \subset \mathbb{C}$).

3. On note $i$ le nombre complexe $(0, 1)$. Montrer que $i^2 = -1$ puis montrer que l'on a pour tout complexe $z = (x, y)$, $z = x + iy$.
Expliquer alors pourquoi, pour tous complexes $z = x + iy$ avec $(x, y) \in \mathbb{R}^2$ et $z' = x' + iy'$ avec $(x', y') \in \mathbb{R}^2$, on a $z = z'$ si et seulement si ($x = x'$ et $y = y'$).
On retrouve bien que tout nombre complexe $z$ s'écrit de manière unique sous la forme $z = x + iy$ avec $(x, y) \in \mathbb{R}^2$.` },
    { id: "ch7-ex13", number: "13", statement: r`On note $\mathbb{Z}\left[\sqrt{3}\right] = \left\{a + b\sqrt{3};\ (a,b) \in \mathbb{Z}^2\right\}$.

1. Montrer que $\mathbb{Z}\left[\sqrt{3}\right]$ est un sous-anneau de $(\mathbb{R}, +, \times)$.

2. Si $(a,b) \in \mathbb{Z}^2$, on pose $N\left(a + b\sqrt{3}\right) = a^2 - 3b^2$.

(a) Montrer que ceci définit une application de $\mathbb{Z}\left[\sqrt{3}\right]$ dans $\mathbb{Z}$.

(b) Montrer que : $\forall (x, x') \in \mathbb{Z}\left[\sqrt{3}\right]^2,\ N(xx') = N(x)\,N(x')$.

3. Quels sont les éléments inversibles de $\mathbb{Z}\left[\sqrt{3}\right]$ ? Cet anneau est-il un corps ?` },
  ],
};

export default chapter;
