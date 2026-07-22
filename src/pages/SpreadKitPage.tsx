import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Copy, Link as LinkIcon, MessageCircle, Send, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionFade from "@/components/SectionFade";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { buildReferralUrl, generateReferralCode } from "@/lib/referral";
import { toast } from "@/hooks/use-toast";

const GOAL = 5;

const shareLinks = [
  { label: "Sitio", url: "https://foroagora.org" },
  { label: "Inscripción", url: "https://foroagora.org/registro" },
  { label: "Recursos", url: "https://foroagora.org/recursos" },
  { label: "Prensa", url: "https://foroagora.org/prensa" },
];

const buildMessages = (inviteUrl: string) => [
  {
    title: "WhatsApp para estudiantes",
    channel: "WhatsApp",
    icon: MessageCircle,
    text: `Estoy compartiendo Foro Agora: una iniciativa uruguaya sin fines de lucro para aprender educación financiera, finanzas personales e inversión responsable desde cero.

No es trading, no son señales y no prometen retornos. Es educación financiera gratuita para jóvenes.

Sumate con mi link: ${inviteUrl}`,
  },
  {
    title: "LinkedIn para compartir el proyecto",
    channel: "LinkedIn",
    icon: Send,
    text: `Conocí Foro Agora, una iniciativa uruguaya sin fines de lucro que acerca educación financiera gratuita a jóvenes.

El enfoque es educativo: finanzas personales, inversión responsable y pensamiento crítico. Sin recomendaciones de inversión, sin trading y sin promesas de retorno.

Registrate con mi link: ${inviteUrl}`,
  },
  {
    title: "Mensaje corto para historias",
    channel: "Instagram",
    icon: Share2,
    text: `Educación financiera gratuita para jóvenes en Uruguay.

Foro Agora enseña finanzas personales, inversión responsable y análisis fundamental desde cero.

Sin trading. Sin señales. Sin promesas raras.

${inviteUrl}`,
  },
];

const hashtags = [
  "#EducacionFinanciera",
  "#Uruguay",
  "#Jovenes",
  "#FinanzasPersonales",
  "#InversionResponsable",
  "#ForoAgora",
];

const SpreadKitPage = () => {
  const { isLoggedIn, session, user } = useAuth();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Referral state
  const [refLoading, setRefLoading] = useState(true);
  const [code, setCode] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!isLoggedIn || !session?.user) {
        setRefLoading(false);
        return;
      }
      const userId = session.user.id;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rc: any = (supabase as any).from("referral_codes");

      let { data: row } = await rc
        .select("code, display_name")
        .eq("user_id", userId)
        .maybeSingle();

      if (!row) {
        const defaultName = user?.name || session.user.email?.split("@")[0] || "Aliado";
        let attempt = 0;
        let inserted = false;
        while (attempt < 5 && !inserted) {
          const candidate = generateReferralCode(8);
          const { data, error } = await rc
            .insert({ user_id: userId, code: candidate, display_name: defaultName })
            .select("code, display_name")
            .single();
          if (!error && data) {
            row = data;
            inserted = true;
            break;
          }
          attempt++;
        }
        if (!inserted) {
          if (!cancelled) setRefLoading(false);
          return;
        }
      }

      const { count: refCount } = await supabase
        .from("referrals" as never)
        .select("id", { count: "exact", head: true })
        .eq("referrer_user_id" as never, userId as never);

      if (cancelled) return;
      setCode(row.code);
      setDisplayName(row.display_name ?? "");
      setCount(refCount ?? 0);
      setRefLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, [isLoggedIn, session, user]);

  const inviteUrl = code ? buildReferralUrl(code) : "";
  const remaining = Math.max(0, GOAL - count);
  const onWall = count >= GOAL;

  const messages = buildMessages(inviteUrl || "https://foroagora.org");

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  const copyText = async (key: string, text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }
    } catch {
      fallbackCopy(text);
    }
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey((c) => (c === key ? null : c)), 1800);
  };

  const saveDisplayName = async () => {
    if (!session?.user) return;
    const trimmed = displayName.trim().slice(0, 40);
    setSavingName(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("referral_codes")
      .update({ display_name: trimmed || null })
      .eq("user_id", session.user.id);
    setSavingName(false);
    if (error) {
      toast({ title: "No pudimos guardar el nombre", description: error.message, variant: "destructive" });
      return;
    }
    setDisplayName(trimmed);
    toast({ title: "Guardado", description: "Tu nombre público quedó actualizado." });
  };

  return (
    <>
      <section className="relative overflow-hidden bg-white pt-32 pb-16 text-foreground dark:bg-black dark:text-white md:pt-40 md:pb-20">
        <div className="absolute -right-24 top-20 h-64 w-64 rounded-full bg-blue-soft" />
        <div className="container relative">
          <SectionFade>
            <p className="font-hand text-3xl text-orange-pop md:text-4xl">Kit de difusión</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              Ayudanos a que Foro Agora llegue a más jóvenes
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/75 dark:text-white/75">
              Compartí tu link personal de invitación o usá los textos listos. Cuando 5 personas se registren con tu link, tu nombre aparece en el muro de agradecimiento dentro de Aliados.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="cta" size="cta">
                <Link to="/registro">Inscribir a alguien</Link>
              </Button>
              <Button asChild variant="cta-outline" size="cta">
                <Link to="/partners">Ver muro de aliados</Link>
              </Button>
            </div>
          </SectionFade>
        </div>
      </section>

      {/* Personal invite section */}
      <section className="border-y border-border bg-background py-14 md:py-20">
        <div className="container">
          <div className="max-w-3xl">
            <p className="font-hand text-3xl text-blue-pop">Tu link personal</p>
            <h2 className="mt-2 text-3xl font-black leading-tight md:text-5xl">
              Invitá a 5 personas y sumate al muro
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Compartí tu link único. Cada persona que se registre con él suma un punto en tu progreso. Al llegar a 5, tu nombre aparece en el muro de agradecimiento dentro de Aliados.
            </p>
          </div>

          {!isLoggedIn ? (
            <div className="mt-8 rounded-lg border border-border bg-card p-6">
              <p className="text-muted-foreground">
                Iniciá sesión para obtener tu link personal de invitación y seguir tu progreso.
              </p>
              <Button asChild variant="cta" size="cta" className="mt-4">
                <Link to="/auth">Iniciar sesión</Link>
              </Button>
            </div>
          ) : refLoading ? (
            <p className="mt-8 text-muted-foreground">Cargando tu link…</p>
          ) : code ? (
            <div className="mt-10 grid gap-5 lg:grid-cols-[2fr_1fr]">
              <div className="rounded-lg border-2 border-foreground bg-card p-6">
                <div className="mb-2 flex items-center gap-2 text-xs font-heading font-black uppercase tracking-widest text-muted-foreground">
                  <Sparkles size={15} className="text-orange-pop" />
                  Tu link de invitación
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex-1 break-all rounded-md border border-border bg-background px-4 py-3 font-mono text-sm">
                    {inviteUrl}
                  </div>
                  <Button
                    type="button"
                    variant="cta"
                    onClick={() => copyText("invite-url", inviteUrl)}
                    className="shrink-0"
                  >
                    {copiedKey === "invite-url" ? <Check size={16} /> : <Copy size={16} />}
                    {copiedKey === "invite-url" ? "Copiado" : "Copiar link"}
                  </Button>
                </div>

                <div className="mt-6">
                  <div className="flex items-baseline justify-between">
                    <p className="text-xs font-heading font-black uppercase tracking-widest text-muted-foreground">
                      Progreso hacia el muro
                    </p>
                    <p className="font-heading text-lg font-black">
                      {count} / {GOAL}
                    </p>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-blue-pop transition-all duration-500"
                      style={{ width: `${Math.min(100, (count / GOAL) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {onWall
                      ? "¡Tu nombre ya está en el muro de Aliados! Gracias por hacer crecer la comunidad."
                      : remaining === 1
                        ? "Falta 1 persona más para que tu nombre aparezca en el muro."
                        : `Faltan ${remaining} personas más para que tu nombre aparezca en el muro.`}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <p className="text-xs font-heading font-black uppercase tracking-widest text-muted-foreground">
                  Nombre público
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Es el nombre que se muestra en el muro. Nada más se hace público.
                </p>
                <input
                  type="text"
                  maxLength={40}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tu nombre o un apodo"
                  className="mt-3 h-11 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={saveDisplayName}
                  disabled={savingName}
                  className="mt-3 w-full"
                >
                  {savingName ? "Guardando…" : "Guardar"}
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-8 text-muted-foreground">No pudimos generar tu link. Recargá la página e intentá de nuevo.</p>
          )}
        </div>
      </section>

      <section className="border-b border-border bg-background py-12 md:py-16">
        <div className="container">
          <div className="grid gap-4 md:grid-cols-4">
            {shareLinks.map((item) => (
              <div key={item.label} className="rounded-lg border border-border bg-card p-5">
                <div className="mb-3 flex items-center gap-2 font-heading font-black">
                  <LinkIcon size={17} className="text-blue-pop" />
                  {item.label}
                </div>
                <a href={item.url} className="break-all text-sm text-muted-foreground underline underline-offset-4">
                  {item.url}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <p className="font-hand text-3xl text-blue-pop">Mensajes listos</p>
            <h2 className="mt-2 text-3xl font-black leading-tight md:text-5xl">
              Copiá el texto y compartilo desde tu cuenta
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {inviteUrl
                ? "Los mensajes ya incluyen tu link personal. Cada registro con ese link cuenta para tu muro."
                : "Iniciá sesión para que los mensajes incluyan tu link personal de invitación."}
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {messages.map((message) => (
              <article key={message.title} className="rounded-lg border border-border bg-card p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-xs font-heading font-black uppercase tracking-widest text-muted-foreground">
                      <message.icon size={16} className="text-orange-pop" />
                      {message.channel}
                    </div>
                    <h3 className="font-heading text-xl font-black">{message.title}</h3>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyText(message.title, message.text)}
                    className="shrink-0"
                  >
                    {copiedKey === message.title ? <Check size={15} /> : <Copy size={15} />}
                    {copiedKey === message.title ? "Copiado" : "Copiar"}
                  </Button>
                </div>
                <pre className="mt-5 whitespace-pre-wrap rounded-lg border border-border bg-background p-4 font-sans text-sm leading-relaxed text-muted-foreground">
                  {message.text}
                </pre>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sun py-12 md:py-20">
        <div className="container grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-3xl font-black leading-tight md:text-5xl">
              Hashtags y criterio de uso
            </h2>
            <p className="mt-4 max-w-2xl text-foreground/75">
              Usalos como apoyo, no como relleno. Lo importante es que el mensaje diga claramente que Foro Agora es educativo, gratuito y sin recomendaciones de inversión.
            </p>
          </div>
          <div className="flex max-w-xl flex-wrap gap-2">
            {hashtags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/60 px-3 py-1 text-sm font-heading font-black text-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default SpreadKitPage;
