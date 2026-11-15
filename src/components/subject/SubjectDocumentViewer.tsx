import { useRef } from "react";
import { ExternalLink, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { drivePreviewUrl, driveViewUrl } from "@/content/subjects/helpers";
import { useSubject } from "./SubjectContext";

interface Props {
  docId: string;
  title: string;
  className?: string;
  frameClassName?: string;
  compact?: boolean;
}

const SubjectDocumentViewer = ({ docId, title, className, frameClassName, compact }: Props) => {
  const { t } = useSubject();
  const ref = useRef<HTMLDivElement>(null);
  const fullscreen = () => {
    const el = ref.current;
    if (el?.requestFullscreen) el.requestFullscreen().catch(() => window.open(driveViewUrl(docId), "_blank", "noopener"));
    else window.open(driveViewUrl(docId), "_blank", "noopener");
  };

  return (
    <div ref={ref} className={cn("flex min-h-0 flex-col overflow-hidden border border-border bg-card", className)}>
      <div className="flex min-h-12 items-center justify-between gap-2 border-b border-border px-3 py-2">
        {!compact ? <h3 className="min-w-0 truncate font-heading text-sm font-semibold text-foreground">{title}</h3> : <span />}
        <div className="flex shrink-0 items-center gap-1.5">
          <Button variant="ghost" size="sm" onClick={fullscreen} aria-label={t.docViewer.fullscreen}>
            <Maximize2 />
            <span className="hidden sm:inline">{t.docViewer.fullscreen}</span>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={driveViewUrl(docId)} target="_blank" rel="noopener noreferrer">
              <ExternalLink /> {t.docViewer.openDrive}
            </a>
          </Button>
        </div>
      </div>
      <iframe
        src={drivePreviewUrl(docId)}
        title={title}
        allow="autoplay; fullscreen"
        allowFullScreen
        loading="lazy"
        className={cn("w-full flex-1 border-0 bg-muted", frameClassName ?? "min-h-[70dvh]")}
      />
      <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
        {t.docViewer.fallbackPrefix}{" "}
        <a href={driveViewUrl(docId)} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline">
          {t.docViewer.fallbackLink}
        </a>.
      </p>
    </div>
  );
};

export default SubjectDocumentViewer;
