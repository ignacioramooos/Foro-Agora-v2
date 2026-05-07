import { useEffect } from "react";

const LAST_UPDATED = "7 de mayo de 2026";

const PrivacyPage = () => {
  useEffect(() => {
    document.title = "Política de Privacidad — Foro Agora";
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta(
      "description",
      "Política de privacidad de Foro Agora: qué datos recopilamos, cómo los usamos y tus derechos."
    );
  }, []);

  return (
    <div className="container max-w-3xl py-16 md:py-24">
      <h1 className="text-3xl md:text-5xl font-heading font-black text-foreground mb-4">
        Política de Privacidad
      </h1>
      <p className="text-sm text-muted-foreground mb-10">Última actualización: {LAST_UPDATED}</p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-foreground/90 leading-relaxed">
        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">1. Quiénes somos</h2>
          <p>
            Foro Agora es un proyecto educativo sin fines de lucro con sede en Montevideo, Uruguay,
            que ofrece formación gratuita en análisis fundamental para jóvenes estudiantes. Esta
            política describe cómo tratamos la información personal de las personas que usan nuestro
            sitio web y plataforma (foroagora.org y subdominios).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">2. Qué datos recopilamos</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Datos de cuenta:</strong> nombre, dirección de correo electrónico y contraseña (cifrada) cuando te registrás.</li>
            <li><strong>Datos de Google:</strong> si iniciás sesión con Google, recibimos tu nombre, email y foto de perfil pública.</li>
            <li><strong>Progreso educativo:</strong> clases completadas, fechas de actividad, certificados y contenidos publicados dentro de la plataforma.</li>
            <li><strong>Comunicaciones:</strong> mensajes que nos envías a través de formularios de contacto o newsletter.</li>
            <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador y datos de uso básicos por motivos de seguridad y rendimiento.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">3. Para qué los usamos</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Crear y mantener tu cuenta.</li>
            <li>Permitirte acceder a las clases, recursos y registrar tu progreso.</li>
            <li>Enviarte comunicaciones relacionadas con el programa o el newsletter (si te suscribiste).</li>
            <li>Mejorar la plataforma y prevenir abusos.</li>
            <li>Cumplir con obligaciones legales aplicables.</li>
          </ul>
          <p className="mt-3">No vendemos ni alquilamos tus datos personales a terceros.</p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">4. Terceros que procesan datos</h2>
          <p>Utilizamos proveedores de confianza para operar la plataforma:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Supabase</strong> — base de datos y autenticación.</li>
            <li><strong>Google OAuth</strong> — inicio de sesión con cuenta de Google.</li>
            <li><strong>Lovable / Cloudflare</strong> — hosting del sitio.</li>
          </ul>
          <p className="mt-3">
            Estos servicios procesan datos únicamente para prestar su función técnica y están sujetos
            a sus propias políticas de privacidad.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">5. Cookies y almacenamiento local</h2>
          <p>
            Utilizamos cookies y almacenamiento local del navegador estrictamente necesarios para
            mantener tu sesión iniciada y recordar preferencias (por ejemplo, el tema claro/oscuro).
            No usamos cookies de publicidad ni de seguimiento entre sitios.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">6. Tus derechos</h2>
          <p>
            Podés solicitar en cualquier momento acceder, rectificar o eliminar tus datos personales,
            así como darte de baja del newsletter. Para hacerlo, escribinos a{" "}
            <a className="underline" href="mailto:contacto@foroagora.org">contacto@foroagora.org</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">7. Conservación</h2>
          <p>
            Conservamos tus datos mientras tu cuenta esté activa o sea necesario para los fines
            descritos. Podés pedir la eliminación de tu cuenta en cualquier momento.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">8. Menores</h2>
          <p>
            El programa está dirigido a estudiantes. Los menores de 18 años deben contar con el
            consentimiento de sus padres o tutores para registrarse.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">9. Cambios en esta política</h2>
          <p>
            Podemos actualizar esta política cuando sea necesario. Publicaremos siempre la versión
            vigente en esta misma URL e indicaremos la fecha de última actualización.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">10. Contacto</h2>
          <p>
            Para cualquier consulta sobre esta política o sobre el tratamiento de tus datos,
            escribinos a{" "}
            <a className="underline" href="mailto:contacto@foroagora.org">contacto@foroagora.org</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
