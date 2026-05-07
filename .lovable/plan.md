## Context

Google's OAuth consent screen requires public URLs for a Privacy Policy and Terms of Service before it will let you publish the app (or stop showing the unverified-app warning). Right now Foro Agora doesn't have either page, so there's nothing to paste into the Google Cloud Console fields.

The fix is to add two real, publicly accessible pages to the site and then paste their URLs into Google Cloud Console.

## Plan

1. **Create `/privacidad` route** (`src/routes/privacidad.tsx`)
   - Standard privacy policy tailored to Foro Agora: nonprofit educational project in Uruguay, what data is collected (name, email, Google profile via Supabase Auth, lesson progress), how it's used (account, progress tracking, newsletter), third parties (Supabase, Google OAuth, Lovable hosting), user rights (access/deletion via contacto@foroagora.org), no sale of data, cookies/local storage note, contact email, last-updated date.
   - Proper SEO head: title, description, canonical.

2. **Create `/terminos` route** (`src/routes/terminos.tsx`)
   - Terms of service: free educational service, eligibility (students), acceptable use, no financial advice disclaimer (already a project value), account responsibility, IP ownership of content, termination, limitation of liability, governing law (Uruguay), contact email, last-updated date.
   - Proper SEO head.

3. **Link both pages from `Footer.tsx`**
   - Add a small "Legal" column or append "Privacidad" and "Términos" to the existing navigation list so the URLs are crawlable and discoverable.

4. **Note for the user (no code)** — after deploy, paste these into Google Cloud Console → OAuth consent screen:
   - App home page: `https://foroagora.org`
   - Privacy policy: `https://foroagora.org/privacidad`
   - Terms of service: `https://foroagora.org/terminos`

## Questions before I build

- Should the legal copy be in **Spanish** (matches the rest of the site) — assuming yes unless you say otherwise.
- Are the URL slugs `/privacidad` and `/terminos` OK, or do you prefer `/privacy` and `/terms`?
- Anything specific you want called out (e.g. that the project is run by volunteers, specific partners listed, a legal entity name)? If not, I'll write generic-but-accurate copy that you can tweak later.
