import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SectionFade from "@/components/SectionFade";

const formats = [
  {
    title: "Encuentro introductorio",
    time: "45-60 min",
    desc: "Una instancia abierta para jovenes que nunca tuvieron educacion financiera formal.",
  },
  {
    title: "Taller abierto",
    time: "75-90 min",
    desc: "Trabajo practico con conceptos de ahorro, riesgo, instrumentos y lectura basica de empresas.",
  },
  {
    title: "Ciclo abierto",
    time: "3-6 encuentros",
    desc: "Un recorrido progresivo desde finanzas personales hasta analisis fundamental inicial.",
  },
];

const safeguards = [
  "No damos recomendaciones personalizadas de inversion.",
  "No promovemos trading, senales ni promesas de retorno.",
  "El lenguaje se adapta a jovenes sin experiencia previa.",
  "El foco esta en pensamiento critico, habitos y responsabilidad.",
];

const steps = [
  {
    icon: MessageSquare,
    title: "1. Conversamos 15 minutos",
    desc: "Alineamos objetivo, formato y condiciones para que la actividad sea abierta y gratuita.",
  },
  {
    icon: CalendarCheck,
    title: "2. Confirmamos formato",
    desc: "Elegimos encuentro, taller o ciclo breve segun disponibilidad y necesidades.",
  },
  {
    icon: BookOpen,
    title: "3. Cuidamos el acceso",
    desc: "Foro Agora mantiene el enfoque educativo, abierto y sin fines de lucro.",
  },
];

const faqs = [
  {
    q: "Tiene costo para asistir?",
    a: "No. La propuesta de Foro Agora es gratuita y sin fines de lucro.",
  },
  {
    q: "Necesitan conocimientos previos?",
    a: "No. La actividad esta pensada para jovenes que pueden estar viendo estos temas por primera vez.",
  },
  {
    q: "Hablan de trading o recomiendan inversiones?",
    a: "No. Trabajamos educacion financiera, pensamiento critico y conceptos de inversion responsable, sin recomendaciones personalizadas, senales ni promesas de retorno.",
  },
  {
    q: "Para que edades funciona mejor?",
    a: "El foco ideal es jovenes de 15 a 25 anos. Podemos ajustar ejemplos y profundidad segun el grupo.",
  },
  {
    q: "La actividad es cerrada?",
    a: "No. El objetivo de Foro Agora es que las actividades sean abiertas a cualquier joven que se registre, sin pertenecer a una institucion especifica.",
  },
];

const InstitutionsPage = () => (
  <>
    <section className="relative overflow-hidden bg-white pt-32 pb-16 text-foreground dark:bg-black dark:text-white md:pt-40 md:pb-20">
      <div className="absolute -left-20 top-24 h-64 w-64 rounded-full bg-sun" />
      <div className="container relative">
        <SectionFade>
          <p className="font-hand text-3xl text-blue-pop md:text-4xl">Actividades abiertas</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            Educacion financiera gratuita, abierta a cualquier joven
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/75 dark:text-white/75">
            Este material sirve para conversaciones directas del equipo de Foro Agora. La prioridad es organizar actividades publicas, gratuitas y abiertas, no encuentros cerrados para una institucion.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="cta" size="cta">
              <a href="mailto:contacto@foroagora.org">
                Contactar al equipo
                <ArrowRight size={17} />
              </a>
            </Button>
            <Button asChild variant="cta-outline" size="cta">
              <Link to="/propuesta-instituciones">
                Ver propuesta
                <FileText size={17} />
              </Link>
            </Button>
          </div>
        </SectionFade>
      </div>
    </section>

    <section className="border-y border-border bg-background py-12 md:py-20">
      <div className="container">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: Users, label: "Publico", value: "Jovenes de 15 a 25 anos" },
            { icon: MapPin, label: "Acceso", value: "Actividad abierta con registro" },
            { icon: Clock, label: "Duracion", value: "45 a 90 minutos" },
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
          <p className="font-hand text-3xl text-orange-pop">Que proponemos</p>
          <h2 className="mt-2 text-3xl font-black leading-tight md:text-5xl">
            Educacion financiera seria, cercana y cuidada
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            La propuesta esta pensada para actividades abiertas donde cualquier joven pueda registrarse. Ensenamos conceptos, criterios y preguntas utiles sin convertir la educacion financiera en especulacion.
          </p>
          <div className="mt-8 rounded-lg border border-border bg-card p-6">
            <div className="mb-3 flex items-center gap-2 font-heading font-black text-foreground">
              <ShieldCheck size={20} className="text-blue-pop" />
              Estandar educativo
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

    <section className="border-y border-border bg-white py-16 dark:bg-black md:py-24">
      <div className="container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <p className="font-hand text-3xl text-blue-pop">Como se coordina</p>
          <h2 className="mt-2 text-3xl font-black leading-tight md:text-5xl">
            Simple, gratuito y sin letra chica
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            La idea es evaluar rapido si una actividad abierta tiene sentido. Primero definimos condiciones de acceso; despues adaptamos la instancia.
          </p>
          <div className="mt-7 grid gap-3">
            {steps.map((step) => (
              <div key={step.title} className="flex gap-4 rounded-lg border border-border bg-card p-5">
                <step.icon className="mt-1 shrink-0 text-orange-pop" size={21} />
                <div>
                  <h3 className="font-heading font-black">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-2 flex items-center gap-2 font-heading text-xl font-black">
            <HelpCircle size={21} className="text-blue-pop" />
            Preguntas frecuentes
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.q} value={`faq-${index}`}>
                <AccordionTrigger className="text-left font-heading font-black">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>

    <section className="bg-sun py-12 md:py-20">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-3xl font-black leading-tight md:text-5xl">
              Queres conversar con Foro Agora?
            </h2>
            <p className="mt-4 max-w-2xl text-foreground/75">
              Podemos conversar sobre formato, publico, registro y necesidades tecnicas. La prioridad es mantener actividades abiertas y gratuitas.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild variant="default" size="cta" className="bg-foreground text-background hover:bg-foreground/85">
              <a href="mailto:contacto@foroagora.org">Escribir al equipo</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-foreground/20 bg-white/40 font-heading font-black">
              <Link to="/propuesta-instituciones">
                Ver propuesta imprimible
                <FileText size={16} />
              </Link>
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
