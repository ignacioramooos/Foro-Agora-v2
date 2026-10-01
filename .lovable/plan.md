# Refonte de /maths : documents complets, chapitres dépliables, Khôlles et DM

## Problèmes constatés
- Le cours s'ouvre dans une fenêtre qui n'affiche que la première page (surtout sur téléphone, où le navigateur ne fait pas défiler un PDF intégré).
- Pas d'accès direct au document original sur Google Drive.
- Pas de section Khôlles ni DM, alors que les documents existent dans le dossier Drive.

## Documents trouvés dans le dossier Drive
- Cours chapitres 1 à 6 et TD chapitres 1 à 6
- Programmes de khôlles : semaines du 14/09, 21/09 et 28/09/2026
- DM n°1 et son corrigé
- Formulaire de trigonométrie, Méthodologie (s'exprimer, rédiger, présenter)

## Ce qui change

### 1. Lecteur de documents complet (partout)
- Chaque document (cours, TD, khôlle, DM) s'affiche dans un lecteur Google Drive intégré qui montre toutes les pages, avec défilement, sur ordinateur et sur téléphone.
- Chaque lecteur a deux boutons : « Ouvrir dans Google Drive » et « Plein écran ».
- Si le lecteur ne charge pas, un message propose d'ouvrir le document dans Drive.

### 2. Navigation de la barre latérale
```text
Maths
  Aléatoire            (mélange quotidien, comme aujourd'hui)
  Chapitres
    Chapitre 1  v      (se déplie juste en dessous)
      Cours            -> document du cours + exercices du cours
      TD               -> document du TD + exercices du TD
    Chapitre 2 ...
  Khôlles
  DM
  Ressources           (formulaire trigo, méthodologie)
```
- Toucher un chapitre le déplie sous son nom avec les sous-onglets Cours et TD.
- Cours : exercices du cours (étiquette COURS) + document complet du cours.
- TD : exercices du TD (étiquette TD) + document complet du TD.
- Sur ordinateur : exercices à gauche, document à droite (redimensionnable, comme Desmos). Sur téléphone : onglets « Exercices / Document ».
- Sur téléphone, la barre latérale devient un menu déroulant en haut avec la même hiérarchie.

### 3. Section Khôlles
- Une carte par semaine (la plus récente en premier, « Cette semaine » mise en avant).
- Pour chaque semaine : chapitres concernés, liste détaillée des incontournables (questions de cours, démonstrations, exercices types), formules rendues proprement, et lien vers le chapitre correspondant du site.
- Bouton pour ouvrir le programme original (lecteur intégré + Google Drive).
- Je transcris le contenu des trois programmes à partir des PDF, page par page.

### 4. Section DM
- DM n°1 : énoncé transcrit question par question (avec formules), case « fait », bouton Gemini, et document original.
- Corrigé caché par défaut derrière « Afficher le corrigé » pour éviter de le lire trop tôt.

### 5. Ressources
- Formulaire de trigo et Méthodologie, chacun dans le lecteur complet.

### 6. Qualité
- Tout le texte en français.
- Les anciens liens (/maths, /maths/chapitre/…, /practica) continuent de fonctionner ; la progression enregistrée n'est pas perdue (identifiants d'exercices inchangés).
- Vérification sur ordinateur (1280 px) et téléphone (375 px), en clair et sombre, sans erreur.

## Point à vérifier de ton côté
Le lecteur Google Drive fonctionne seulement si le dossier est partagé en « Toute personne disposant du lien ». Je le vérifie pendant la construction ; sinon je te demanderai de changer le partage.

## Détails techniques
- Nouveau fichier de contenu `src/content/math/documents.ts` : id Drive par document, type (cours/td/kholle/dm/ressource), titre. URL lecteur `https://drive.google.com/file/d/{id}/preview`, ouverture `.../view`.
- Composant `DocumentViewer` (iframe preview + boutons Drive/plein écran + repli).
- `src/content/math/kholles/*.ts` (semaine, date, chapitres liés, items LaTeX) et `src/content/math/dm/*.ts` (questions, corrigé), chargés automatiquement comme les chapitres pour que les nouvelles semaines s'ajoutent facilement.
- Routes : `/maths`, `/maths/chapitre/:id/:onglet(cours|td)`, `/maths/kholles`, `/maths/kholles/:semaine`, `/maths/dm/:id`, `/maths/ressources`; `/maths/chapitre/:id` redirige vers `/cours`. Ajout dans le script de pré-génération des routes et dans RouteSeo (noindex).
- Barre latérale partagée `MathSidebar` (Accordion) dans `StudyLayout`; Sheet sur mobile.
- PDF locaux de `public/practica/` conservés en secours.
