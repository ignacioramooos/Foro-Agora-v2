# Mélanger, inscription Maths simple, photos dans le Forum

## 1. Bouton « Mélanger » (Aléatoire)
- Par défaut rien ne change : la sélection du jour (identique pour tous) s'affiche.
- Nouveau bouton « Mélanger » (icône Shuffle) près de « Exercice X sur Y » : remélange les exercices affichés dans un ordre aléatoire et revient au premier. Chaque clic donne un nouvel ordre.
- Petit lien « Revenir à la sélection du jour » quand un mélange est actif. Au rechargement, on revient à la sélection du jour. Progression et série inchangées.

## 2. Inscription Maths séparée et rapide
Constat : aujourd'hui, une personne connectée sans le questionnaire Foro Agora terminé est renvoyée de force vers la page d'inscription Foro Agora (questions sur le lycée, etc.), même depuis Maths.
- Les pages /maths ne déclenchent plus jamais cette redirection : on reste dans Maths.
- La fenêtre de connexion Maths reste en 1 étape : Google, ou e-mail + mot de passe (+ prénom à l'inscription). Après Google ou après confirmation d'e-mail, retour direct sur /maths (plus de passage par la page Foro Agora).
- Si la confirmation d'e-mail n'est pas requise, la personne est connectée immédiatement ; sinon message clair « Vérifie ta boîte mail ».
- Même compte que Foro Agora : si la personne va plus tard sur le site Foro Agora, le questionnaire lui sera demandé là-bas seulement.

## 3. Photos de profil dans le Forum
- Afficher l'avatar (photo ou initiale) à côté de l'auteur de chaque publication et de chaque commentaire.
- Les photos sont récupérées depuis les profils partagés, avec un lien temporaire sécurisé, mises en cache pour éviter les chargements répétés.
- Vérifier que changer sa photo dans « Modifier mon profil » met à jour l'en-tête et le Forum sans recharger.

## Détails techniques
- `PracticePage.tsx` : état `shuffleSeed` ; si présent, `seededShuffle(visible, seed)` ; bouton dans l'en-tête du workspace.
- `App.tsx` : exclure `pathname.startsWith("/maths")` de la redirection onboarding (ligne ~158).
- `StudyAuth.tsx` : signup avec `emailRedirectTo = getAuthRedirectUrl("/maths")` et metadata `{ display_name, signup_source: "maths" }` ; gérer `confirmationRequired`.
- `MathForumPage.tsx` : charger `get_public_profiles()` (déjà accessible en lecture), map user_id → avatar_url, URLs signées du bucket `profile-avatars` via `createSignedUrls`, composant `Avatar` (ui/avatar) avec repli sur l'initiale.
- `MathsProfileDialog` : après sauvegarde, émettre un événement pour rafraîchir les avatars du Forum.
- Vérification Playwright desktop + mobile ; connexion réelle non testable ici (Supabase externe), à tester avec un compte.
