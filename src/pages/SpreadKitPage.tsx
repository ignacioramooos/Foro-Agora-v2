import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Copy, Link as LinkIcon, MessageCircle, Send, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";

const shareLinks = [
  { label: "Sitio", url: "https://foroagora.org" },
  { label: "Inscripcion", url: "https://foroagora.org/registro" },
  { label: "Recursos", url: "https://foroagora.org/recursos" },
  { label: "Prensa", url: "https://foroagora.org/prensa" },
];

const messages = [
  {
    title: "WhatsApp para estudiantes",
    channel: "WhatsApp",
    icon: MessageCircle,
    text: `Estoy compartiendo Foro Agora: una iniciativa uruguaya sin fines de lucro para aprender educacion financiera, finanzas personales e inversion responsable desde cero.

No es trading, no son senales y no prometen retornos. Es educacion financiera gratuita para jovenes.

Inscripcion: https://foroagora.org/registro
Sitio: https://foroagora.org`,
  },
  {
    title: "LinkedIn para compartir el proyecto",
    channel: "LinkedIn",
    icon: Send,
    text: `Conoci Foro Agora, una iniciativa uruguaya sin fines de lucro que acerca educacion financiera gratuita a jovenes.

El enfoque es educativo: finanzas personales, inversion responsable y pensamiento critico. Sin recomendaciones de inversion, sin trading y sin promesas de retorno.

Sitio: https://foroagora.org
Inscripcion: https://foroagora.org/registro`,
  },
  {
    title: "Mensaje corto para historias",
    channel: "Instagram",
    icon: Share2,
    text: `Educacion financiera gratuita para jovenes en Uruguay.

Foro Agora ensena finanzas personales, inversion responsable y analisis fundamental desde cero.

Sin trading. Sin senales. Sin promesas raras.

https://foroagora.org`,
  },
];

const hashtags = [
  "#EducacionFinanciera",
  "#Uruguay",
  "#Jovenes",
  "#FinanzasPersonales",
  "#InversionResponsable",
  "#ForoAgora",
];

const SpreadKitPage = () => {
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
        <div className="absolute -right-24 top-20 h-64 w-64 rounded-full bg-blue-soft" />
        <div className="container relative">
          <SectionFade>
            <p className="font-hand text-3xl text-orange-pop md:text-4xl">Kit de difusion</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              Ayudanos a que Foro Agora llegue a mas jovenes
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/75 dark:text-white/75">
              Textos listos para compartir con estudiantes, amigos, familias y referentes. Copia, pega y adapta el mensaje segun el contexto.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="cta" size="cta">
                <Link to="/registro">Inscribir a alguien</Link>
              </Button>
              <Button asChild variant="cta-outline" size="cta">
                <Link to="/recursos">Ver recursos</Link>
              </Button>
            </div>
          </SectionFade>
        </div>
      </section>

      <section className="border-y border-border bg-background py-12 md:py-16">
        <div className="container">
          <div className="grid gap-4 md:grid-cols-4">
            {shareLinks.map((item) => (
              <div key={item.label} className="rounded-lg border border-border bg-card p-5">
                <div className="mb-3 flex items-center gap-2 font-heading font-black">
                  <LinkIcon size={17} className="text-blue-pop" />
                  {item.label}
                </div>
                <a href={item.url} className="break-all text-sm text-muted-foreground underline underline-offset-4">
                  {item.url}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <p className="font-hand text-3xl text-blue-pop">Mensajes listos</p>
            <h2 className="mt-2 text-3xl font-black leading-tight md:text-5xl">
              Copia el texto y compartilo desde tu cuenta
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Evitamos promesas financieras y dejamos claro el enfoque educativo. Si sos parte de Foro Agora, verifica que estes publicando desde una cuenta correcta antes de usarlo como comunicacion oficial.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {messages.map((message) => (
              <article key={message.title} className="rounded-lg border border-border bg-card p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-xs font-heading font-black uppercase tracking-widest text-muted-foreground">
                      <message.icon size={16} className="text-orange-pop" />
                      {message.channel}
                    </div>
                    <h3 className="font-heading text-xl font-black">{message.title}</h3>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyText(message.title, message.text)}
                    className="shrink-0"
                  >
                    {copiedKey === message.title ? <Check size={15} /> : <Copy size={15} />}
                    {copiedKey === message.title ? "Copiado" : "Copiar"}
                  </Button>
                </div>
                <pre className="mt-5 whitespace-pre-wrap rounded-lg border border-border bg-background p-4 font-sans text-sm leading-relaxed text-muted-foreground">
                  {message.text}
                </pre>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sun py-12 md:py-20">
        <div className="container grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-3xl font-black leading-tight md:text-5xl">
              Hashtags y criterio de uso
            </h2>
            <p className="mt-4 max-w-2xl text-foreground/75">
              Usalos como apoyo, no como relleno. Lo importante es que el mensaje diga claramente que Foro Agora es educativo, gratuito y sin recomendaciones de inversion.
            </p>
          </div>
          <div className="flex max-w-xl flex-wrap gap-2">
            {hashtags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/60 px-3 py-1 text-sm font-heading font-black text-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default SpreadKitPage;
