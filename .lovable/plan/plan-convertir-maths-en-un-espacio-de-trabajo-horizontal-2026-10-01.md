# Plan: convertir `/maths` en un espacio de trabajo horizontal

## Objetivo
Rediseñar la experiencia de matemáticas para aprovechar la pantalla completa en PC, reducir el scroll y permitir estudiar con el enunciado, el progreso y Desmos visibles al mismo tiempo. Mantener la identidad sobria de Foro Agora, el francés, el modo oscuro y todo el progreso existente.

## Pantalla principal `/maths`
- Reemplazar la columna estrecha por un espacio de trabajo de ancho completo inspirado en Bluebook y Khan Academy:
  - barra lateral compacta con capítulos, racha, progreso diario y navegación entre ejercicios;
  - zona central enfocada en un ejercicio por vez, con su etiqueta **COURS/TD**, fórmula, Gemini y estado completado;
  - panel derecho ajustable con una calculadora gráfica Desmos realmente utilizable.
- Permitir redimensionar y cerrar el panel de Desmos en PC; recordar la preferencia localmente.
- En móvil, mostrar el contenido en una sola columna y abrir Desmos en una ventana de pantalla completa para no aplastar el ejercicio.
- Conservar **Tous** como mezcla diaria y cada capítulo en orden desde el primer ejercicio pendiente.
- Mantener “Plus d’exercices” y la navegación anterior/siguiente sin cambiar IDs ni progreso guardado.

## Configuración
- Quitar el selector del objetivo cotidiano de la cabecera principal.
- Añadir un acceso de configuración discreto junto al modo oscuro.
- Abrir una ventana de configuración con el objetivo diario de 1 a 30 ejercicios; seguirá guardándose localmente y en la cuenta cuando haya sesión.

## Página de cada capítulo
- Usar una composición amplia de dos lados en PC:
  - izquierda: documento **Cours** embebido, con acceso para abrirlo aparte;
  - derecha: ejercicios **TD** del capítulo, progreso y acceso al PDF del TD.
- Mantener los ejercicios COURS dentro de la mezcla diaria; la página del capítulo se enfocará en la relación solicitada entre el material Cours y la práctica TD.
- En móvil, apilar Cours y TD con controles claros para cambiar entre ambos sin iframes ilegibles.

## Cambio de dirección
- Convertir las rutas principales en `/maths` y `/maths/chapitre/:id`.
- Redirigir las direcciones antiguas `/practica` y `/practica/capitulo/:id` a sus equivalentes nuevas para no romper enlaces guardados.
- Actualizar enlaces internos, metadatos, páginas estáticas y exclusión de navegación general/WhatsApp para reconocer `/maths`.
- Mantener disponibles los PDF existentes durante la transición; la dirección visible de estudio será `/maths`.

## Calidad y seguridad de datos
- No cambiar ningún ID de ejercicio COURS o TD ni las claves de progreso/objetivo existentes.
- Usar solamente los tokens visuales del proyecto y asegurar contraste en modo claro y oscuro.
- Verificar en PC y móvil: redimensionado de Desmos, navegación diaria, configuración, capítulo Cours/TD, fórmulas largas, enlaces PDF, redirecciones antiguas y ausencia de desbordes o superposiciones.

## Detalles técnicos
- Usar los paneles redimensionables ya disponibles en el proyecto para el escritorio.
- Encapsular Desmos y su carga en un componente aislado con estado de carga/error, sin bloquear el resto de la página.
- Reutilizar la lógica actual de objetivo, progreso, mezcla y orden; el cambio será de presentación y navegación, no del modelo de datos.
