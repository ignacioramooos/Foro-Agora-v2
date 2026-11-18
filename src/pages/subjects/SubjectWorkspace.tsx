import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { canAccessClassroom, getClassroomSummary, loadClassroom } from "@/content/subjects/registry";
import type { SubjectConfig } from "@/content/subjects/types";
import { getSubjectStrings } from "@/content/subjects/i18n";
import { readClassroomLocale } from "@/content/subjects/locale";
import { localizeSummary } from "@/content/subjects/localize";
import { SubjectProvider } from "@/components/subject/SubjectContext";
import SubjectLayout from "@/components/subject/SubjectLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import SubjectPracticePage from "./SubjectPracticePage";
import SubjectChapterPage from "./SubjectChapterPage";
import SubjectIndexPage from "./SubjectIndexPage";
import SubjectProgressPage from "./SubjectProgressPage";
import SubjectPlanchePage from "./SubjectPlanchePage";
import SubjectFormulairePage from "./SubjectFormulairePage";
import SubjectAssignmentsPage from "./SubjectAssignmentsPage";
import SubjectResourcesPage from "./SubjectResourcesPage";
import SubjectBonusPage from "./SubjectBonusPage";
import SubjectExercisePage from "./SubjectExercisePage";
import SubjectKhollesPage from "./SubjectKhollesPage";
import SubjectKholleSimPage from "./SubjectKholleSimPage";

const SubjectWorkspace = () => {
  const { slug = "" } = useParams();
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const baseSummary = getClassroomSummary(slug);
  // Screens shown before the classroom loads follow the same language rules as the classroom itself.
  const locale = baseSummary?.lockLocale ? (baseSummary.locale ?? "fr") : readClassroomLocale();
  const w = getSubjectStrings(locale).workspace;
  const summary = baseSummary;
  const display = baseSummary ? localizeSummary(baseSummary, locale) : undefined;
  const [subject, setSubject] = useState<SubjectConfig | null>(null);
  const [loading, setLoading] = useState(Boolean(summary));

  const hasAccess = summary ? canAccessClassroom(summary.access, user?.email) : false;

  useEffect(() => {
    let active = true;
    if (!summary || !hasAccess) {
      setSubject(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    loadClassroom(slug).then((loaded) => {
      if (!active) return;
      setSubject(loaded ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [slug, summary, hasAccess]);

  if (!summary) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">Foro Agora Classrooms</p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-foreground">{w.notFoundTitle}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{w.notFoundBody}</p>
        <Button asChild className="mt-6">
          <Link to="/classroom"><ArrowLeft className="h-4 w-4" /> {getSubjectStrings(locale).nav.allClasses}</Link>
        </Button>
      </div>
    );
  }

  if (!hasAccess) {
    const authTarget = `/auth?authRedirect=${encodeURIComponent(location.pathname + location.search)}`;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground">
          <Lock className="h-5 w-5" />
        </div>
        <p className="mt-4 text-xs font-heading uppercase tracking-wider text-muted-foreground">
          Foro Agora Classrooms · {display?.fullName}
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-foreground">
          {isLoggedIn ? w.restrictedTitle : w.signInTitle}
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {isLoggedIn ? w.restrictedBody : w.signInBody}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {!isLoggedIn ? (
            <Button asChild>
              <Link to={authTarget}>{w.signIn}</Link>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <a href="mailto:ignacio@foroagora.org?subject=Acc%C3%A8s%20classe%20priv%C3%A9e">
                {w.requestAccess}
              </a>
            </Button>
          )}
          <Button asChild variant="ghost">
            <Link to="/classroom"><ArrowLeft className="h-4 w-4" /> {w.backToClasses}</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading || !subject) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <span className="text-sm font-heading text-muted-foreground">{w.loading(display?.name ?? summary.name)}</span>
      </div>
    );
  }

  return (
    <SubjectProvider subject={subject}>
      <SubjectLayout>
        <Routes>
          <Route index element={<SubjectPracticePage />} />
          <Route path="chapitre/:chapterId" element={<SubjectChapterPage />} />
          <Route path="chapitre/:chapterId/:tab" element={<SubjectChapterPage />} />
          <Route path="index" element={<SubjectIndexPage />} />
          <Route path="progression" element={<SubjectProgressPage />} />
          <Route path="planche" element={<SubjectPlanchePage />} />
          <Route path="formulaire" element={<SubjectFormulairePage />} />
          <Route path="devoirs" element={<SubjectAssignmentsPage />} />
          <Route path="devoirs/:dmId" element={<SubjectAssignmentsPage />} />
          <Route path="ressources" element={<SubjectResourcesPage />} />
          <Route path="ressources/bonus" element={<SubjectBonusPage />} />
          <Route path="ressources/bonus/:sheetId" element={<SubjectBonusPage />} />
          <Route path="exo/:uid" element={<SubjectExercisePage />} />
          {subject.features.kholles && <Route path="kholles" element={<SubjectKhollesPage />} />}
          {subject.features.kholleSimulator && <Route path="simulateur" element={<SubjectKholleSimPage />} />}
          <Route path="*" element={<Navigate to={`/classroom/${subject.slug}`} replace />} />
        </Routes>
      </SubjectLayout>
    </SubjectProvider>
  );
};

export default SubjectWorkspace;
