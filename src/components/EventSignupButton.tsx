import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useClassRegistrationStatus } from "@/hooks/useClassRegistrationStatus";
import { getEventAuthPath, getRegistrationPath } from "@/lib/classEvent";

interface EventSignupButtonProps {
  classId: string;
  className?: string;
  label?: string;
  variant?: "cta" | "default" | "secondary" | "outline";
}

const EventSignupButton = ({
  classId,
  className,
  label = "Inscribirme gratis",
  variant = "cta",
}: EventSignupButtonProps) => {
  const { isLoggedIn } = useAuth();
  const { isRegistered, registrationChecked } = useClassRegistrationStatus(classId);
  const destination = isLoggedIn ? getRegistrationPath(classId) : getEventAuthPath(classId);

  if (isLoggedIn && !registrationChecked) {
    return (
      <Button variant="secondary" size="cta" className={className} disabled aria-live="polite">
        <Loader2 size={17} className="animate-spin" />
        Verificando inscripción...
      </Button>
    );
  }

  if (isRegistered) {
    return (
      <Button variant="secondary" size="cta" className={className} disabled>
        <CheckCircle2 size={17} />
        Ya estás inscripto
      </Button>
    );
  }

  return (
    <Button asChild variant={variant} size="cta" className={className}>
      <Link to={destination}>
        {label}
        <ArrowRight size={17} />
      </Link>
    </Button>
  );
};

export default EventSignupButton;
