CREATE TABLE IF NOT EXISTS public.brokers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('local', 'internacional')),
  min_deposit TEXT NOT NULL,
  commission TEXT NOT NULL,
  regulator TEXT NOT NULL,
  notes TEXT,
  website_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.brokers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "brokers public read" ON public.brokers;
CREATE POLICY "brokers public read"
ON public.brokers FOR SELECT
TO anon, authenticated
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "brokers admin write" ON public.brokers;
CREATE POLICY "brokers admin write"
ON public.brokers FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_brokers_active_sort ON public.brokers(is_active, sort_order);

DROP TRIGGER IF EXISTS update_brokers_updated_at ON public.brokers;
CREATE TRIGGER update_brokers_updated_at
BEFORE UPDATE ON public.brokers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.brokers (name, type, min_deposit, commission, regulator, notes, website_url, sort_order, is_active)
SELECT *
FROM (
  VALUES
    ('Sura Inversiones', 'local', 'USD 1.000', '0.5% + IVA', 'BCU', 'Broker uruguayo con presencia regional', null, 10, true),
    ('Gastón Bengochea', 'local', 'USD 5.000', 'Variable', 'BCU', 'Casa de bolsa tradicional en Uruguay', null, 20, true),
    ('Interactive Brokers', 'internacional', 'USD 0', 'Desde USD 1 por orden', 'SEC / FINRA', 'Acceso a mercados globales; verificar requisitos para residentes UY', 'https://www.interactivebrokers.com', 30, true),
    ('Charles Schwab', 'internacional', 'USD 25.000', 'USD 0 acciones US', 'SEC / FINRA', 'Cuenta internacional; confirmar elegibilidad por residencia', 'https://www.schwab.com', 40, true),
    ('TD Ameritrade', 'internacional', 'USD 0', 'USD 0 acciones US', 'SEC / FINRA', 'Plataforma con foco en herramientas de análisis', null, 50, false)
) AS seed(name, type, min_deposit, commission, regulator, notes, website_url, sort_order, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM public.brokers existing WHERE existing.name = seed.name
);
