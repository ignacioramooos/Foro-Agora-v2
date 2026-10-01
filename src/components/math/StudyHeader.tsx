import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import logoMark from "@/assets/stone-trail-logo.png";

const StudyHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:h-20 sm:px-6">
        <Link to="/practica" className="flex items-center gap-2.5 font-heading text-lg font-black text-foreground sm:text-xl">
          <img src={logoMark} alt="" className="h-10 w-8 object-contain dark:invert sm:h-12 sm:w-9" />
          <span>Foro Agora</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === "dark" ? "Passer au mode clair" : "Passer au mode sombre"}>
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
      </div>
    </header>
  );
};

export default StudyHeader;