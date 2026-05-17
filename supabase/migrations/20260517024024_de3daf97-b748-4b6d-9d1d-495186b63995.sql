INSERT INTO public.newsletter_subscribers (email, source, is_active) VALUES ('ignacioramosgu@gmail.com', 'manual-admin', true) ON CONFLICT DO NOTHING;

UPDATE public.profiles
SET age = 18,
    age_range = COALESCE(age_range, '15 a 18'),
    accepted_terms = true,
    onboarding_completed = true,
    department = COALESCE(department, 'Montevideo'),
    institution = COALESCE(institution, 'fing'),
    how_found_us = COALESCE(how_found_us, 'Otro'),
    full_name = COALESCE(full_name, 'Juan Ignacio Ramos'),
    display_name = COALESCE(display_name, 'Juan Ignacio'),
    interests = COALESCE(interests, ARRAY['Aprender a invertir','Entender la economía','Conocer gente con mis mismos intereses','Certificar mis conocimientos'])
WHERE email = 'ignacioramosgu@gmail.com';