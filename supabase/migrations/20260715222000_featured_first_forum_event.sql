ALTER TABLE public.class_sessions
  ADD COLUMN IF NOT EXISTS end_date timestamptz,
  ADD COLUMN IF NOT EXISTS registration_limit integer,
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

UPDATE public.class_sessions
SET registration_limit = GREATEST(max_capacity, COALESCE(registration_limit, max_capacity))
WHERE registration_limit IS NULL OR registration_limit < max_capacity;

ALTER TABLE public.class_sessions
  ALTER COLUMN registration_limit SET DEFAULT 30,
  ALTER COLUMN registration_limit SET NOT NULL;

ALTER TABLE public.class_sessions
  DROP CONSTRAINT IF EXISTS class_sessions_capacity_check,
  ADD CONSTRAINT class_sessions_capacity_check CHECK (max_capacity > 0 AND registration_limit >= max_capacity);

ALTER TABLE public.class_registrations
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS cedula text;

CREATE UNIQUE INDEX IF NOT EXISTS class_registrations_class_user_unique
  ON public.class_registrations (class_id, user_id)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS class_registrations_class_cedula_unique
  ON public.class_registrations (class_id, cedula)
  WHERE cedula IS NOT NULL;

CREATE OR REPLACE FUNCTION public.is_valid_uruguayan_cedula(value text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
STRICT
SET search_path = public
AS $$
DECLARE
  weighted_sum integer;
  verifier integer;
BEGIN
  IF value !~ '^[0-9]{8}$' THEN
    RETURN false;
  END IF;

  weighted_sum :=
    substring(value, 1, 1)::integer * 2 +
    substring(value, 2, 1)::integer * 9 +
    substring(value, 3, 1)::integer * 8 +
    substring(value, 4, 1)::integer * 7 +
    substring(value, 5, 1)::integer * 6 +
    substring(value, 6, 1)::integer * 3 +
    substring(value, 7, 1)::integer * 4;
  verifier := (10 - (weighted_sum % 10)) % 10;

  RETURN verifier = substring(value, 8, 1)::integer;
END;
$$;

ALTER TABLE public.class_registrations
  DROP CONSTRAINT IF EXISTS class_registrations_valid_cedula,
  ADD CONSTRAINT class_registrations_valid_cedula
    CHECK (cedula IS NULL OR public.is_valid_uruguayan_cedula(cedula));

DO $$
BEGIN
  IF NOT public.is_valid_uruguayan_cedula('12345672')
     OR public.is_valid_uruguayan_cedula('12345673') THEN
    RAISE EXCEPTION 'Falló la validación interna de cédula uruguaya.';
  END IF;
END;
$$;

DROP POLICY IF EXISTS "Anyone can register for classes" ON public.class_registrations;
DROP POLICY IF EXISTS "class_registrations public insert" ON public.class_registrations;
DROP POLICY IF EXISTS "Users can register for classes" ON public.class_registrations;
DROP POLICY IF EXISTS "Users can view own class registrations" ON public.class_registrations;

CREATE POLICY "Users can register for classes"
  ON public.class_registrations FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND cedula IS NOT NULL
    AND public.is_valid_uruguayan_cedula(cedula)
    AND lower(email) = lower(auth.jwt() ->> 'email')
  );

CREATE POLICY "Users can view own class registrations"
  ON public.class_registrations FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.enforce_class_registration_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  allowed_registrations integer;
  current_registrations integer;
  session_active boolean;
  session_date timestamptz;
BEGIN
  SELECT registration_limit, is_active, class_date
  INTO allowed_registrations, session_active, session_date
  FROM public.class_sessions
  WHERE id = NEW.class_id
  FOR UPDATE;

  IF allowed_registrations IS NULL THEN
    RAISE EXCEPTION 'La clase seleccionada no existe.' USING ERRCODE = 'P0001';
  END IF;

  IF NOT session_active OR session_date <= now() THEN
    RAISE EXCEPTION 'Las inscripciones para esta clase están cerradas.' USING ERRCODE = 'P0001';
  END IF;

  SELECT count(*) INTO current_registrations
  FROM public.class_registrations
  WHERE class_id = NEW.class_id;

  IF current_registrations >= allowed_registrations THEN
    RAISE EXCEPTION 'Se alcanzó el límite de inscripciones para esta clase.' USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_class_registration_limit_trigger ON public.class_registrations;
CREATE TRIGGER enforce_class_registration_limit_trigger
  BEFORE INSERT ON public.class_registrations
  FOR EACH ROW EXECUTE FUNCTION public.enforce_class_registration_limit();

DO $$
DECLARE
  target_id uuid;
BEGIN
  SELECT id INTO target_id
  FROM public.class_sessions
  WHERE (class_date AT TIME ZONE 'America/Montevideo')::date = DATE '2026-07-22'
     OR title ILIKE '%primera clase%foro agora%'
     OR title ILIKE '%primer encuentro%foro agora%'
  ORDER BY
    CASE WHEN (class_date AT TIME ZONE 'America/Montevideo')::date = DATE '2026-07-22' THEN 0 ELSE 1 END,
    created_at DESC
  LIMIT 1;

  IF target_id IS NULL THEN
    INSERT INTO public.class_sessions (
      title, module_number, class_date, end_date, location, max_capacity,
      registration_limit, is_active, is_featured, notes
    ) VALUES (
      'Primer encuentro de Foro Agora', 1,
      '2026-07-22 18:00:00-03', '2026-07-22 20:00:00-03',
      'Sala audiovisual de Casa INJU', 80, 90, true, true,
      'El primer encuentro presencial de Foro Agora, con el apoyo de INJU. Una introducción clara y participativa al análisis de empresas y la educación financiera.'
    ) RETURNING id INTO target_id;
  END IF;

  UPDATE public.class_sessions
  SET title = 'Primer encuentro de Foro Agora',
      module_number = 1,
      class_date = '2026-07-22 18:00:00-03',
      end_date = '2026-07-22 20:00:00-03',
      location = 'Sala audiovisual de Casa INJU',
      max_capacity = 80,
      registration_limit = 90,
      is_active = true,
      is_featured = true,
      notes = 'El primer encuentro presencial de Foro Agora, con el apoyo de INJU. Una introducción clara y participativa al análisis de empresas y la educación financiera.'
  WHERE id = target_id;

  UPDATE public.class_sessions
  SET is_active = false, is_featured = false
  WHERE id <> target_id AND is_active = true;
END;
$$;

UPDATE public.events SET is_active = false WHERE is_active = true;

UPDATE public.community_posts
SET is_published = false
WHERE title ILIKE 'Próxima clase:%';

DO $$
DECLARE
  featured_session public.class_sessions%ROWTYPE;
  active_session_count integer;
BEGIN
  SELECT * INTO featured_session
  FROM public.class_sessions
  WHERE is_featured = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No quedó configurado el encuentro destacado.';
  END IF;

  IF featured_session.title <> 'Primer encuentro de Foro Agora'
     OR featured_session.class_date <> '2026-07-22 18:00:00-03'::timestamptz
     OR featured_session.end_date <> '2026-07-22 20:00:00-03'::timestamptz
     OR featured_session.location <> 'Sala audiovisual de Casa INJU'
     OR featured_session.max_capacity <> 80
     OR featured_session.registration_limit <> 90
     OR NOT featured_session.is_active THEN
    RAISE EXCEPTION 'La configuración canónica del encuentro del 22 de julio no coincide.';
  END IF;

  SELECT count(*) INTO active_session_count
  FROM public.class_sessions
  WHERE is_active = true;

  IF active_session_count <> 1 THEN
    RAISE EXCEPTION 'Debe existir exactamente un encuentro activo; se encontraron %.', active_session_count;
  END IF;

  IF EXISTS (SELECT 1 FROM public.events WHERE is_active = true) THEN
    RAISE EXCEPTION 'Todavía existen eventos placeholder activos.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'class_registrations'
      AND policyname = 'Users can register for classes'
  ) OR NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'class_registrations'
      AND policyname = 'Users can view own class registrations'
  ) THEN
    RAISE EXCEPTION 'No quedaron configuradas las políticas seguras de inscripción.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'enforce_class_registration_limit_trigger'
      AND NOT tgisinternal
  ) THEN
    RAISE EXCEPTION 'No quedó configurado el límite transaccional de inscripciones.';
  END IF;
END;
$$;

SELECT
  id,
  title,
  class_date,
  end_date,
  location,
  max_capacity,
  registration_limit,
  is_active,
  is_featured,
  (SELECT count(*) FROM public.class_registrations WHERE class_id = class_sessions.id) AS registrations
FROM public.class_sessions
WHERE is_featured = true;
