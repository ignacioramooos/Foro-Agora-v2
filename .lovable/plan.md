## Objetivo

Hacer un refactor responsive completo del sitio público y dashboard, con foco principal en **375–1024px** (mobile + tablet), sin tocar la lógica de negocio. Audito cada vista, arreglo lo roto y normalizo tipografía, espaciado y navegación para que se sienta nativa en mobile, no apretada.

## Diagnóstico inicial

Patrones repetidos que hay que normalizar:

- **Hero titles** muy grandes en mobile (`text-5xl`, `text-6xl`, `text-7xl`, `text-8xl` sin escalado) en `Index.tsx`, `ImpactPage`, `NotFound`. Generan overflow y line-breaks feos en 375px.
- **Padding horizontal inconsistente**. Algunas secciones usan `container`, otras `px-6`, otras nada → el contenido no respira igual.
- **Grids `md:grid-cols-N`** con valores chicos en mobile pero gaps grandes (`gap-12`, `gap-16`) que dejan demasiado vertical scroll.
- **Tablas / listas wide** (Brokers, Admin, Ranking, Portfolio) con scroll horizontal mal aprovechado o sin él.
- **Dashboard**: bottom nav fixed pisa contenido en algunas vistas largas; el sidebar mobile no usa la ruta segura del notch (`safe-area-inset`).
- **Formularios** (Auth, Register, Contact) con inputs `h-12` pero sin `font-size: 16px` en mobile → iOS hace zoom al focus.
- **Navbar**: el logo "Foro / Agora" se oculta < `sm` (640px), correcto, pero el icono `h-14 w-11` ocupa demasiado y compite con el botón menu.
- **WhatsApp button** posición fija puede tapar CTAs en mobile.
- **Footer** `md:grid-cols-3` con `gap-12` se ve apilado y muy espaciado en mobile.

## Plan de trabajo

### 1. Fundamentos globales (`src/styles.css`, `src/index.css`)
- Asegurar `html { -webkit-text-size-adjust: 100%; }` y `body { overflow-x: hidden; }` para evitar scroll horizontal accidental.
- Inputs/textarea/select con `font-size: 16px` en mobile (evita auto-zoom de iOS).
- Definir tokens de tipografía fluida con `clamp()` para títulos hero (`--font-hero`, `--font-h1`, `--font-h2`) y aplicarlos donde corresponda.
- Agregar utilities para `padding-bottom: env(safe-area-inset-bottom)` en bottom nav del dashboard.

### 2. Navbar (`src/components/Navbar.tsx`)
- Reducir el logo en mobile (`h-10 w-8` < sm; `h-14 w-11` en lg+).
- Asegurar que el menú mobile fullscreen scrollee si hay muchos items (overflow + max-height).
- Mejorar contraste y tap targets (mín. 44px).

### 3. Footer (`src/components/Footer.tsx`)
- En mobile: 1 columna con `gap-8` (no 12). Typography más chica.
- Centrar / alinear consistentemente.

### 4. Index / Landing (`src/pages/Index.tsx`) — el más pesado
- Escalar todos los hero titles con `clamp` o cadenas `text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.6rem]`.
- Stats grandes (`text-7xl md:text-8xl 80%`) bajar a `text-5xl sm:text-6xl md:text-7xl`.
- Grids `md:grid-cols-3` agregar breakpoint `sm:grid-cols-2` cuando haga sentido.
- Sección "Próxima clase" `md:grid-cols-2`: confirmar que en mobile la imagen no sea gigante.
- CTA grande final: ancho 100% en mobile.
- Padding vertical entre secciones reducirlo en mobile (`py-12 md:py-20`).

### 5. Páginas públicas (auditar y arreglar caso por caso)
- **AboutPage**: stats `grid-cols-2 md:grid-cols-4`, gap-12 → `gap-6 md:gap-12`. Bajar `text-4xl md:text-5xl` de números a `text-3xl sm:text-4xl md:text-5xl`.
- **ProgramPage**: hero `text-3xl md:text-5xl` ok; revisar bullets y curriculum cards.
- **ImpactPage**: hero `text-4xl md:text-6xl` → `text-3xl sm:text-4xl md:text-6xl`. Stats grid revisar.
- **PartnersPage**: hero + grids partners (logos no deben deformarse).
- **ResourcesPage**, **GlossaryPage**, **BrokersPage**: tablas → `overflow-x-auto` con scroll-shadow o convertir a cards en mobile.
- **ContactPage**: `md:grid-cols-5` con info-card sticky → en mobile la card va arriba o abajo, sin sticky.
- **RegisterPage**: `md:grid-cols-5 gap-16` → en mobile gap-8 y info-card no sticky.
- **AuthPage**: max-w ya está bien; revisar paddings `pt-24` cuando navbar mobile cambia altura.
- **PrivacyPage**, **TermsPage**: tipografía body, line-height legible. Asegurar `prose`-like spacing.
- **RankingPage**: `hidden md:grid grid-cols-3` → ofrecer versión card-stack en mobile.
- **NotFound**: `text-5xl md:text-6xl` ok pero centrar.

### 6. Dashboard (`src/components/dashboard/*`)
- **DashboardLayout**: bottom nav con `pb-[env(safe-area-inset-bottom)]`. Sidebar mobile fullscreen ya está bien, agregar scroll si overflow.
- **DashboardHome**: stats grids `grid-cols-1 sm:grid-cols-3` ok pero verificar paddings `p-6 md:p-10`.
- **PortfolioTab**: grids 2/4 cols en mobile pueden quedar apretados; tablas de holdings necesitan `overflow-x-auto` con sticky first column o card view.
- **ContentLibrary**: cards grid ya tiene `sm:grid-cols-2 lg:grid-cols-3`, ok.
- **EventsSection**, **CommunityFeed**, **Toolkit**, **ThesisBuilder**, **LearningRoadmap**: revisar paddings y CTA width.
- **AdminPage**: tablas wide → `overflow-x-auto` + min-width. En mobile hacer collapsible row.
- **DashboardSettings**: ya simple, sólo ajustar paddings.

### 7. Componentes UI compartidos
- **WhatsAppButton**: subir un poco en mobile para no chocar con bottom-nav del dashboard.
- **NewsletterSignup**: form inline en desktop, stack en mobile.
- **CohortCountdown**, **CapacityBar**, **LiveStudentCounter**: revisar tamaños de números.

### 8. QA de cada cambio
- Probar en 3 viewports: 375, 414, 768, 1024 con browser tool.
- Screenshots por página antes/después de las páginas más importantes (Landing, Auth, Register, Dashboard Home, Portfolio).
- Verificar que no haya scroll horizontal en ninguna ruta (`document.body.scrollWidth === window.innerWidth`).
- Verificar tap targets mínimos 44x44 en CTAs y botones de nav.

## Estrategia

Hacer una pasada por capa, en este orden, commiteando cambios visibles cada vez:

1. **Globals + Navbar + Footer** (afectan todo)
2. **Landing (Index.tsx)** — la página más vista
3. **Auth + Register + Contact** — flujos de conversión
4. **Resto de páginas públicas** (About, Programa, Impacto, Partners, Resources, Glossary, Brokers, Privacy, Terms, Ranking, NotFound)
5. **Dashboard layout + bottom nav**
6. **Dashboard sub-vistas** (Home, Portfolio, Content, Events, Community, Toolkit, Thesis, Roadmap, Settings)
7. **Admin**
8. **QA final** con screenshots a 375 y 768.

## Lo que NO voy a tocar

- Lógica de negocio, queries Supabase, auth.
- Diseño desktop existente (sólo refino donde el responsive lo requiera).
- Colores / tokens del design system.
- Estructura de rutas o navegación.

## Resultado esperado

- Cero overflow horizontal en cualquier ruta entre 375 y 1024px.
- Tipografía hero escala de manera proporcional.
- Tablas wide tienen scroll horizontal explícito o card view.
- Forms no hacen zoom en iOS.
- Dashboard bottom nav respeta safe-area.
- Tap targets cumplen 44px mínimo.
