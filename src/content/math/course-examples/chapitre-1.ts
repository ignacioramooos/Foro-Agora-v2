import type { MathExercise } from "../types";
const r = String.raw;
export const chapitre1Exemples: MathExercise[] = [
  { id: "ch1-exemple-1", number: "2.3", source: "exemple", statement: r`$\mathcal{P}$ : « $2 \geq 0$ » est une proposition vraie et $\mathcal{Q}$ : « $7 \times 2 = 10$ » est une proposition fausse .` },
  { id: "ch1-exemple-2", number: "2.4", source: "exemple", statement: r`• $\forall x \in \mathbb{R},\ x^2 \geq 0$ est une proposition complète. Elle est vraie.

• $\forall x \in \mathbb{R},\ x > 1$ est une proposition complète. Elle est fausse.` },
  { id: "ch1-exemple-3", number: "2.6", source: "exemple", statement: r`La proposition « $\forall x \in \mathbb{R},\exists n \in \mathbb{Z},\ n \leq x < n + 1$ » est vraie (tout nombre réel peut-être compris entre deux entiers) tandis que « $\exists n \in \mathbb{Z},\forall x \in \mathbb{R},\ n \leq x < n + 1$ » est fausse. On remarque donc que chaque nombre réel $x$ est compris entre deux entiers consécutifs : $n$ et $n + 1$. Ce nombre $n$ est appelé partie entière de $x$ et noté $\lfloor x\rfloor$ ou parfois $E(x)$.` },
  { id: "ch1-exemple-4", number: "3.2", source: "exemple", statement: r`Si $\mathcal{P}$ est la proposition « $2 \leq 3$ ». Alors Non $\mathcal{P}$ est la proposition $2 > 3$. La négation de "je mesure 1,70m ou plus" est "je mesure strictement moins de 1,70 m".` },
  { id: "ch1-exemple-5", number: "3.6", source: "exemple", statement: r`On lance un dé à 6 faces, et considère les propositions $\mathcal{P}$ : "le résultat est pair", et $\mathcal{Q}$ : "le résultat est supérieur ou égal à 3". Alors $(\mathcal{P}\text{ ou }\mathcal{Q})$ est la proposition "le résultat est 2,3,4,5 ou 6", et la proposition $(\mathcal{P}\text{ et }\mathcal{Q})$ est "le résultat est 4 ou 6".` },
  { id: "ch1-exemple-6", number: "3.10", source: "exemple", statement: r`$\forall x \in [0,+\infty[,\ x^2 \geq 0 \Leftrightarrow x \geq 0$ est vraie.` },
  { id: "ch1-exemple-7", number: "4.4", source: "exemple", statement: r`La contraposée de la proposition "s’il pleut, alors le sol est mouillé" est "si le sol n’est pas mouillé, alors il ne pleut pas".` },
  { id: "ch1-exemple-8", number: "4.6", source: "exemple", statement: r`L’exemple le plus célèbre de raisonnement par l’absurde est celui de la démonstration de l’infinité de l’ensemble des nombres premiers.

Notons $\mathcal{P}$ l’ensemble des nombres premiers. On sait que $\mathcal{P}$ est non vide vu qu’il contient 2, 3, 5, 7, etc.

Raisonnons par l’absurde en supposant qu’il n’est pas infini, ce qui implique qu’il est fini.

Il possède alors un certain nombre $n$ d’éléments que l’on note $p_1,p_2,...,p_n$. Les nombres $p_1,p_2,...,p_n$ sont donc des nombres premiers et, avec notre hypothèse, sont les seuls.

Notons alors $p = p_1p_2...p_n$ et considérons $q = p + 1$. Comme tout nombre premier est supérieur strictement à 1, le reste de la division euclidienne de $q$ par n’importe quel $p_i$ est 1 (car on écrit $q = p_i \times p_1p_2...p_{i-1}p_{i+1}...p_n + 1$ avec $0 \leq 1 < p_i$), donc aucun des $p_i$ ne divise $q$. Or, d’après le lemme d’Euclide, $q \geq 2$ est divisible par un nombre premier. Contradiction !

Conclusion : l’ensemble $\mathcal{P}$ des nombres premiers est infini.` },
  { id: "ch1-exemple-9", number: "4.11", source: "exemple", statement: r`Montrer par récurrence que pour tout $n \in \mathbb{N}$, $2^n \geq n + 1$

Initialisation : Pour $n = 0$ : $2^0 = 1$ et $0 + 1 = 1$. Ainsi on a bien : $2^0 \geq 0 + 1$, donc $P(0)$ est vraie.

Hérédité : Supposons la propriété vraie à un rang $n$ quelconque, c’est notre hypothèse de récurrence. Montrons alors que $P(n + 1)$ est vraie (on cherche donc à montrer que $2^{n+1} \geq n + 2$).

Alors : $2^{n+1} = 2^n \times 2 \geq (n + 1) \times 2$, en utilisant l’hypothèse de récurrence.

Or $2 \times (n + 1) = 2n + 2 \geq n + 2$ car $n \in \mathbb{N}$.

On a alors : $2^{n+1} \geq n + 2$, la propriété est donc héréditaire.

Conclusion : $\forall n \in \mathbb{N}, 2^n \geq n + 1$.` },
  { id: "ch1-exemple-10", number: "4.12", source: "exemple", statement: r`On considère la suite $(u_n)_{n\in\mathbb{N}}$ définie par : $$\begin{cases}u_0 = u_1 = -1\\ \forall n \in \mathbb{N}, u_{n+2} = 5u_{n+1} - 6u_n\end{cases}$$

Montrer que : $\forall n \in \mathbb{N}, u_n = 3^n - 2^{n+1}$` },
  { id: "ch1-exemple-11", number: "4.13", source: "exemple", statement: r`On considère la suite $(u_n)_{n\in\mathbb{N}}$ définie par : $$\begin{cases}u_0 = 1\\ \forall n \in \mathbb{N}, u_{n+1} = u_0 + u_1 + \cdots + u_n\end{cases}$$

Montrer que : $\forall n \in \mathbb{N}, u_n \leq 2^n$` },
];
