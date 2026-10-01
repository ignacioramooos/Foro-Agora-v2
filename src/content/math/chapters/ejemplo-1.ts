import type { MathChapter } from "../types";

// PLACEHOLDER chapter — replace with real material.
const chapter: MathChapter = {
  id: "ejemplo-1",
  number: 1,
  title: "Funciones y límites (ejemplo)",
  summary: "Capítulo de ejemplo para probar el diseño. Se reemplaza con el material real.",
  notes: [
    "Un límite describe a qué valor se acerca $f(x)$ cuando $x$ se acerca a $a$: $$\\lim_{x \\to a} f(x) = L$$",
    "Límite notable: $$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$$",
  ],
  exercises: [
    { id: "ejemplo-1-1", number: "1", statement: "Calcular $$\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$$" },
    { id: "ejemplo-1-2", number: "2", statement: "Determinar el dominio de $f(x) = \\sqrt{\\dfrac{x+1}{x-3}}$." },
    { id: "ejemplo-1-3", number: "3", statement: "Calcular $$\\lim_{x \\to +\\infty} \\left(1 + \\frac{1}{x}\\right)^{x}$$" },
    { id: "ejemplo-1-4", number: "4", statement: "Estudiar la continuidad de $$g(x) = \\begin{cases} x^2 & x \\le 1 \\\\ 2x - 1 & x > 1 \\end{cases}$$" },
    { id: "ejemplo-1-5", number: "5", statement: "Calcular $\\displaystyle\\lim_{x \\to 0} \\frac{e^{x} - 1}{x}$." },
    { id: "ejemplo-1-6", number: "6", statement: "Hallar las asíntotas de $h(x) = \\dfrac{2x^2 + 1}{x^2 - 1}$." },
  ],
};

export default chapter;
