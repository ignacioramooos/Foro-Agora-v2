CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.maths_leaderboard()
RETURNS TABLE (user_id uuid, display_name text, avatar_url text, total integer, week integer, last_done timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT p.user_id,
         COALESCE(NULLIF(trim(pr.display_name), ''), NULLIF(split_part(trim(pr.full_name), ' ', 1), ''), 'Élève') AS display_name,
         pr.avatar_url,
         count(*)::int AS total,
         (count(*) FILTER (WHERE p.completed_at >= now() - interval '7 days'))::int AS week,
         max(p.completed_at) AS last_done
  FROM public.math_exercise_progress p
  LEFT JOIN public.profiles pr ON pr.user_id = p.user_id
  WHERE auth.uid() IS NOT NULL
  GROUP BY p.user_id, pr.display_name, pr.full_name, pr.avatar_url
  ORDER BY total DESC, last_done ASC
  LIMIT 200
$$;
REVOKE ALL ON FUNCTION private.maths_leaderboard() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.maths_leaderboard() TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.get_maths_leaderboard();
CREATE FUNCTION public.get_maths_leaderboard()
RETURNS TABLE (user_id uuid, display_name text, avatar_url text, total integer, week integer, last_done timestamptz)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$ SELECT * FROM private.maths_leaderboard() $$;
REVOKE ALL ON FUNCTION public.get_maths_leaderboard() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_maths_leaderboard() TO authenticated, service_role;