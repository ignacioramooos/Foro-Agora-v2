## Problema

1. **Google se saltea el onboarding** — el flujo actual pide email/password primero, después los pasos del perfil. Con Google, el OAuth crea sesión y el `handle_new_user` trigger crea un `profiles` con `onboarding_completed=false` pero los campos (edad, liceo, etc.) quedan vacíos. El código intenta detectar esto después y mostrar los pasos, pero es frágil y la info ya no se reusa al inscribirse a clases.

2. **"No se pudo guardar el perfil"** — en `handleSignupSubmit`, después de `supabase.auth.signUp` se llama `getSession()`. Si en el proyecto Supabase está activada la confirmación de email, **no hay sesión** después del signup → `newUserId` queda `null` → al final `handleFinishOnboarding` no puede hacer el UPDATE de profiles (y aunque tuviera el id, la RLS `Profiles update own` exige `auth.uid() = user_id`, que sin sesión también falla).

3. **RegisterPage no usa el perfil** — el formulario de inscripción a clase pide todo de nuevo aunque el usuario esté logueado y ya tenga su perfil cargado.

## Solución

Invertir el flujo: **primero el onboarding, después la creación de cuenta**. Los datos del perfil viajan dentro de `user_metadata` del signup (email) o en `sessionStorage` (Google), y el trigger `handle_new_user` los escribe directamente en `profiles` con `onboarding_completed=true`. Así no dependemos de tener una sesión para hacer un UPDATE post-signup.

### Cambios

**1. `supabase/migrations/...` — actualizar `handle_new_user`**
Leer todos los campos de onboarding desde `raw_user_meta_data` y persistirlos en `profiles`. Si vienen, marcar `onboarding_completed=true`.
Campos: `full_name`, `display_name`, `age_range`, `department`, `institution`, `how_found_us`, `interests` (jsonb→text[]), `accepted_terms`.

**2. `src/pages/AuthPage.tsx` — reordenar flujo**

Nuevo orden:
```
landing (login | empezar-registro)
  → step-1 (nombre, edad)
  → step-2 (depto, institución, cómo nos conociste)
  → step-3 (intereses, términos)
  → step-final (elegir: continuar con Google | crear con email+contraseña)
  → email-confirmation o redirect /dashboard
```

- Eliminar el branch "isLoggedIn && !onboardingCompleted → mostrar steps" (ya no es necesario para signup nuevo, pero se mantiene como fallback de seguridad por si un usuario Google viejo entra sin perfil).
- En "step-final":
  - **Email**: `supabase.auth.signUp({ email, password, options: { data: { display_name, full_name, age_range, department, institution, how_found_us, interests, accepted_terms } } })`. El trigger arma el perfil completo. Se muestra `email-confirmation`.
  - **Google**: guardar `onboardingData` en `sessionStorage` con clave `pending_onboarding`, luego `signInWithOAuth`. Al volver del OAuth, un `useEffect` en AuthPage detecta sesión + `pending_onboarding` y hace UPDATE de `profiles` (esto sí tiene sesión, así que la RLS pasa), borra el storage y redirige a `/dashboard`.
- Para usuarios Google que ya existieran sin perfil completo, mantener el fallback actual de mostrar los pasos.

**3. `src/pages/RegisterPage.tsx` — prellenar desde perfil**

Si `user` está logueado, hacer un `select` a `profiles` (full_name, age_range, department, institution, etc.) y prellenar los campos. El usuario puede igual editarlos antes de mandar. `age` queda manual (en perfil sólo guardamos `age_range`), o agregamos un campo `age` numérico al perfil — mantengo `age_range` para no cambiar schema más de lo necesario y dejo el input de edad vacío sólo cuando no hay valor previo.

**4. Validación**

- Verificar que después del signup con email, el perfil quede con todos los campos seteados (consulta a `profiles` por `user_id`).
- Probar Google flow: completar pasos → redirigir → volver → ver `/dashboard` con perfil completo.
- Probar inscripción a clase con sesión iniciada: campos prellenados.

### Detalles técnicos

- El cast del array `interests` desde jsonb requiere `(NEW.raw_user_meta_data->'interests')::jsonb` y conversión a `text[]` con `ARRAY(SELECT jsonb_array_elements_text(...))`.
- Mantener `ON CONFLICT (user_id) DO NOTHING` pero cambiarlo a `DO UPDATE SET ...` para sobreescribir si ya existía un perfil vacío (caso de re-signup tras error).
- El `sessionStorage` evita perder los datos al hacer el round-trip OAuth; se borra después de aplicarlos.

### Archivos a tocar
- `supabase/migrations/<nuevo>.sql` (actualizar `handle_new_user`)
- `src/pages/AuthPage.tsx` (reordenar flujo, agregar step-final, manejo de Google con sessionStorage)
- `src/pages/RegisterPage.tsx` (prellenar desde profiles)

### Preguntas antes de implementar
1. ¿Querés que el campo "edad" en la inscripción a clase tome del `age_range` del perfil (ej: "15 a 18" → input vacío y muestra el rango como hint), o preferís agregar un campo `age` numérico al perfil para guardarlo exacto y reusarlo siempre?
2. Para usuarios que ya hayan creado cuenta vía Google sin perfil completo (los actuales): ¿les forzamos a completar onboarding la próxima vez que entren, o los dejamos pasar al dashboard?
