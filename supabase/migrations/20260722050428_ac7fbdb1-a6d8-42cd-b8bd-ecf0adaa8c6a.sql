
-- Referral codes
CREATE TABLE public.referral_codes (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.referral_codes TO authenticated;
GRANT ALL ON public.referral_codes TO service_role;

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own referral code"
  ON public.referral_codes FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public read for wall aggregation"
  ON public.referral_codes FOR SELECT
  TO anon
  USING (true);

CREATE TRIGGER update_referral_codes_updated_at
  BEFORE UPDATE ON public.referral_codes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Referrals
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (referrer_user_id <> referred_user_id)
);

CREATE INDEX referrals_referrer_idx ON public.referrals(referrer_user_id);

GRANT SELECT ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see referrals they made or received"
  ON public.referrals FOR SELECT
  TO authenticated
  USING (auth.uid() = referrer_user_id OR auth.uid() = referred_user_id);

-- Column-level anon read so the wall view can aggregate under security_invoker
GRANT SELECT (id, referrer_user_id, created_at) ON public.referrals TO anon;
GRANT SELECT (user_id, display_name) ON public.referral_codes TO anon;

-- resolve_referral_code (anon-safe lookup)
CREATE OR REPLACE FUNCTION public.resolve_referral_code(_code TEXT)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id FROM public.referral_codes WHERE code = _code
$$;

REVOKE ALL ON FUNCTION public.resolve_referral_code(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.resolve_referral_code(TEXT) TO anon, authenticated;

-- claim_referral: authenticated user records they were invited
CREATE OR REPLACE FUNCTION public.claim_referral(_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _referrer UUID;
  _me UUID := auth.uid();
BEGIN
  IF _me IS NULL THEN
    RETURN FALSE;
  END IF;

  SELECT user_id INTO _referrer FROM public.referral_codes WHERE code = _code;
  IF _referrer IS NULL OR _referrer = _me THEN
    RETURN FALSE;
  END IF;

  INSERT INTO public.referrals (referrer_user_id, referred_user_id, code)
  VALUES (_referrer, _me, _code)
  ON CONFLICT (referred_user_id) DO NOTHING;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_referral(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_referral(TEXT) TO authenticated;

-- thank_you_wall view: inviters with >= 5 referrals
CREATE OR REPLACE VIEW public.thank_you_wall
WITH (security_invoker = true)
AS
SELECT
  rc.user_id,
  COALESCE(NULLIF(btrim(rc.display_name), ''), 'Aliado anónimo') AS display_name,
  COUNT(r.id) AS referral_count,
  MIN(r.created_at) AS first_referral_at,
  MAX(r.created_at) AS latest_referral_at
FROM public.referral_codes rc
JOIN public.referrals r ON r.referrer_user_id = rc.user_id
GROUP BY rc.user_id, rc.display_name
HAVING COUNT(r.id) >= 5;

GRANT SELECT ON public.thank_you_wall TO anon, authenticated;
