import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Megaphone, School, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";
import { supabase } from "@/integrations/supabase/client";

const departments = [
  "Montevideo", "Canelones", "Maldonado", "Salto", "Colonia", "Paysandú",
  "Rivera", "Soriano", "Cerro Largo", "San José", "Tacuarembó", "Rocha",
  "Florida", "Durazno", "Artigas", "Treinta y Tres", "Lavalleja", "Flores", "Río Negro",
];

const channelOptions = [
  "Compartir en historias de Instagram",
  "Presentarlo en mi liceo/facultad",
  "Invitar amigos a una clase",
  "Conectar docentes o referentes",
  "Ayudar con contenido",
  "Organizar una charla",
];

const roleOptions = [
  "Estudiante de liceo",
  "Estudiante universitario/a",
  "Docente",
  "Familia / referente",
  "Voluntario/a",
  "Otro",
];

type Status = "idle" | "loading" | "success" | "error";

const AmbassadorsPage = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [channels, setChannels] = useState<string[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    department: "",
    institution: "",
    role: "",
    motivation: "",
    experience: "",
  });

  const setField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (status === "error") setStatus("idle");
  };

  const toggleChannel = (option: string) => {
    setChannels((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.fullName || !form.email || !form.department || !form.institution || !form.role || !form.motivation) return;

    setStatus("loading");
    const { error } = await supabase.from("ambassador_applications").insert({
      full_name: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      age: form.age ? Number(form.age) : null,
      department: form.department,
      institution: form.institution.trim(),
      role: form.role,
      channels,
      motivation: form.motivation.trim(),
      experience: form.experience.trim() || null,
    });

    setStatus(error ? "error" : "success");
  };

  const inputClass =
    "w-full h-12 px-4 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow font-heading";

  if (status === "success") {
    return (
      <main className="min-h-screen bg-background pt-28 md:pt-36">
        <div className="container max-w-2xl pb-20 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <CheckCircle2 size={40} className="text-foreground" />
          </div>
          <h1 className="mb-4 text-3xl md:text-4xl">Gracias por sumarte</h1>
          <p className="mb-8 text-muted-foreground">
            Recibimos tu postulación. Te vamos a contactar para coordinar cómo podés ayudar a llevar Foro Agora a más jóvenes.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="cta">
              <Link to="/registro">Inscribirme a una clase</Link>
            </Button>
            <Button asChild variant="cta-outline">
              <Link to="/">Volver al inicio</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden bg-sun pt-32 md:pt-40 pb-16 md:pb-20">
        <div className="absolute left-0 top-12 h-24 w-36 rounded-[50%] border-[14px] border-blue-pop border-r-transparent border-b-transparent rotate-[-10deg]" />
        <div className="container relative">
          <SectionFade>
            <p className="font-hand text-3xl text-foreground/80">Embajadores</p>
            <h1 className="mt-2 max-w-4xl text-4xl sm:text-5xl md:text-6xl font-black leading-tight text-foreground">
              Llevá Foro Agora a tu centro educativo
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-foreground/75">
              Si creés que más jóvenes deberían aprender sobre dinero, inversión responsable y análisis fundamental, ayudanos a abrir puertas.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="default"
                size="cta"
                className="bg-foreground text-background hover:bg-foreground/85"
                onClick={() => document.getElementById("ambassador-form")?.scrollIntoView({ behavior: "smooth" })}
              >
                Quiero ayudar
                <ArrowRight size={17} />
              </Button>
              <Button asChild variant="cta-outline" size="cta" className="border-foreground/30 bg-transparent">
                <Link to="/partners">Soy una organización</Link>
              </Button>
            </div>
          </SectionFade>
        </div>
      </section>

      <section className="border-b border-border bg-background py-14 md:py-20">
        <div className="container">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: School, title: "Abrir una puerta", desc: "Presentar Foro Agora en tu liceo, facultad, club o comunidad." },
              { icon: Megaphone, title: "Difundir con criterio", desc: "Compartir clases y recursos sin promesas falsas ni ruido financiero." },
              { icon: Users, title: "Construir comunidad", desc: "Conectar jóvenes curiosos con un espacio gratuito y serio." },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-border bg-card p-7">
                <item.icon size={22} className="mb-5 text-blue-pop" />
                <h2 className="font-heading text-xl font-black">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ambassador-form" className="bg-background py-16 md:py-24">
        <div className="container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="font-hand text-3xl text-blue-pop">Sumate</p>
            <h2 className="mt-2 text-3xl md:text-5xl font-black leading-tight">
              Contanos dónde podés generar impacto
            </h2>
            <p className="mt-5 text-muted-foreground">
              Buscamos personas que puedan recomendar, presentar, conectar o ayudar a organizar nuevas instancias educativas.
            </p>
            <div className="mt-8 rounded-lg border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground">
              <strong className="font-heading text-foreground">Importante:</strong> Foro Agora es educativo. No damos asesoramiento financiero, señales ni promesas de retorno. Toda difusión debe respetar ese estándar.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-border bg-card p-6 md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-heading font-medium text-foreground">Nombre completo *</label>
                <input className={inputClass} value={form.fullName} onChange={(e) => setField("fullName", e.target.value)} required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-heading font-medium text-foreground">Email *</label>
                <input type="email" className={inputClass} value={form.email} onChange={(e) => setField("email", e.target.value)} required />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-heading font-medium text-foreground">Edad</label>
                <input type="number" min="13" max="99" className={inputClass} value={form.age} onChange={(e) => setField("age", e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-heading font-medium text-foreground">Departamento *</label>
                <select className={inputClass} value={form.department} onChange={(e) => setField("department", e.target.value)} required>
                  <option value="">Seleccionar...</option>
                  {departments.map((department) => <option key={department} value={department}>{department}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-heading font-medium text-foreground">WhatsApp</label>
                <input className={inputClass} value={form.phone} onChange={(e) => setField("phone", e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-heading font-medium text-foreground">Centro educativo / comunidad *</label>
                <input className={inputClass} value={form.institution} onChange={(e) => setField("institution", e.target.value)} required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-heading font-medium text-foreground">Tu rol *</label>
                <select className={inputClass} value={form.role} onChange={(e) => setField("role", e.target.value)} required>
                  <option value="">Seleccionar...</option>
                  {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-heading font-medium text-foreground">¿Cómo podrías ayudar?</label>
              <div className="grid gap-2 sm:grid-cols-2">
                {channelOptions.map((option) => (
                  <label key={option} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      className="mt-1 rounded border-border"
                      checked={channels.includes(option)}
                      onChange={() => toggleChannel(option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-heading font-medium text-foreground">¿Por qué querés ayudar? *</label>
              <textarea
                className={`${inputClass} h-28 py-3 resize-none`}
                value={form.motivation}
                onChange={(e) => setField("motivation", e.target.value)}
                maxLength={700}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-heading font-medium text-foreground">Experiencia o contactos relevantes</label>
              <textarea
                className={`${inputClass} h-24 py-3 resize-none`}
                value={form.experience}
                onChange={(e) => setField("experience", e.target.value)}
                maxLength={700}
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-destructive">No pudimos enviar el formulario. Intentá de nuevo o escribinos a contacto@foroagora.org.</p>
            )}

            <Button type="submit" variant="cta" size="cta" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? "Enviando..." : "Postularme como embajador/a"}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default AmbassadorsPage;
