import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { getAuthRedirectUrl } from "@/lib/authRedirect";
import { signupWithoutEmailConfirmation } from "@/lib/passwordSignup";

const departments = [
  "Montevideo", "Artigas", "Canelones", "Cerro Largo", "Colonia", "Durazno", "Flores",
  "Florida", "Lavalleja", "Maldonado", "Paysandú", "Río Negro",
  "Rivera", "Rocha", "Salto", "San José", "Soriano", "Tacuarembó", "Treinta y Tres",
];

const howFoundOptions = [
  "Instagram",
  "Amigo / Boca a boca",
  "Actividad abierta",
  "Otro",
];

const interestOptions = [
  "Aprender a invertir",
  "Entender la economía",
  "Conocer gente con mis mismos intereses",
  "Certificar mis conocimientos",
];

const PENDING_KEY = "pending_onboarding";
const PENDING_RETURN_TO_KEY = "pending_auth_return_to";

const sanitizeReturnTo = (value: string | null) => {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
};

type FlowStep =
  | "event-choice"
  | "login"
  | "forgot-password"
  | "reset-password"
  | "reset-sent"
  | "password-updated"
  | "step-1"
  | "step-2"
  | "step-3"
  | "step-account";

interface OnboardingData {
  fullName: string;
  age: string;
  department: string;
  institution: string;
  howFoundUs: string;
  interests: string[];
  participationReason: string;
  acceptedTerms: boolean;
  newsletterOptIn: boolean;
}

const emptyOnboarding: OnboardingData = {
  fullName: "",
  age: "",
  department: "",
  institution: "",
  howFoundUs: "",
  interests: [],
  participationReason: "",
  acceptedTerms: false,
  newsletterOptIn: false,
};

const buildMetadata = (d: OnboardingData) => ({
  display_name: d.fullName,
  full_name: d.fullName,
  age: d.age ? Number(d.age) : null,
  department: d.department,
  institution: d.institution,
  how_found_us: d.howFoundUs,
  interests: d.interests,
  accepted_terms: d.acceptedTerms,
});

const buildProfileOnboardingPayload = (userId: string, userEmail: string, d: OnboardingData) => ({
  user_id: userId,
  email: userEmail,
  full_name: d.fullName,
  display_name: d.fullName,
  age: d.age ? Number(d.age) : null,
  department: d.department,
  institution: d.institution,
  how_found_us: d.howFoundUs,
  interests: d.interests,
  accepted_terms: d.acceptedTerms,
  onboarding_completed: true,
});

const getAuthUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  const hashQueryStart = window.location.hash.indexOf("?");

  if (hashQueryStart >= 0) {
    const hashQuery = window.location.hash.slice(hashQueryStart + 1).split("#")[0];
    new URLSearchParams(hashQuery).forEach((value, key) => {
      if (!params.has(key)) params.set(key, value);
    });
  }

  return params;
};

const AuthPage = () => {
  const { isLoggedIn, user, login, refreshProfile, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = sanitizeReturnTo(getAuthUrlParams().get("returnTo") || sessionStorage.getItem(PENDING_RETURN_TO_KEY));
  const [step, setStep] = useState<FlowStep>(() => {
    const params = getAuthUrlParams();
    if (params.get("reset-password") === "true" || window.location.hash.includes("type=recovery")) {
      return "reset-password";
    }
    if (params.get("mode") === "signup") {
      return "step-1";
    }
    if (params.get("mode") === "event") {
      return "event-choice";
    }
    return "login";
  });
  const [email, setEmail] = useState(() => getAuthUrlParams().get("email") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loginChosen, setLoginChosen] = useState(false);
  const [completingProfile, setCompletingProfile] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(emptyOnboarding);
  const isEventRegistrationFlow = returnTo.startsWith("/registro?class=");

  useEffect(() => {
    const requestedReturnTo = getAuthUrlParams().get("returnTo");
    if (requestedReturnTo) sessionStorage.setItem(PENDING_RETURN_TO_KEY, sanitizeReturnTo(requestedReturnTo));
  }, [location.search, location.hash]);

  useEffect(() => {
    const params = getAuthUrlParams();
    if (params.get("mode") === "signup" && !isLoggedIn && step === "login" && !loginChosen) {
      setError("");
      setOnboardingData(emptyOnboarding);
      setStep("step-1");
    }
  }, [isLoggedIn, location.search, location.hash, loginChosen, step]);

  // After Google OAuth round-trip: apply pending onboarding to profile
  useEffect(() => {
    if (loading || !isLoggedIn || !user) return;
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return;
    let parsed: OnboardingData;
    try {
      parsed = JSON.parse(raw);
    } catch {
      sessionStorage.removeItem(PENDING_KEY);
      return;
    }
    (async () => {
      const { error: updateError } = await supabase
        .from("profiles")
        .upsert(buildProfileOnboardingPayload(user.id, user.email, parsed), { onConflict: "user_id" });

      if (updateError) {
        setCompletingProfile(true);
        setOnboardingData(parsed);
        setStep("step-1");
        setError("No se pudo guardar tu perfil. Revisá los datos e intentá de nuevo.");
        return;
      }

      sessionStorage.removeItem(PENDING_KEY);
      await refreshProfile();
    })();
  }, [loading, isLoggedIn, user, refreshProfile]);

  useEffect(() => {
    if (
      loading ||
      !isLoggedIn ||
      !user ||
      user.onboardingCompleted ||
      completingProfile ||
      isEventRegistrationFlow ||
      step === "reset-password" ||
      step === "password-updated" ||
      sessionStorage.getItem(PENDING_KEY)
    ) {
      return;
    }

    setCompletingProfile(true);
    setOnboardingData((prev) => ({ ...prev, fullName: user.name || "" }));
    setStep("step-1");
  }, [loading, isLoggedIn, user, completingProfile, isEventRegistrationFlow, step]);

  const shouldRedirectAfterAuth = Boolean(
    isLoggedIn && user && (user.onboardingCompleted || isEventRegistrationFlow) && !completingProfile && step !== "reset-password" && step !== "password-updated"
  );

  useEffect(() => {
    if (shouldRedirectAfterAuth) sessionStorage.removeItem(PENDING_RETURN_TO_KEY);
  }, [shouldRedirectAfterAuth]);

  if (loading) return null;

  // Logged-in + onboarding complete → dashboard
  if (shouldRedirectAfterAuth) {
    return <Navigate to={returnTo} replace />;
  }

  const set = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) =>
    setOnboardingData((prev) => ({ ...prev, [key]: value }));

  const toggleInterest = (interest: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const canAdvanceStep = () => {
    if (step === "step-1") {
      const age = Number(onboardingData.age);
      return onboardingData.fullName.trim().length > 0 && Number.isFinite(age) && age >= 10 && age <= 99;
    }
    if (step === "step-2") return onboardingData.department !== "" && onboardingData.institution.trim().length > 0 && onboardingData.howFoundUs !== "";
    if (step === "step-3") return onboardingData.interests.length > 0 && onboardingData.acceptedTerms;
    return false;
  };

  const currentStepNumber = isEventRegistrationFlow && step === "step-account" ? 1 : step === "step-1" ? 1 : step === "step-2" ? 2 : step === "step-3" ? 3 : step === "step-account" ? 4 : 0;
  const totalSteps = isEventRegistrationFlow ? 1 : completingProfile ? 3 : 4;

  const handleGoogleSignup = async () => {
    setError("");
    if (isEventRegistrationFlow && !onboardingData.acceptedTerms) {
      setError("Aceptá los términos y la política de privacidad para crear tu cuenta.");
      return;
    }
    if (!isEventRegistrationFlow) sessionStorage.setItem(PENDING_KEY, JSON.stringify(onboardingData));
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: getAuthRedirectUrl(`/auth?returnTo=${encodeURIComponent(returnTo)}`) },
    });
    if (oauthError) {
      if (!isEventRegistrationFlow) sessionStorage.removeItem(PENDING_KEY);
      setError("Error al iniciar sesión con Google");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    sessionStorage.removeItem(PENDING_KEY);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: getAuthRedirectUrl(`/auth?returnTo=${encodeURIComponent(returnTo)}`) },
    });
    if (oauthError) setError("Error al iniciar sesión con Google");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    if (result.error) setError(result.error);
    setSubmitting(false);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Ingresá tu email"); return; }
    setSubmitting(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getAuthRedirectUrl("/auth?reset-password=true"),
    });
    setSubmitting(false);
    if (resetError) { setError(resetError.message); return; }
    setStep("reset-sent");
  };

  const handleUpdatePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres"); return; }
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden"); return; }
    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) { setError(updateError.message); setSubmitting(false); return; }
    await supabase.auth.signOut();
    setPassword(""); setConfirmPassword("");
    setSubmitting(false);
    setStep("password-updated");
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (isEventRegistrationFlow && !onboardingData.acceptedTerms) { setError("Aceptá los términos y la política de privacidad para crear tu cuenta."); return; }
    if (!email.trim()) { setError("Ingresá tu email"); return; }
    if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres"); return; }
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden"); return; }

    setSubmitting(true);
    if (!isEventRegistrationFlow) sessionStorage.setItem(PENDING_KEY, JSON.stringify(onboardingData));
    const { error: signupError } = await signupWithoutEmailConfirmation({
      email,
      password,
      metadata: buildMetadata(onboardingData),
    });
    setSubmitting(false);
    if (signupError) {
      if (!isEventRegistrationFlow) sessionStorage.removeItem(PENDING_KEY);
      setError(signupError);
      return;
    }
  };

  const handleCompleteProfileForExistingUser = async () => {
    if (!user) return;
    setSubmitting(true);
    const { error: updateError } = await supabase
      .from("profiles")
      .upsert(buildProfileOnboardingPayload(user.id, user.email, onboardingData), { onConflict: "user_id" });
    setSubmitting(false);
    if (updateError) { setError("No se pudo guardar el perfil. Intentá de nuevo."); return; }
    sessionStorage.removeItem(PENDING_KEY);
    await refreshProfile();
    sessionStorage.removeItem(PENDING_RETURN_TO_KEY);
    navigate(returnTo, { replace: true });
  };

  const inputClass = "w-full h-12 px-4 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow font-heading";

  if (step === "event-choice") {
    return (
      <div className="min-h-screen bg-background px-6 py-12 pt-28">
        <div className="mx-auto max-w-md rounded-2xl border-2 border-foreground bg-card p-7 shadow-[10px_10px_0_#ffc800] md:p-9">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-pop">Inscripción al encuentro</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-foreground">Reservá tu lugar para el 22 de julio</h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Para confirmar tu inscripción necesitás una cuenta. Elegí una opción y después vas directo al formulario del evento.
          </p>
          <div className="mt-7 grid gap-3">
            <Button variant="cta" size="cta" onClick={() => { setError(""); setStep("step-account"); }}>
              Crear una cuenta
            </Button>
            <Button variant="cta-outline" size="cta" onClick={() => { setLoginChosen(true); setError(""); setStep("login"); }}>
              Ya tengo cuenta
            </Button>
          </div>
          <p className="mt-5 text-center text-xs text-muted-foreground">Miércoles 22 de julio · 18:00 a 20:00 · Casa INJU</p>
          <Link to="/" className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={14} /> Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (step === "reset-sent") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-foreground" />
          </div>
          <h1 className="text-2xl font-heading font-semibold text-foreground mb-3">Revisá tu email</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Si existe una cuenta con <strong className="text-foreground">{email}</strong>, te enviamos un link para crear una nueva contraseña.
          </p>
          <Button variant="cta-outline" size="cta" onClick={() => { setStep("login"); setError(""); }}>
            Volver a iniciar sesión
          </Button>
        </div>
      </div>
    );
  }

  if (step === "password-updated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-foreground" />
          </div>
          <h1 className="text-2xl font-heading font-semibold text-foreground mb-3">Contraseña actualizada</h1>
          <p className="text-sm text-muted-foreground mb-8">Ya podés iniciar sesión con tu nueva contraseña.</p>
          <Button variant="cta" size="cta" onClick={() => { setStep("login"); setError(""); }}>Iniciar sesión</Button>
        </div>
      </div>
    );
  }

  // Onboarding steps + final account step
  if (step === "step-1" || step === "step-2" || step === "step-3" || step === "step-account") {
    const goBack = () => {
      if (step === "step-2") setStep("step-1");
      else if (step === "step-3") setStep("step-2");
      else if (step === "step-account") setStep("step-3");
    };
    const goNext = () => {
      if (step === "step-1") setStep("step-2");
      else if (step === "step-2") setStep("step-3");
      else if (step === "step-3") {
        if (completingProfile) {
          handleCompleteProfileForExistingUser();
        } else {
          setStep("step-account");
        }
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
        <div className="max-w-md w-full">
          <div className="flex items-center gap-2 mb-8">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  i + 1 <= currentStepNumber ? "bg-foreground" : "bg-secondary"
                }`}
              />
            ))}
          </div>

          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-2">
            Paso {currentStepNumber} de {totalSteps}
          </p>

          {step === "step-1" && (
            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-1">Identidad Personal</h2>
              <p className="text-sm text-muted-foreground mb-6">Tu nombre aparecerá en tus futuros certificados.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Nombre y Apellido *</label>
                  <input className={inputClass} value={onboardingData.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Ej: Ignacio Pérez" />
                </div>
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Edad *</label>
                  <input type="number" min={10} max={99} className={inputClass} value={onboardingData.age} onChange={(e) => set("age", e.target.value)} placeholder="17" />
                </div>
              </div>
            </div>
          )}

          {step === "step-2" && (
            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-1">Contexto Educativo</h2>
              <p className="text-sm text-muted-foreground mb-6">Queremos conocer de dónde venís.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Departamento *</label>
                  <select className={inputClass} value={onboardingData.department} onChange={(e) => set("department", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Institución educativa *</label>
                  <input className={inputClass} value={onboardingData.institution} onChange={(e) => set("institution", e.target.value)} placeholder="¿A qué liceo, UTU o facultad vas?" />
                </div>
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">¿Cómo nos conociste? *</label>
                  <select className={inputClass} value={onboardingData.howFoundUs} onChange={(e) => set("howFoundUs", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    {howFoundOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === "step-3" && (
            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-1">Compromiso con el Movimiento</h2>
              <p className="text-sm text-muted-foreground mb-6">¿Qué te trae acá?</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-3">¿Qué te interesa? * <span className="text-muted-foreground font-normal">(elegí una o más)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => (
                      <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                        className={`px-4 py-2.5 rounded-md border text-sm font-heading transition-colors ${
                          onboardingData.interests.includes(interest)
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-foreground border-border hover:bg-secondary"
                        }`}>
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">
                    ¿Por qué te interesa participar? <span className="text-muted-foreground font-normal text-xs">(opcional)</span>
                  </label>
                  <textarea
                    className={`${inputClass} h-24 py-3 resize-none`}
                    maxLength={300}
                    value={onboardingData.participationReason}
                    onChange={(e) => set("participationReason", e.target.value)}
                    placeholder="Contanos qué te gustaría aprender o lograr."
                  />
                </div>
                <div className="flex items-start gap-3 pt-2">
                  <input type="checkbox" checked={onboardingData.acceptedTerms} onChange={(e) => set("acceptedTerms", e.target.checked)} className="mt-1 w-4 h-4" />
                  <label className="text-sm text-muted-foreground">
                    Acepto que Foro Agora es un movimiento educativo sin fines de lucro y acepto los <Link to="/terminos" className="text-foreground underline">términos</Link> y la <Link to="/privacidad" className="text-foreground underline">política de privacidad</Link>. *
                  </label>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" checked={onboardingData.newsletterOptIn} onChange={(e) => set("newsletterOptIn", e.target.checked)} className="mt-1 w-4 h-4" />
                  <label className="text-sm text-muted-foreground">
                    Quiero recibir emails con novedades, recursos y recordatorios de Foro Agora.
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === "step-account" && (
            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-1">{isEventRegistrationFlow ? "Creá tu cuenta para inscribirte" : "Creá tu cuenta"}</h2>
              <p className="text-sm text-muted-foreground mb-6">{isEventRegistrationFlow ? "Elegí cómo acceder. Después vas directo al formulario del evento." : "Último paso. Elegí cómo querés acceder."}</p>

              {isEventRegistrationFlow ? (
                <div className="mb-5 flex items-start gap-3 rounded-lg border border-border bg-secondary/40 p-4">
                  <input
                    id="event-auth-terms"
                    type="checkbox"
                    checked={onboardingData.acceptedTerms}
                    onChange={(e) => { set("acceptedTerms", e.target.checked); setError(""); }}
                    className="mt-1 h-4 w-4"
                  />
                  <label htmlFor="event-auth-terms" className="text-sm leading-relaxed text-muted-foreground">
                    Acepto los <Link to="/terminos" className="text-foreground underline">términos</Link> y la <Link to="/privacidad" className="text-foreground underline">política de privacidad</Link>. *
                  </label>
                </div>
              ) : null}

              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={submitting}
                className="w-full h-12 rounded-md border border-border bg-background text-foreground text-sm font-heading font-medium flex items-center justify-center gap-3 hover:bg-secondary transition-colors mb-6 disabled:opacity-50"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                  <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Continuar con Google
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-heading">o con email</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Email</label>
                  <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
                </div>
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Contraseña</label>
                  <input type="password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={8} />
                </div>
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Confirmar contraseña</label>
                  <input type="password" className={inputClass} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required minLength={8} />
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
                <Button type="submit" variant="cta" size="cta" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  Crear cuenta
                </Button>
              </form>
            </div>
          )}

          {step !== "step-account" && error && <p className="text-destructive text-sm mt-4">{error}</p>}

          {step !== "step-account" && (
            <div className="flex items-center gap-3 mt-8">
              {currentStepNumber > 1 && (
                <Button variant="cta-outline" size="cta" onClick={goBack}>Atrás</Button>
              )}
              <Button
                variant="cta"
                size="cta"
                className="flex-1"
                disabled={!canAdvanceStep() || submitting}
                onClick={goNext}
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {step === "step-3" ? (completingProfile ? "Completar perfil" : "Siguiente") : "Siguiente"}
              </Button>
            </div>
          )}

          {!completingProfile ? (
            <p className="mt-7 text-center text-sm text-muted-foreground">
              ¿Ya tenés una cuenta?{" "}
              <button type="button" onClick={() => { setLoginChosen(true); setStep("login"); setError(""); }} className="font-semibold text-foreground underline-offset-4 hover:underline">
                Iniciar sesión
              </button>
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  // Login / forgot / reset-password
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-sm w-full">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft size={14} /> Volver
        </Link>

        <h1 className="text-2xl font-heading font-semibold text-foreground mb-1">
          {step === "login" ? "Iniciar sesión" : step === "forgot-password" ? "Recuperar contraseña" : "Nueva contraseña"}
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          {step === "login"
            ? "Ingresá a tu cuenta de Foro Agora."
            : step === "forgot-password"
              ? "Te enviaremos un link de verificación para cambiarla."
              : "Ingresá una contraseña nueva para tu cuenta."}
        </p>

        {step === "login" && (
          <>
            <button onClick={handleGoogleLogin}
              className="w-full h-12 rounded-md border border-border bg-background text-foreground text-sm font-heading font-medium flex items-center justify-center gap-3 hover:bg-secondary transition-colors mb-6">
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continuar con Google
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-heading">o con email</span>
              <div className="flex-1 h-px bg-border" />
            </div>
          </>
        )}

        <form onSubmit={step === "login" ? handleLoginSubmit : step === "forgot-password" ? handleForgotPasswordSubmit : handleUpdatePasswordSubmit} className="space-y-4">
          {step !== "reset-password" && (
            <div>
              <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Email</label>
              <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
            </div>
          )}
          {(step === "login" || step === "reset-password") && (
            <div>
              <label className="block text-sm font-heading font-medium text-foreground mb-1.5">
                {step === "reset-password" ? "Nueva contraseña" : "Contraseña"}
              </label>
              <input type="password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={8} />
            </div>
          )}
          {step === "reset-password" && (
            <div>
              <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Confirmar nueva contraseña</label>
              <input type="password" className={inputClass} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required minLength={8} />
            </div>
          )}

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" variant="cta" size="cta" className="w-full" disabled={submitting}>
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {step === "login" ? "Entrar" : step === "forgot-password" ? "Enviar link" : "Actualizar contraseña"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          {step === "login" ? (
            <>
              <button onClick={() => { setStep("forgot-password"); setError(""); }} className="text-foreground font-medium hover:underline">Olvidé mi contraseña</button>
              <span className="mx-2">·</span>
              ¿No tenés cuenta? <button onClick={() => { setLoginChosen(false); setStep("step-1"); setError(""); setOnboardingData(emptyOnboarding); }} className="text-foreground font-medium hover:underline">Registrate</button>
            </>
          ) : (
            <>¿Ya tenés cuenta? <button onClick={() => { setStep("login"); setError(""); }} className="text-foreground font-medium hover:underline">Iniciá sesión</button></>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
