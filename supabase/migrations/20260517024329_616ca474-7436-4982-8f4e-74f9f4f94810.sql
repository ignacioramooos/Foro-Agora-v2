INSERT INTO public.newsletter_subscribers (email, source, is_active) VALUES ('nicosalesrodriguez@gmail.com', 'manual-admin', true) ON CONFLICT DO NOTHING;

UPDATE public.profiles
SET age = 17,
    age_range = COALESCE(age_range, '15 a 18'),
    accepted_terms = true,
    onboarding_completed = true,
    department = COALESCE(department, 'Flores'),
    institution = COALESCE(institution, 'Seminario'),
    how_found_us = COALESCE(how_found_us, 'Amigo / Boca a boca'),
    full_name = COALESCE(full_name, 'Nicolás Sales Rodríguez'),
    display_name = COALESCE(display_name, 'Nico Sales'),
    interests = CASE WHEN interests IS NULL OR array_length(interests,1) < 2
                     THEN ARRAY['Aprender a invertir','Entender la economía','Conocer gente con mis mismos intereses']
                     ELSE interests END
WHERE email = 'nicosalesrodriguez@gmail.com';