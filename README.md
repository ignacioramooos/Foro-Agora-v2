# Foro Agora v2

Plataforma web educativa para acercar la educación financiera a jóvenes de Uruguay, con foco en análisis fundamental, comunidad y práctica guiada.

## Tabla de contenidos

- [El corazón del proyecto: ¿qué es Foro Agora?](#el-corazón-del-proyecto-qué-es-foro-agora)
- [Qué incluye este proyecto](#qué-incluye-este-proyecto)
- [Arquitectura funcional](#arquitectura-funcional)
- [Detalles técnicos](#detalles-técnicos)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Configuración local](#configuración-local)
- [Scripts disponibles](#scripts-disponibles)
- [Estado de calidad actual](#estado-de-calidad-actual)
- [Documentación complementaria](#documentación-complementaria)

---

## El corazón del proyecto: ¿qué es Foro Agora?

Foro Agora es una iniciativa educativa creada por jóvenes, para jóvenes, que busca resolver un problema concreto: la falta de educación financiera práctica y accesible en etapas tempranas de formación.

No es una plataforma para “tips de trading”, señales de compra/venta ni promesas de dinero rápido. El enfoque es pedagógico y formativo:

- **Aprender a pensar financieramente con criterio propio**.
- **Entender empresas, mercados y decisiones de inversión desde análisis fundamental**.
- **Construir hábitos de largo plazo** (investigación, lectura, evaluación de riesgo, disciplina).
- **Democratizar acceso** a conocimiento que suele estar limitado por costo, contexto o lenguaje técnico.

### Propósito educativo

Foro Agora combina clases, recursos y herramientas digitales para acompañar un proceso completo:

1. **Interés inicial** (sitio público, misión, programa, registro).
2. **Ingreso** (autenticación y onboarding).
3. **Aprendizaje estructurado** (contenido, roadmap y recursos).
4. **Práctica aplicada** (simulador de portafolio, tesis, eventos, comunidad).
5. **Continuidad** (seguimiento de avance y participación).

### Valores que atraviesan el producto

El producto está construido alrededor de principios visibles tanto en el discurso como en la experiencia:

- Acceso universal al conocimiento financiero.
- Rigor intelectual en conceptos y metodología.
- Comunidad como espacio de aprendizaje compartido.
- Impacto local (Uruguay) con potencial de escala.

En resumen: **Foro Agora es una propuesta de transformación educativa**, no una app de especulación.

---

## Qué incluye este proyecto

### 1) Sitio público (marketing + captación)

Rutas principales: `/`, `/nosotros`, `/programa`, `/registro`, `/contacto`, `/recursos`, `/glosario`, `/partners`, `/brokers`, `/ranking`, `/impacto`, `/privacidad`, `/terminos`.

Incluye:

- Narrativa de misión, historia y propuesta.
- Programa formativo y perfil de estudiantes.
- Formularios públicos persistidos en base de datos (registro y contacto).
- Contador de estudiantes en vivo.
- CTA de WhatsApp y newsletter.
- Ranking público del simulador.

### 2) Autenticación y onboarding

- Login/registro por email y contraseña (Supabase Auth).
- Flujo de onboarding de perfil.
- Gestión de sesión persistente.

### 3) Dashboard del estudiante (`/dashboard`)

Módulos:

- **Inicio**: resumen y próximos eventos.
- **Clases / Contenido**: biblioteca de videos, artículos y materiales.
- **Mi Portafolio**: simulador persistente de inversiones (solo educativo).
- **Mi Progreso**: roadmap de aprendizaje.
- **Herramientas**: calculadoras y utilidades.
- **Comunidad**: feed de publicaciones.
- **Mis Tesis**: creación de borradores/casos.
- **Eventos**: registro y gestión de participación.
- **Configuración**: datos de cuenta y sesión.

### 4) Panel admin (`/admin`)

- Acceso por rol (`user_roles`).
- Gestión CRUD de contenido publicado para estudiantes.

### 5) Backend y datos

- Supabase Postgres + RLS.
- Funciones Edge para cotizaciones e histórico de activos.
- Migraciones SQL versionadas en `supabase/migrations`.

---

## Arquitectura funcional

- **Frontend SPA** en React + TypeScript.
- **Router** basado en hash (`HashRouter`) para despliegue estático simple.
- **Estado global** con providers (tema, auth, react-query, UI providers).
- **Persistencia** en Supabase (Auth + DB + políticas RLS).
- **Datos de mercado** vía Supabase Edge Functions (`stock-price`, `stock-history`) usando Yahoo Finance como fuente.

Flujo general:

1. Usuario navega páginas públicas.
2. Se registra/inicia sesión.
3. Completa onboarding.
4. Accede al dashboard con datos personalizados y persistidos.
5. Interactúa con contenido, comunidad, eventos y simulador.

---

## Detalles técnicos

### Stack principal

- **Frontend**: React 18, TypeScript, Vite 5.
- **UI**: Tailwind CSS, shadcn/ui, Radix UI, Framer Motion.
- **Navegación**: React Router.
- **Estado de datos**: TanStack Query.
- **Backend**: Supabase (Auth, Postgres, RLS, Edge Functions).
- **Testing**: Vitest + Testing Library + jsdom.
- **Linting**: ESLint.

### Variables de entorno usadas

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

### Seguridad y control de acceso

- Autenticación de usuarios con Supabase Auth.
- Control de privilegios por rol para administración.
- Políticas RLS en tablas clave para lecturas/escrituras autorizadas.
- Flujo PKCE habilitado en cliente de Supabase.

### Base de datos (alto nivel)

Tablas funcionales usadas por producto (entre otras):

- `profiles`, `user_roles`
- `content_items`
- `events`, `event_registrations`
- `portfolios`, `portfolio_holdings`, `portfolio_transactions`
- `community_posts`
- `case_studies`
- `class_registrations`, `contact_messages`
- `newsletter_subscribers`
- `landing_page_widgets`, `user_preferences`, `class_sessions`

### Edge Functions

- `stock-price`: recibe tickers y devuelve precio/cambio normalizado.
- `stock-history`: devuelve serie histórica por ticker y rango.

### Build y despliegue

- Build con Vite.
- Post-build con `scripts/materialize-spa-routes.mjs` para materializar rutas SPA en `dist/*/index.html` + `dist/404.html`.
- Diseño compatible con hosting estático.

---

## Estructura del repositorio

```text
Foro-Agora-v2/
├─ src/
│  ├─ components/
│  │  ├─ dashboard/
│  │  └─ ui/
│  ├─ contexts/
│  ├─ hooks/
│  ├─ integrations/supabase/
│  ├─ lib/
│  ├─ pages/
│  └─ test/
├─ public/
├─ scripts/
├─ supabase/
│  ├─ functions/
│  └─ migrations/
└─ README.md
```

---

## Configuración local

### Requisitos

- Node.js 20+
- npm 10+

### Pasos

```bash
npm ci
```

Crear `.env` con:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...
```

Ejecutar en desarrollo:

```bash
npm run dev
```

---

## Scripts disponibles

- `npm run dev`: servidor local.
- `npm run build`: build de producción + materialización de rutas.
- `npm run build:dev`: build en modo development + materialización de rutas.
- `npm run preview`: vista previa del build.
- `npm run lint`: análisis estático ESLint.
- `npm run test`: ejecución de tests (Vitest).
- `npm run test:watch`: tests en modo watch.

---

## Estado de calidad actual

Ejecutado en este entorno antes de actualizar esta documentación:

- `npm run lint` **falla actualmente** por errores preexistentes en TypeScript ESLint (`no-explicit-any`) en `src/hooks/useProfile.ts` y `src/test/lesson-completion.test.ts`.
- También hay warnings de React Refresh y dependencias de hooks en varios archivos.

Como este cambio es exclusivamente documental, no se modificó código de aplicación.

---

## Documentación complementaria

El repositorio incluye documentación adicional en archivos dedicados, por ejemplo:

- `PROJECT_OVERVIEW.md`
- `EXECUTIVE_SUMMARY.md`
- `TECHNICAL_VALIDATION.md`
- reportes específicos de testing, persistencia, temas y dashboard

Estas piezas amplían detalles históricos y de validación por entregable.
