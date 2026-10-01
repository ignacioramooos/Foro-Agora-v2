CREATE TABLE public.math_exercise_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  exercise_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, exercise_id)
);
GRANT SELECT, INSERT, DELETE ON public.math_exercise_flags TO authenticated;
GRANT ALL ON public.math_exercise_flags TO service_role;
ALTER TABLE public.math_exercise_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own flags select" ON public.math_exercise_flags FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own flags insert" ON public.math_exercise_flags FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own flags delete" ON public.math_exercise_flags FOR DELETE TO authenticated USING (auth.uid() = user_id);