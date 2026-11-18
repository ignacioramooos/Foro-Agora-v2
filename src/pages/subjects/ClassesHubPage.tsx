import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  Globe,
  Layers,
  Lock,
  Mail,
  Moon,
  Printer,
  Sparkles,
  Sun,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import logoMark from "@/assets/stone-trail-logo.png";
import { canAccessClassroom, classrooms } from "@/content/subjects/registry";
import { LOCALE_LABELS, type SubjectLocale } from "@/content/subjects/i18n";
import { readClassroomLocale, saveClassroomLocale, SUPPORTED_LOCALES } from "@/content/subjects/locale";
import { localizeSummary } from "@/content/subjects/localize";

const HUB_COPY: Record<
  SubjectLocale,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    openClass: string;
    chaptersCount: (n: number) => string;
    exercisesCount: (n: number) => string;
    cpgeBadge: string;
    generalBadge: string;
    privateBadge: string;
    hostTitle: string;
    hostSubtitle: string;
    hostPoints: string[];
    howTitle: string;
    howBody: string;
    missionNote: string;
    hostCta: string;
    altEmailCta: string;
    tryTemplate: string;
    offline: string;
    languageLabel: string;
  }
> = {
  fr: {
    eyebrow: "Foro Agora Classrooms · 100 % gratuit",
    title: "Foro Agora Classrooms",
    subtitle:
      "Un espace gratuit et sans distraction pour héberger vos exercices et ressources, connecté à vos outils IA (MCP), accessible hors ligne et privé sur demande.",
    openClass: "Ouvrir l'espace",
    chaptersCount: (n) => `${n} chapitre${n > 1 ? "s" : ""}`,
    exercisesCount: (n) => `${n} exercice${n > 1 ? "s" : ""}`,
    cpgeBadge: "CPGE",
    generalBadge: "Modèle universel",
    privateBadge: "Privé",
    hostTitle: "Étudiant ou professeur ? Créez votre classroom gratuitement.",
    hostSubtitle:
      "Envoyez-nous vos exercices et supports pédagogiques : nous configurons tout pour vous et vos élèves, sans but lucratif.",
    hostPoints: [
      "Plateforme centralisée : exercices LaTeX, indices progressifs, réponses et suivi par chapitre",
      "Serveur MCP dédié pour connecter votre classe à vos modèles et outils IA préférés",
      "Accès hors ligne (PWA) pour réviser même quand le Wi-Fi lâche avant un examen",
      "Public par défaut, ou protégé par connexion et accès contrôlé sur simple demande",
    ],
    howTitle: "Comment ça marche ?",
    howBody:
      "Écrivez à ignacio@foroagora.org ou ignacio@juanignacioramos.com avec les ressources à ajouter, et nous nous occupons du reste.",
    missionNote: "EDUCAR • ACOMPAÑAR • IMPULSAR — 100 % gratuit.",
    hostCta: "Écrire à ignacio@foroagora.org",
    altEmailCta: "ignacio@juanignacioramos.com",
    tryTemplate: "Voir le modèle en direct",
    offline: "Hors ligne",
    languageLabel: "Langue",
  },
  en: {
    eyebrow: "Foro Agora Classrooms · 100% free",
    title: "Foro Agora Classrooms",
    subtitle:
      "A free, focus-oriented space to set up your own classroom—centralized exercises, custom MCP server for AI tools, offline access, and optional login-protected privacy.",
    openClass: "Open classroom",
    chaptersCount: (n) => `${n} chapter${n !== 1 ? "s" : ""}`,
    exercisesCount: (n) => `${n} exercise${n !== 1 ? "s" : ""}`,
    cpgeBadge: "CPGE",
    generalBadge: "Universal template",
    privateBadge: "Private",
    hostTitle: "Student or teacher? Set up your classroom for free.",
    hostSubtitle:
      "Send us the exercises and educational resources you want to include, and we'll take care of the rest—100% free, built for learning.",
    hostPoints: [
      "Centralized platform to organize and practice exercises, hints, solutions, and formula flashcards",
      "Custom MCP server to connect your classroom to your favorite AI models and tools",
      "Offline access so you can study and pass your exam even when Wi-Fi fails",
      "Public by default, with login-protected access and controlled connections upon request",
    ],
    howTitle: "How does it work?",
    howBody:
      "Email ignacio@foroagora.org or ignacio@juanignacioramos.com with the resources you'd like us to add, and we'll set everything up for you.",
    missionNote: "EDUCAR • ACOMPAÑAR • IMPULSAR — Just people helping people learn.",
    hostCta: "Email ignacio@foroagora.org",
    altEmailCta: "ignacio@juanignacioramos.com",
    tryTemplate: "Try live template",
    offline: "Offline",
    languageLabel: "Language",
  },
  es: {
    eyebrow: "Foro Agora Classrooms · 100% gratis",
    title: "Foro Agora Classrooms",
    subtitle:
      "Un espacio gratuito y enfocado en el aprendizaje para tu propia clase: ejercicios centralizados, servidor MCP propio para IA, acceso sin conexión y privacidad opcional.",
    openClass: "Abrir espacio",
    chaptersCount: (n) => `${n} capítulo${n !== 1 ? "s" : ""}`,
    exercisesCount: (n) => `${n} ejercicio${n !== 1 ? "s" : ""}`,
    cpgeBadge: "CPGE",
    generalBadge: "Plantilla universal",
    privateBadge: "Privada",
    hostTitle: "¿Sos estudiante o profesor? Creá tu classroom gratis.",
    hostSubtitle:
      "Envianos los ejercicios y recursos que quieras sumar y nosotros nos encargamos de todo. Sin fines de lucro, para ayudar a aprender mejor.",
    hostPoints: [
      "Plataforma centralizada con LaTeX, pistas progresivas, respuestas y flashcards de fórmulas",
      "Servidor MCP personalizado para conectar tu clase con tus modelos y herramientas de IA",
      "Acceso sin conexión para estudiar incluso cuando falla el Wi-Fi antes de un examen",
      "Pública por defecto, con acceso protegido por login y conexiones controladas si lo pedís",
    ],
    howTitle: "¿Cómo funciona?",
    howBody:
      "Escribinos a ignacio@foroagora.org o ignacio@juanignacioramos.com con los recursos que querés agregar, y nos ocupamos del resto.",
    missionNote: "EDUCAR • ACOMPAÑAR • IMPULSAR — 100% gratis.",
    hostCta: "Escribir a ignacio@foroagora.org",
    altEmailCta: "ignacio@juanignacioramos.com",
    tryTemplate: "Ver plantilla en vivo",
    offline: "Sin conexión",
    languageLabel: "Idioma",
  },
  pt: {
    eyebrow: "Foro Agora Classrooms · 100% gratuito",
    title: "Foro Agora Classrooms",
    subtitle:
      "Um espaço gratuito e focado no aprendizado para sua turma: exercícios centralizados, servidor MCP próprio para IA, acesso offline e privacidade opcional.",
    openClass: "Abrir espaço",
    chaptersCount: (n) => `${n} capítulo${n !== 1 ? "s" : ""}`,
    exercisesCount: (n) => `${n} exercício${n !== 1 ? "s" : ""}`,
    cpgeBadge: "CPGE",
    generalBadge: "Modelo universal",
    privateBadge: "Privada",
    hostTitle: "Estudante ou professor? Crie sua classroom gratuitamente.",
    hostSubtitle:
      "Envie os exercícios e materiais que deseja adicionar e nós cuidamos do resto. 100% gratuito, sem fins lucrativos.",
    hostPoints: [
      "Plataforma centralizada com LaTeX, dicas progressivas, respostas e flashcards",
      "Servidor MCP dedicado para conectar sua turma aos seus modelos e ferramentas de IA",
      "Acesso offline para estudar mesmo quando o Wi-Fi falha antes da prova",
      "Pública por padrão, com acesso protegido por login e conexões controladas sob pedido",
    ],
    howTitle: "Como funciona?",
    howBody:
      "Envie um e-mail para ignacio@foroagora.org ou ignacio@juanignacioramos.com com os materiais desejados e nós configuramos tudo.",
    missionNote: "EDUCAR • ACOMPAÑAR • IMPULSAR — 100% gratuito.",
    hostCta: "Enviar e-mail para ignacio@foroagora.org",
    altEmailCta: "ignacio@juanignacioramos.com",
    tryTemplate: "Ver modelo ao vivo",
    offline: "Offline",
    languageLabel: "Idioma",
  },
};

const LOCALES: SubjectLocale[] = SUPPORTED_LOCALES;

const ClassesHubPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  // Saved choice, otherwise the visitor's browser language (shared with every translatable classroom).
  const [locale, setLocale] = useState<SubjectLocale>(() => readClassroomLocale());
  const copy = HUB_COPY[locale];

  const changeLocale = (next: SubjectLocale) => {
    setLocale(next);
    saveClassroomLocale(next);
  };

  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = previous;
    };
  }, [locale]);

  const visibleClassrooms = classrooms
    .filter((c) => !c.access?.unlisted || canAccessClassroom(c.access, user?.email))
    .map((c) => localizeSummary(c, locale));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 font-heading text-lg font-black text-foreground sm:text-xl">
            <img src={logoMark} alt="" className="h-10 w-8 object-contain dark:invert sm:h-12 sm:w-9" />
            <span>Foro Agora</span>
          </Link>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              <select
                aria-label={copy.languageLabel}
                value={locale}
                onChange={(e) => changeLocale(e.target.value as SubjectLocale)}
                className="cursor-pointer bg-transparent font-semibold text-foreground focus:outline-none"
              >
                {LOCALES.map((code) => (
                  <option key={code} value={code} className="bg-background text-foreground">
                    {LOCALE_LABELS[code]}
                  </option>
                ))}
              </select>
            </label>
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <p className="text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground">{copy.eyebrow}</p>
        <h1 className="mt-1 font-heading text-3xl font-bold text-foreground sm:text-4xl">{copy.title}</h1>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground">{copy.subtitle}</p>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {visibleClassrooms.map((c) => {
            const isPrivate = c.access && c.access.mode !== "public";
            return (
              <article key={c.slug} className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/30">
                <div className="flex flex-wrap items-center gap-2 text-xs font-heading font-semibold uppercase tracking-wider">
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">{c.level ?? "Foro Agora"}</span>
                  <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">
                    {c.isCpge ? copy.cpgeBadge : copy.generalBadge}
                  </span>
                  {isPrivate && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-foreground">
                      <Lock className="h-3 w-3" /> {copy.privateBadge}
                    </span>
                  )}
                </div>
                <h2 className="mt-4 font-heading text-xl font-bold text-foreground">{c.fullName}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.description}</p>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {copy.chaptersCount(c.chaptersCount)}</span>
                  <span className="inline-flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" /> {copy.exercisesCount(c.exercisesCount)}</span>
                  {c.features.calculator && <span className="inline-flex items-center gap-1"><Calculator className="h-3.5 w-3.5" /> Desmos</span>}
                  {c.features.formulaire && <span className="inline-flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> Flashcards</span>}
                  {c.features.printableSheet !== false && <span className="inline-flex items-center gap-1"><Printer className="h-3.5 w-3.5" /> PDF A4</span>}
                  <span className="inline-flex items-center gap-1"><WifiOff className="h-3.5 w-3.5" /> {copy.offline}</span>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{c.professor ?? "Foro Agora"}</span>
                    {c.institution && <span> · {c.institution}</span>}
                  </div>
                  <Button asChild size="sm">
                    <Link to={`/classroom/${c.slug}`}>{copy.openClass} <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">{copy.hostTitle}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{copy.hostSubtitle}</p>
              <ul className="mt-4 space-y-2 text-sm text-foreground">
                {copy.hostPoints.map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <a href="mailto:ignacio@foroagora.org?subject=Foro%20Agora%20Classroom%20Request">
                    <Mail className="h-4 w-4" /> {copy.hostCta}
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/classroom/modele">{copy.tryTemplate}</Link>
                </Button>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-xl border border-border bg-muted/50 p-5">
              <div>
                <p className="text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground">
                  {copy.howTitle}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.howBody}</p>
                <a
                  href="mailto:ignacio@juanignacioramos.com?subject=Foro%20Agora%20Classroom%20Request"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-foreground underline-offset-4 hover:underline"
                >
                  <Mail className="h-3.5 w-3.5" /> {copy.altEmailCta}
                </a>
              </div>
              <p className="mt-6 border-t border-border pt-3 font-heading text-xs font-semibold tracking-wider text-muted-foreground">
                {copy.missionNote}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClassesHubPage;
