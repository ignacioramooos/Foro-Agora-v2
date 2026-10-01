import type { MathChapter } from "../types";

// PLACEHOLDER chapter — replace with real material.
const chapter: MathChapter = {
  id: "ejemplo-2",
  number: 2,
  title: "Derivadas e integrales (ejemplo)",
  summary: "Capítulo de ejemplo para probar el diseño. Se reemplaza con el material real.",
  notes: [
    "Definición de derivada: $$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$",
    "Integración por partes: $$\\int u\\,dv = uv - \\int v\\,du$$",
  ],
  exercises: [
    { id: "ejemplo-2-1", number: "1", statement: "Derivar $f(x) = x^3 \\ln x$." },
    { id: "ejemplo-2-2", number: "2", statement: "Calcular $$\\int_0^1 x\\,e^{x}\\,dx$$" },
    { id: "ejemplo-2-3", number: "3", statement: "Hallar la recta tangente a $y = \\sqrt{x}$ en $x = 4$." },
    { id: "ejemplo-2-4", number: "4", statement: "Calcular $$\\int \\frac{1}{x^2 + 4x + 5}\\,dx$$" },
    { id: "ejemplo-2-5", number: "5", statement: "Encontrar los extremos de $g(x) = x^3 - 3x + 2$ en $[-2, 2]$." },
    { id: "ejemplo-2-6", number: "6", statement: "Calcular $$\\sum_{n=1}^{\\infty} \\frac{1}{n(n+1)}$$" },
  ],
};

export default chapter;
