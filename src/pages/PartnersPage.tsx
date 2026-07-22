import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import injuCasaColorLogo from "@/assets/inju-casa-inju-color-2026.png";
import injuCasaMonochromeLogo from "@/assets/inju-casa-inju-monochrome-2026.png";

const collaborationOptions = [
  "Difusión general",
  "Brindar materiales o recursos",
  "Visibilidad como aliado",
  "Acceso a nuestro equipo",
  "Apoyo económico",
  "Otro",
];

const orgTypes = [
  "Organización",
  "Empresa Privada",
  "ONG/Fundación",
  "Medio de Comunicación",
  "Otro",
];

const institutionMessage =
  "Nos interesa apoyar la difusión de Foro Agora y conversar sobre formas de colaborar sin cerrar el acceso a la comunidad.";

const PartnersPage = () => {
  const [searchParams] = useSearchParams();
  const fromInstitutions = searchParams.get("source") === "instituciones";
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    organization: "",
    role: "",
    email: "",
    org_type: fromInstitutions ? "Organización" : "",
    collaboration_types: fromInstitutions ? ["Difusión general"] : [] as string[],
    message: fromInstitutions ? institutionMessage : "",
  });
  const [partners, setPartners] = useState<Tables<"partners">[]>([]);
  const [wall, setWall] = useState<Array<{ user_id: string; display_name: string; referral_count: number }>>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      const { data } = await supabase
        .from("partners")
        .select("*")
        .eq("is_active", true)
        .order("created_at");
      if (data) setPartners(data);
    };
    const fetchWall = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from("thank_you_wall")
        .select("user_id, display_name, referral_count, first_referral_at")
        .order("first_referral_at", { ascending: true });
      if (data) setWall(data);
    };
    fetchPartners();
    fetchWall();
  }, []);

  useEffect(() => {
    if (!fromInstitutions) return;
    window.setTimeout(() => {
      document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
    }, 250);
  }, [fromInstitutions]);

  const handleCollabToggle = (option: string) => {
    setForm((p) => ({
      ...p,
      collaboration_types: p.collaboration_types.includes(option)
        ? p.collaboration_types.filter((o) => o !== option)
        : [...p.collaboration_types, option],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.organization || !form.email || !form.org_type) return;
    setSubmitting(true);
    await supabase.from("partner_inquiries").insert({
      full_name: form.full_name,
      organization: form.organization,
      role: form.role,
      email: form.email,
      org_type: form.org_type,
      collaboration_types: form.collaboration_types,
      message: form.message || null,
    });
    setSent(true);
    setSubmitting(false);
  };

  const inputClass =
    "w-full h-12 px-4 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow font-heading";

  return (
    <>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 bg-white text-foreground dark:bg-black dark:text-white">
        <div className="container">
          <SectionFade>
            <p className="text-xs font-heading font-medium uppercase tracking-widest text-foreground/80 dark:text-white/80 mb-6">
              Alianzas
            </p>
            <h1 className="text-3xl md:text-5xl text-foreground dark:text-white max-w-3xl mb-6">
              Sumá tu organización como aliada
            </h1>
            <p className="text-foreground/85 dark:text-white/85 text-lg max-w-xl mb-8">
              Apoyá el acceso abierto a educación financiera real para jóvenes en Uruguay.
            </p>
            <Button
              variant="cta"
              size="cta"
              className="bg-foreground text-background hover:bg-foreground/85 dark:bg-white dark:text-black dark:hover:bg-white/90"
              onClick={() => document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              Quiero ser aliado
            </Button>
            <Button asChild variant="cta-outline" size="cta" className="mt-3 bg-transparent dark:border-white/30 dark:text-white">
              <Link to="/difundir">Ver kit de difusión</Link>
            </Button>
          </SectionFade>
        </div>
      </section>

      {/* Value props */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Visibilidad", desc: "Logo en el sitio, mención en clases presenciales, contenido en redes." },
              { title: "Acceso a talento", desc: "Conocé a los jóvenes más motivados del programa antes que nadie." },
              { title: "Impacto medible", desc: "Recibí un informe mensual con métricas reales del programa." },
            ].map((v) => (
              <div key={v.title} className="border border-border rounded-lg p-8">
                <h3 className="font-heading font-semibold text-foreground text-lg mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container">
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Nuestros aliados
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex min-h-40 items-center justify-center overflow-hidden rounded-xl border-2 border-foreground bg-white px-3 py-6 dark:bg-black md:col-span-2 md:min-h-48 md:px-10">
              <img
                src={injuCasaColorLogo}
                alt="INJU y Casa INJU — Instituto Nacional de la Juventud"
                className="h-auto w-full max-w-5xl object-contain dark:hidden"
              />
              <img
                src={injuCasaMonochromeLogo}
                alt="INJU y Casa INJU — Instituto Nacional de la Juventud"
                className="hidden h-auto w-full max-w-5xl object-contain dark:block"
              />
            </div>
            {partners.filter((partner) => !partner.name.toLocaleLowerCase("es").includes("inju")).map((p) => (
              <div key={p.id} className="flex min-h-28 items-center justify-center rounded-lg border border-border bg-card px-8 py-5">
                {p.logo_url ? (
                  <img src={p.logo_url} alt={p.name} className="h-12 object-contain" />
                ) : (
                  <span className="text-muted-foreground font-heading text-sm">{p.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="form-section" className="py-16 md:py-24">
        <div className="container max-w-2xl">
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Sumate
          </p>
          <h2 className="text-3xl md:text-4xl text-foreground mb-4">
            Quiero ser aliado
          </h2>
          <p className="text-muted-foreground mb-10">
            Completá el formulario y te contactamos en menos de 48 horas.
          </p>
          {fromInstitutions && !sent && (
            <div className="mb-6 rounded-lg border border-border bg-blue-soft p-4 text-sm leading-relaxed text-foreground/75">
              Este formulario está preparado para consultas de alianza o difusión. La gestión de actividades queda en manos del equipo de Foro Agora.
            </div>
          )}
          {sent ? (
            <div className="border border-border rounded-lg p-8 text-center">
              <CheckCircle2 size={40} className="text-accent mx-auto mb-4" />
              <h3 className="font-heading font-semibold text-foreground text-xl mb-2">
                ¡Gracias por tu interés!
              </h3>
              <p className="text-muted-foreground">Te contactamos en menos de 48 horas.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Nombre completo *</label>
                  <input className={inputClass} value={form.full_name} onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Organización *</label>
                  <input className={inputClass} value={form.organization} onChange={(e) => setForm((p) => ({ ...p, organization: e.target.value }))} required />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Cargo / Rol</label>
                  <input className={inputClass} value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Email de contacto *</label>
                  <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Tipo de organización *</label>
                <select className={inputClass} value={form.org_type} onChange={(e) => setForm((p) => ({ ...p, org_type: e.target.value }))} required>
                  <option value="">Seleccionar...</option>
                  {orgTypes.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">¿Cómo te gustaría colaborar?</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {collaborationOptions.map((o) => (
                    <label key={o} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.collaboration_types.includes(o)}
                        onChange={() => handleCollabToggle(o)}
                        className="rounded border-border"
                      />
                      {o}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Mensaje adicional</label>
                <textarea
                  className={`${inputClass} h-24 py-3 resize-none`}
                  maxLength={500}
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                />
              </div>
              <Button type="submit" variant="cta" size="cta" className="w-full" disabled={submitting}>
                {submitting ? "Enviando..." : "Enviar consulta de alianza"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default PartnersPage;
