# experiencestudent_journey_map_v1.md

Mapa de Experiencia del Estudiante - Foro Agora v1.0
Este documento detalla el recorrido del estudiante (User Journey) desde su primer contacto con Foro Agora hasta su participaci?n activa en la comunidad y el uso del simulador.

1. Fase de Descubrimiento y Registro (P?blico)
Objetivo: Convertir el inter?s en compromiso educativo.

P?gina de Inicio:
Propuesta de Valor: "Educaci?n financiera seria para j?venes en Uruguay."
Secciones Clave: Misi?n, Programa (resumen de los 5 m?dulos), Testimonios (reales o proyectados), FAQ.
CTA: Bot?n destacado "Unirme al Foro Agora".
Proceso de Registro:
Formulario simple: Nombre, Email, Contrase?a (v?a Supabase Auth).
Confirmaci?n de correo con mensaje de bienvenida que ya establece el tono de "mentor experto".
2. Onboarding: "El Primer Paso"
Objetivo: Reducir la fricci?n y establecer expectativas claras.

Bienvenida Personalizada: Pantalla de bienvenida con un mensaje breve: "Bienvenido al foro, [Nombre]. Est?s por empezar un camino hacia tu libertad financiera."
Configuraci?n de Perfil (R?pida):
Edad (para adaptar ejemplos).
?Cu?l es tu principal inter?s? (Ahorro, Inversi?n, Emprendimiento, Estabilidad).
Tour de la Plataforma: Breve explicaci?n visual de d?nde est?n las clases, el simulador y el foro.
Compromiso Agora: Un peque?o "manifiesto" que el estudiante acepta, reforzando que esto no es consejo financiero y requiere estudio.
3. El Dashboard del Estudiante (Centro de Control)
Objetivo: Mantener el enfoque y motivar el progreso.

Vista Principal:
"Tu Pr?ximo Paso": Bot?n grande para continuar la ?ltima lecci?n vista.
Barra de Progreso General: Visualizaci?n de los 5 m?dulos.
Novedades de la Comunidad: ?ltimos hilos destacados en el Foro.
Barra Lateral (Navegaci?n):
Dashboard
Cursos (Listado de m?dulos 1-5)
Simulador (Bloqueado hasta completar M?dulo 1)
Foro (Comunidad)
Eventos (Calendario de charlas en vivo)
Perfil y Logros
4. El Flujo de Aprendizaje (M?dulos)
Objetivo: Garantizar la comprensi?n y la aplicaci?n pr?ctica.

Cada lecci?n sigue esta estructura:

Introducci?n: ?Por qu? importa este concepto hoy?
Contenido: Texto claro, videos cortos o infograf?as.
El ?ngulo Uruguayo: C?mo se aplica esto en el mercado local (ej: "La inflaci?n en Uruguay y la UI").
Chequeo de Conocimiento: 3 preguntas r?pidas (Quizzes) para avanzar.
Actividad Pr?ctica: Un ejercicio fuera de la pantalla o dentro del simulador.
5. El Simulador de Portafolio
Objetivo: Experimentaci?n sin riesgo basada en fundamentos.

Acceso: Se desbloquea tras el M?dulo 1 (Cimientos).
Funcionalidades:
B?squeda de activos (Acciones, ETFs).
Visualizaci?n de datos hist?ricos (v?a Edge Functions).
Compra/Venta simulada.
Registro de "Tesis de Inversi?n": El estudiante debe escribir por qu? compra ese activo (fomentando el an?lisis fundamental).
6. Comunidad y Soporte
Objetivo: Fomentar el aprendizaje social y el sentido de pertenencia.

El Foro: Espacio para dudas sobre lecciones o noticias del mercado. Moderado por el equipo de Foro Agora.
Mentor?a: Sesiones de Q&A mensuales para estudiantes que hayan completado al menos 2 m?dulos.
Diagrama de Flujo (L?gica)
[Registro] -> [Onboarding] -> [Dashboard]
                                |
        ------------------------------------------
        |               |               |        |
    [Cursos] -> [Simulador] -> [Foro] -> [Logros]
        |               ^               ^
        |               |               |
    (Progreso) --------(Habilitaci?n)---(Participaci?n)
7. L?gica de Progresi?n y Gamificaci?n
Objetivo: Mantener el ritmo y recompensar el esfuerzo sin caer en la "ludificaci?n" excesiva.

Acceso Secuencial: Los m?dulos se desbloquean en orden (1 al 5). Esto asegura que el estudiante tenga los cimientos antes de llegar a instrumentos complejos.
Hitos de Logro (Badges):
Novato Agora: Completar el M?dulo 1.
Analista Local: Completar el M?dulo 2 (Contexto Uruguayo).
Inversor Fundamentado: Realizar la primera tesis de inversi?n en el Simulador.
Certificaci?n: Al completar los 5 m?dulos, el estudiante recibe un certificado de "Fundamentos de Foro Agora", que puede compartir en LinkedIn o su CV.
8. Consideraciones de Dise?o UX (UX Principles)
Prioridad al Contenido: Menos distracciones, tipograf?a legible (Sans-serif para el cuerpo).
Contexto Siempre Visible: El estudiante siempre debe saber en qu? m?dulo est? y cu?nto le falta.
Mobile First: Dado que el p?blico es joven, la plataforma debe ser impecable en celulares.
Tono Consistente: Los mensajes de error, confirmaci?n y carga deben seguir el tono de "mentor experto".
9. Wireframe Conceptual del Dashboard (Desktop)
______________________________________________________________________
| Foro Agora [Logo] |                     [Notificaciones] [Mi Perfil] |
|___________________|__________________________________________________|
|                   |                                                  |
|  [Sidebar]        |  ?Hola, Juan! ?                                 |
|                   |  Contin?a donde lo dejaste:                      |
|  - Dashboard      |  ______________________________________________  |
|  - Cursos         | | M?dulo 2: El Ecosistema Uruguayo            | |
|  - Simulador      | | Lecci?n 2.2: El Sistema Bancario Local      | |
|  - Foro           | | [======= 45% =======]      [ Bot?n: Ir ]    | |
|  - Eventos        | |______________________________________________| |
|                   |                                                  |
|                   |  Tu Portafolio (Simulado)       ?ltimo en el Foro |
|                   |  _______________________     __________________  |
|                   | | Acciones: +2.4%       |   | ?Qu? es la UI?  |  |
|                   | | Saldo: $15.400        |   | por @LuciaF     |  |
|                   | | [ Ver m?s ]           |   | [ Leer m?s ]    |  |
|                   | |_______________________|   |__________________|  |
|___________________|__________________________________________________|
10. Conclusi?n
Tasa de completitud del Onboarding.
Tiempo promedio para completar el M?dulo 1.
Frecuencia de uso del Simulador post-clase.
Engagement en el Foro (Preguntas realizadas vs. respondidas).
