
DROP POLICY IF EXISTS "Public read for wall aggregation" ON public.referral_codes;
REVOKE SELECT ON public.referral_codes FROM anon;

REVOKE EXECUTE ON FUNCTION public.resolve_referral_code(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_public_profiles() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_public_profiles_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.claim_referral(text) FROM PUBLIC, anon;

DROP VIEW IF EXISTS public.thank_you_wall;
CREATE VIEW public.thank_you_wall
WITH (security_invoker = true) AS
SELECT
  p.user_id,
  p.display_name,
  p.avatar_url,
  COUNT(r.referred_user_id)::int AS referral_count
FROM public.profiles p
JOIN public.referrals r ON r.referrer_user_id = p.user_id
GROUP BY p.user_id, p.display_name, p.avatar_url
HAVING COUNT(r.referred_user_id) >= 5;

GRANT SELECT ON public.thank_you_wall TO anon, authenticated;

GRANT EXECUTE ON FUNCTION public.claim_referral(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.resolve_referral_code(text) TO authenticated;
