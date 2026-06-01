import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle2, Clock, Mail, MapPin, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";

const formats = [
  {
    title: "Charla introductoria",
    time: "45-60 min",
    desc: "Una instancia clara para estudiantes que nunca tuvieron educación financiera formal.",
  },
  {
    title: "Clase taller",
    time: "75-90 min",
    desc: "Trabajo práctico con conceptos de ahorro, riesgo, instrumentos y lectura básica de empresas.",
  },
  {
    title: "Ciclo de clases",
    time: "3-6 encuentros",
    desc: "Un recorrido progresivo desde finanzas personales hasta análisis fundamental inicial.",
  },
];

const safeguards = [
  "No damos recomendaciones personalizadas de inversión.",
  "No promovemos trading, señales ni promesas de retorno.",
  "El lenguaje se adapta a estudiantes sin experiencia previa.",
  "El foco está en pensamiento crítico, hábitos y responsabilidad.",
];

const InstitutionsPage = () => (
  <>
    <section className="relative overflow-hidden bg-white pt-32 pb-16 text-foreground dark:bg-black dark:text-white md:pt-40 md:pb-20">
      <div className="absolute -left-20 top-24 h-64 w-64 rounded-full bg-sun" />
      <div className="container relative">
        <SectionFade>
          <p className="font-hand text-3xl text-blue-pop md:text-4xl">Para instituciones</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            Una charla gratuita de educación financiera para tus estudiantes
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/75 dark:text-white/75">
            Foro Agora acerca herramientas de finanzas personales, inversión responsable y análisis fundamental a jóvenes de Uruguay, con un enfoque educativo y sin fines de lucro.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="cta" size="cta">
              <Link to="/partners">
                Coordinar una instancia
                <ArrowRight size={17} />
              </Link>
            </Button>
            <Button asChild variant="cta-outline" size="cta">
              <a href="mailto:contacto@foroagora.org">Escribir por email</a>
            </Button>
          </div>
        </SectionFade>
      </div>
    </section>

    <section className="border-y border-border bg-background py-12 md:py-20">
      <div className="container">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: Users, label: "Público", value: "Jóvenes de 15 a 25 años" },
            { icon: MapPin, label: "Ubicación", value: "Montevideo o modalidad a coordinar" },
            { icon: Clock, label: "Duración", value: "45 a 90 minutos" },
            { icon: BookOpen, label: "Nivel", value: "Sin conocimientos previos" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-border bg-card p-6">
              <item.icon className="mb-4 text-blue-pop" size={22} />
              <p className="text-xs font-heading font-semibold uppercase tracking-widest text-muted-foreground">{item.label}</p>
              <p className="mt-2 font-heading text-lg font-black text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-background py-16 md:py-24">
      <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="font-hand text-3xl text-orange-pop">Qué proponemos</p>
          <h2 className="mt-2 text-3xl font-black leading-tight md:text-5xl">
            Educación financiera seria, cercana y cuidada
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            La propuesta está pensada para instituciones que quieren sumar una instancia práctica sin convertir la educación financiera en especulación. Enseñamos conceptos, criterios y preguntas útiles.
          </p>
          <div className="mt-8 rounded-lg border border-border bg-card p-6">
            <div className="mb-3 flex items-center gap-2 font-heading font-black text-foreground">
              <ShieldCheck size={20} className="text-blue-pop" />
              Estándar educativo
            </div>
            <div className="space-y-3">
              {safeguards.map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {formats.map((format) => (
            <div key={format.title} className="rounded-lg border border-border bg-card p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="font-heading text-xl font-black">{format.title}</h3>
                <span className="w-fit rounded-full bg-blue-soft px-3 py-1 text-xs font-heading font-black text-blue-pop">
                  {format.time}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{format.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-sun py-12 md:py-20">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-3xl font-black leading-tight md:text-5xl">
              ¿Querés evaluar una charla para tu institución?
            </h2>
            <p className="mt-4 max-w-2xl text-foreground/75">
              Podemos coordinar fecha, formato, público y necesidades técnicas. La propuesta es gratuita y se adapta al contexto de cada grupo.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild variant="default" size="cta" className="bg-foreground text-background hover:bg-foreground/85">
              <Link to="/partners">Completar formulario</Link>
            </Button>
            <a href="mailto:contacto@foroagora.org" className="inline-flex items-center justify-center gap-2 font-heading text-sm font-black text-foreground underline underline-offset-4">
              <Mail size={16} />
              contacto@foroagora.org
            </a>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default InstitutionsPage;
