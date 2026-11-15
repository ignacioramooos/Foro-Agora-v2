import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  Globe,
  Layers,
  Moon,
  Printer,
  Sparkles,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import logoMark from "@/assets/stone-trail-logo.png";
import { subjects, getSubjectIndex } from "@/content/subjects/registry";
import { LOCALE_LABELS, type SubjectLocale } from "@/content/subjects/i18n";

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
    hostTitle: string;
    hostSubtitle: string;
    hostPoints: string[];
    cpgeNoteTitle: string;
    cpgeNoteBody: string;
    hostCta: string;
    tryTemplate: string;
  }
> = {
  fr: {
    eyebrow: "Plateforme d'exercices gratuite",
    title: "Classes & Matières",
    subtitle:
      "Un espace d'entraînement clair, rapide et sans distraction pour chaque matière — bientôt ouvert à la physique, la chimie, les SII et aux classes de professeurs externes.",
    openClass: "Ouvrir l'espace",
    chaptersCount: (n) => `${n} chapitre${n > 1 ? "s" : ""}`,
    exercisesCount: (n) => `${n} exercice${n > 1 ? "s" : ""}`,
    cpgeBadge: "CPGE",
    generalBadge: "Modèle universel",
    hostTitle: "Vous êtes professeur ? Hébergez votre classe gratuitement.",
    hostSubtitle:
      "Nous préparons l'ouverture gratuite de cette plateforme pour que n'importe quel professeur puisse offrir à ses élèves une banque d'exercices interactive, en français, anglais, espagnol ou portugais.",
    hostPoints: [
      "Exercices avec LaTeX, indices progressifs et réponses cachées",
      "Objectif quotidien, série (streak) et suivi par chapitre",
      "Recherche instantanée (#NNN), fiches de formules (flashcards) et planches A4 imprimables",
      "Interface multilingue : Français, English, Español, Português",
    ],
    cpgeNoteTitle: "Modules CPGE optionnels",
    cpgeNoteBody:
      "Certaines fonctionnalités de Foro Agora Maths (khôlles hebdomadaires, simulateur d'oral, séparation Cours/TD) sont spécifiques aux classes préparatoires et sont désactivées par défaut dans le modèle général.",
    hostCta: "Proposer une classe",
    tryTemplate: "Voir le modèle en direct",
  },
  en: {
    eyebrow: "Free exercise pool platform",
    title: "Classes & Subjects",
    subtitle:
      "A clean, distraction-free practice space for every subject — expanding soon to physics, chemistry, engineering (SII), and classes hosted by external professors.",
    openClass: "Open workspace",
    chaptersCount: (n) => `${n} chapter${n !== 1 ? "s" : ""}`,
    exercisesCount: (n) => `${n} exercise${n !== 1 ? "s" : ""}`,
    cpgeBadge: "CPGE",
    generalBadge: "Universal template",
    hostTitle: "Are you a professor? Host your class for free.",
    hostSubtitle:
      "We are opening this platform for free so any professor can give their students an interactive exercise pool in English, Spanish, French, or Portuguese.",
    hostPoints: [
      "Exercises with LaTeX, progressive hints, and toggleable answers",
      "Daily goals, streaks, and per-chapter progress tracking",
      "Instant search (#NNN), formula flashcards, and printable A4 worksheets",
      "Multilingual interface: English, Español, Français, Português",
    ],
    cpgeNoteTitle: "Optional CPGE modules",
    cpgeNoteBody:
      "Some Foro Agora Maths features (weekly oral exams / khôlles, oral simulator, Lecture/TD split) are specific to French preparatory classes and are turned off by default in the general template.",
    hostCta: "Host a class",
    tryTemplate: "Try live template",
  },
  es: {
    eyebrow: "Plataforma gratuita de ejercicios",
    title: "Clases y Materias",
    subtitle:
      "Un espacio de práctica limpio y sin distracciones para cada materia — pronto disponible para física, química, SII y clases de profesores externos.",
    openClass: "Abrir espacio",
    chaptersCount: (n) => `${n} capítulo${n !== 1 ? "s" : ""}`,
    exercisesCount: (n) => `${n} ejercicio${n !== 1 ? "s" : ""}`,
    cpgeBadge: "CPGE",
    generalBadge: "Plantilla universal",
    hostTitle: "¿Sos profesor? Alojá tu clase gratis.",
    hostSubtitle:
      "Estamos abriendo esta plataforma de forma gratuita para que cualquier profesor pueda ofrecer a sus estudiantes un banco de ejercicios interactivo en español, inglés, francés o portugués.",
    hostPoints: [
      "Ejercicios con LaTeX, pistas progresivas y respuestas ocultables",
      "Meta diaria, racha y seguimiento de progreso por capítulo",
      "Búsqueda instantánea (#NNN), flashcards de fórmulas y hojas A4 imprimibles",
      "Interfaz multilingüe: Español, English, Français, Português",
    ],
    cpgeNoteTitle: "Módulos CPGE opcionales",
    cpgeNoteBody:
      "Algunas funciones de Foro Agora Maths (exámenes orales / khôlles, simulador oral, división Teoría/Práctica) son exclusivas de CPGE y vienen desactivadas por defecto en la plantilla general.",
    hostCta: "Proponer una clase",
    tryTemplate: "Ver plantilla en vivo",
  },
  pt: {
    eyebrow: "Plataforma gratuita de exercícios",
    title: "Turmas e Matérias",
    subtitle:
      "Um espaço de treino limpo e sem distrações para cada matéria — em breve com física, química, SII e turmas de professores externos.",
    openClass: "Abrir espaço",
    chaptersCount: (n) => `${n} capítulo${n !== 1 ? "s" : ""}`,
    exercisesCount: (n) => `${n} exercício${n !== 1 ? "s" : ""}`,
    cpgeBadge: "CPGE",
    generalBadge: "Modelo universal",
    hostTitle: "É professor? Hospede sua turma gratuitamente.",
    hostSubtitle:
      "Estamos abrindo esta plataforma gratuitamente para que qualquer professor ofereça aos seus alunos um banco de exercícios interativo em português, espanhol, inglês ou francês.",
    hostPoints: [
      "Exercícios com LaTeX, dicas progressivas e respostas ocultáveis",
      "Meta diária, sequência e acompanhamento por capítulo",
      "Busca instantânea (#NNN), flashcards de fórmulas e folhas A4 imprimíveis",
      "Interface multilíngue: Português, Español, English, Français",
    ],
    cpgeNoteTitle: "Módulos CPGE opcionais",
    cpgeNoteBody:
      "Alguns recursos do Foro Agora Maths (provas orais / khôlles, simulador oral, divisão Teoria/Listas) são exclusivos de CPGE e ficam desativados por padrão no modelo geral.",
    hostCta: "Hospedar uma turma",
    tryTemplate: "Ver modelo ao vivo",
  },
};

const LOCALES: SubjectLocale[] = ["fr", "en", "es", "pt"];

const ClassesHubPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [locale, setLocale] = useState<SubjectLocale>(() => {
    const saved = localStorage.getItem("fa_classes_locale") as SubjectLocale | null;
    return saved && LOCALES.includes(saved) ? saved : "fr";
  });
  const copy = HUB_COPY[locale];

  const changeLocale = (next: SubjectLocale) => {
    setLocale(next);
    localStorage.setItem("fa_classes_locale", next);
  };

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
                aria-label="Language"
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
          {subjects.map((s) => {
            const idx = getSubjectIndex(s);
            return (
              <article key={s.slug} className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/30">
                <div className="flex flex-wrap items-center gap-2 text-xs font-heading font-semibold uppercase tracking-wider">
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">{s.level ?? "Foro Agora"}</span>
                  <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">
                    {s.isCpge ? copy.cpgeBadge : copy.generalBadge}
                  </span>
                </div>
                <h2 className="mt-4 font-heading text-xl font-bold text-foreground">{s.fullName}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.description}</p>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {copy.chaptersCount(idx.chapters.length)}</span>
                  <span className="inline-flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" /> {copy.exercisesCount(idx.indexedExercises.length)}</span>
                  {s.features.calculator && <span className="inline-flex items-center gap-1"><Calculator className="h-3.5 w-3.5" /> Desmos</span>}
                  {s.features.formulaire && <span className="inline-flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> Flashcards</span>}
                  {s.features.printableSheet !== false && <span className="inline-flex items-center gap-1"><Printer className="h-3.5 w-3.5" /> PDF A4</span>}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{s.professor ?? "Foro Agora"}</span>
                    {s.institution && <span> · {s.institution}</span>}
                  </div>
                  <Button asChild size="sm">
                    <Link to={`/classes/${s.slug}`}>{copy.openClass} <ArrowRight className="h-4 w-4" /></Link>
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
                  <Link to="/contacto">{copy.hostCta} <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/classes/modele">{copy.tryTemplate}</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-muted/50 p-5">
              <p className="text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground">
                {copy.cpgeNoteTitle}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.cpgeNoteBody}</p>
              <p className="mt-4 font-mono text-xs text-muted-foreground">
                src/content/subjects/_template/
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClassesHubPage;
