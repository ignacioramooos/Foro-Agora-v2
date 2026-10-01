# Numéros, recherche, drapeaux et index des exercices

Tout ce qui existe reste en place (progression, ids internes, pages actuelles). Seuls des ajouts.

## Ce que l'utilisateur verra
1. **Numéro unique** sur chaque exercice (ex. `#042`), affiché en petit dans l'en-tête de la carte. Numérotation stable : ordre chapitre → Cours → TD, puis DM. Les exercices ajoutés plus tard reçoivent les numéros suivants (aucun numéro existant ne change).
2. **Loupe** dans l'en-tête Maths : ouvre une fenêtre de recherche (texte de l'énoncé, numéro `#42`, chapitre, Cours/TD/DM). Clic sur un résultat → ouvre l'exercice.
3. **Drapeau** sur chaque carte : marquer / démarquer un exercice pour y revenir. Sauvegardé dans le navigateur, et synchronisé avec le compte si connecté.
4. **Index** (nouvelle entrée « Index » dans le menu, page /maths/index) : liste de tous les exercices, filtres par chapitre, source (Cours/TD/DM), état (faits / non faits / marqués), avec recherche. Section « Marqués » en haut si des drapeaux existent.
5. Page d'exercice individuelle /maths/exo/:numero pour ouvrir directement un exercice depuis la recherche ou l'index.

Enfin : vérification desktop + mobile + mode sombre, puis publication.

## Détails techniques
- `src/content/math/numbering.ts` : registre figé `id interne → numéro` généré une fois (fichier versionné) ; fonction qui attribue les numéros suivants aux ids absents. Inclut les questions DM.
- `ExerciseCard` : badge `#NNN` + bouton drapeau (lucide `Flag`).
- `useMathFlags` : localStorage `fa_math_flags` + table `math_exercise_flags` (user_id, exercise_id, created_at ; unique ; GRANT authenticated/service_role ; RLS propriétaire uniquement), fusion au login comme `useMathProgress`.
- `MathSearchDialog` (composant Command existant) dans `StudyHeader`.
- Nouvelles pages `MathIndexPage`, `MathExercisePage` ; routes dans `App.tsx`, entrées dans `materialize-spa-routes.mjs` (`/maths/index`, `/maths/exo/*` via fallback), lien dans `MathShell`.
- Mise à jour `AGENTS.md`, puis publication.
