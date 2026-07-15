import { ExternalLink } from "lucide-react";
import {
  EVENT_ADDRESS,
  EVENT_LOCATION_NAME,
  getGoogleMapsEmbedUrl,
  getGoogleMapsUrl,
} from "@/lib/classEvent";

interface InjuLocationMapProps {
  className?: string;
}

const InjuLocationMap = ({ className = "" }: InjuLocationMapProps) => {
  const googleMapsUrl = getGoogleMapsUrl();

  return (
    <div className={`overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm ${className}`}>
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-heading font-semibold text-foreground">{EVENT_LOCATION_NAME}</p>
          <p className="mt-1 text-sm text-muted-foreground">{EVENT_ADDRESS}</p>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-blue-pop hover:underline"
        >
          Cómo llegar <ExternalLink size={15} />
        </a>
      </div>
      <div className="relative h-64 border-t border-border md:h-72">
        <iframe
          src={getGoogleMapsEmbedUrl()}
          title={`Mapa de ${EVENT_LOCATION_NAME}`}
          className="h-full w-full border-0 pointer-events-none"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          tabIndex={-1}
        />
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0 z-10"
          aria-label={`Abrir ${EVENT_LOCATION_NAME} en Google Maps`}
        >
          <span className="sr-only">Abrir ubicación en Google Maps</span>
        </a>
      </div>
    </div>
  );
};

export default InjuLocationMap;
