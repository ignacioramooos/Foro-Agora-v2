## Problema

El contador "X jóvenes ya se anotaron" en la landing muestra "Sé el primero en anotarte" aunque hay 35 perfiles registrados.

## Causa raíz (confirmada)

`LiveStudentCounter` llama a `supabase.rpc("get_public_profiles_count")`. Ejecutar esa función con el rol `anon` ahora devuelve:

```
ERROR: 42501: permission denied for function get_public_profiles_count
```

Esto pasó porque en el fix de seguridad reciente (finding `SUPA_anon_security_definer_function_executable`) se revocó `EXECUTE` a `anon`/`authenticated` sobre funciones `SECURITY DEFINER`. La función quedó inaccesible desde el cliente.

En el componente, cuando la RPC falla, `data` es `null`, `Number(null ?? 0)` devuelve `0`, y por eso se muestra el mensaje de "Sé el primero…".

Mismo problema afecta a `ImpactPage` (usa la misma RPC) y potencialmente `get_public_profiles`.

## Fix

Migración que devuelve el acceso mínimo necesario a estas dos funciones de solo lectura pública:

```sql
GRANT EXECUTE ON FUNCTION public.get_public_profiles_count() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_profiles() TO anon, authenticated;
```

Ambas son `SECURITY DEFINER` pero sólo exponen datos ya considerados públicos (conteo agregado y campos públicos de perfil), así que devolver `EXECUTE` no reintroduce el problema del finding original (que apuntaba a definers sensibles).

No hace falta tocar código de frontend.

## Verificación

- Recargar landing → debe mostrar "35 jóvenes ya se anotaron".
- Página `/impacto` → contador de estudiantes vuelve a mostrar el número real.