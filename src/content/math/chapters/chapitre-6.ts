import type { MathChapter } from "../types";

const r = String.raw;

const chapter: MathChapter = {
  id: "chapitre-6",
  number: 6,
  title: "Les nombres complexes",
  summary: "Forme algébrique et trigonométrique, trigonométrie, racines de l'unité, équations dans ℂ.",
  pdfUrl: "/practica/c6.pdf",
  exercises: [
    { id: "ch6-ex1", number: "1", statement: r`Déterminer la forme algébrique des nombres complexes suivants :
$$z_1 = \frac{1-3i}{1+3i} \qquad z_2 = \left(\frac{1+i\sqrt{3}}{1-i}\right)^{20} \qquad z_3 = (i - \sqrt{2})^3 \qquad z_4 = (j+1)^{2023}$$` },
    { id: "ch6-ex2", number: "2", statement: r`Établir que, pour tout $x \in \left[0, \frac{\pi}{2}\right]$ : $\sin(x) \geqslant \dfrac{2x}{\pi}$, et interpréter géométriquement.` },
    { id: "ch6-ex3", number: "3", statement: r`Calculer explicitement :
$$\sin\left(\frac{29\pi}{6}\right) \qquad \tan\left(\frac{31\pi}{6}\right) \qquad \cos\left(\frac{(2^{140}+1)\pi}{3}\right)$$` },
    { id: "ch6-ex4", number: "4", statement: r`Résoudre chacune des équations suivantes, dans $\mathbb{R}$ puis dans $[0, 2\pi]$ :
$$\cos(x) = \frac{1}{2} \qquad \sin(x) = \cos(x) \qquad \sin^2(x) = \cos(x)$$
$$|\sin(x)| = \cos(x) \qquad \sin(x) - \sin^2(x) = \frac{1}{2} \qquad \sin(x) + \sin(2x) + \sin(3x) = 0$$` },
    { id: "ch6-ex5", number: "5", statement: r`Calculer :
$$A = \int_0^{\pi/4} \sin^2(t)\,dt \qquad B = \int_0^{\pi/4} \frac{1}{\cos^2(t)}\,dt \qquad C = \int_0^{\pi/4} \cos^3(t)\,dt$$` },
    { id: "ch6-ex6", number: "6", statement: r`Écrire les complexes suivants sous forme trigonométrique.
1. $z_1 = \sin\theta + i\cos\theta$, où $\theta \in \mathbb{R}$.
2. $z_2 = 1 + \cos\theta + i\sin\theta$, où $\theta \in \,]-\pi; \pi[$.` },
    { id: "ch6-ex7", number: "7", statement: r`Soient $a, b, c \in \mathbb{R}$ tels que :
$$\cos(a) + \cos(b) + \cos(c) = \sin(a) + \sin(b) + \sin(c) = 0$$
Montrer que :
$$\cos(2a) + \cos(2b) + \cos(2c) = \sin(2a) + \sin(2b) + \sin(2c) = 0$$` },
    { id: "ch6-ex8", number: "8", statement: r`On note $\omega = \exp\left(\dfrac{2i\pi}{7}\right)$ et on pose :
$$u = \omega + \omega^2 + \omega^4, \qquad v = \omega^3 + \omega^5 + \omega^6$$
Calculer $u + v$ et $uv$. En déduire $u$ et $v$.` },
    { id: "ch6-ex9", number: "9", statement: r`Pour tout entier naturel $n$ non nul, on pose $\omega = \exp\left(\dfrac{2i\pi}{n}\right)$. Montrer que :
$$\sum_{k=1}^{n} \binom{n}{k} \omega^k = -1 - 2^n \cos^n\frac{\pi}{n}$$` },
    { id: "ch6-ex10", number: "10", statement: r`Donner une CNS sur $n \in \mathbb{N}^*$ pour que $i$ soit racine $n$-ième de l'unité.` },
    { id: "ch6-ex11", number: "11", statement: r`On pose $Z = \dfrac{1 + i\sqrt{3}}{1 - i\sqrt{3}}$. Déterminer les nombres complexes $z$ tels que $z^3 = Z$.` },
    { id: "ch6-ex12", number: "12", statement: r`Résoudre dans $\mathbb{C}$ les équations suivantes :
$$6z^2 - (4 + 15i)z - 11 + 3i = 0 \qquad ; \qquad 4z^2 - 6(1+i)z + 17i = 0$$` },
    { id: "ch6-ex13", number: "13", statement: r`On considère l'équation dans $\mathbb{C}$ d'inconnue $z$ :
$$(E) \quad z^3 + (3 - 3i)z^2 + (2 - 9i)z - 6 - 8i = 0$$
1. Vérifier que $(E)$ a une solution imaginaire pure, de la forme $\alpha i$ avec $\alpha$ réel.
2. (a) Déterminer un nombre complexe $\delta$ tel que $\delta^2 = -8 + 6i$.
(b) En déduire toutes les solutions de $(E)$.` },
    { id: "ch6-ex14", number: "14", statement: r`On considère l'équation dans $\mathbb{C}$ d'inconnue $z$ :
$$(E) \quad z^4 - 2z^3 - z^2 - 2z + 1 = 0$$
1. En remarquant que 0 n'est pas solution de $(E)$, vérifier que $(E)$ équivaut à :
$$\left(z^2 + \frac{1}{z^2}\right) - 2\left(z + \frac{1}{z}\right) - 1 = 0$$
2. En déduire toutes les solutions de $(E)$. On pourra poser $Z = z + \dfrac{1}{z}$.` },
    { id: "ch6-ex15", number: "15", statement: r`Résoudre les équations suivantes :
$$z^3 = i \qquad z^6 + 64 = 0 \qquad e^z = 2 + 2i$$` },
    { id: "ch6-ex16", number: "16", statement: r`Résoudre dans $\mathbb{C}$ l'équation : $z^2 = 27\overline{z}$.` },
    { id: "ch6-ex17", number: "17", statement: r`On note $D = \{z \in \mathbb{C};\ |z| < 1\}$ et $H = \{z \in \mathbb{C};\ \mathrm{Re}(z) > 0\}$. On considère l'application
$$u : \mathbb{C} \setminus \{i\} \to \mathbb{C},\quad z \mapsto \frac{i + z}{i - z}$$
1. Montrer que $u$ est injective, mais non surjective.
2. Montrer que $u$ induit une bijection de $D$ sur $H$.` },
    { id: "ch6-ex18", number: "18", statement: r`On définit les polynômes de Tchebychev par la relation de récurrence suivante : pour tout $x \in \mathbb{R}$,
$$\begin{cases} T_0(x) = 1 \\ T_1(x) = x \\ \forall n \in \mathbb{N}^*,\ T_{n+1}(x) = 2xT_n(x) - T_{n-1}(x) \end{cases}$$
Montrer que pour tout $\theta \in \mathbb{R}$, et tout $n \in \mathbb{N}$, $T_n(\cos\theta) = \cos(n\theta)$.` },
    { id: "ch6-ex19", number: "19", statement: r`Soient $A$, $B$ et $C$ trois points d'affixes respectives $a$, $b$ et $c$. Montrer que le triangle $ABC$ est équilatéral direct si et seulement si $a + jb + j^2c = 0$.` },
  ],
};

export default chapter;
