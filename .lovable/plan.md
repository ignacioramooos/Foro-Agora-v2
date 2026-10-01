# Daily math practice page ("/practica")

A calm, hidden page on foroagora.org for practicing math every day. It isn't linked from the landing page or menu. Anyone with the link can practice, and logged-in users get their progress, streak and motivation saved.

## How we will load your material

- **Best source: the PDFs (class documents + TD/exercise sheets).** Upload them here in chat, a few at a time (max 20MB and 10 files per message). I read them and rewrite every exercise with exact math formatting.
- **Drive folder:** this also works if I connect Google Drive. Then I can read the PDFs straight from the folder, so you don't have to upload them.
- **NotebookLM:** I can't open the link myself. Pasting its transcriptions is a useful backup for checking text, but the PDFs stay the main source because formulas are copied most reliably from them.
- **New chapters:** send them in chat and I add them each time.

## What the student sees

```text
+--------------------------------------------------+
|  Práctica diaria            [racha: 4 días]     |
|  "5 ejercicios por día. Constancia > talento."   |
|  Progreso de hoy: [#####-----] 3/5               |
|                                                  |
|  Capítulo: [Todos v] [Cap 1] [Cap 2] ...         |
|                                                  |
|  +--------------------------------------------+  |
|  | Cap. 2 · Ejercicio 7                       |  |
|  | Resolver  \int_0^1 x e^{x}\,dx             |  |
|  | [Aprender cap. 2]  [Pedir ayuda a Gemini]  |  |
|  |                         [ Marcar hecho ]   |  |
|  +--------------------------------------------+  |
|  ... 4 more                                      |
|                                                  |
|  [ Quiero más ejercicios ]                       |
+--------------------------------------------------+
```

- **Today's set:** 5 exercises per day, picked from each chapter (or from all chapters). Everyone gets the same set for that day. It changes every day at midnight, Montevideo time.
- **Chapter filter:** practice only one chapter.
- **"Quiero más":** adds 5 more exercises the student hasn't done yet.
- **Mark as done:** the student checks off each exercise. No answers are shown, since your sheets don't include them.
- **Small Gemini button:** opens Gemini with a ready-written prompt in Spanish asking for a step-by-step solution of that exercise.
- **"Aprender cap. X":** opens that chapter's class page with its summary and the original class document (PDF).
- **Motivation:** a daily streak, a progress bar for today, a short rotating phrase, and a small celebration when the 5 exercises are done. Logged-out users see "Iniciá sesión para guardar tu racha" and their progress stays only on that device.
- **Style:** the same Foro Agora fonts, colors and cards. Lots of white space, a single column, and no popups.

## Routes

- `/practica`: the daily practice page
- `/practica/capitulo/:id`: chapter page for learning (summary + PDF)
- No links to these pages from the navbar, the landing page or the sitemap. They are also hidden from search engines.

## Technical details

- **Math rendering:** KaTeX (`katex` + `react-katex` or a small wrapper), using LaTeX strings with `$...$` / `$$...$$`. It renders fast and looks crisp on mobile. Long equations scroll sideways instead of overflowing.
- **Content storage:** typed data in `src/content/math/chapters/*.ts`. Each chapter has an id, a title, a summary, a PDF path and a list of exercises (id, statement in LaTeX-capable markdown, optional difficulty). Class PDFs go in `public/practica/`. Adding a chapter means adding one file.
- **Daily selection:** a seeded shuffle based on the date in America/Montevideo. Exercises already done are skipped when the user is known.
- **Progress (database):** a new `math_exercise_progress` table with `user_id`, `exercise_id` and `completed_at`. Unique on (user_id, exercise_id). RLS lets each user manage only their own rows, and GRANTs go to authenticated. The streak is the number of consecutive Montevideo days with at least one completion. Logged-out progress is kept in localStorage and merged in after login.
- **Gemini link:** `https://gemini.google.com/app?q=<encoded prompt>` with the exercise's plain-text/LaTeX. A copy-to-clipboard fallback covers cases where the prompt isn't prefilled.
- **SEO:** `noindex` through RouteSeo. The page is excluded from the sitemap and the materialized routes stay reachable on refresh.
- **First build:** I'll use 2 placeholder chapters to finish the design, then swap in your real material.
