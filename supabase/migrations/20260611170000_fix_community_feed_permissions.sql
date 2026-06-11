ALTER TABLE public.community_posts
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS body TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

UPDATE public.community_posts
SET body = title
WHERE body = '';

CREATE TABLE IF NOT EXISTS public.community_post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  body TEXT NOT NULL CHECK (char_length(trim(body)) BETWEEN 1 AND 1200),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.community_post_reactions (
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL DEFAULT 'like' CHECK (reaction_type = 'like'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id, reaction_type)
);

CREATE INDEX IF NOT EXISTS community_post_comments_post_id_idx
  ON public.community_post_comments(post_id, created_at);

CREATE INDEX IF NOT EXISTS community_post_reactions_post_id_idx
  ON public.community_post_reactions(post_id);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_reactions ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.community_posts TO anon, authenticated;
GRANT SELECT ON public.community_post_comments TO anon, authenticated;
GRANT SELECT ON public.community_post_reactions TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.community_post_comments TO authenticated;
GRANT INSERT, DELETE ON public.community_post_reactions TO authenticated;

DROP POLICY IF EXISTS "Community posts are publicly readable" ON public.community_posts;
DROP POLICY IF EXISTS "Admin insert community posts" ON public.community_posts;
DROP POLICY IF EXISTS "community_posts public read" ON public.community_posts;
DROP POLICY IF EXISTS "community_posts admin write" ON public.community_posts;
DROP POLICY IF EXISTS "community_posts read visible" ON public.community_posts;
DROP POLICY IF EXISTS "community_posts create own" ON public.community_posts;
DROP POLICY IF EXISTS "community_posts update own or admin" ON public.community_posts;
DROP POLICY IF EXISTS "community_posts delete own or admin" ON public.community_posts;

CREATE POLICY "community_posts read visible"
ON public.community_posts FOR SELECT TO anon, authenticated
USING (
  is_published = true
  OR user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "community_posts create own"
ON public.community_posts FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND is_published = true
  AND (
    type = 'analysis'
    OR public.has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "community_posts update own or admin"
ON public.community_posts FOR UPDATE TO authenticated
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  (
    user_id = auth.uid()
    AND type = 'analysis'
  )
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "community_posts delete own or admin"
ON public.community_posts FOR DELETE TO authenticated
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "community_post_comments read visible" ON public.community_post_comments;
DROP POLICY IF EXISTS "community_post_comments create own" ON public.community_post_comments;
DROP POLICY IF EXISTS "community_post_comments update own or admin" ON public.community_post_comments;
DROP POLICY IF EXISTS "community_post_comments delete own or admin" ON public.community_post_comments;

CREATE POLICY "community_post_comments read visible"
ON public.community_post_comments FOR SELECT TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.community_posts p
    WHERE p.id = community_post_comments.post_id
      AND (
        p.is_published = true
        OR p.user_id = auth.uid()
        OR public.has_role(auth.uid(), 'admin')
      )
  )
);

CREATE POLICY "community_post_comments create own"
ON public.community_post_comments FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.community_posts p
    WHERE p.id = community_post_comments.post_id
      AND p.is_published = true
  )
);

CREATE POLICY "community_post_comments update own or admin"
ON public.community_post_comments FOR UPDATE TO authenticated
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "community_post_comments delete own or admin"
ON public.community_post_comments FOR DELETE TO authenticated
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "community_post_reactions read visible" ON public.community_post_reactions;
DROP POLICY IF EXISTS "community_post_reactions create own" ON public.community_post_reactions;
DROP POLICY IF EXISTS "community_post_reactions delete own" ON public.community_post_reactions;

CREATE POLICY "community_post_reactions read visible"
ON public.community_post_reactions FOR SELECT TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.community_posts p
    WHERE p.id = community_post_reactions.post_id
      AND p.is_published = true
  )
);

CREATE POLICY "community_post_reactions create own"
ON public.community_post_reactions FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND reaction_type = 'like'
  AND EXISTS (
    SELECT 1 FROM public.community_posts p
    WHERE p.id = community_post_reactions.post_id
      AND p.is_published = true
  )
);

CREATE POLICY "community_post_reactions delete own"
ON public.community_post_reactions FOR DELETE TO authenticated
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);
