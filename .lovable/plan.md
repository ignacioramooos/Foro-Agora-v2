# Maths: 6 nouvelles fonctionnalités + document TD repliable

Everything in French, same Foro Agora look (Instrument Sans, existing cards, buttons, colors, dark mode). Nothing existing is removed or renumbered; exercise statements stay untouched.

## 0. Document repliable (Cours and TD pages)
- A small button on the edge of the document column hides it to the right, like the left menu. Exercises then use the full width.
- A thin tab on the right edge brings it back. Shortcut Ctrl+Shift+D. The choice is remembered.
- On mobile nothing changes (tabs already separate document and exercises).

## 1. Simulateur de Khôlle (new page "Khôlle blanche" in the side menu)
- Uses the current week's programme: draws 1 incontournable (question de cours) + 1 or 2 exercises from the chapters in scope.
- Two phases: préparation (20 min by default, adjustable) then passage (20 min). Big timer, pause, "Retirer un exercice".
- Optional Desmos panel next to it. At the end: short recap and links to the exercises.

## 2. Indices progressifs
- On exercise cards that have hints: "Indice 1 (stratégie)" and "Indice 2 (premier pas)", each revealed on click, placed before "Copier pour Gemini".
- Hints live in a separate file, never inside the statements. Cards without hints show nothing new.
- First batch: TD exercises of chapters 7 and 8 (current programme). Clearly labelled "Indice Foro Agora" since they are not from the professor's documents.

## 3. Formulaire & flashcards (new page "Formulaire")
- Sections: trigonométrie, nombres complexes, sommes classiques, dérivées usuelles, identités remarquables.
- Each formula can switch to flashcard mode (hidden until tapped) with "Je savais / À revoir", saved per user.

## 4. Tableau de bord (new page "Progression")
- Per chapter: % done for Cours, Exemples and TD (bars in brand colors).
- Flagged exercises not opened for 7+ days, current streak, total done.
- Uses existing progress and flags, no new data.

## 5. Planche PDF (« Mode papier »)
- From the Index or flagged list: select 3–10 exercises, click "Générer une planche".
- Opens a clean printable A4 sheet (formulas rendered, numbers #NNN, space to write) → browser print / save as PDF.

## 6. Chronomètre par exercice
- Small discreet stopwatch on each card (start/pause/reset). Time is kept with the "fait" mark and shown in the dashboard (average per chapter).

## Technical details
- Collapse: PracticeChapterPage desktop split gets `docOpen` state (localStorage `fa_math_doc_open`), grid switches to single column with animated width; rail button reopens.
- New routes `/maths/khôlle-blanche` (`/maths/simulateur`), `/maths/formulaire`, `/maths/progression`, `/maths/planche`; added to MathShell nav and materialize-spa-routes.mjs.
- New content files: `src/content/math/hints.ts` (exerciseId → [h1, h2]), `src/content/math/formulaire.ts`.
- Flashcard state and exercise times: localStorage first (`fa_math_flashcards`, `fa_math_times`), synced via a new owner-only table `math_exercise_times` (RLS user_id = auth.uid()) and a `math_flashcard_state` table.
- Print sheet: dedicated route with `@media print` styles, KaTeX via MathText.
- MCP server untouched except optionally exposing hints later.
- Verify every new page with Playwright on desktop and mobile in light and dark mode; tsgo clean; existing tests pass.
