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
import { signupWithPassword } from "@/lib/passwordSignup";
import { getSubjectStrings, type SubjectStrings } from "@/content/subjects/i18n";

const translate = (msg: string, a: SubjectStrings["auth"]) => {
  if (/invalid login/i.test(msg)) return a.errInvalid;
  if (/already registered/i.test(msg)) return a.errExists;
  if (/password/i.test(msg)) return a.errPassword;
  if (/email not confirmed/i.test(msg)) return a.errUnconfirmed;
  return a.errGeneric;
};

/** Sign-in button + dialog. Defaults to French and /maths (standalone Maths); classrooms pass their own strings and path. */
const StudyAuth = ({ strings = getSubjectStrings("fr"), redirectPath = "/maths" }: { strings?: SubjectStrings; redirectPath?: string }) => {
  const a = strings.auth;
  const { isLoggedIn, user, login, logout } = useAuth();
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
    const openAuth = () => { setOpen(true); setError(""); setInfo(""); };
    window.addEventListener("maths-open-auth", openAuth);
    return () => window.removeEventListener("maths-open-auth", openAuth);
  }, []);

  useEffect(() => {
    if (!user?.avatarUrl) { setAvatarUrl(null); return; }
    supabase.storage.from("profile-avatars").createSignedUrl(user.avatarUrl, 3600).then(({ data }) => setAvatarUrl(data?.signedUrl ?? null));
  }, [user?.avatarUrl]);

  const google = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: getAuthRedirectUrl(redirectPath) },
    });
    if (error) setError(a.googleError);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setInfo(""); setBusy(true);
    if (mode === "login") {
      const { error } = await login(email.trim(), password);
      if (error) setError(translate(error, a)); else setOpen(false);
    } else {
      const { error, confirmationRequired } = await signupWithPassword({
        email, password,
        metadata: { display_name: name.trim() || email.split("@")[0], signup_source: "maths" },
        emailRedirectTo: getAuthRedirectUrl(redirectPath),
      });
      if (error) setError(translate(error, a));
      else if (confirmationRequired) setInfo(a.created);
      else setOpen(false);
    }
    setBusy(false);
  };

  if (isLoggedIn) {
    return (
      <><div className="hidden max-w-44 truncate text-xs text-muted-foreground md:block">{a.hello} <span className="font-semibold text-foreground">{user?.name}</span></div><DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={a.myAccount}>{avatarUrl ? <img src={avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" /> : <User />}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="max-w-[220px] truncate">{user?.name || user?.email || a.myAccount}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setProfileOpen(true)}><Settings className="mr-2 h-4 w-4" />{a.editProfile}</DropdownMenuItem>
          <DropdownMenuItem onClick={() => logout()}><LogOut className="mr-2 h-4 w-4" />{a.signOut}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu><MathsProfileDialog open={profileOpen} onOpenChange={setProfileOpen} strings={strings.profile} /></>
    );
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => { setOpen(true); setError(""); setInfo(""); }} className="ml-1" aria-label={a.signIn}>
        <LogIn className="h-4 w-4" /><span className="hidden sm:inline">{a.signIn}</span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{mode === "login" ? a.signIn : a.createAccount}</DialogTitle>
            <DialogDescription>{a.dialogDesc}</DialogDescription>
          </DialogHeader>
          <Button type="button" variant="outline" className="w-full" onClick={google}>{a.google}</Button>
          <div className="text-center text-xs text-muted-foreground">{a.or}</div>
          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <div className="space-y-1.5"><Label htmlFor="sa-name">{a.firstName}</Label>
                <Input id="sa-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" /></div>
            )}
            <div className="space-y-1.5"><Label htmlFor="sa-email">{a.email}</Label>
              <Input id="sa-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></div>
            <div className="space-y-1.5"><Label htmlFor="sa-pass">{a.password}</Label>
              <Input id="sa-pass" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} /></div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {info && <p className="text-sm text-primary">{info}</p>}
            <Button type="submit" className="w-full" disabled={busy}>{mode === "login" ? a.signIn : a.submitSignup}</Button>
          </form>
          <Button type="button" variant="link" className="h-auto p-0 text-sm text-muted-foreground"
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setInfo(""); }}>
            {mode === "login" ? a.toSignup : a.toLogin}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudyAuth;
