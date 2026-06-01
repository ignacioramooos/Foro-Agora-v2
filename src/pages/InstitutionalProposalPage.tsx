import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  Printer,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const formats = [
  {
    title: "Charla introductoria",
    detail: "45 a 60 minutos",
    text: "Una primera instancia clara para grupos que todavia no tuvieron educacion financiera formal.",
  },
  {
    title: "Clase taller",
    detail: "75 a 90 minutos",
    text: "Trabajo aplicado con conceptos de ahorro, riesgo, instrumentos, empresas y toma de decisiones.",
  },
  {
    title: "Ciclo breve",
    detail: "3 a 6 encuentros",
    text: "Un recorrido progresivo para instituciones que quieran profundizar despues de una primera charla.",
  },
];

const contentBlocks = [
  "Finanzas personales: presupuesto, ahorro, deuda, inflacion y horizonte temporal.",
  "Inversion responsable: relacion riesgo-retorno, diversificacion y sesgos comunes.",
  "Mercado de capitales: acciones, bonos, fondos, brokers y custodios a nivel introductorio.",
  "Analisis fundamental inicial: como leer una empresa sin convertirlo en recomendacion de compra.",
  "Pensamiento critico: preguntas utiles antes de tomar decisiones financieras.",
];

const safeguards = [
  "No damos recomendaciones personalizadas de inversion.",
  "No promovemos trading, senales ni promesas de retorno.",
  "No vendemos cursos, productos financieros ni servicios de intermediacion.",
  "Adaptamos el lenguaje a estudiantes sin conocimientos previos.",
];

const requirements = [
  "Proyector o pantalla para presentar.",
  "Audio basico si el grupo o el salon lo requiere.",
  "Un referente institucional para coordinar fecha, duracion y perfil del grupo.",
  "Modalidad presencial en Montevideo o formato a coordinar.",
];

const InstitutionalProposalPage = () => {
  const handlePrint = () => window.print();

  return (
    <div className="bg-background text-foreground print:bg-white">
      <section className="border-b border-border bg-white pt-28 pb-10 dark:bg-black print:border-zinc-300 print:pt-8">
        <div className="container">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-heading text-sm font-black uppercase tracking-widest text-blue-pop">
                Foro Agora
              </p>
              <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight md:text-6xl print:text-4xl">
                Propuesta gratuita de educacion financiera para instituciones
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground print:text-base">
                Una instancia educativa para jovenes de Uruguay sobre finanzas personales, inversion responsable
                y pensamiento critico, con enfoque sin fines de lucro y sin recomendaciones de inversion.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 print:hidden">
              <Button type="button" variant="cta" size="cta" onClick={handlePrint}>
                <Printer size={17} />
                Imprimir / PDF
              </Button>
              <Button asChild variant="cta-outline" size="cta">
                <Link to="/partners?source=instituciones">
                  Coordinar
                  <ArrowRight size={17} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background py-8 print:border-zinc-300 print:py-6">
        <div className="container grid gap-4 md:grid-cols-4">
          {[
            { icon: Users, label: "Publico", value: "Jovenes de 15 a 25 anos" },
            { icon: Clock, label: "Duracion", value: "45 a 90 minutos" },
            { icon: BookOpen, label: "Nivel", value: "Introductorio" },
            { icon: ShieldCheck, label: "Costo", value: "Gratuito" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-border bg-card p-5 print:border-zinc-300 print:bg-white">
              <item.icon className="mb-3 text-blue-pop print:text-zinc-700" size={21} />
              <p className="text-xs font-heading font-semibold uppercase tracking-widest text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-2 font-heading text-lg font-black text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 print:py-8">
        <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-black leading-tight print:text-2xl">Objetivo</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground print:text-zinc-700">
              Acercar educacion financiera seria, cercana y cuidada a estudiantes que estan empezando a tomar
              decisiones sobre ahorro, consumo, trabajo, deuda e inversion. La meta es que salgan con mejores
              preguntas, criterios mas claros y menos vulnerabilidad frente a promesas faciles.
            </p>
            <div className="mt-7 rounded-lg border border-border bg-card p-6 print:border-zinc-300 print:bg-white">
              <div className="mb-4 flex items-center gap-2 font-heading font-black">
                <ShieldCheck size={20} className="text-blue-pop print:text-zinc-700" />
                Estandar de cuidado
              </div>
              <div className="space-y-3">
                {safeguards.map((item) => (
                  <div key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground print:text-zinc-700">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent print:text-zinc-700" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-black leading-tight print:text-2xl">Formatos posibles</h2>
            <div className="mt-5 grid gap-4">
              {formats.map((format) => (
                <div key={format.title} className="rounded-lg border border-border bg-card p-5 print:border-zinc-300 print:bg-white">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="font-heading text-xl font-black">{format.title}</h3>
                    <span className="w-fit rounded-full bg-blue-soft px-3 py-1 text-xs font-heading font-black text-blue-pop print:border print:border-zinc-300 print:bg-white print:text-zinc-700">
                      {format.detail}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground print:text-zinc-700">
                    {format.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-12 dark:bg-black print:border-zinc-300 print:bg-white print:py-8">
        <div className="container grid gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-2 font-heading text-xl font-black">
              <FileText size={21} className="text-orange-pop print:text-zinc-700" />
              Contenidos sugeridos
            </div>
            <div className="space-y-3">
              {contentBlocks.map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground print:text-zinc-700">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent print:text-zinc-700" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2 font-heading text-xl font-black">
              <BookOpen size={21} className="text-blue-pop print:text-zinc-700" />
              Requerimientos tecnicos
            </div>
            <div className="space-y-3">
              {requirements.map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground print:text-zinc-700">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent print:text-zinc-700" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sun py-10 print:bg-white print:py-8">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-black leading-tight print:text-2xl">Contacto y coordinacion</h2>
              <p className="mt-3 max-w-2xl text-foreground/75 print:text-zinc-700">
                Para coordinar una instancia, definir el formato o ajustar la propuesta al grupo, pueden escribir
                a contacto@foroagora.org o completar el formulario institucional.
              </p>
            </div>
            <div className="flex flex-col gap-3 print:hidden">
              <Button asChild variant="default" size="cta" className="bg-foreground text-background hover:bg-foreground/85">
                <Link to="/partners?source=instituciones">Completar formulario</Link>
              </Button>
              <a href="mailto:contacto@foroagora.org" className="inline-flex items-center justify-center gap-2 font-heading text-sm font-black text-foreground underline underline-offset-4">
                <Mail size={16} />
                contacto@foroagora.org
              </a>
            </div>
            <div className="hidden print:block print:text-sm print:text-zinc-700">
              contacto@foroagora.org - https://foroagora.org/partners?source=instituciones
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InstitutionalProposalPage;
