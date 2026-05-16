ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS participation_reason text,
  ADD COLUMN IF NOT EXISTS newsletter_email_opt_in boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  meta jsonb := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  v_full_name text := NULLIF(meta->>'full_name', '');
  v_display_name text := COALESCE(NULLIF(meta->>'display_name', ''), v_full_name, NULLIF(meta->>'name', ''), split_part(NEW.email, '@', 1));
  v_age_range text := NULLIF(meta->>'age_range', '');
  v_age integer := NULLIF(meta->>'age', '')::integer;
  v_department text := NULLIF(meta->>'department', '');
  v_institution text := NULLIF(meta->>'institution', '');
  v_how_found_us text := NULLIF(meta->>'how_found_us', '');
  v_participation_reason text := NULLIF(meta->>'participation_reason', '');
  v_accepted_terms boolean := COALESCE((meta->>'accepted_terms')::boolean, false);
  v_newsletter_email_opt_in boolean := COALESCE((meta->>'newsletter_email_opt_in')::boolean, false);
  v_interests text[] := CASE
    WHEN jsonb_typeof(meta->'interests') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(meta->'interests'))
    ELSE NULL
  END;
  v_onboarding_completed boolean := (
    v_full_name IS NOT NULL AND v_age IS NOT NULL
    AND v_department IS NOT NULL AND v_institution IS NOT NULL
    AND v_accepted_terms = true
  );
BEGIN
  INSERT INTO public.profiles (
    user_id, email, display_name, full_name, age, age_range,
    department, institution, how_found_us, interests, participation_reason,
    accepted_terms, newsletter_email_opt_in, onboarding_completed
  )
  VALUES (
    NEW.id, NEW.email, v_display_name, v_full_name, v_age, v_age_range,
    v_department, v_institution, v_how_found_us, v_interests, v_participation_reason,
    v_accepted_terms, v_newsletter_email_opt_in, v_onboarding_completed
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    age = COALESCE(EXCLUDED.age, public.profiles.age),
    age_range = COALESCE(EXCLUDED.age_range, public.profiles.age_range),
    department = COALESCE(EXCLUDED.department, public.profiles.department),
    institution = COALESCE(EXCLUDED.institution, public.profiles.institution),
    how_found_us = COALESCE(EXCLUDED.how_found_us, public.profiles.how_found_us),
    interests = COALESCE(EXCLUDED.interests, public.profiles.interests),
    participation_reason = COALESCE(EXCLUDED.participation_reason, public.profiles.participation_reason),
    accepted_terms = public.profiles.accepted_terms OR EXCLUDED.accepted_terms,
    newsletter_email_opt_in = EXCLUDED.newsletter_email_opt_in,
    onboarding_completed = public.profiles.onboarding_completed OR EXCLUDED.onboarding_completed,
    updated_at = now();
  RETURN NEW;
END;
$function$;
