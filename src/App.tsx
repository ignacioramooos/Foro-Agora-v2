import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import ProgramPage from "./pages/ProgramPage";
import RegisterPage from "./pages/RegisterPage";
import ContactPage from "./pages/ContactPage";
import ResourcesPage from "./pages/ResourcesPage";
import PartnersPage from "./pages/PartnersPage";
import BrokersPage from "./pages/BrokersPage";
import GlossaryPage from "./pages/GlossaryPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import RankingPage from "./pages/RankingPage";
import ImpactPage from "./pages/ImpactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PublicPage = ({ children }: { children: React.ReactNode }) => (
  <><Navbar /><main>{children}</main><Footer /></>
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
      <Route path="/programa" element={<PublicPage><ProgramPage /></PublicPage>} />
      <Route path="/registro" element={<PublicPage><RegisterPage /></PublicPage>} />
      <Route path="/contacto" element={<PublicPage><ContactPage /></PublicPage>} />
      <Route path="/recursos" element={<PublicPage><ResourcesPage /></PublicPage>} />
      <Route path="/glosario" element={<PublicPage><GlossaryPage /></PublicPage>} />
      <Route path="/partners" element={<PublicPage><PartnersPage /></PublicPage>} />
      <Route path="/brokers" element={<PublicPage><BrokersPage /></PublicPage>} />
      <Route path="/ranking" element={<PublicPage><RankingPage /></PublicPage>} />
      <Route path="/impacto" element={<PublicPage><ImpactPage /></PublicPage>} />
      <Route path="/privacidad" element={<PublicPage><PrivacyPage /></PublicPage>} />
      <Route path="/terminos" element={<PublicPage><TermsPage /></PublicPage>} />
      <Route path="/auth" element={<AuthPage />} />
    </>
  );

  if (isLoggedIn && user && !user.onboardingCompleted && location.pathname !== "/auth") {
    return <Navigate to="/auth" replace />;
  }

  if (isLoggedIn) {
    return (
      <>
        <Routes>
          <Route
            path="/dashboard"
            element={user?.onboardingCompleted ? <DashboardPage /> : <Navigate to="/auth" replace />}
          />
          <Route path="/admin" element={<AdminPage />} />
          {publicRoutes}
          <Route path="*" element={<PublicPage><NotFound /></PublicPage>} />
        </Routes>
        <WhatsAppButton />
      </>
    );
  }

  return (
    <>
      <Routes>
        {publicRoutes}
        <Route path="/dashboard" element={<Navigate to="/auth" replace />} />
        <Route path="*" element={<PublicPage><NotFound /></PublicPage>} />
      </Routes>
      <WhatsAppButton />
    </>
  );
};

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
