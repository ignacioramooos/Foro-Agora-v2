import type { FormulaireSection } from "../../types";

export const templateFormulaire: FormulaireSection[] = [
  {
    id: "bases",
    title: "Formules de base",
    items: [
      {
        id: "template-f1",
        name: "Énergie cinétique",
        tex: "$$E_c = \\frac{1}{2} m v^2$$",
      },
      {
        id: "template-f2",
        name: "Loi d'Ohm",
        tex: "$$U = R \\cdot I$$",
      },
    ],
  },
];
