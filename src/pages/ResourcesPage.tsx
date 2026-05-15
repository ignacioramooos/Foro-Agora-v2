import SectionFade from "@/components/SectionFade";
import { BookOpen } from "lucide-react";
import ContentLibrary from "@/components/dashboard/ContentLibrary";

const books = [
  { title: "El inversor inteligente", author: "Benjamin Graham", pitch: "La biblia del value investing. Lectura obligatoria." },
  { title: "One Up on Wall Street", author: "Peter Lynch", pitch: "Cómo encontrar buenas inversiones en tu vida cotidiana." },
  { title: "Padre Rico, Padre Pobre", author: "Robert Kiyosaki", pitch: "Introducción accesible a la mentalidad financiera." },
  { title: "Beating the Street", author: "Peter Lynch", pitch: "Más del legendario Peter Lynch." },
];

const ResourcesPage = () => {
  return (
    <>
      <section className="pt-32 md:pt-40 pb-20">
        <div className="container">
          <SectionFade>
            <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-6">
              Recursos
            </p>
            <h1 className="text-3xl md:text-5xl text-foreground max-w-3xl mb-6">
              Aprendé a tu ritmo
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Videos de las clases y materiales adjuntos para profundizar en cada tema del recorrido.
            </p>
          </SectionFade>
        </div>
      </section>

      <section className="py-24 md:py-32 border-y border-border">
        <div className="container max-w-4xl">
          <h2 className="text-2xl md:text-3xl text-foreground mb-3 font-heading">Biblioteca de clases y recursos</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Esta sección usa la misma fuente de contenido que el dashboard para mantener consistencia.
          </p>
          <ContentLibrary mode="public" showHeader={false} />
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border">
        <div className="container max-w-3xl">
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Lectura recomendada
          </p>
          <h2 className="text-2xl md:text-3xl text-foreground mb-10 font-heading">
            Libros que cambian tu perspectiva
          </h2>
          <div className="divide-y divide-border">
            {books.map((b) => (
              <div key={b.title} className="py-6 first:pt-0 last:pb-0 flex gap-6 items-start">
                <div className="w-16 h-20 bg-secondary rounded flex-shrink-0 flex items-center justify-center">
                  <BookOpen size={20} className="text-muted-foreground/30" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{b.title}</h3>
                  <p className="text-muted-foreground text-sm mb-1">{b.author}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{b.pitch}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ResourcesPage;
