CREATE TABLE public.ambassador_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  age INTEGER,
  department TEXT NOT NULL,
  institution TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  channels TEXT[] NOT NULL DEFAULT '{}',
  motivation TEXT NOT NULL,
  experience TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ambassador_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ambassador_applications public insert"
ON public.ambassador_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "ambassador_applications admin read"
ON public.ambassador_applications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "ambassador_applications admin update"
ON public.ambassador_applications
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "ambassador_applications admin delete"
ON public.ambassador_applications
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

GRANT INSERT ON public.ambassador_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.ambassador_applications TO authenticated;
