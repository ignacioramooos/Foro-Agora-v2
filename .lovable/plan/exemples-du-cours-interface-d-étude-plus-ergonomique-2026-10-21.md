# Exemples du cours + interface d'étude plus ergonomique

## 1. Ajouter tous les « Exemples » des 8 cours
- Récupérer depuis le Drive les 8 PDF de cours (chapitres 1 à 8), les rendre en images et relever **chaque** bloc « Exemple » (y compris exemples numérotés, multiples par section, avec toutes leurs sous-parties).
- Transcription strictement verbatim (texte français et équations exactes, aucune coupe), par sous-agents en parallèle, un chapitre chacun, puis contre-vérification texte/PDF.
- Les exemples apparaissent dans l'onglet **Cours** de chaque chapitre, avec un badge « Exemple » distinct de « Cours » et « TD », dans l'ordre du document.
- Chaque exemple reçoit un nouveau numéro public (#248 et suivants), ajouté à la fin du registre ; aucun numéro existant ne change. Ils sont trouvables dans la recherche et l'Index (nouveau filtre « Exemples »), ont les boutons fait / Copier pour Gemini / drapeau.
- Le mode Aléatoire du jour reste centré sur les exercices (les exemples n'y entrent pas par défaut), pour ne pas diluer l'entraînement.
- Mise à jour aussi du serveur MCP et de sa base exportée pour qu'il connaisse les exemples.

## 2. Interface d'étude
- **Menu masquable** : bouton pour replier/déplier la barre latérale sur ordinateur (choix mémorisé), raccourci clavier, l'espace libéré va au contenu.
- **Défilement plus fluide** : navigation entre exercices avec flèches clavier / boutons précédent-suivant collants, défilement doux vers l'exercice actif, en-tête de section collant (Cours / TD), bouton « remonter en haut », sommaire rapide des exercices d'un chapitre (sauter au n°).
- Respect du mode « mouvement réduit ».

## 3. Audit du site Maths
- Parcours de toutes les pages Maths (ordinateur + téléphone 390px) : liens cassés, affichage des formules, documents Drive, chevauchements, textes non français.
- Correction des problèmes trouvés, liste rendue à la fin.

## Détails techniques
- `MathExercise.source` gagne `"exemple"` ; ids `chN-exemple-K` (disjoints des cours/TD) dans de nouveaux fichiers `src/content/math/course-examples/`, fusionnés dans les chapitres.
- `numbering.ts` et `mcp-server/src/data.ts` FROZEN_REGISTRY : append uniquement ; `dailyPool` filtre `source !== "exemple"`.
- `MathShell` : état `collapsed` (localStorage `fa_math_sidebar_collapsed`), grille `lg:grid-cols-[0_1fr]` animée.
- `materialize-spa-routes.mjs` : étendre le nombre de pages `/maths/exo/:uid` statiques.
- Vérification : tsgo, tests existants, Playwright sur les pages clés.
