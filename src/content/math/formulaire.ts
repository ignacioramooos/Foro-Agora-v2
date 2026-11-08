export interface Formula { id: string; name: string; tex: string }
export interface FormulaSection { id: string; title: string; items: Formula[] }

export const formulaire: FormulaSection[] = [
  {
    id: "trigo", title: "Trigonométrie", items: [
      { id: "t1", name: "Relation fondamentale", tex: "$$\\cos^2 x + \\sin^2 x = 1$$" },
      { id: "t2", name: "Cosinus d'une somme", tex: "$$\\cos(a+b) = \\cos a \\cos b - \\sin a \\sin b$$" },
      { id: "t3", name: "Sinus d'une somme", tex: "$$\\sin(a+b) = \\sin a \\cos b + \\cos a \\sin b$$" },
      { id: "t4", name: "Tangente d'une somme", tex: "$$\\tan(a+b) = \\dfrac{\\tan a + \\tan b}{1 - \\tan a \\tan b}$$" },
      { id: "t5", name: "Duplication (cosinus)", tex: "$$\\cos 2x = \\cos^2 x - \\sin^2 x = 2\\cos^2 x - 1 = 1 - 2\\sin^2 x$$" },
      { id: "t6", name: "Duplication (sinus)", tex: "$$\\sin 2x = 2 \\sin x \\cos x$$" },
      { id: "t7", name: "Linéarisation", tex: "$$\\cos^2 x = \\dfrac{1 + \\cos 2x}{2}, \\qquad \\sin^2 x = \\dfrac{1 - \\cos 2x}{2}$$" },
      { id: "t8", name: "Produit en somme", tex: "$$\\cos a \\cos b = \\dfrac{\\cos(a+b) + \\cos(a-b)}{2}$$" },
      { id: "t9", name: "Somme en produit", tex: "$$\\cos p + \\cos q = 2 \\cos\\dfrac{p+q}{2} \\cos\\dfrac{p-q}{2}$$" },
      { id: "t10", name: "Somme en produit (sinus)", tex: "$$\\sin p + \\sin q = 2 \\sin\\dfrac{p+q}{2} \\cos\\dfrac{p-q}{2}$$" },
      { id: "t11", name: "Tangente de l'arc moitié", tex: "$$t = \\tan\\dfrac{x}{2} : \\quad \\cos x = \\dfrac{1-t^2}{1+t^2}, \\quad \\sin x = \\dfrac{2t}{1+t^2}$$" },
    ],
  },
  {
    id: "complexes", title: "Nombres complexes", items: [
      { id: "c1", name: "Formule d'Euler", tex: "$$\\cos \\theta = \\dfrac{e^{i\\theta} + e^{-i\\theta}}{2}, \\qquad \\sin \\theta = \\dfrac{e^{i\\theta} - e^{-i\\theta}}{2i}$$" },
      { id: "c2", name: "Formule de Moivre", tex: "$$(\\cos \\theta + i \\sin \\theta)^n = \\cos n\\theta + i \\sin n\\theta$$" },
      { id: "c3", name: "Module d'un produit", tex: "$$|zz'| = |z|\\,|z'|, \\qquad |z|^2 = z\\bar{z}$$" },
      { id: "c4", name: "Inégalité triangulaire", tex: "$$\\big||z| - |z'|\\big| \\leqslant |z + z'| \\leqslant |z| + |z'|$$" },
      { id: "c5", name: "Racines $n$-ièmes de l'unité", tex: "$$\\mathbb{U}_n = \\left\\{ e^{\\frac{2ik\\pi}{n}},\\ k \\in [\\![0, n-1]\\!] \\right\\}$$" },
      { id: "c6", name: "Somme des racines $n$-ièmes ($n \\geqslant 2$)", tex: "$$\\sum_{k=0}^{n-1} e^{\\frac{2ik\\pi}{n}} = 0$$" },
      { id: "c7", name: "Angle moitié", tex: "$$e^{ia} + e^{ib} = 2\\cos\\dfrac{a-b}{2}\\, e^{i\\frac{a+b}{2}}$$" },
    ],
  },
  {
    id: "sommes", title: "Sommes classiques", items: [
      { id: "s1", name: "Somme des entiers", tex: "$$\\sum_{k=1}^{n} k = \\dfrac{n(n+1)}{2}$$" },
      { id: "s2", name: "Somme des carrés", tex: "$$\\sum_{k=1}^{n} k^2 = \\dfrac{n(n+1)(2n+1)}{6}$$" },
      { id: "s3", name: "Somme des cubes", tex: "$$\\sum_{k=1}^{n} k^3 = \\left(\\dfrac{n(n+1)}{2}\\right)^2$$" },
      { id: "s4", name: "Somme géométrique ($q \\neq 1$)", tex: "$$\\sum_{k=0}^{n} q^k = \\dfrac{1 - q^{n+1}}{1 - q}$$" },
      { id: "s5", name: "Binôme de Newton", tex: "$$(a+b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^k b^{n-k}$$" },
      { id: "s6", name: "Factorisation de $a^n - b^n$", tex: "$$a^n - b^n = (a - b) \\sum_{k=0}^{n-1} a^k b^{n-1-k}$$" },
    ],
  },
  {
    id: "derivees", title: "Dérivées usuelles", items: [
      { id: "d1", name: "Puissance", tex: "$$(x^\\alpha)' = \\alpha x^{\\alpha - 1}$$" },
      { id: "d2", name: "Logarithme et exponentielle", tex: "$$(\\ln x)' = \\dfrac{1}{x}, \\qquad (e^x)' = e^x$$" },
      { id: "d3", name: "Tangente", tex: "$$(\\tan x)' = 1 + \\tan^2 x = \\dfrac{1}{\\cos^2 x}$$" },
      { id: "d4", name: "Arcsinus et arccosinus", tex: "$$(\\arcsin x)' = \\dfrac{1}{\\sqrt{1 - x^2}}, \\qquad (\\arccos x)' = -\\dfrac{1}{\\sqrt{1 - x^2}}$$" },
      { id: "d5", name: "Arctangente", tex: "$$(\\arctan x)' = \\dfrac{1}{1 + x^2}$$" },
      { id: "d6", name: "Fonctions hyperboliques", tex: "$$\\operatorname{ch}' = \\operatorname{sh}, \\qquad \\operatorname{sh}' = \\operatorname{ch}, \\qquad \\operatorname{ch}^2 - \\operatorname{sh}^2 = 1$$" },
      { id: "d7", name: "Composée", tex: "$$(g \\circ f)' = f' \\times (g' \\circ f)$$" },
      { id: "d8", name: "Réciproque", tex: "$$(f^{-1})' = \\dfrac{1}{f' \\circ f^{-1}}$$" },
    ],
  },
  {
    id: "identites", title: "Identités remarquables", items: [
      { id: "i1", name: "Carré d'une somme", tex: "$$(a + b)^2 = a^2 + 2ab + b^2$$" },
      { id: "i2", name: "Différence de carrés", tex: "$$a^2 - b^2 = (a - b)(a + b)$$" },
      { id: "i3", name: "Cube d'une somme", tex: "$$(a + b)^3 = a^3 + 3a^2 b + 3ab^2 + b^3$$" },
      { id: "i4", name: "Somme et différence de cubes", tex: "$$a^3 \\pm b^3 = (a \\pm b)(a^2 \\mp ab + b^2)$$" },
      { id: "i5", name: "Discriminant", tex: "$$ax^2 + bx + c,\\ \\Delta = b^2 - 4ac,\\quad x = \\dfrac{-b \\pm \\sqrt{\\Delta}}{2a}$$" },
    ],
  },
];
