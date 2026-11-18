# Ajouter une nouvelle classroom sur Foro Agora Classrooms

Ce dossier `_template/` est le modèle officiel pour ouvrir gratuitement un espace d'entraînement (`/classroom/<slug>`) pour n'importe quelle matière (Physique, Chimie, SII, Mathématiques, Économie, Informatique…), au lycée, à l'université ou en CPGE.

## Étapes (5 minutes)

1. **Dupliquer le dossier**
   Copier `src/content/subjects/_template/` vers `src/content/subjects/<slug>/` (ex. `physique`, `chimie`, `sii`).

2. **Configurer la classe**
   Dans `src/content/subjects/<slug>/index.ts` :
   - `slug` : identifiant d'URL (`/classroom/<slug>`).
   - `name` / `fullName` : nom court (menu) et nom complet (annuaire `/classroom`).
   - `professor` / `institution` / `level` : informations affichées sur la carte du cours.
   - `access` *(optionnel)* : public par défaut ; peut être passé à `{ mode: "authenticated" }` ou `{ mode: "restricted", allowedEmails: [...], allowedDomains: [...], unlisted: true }` sur demande du professeur.
   - `aiContext` : contexte utilisé par le bouton « Copier pour Gemini » (ex. `"en physique en PCSI"`, `"en chimie au lycée"`).
   - `features` : activer uniquement ce qui est pertinent pour le cours :
     - `coursTdSplit`: `false` pour une liste unifiée d'exercices, `true` pour séparer Cours et TD (CPGE).
     - `calculator`: `true` pour afficher la calculatrice graphique Desmos.
     - `formulaire`: `true` pour les fiches de formules + mode flashcards.
     - `printableSheet`: `true` pour le générateur de planche papier A4.
     - `assignments`: `true` si vous ajoutez des devoirs (`assignments`).
     - `resources`: `true` pour les documents Google Drive (`resourceDocs` / `bonusSheets`) et le lien MCP de la classe.
     - `kholles` / `kholleSimulator`: **modules exclusifs CPGE**, désactivés par défaut (`false`).

3. **Ajouter des chapitres et exercices**
   Créer `chapters/chapitre-1.ts`, `chapitre-2.ts`, etc.
   - Chaque exercice accepte du LaTeX (`$...$` en ligne, `$$...$$` en bloc), des `hints` progressifs et un champ `answer` optionnel.
   - **Règle importante** : ne jamais changer l'`id` d'un exercice déjà publié, car la progression locale des élèves est indexée dessus.

4. **Enregistrer la classe (chargement paresseux)**
   Ajouter une entrée de métadonnées dans `src/content/subjects/registry.ts` avec un `load: async () => (await import("./<slug>")).<slug>Subject` afin de garder un bundle initial léger même avec 50+ classes.

5. **Exporter pour le serveur MCP**
   Lancer `npm run export:classrooms` (inclus dans `npm run build`) pour générer `public/classrooms/<slug>.json` (les classes privées ne sont jamais exportées publiquement).

C'est tout : toutes les routes (`/classroom/<slug>`, chapitres, index `#NNN`, progression, planche A4, formulaire flashcards, recherche `Ctrl+K`, accès hors ligne PWA, et endpoint MCP dédié) fonctionnent automatiquement.
