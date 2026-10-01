import { Calculator, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const DESMOS_URL = "https://www.desmos.com/calculator?embed";

const DesmosPanel = ({ onClose }: { onClose?: () => void }) => (
  <section className="flex h-full min-h-0 flex-col bg-card" aria-label="Calculatrice graphique Desmos">
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
      <div className="flex items-center gap-2">
        <Calculator className="h-4 w-4 text-muted-foreground" />
        <h2 className="font-heading text-sm font-semibold text-foreground">Calculatrice</h2>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <a href="https://www.desmos.com/calculator" target="_blank" rel="noopener" aria-label="Ouvrir Desmos dans un nouvel onglet">
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
        {onClose && <Button variant="ghost" size="sm" onClick={onClose}>Fermer</Button>}
      </div>
    </div>
    <iframe
      src={DESMOS_URL}
      title="Calculatrice graphique Desmos"
      className="min-h-[500px] flex-1 border-0 bg-background"
      allow="clipboard-read; clipboard-write"
      loading="eager"
    />
  </section>
);

export default DesmosPanel;