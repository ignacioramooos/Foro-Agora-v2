# Plan: banner y Forum para Maths

## Resultado

- Mostrar el banner publicitario en **Aléatoire (`/maths`)** y **Forum (`/maths/forum`)**.
- Permitir cerrarlo con una **X pequeña y accesible** durante la visita; al recargar la página vuelve a aparecer.
- Añadir **Forum** a la navegación de Maths, completamente en francés.
- Cualquier visitante podrá leer mensajes y descargar documentos. Solo usuarios con cuenta podrán publicar, comentar, reaccionar o subir archivos.

## Banner

- Convertir el HTML entregado en un componente React responsive, conservando la oferta de **240 €**, el código **ARBO6150**, el enlace y la cuenta regresiva al próximo sábado a las 20:00.
- Integrar las imágenes del anuncio como recursos gestionados por el proyecto, sin depender de imágenes externas durante el uso.
- Adaptar el formato a escritorio y móvil, respetar modo oscuro y movimiento reducido, y añadir la X sin tapar contenido.
- Mantener el cierre únicamente en memoria para que el anuncio reaparezca después de recargar, tal como pediste.

## Forum

- Crear una página `/maths/forum` dentro del mismo espacio visual de Maths y agregar “Forum” al menú lateral y móvil.
- Construir un muro ordenado por actividad con:
  - formulario de nueva publicación;
  - título y mensaje;
  - uno o varios documentos adjuntos;
  - listado de publicaciones con autor y fecha en formato francés;
  - descarga de adjuntos;
  - comentarios y reacciones;
  - eliminación por el autor o un administrador;
  - estados claros de carga, vacío, error y subida.
- Mostrar el contenido a todo el mundo. Si una persona sin cuenta intenta publicar, comentar o subir, abrir o señalar el acceso francés existente.
- Validar texto, nombre, tamaño y formato de archivo antes de subir. Admitir documentos habituales (PDF, imágenes y archivos Office), con un límite razonable por archivo.

## Datos y seguridad

- Reutilizar las cuentas, perfiles, roles de administrador y patrones de comunidad ya existentes, pero mantener el contenido de Maths separado de la comunidad financiera.
- Crear tablas específicas para publicaciones, comentarios, reacciones y adjuntos del Forum Maths.
- Aplicar permisos para lectura pública y escritura solo autenticada, siempre vinculando cada fila al usuario real de la sesión.
- Crear un espacio de archivos dedicado con reglas que permitan lectura pública, subida autenticada y borrado solo por propietario o administrador.
- Añadir validaciones equivalentes en la interfaz y en la base de datos; no aceptar HTML ejecutable ni tipos de archivo peligrosos.

## Integración y verificación

- Añadir la ruta del Forum a las rutas estáticas del sitio para que una recarga directa no produzca “Not Found”.
- Conservar intactos todos los ejercicios, documentos, identificadores de progreso, Desmos y redirecciones anteriores.
- Verificar en escritorio y móvil: banner, cierre/reaparición al recargar, navegación, lectura pública, bloqueo de escritura sin cuenta, publicación con cuenta cuando sea verificable, adjuntos, comentarios, modo oscuro y ausencia de desbordes.
- Revisar el estado final de compilación y errores del navegador antes de darlo por terminado.

## Detalles técnicos

- El Forum actual es un feed plano en español y no admite archivos; se reutilizarán su autenticación, perfiles, roles y patrón de interacción, no sus textos ni su contenido.
- La nueva información quedará aislada en tablas `maths_forum_*` con RLS. Los archivos irán a un bucket dedicado y sus metadatos quedarán relacionados con la publicación correspondiente.
- No se modificará manualmente el archivo generado de tipos de Supabase.
