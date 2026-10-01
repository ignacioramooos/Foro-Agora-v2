import type { MathChapter } from "../types";
import { chapitre3CoursExercises } from "../course-exercises/chapitres-3-4";

const r = String.raw;

const chapter: MathChapter = {
  id: "chapitre-3",
  number: 3,
  title: "Systèmes linéaires",
  summary: "Méthode du pivot de Gauss, systèmes à paramètre, déterminant d'un système 2×2.",
  pdfUrl: "/practica/c3.pdf",
  exercises: [
    ...chapitre3CoursExercises,
    { id: "ch3-ex1", number: "1", statement: r`Soit $m \in \mathbb{R}$. Soit $(S_m)$ le système d'inconnue $(x,y)$ :
$$\begin{cases} x + my = 1 \\ mx + y = 1 \end{cases}$$
Calculer le déterminant de $(S_m)$ puis résoudre $(S_m)$.` },
    { id: "ch3-ex2", number: "2", statement: r`Résoudre en $(x_1,x_2,x_3) \in \mathbb{R}^3$ chacun des systèmes suivants :
$$\begin{cases} x_1 + 2x_2 - x_3 = 1 \\ 2x_1 - 3x_2 + 2x_3 = 1 \\ 4x_1 + x_2 - x_3 = 1 \end{cases};\quad \begin{cases} x_1 + 2x_2 - x_3 = 0 \\ 2x_1 - 3x_2 + x_3 = 1 \\ 4x_1 + x_2 - x_3 = 2 \end{cases};\quad (\mu \in \mathbb{R}) \begin{cases} x_1 + 2x_2 - x_3 = 0 \\ 2x_1 - 3x_2 + x_3 = 1 \\ 4x_1 + x_2 - \mu x_3 = 2 \end{cases}$$` },
    { id: "ch3-ex3", number: "3", statement: r`Résoudre dans $\mathbb{R}^4$ le système :
$$\begin{cases} x + 3y - z + t = 2 \\ 2x + y + z - t = -2 \\ x + y + z = 3 \\ x + 5y - z + t = 1 \end{cases}$$` },
    { id: "ch3-ex4", number: "4", statement: r`Résoudre et discuter suivant $m \in \mathbb{R}$ le système d'équations linéaires en $(x,y,z) \in \mathbb{R}^3$ :
$$\begin{cases} 2x + y - z = 1 \\ x + my + z = 1 \\ 3x + y - mz = 1 \end{cases}$$` },
    { id: "ch3-ex5", number: "5", statement: r`Résoudre dans $\mathbb{R}^4$ le système, où $a$ est un paramètre réel :
$$\begin{cases} x + y - z + t = 2 \\ x - 2y + 2z + t = 1 \\ 3x + 3y - 3z + 3t = a \end{cases}$$` },
    { id: "ch3-ex6", number: "6", statement: r`Montrer qu'il existe un unique triplet $(a,b,c) \in \mathbb{R}^3$ tel que :
$$\forall x \in \mathbb{R} \setminus \{1,2,3\},\quad \frac{x^2+1}{(x-1)(x-2)(x-3)} = \frac{a}{x-1} + \frac{b}{x-2} + \frac{c}{x-3}$$` },
    { id: "ch3-ex7", number: "7", statement: r`Déterminer un trinôme $P$ tel que : $P(1) = -1$, $P(2) = 9$ et $P(-1) = -3$.` },
  ],
};

export default chapter;
