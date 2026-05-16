-- landing_page_widgets: per-user picked tickers
CREATE TABLE public.landing_page_widgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  tickers text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.landing_page_widgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "landing_page_widgets owner all"
  ON public.landing_page_widgets FOR ALL TO authenticated
  USING ((user_id = auth.uid()) OR has_role(auth.uid(),'admin'::app_role))
  WITH CHECK ((user_id = auth.uid()) OR has_role(auth.uid(),'admin'::app_role));
CREATE TRIGGER landing_page_widgets_set_updated_at
  BEFORE UPDATE ON public.landing_page_widgets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- user_preferences: per-user UI prefs
CREATE TABLE public.user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  theme text NOT NULL DEFAULT 'light',
  dashboard_active_tab text NOT NULL DEFAULT 'home',
  locale text NOT NULL DEFAULT 'es-UY',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_preferences owner all"
  ON public.user_preferences FOR ALL TO authenticated
  USING ((user_id = auth.uid()) OR has_role(auth.uid(),'admin'::app_role))
  WITH CHECK ((user_id = auth.uid()) OR has_role(auth.uid(),'admin'::app_role));
CREATE TRIGGER user_preferences_set_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- brokers: public directory
CREATE TABLE public.brokers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('local','internacional')),
  min_deposit text NOT NULL DEFAULT '',
  commission text NOT NULL DEFAULT '',
  regulator text NOT NULL DEFAULT '',
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.brokers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brokers public read"
  ON public.brokers FOR SELECT TO anon, authenticated
  USING (is_active = true);
CREATE POLICY "brokers admin write"
  ON public.brokers FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role));
CREATE TRIGGER brokers_set_updated_at
  BEFORE UPDATE ON public.brokers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();