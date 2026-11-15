import { Link } from "react-router-dom";
import { Globe, LayoutGrid, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import logoMark from "@/assets/stone-trail-logo.png";
import StudyAuth from "@/components/math/StudyAuth";
import { LOCALE_LABELS, type SubjectLocale } from "@/content/subjects/i18n";
import SubjectSearchDialog from "./SubjectSearchDialog";
import SubjectSettings from "./SubjectSettings";
import { useSubject } from "./SubjectContext";

const LOCALES: SubjectLocale[] = ["fr", "en", "es", "pt"];

const SubjectHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const { subject, basePath, locale, setLocale, t } = useSubject();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-4 sm:h-20 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link to={basePath} className="flex items-center gap-2.5 font-heading text-lg font-black text-foreground sm:text-xl">
            <img src={logoMark} alt="" className="h-10 w-8 object-contain dark:invert sm:h-12 sm:w-9" />
            <span>Foro Agora</span>
          </Link>
          <Link
            to="/classes"
            className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground sm:inline-flex"
            title={t.nav.allClasses}
          >
            <LayoutGrid className="h-3 w-3" />
            <span>{subject.name}</span>
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <label className="hidden items-center gap-1 rounded-md px-1.5 text-xs text-muted-foreground hover:text-foreground sm:inline-flex">
            <Globe className="h-3.5 w-3.5" />
            <select
              aria-label="Language"
              value={locale}
              onChange={(e) => setLocale(e.target.value as SubjectLocale)}
              className="cursor-pointer bg-transparent py-1 text-xs font-semibold uppercase text-foreground focus:outline-none"
            >
              {LOCALES.map((code) => (
                <option key={code} value={code} className="bg-background text-foreground">
                  {LOCALE_LABELS[code]}
                </option>
              ))}
            </select>
          </label>
          <SubjectSearchDialog />
          <SubjectSettings />
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === "dark" ? t.theme.toLight : t.theme.toDark}>
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
          <StudyAuth />
        </div>
      </div>
    </header>
  );
};

export default SubjectHeader;
