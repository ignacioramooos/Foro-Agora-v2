# Handoff de crecimiento - 2026-06-01

Resumen operativo para retomar Foro Agora despues del trabajo nocturno.

## Estado general

Durante la noche se dejaron listas piezas publicas, operativas y de conversion para empujar tres frentes:

- Instituciones educativas y organizaciones.
- Embajadores y difusion organica.
- Prensa, aliados y presentaciones institucionales.

No se enviaron mensajes desde cuentas personales. Se publico previamente solo desde la pagina de empresa de LinkedIn de Foro Agora, verificada como superficie administrada de Foro Agora. Instagram no se uso porque la sesion activa era personal y el handle `@foroagora` visible no correspondia al proyecto.

## Commits subidos a `main`

| Commit | Cambio |
| --- | --- |
| `3d344c9` | Funnel de embajadores: pagina publica, formulario, docs y migracion Supabase. |
| `e65c7ae` | Pagina publica `/instituciones`. |
| `591fd27` | Prefill del formulario institucional desde `/instituciones`. |
| `b34edc4` | Propuesta institucional imprimible `/propuesta-instituciones`. |
| `ccd2f9a` | Kit de outreach institucional y tracker CSV. |
| `a88db82` | SEO por rutas, sitemap y metadata social. |
| `605c9cb` | FAQ y pasos de coordinacion en paginas institucionales. |
| `f5618cd` | Kit publico de difusion `/difundir`. |
| `e62e7dc` | Media kit publico `/prensa`. |

## Links publicos listos para usar

- Sitio: https://foroagora.org
- Registro: https://foroagora.org/registro
- Instituciones: https://foroagora.org/instituciones
- Propuesta institucional: https://foroagora.org/propuesta-instituciones
- Formulario institucional prellenado: https://foroagora.org/partners?source=instituciones
- Embajadores: https://foroagora.org/embajadores
- Kit de difusion: https://foroagora.org/difundir
- Prensa / media kit: https://foroagora.org/prensa

## Documentos operativos

- `docs/outreach-pipeline.md`: pipeline general, estado y mensaje recomendado.
- `docs/outreach-institution-kit.md`: mensajes listos para email, LinkedIn y follow-ups.
- `docs/outreach-tracker.csv`: 10 contactos priorizados, con canal y proxima accion.
- `docs/morning-growth-handoff-2026-06-01.md`: este documento.

## Primer bloque recomendado: 45 minutos

1. Verificar que el email activo sea una cuenta de Foro Agora.
2. Enviar 5 contactos del tracker:
   - Escuela Integral Bachillerato.
   - Colegio San Ignacio.
   - Colegio Ingles.
   - HCA Secundaria.
   - Colegio Santo Domingo.
3. Usar el mensaje de `docs/outreach-institution-kit.md`, version "Email principal para instituciones educativas".
4. Registrar en `docs/outreach-tracker.csv`:
   - `status=sent`
   - `last_contact_date=2026-06-01`
   - `next_follow_up_date=2026-06-06`
   - nota breve con el canal usado.

## Segundo bloque recomendado: 30 minutos

Desde LinkedIn company page de Foro Agora, no desde perfil personal:

```text
Creamos una propuesta institucional para que liceos, colegios, universidades y organizaciones puedan evaluar una charla gratuita de educacion financiera para jovenes.

El enfoque es educativo: finanzas personales, inversion responsable y pensamiento critico. Sin trading, sin senales y sin promesas de retorno.

Propuesta: https://foroagora.org/propuesta-instituciones
Kit para compartir: https://foroagora.org/difundir
```

Antes de publicar, verificar que el actor sea la pagina de empresa Foro Agora.

## Tercer bloque recomendado: 20 minutos

Revisar la migracion de embajadores:

- Archivo: `supabase/migrations/20260601013000_ambassador_applications.sql`
- Pendiente: confirmar si fue aplicada en la base de datos de produccion.
- No asumir que el formulario de `/embajadores` esta persistiendo en produccion hasta verificar Supabase.

## Bloqueado o requiere cuidado

- Instagram: no publicar hasta confirmar acceso a una cuenta oficial de Foro Agora. La sesion vista durante la noche era personal.
- Gmail/email: no enviar desde `ignacioramosgu@gmail.com` ni otra cuenta personal.
- Casa INJU formulario: no completar sin aprobacion y datos no sensibles definidos. El formulario pide cedula, fecha de nacimiento, telefono y datos de integrantes.
- No gastar dinero, no crear suscripciones pagas, no prometer cupos ni fechas sin confirmacion.

## Follow-up operativo

Para cada email enviado:

- Follow-up 1: 4 a 6 dias despues.
- Follow-up 2: 10 a 14 dias despues.
- Si responden derivando a otra persona, actualizar `contact_name`, `contact_role`, `email_or_url` y `notes`.

## Verificacion tecnica acumulada

Las ultimas rondas pasaron:

- `npm run build`
- `npm test` con 24 tests
- `npm run lint` con 0 errores y 11 warnings conocidas
- Verificacion local en navegador para `/instituciones`, `/propuesta-instituciones`, `/difundir` y `/prensa`

## Prioridad de manana

La mejor proxima accion no es crear mas paginas. Es ejecutar el primer lote de outreach desde una cuenta institucional verificada, registrar respuestas y cerrar 1 o 2 reuniones exploratorias.

