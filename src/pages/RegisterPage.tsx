import { useState, useEffect } from "react";
import { Link, Navigate, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SectionFade from "@/components/SectionFade";
import { CheckCircle2, MapPin, Calendar, Gift, Users, Loader2, Save, Download, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { curriculumClassCount } from "@/lib/curriculum";
import { toast } from "sonner";
import {
  EVENT_ADDRESS,
  EVENT_LOCATION_NAME,
  formatEventDate,
  formatEventTimeRange,
  getAppleCalendarDataUrl,
  getEventAuthPath,
  getGoogleCalendarUrl,
  getGoogleMapsEmbedUrl,
  getGoogleMapsUrl,
  getRegistrationLimit,
  isValidUruguayanCedula,
  normalizeCedula,
  type ClassSession,
} from "@/lib/classEvent";

const FALLBACK_EVENT: ClassSession = {
  id: "primer-encuentro-foro-agora-2026",
  title: "Primer encuentro de Foro Agora",
  module_number: 1,
  class_date: "2026-07-22T21:00:00.000Z",
  end_date: "2026-07-22T23:00:00.000Z",
  location: "Sala audiovisual de Casa INJU",
  max_capacity: 80,
  registration_limit: 90,
  is_active: true,
  is_featured: true,
  notes: null,
};

const departments = [
  "Montevideo", "Canelones", "Maldonado", "Salto", "Colonia", "Paysandú",
  "Rivera", "Soriano", "Cerro Largo", "San José", "Tacuarembó", "Rocha",
  "Florida", "Durazno", "Artigas", "Treinta y Tres", "Lavalleja", "Flores", "Río Negro",
];

const hearOptions = [
  "Instagram",
  "Amigo / Boca a boca",
  "Actividad abierta",
  "Un amigo/a",
  "Mi liceo",
  "LinkedIn",
  "Google",
  "Otro",
];

const RegisterPage = () => {
  const { user, session, isLoggedIn, loading: authLoading } = useAuth();
  const { updateProfile } = useProfile();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [classesLoading, setClassesLoading] = useState(true);
  const [checkingRegistration, setCheckingRegistration] = useState(false);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [selectedClassId, setSelectedClassId] = useState(searchParams.get("class") || "");
  const [moduleWarningOpen, setModuleWarningOpen] = useState(false);
  const [moduleWarningAccepted, setModuleWarningAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "", age: "", school: "", department: "", email: "", phone: "", cedula: "", hearAbout: "", why: "", consent: false,
  });

  const selectedClass = classes.find((c) => c.id === selectedClassId) || null;

  useEffect(() => {
    if (!user) return;
    setForm((p) => ({
      ...p,
      name: user.name || p.name,
      email: user.email || p.email,
    }));
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, age, department, institution, how_found_us")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!data) return;
      setForm((p) => ({
        ...p,
        name: p.name || data.full_name || "",
        age: p.age || (data.age ? String(data.age) : ""),
        school: p.school || data.institution || "",
        department: p.department || data.department || "",
        hearAbout: p.hearAbout || data.how_found_us || "",
      }));
    })();
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    const fallback = window.setTimeout(() => {
      if (!cancelled) setClassesLoading(false);
    }, 5000);

    const fetchClasses = async () => {
      const { data, error } = await supabase
        .from("class_sessions")
        .select("*")
        .eq("is_active", true)
        .gte("class_date", new Date().toISOString())
        .order("class_date", { ascending: true });

      if (error) {
        if (cancelled) return;
        setClasses([]);
        setClassesLoading(false);
        return;
      }

      if (cancelled) return;
      const sessions = (data || []) as ClassSession[];
      setClasses(sessions);
      if (sessions.length > 0) {
        setSelectedClassId((current) => current || sessions[0].id);
      }
      setClassesLoading(false);
    };
    fetchClasses();
    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!session?.user?.id || !selectedClassId) return;
    let cancelled = false;
    setCheckingRegistration(true);

    const checkExistingRegistration = async () => {
      const { data } = await supabase
        .from("class_registrations")
        .select("id")
        .eq("class_id", selectedClassId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!cancelled) {
        setSubmitted(Boolean(data));
        setCheckingRegistration(false);
      }
    };

    checkExistingRegistration();
    return () => {
      cancelled = true;
    };
  }, [selectedClassId, session?.user?.id]);

  const set = (field: string, value: string | boolean) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Campo requerido";
    if (!form.age || Number(form.age) < 13 || Number(form.age) > 99) e.age = "Ingresá una edad válida";
    if (!form.school.trim()) e.school = "Campo requerido";
    if (!form.department) e.department = "Seleccioná un departamento";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Email inválido";
    if (!isValidUruguayanCedula(form.cedula)) e.cedula = "Ingresá una cédula uruguaya válida";
    if (!selectedClassId) e.class = "Seleccioná una clase";
    if (!form.consent) e.consent = "Debés aceptar para continuar";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitRegistration = async () => {
    setLoading(true);
    setErrors((prev) => ({ ...prev, submit: "" }));

    if (!session?.user) {
      setLoading(false);
      setErrors((prev) => ({ ...prev, submit: "Iniciá sesión para completar la inscripción." }));
      return;
    }

    const { error } = await supabase.from("class_registrations").insert({
      class_id: selectedClassId,
      user_id: session.user.id,
      cedula: normalizeCedula(form.cedula),
      name: form.name,
      age: Number(form.age),
      school: form.school,
      department: form.department,
      email: form.email,
      phone: form.phone || null,
      hear_about: form.hearAbout || null,
      why: form.why || null,
      consent: form.consent,
    });

    setLoading(false);

    if (error) {
      const message = error.code === "23505"
        ? "Ya estás inscripto a este encuentro."
        : error.message.includes("límite")
          ? "Se alcanzó el límite de 90 inscripciones."
          : "No pudimos confirmar la inscripción. Revisá los datos e intentá de nuevo.";
      setErrors((prev) => ({ ...prev, submit: message }));
      return;
    }

    setSubmitted(true);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    if (selectedClass && selectedClass.module_number > 1 && !moduleWarningAccepted) {
      setModuleWarningOpen(true);
      return;
    }

    await submitRegistration();
  };

  const confirmModuleWarning = async () => {
    setModuleWarningAccepted(true);
    setModuleWarningOpen(false);
    await submitRegistration();
  };

  const saveProfileChanges = async () => {
    if (!user?.id) {
      toast.error("No hay una sesión activa");
      return;
    }

    setSavingProfile(true);
    try {
      const result = await updateProfile(user.id, {
        full_name: form.name,
        age: form.age ? Number(form.age) : null,
        department: form.department,
        institution: form.school,
        how_found_us: form.hearAbout,
      });

      if (result.success) {
        toast.success("Perfil actualizado exitosamente");
      } else {
        toast.error(result.error || "Error al actualizar perfil");
      }
    } finally {
      setSavingProfile(false);
    }
  };

  if (authLoading) return null;

  if (!isLoggedIn || !session?.user) {
    const selectedId = searchParams.get("class");
    const returnTo = `${location.pathname}${location.search}`;
    return <Navigate to={selectedId ? getEventAuthPath(selectedId) : `/auth?mode=signup&returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }

  if (submitted) {
    const confirmedClass = selectedClass || FALLBACK_EVENT;
    const googleCalendarUrl = getGoogleCalendarUrl(confirmedClass);
    const appleCalendarUrl = getAppleCalendarDataUrl(confirmedClass);
    const googleMapsUrl = getGoogleMapsUrl();

    return (
      <div className="min-h-screen bg-background pb-16 pt-28 md:pt-36">
        <SectionFade>
          <div className="mx-auto max-w-3xl px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-foreground" />
            </div>
            <h1 className="text-3xl font-heading font-semibold text-foreground mb-4">Inscripción recibida</h1>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Tu lugar quedó reservado para <strong className="text-foreground">{confirmedClass.title}</strong>.
            </p>
            <div className="border border-border rounded-lg p-6 text-left space-y-3 text-sm">
              <p className="font-heading font-semibold text-foreground">¿Qué sigue?</p>
              <p className="text-muted-foreground">{formatEventDate(confirmedClass.class_date)}</p>
              <p className="text-muted-foreground">{formatEventTimeRange(confirmedClass)}</p>
              <p className="text-muted-foreground">Sala audiovisual de Casa INJU</p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button asChild variant="cta" className="w-full">
                <a href={googleCalendarUrl} target="_blank" rel="noreferrer">
                  <Calendar size={17} />
                  Agregar a Google Calendar
                  <ExternalLink size={15} />
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href={appleCalendarUrl} download="primer-encuentro-foro-agora.ics">
                  <Download size={17} />
                  Agregar a Apple Calendar
                </a>
              </Button>
            </div>

            <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm">
              <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-heading font-semibold text-foreground">{EVENT_LOCATION_NAME}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{EVENT_ADDRESS}</p>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-blue-pop hover:underline"
                >
                  Cómo llegar <ExternalLink size={15} />
                </a>
              </div>
              <div className="relative h-72 border-t border-border">
                <iframe
                  src={getGoogleMapsEmbedUrl()}
                  title={`Mapa de ${EVENT_LOCATION_NAME}`}
                  className="h-full w-full border-0 pointer-events-none"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  tabIndex={-1}
                />
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 z-10"
                  aria-label={`Abrir ${EVENT_LOCATION_NAME} en Google Maps`}
                >
                  <span className="sr-only">Abrir ubicación en Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </SectionFade>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full h-12 px-4 rounded-md border bg-background text-foreground text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-ring/50 font-heading ${
      errors[field] ? "border-destructive" : "border-border"
    }`;

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-36 pb-20">
      <div className="container max-w-5xl">
        <div className="grid md:grid-cols-5 gap-10 md:gap-16">
          <div className="md:col-span-3">
            <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
              Inscripción
            </p>
            <h1 className="text-3xl md:text-4xl text-foreground mb-2">
              Inscribite a una clase
            </h1>
            <p className="text-muted-foreground mb-8">Tus datos básicos ya están completos. Agregá tu cédula y confirmá tu lugar.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Clase *</label>
                <select
                  className={inputClass("class")}
                  value={selectedClassId}
                  disabled={classesLoading || classes.length === 0}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    setModuleWarningAccepted(false);
                    setErrors((p) => ({ ...p, class: "" }));
                  }}
                >
                  <option value="">{classesLoading ? "Cargando clases..." : classes.length === 0 ? "No hay clases disponibles" : "Seleccionar clase..."}</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} · {formatEventDate(c.class_date)} · {formatEventTimeRange(c)}
                    </option>
                  ))}
                </select>
                {errors.class && <p className="text-destructive text-xs mt-1">{errors.class}</p>}
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Nombre completo *</label>
                <input className={inputClass("name")} value={form.name} onChange={(e) => set("name", e.target.value)} />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Edad *</label>
                  <input type="number" className={inputClass("age")} value={form.age} onChange={(e) => set("age", e.target.value)} />
                  {errors.age && <p className="text-destructive text-xs mt-1">{errors.age}</p>}
                </div>
                <div>
                  <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Departamento *</label>
                  <select className={inputClass("department")} value={form.department} onChange={(e) => set("department", e.target.value)}>
                    <option value="">Seleccionar...</option>
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.department && <p className="text-destructive text-xs mt-1">{errors.department}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Institución educativa *</label>
                <input className={inputClass("school")} value={form.school} onChange={(e) => set("school", e.target.value)} />
                {errors.school && <p className="text-destructive text-xs mt-1">{errors.school}</p>}
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Email *</label>
                <input type="email" className={inputClass("email")} value={form.email} readOnly aria-readonly="true" />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="event-cedula" className="block text-sm font-heading font-medium text-foreground mb-1.5">Cédula de identidad *</label>
                <input
                  id="event-cedula"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={10}
                  className={inputClass("cedula")}
                  value={form.cedula}
                  onChange={(e) => set("cedula", e.target.value)}
                  placeholder="Ej: 4.567.890-1"
                  aria-describedby="cedula-help"
                />
                <p id="cedula-help" className="mt-1 text-xs text-muted-foreground">Se solicita para confirmar tu identidad y evitar inscripciones duplicadas.</p>
                {errors.cedula && <p className="text-destructive text-xs mt-1">{errors.cedula}</p>}
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Teléfono / WhatsApp <span className="text-muted-foreground text-xs">(opcional)</span></label>
                <input className={inputClass("phone")} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">¿Cómo nos conociste?</label>
                <select className={inputClass("hearAbout")} value={form.hearAbout} onChange={(e) => set("hearAbout", e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {hearOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-heading font-medium text-foreground mb-1.5">¿Por qué querés participar? <span className="text-muted-foreground text-xs">(opcional, máx 200 caracteres)</span></label>
                <textarea
                  className={`${inputClass("why")} h-24 py-3 resize-none`}
                  maxLength={200}
                  value={form.why}
                  onChange={(e) => set("why", e.target.value)}
                />
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => set("consent", e.target.checked)}
                  className="mt-1 w-4 h-4"
                />
                <label className="text-sm text-muted-foreground">
                  Acepto los <Link to="/terminos" className="text-foreground underline underline-offset-2">términos</Link>, la <Link to="/privacidad" className="text-foreground underline underline-offset-2">política de privacidad</Link> y el uso de estos datos para gestionar mi inscripción. *
                </label>
              </div>
              {errors.consent && <p className="text-destructive text-xs">{errors.consent}</p>}
              {errors.submit && <p className="text-destructive text-xs">{errors.submit}</p>}
              <div className="flex gap-3">
                <Button type="submit" variant="cta" size="cta" className="flex-1" disabled={loading || checkingRegistration}>
                  {loading || checkingRegistration ? <Loader2 size={16} className="animate-spin" /> : "Inscribirme"}
                </Button>
                {user && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="default"
                    onClick={saveProfileChanges}
                    disabled={savingProfile}
                    className="flex items-center gap-2"
                  >
                    {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Guardar Perfil
                  </Button>
                )}
              </div>
            </form>
          </div>

          <div className="md:col-span-2">
            <div className="border border-border rounded-lg p-6 md:p-8 md:sticky md:top-28 space-y-6">
              <h3 className="font-heading font-semibold text-foreground text-lg">¿Qué incluye?</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                  <div><strong className="text-foreground font-heading">Clase seleccionada:</strong><br /><span className="text-muted-foreground">{selectedClass ? `${selectedClass.title} · Clase ${selectedClass.module_number} de ${curriculumClassCount}` : "Seleccioná una clase"}</span></div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                  <div><strong className="text-foreground font-heading">Ubicación:</strong><br /><span className="text-muted-foreground">{selectedClass?.location || "Sala audiovisual de Casa INJU"}</span></div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                  <div><strong className="text-foreground font-heading">Fecha y hora:</strong><br /><span className="text-muted-foreground">{selectedClass ? `${formatEventDate(selectedClass.class_date)} · ${formatEventTimeRange(selectedClass)}` : "Miércoles 22 de julio · 18:00 a 20:00"}</span></div>
                </div>
                <div className="flex items-start gap-3">
                  <Gift size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                  <div><strong className="text-foreground font-heading">Costo:</strong><br /><span className="text-muted-foreground">Sin costo</span></div>
                </div>
                <div className="flex items-start gap-3">
                  <Users size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                  <div><strong className="text-foreground font-heading">Cupos:</strong><br /><span className="text-muted-foreground">{selectedClass ? `${selectedClass.max_capacity} lugares presenciales · hasta ${getRegistrationLimit(selectedClass)} inscripciones` : "80 lugares · hasta 90 inscripciones"}</span></div>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-muted-foreground text-sm">
                  ¿Tenés dudas?{" "}
                  <a href="/contacto" className="text-foreground font-medium hover:underline">Contactanos</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={moduleWarningOpen} onOpenChange={setModuleWarningOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Esta clase empieza en la clase {selectedClass?.module_number} del plan</DialogTitle>
            <DialogDescription>
              Si es tu primera vez viniendo a clase, la clase anterior puede estar grabada y subida en la sección de clases. Podés verla antes de asistir.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Button variant="outline" onClick={() => setModuleWarningOpen(false)}>
              No, no quiero registrarme
            </Button>
            <Button variant="cta" onClick={confirmModuleWarning} disabled={loading}>
              Sí, quiero registrarme
            </Button>
            <Button asChild variant="secondary">
              <Link to="/auth">Ver clases grabadas →</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegisterPage;
