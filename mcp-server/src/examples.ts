import type { MathExercise } from "../../src/content/math/types.js";
import { chapitre1Exemples } from "../../src/content/math/course-examples/chapitre-1.js";
import { chapitre2Exemples } from "../../src/content/math/course-examples/chapitre-2.js";
import { chapitre3Exemples } from "../../src/content/math/course-examples/chapitre-3.js";
import { chapitre4Exemples } from "../../src/content/math/course-examples/chapitre-4.js";
import { chapitre5Exemples } from "../../src/content/math/course-examples/chapitre-5.js";
import { chapitre6Exemples } from "../../src/content/math/course-examples/chapitre-6.js";
import { chapitre7Exemples } from "../../src/content/math/course-examples/chapitre-7.js";
import { chapitre8Exemples } from "../../src/content/math/course-examples/chapitre-8.js";

export const courseExamplesByChapter: Record<number, MathExercise[]> = {
  1: chapitre1Exemples,
  2: chapitre2Exemples,
  3: chapitre3Exemples,
  4: chapitre4Exemples,
  5: chapitre5Exemples,
  6: chapitre6Exemples,
  7: chapitre7Exemples,
  8: chapitre8Exemples,
};
