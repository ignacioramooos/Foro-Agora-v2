import { useEffect } from "react";

const LAST_UPDATED = "7 de mayo de 2026";

const TermsPage = () => {
  useEffect(() => {
    document.title = "Términos y Condiciones — Foro Agora";
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
      "Términos y condiciones de uso del sitio y la plataforma de Foro Agora."
    );
  }, []);

  return (
    <div className="container max-w-3xl py-16 md:py-24">
      <h1 className="text-3xl md:text-5xl font-heading font-black text-foreground mb-4">
        Términos y Condiciones
      </h1>
      <p className="text-sm text-muted-foreground mb-10">Última actualización: {LAST_UPDATED}</p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-foreground/90 leading-relaxed">
        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">1. Aceptación</h2>
          <p>
            Al acceder o usar el sitio web y la plataforma de Foro Agora ("el Servicio"), aceptás
            estos Términos y Condiciones. Si no estás de acuerdo, por favor no utilices el Servicio.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">2. Sobre Foro Agora</h2>
          <p>
            Foro Agora es un proyecto educativo sin fines de lucro radicado en Uruguay. Ofrece
            formación gratuita en análisis fundamental dirigida principalmente a estudiantes. El uso
            del Servicio es y será gratuito.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">3. No constituye asesoramiento financiero</h2>
          <p>
            <strong>El contenido de Foro Agora tiene fines exclusivamente educativos.</strong> No
            constituye asesoramiento financiero, recomendación de inversión, ni oferta de compra o
            venta de instrumentos financieros. Las decisiones de inversión son responsabilidad
            exclusiva de cada persona y deben tomarse, en su caso, con un asesor profesional
            habilitado.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">4. Cuenta de usuario</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Sos responsable de mantener la confidencialidad de tu contraseña y de toda actividad realizada con tu cuenta.</li>
            <li>Debés proporcionar información veraz al registrarte.</li>
            <li>Los menores de 18 años necesitan consentimiento de sus padres o tutores.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">5. Uso aceptable</h2>
          <p>Te comprometés a no:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Usar el Servicio con fines ilegales o fraudulentos.</li>
            <li>Intentar acceder sin autorización a sistemas, datos o cuentas de terceros.</li>
            <li>Publicar contenido ofensivo, difamatorio, ilegal o que infrinja derechos de terceros.</li>
            <li>Realizar ingeniería inversa, scraping masivo o sobrecargar la plataforma.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">6. Propiedad intelectual</h2>
          <p>
            Los contenidos del Servicio (textos, materiales de clase, marca, diseño) pertenecen a
            Foro Agora o a sus respectivos titulares. Podés utilizarlos para tu aprendizaje
            personal; cualquier otro uso requiere autorización previa por escrito.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">7. Contenido generado por usuarios</h2>
          <p>
            Si publicás tesis, comentarios u otros contenidos en la plataforma, sos responsable de
            los mismos y nos otorgás una licencia no exclusiva y gratuita para mostrarlos en el
            Servicio con fines educativos. Podemos retirar contenido que incumpla estos Términos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">8. Suspensión y baja</h2>
          <p>
            Podemos suspender o cerrar tu cuenta si incumplís estos Términos. Vos podés solicitar
            la baja de tu cuenta en cualquier momento escribiendo a{" "}
            <a className="underline" href="mailto:contacto@foroagora.org">contacto@foroagora.org</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">9. Limitación de responsabilidad</h2>
          <p>
            El Servicio se ofrece "tal cual" y "según disponibilidad". En la máxima medida permitida
            por la ley, Foro Agora no será responsable por daños indirectos, lucro cesante ni
            pérdidas derivadas del uso o imposibilidad de uso del Servicio, ni por decisiones de
            inversión tomadas a partir del contenido educativo.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">10. Cambios en los Términos</h2>
          <p>
            Podemos actualizar estos Términos. Publicaremos la versión vigente en esta URL e
            indicaremos la fecha de última actualización. El uso continuado del Servicio implica la
            aceptación de los Términos vigentes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">11. Ley aplicable</h2>
          <p>
            Estos Términos se rigen por las leyes de la República Oriental del Uruguay. Cualquier
            controversia se someterá a los tribunales competentes de Montevideo.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mt-8 mb-3">12. Contacto</h2>
          <p>
            Para consultas sobre estos Términos, escribinos a{" "}
            <a className="underline" href="mailto:contacto@foroagora.org">contacto@foroagora.org</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
