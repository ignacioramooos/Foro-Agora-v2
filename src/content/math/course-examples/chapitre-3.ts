import type { MathExercise } from "../types";
const r = String.raw;
export const chapitre3Exemples: MathExercise[] = [
  { id: "ch3-exemple-1", number: "1.2", source: "exemple", statement: r`Le système suivant :
$$ (S)\begin{cases}3x_1+6x_2=-3 & (L_1)\\-2x_1+x_2=12 & (L_2)\\x_1-4x_2=-5 & (L_3)\end{cases} $$
est un système d’équations linéaires à 3 équations et 2 inconnues.` },
  { id: "ch3-exemple-2", number: "1.7", source: "exemple", statement: r`• Le système d’équations :
$$\begin{cases}x+2y=1\\2x+4y=3\end{cases}$$
est un système incompatible.

• Le système d’équations :
$$\begin{cases}2x-3y=1\\x+2y=4\end{cases}$$
est un système de 2 équations à 2 inconnues, et n’admet qu’une seule solution : le couple $(2,1)$. C’est donc un système de Cramer.

• Il existe des systèmes admettant une infinité de solutions. Par exemple :
$$\begin{cases}2x-y=2\\-4x+2y=-4\end{cases}$$
Les deux équations sont proportionnelles, donc équivalentes. On peut seulement exprimer $y$ en fonction de $x$ (ou le contraire) :
$$y=2x-2$$
Et donc l’ensemble solution du système est : $S=\{(x,2x-2),x\in\mathbb{K}\}$.` },
  { id: "ch3-exemple-3", number: "1.10", source: "exemple", statement: r`Le système
$$(S)\begin{cases}x_1+x_2+x_3+x_4=1\\x_3-x_4=3\end{cases}$$
est un système échelonné.` },
  { id: "ch3-exemple-4", number: "1.12", source: "exemple", statement: r`Le système $(S)\begin{cases}x_1+x_2+x_3=1\\-x_2+x_3=-2\\2x_3=4\end{cases}$ est un système triangulaire.` },
  { id: "ch3-exemple-5", number: "4.3", source: "exemple", statement: r`On considère le système $(S)\begin{cases}2x_2+3x_3=0\\5x_1-3x_2+x_3=6\\3x_1+3x_2+3x_3=-6.\end{cases}$

Effectuer successivement sur ce système les opérations élémentaires suivantes : $L_1\leftrightarrow L_3$, $L_1\leftarrow\frac{1}{3}L_1$, $L_2\leftarrow L_2-5L_1$, et $L_3\leftarrow4L_3+L_2$.` },
  { id: "ch3-exemple-6", number: "4.10", source: "exemple", statement: r`Résoudre le système suivant :
$$(S)\begin{cases}x-3y+4z=8\\-6x+2y+z=5\\5x+y-z=2\\x+y+z=4\end{cases}$$` },
];
