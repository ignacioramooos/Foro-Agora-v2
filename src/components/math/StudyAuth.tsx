import { useEffect, useState } from "react";
import { LogIn, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getAuthRedirectUrl } from "@/lib/authRedirect";
import MathsProfileDialog from "./MathsProfileDialog";

const translate = (msg: string) => {
  if (/invalid login/i.test(msg)) return "E-mail ou mot de passe incorrect.";
  if (/already registered/i.test(msg)) return "Un compte existe déjà avec cet e-mail.";
  if (/password/i.test(msg)) return "Le mot de passe doit contenir au moins 6 caractères.";
  if (/email not confirmed/i.test(msg)) return "Confirme ton e-mail avant de te connecter.";
  return "Une erreur est survenue. Réessaie.";
};

const StudyAuth = () => {
  const { isLoggedIn, user, login, signup, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.avatarUrl) { setAvatarUrl(null); return; }
    supabase.storage.from("profile-avatars").createSignedUrl(user.avatarUrl, 3600).then(({ data }) => setAvatarUrl(data?.signedUrl ?? null));
  }, [user?.avatarUrl]);

  const google = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: getAuthRedirectUrl("/maths") },
    });
    if (error) setError("Impossible de se connecter avec Google.");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setInfo(""); setBusy(true);
    if (mode === "login") {
      const { error } = await login(email.trim(), password);
      if (error) setError(translate(error)); else setOpen(false);
    } else {
      const { error } = await signup(email.trim(), password, name.trim() || email.split("@")[0]);
      if (error) setError(translate(error));
      else setInfo("Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse.");
    }
    setBusy(false);
  };

  if (isLoggedIn) {
    return (
      <><div className="hidden max-w-44 truncate text-xs text-muted-foreground md:block">Salut, <span className="font-semibold text-foreground">{user?.name}</span></div><DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Mon compte">{avatarUrl ? <img src={avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" /> : <User />}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="max-w-[220px] truncate">{user?.name || user?.email || "Mon compte"}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setProfileOpen(true)}><Settings className="mr-2 h-4 w-4" />Modifier mon profil</DropdownMenuItem>
          <DropdownMenuItem onClick={() => logout()}><LogOut className="mr-2 h-4 w-4" />Se déconnecter</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu><MathsProfileDialog open={profileOpen} onOpenChange={setProfileOpen} /></>
    );
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => { setOpen(true); setError(""); setInfo(""); }} className="ml-1">
        <LogIn className="h-4 w-4" /><span className="hidden sm:inline">Se connecter</span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{mode === "login" ? "Se connecter" : "Créer un compte"}</DialogTitle>
            <DialogDescription>Ta progression et ton objectif seront sauvegardés sur ton compte.</DialogDescription>
          </DialogHeader>
          <Button type="button" variant="outline" className="w-full" onClick={google}>Continuer avec Google</Button>
          <div className="text-center text-xs text-muted-foreground">ou</div>
          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <div className="space-y-1.5"><Label htmlFor="sa-name">Prénom</Label>
                <Input id="sa-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" /></div>
            )}
            <div className="space-y-1.5"><Label htmlFor="sa-email">E-mail</Label>
              <Input id="sa-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></div>
            <div className="space-y-1.5"><Label htmlFor="sa-pass">Mot de passe</Label>
              <Input id="sa-pass" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} /></div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {info && <p className="text-sm text-primary">{info}</p>}
            <Button type="submit" className="w-full" disabled={busy}>{mode === "login" ? "Se connecter" : "Créer mon compte"}</Button>
          </form>
          <Button type="button" variant="link" className="h-auto p-0 text-sm text-muted-foreground"
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setInfo(""); }}>
            {mode === "login" ? "Pas encore de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudyAuth;
