CREATE TABLE public.maths_forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  author_name text NOT NULL CHECK (char_length(author_name) BETWEEN 1 AND 100),
  title text NOT NULL CHECK (char_length(title) BETWEEN 3 AND 140),
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 5000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.maths_forum_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.maths_forum_posts TO authenticated;
GRANT ALL ON public.maths_forum_posts TO service_role;
ALTER TABLE public.maths_forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Maths forum posts are public" ON public.maths_forum_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users create maths posts" ON public.maths_forum_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authors update maths posts" ON public.maths_forum_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authors delete maths posts" ON public.maths_forum_posts FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER maths_forum_posts_updated_at BEFORE UPDATE ON public.maths_forum_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.maths_forum_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.maths_forum_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  author_name text NOT NULL CHECK (char_length(author_name) BETWEEN 1 AND 100),
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 1500),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.maths_forum_comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.maths_forum_comments TO authenticated;
GRANT ALL ON public.maths_forum_comments TO service_role;
ALTER TABLE public.maths_forum_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Maths forum comments are public" ON public.maths_forum_comments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users create maths comments" ON public.maths_forum_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authors update maths comments" ON public.maths_forum_comments FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authors delete maths comments" ON public.maths_forum_comments FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER maths_forum_comments_updated_at BEFORE UPDATE ON public.maths_forum_comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX maths_forum_comments_post_idx ON public.maths_forum_comments(post_id, created_at);

CREATE TABLE public.maths_forum_reactions (
  post_id uuid NOT NULL REFERENCES public.maths_forum_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  reaction_type text NOT NULL DEFAULT 'like' CHECK (reaction_type = 'like'),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id, reaction_type)
);
GRANT SELECT ON public.maths_forum_reactions TO anon;
GRANT SELECT, INSERT, DELETE ON public.maths_forum_reactions TO authenticated;
GRANT ALL ON public.maths_forum_reactions TO service_role;
ALTER TABLE public.maths_forum_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Maths forum reactions are public" ON public.maths_forum_reactions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users create own maths reactions" ON public.maths_forum_reactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own maths reactions" ON public.maths_forum_reactions FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.maths_forum_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.maths_forum_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  storage_path text NOT NULL UNIQUE,
  file_name text NOT NULL CHECK (char_length(file_name) BETWEEN 1 AND 255),
  mime_type text NOT NULL CHECK (mime_type IN ('application/pdf','image/png','image/jpeg','image/webp','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')),
  file_size bigint NOT NULL CHECK (file_size > 0 AND file_size <= 20971520),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.maths_forum_attachments TO anon;
GRANT SELECT, INSERT, DELETE ON public.maths_forum_attachments TO authenticated;
GRANT ALL ON public.maths_forum_attachments TO service_role;
ALTER TABLE public.maths_forum_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Maths forum attachments are public" ON public.maths_forum_attachments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users attach files to own posts" ON public.maths_forum_attachments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.maths_forum_posts p WHERE p.id = post_id AND p.user_id = auth.uid()));
CREATE POLICY "Authors delete maths attachments" ON public.maths_forum_attachments FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE INDEX maths_forum_attachments_post_idx ON public.maths_forum_attachments(post_id);

CREATE POLICY "Anyone can read maths forum files" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'maths-forum-files');
CREATE POLICY "Users upload maths forum files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'maths-forum-files' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Owners update maths forum files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'maths-forum-files' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin'))) WITH CHECK (bucket_id = 'maths-forum-files' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin')));
CREATE POLICY "Owners delete maths forum files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'maths-forum-files' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin')));