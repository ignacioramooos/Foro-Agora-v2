import SectionFade from "@/components/SectionFade";
import GlossaryContent from "@/components/GlossaryContent";

const GlossaryPage = () => (
  <>
    <section className="pt-32 md:pt-40 pb-20">
      <div className="container">
        <SectionFade>
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-6">
            Glosario financiero
          </p>
          <h1 className="text-3xl md:text-5xl text-foreground max-w-3xl mb-4 leading-tight">
            Todos los términos que necesitás conocer
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed mb-12">
            Definiciones claras y ejemplos prácticos. Sin jerga innecesaria.
          </p>
        </SectionFade>
        <SectionFade delay={0.1}>
          <GlossaryContent />
        </SectionFade>
      </div>
    </section>
  </>
);

export default GlossaryPage;
