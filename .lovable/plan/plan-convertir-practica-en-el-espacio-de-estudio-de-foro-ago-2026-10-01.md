# Plan: convertir `/practica` en el espacio de estudio de Foro Agora

## Objetivo
Transformar la sección actual en un panel de estudio francés, concentrado y personalizable, sin cambiar la identidad visual de Foro Agora: mismos colores, tipografías, botones, bordes, logo y tono gráfico. No se adoptará ninguna estética de dashboard genérica.

## Experiencia
- Crear una cabecera propia y mínima para `/practica` y sus capítulos: únicamente el logo, “Foro Agora” y el control claro/oscuro.
- Quitar en estas rutas la navegación general, el pie con newsletter y el botón flotante de WhatsApp.
- Mantener todo el texto de estudio en francés y adaptar el diseño actual a un panel amplio, claro y sin distracciones.
- Organizar el panel con el ejercicio como elemento principal y, alrededor, información compacta del objetivo, racha, avance y capítulos.
- Conservar las tarjetas, el amarillo característico y la jerarquía visual actual de Foro Agora; evitar métricas inventadas, niveles, monedas, mascotas o gamificación infantil.

## Objetivo diario personalizable
- Permitir elegir cuántos ejercicios completar por día mediante un control simple, con opciones prácticas y ajuste manual dentro de límites razonables.
- Guardar la meta localmente para visitantes y sincronizarla con la preferencia de la cuenta para usuarios conectados.
- Actualizar en tiempo real la barra, el contador y el mensaje de objetivo cumplido según la meta elegida.
- Mantener el progreso existente y migrar el valor local al iniciar sesión, sin perder ejercicios completados.

## Orden de ejercicios
- En **Tous**, mezclar todos los ejercicios de forma determinista cada día para que la selección diaria sea variada pero estable durante la jornada.
- En **Chap. 1, Chap. 2, etc.**, presentar los ejercicios en orden numérico y continuar desde el primer ejercicio pendiente.
- Hacer que “Plus d’exercices” respete el mismo criterio: aleatorio en Tous y secuencial dentro de un capítulo.
- Mostrar claramente “Mélange quotidien” o “Ordre du chapitre” para que el comportamiento sea entendible.

## Material COURS y TD
- Mantener intactos todos los identificadores actuales de ejercicios TD porque el progreso guardado depende de ellos.
- Transcribir y agregar los ejercicios encontrados dentro de `c1.pdf` a `c6.pdf` —aproximadamente 93 ejercicios adicionales— usando identificadores nuevos y separados (`chN-cours-exM`).
- Marcar internamente el origen de cada ejercicio como `cours` o `td`, mostrándolo de forma discreta cuando ayude a ubicarse.
- Revisar cada fórmula y ecuación con el documento original; las expresiones complejas seguirán usando LaTeX/KaTeX y desplazamiento horizontal seguro en móvil.
- Mantener accesos directos al COURS y al TD de cada capítulo.

## Páginas de capítulo
- Aplicar la misma cabecera mínima y modo oscuro.
- Reorganizar cada capítulo como espacio de referencia: resumen, acceso al COURS, acceso al TD y avance personal del capítulo.
- Mantener el retorno directo a la sesión de práctica sin introducir navegación ajena.

## Validación
- Comprobar en escritorio y móvil que no aparezcan la navegación española, el pie ni WhatsApp dentro de `/practica`.
- Verificar modo claro/oscuro, persistencia del objetivo, mezcla diaria en Tous, orden secuencial por capítulo y continuidad de “Plus d’exercices”.
- Revisar ejercicios representativos de los seis COURS, incluyendo fórmulas largas, sistemas y sumatorias.
- Probar como visitante y como usuario conectado para confirmar progreso y preferencias.

## Detalles técnicos
- Extender el tipo de ejercicio con un origen opcional sin romper el contenido existente.
- Mantener el cargador automático de archivos de capítulos.
- Añadir la meta diaria a las preferencias del usuario mediante una migración segura; conservar `localStorage` como respaldo para visitantes.
- Separar las rutas de práctica del envoltorio público general, reutilizando el tema y los componentes visuales de Foro Agora.
- No modificar los identificadores `chN-exM` existentes.
