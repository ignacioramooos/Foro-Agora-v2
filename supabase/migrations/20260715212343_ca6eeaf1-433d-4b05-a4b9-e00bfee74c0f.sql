
-- Extend community_posts with body + user_id
ALTER TABLE public.community_posts
  ADD COLUMN IF NOT EXISTS body text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Comments table
CREATE TABLE IF NOT EXISTS public.community_post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.community_post_comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_post_comments TO authenticated;
GRANT ALL ON public.community_post_comments TO service_role;

ALTER TABLE public.community_post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone"
  ON public.community_post_comments FOR SELECT USING (true);

CREATE POLICY "Authenticated can create comments"
  ON public.community_post_comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update their own comments"
  ON public.community_post_comments FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete their own comments or admins"
  ON public.community_post_comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_community_post_comments_updated_at
  BEFORE UPDATE ON public.community_post_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Reactions table
CREATE TABLE IF NOT EXISTS public.community_post_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type text NOT NULL DEFAULT 'like',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id, reaction_type)
);

GRANT SELECT ON public.community_post_reactions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_post_reactions TO authenticated;
GRANT ALL ON public.community_post_reactions TO service_role;

ALTER TABLE public.community_post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reactions viewable by everyone"
  ON public.community_post_reactions FOR SELECT USING (true);

CREATE POLICY "Users manage own reactions - insert"
  ON public.community_post_reactions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own reactions - delete"
  ON public.community_post_reactions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
