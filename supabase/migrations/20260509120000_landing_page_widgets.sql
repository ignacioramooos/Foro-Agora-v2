-- Store each user's selected tickers for the landing page carousel.

CREATE TABLE public.landing_page_widgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tickers text[] NOT NULL DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT landing_page_widgets_user_id_unique UNIQUE(user_id)
);

ALTER TABLE public.landing_page_widgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own landing page widget" ON public.landing_page_widgets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own landing page widget" ON public.landing_page_widgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own landing page widget" ON public.landing_page_widgets
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_landing_page_widgets_timestamp()
RETURNS trigger AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$ LANGUAGE plpgsql;

CREATE TRIGGER landing_page_widgets_updated_at_trigger
  BEFORE UPDATE ON public.landing_page_widgets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_landing_page_widgets_timestamp();

CREATE INDEX idx_landing_page_widgets_user_id ON public.landing_page_widgets(user_id);
