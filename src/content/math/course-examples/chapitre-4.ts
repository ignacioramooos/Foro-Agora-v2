import type { MathExercise } from "../types";
const r = String.raw;
export const chapitre4Exemples: MathExercise[] = [
  { id: "ch4-exemple-1", number: "2.3", source: "exemple", statement: r`Ecrire avec le signe $\sum$ les sommes suivantes :

• $S_1=10^2+11^2+\cdots+99^2+100^2$

• $S_2=1+2+2^2+\cdots+2^{100}$

• $S_3=1+3+5+7+\cdots+25+27$

• $S_4=1-2+3-\cdots-98+99-100$` },
  { id: "ch4-exemple-2", number: "2.5", source: "exemple", statement: r`$$\sum_{k=1}^{n}(2k)=\ldots$$

$$\sum_{k=1}^{n}(k^2+k)=\ldots$$

$$\sum_{k=1}^{n}k(k^2-2)=\ldots$$` },
  { id: "ch4-exemple-3", number: "3.5", source: "exemple", statement: r`$4!=$` },
  { id: "ch4-exemple-4", number: "—", source: "exemple", statement: r`Si on utilise deux indices (ou plus) pour indexer des nombres, il se peut que les bornes d’un indice dépende des autres indices. Exemple :
$$\sum_{i=1}^{n}\sum_{j=1}^{i}a_{ij}$$
Dans cet exemple, les $a_{ij}$ forment un triangle :
$$\begin{bmatrix}a_{11}&&&&\\a_{21}&a_{22}&&&\\&&\cdots&&\\a_{i1}&a_{i2}&\ldots&a_{ii}&\\&&&\ddots&\\a_{n1}&a_{n2}&\ldots&\ldots&a_{nn}\end{bmatrix}$$
On dit que la somme est triangulaire.

On pourra aussi écrire cette somme double sous la forme :
$$\sum_{i=1}^{n}\sum_{j=1}^{i}a_{ij}=\sum_{1\leq j\leq i\leq n}a_{ij}$$` },
];
