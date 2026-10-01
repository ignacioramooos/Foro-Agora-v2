import type { MathChapter } from "../types";
import { chapitre4CoursExercises } from "../course-exercises/chapitres-3-4";

const r = String.raw;

const chapter: MathChapter = {
  id: "chapitre-4",
  number: 4,
  title: "Sommes et produits",
  summary: "Sommes classiques, télescopage, produits, factorielles, coefficients binomiaux et sommes doubles.",
  pdfUrl: "/practica/c4.pdf",
  exercises: [
    ...chapitre4CoursExercises,
    { id: "ch4-ex1", number: "1", statement: r`Calculer les sommes suivantes ($n$ est un entier naturel) :
1. $\displaystyle A = \sum_{k=0}^{5} (2k^2 + k + 1)$.
2. $\displaystyle B = \sum_{k=2}^{6} (k^3 + k)$.
3. $\displaystyle S_n = \sum_{k=0}^{n} (2^k + k^2)$.
4. $\displaystyle T_n = \sum_{k=1}^{n} (2 \times 3^k + 3 \times 2^k)$.
5. $\displaystyle U_n = \sum_{k=0}^{n} \left(7^k \times \frac{(3^2)^k}{2^{k+1}}\right)$.` },
    { id: "ch4-ex2", number: "2", statement: r`1. Déterminer deux réels $a$ et $b$ tels que pour tout entier $k$ supérieur à 2,
$$\frac{1}{k(k-1)} = \frac{a}{k-1} + \frac{b}{k}$$
2. En déduire pour tout entier naturel $n \geq 2$ une expression plus simple de $\displaystyle\sum_{k=2}^{n} \frac{1}{k(k-1)}$.
3. Par la même méthode, donner une expression simple pour tout $n \geq 2$ de
$$S_n = \sum_{k=2}^{n} \frac{k-5}{k(k^2-1)}$$` },
    { id: "ch4-ex3", number: "3", statement: r`Exprimer à l'aide de factorielles :
$$\frac{\displaystyle\prod_{k=1}^{n} (2k-1)}{\displaystyle\prod_{k=1}^{n} (2k)}$$` },
    { id: "ch4-ex4", number: "4", statement: r`Pour $n \in \mathbb{N}$, $n \geq 2$, simplifier
$$\sum_{k=2}^{n} \ln\left(1 - \frac{1}{k^2}\right).$$` },
    { id: "ch4-ex5", number: "5", statement: r`Soient $n \in \mathbb{N}^*$ et $\alpha \in \mathbb{R}$. Calculer
$$\prod_{i=1}^{n} \prod_{j=1}^{n} \alpha^{\min(i,j)}.$$` },
    { id: "ch4-ex6", number: "6", statement: r`Soit $n \in \mathbb{N}^*$. Montrer que pour tout $k \in \{1, 2, \dots, n\}$, on a
$$n \leqslant k(n+1-k) \leqslant \left(\frac{n+1}{2}\right)^2$$
et en déduire l'encadrement $n^{\frac{n}{2}} \leqslant n! \leqslant \left(\frac{n+1}{2}\right)^n$.` },
    { id: "ch4-ex7", number: "7", statement: r`Pour $n \in \mathbb{N}$, calculer $\displaystyle\sum_{k=0}^{n} k\binom{n}{k}$ par trois méthodes :
• Méthode 1 : commencer par transformer $k\binom{n}{k}$, lorsque $k \geqslant 1$, en un multiple de $n$.
• Méthode 2 : utiliser $\binom{n}{k} = \binom{n}{n-k}$ et réindexer la somme.
• Méthode 3 : pour $n \geqslant 1$, introduire le polynôme $P$ défini sur $\mathbb{R}$ par $\displaystyle P(x) = \sum_{k=1}^{n} k\binom{n}{k} x^{k-1}$.` },
    { id: "ch4-ex8", number: "8", statement: r`Soient $p$ et $n$ des entiers tels que $0 < p < n$. Montrer :
$$\binom{n}{p+1} = \binom{n-1}{p} + \binom{n-2}{p} + \dots + \binom{p+1}{p} + \binom{p}{p}$$` },
    { id: "ch4-ex9", number: "9", statement: r`Formule de Vandermonde. Soient $n, p, q \in \mathbb{N}^*$, $n \leq p$ et $n \leq q$.
1. Montrer :
$$\binom{p+q}{n} = \binom{p}{0}\binom{q}{n} + \binom{p}{1}\binom{q}{n-1} + \dots + \binom{p}{n}\binom{q}{0} = \sum_{k=0}^{n} \binom{p}{k}\binom{q}{n-k}$$
(Indication : développer $(1+x)^{p+q}$ de deux manières différentes et identifier les coefficients des puissances de $x$.)
2. En déduire une expression simple de :
$$\binom{p}{0}^2 + \binom{p}{1}^2 + \dots + \binom{p}{p}^2$$` },
    { id: "ch4-ex10", number: "10", statement: r`1. Montrer que pour tout $(k,p,n) \in \mathbb{N}^3$ tel que $k \leqslant p \leqslant n$ : $\displaystyle\binom{n}{k}\binom{n-k}{p-k} = \binom{p}{k}\binom{n}{p}$.
2. En déduire que pour tout $(p,n) \in \mathbb{N}^2$ tels que $p \leqslant n$ : $\displaystyle\sum_{k=0}^{p} \binom{n}{k}\binom{n-k}{p-k} = 2^p\binom{n}{p}$.
3. Calculer, pour tout $(p,n) \in \mathbb{N}^2$ tels que $p \leqslant n$ : $\displaystyle\sum_{k=0}^{p} (-1)^k \binom{n}{k}\binom{n-k}{p-k}$.` },
    { id: "ch4-ex11", number: "11", statement: r`Calculer :
$$\sum_{k=1}^{n} (-1)^k k$$` },
    { id: "ch4-ex12", number: "12", statement: r`Calculer :
$$\sum_{\substack{1 \leq i \leq n \\ 1 \leq j \leq n}} \max(i,j)$$` },
    { id: "ch4-ex13", number: "13", statement: r`Calculer :
$$\sum_{1 \leq i \leq j \leq n} (i + j)$$` },
  ],
};

export default chapter;
