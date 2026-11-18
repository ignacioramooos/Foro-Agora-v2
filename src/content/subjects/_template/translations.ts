import type { SubjectLocale } from "../i18n";
import type { SubjectContentTranslation } from "../types";
import { templateSummaryTranslations } from "./translations-summary";

/**
 * Translations of the sample classroom content (original text is French).
 * When you duplicate this template, translate each chapter / exercise / formula by its id here.
 * Anything not translated falls back to the original text.
 */
export const templateTranslations: Partial<Record<SubjectLocale, SubjectContentTranslation>> = {
  en: {
    ...templateSummaryTranslations.en,
    aiContext: "in this subject",
    chapters: {
      "chapitre-1": { title: "First chapter (example)", summary: "Introduction and core exercises." },
    },
    exercises: {
      "template-ch1-ex1": {
        statement:
          "Compute the kinetic energy of a solid of mass $m = 2\\,\\text{kg}$ moving at speed $v = 3\\,\\text{m}\\cdot\\text{s}^{-1}$:\n$$E_c = \\frac{1}{2} m v^2$$",
        hints: [
          "Check that the units are in the International System (kg and m/s).",
          "Replace $m$ with $2$ and $v$ with $3$ in the formula.",
        ],
        answer: "$E_c = \\frac{1}{2} \\times 2 \\times 3^2 = 9\\,\\text{J}$.",
      },
      "template-ch1-ex2": {
        statement: "Solve the following differential equation on $\\mathbb{R}$:\n$$y'(t) + 2 y(t) = 0, \\qquad y(0) = 5.$$",
        hints: ["It is a first-order linear differential equation with constant coefficients."],
        answer: "$y(t) = 5 e^{-2t}$ for all $t \\in \\mathbb{R}$.",
      },
    },
    formulaire: {
      bases: {
        title: "Basic formulas",
        items: { "template-f1": { name: "Kinetic energy" }, "template-f2": { name: "Ohm's law" } },
      },
    },
  },
  es: {
    ...templateSummaryTranslations.es,
    aiContext: "en esta materia",
    chapters: {
      "chapitre-1": { title: "Primer capítulo (ejemplo)", summary: "Introducción y ejercicios fundamentales." },
    },
    exercises: {
      "template-ch1-ex1": {
        statement:
          "Calcular la energía cinética de un sólido de masa $m = 2\\,\\text{kg}$ que se desplaza a la velocidad $v = 3\\,\\text{m}\\cdot\\text{s}^{-1}$:\n$$E_c = \\frac{1}{2} m v^2$$",
        hints: [
          "Verificá que las unidades estén en el Sistema Internacional (kg y m/s).",
          "Reemplazá $m$ por $2$ y $v$ por $3$ en la fórmula.",
        ],
        answer: "$E_c = \\frac{1}{2} \\times 2 \\times 3^2 = 9\\,\\text{J}$.",
      },
      "template-ch1-ex2": {
        statement: "Resolver en $\\mathbb{R}$ la siguiente ecuación diferencial:\n$$y'(t) + 2 y(t) = 0, \\qquad y(0) = 5.$$",
        hints: ["Es una ecuación diferencial lineal de primer orden con coeficientes constantes."],
        answer: "$y(t) = 5 e^{-2t}$ para todo $t \\in \\mathbb{R}$.",
      },
    },
    formulaire: {
      bases: {
        title: "Fórmulas básicas",
        items: { "template-f1": { name: "Energía cinética" }, "template-f2": { name: "Ley de Ohm" } },
      },
    },
  },
  pt: {
    ...templateSummaryTranslations.pt,
    aiContext: "nesta disciplina",
    chapters: {
      "chapitre-1": { title: "Primeiro capítulo (exemplo)", summary: "Introdução e exercícios fundamentais." },
    },
    exercises: {
      "template-ch1-ex1": {
        statement:
          "Calcular a energia cinética de um sólido de massa $m = 2\\,\\text{kg}$ que se desloca à velocidade $v = 3\\,\\text{m}\\cdot\\text{s}^{-1}$:\n$$E_c = \\frac{1}{2} m v^2$$",
        hints: [
          "Verifique se as unidades estão no Sistema Internacional (kg e m/s).",
          "Substitua $m$ por $2$ e $v$ por $3$ na fórmula.",
        ],
        answer: "$E_c = \\frac{1}{2} \\times 2 \\times 3^2 = 9\\,\\text{J}$.",
      },
      "template-ch1-ex2": {
        statement: "Resolver em $\\mathbb{R}$ a seguinte equação diferencial:\n$$y'(t) + 2 y(t) = 0, \\qquad y(0) = 5.$$",
        hints: ["É uma equação diferencial linear de primeira ordem com coeficientes constantes."],
        answer: "$y(t) = 5 e^{-2t}$ para todo $t \\in \\mathbb{R}$.",
      },
    },
    formulaire: {
      bases: {
        title: "Fórmulas básicas",
        items: { "template-f1": { name: "Energia cinética" }, "template-f2": { name: "Lei de Ohm" } },
      },
    },
  },
};
