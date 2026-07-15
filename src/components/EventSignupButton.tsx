import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
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
  const destination = isLoggedIn ? getRegistrationPath(classId) : getEventAuthPath(classId);

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
