
-- ============================================
-- 1. CLEAN UP ORPHAN PROFILES & RELINK FK
-- ============================================

-- Drop existing FK if any (we recreate it cleanly below)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Delete orphan profiles (no matching auth.users row)
DELETE FROM public.profiles
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Recreate FK with cascade
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Backfill profile rows for any existing auth.users without a profile
INSERT INTO public.profiles (user_id, display_name, email)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'display_name', u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  u.email
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.user_id IS NULL;

-- ============================================
-- 2. ENSURE handle_new_user TRIGGER EXISTS
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 3. FIX update_updated_at_column SEARCH_PATH
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================
-- 4. ADMIN HELPER (uses existing has_role)
-- ============================================
-- has_role(_user_id, _role) already exists.

-- ============================================
-- 5. PROFILES — RLS reset
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles select own" ON public.profiles;
DROP POLICY IF EXISTS "Profiles select admin" ON public.profiles;
DROP POLICY IF EXISTS "Profiles insert own" ON public.profiles;
DROP POLICY IF EXISTS "Profiles update own" ON public.profiles;
DROP POLICY IF EXISTS "Profiles update admin" ON public.profiles;

CREATE POLICY "Profiles select own"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Profiles insert own"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Profiles update own"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Public, non-PII view for counters and rankings
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public
WITH (security_invoker = on) AS
SELECT
  user_id,
  display_name,
  avatar_url,
  department,
  created_at
FROM public.profiles;

GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- Allow anon/auth to read the view (still needs base table access for non-owner rows).
-- We add a permissive SELECT policy for anon that exposes ONLY rows through the view;
-- but RLS applies on base table, so we add an "anon read minimal" policy and rely on the
-- view to limit columns. Since RLS can't restrict columns, we keep the base table locked
-- to owner+admin and offer the view via a SECURITY DEFINER function for public reads.

-- Replace the view with a security-definer function for safe public access
DROP VIEW IF EXISTS public.profiles_public;

CREATE OR REPLACE FUNCTION public.get_public_profiles()
RETURNS TABLE (
  user_id uuid,
  display_name text,
  avatar_url text,
  department text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id, display_name, avatar_url, department, created_at
  FROM public.profiles;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_profiles() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_public_profiles_count()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*) FROM public.profiles;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_profiles_count() TO anon, authenticated;

-- ============================================
-- 6. USER_ROLES — RLS
-- ============================================

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_roles select own" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles select admin" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles admin write" ON public.user_roles;

CREATE POLICY "user_roles select own"
  ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "user_roles admin write"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- 7. PUBLIC-READ CONTENT TABLES
--    (anon + auth read; admin-only write)
-- ============================================

-- COHORTS
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "cohorts public read" ON public.cohorts;
DROP POLICY IF EXISTS "cohorts admin write" ON public.cohorts;
CREATE POLICY "cohorts public read" ON public.cohorts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "cohorts admin write" ON public.cohorts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- EVENTS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "events public read" ON public.events;
DROP POLICY IF EXISTS "events admin write" ON public.events;
CREATE POLICY "events public read" ON public.events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "events admin write" ON public.events FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- PARTNERS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "partners public read" ON public.partners;
DROP POLICY IF EXISTS "partners admin write" ON public.partners;
CREATE POLICY "partners public read" ON public.partners FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "partners admin write" ON public.partners FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- LESSONS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lessons public read" ON public.lessons;
DROP POLICY IF EXISTS "lessons admin write" ON public.lessons;
CREATE POLICY "lessons public read" ON public.lessons FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "lessons admin write" ON public.lessons FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- CONTENT_ITEMS
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "content_items public read" ON public.content_items;
DROP POLICY IF EXISTS "content_items admin write" ON public.content_items;
CREATE POLICY "content_items public read" ON public.content_items FOR SELECT TO anon, authenticated
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "content_items admin write" ON public.content_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- COMMUNITY_POSTS
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "community_posts public read" ON public.community_posts;
DROP POLICY IF EXISTS "community_posts admin write" ON public.community_posts;
CREATE POLICY "community_posts public read" ON public.community_posts FOR SELECT TO anon, authenticated
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "community_posts admin write" ON public.community_posts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- CASE_STUDIES
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "case_studies public read" ON public.case_studies;
DROP POLICY IF EXISTS "case_studies owner read" ON public.case_studies;
DROP POLICY IF EXISTS "case_studies owner write" ON public.case_studies;
DROP POLICY IF EXISTS "case_studies admin write" ON public.case_studies;
CREATE POLICY "case_studies public read" ON public.case_studies FOR SELECT TO anon, authenticated
  USING (is_published = true);
CREATE POLICY "case_studies owner read" ON public.case_studies FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "case_studies owner write" ON public.case_studies FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "case_studies owner update" ON public.case_studies FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "case_studies admin delete" ON public.case_studies FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- CLASS_SESSIONS
ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "class_sessions public read" ON public.class_sessions;
DROP POLICY IF EXISTS "class_sessions admin write" ON public.class_sessions;
CREATE POLICY "class_sessions public read" ON public.class_sessions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "class_sessions admin write" ON public.class_sessions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- 8. PUBLIC-INSERT FORMS (PII protected)
--    anon INSERT only; admin SELECT/UPDATE/DELETE
-- ============================================

-- CONTACT_MESSAGES
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "contact_messages public insert" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages admin read" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages admin write" ON public.contact_messages;
CREATE POLICY "contact_messages public insert" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "contact_messages admin read" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "contact_messages admin write" ON public.contact_messages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "contact_messages admin delete" ON public.contact_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- CLASS_REGISTRATIONS
ALTER TABLE public.class_registrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "class_registrations public insert" ON public.class_registrations;
DROP POLICY IF EXISTS "class_registrations admin read" ON public.class_registrations;
DROP POLICY IF EXISTS "class_registrations admin write" ON public.class_registrations;
CREATE POLICY "class_registrations public insert" ON public.class_registrations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "class_registrations admin read" ON public.class_registrations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "class_registrations admin write" ON public.class_registrations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "class_registrations admin delete" ON public.class_registrations FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- PARTNER_INQUIRIES
ALTER TABLE public.partner_inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "partner_inquiries public insert" ON public.partner_inquiries;
DROP POLICY IF EXISTS "partner_inquiries admin read" ON public.partner_inquiries;
DROP POLICY IF EXISTS "partner_inquiries admin write" ON public.partner_inquiries;
CREATE POLICY "partner_inquiries public insert" ON public.partner_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "partner_inquiries admin read" ON public.partner_inquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "partner_inquiries admin write" ON public.partner_inquiries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "partner_inquiries admin delete" ON public.partner_inquiries FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- NEWSLETTER_SUBSCRIBERS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "newsletter_subscribers public insert" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "newsletter_subscribers admin read" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "newsletter_subscribers admin write" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_subscribers public insert" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "newsletter_subscribers admin read" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "newsletter_subscribers admin write" ON public.newsletter_subscribers FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "newsletter_subscribers admin delete" ON public.newsletter_subscribers FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- 9. OWNER-SCOPED USER DATA
-- ============================================

-- PORTFOLIOS
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "portfolios owner all" ON public.portfolios;
DROP POLICY IF EXISTS "portfolios admin read" ON public.portfolios;
CREATE POLICY "portfolios owner all" ON public.portfolios FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- PORTFOLIO_TRANSACTIONS
ALTER TABLE public.portfolio_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "portfolio_transactions owner all" ON public.portfolio_transactions;
CREATE POLICY "portfolio_transactions owner all" ON public.portfolio_transactions FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = portfolio_transactions.portfolio_id AND (p.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = portfolio_transactions.portfolio_id AND (p.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- LESSON_PROGRESS
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lesson_progress owner all" ON public.lesson_progress;
CREATE POLICY "lesson_progress owner all" ON public.lesson_progress FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- EVENT_REGISTRATIONS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "event_registrations owner all" ON public.event_registrations;
CREATE POLICY "event_registrations owner all" ON public.event_registrations FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- CERTIFICATES
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "certificates owner read" ON public.certificates;
DROP POLICY IF EXISTS "certificates admin write" ON public.certificates;
CREATE POLICY "certificates owner read" ON public.certificates FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "certificates admin write" ON public.certificates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
