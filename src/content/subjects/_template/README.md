# Ajouter une nouvelle matière ou classe sur Foro Agora

Ce dossier `_template/` est le modèle officiel pour ouvrir gratuitement un espace d'entraînement (Physique, Chimie, SII, Mathématiques, ou toute autre discipline, en CPGE, au lycée ou à l'université).

## Étapes (5 minutes)

1. **Dupliquer le dossier**
   Copier `src/content/subjects/_template/` vers `src/content/subjects/<slug>/` (ex. `physique`, `chimie`, `sii`).

2. **Configurer la matière**
   Dans `src/content/subjects/<slug>/index.ts` :
   - `slug` : identifiant d'URL (`/classes/<slug>`).
   - `name` / `fullName` : nom court (menu) et nom complet (annuaire `/classes`).
   - `professor` / `institution` / `level` : informations affichées sur la carte du cours.
   - `aiContext` : contexte utilisé par le bouton « Copier pour Gemini » (ex. `"en physique en PCSI"`, `"en chimie au lycée"`).
   - `features` : activer uniquement ce qui est pertinent pour le cours :
     - `coursTdSplit`: `false` pour une liste unifiée d'exercices, `true` pour séparer Cours et TD (CPGE).
     - `calculator`: `true` pour afficher la calculatrice graphique Desmos.
     - `formulaire`: `true` pour les fiches de formules + mode flashcards.
     - `printableSheet`: `true` pour le générateur de planche papier A4.
     - `assignments`: `true` si vous ajoutez des devoirs (`assignments`).
     - `resources`: `true` si vous ajoutez des documents Google Drive (`resourceDocs` / `bonusSheets`).
     - `kholles` / `kholleSimulator`: **modules exclusifs CPGE**, désactivés par défaut (`false`).

3. **Ajouter des chapitres et exercices**
   Créer `chapters/chapitre-1.ts`, `chapitre-2.ts`, etc.
   - Chaque exercice accepte du LaTeX (`$...$` en ligne, `$$...$$` en bloc), des `hints` progressifs et un champ `answer` optionnel.
   - **Règle importante** : ne jamais changer l'`id` d'un exercice déjà publié, car la progression locale des élèves est indexée dessus.

4. **Enregistrer la matière**
   Ajouter la matière dans `src/content/subjects/registry.ts` :
   ```ts
   import { physiqueSubject } from "./physique";
   // ...
   export const subjects: SubjectConfig[] = [mathsSubject, physiqueSubject];
   ```

C'est tout : toutes les routes (`/classes/<slug>`, chapitres, index `#NNN`, progression, planche A4, formulaire flashcards, recherche `Ctrl+K`) sont générées automatiquement.
