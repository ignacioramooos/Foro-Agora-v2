import type { MathExercise } from "../types";
const r = String.raw;
export const chapitre6Exemples: MathExercise[] = [
  { id: "ch6-exemple-1", number: "1.6", source: "exemple", statement: r`Calculer $(2 + 3i)(-4 + i)$.` },
  { id: "ch6-exemple-2", number: "1.12", source: "exemple", statement: r`Calculer $(1 + i)^{4n}$, pour $n \in \mathbb{N}$.` },
  { id: "ch6-exemple-3", number: "1.22", source: "exemple", statement: r`Calculer $|4 + 2i|$.` },
  { id: "ch6-exemple-4", number: "3.2", source: "exemple", statement: r`$e^{i\pi} = -1$, $e^{i\frac{\pi}{2}} = i$, $\forall k \in \mathbb{Z}, e^{2ik\pi} = 1$` },
  { id: "ch6-exemple-5", number: "3.9", source: "exemple", statement: r`Ecrire $z = 1 - i\sqrt{3}$ sous forme exponentielle.` },
  { id: "ch6-exemple-6", number: "4.7", source: "exemple", statement: r`Résoudre dans $\mathbb{C}$ l’équation $e^z = 1 + i$.` },
  { id: "ch6-exemple-7", number: "5.8", source: "exemple", statement: r`Résoudre : $z^3 = 4\sqrt{2} - 4\sqrt{2}i$.` },
  { id: "ch6-exemple-8", number: "5.10", source: "exemple", statement: r`Résoudre : $z^2 = -3 + 4i$` },
  { id: "ch6-exemple-9", number: "5.13", source: "exemple", statement: r`Résoudre dans $\mathbb{C}$ l’équation $z^2 - (1 + 3i)z - 2 + i = 0$. En déduire une factorisation de $z^2 - (1 + 3i)z - 2 + i$.` },
  { id: "ch6-exemple-10", number: "6.4", source: "exemple", statement: r`Déterminer géométriquement les nombres complexes $z$ tels que : $|z| = |z + 1| = 1$.` },
  { id: "ch6-exemple-11", number: "6.8", source: "exemple", statement: r`• La rotation d’angle $\frac{\pi}{2}$ se traduit par une multiplication par $i$.

• La rotation d’angle $\frac{2\pi}{3}$ se traduit par une multiplication par $j$.` },
  { id: "ch6-exemple-12", number: "6.9", source: "exemple", statement: r`Soient $A$ un point d’affixe $1 + i$ et $B$ un point d’affixe $2i$. Déterminer l’affixe d’un point $C$ tel que le triangle $ABC$ soit équilatéral.` },
];
