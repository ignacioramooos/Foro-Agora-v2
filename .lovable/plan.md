## Diagnóstico

Ejecuté el linter y consulté el estado real de la DB. El backend está en mal estado:

**Problemas críticos**
1. **18 de 20 tablas en `public` tienen RLS desactivado.** Cualquiera con la anon key (la que está en el frontend, pública) puede leer/insertar/modificar/borrar todo: emails, teléfonos, mensajes de contacto, suscriptores, registros, etc. Esto es una fuga de datos personales seria.
2. **`profiles` tiene RLS activado pero las policies fueron borradas en algún momento** → el frontend con anon key no puede leer profiles (queries devuelven vacío silenciosamente). Solo funcionan las llamadas que usan service role.
3. **`auth.users` (1 usuario real) y `public.profiles` (5 filas) están desincronizadas.** Las 5 filas en profiles son huérfanas (no apuntan a ningún `auth.users.id`). Por eso parecía que había "usuarios" que no podían recibir magic links: no eran usuarios reales de Supabase Auth, eran solo filas en una tabla.
4. **Magic link / reset password apuntan a `localhost:3000`** porque la "Site URL" en Supabase Auth está en el default de desarrollo, no en la URL publicada.
5. Funciones DB sin `search_path` fijo (warning de seguridad).
6. La trigger `handle_new_user` existe pero las 5 filas viejas indican que en algún punto se insertaron profiles a mano sin pasar por Auth.

## Lo que voy a hacer

### Paso 1: Migración SQL grande para asegurar todo
Una sola migración que:

- **Activa RLS en todas las tablas de `public`** que la tienen apagada.
- **Reescribe las policies de `profiles`**: cada usuario ve/edita/inserta solo su propio perfil. Lectura pública limitada a campos no-PII vía vista (display_name + avatar) si hace falta para el contador en vivo y rankings; el resto queda privado.
- **Crea policies sensatas para cada tabla pública** según su uso real:
  - `cohorts`, `events`, `partners`, `lessons`, `content_items` (publicados), `community_posts` (publicados), `case_studies` (publicados), `class_sessions` (activas) → lectura pública (anon + authenticated). Escritura solo admin.
  - `contact_messages`, `class_registrations`, `partner_inquiries`, `newsletter_subscribers` → INSERT abierto al público (formularios), SELECT/UPDATE/DELETE solo admin. Sin lectura pública (PII).
  - `portfolios`, `portfolio_transactions`, `lesson_progress`, `event_registrations`, `certificates` → solo el dueño (`user_id = auth.uid()`), con admin override.
  - `user_roles` → SELECT propio + admin; escritura solo admin.
- **Reagrega la FK** `profiles.user_id → auth.users(id) ON DELETE CASCADE` si falta, y limpia los 5 profiles huérfanos (los datos no son recuperables como usuarios reales: no existen en `auth.users` y no pueden iniciar sesión). Te confirmo cuáles son antes de borrar si querés conservarlos en otra tabla histórica.
- **Crea profile faltante** para tu usuario real `ignacioramosgu@gmail.com`.
- **Asegura que la trigger `handle_new_user`** está activa para que cada signup nuevo tenga su profile automáticamente.
- **Fija `search_path` en `update_updated_at_column`** y demás funciones para cerrar el warning del linter.

### Paso 2: Arreglar redirects de email en el código del frontend
- Centralizar un helper `getAuthRedirectUrl()` que use `window.location.origin` en runtime (no localhost).
- Auditar todos los `signUp`, `signInWithOAuth`, `resetPasswordForEmail`, `signInWithOtp` para usar siempre la origin actual.
- Que `/auth` maneje correctamente los hashes `type=magiclink`, `type=signup`, `type=recovery` que vienen en la URL.

### Paso 3: Configuración de Supabase Auth (manual, fuera del código)
Lo único que **no puedo cambiar yo** es la "Site URL" y los "Redirect URLs" del dashboard de Supabase Auth — esa configuración global vive en el panel y es la que hace que el email diga `localhost:3000`. Te dejo el link directo y los valores exactos a pegar:
- **Site URL:** `https://foroagora2.lovable.app`
- **Redirect URLs (additional):** `https://foroagora2.lovable.app/**`, `https://id-preview--be0504e7-ecdf-4ce1-81ee-13479a36de7e.lovable.app/**`, `http://localhost:5173/**`

Sin ese cambio, los emails seguirán saliendo con dominio incorrecto aunque el frontend pida bien el `redirectTo`.

### Paso 4: Verificar
- Re-correr el linter de Supabase (objetivo: 0 ERRORs, warnings solo informativos).
- Confirmar que el frontend autenticado puede leer/escribir su profile.
- Confirmar que las queries públicas (cohorts, events, lessons, partners, contador en vivo) siguen funcionando con anon key.
- Probar el flujo de "reset password" pidiendo el link y verificando que redirige a `foroagora2.lovable.app`.

## Sección técnica

```text
auth.users  (Supabase managed, fuente de verdad)
   │ 1:1
   ▼
public.profiles  (metadata extra: full_name, department, etc.)
   - user_id FK → auth.users(id) ON DELETE CASCADE
   - RLS: SELECT propio + admin; UPDATE/INSERT propio
   - Vista public.profiles_public (display_name, avatar) para counters/rankings
```

- Roles vía `public.user_roles` + función `has_role()` ya existente (la mantengo, solo le agrego policies).
- Profiles huérfanos: te muestro la lista antes de borrarlos. Por defecto los borro porque no son usuarios reales y conservarlos solo confunde el conteo.
- No toco `auth.*`, `storage.*`, `realtime.*` (esquemas reservados).

## Lo que NO se rompe
- El código del frontend sigue importando `@/integrations/supabase/client` igual.
- Los flujos de signup/login con email y Google siguen funcionando.
- El contador en vivo y rankings siguen mostrando datos (vía vista pública sin PII).
- Los datos reales de tu usuario (`ignacioramosgu@gmail.com`) se conservan.