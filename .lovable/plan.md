
## Goal

Port the Cor ad Cor referral system into Foro Agora:
- Logged-in users get a personal invite link inside the **Difundir** tab (`/difundir`).
- When 5 people sign up using that link, the user gets a "thank you" recognition inside the **Aliados** tab (`/partners`).
- Anonymous visitors landing with `?ref=CODE` get the code stored, and it's claimed automatically after signup (email or Google).

## Database (migration)

Replicate the Cor ad Cor schema, adapted to Foro Agora tables:

1. `public.referral_codes` — `user_id` PK → `auth.users`, `code` UNIQUE, `display_name`, timestamps. RLS: user manages own row; anon SELECT on `(user_id, display_name)` only (for the wall view).
2. `public.referrals` — `id`, `referrer_user_id`, `referred_user_id` (UNIQUE), `code`, `created_at`, check `referrer <> referred`. RLS: user sees rows where they are referrer or referred. Anon column-level SELECT on `(id, referrer_user_id, created_at)` for the wall aggregation.
3. `public.resolve_referral_code(_code text)` → uuid (SECURITY DEFINER, anon+authenticated).
4. `public.claim_referral(_code text)` → boolean (SECURITY DEFINER, authenticated) — inserts a referral row for `auth.uid()`, no-op on conflict.
5. `public.thank_you_wall` view (security_invoker) — grouping `referral_codes` + `referrals`, `HAVING count >= 5`. Falls back to `profiles.display_name` when `referral_codes.display_name` is empty.
6. Standard GRANTs per the public-schema-grants rule.

## Frontend

New file `src/lib/referral.ts` (copy pattern from Cor ad Cor, key rename `cac_ref` → `fa_ref`, base URL `https://foroagora.org`, `buildReferralUrl` uses `/?ref=`).

Wire capture + claim into existing auth flow:
- `src/pages/Index.tsx` (or root): call `captureRefFromUrl()` on mount.
- `src/contexts/AuthContext.tsx`: after a session is established (in the auth state change handler), fire-and-forget `claimReferralIfPending()`.

Update **Difundir** page (`src/pages/SpreadKitPage.tsx`):
- New authenticated-only section at the top ("Tu link de invitación"):
  - Loads/creates the user's `referral_codes` row (retry-on-collision loop, default `display_name` from `profiles.display_name`).
  - Shows link `https://foroagora.org/?ref=CODE`, copy button, WhatsApp/share buttons using the existing message templates but with the ref link swapped in.
  - Progress bar `N / 5` toward the Aliados wall, with copy: "Cuando 5 personas se registren con tu link, tu nombre aparece en Aliados."
  - Editable display name (saved back to `referral_codes.display_name`).
- Logged-out users see a small CTA: "Iniciá sesión para obtener tu link personal" linking to `/auth`.
- Existing generic share links/messages stay below.

Update **Aliados** page (`src/pages/PartnersPage.tsx`):
- Add a "Muro de agradecimiento" section listing all `thank_you_wall` entries as chips (name + invited count on hover), with empty state copy in Spanish.
- Keep existing partners/institutional content.

Copy in Spanish, no emojis, matching the existing Foro Agora tone (blue-pop, orange-pop, font-hand accents).

## Files touched

- New: `supabase/migrations/<ts>_referral_system.sql`
- New: `src/lib/referral.ts`
- Edit: `src/contexts/AuthContext.tsx` (call `claimReferralIfPending` post-signin)
- Edit: `src/pages/Index.tsx` (call `captureRefFromUrl` on mount)
- Edit: `src/pages/SpreadKitPage.tsx` (personal invite section)
- Edit: `src/pages/PartnersPage.tsx` (thank-you wall section)

## Out of scope

- No email notification when someone crosses the 5-referral threshold.
- No admin dashboard for referrals; admins can query the DB directly.
- No anti-abuse beyond the DB unique constraints (same as Cor ad Cor).
