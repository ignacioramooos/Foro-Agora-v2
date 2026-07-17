-- Limit SECURITY DEFINER functions to the roles that actually need them.
-- PostgreSQL grants EXECUTE to PUBLIC by default, which also includes anon and
-- authenticated. Trigger functions do not need to be directly callable.
ALTER FUNCTION public.handle_new_user() SET search_path = '';
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

ALTER FUNCTION public.enforce_class_registration_limit() SET search_path = '';
REVOKE ALL ON FUNCTION public.enforce_class_registration_limit() FROM PUBLIC, anon, authenticated;

ALTER FUNCTION public.has_role(uuid, public.app_role) SET search_path = '';
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;

-- These two RPCs deliberately expose only the non-sensitive public profile
-- projection used by the ranking and the aggregate participant count.
ALTER FUNCTION public.get_public_profiles() SET search_path = '';
REVOKE ALL ON FUNCTION public.get_public_profiles() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_profiles() TO anon, authenticated;

ALTER FUNCTION public.get_public_profiles_count() SET search_path = '';
REVOKE ALL ON FUNCTION public.get_public_profiles_count() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_profiles_count() TO anon, authenticated;

-- Public submission forms must remain insertable, but an always-true policy
-- lets callers submit arbitrary field values. Validate shape, size, and fields
-- that are meant to be server-controlled while keeping the current UX intact.
DROP POLICY IF EXISTS "Anyone can send contact message" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages public insert" ON public.contact_messages;
CREATE POLICY "contact_messages validated public insert"
  ON public.contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(btrim(name)) BETWEEN 2 AND 120
    AND char_length(email) BETWEEN 3 AND 320
    AND email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    AND char_length(btrim(message)) BETWEEN 5 AND 5000
  );

DROP POLICY IF EXISTS "partner_inquiries public insert" ON public.partner_inquiries;
CREATE POLICY "partner_inquiries validated public insert"
  ON public.partner_inquiries FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(btrim(full_name)) BETWEEN 2 AND 120
    AND char_length(btrim(organization)) BETWEEN 2 AND 200
    AND char_length(btrim(role)) BETWEEN 1 AND 120
    AND char_length(email) BETWEEN 3 AND 320
    AND email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    AND char_length(btrim(org_type)) BETWEEN 1 AND 80
    AND cardinality(collaboration_types) <= 20
    AND (message IS NULL OR char_length(message) <= 5000)
    AND status = 'new'
  );

DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "newsletter_subscribers public insert" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_subscribers validated public insert"
  ON public.newsletter_subscribers FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(email) BETWEEN 3 AND 320
    AND email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    AND source = 'website'
    AND is_active = true
  );
