import { Calculator, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSubjectStrings, type SubjectStrings } from "@/content/subjects/i18n";

// The `?embed` variant only exposes the graph and keypad at narrow widths.
// The full calculator keeps the expressions drawer visible and editable.
const DESMOS_URL = "https://www.desmos.com/calculator";

const DesmosPanel = ({
  onClose,
  strings: d = getSubjectStrings("fr").desmos,
}: {
  onClose?: () => void;
  strings?: SubjectStrings["desmos"];
}) => (
  <section className="flex h-full min-h-0 flex-col bg-card" aria-label={d.aria}>
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
      <div className="flex items-center gap-2">
        <Calculator className="h-4 w-4 text-muted-foreground" />
        <h2 className="font-heading text-sm font-semibold text-foreground">{d.title}</h2>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <a href="https://www.desmos.com/calculator" target="_blank" rel="noopener" aria-label={d.openNewTab}>
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
        {onClose && <Button variant="ghost" size="sm" onClick={onClose}>{d.close}</Button>}
      </div>
    </div>
    <iframe
      src={DESMOS_URL}
      title={d.aria}
      className="min-h-[500px] flex-1 border-0 bg-background"
      allow="clipboard-read; clipboard-write"
      loading="eager"
    />
  </section>
);

export default DesmosPanel;