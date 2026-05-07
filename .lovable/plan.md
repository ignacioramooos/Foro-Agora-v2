## Cambio

En la landing (`src/pages/Index.tsx`, hero principal ~línea 330), el botón amarillo "Inscribite ahora" cambiará según el estado de sesión:

- **Sin sesión iniciada** (estado actual): "Inscribite ahora" → `/registro`
- **Con sesión iniciada**: "Ir al dashboard" → `/dashboard`

## Implementación

1. Importar `useAuth` desde `@/contexts/AuthContext` en `Index.tsx`.
2. Leer `isLoggedIn` dentro del componente.
3. Renderizar el `<Button>` con `to` y label condicionales según `isLoggedIn`.

No se tocan otros botones ni el resto de la página.
