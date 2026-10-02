import { useEffect, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const MathsProfileDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const { user, session, refreshProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (open) { setName(user?.name ?? ""); setFile(null); setError(""); } }, [open, user?.name]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session?.user || !user) return;
    const cleanName = name.trim();
    if (!cleanName || cleanName.length > 100) { setError("Le nom doit contenir entre 1 et 100 caractères."); return; }
    if (file && (!IMAGE_TYPES.includes(file.type) || file.size > 5 * 1024 * 1024)) { setError("Choisis une image JPG, PNG ou WebP de moins de 5 Mo."); return; }
    setBusy(true); setError("");
    let avatarUrl = user.avatarUrl;
    if (file) {
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${session.user.id}/avatar.${extension}`;
      const { error: uploadError } = await supabase.storage.from("profile-avatars").upload(path, file, { upsert: true, contentType: file.type });
      if (uploadError) { setError("La photo n'a pas pu être enregistrée."); setBusy(false); return; }
      avatarUrl = path;
    }
    const { error: updateError } = await supabase.from("profiles").update({ display_name: cleanName, avatar_url: avatarUrl }).eq("user_id", session.user.id);
    if (updateError) setError("Le profil n'a pas pu être enregistré.");
    else { await refreshProfile(); window.dispatchEvent(new Event("maths-profile-updated")); onOpenChange(false); }
    setBusy(false);
  };

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Mon profil</DialogTitle><DialogDescription>Ce profil est le même sur Maths et Foro Agora.</DialogDescription></DialogHeader><form onSubmit={save} className="space-y-4"><div className="space-y-1.5"><Label htmlFor="math-profile-name">Nom affiché</Label><Input id="math-profile-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={100} required /></div><div className="space-y-1.5"><Label htmlFor="math-profile-photo">Photo</Label><label htmlFor="math-profile-photo" className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-3 text-sm text-foreground hover:bg-muted"><Camera className="h-5 w-5" /><span className="min-w-0 truncate">{file?.name || "Choisir une photo"}</span></label><Input id="math-profile-photo" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></div>{error && <p className="text-sm text-destructive">{error}</p>}<Button type="submit" className="w-full" disabled={busy}>{busy && <Loader2 className="animate-spin" />}Enregistrer</Button></form></DialogContent></Dialog>;
};

export default MathsProfileDialog;