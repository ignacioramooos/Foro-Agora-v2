# Implementación Inmediata Agora (Fuente: `docs/Foro Agora.md`)

## 1) Matriz de trazabilidad: Foro Agora -> funcionalidades reales

| Objetivo central | Implementación actual | Estado |
|---|---|---|
| Clases presenciales gratuitas con registro previo | `class_sessions`, `class_registrations`, páginas `/registro`, `/` (próxima clase), panel `/admin` | Operativo |
| Sitio web con recursos y clases grabadas | `content_items`, `ContentLibrary`, páginas `/recursos`, dashboard `Clases` | Operativo (fuente unificada) |
| Comunidad activa para jóvenes | `community_posts`, dashboard `Comunidad` | Operativo |
| Enfoque en análisis fundamental (no trading) | Copy en landing, programa y dashboard | Operativo |
| Eventos y charlas con inscripción | `events`, `event_registrations`, dashboard `Eventos` | Operativo (cupo en tiempo real) |
| Proyecto sin fines de lucro, accesible y educativo | Narrativa pública (`/`, `/nosotros`, `/programa`) | Operativo |
| Alianzas institucionales | `partners`, `partner_inquiries`, página `/partners` | Operativo |
| Escalabilidad educativa | Admin CMS + tablas de contenido/clases/eventos | Parcial (falta mayor observabilidad operativa) |

## 2) Lista cerrada de gaps P0

| Gap P0 | Impacto | Dueño sugerido | Criterio de aceptación |
|---|---|---|---|
| Recursos públicos desalineados con dashboard | Alto (inconsistencia de producto) | Frontend + Contenido | `/recursos` y dashboard muestran exactamente los mismos ítems publicados de `content_items` |
| Directorio de brokers en mock local | Alto (credibilidad) | Full-stack | Brokers leídos desde BD (`brokers`) con RLS y semilla inicial |
| Flujo de eventos con cupos no consistentes | Alto (operación y UX) | Full-stack | Cupos calculados por registros reales; bloqueo al quedar sin cupos; UI sincronizada |
| UX simulada en tesis (adjuntos “simulados”) | Medio-Alto (credibilidad) | Frontend | Flujo sin pasos simulados; guardado real de tesis sin mensajes ficticios |
| Claims públicos no verificables | Medio-Alto (confianza) | Producto + Contenido | Copys críticos sin estadísticas no trazables ni promesas ambiguas |

## 3) Plan por oleadas + validación funcional

### Oleada 1 (P0) — Alineación funcional y verdad de negocio
- Unificar fuente de contenido público/dashboard.
- Sustituir brokers mock por tabla real + RLS + semilla.
- Corregir cupos de eventos a partir de `event_registrations`.
- Eliminar UX simulada en tesis.
- Ajustar claims críticos en landing.

**Validación de cierre (obligatoria):**
- `npm run lint`
- `npm run build`
- `npm run test`
- Smoke manual:
  - `/recursos` vs dashboard `Clases` (mismos ítems)
  - `/brokers` carga desde BD
  - registro a evento incrementa cupos y bloquea al llenarse

### Oleada 2 (P1) — UX/UI profesional
- Homogeneizar microcopy y estados vacíos/error/loading.
- Mejorar consistencia visual público/dashboard.
- Pulir experiencia móvil en onboarding, formularios y dashboard.

**Validación de cierre:**
- Checklists de UX móvil + accesibilidad básica.
- Pruebas manuales de rutas críticas end-to-end.

### Oleada 3 (P1/P2) — Hardening técnico y escalabilidad
- Reducir warnings y deuda de lint.
- Subir cobertura de tests en flujos críticos.
- Mejorar observabilidad operativa en admin (registros, mensajes, métricas).

**Validación de cierre:**
- Quality gates estables en CI (lint/build/test).
- Reporte de cobertura en módulos críticos.
