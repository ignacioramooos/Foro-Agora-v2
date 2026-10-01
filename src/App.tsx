import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import RouteSeo from "@/components/RouteSeo";
import StudyLayout from "@/components/math/StudyLayout";
import { isEventRegistrationPath } from "@/lib/classEvent";

const Index = lazy(() => import("./pages/Index"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const ProgramPage = lazy(() => import("./pages/ProgramPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const PartnersPage = lazy(() => import("./pages/PartnersPage"));
const InstitutionsPage = lazy(() => import("./pages/InstitutionsPage"));
const InstitutionalProposalPage = lazy(() => import("./pages/InstitutionalProposalPage"));
const SpreadKitPage = lazy(() => import("./pages/SpreadKitPage"));
const PressKitPage = lazy(() => import("./pages/PressKitPage"));
const BrokersPage = lazy(() => import("./pages/BrokersPage"));
const GlossaryPage = lazy(() => import("./pages/GlossaryPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const RankingPage = lazy(() => import("./pages/RankingPage"));
const ImpactPage = lazy(() => import("./pages/ImpactPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PracticePage = lazy(() => import("./pages/PracticePage"));
const PracticeChapterPage = lazy(() => import("./pages/PracticeChapterPage"));
const MathKhollesPage = lazy(() => import("./pages/MathKhollesPage"));
const MathDmPage = lazy(() => import("./pages/MathDmPage"));
const MathResourcesPage = lazy(() => import("./pages/MathResourcesPage"));
const MathForumPage = lazy(() => import("./pages/MathForumPage"));
const MathIndexPage = lazy(() => import("./pages/MathIndexPage"));
const MathExercisePage = lazy(() => import("./pages/MathExercisePage"));

const queryClient = new QueryClient();

const normalizeLegacyHashRoute = () => {
  if (typeof window === "undefined") return;
  const { hash } = window.location;
  if (!hash.startsWith("#/")) return;

  const cleanPath = hash.slice(1);
  window.history.replaceState(window.history.state, "", cleanPath);
};

normalizeLegacyHashRoute();

const PublicPage = ({ children }: { children: React.ReactNode }) => (
  <>
    <div className="print:hidden"><Navbar /></div>
    <main>{children}</main>
    <div className="print:hidden"><Footer /></div>
  </>
);

const StudyPage = ({ children }: { children: React.ReactNode }) => <StudyLayout>{children}</StudyLayout>;

const LegacyPracticeRedirect = () => {
  const location = useLocation();
  const chapterMatch = location.pathname.match(/^\/practica\/capitulo\/(.+)$/);
  return <Navigate to={chapterMatch ? `/maths/chapitre/${chapterMatch[1]}/cours` : "/maths"} replace />;
};

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <span className="text-muted-foreground text-sm font-heading">Cargando...</span>
  </div>
);

const getPendingAuthRedirectPath = () => {
  const requestedPath = new URLSearchParams(window.location.search).get("authRedirect");
  if (!requestedPath) return null;

  const normalizedPath = requestedPath.startsWith("/") ? requestedPath : `/${requestedPath}`;
  return normalizedPath.startsWith("//") ? "/auth" : normalizedPath;
};

const clearPendingAuthRedirectParam = () => {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("authRedirect")) return;

  url.searchParams.delete("authRedirect");
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
};

const AppRoutes = () => {
  const { isLoggedIn, loading, user } = useAuth();
  const location = useLocation();
  const pendingAuthRedirectPath = getPendingAuthRedirectPath();
  const isEventRegistration = isEventRegistrationPath(location.pathname, location.search);

  useEffect(() => {
    if (pendingAuthRedirectPath && `${location.pathname}${location.search}` === pendingAuthRedirectPath) {
      clearPendingAuthRedirectParam();
    }
  }, [pendingAuthRedirectPath, location.pathname, location.search]);

  if (pendingAuthRedirectPath && `${location.pathname}${location.search}` !== pendingAuthRedirectPath) {
    return <Navigate to={pendingAuthRedirectPath} replace />;
  }

  if (loading || (isLoggedIn && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-muted-foreground text-sm font-heading">Cargando...</span>
      </div>
    );
  }

  const publicRoutes = (
    <>
      <Route path="/" element={<PublicPage><Index /></PublicPage>} />
      <Route path="/nosotros" element={<PublicPage><AboutPage /></PublicPage>} />
      <Route path="/eventos" element={<PublicPage><EventsPage /></PublicPage>} />
      <Route path="/programa" element={<PublicPage><ProgramPage /></PublicPage>} />
      <Route path="/registro" element={<PublicPage><RegisterPage /></PublicPage>} />
      <Route path="/contacto" element={<PublicPage><ContactPage /></PublicPage>} />
      <Route path="/recursos" element={<PublicPage><ResourcesPage /></PublicPage>} />
      <Route path="/glosario" element={<PublicPage><GlossaryPage /></PublicPage>} />
      <Route path="/partners" element={<PublicPage><PartnersPage /></PublicPage>} />
      <Route path="/instituciones" element={<PublicPage><InstitutionsPage /></PublicPage>} />
      <Route path="/propuesta-instituciones" element={<PublicPage><InstitutionalProposalPage /></PublicPage>} />
      <Route path="/embajadores" element={<Navigate to="/difundir" replace />} />
      <Route path="/difundir" element={<PublicPage><SpreadKitPage /></PublicPage>} />
      <Route path="/prensa" element={<PublicPage><PressKitPage /></PublicPage>} />
      <Route path="/brokers" element={<PublicPage><BrokersPage /></PublicPage>} />
      <Route path="/ranking" element={<PublicPage><RankingPage /></PublicPage>} />
      <Route path="/impacto" element={<PublicPage><ImpactPage /></PublicPage>} />
      <Route path="/privacidad" element={<PublicPage><PrivacyPage /></PublicPage>} />
      <Route path="/terminos" element={<PublicPage><TermsPage /></PublicPage>} />
      <Route path="/maths" element={<StudyPage><PracticePage /></StudyPage>} />
      <Route path="/maths/chapitre/:id" element={<StudyPage><PracticeChapterPage /></StudyPage>} />
      <Route path="/maths/chapitre/:id/:tab" element={<StudyPage><PracticeChapterPage /></StudyPage>} />
      <Route path="/maths/kholles" element={<StudyPage><MathKhollesPage /></StudyPage>} />
      <Route path="/maths/dm" element={<StudyPage><MathDmPage /></StudyPage>} />
      <Route path="/maths/dm/:id" element={<StudyPage><MathDmPage /></StudyPage>} />
      <Route path="/maths/ressources" element={<StudyPage><MathResourcesPage /></StudyPage>} />
      <Route path="/maths/forum" element={<StudyPage><MathForumPage /></StudyPage>} />
      <Route path="/maths/index" element={<StudyPage><MathIndexPage /></StudyPage>} />
      <Route path="/maths/exo/:uid" element={<StudyPage><MathExercisePage /></StudyPage>} />
      <Route path="/practica/*" element={<LegacyPracticeRedirect />} />
      <Route path="/auth" element={<AuthPage />} />
    </>
  );

  if (isLoggedIn && user && !user.onboardingCompleted && location.pathname !== "/auth" && !isEventRegistration) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoggedIn) {
    return (
      <>
        <RouteSeo />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route
              path="/dashboard"
              element={user?.onboardingCompleted ? <DashboardPage /> : <Navigate to="/auth" replace />}
            />
            <Route path="/admin" element={<AdminPage />} />
            {publicRoutes}
            <Route path="*" element={<PublicPage><NotFound /></PublicPage>} />
          </Routes>
        </Suspense>
        {!location.pathname.startsWith("/maths") && !location.pathname.startsWith("/practica") && <WhatsAppButton />}
      </>
    );
  }

  return (
    <>
      <RouteSeo />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {publicRoutes}
          <Route path="/dashboard" element={<Navigate to="/auth" replace />} />
          <Route path="*" element={<PublicPage><NotFound /></PublicPage>} />
        </Routes>
      </Suspense>
      {!location.pathname.startsWith("/maths") && !location.pathname.startsWith("/practica") && <WhatsAppButton />}
    </>
  );
};

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
