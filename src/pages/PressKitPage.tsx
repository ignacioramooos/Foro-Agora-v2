import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Check,
  Copy,
  ExternalLink,
  FileText,
  GraduationCap,
  Link as LinkIcon,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";
import logoMark from "@/assets/stone-trail-logo.png";

const facts = [
  { icon: GraduationCap, label: "Foco", value: "Educacion financiera para jovenes en Uruguay" },
  { icon: BookOpen, label: "Formato", value: "Clases, charlas y recursos introductorios" },
  { icon: ShieldCheck, label: "Enfoque", value: "Sin trading, sin senales, sin promesas de retorno" },
  { icon: Users, label: "Audiencia", value: "Jovenes, estudiantes, docentes e instituciones" },
];

const officialLinks = [
  ["Sitio web", "https://foroagora.org"],
  ["Inscripcion", "https://foroagora.org/registro"],
  ["Instituciones", "https://foroagora.org/instituciones"],
  ["Propuesta institucional", "https://foroagora.org/propuesta-instituciones"],
  ["Kit de difusion", "https://foroagora.org/difundir"],
  ["LinkedIn", "https://linkedin.com/company/foro-agora/"],
];

const boilerplates = [
  {
    title: "Descripcion corta",
    text: "Foro Agora es una iniciativa uruguaya sin fines de lucro que acerca educacion financiera gratuita a jovenes, con foco en finanzas personales, inversion responsable y analisis fundamental desde cero.",
  },
  {
    title: "Descripcion extendida",
    text: `Foro Agora es una iniciativa educativa uruguaya sin fines de lucro que busca acercar educacion financiera gratuita a jovenes. El proyecto trabaja con clases, charlas y recursos introductorios sobre finanzas personales, inversion responsable, lectura basica de empresas y pensamiento critico frente a decisiones financieras.

Su enfoque es estrictamente educativo: no da recomendaciones personalizadas de inversion, no promueve trading, no ofrece senales y no promete retornos.`,
  },
  {
    title: "Texto para agenda o evento",
    text: `Foro Agora propone una instancia introductoria de educacion financiera para jovenes. La charla aborda finanzas personales, ahorro, riesgo, inversion responsable y pensamiento critico, con lenguaje claro y sin necesidad de conocimientos previos.

La actividad no incluye recomendaciones de inversion, trading ni promesas de retorno.`,
  },
];

const guardrails = [
  "Decir educacion financiera, no asesoramiento financiero.",
  "Decir inversion responsable o analisis fundamental introductorio, no trading.",
  "No presentar a Foro Agora como broker, curso pago o servicio de senales.",
  "No prometer rentabilidad, independencia financiera ni resultados economicos.",
];

const PressKitPage = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  const copyText = async (key: string, text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }
    } catch {
      fallbackCopy(text);
    }

    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey((current) => (current === key ? null : current)), 1800);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-white pt-32 pb-16 text-foreground dark:bg-black dark:text-white md:pt-40 md:pb-20">
        <div className="absolute -left-20 top-24 h-64 w-64 rounded-full bg-sun" />
        <div className="container relative">
          <SectionFade>
            <div className="flex max-w-4xl flex-col gap-8 md:flex-row md:items-center">
              <img src={logoMark} alt="" className="h-24 w-20 object-contain object-center dark:invert" />
              <div>
                <p className="font-hand text-3xl text-blue-pop md:text-4xl">Prensa y aliados</p>
                <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
                  Media kit de Foro Agora
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/75 dark:text-white/75">
                  Informacion oficial para presentar, citar o compartir Foro Agora de forma precisa, cuidando el enfoque educativo del proyecto.
                </p>
              </div>
            </div>
          </SectionFade>
        </div>
      </section>

      <section className="border-y border-border bg-background py-12 md:py-16">
        <div className="container grid gap-4 md:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="rounded-lg border border-border bg-card p-5">
              <fact.icon className="mb-4 text-blue-pop" size={22} />
              <p className="text-xs font-heading font-semibold uppercase tracking-widest text-muted-foreground">{fact.label}</p>
              <p className="mt-2 font-heading text-lg font-black leading-snug text-foreground">{fact.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="font-hand text-3xl text-orange-pop">Boilerplate</p>
            <h2 className="mt-2 text-3xl font-black leading-tight md:text-5xl">
              Textos oficiales para copiar
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Estos textos pueden usarse en notas, newsletters, agendas, convocatorias o presentaciones institucionales.
            </p>
          </div>

          <div className="grid gap-5">
            {boilerplates.map((item) => (
              <article key={item.title} className="rounded-lg border border-border bg-card p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 font-heading text-xl font-black">
                    <FileText size={20} className="text-orange-pop" />
                    {item.title}
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => copyText(item.title, item.text)}>
                    {copiedKey === item.title ? <Check size={15} /> : <Copy size={15} />}
                    {copiedKey === item.title ? "Copiado" : "Copiar"}
                  </Button>
                </div>
                <pre className="mt-5 whitespace-pre-wrap rounded-lg border border-border bg-background p-4 font-sans text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </pre>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-16 dark:bg-black md:py-24">
        <div className="container grid gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-5 flex items-center gap-2 font-heading text-xl font-black">
              <ShieldCheck size={21} className="text-blue-pop" />
              Pautas de uso
            </div>
            <div className="space-y-3">
              {guardrails.map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-5 flex items-center gap-2 font-heading text-xl font-black">
              <LinkIcon size={21} className="text-orange-pop" />
              Links oficiales
            </div>
            <div className="grid gap-3">
              {officialLinks.map(([label, url]) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 text-sm font-heading font-black text-foreground transition-colors hover:bg-secondary"
                >
                  <span>{label}</span>
                  <ExternalLink size={16} className="shrink-0 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sun py-12 md:py-20">
        <div className="container grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-3xl font-black leading-tight md:text-5xl">
              Contacto oficial
            </h2>
            <p className="mt-4 max-w-2xl text-foreground/75">
              Para notas, entrevistas, alianzas o consultas institucionales, usar siempre los canales oficiales de Foro Agora.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild variant="default" size="cta" className="bg-foreground text-background hover:bg-foreground/85">
              <a href="mailto:contacto@foroagora.org">
                <Mail size={17} />
                contacto@foroagora.org
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-foreground/20 bg-white/40 font-heading font-black">
              <Link to="/difundir">Ver kit de difusion</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default PressKitPage;
