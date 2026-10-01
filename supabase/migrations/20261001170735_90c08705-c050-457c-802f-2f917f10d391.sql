CREATE TABLE public.math_exercise_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  exercise_id text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, exercise_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.math_exercise_progress TO authenticated;
GRANT ALL ON public.math_exercise_progress TO service_role;
ALTER TABLE public.math_exercise_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own math progress" ON public.math_exercise_progress
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);