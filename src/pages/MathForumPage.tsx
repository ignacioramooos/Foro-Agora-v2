import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, FileText, Heart, Loader2, MessageCircle, Paperclip, Send, Trash2 } from "lucide-react";
import { z } from "zod";
import MathShell from "@/components/math/MathShell";
import MathsAdBanner from "@/components/math/MathsAdBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const useForumAvatars = () => {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const load = useCallback(async () => {
    const { data } = await supabase.rpc("get_public_profiles");
    const rows = ((data ?? []) as { user_id: string; avatar_url: string | null }[]).filter((r) => r.avatar_url);
    if (!rows.length) return setUrls({});
    const { data: signed } = await supabase.storage.from("profile-avatars").createSignedUrls(rows.map((r) => r.avatar_url!), 3600);
    const map: Record<string, string> = {};
    rows.forEach((r, i) => { const u = signed?.[i]?.signedUrl; if (u) map[r.user_id] = u; });
    setUrls(map);
  }, []);
  useEffect(() => {
    load();
    window.addEventListener("maths-profile-updated", load);
    return () => window.removeEventListener("maths-profile-updated", load);
  }, [load]);
  return urls;
};

const AuthorAvatar = ({ url, name, small }: { url?: string; name: string; small?: boolean }) => (
  <Avatar className={small ? "h-6 w-6" : "h-9 w-9"}>
    {url && <AvatarImage src={url} alt="" className="object-cover" />}
    <AvatarFallback className="text-xs font-semibold">{(name || "?").charAt(0).toUpperCase()}</AvatarFallback>
  </Avatar>
);

type Post = Tables<"maths_forum_posts">;
type Comment = Tables<"maths_forum_comments">;
type Reaction = Tables<"maths_forum_reactions">;
type Attachment = Tables<"maths_forum_attachments">;
type ForumPost = Post & { comments: Comment[]; reactions: Reaction[]; attachments: Attachment[] };

const postSchema = z.object({ title: z.string().trim().min(3, "Le titre est trop court.").max(140), body: z.string().trim().min(1, "Écris un message.").max(5000) });
const commentSchema = z.string().trim().min(1).max(1500);
const allowedTypes = new Set(["application/pdf", "image/png", "image/jpeg", "image/webp", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]);
const formatDate = (value: string) => new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
const safeName = (name: string) => name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120) || "document";

const MathForumPage = () => {
  const { isLoggedIn, user, session } = useAuth();
  const { isAdmin } = useUserRole();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [comments, setComments] = useState<Record<string, string>>({});
  const avatars = useForumAvatars();

  const loadPosts = useCallback(async () => {
    const { data, error: queryError } = await supabase.from("maths_forum_posts").select("*, maths_forum_comments(*), maths_forum_reactions(*), maths_forum_attachments(*)").order("updated_at", { ascending: false });
    if (queryError) setError("Le Forum n'a pas pu être chargé.");
    else setPosts((data ?? []).map((item) => ({ ...item, comments: item.maths_forum_comments ?? [], reactions: item.maths_forum_reactions ?? [], attachments: item.maths_forum_attachments ?? [] })));
    setLoading(false);
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);
  const openAuth = () => window.dispatchEvent(new Event("maths-open-auth"));

  const selectFiles = (list: FileList | null) => {
    const chosen = Array.from(list ?? []).slice(0, 3);
    const invalid = chosen.find((file) => !allowedTypes.has(file.type) || file.size > 20 * 1024 * 1024);
    if (invalid) { setError("PDF, images ou fichiers Office uniquement, 20 Mo maximum par fichier."); return; }
    setFiles(chosen); setError("");
  };

  const publish = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session?.user || !user) { openAuth(); return; }
    const parsed = postSchema.safeParse({ title, body });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Vérifie le message."); return; }
    setBusy(true); setError("");
    const { data: post, error: postError } = await supabase.from("maths_forum_posts").insert({ user_id: session.user.id, author_name: user.name, title: parsed.data.title, body: parsed.data.body }).select().single();
    if (postError || !post) { setError("La publication n'a pas pu être envoyée."); setBusy(false); return; }
    const uploaded: string[] = [];
    for (const file of files) {
      const path = `${session.user.id}/${post.id}/${crypto.randomUUID()}-${safeName(file.name)}`;
      const { error: uploadError } = await supabase.storage.from("maths-forum-files").upload(path, file, { contentType: file.type });
      if (uploadError) { setError("Le message est publié, mais un document n'a pas pu être ajouté."); continue; }
      uploaded.push(path);
      const { error: metadataError } = await supabase.from("maths_forum_attachments").insert({ post_id: post.id, user_id: session.user.id, storage_path: path, file_name: file.name, mime_type: file.type, file_size: file.size });
      if (metadataError) { await supabase.storage.from("maths-forum-files").remove([path]); setError("Le message est publié, mais un document n'a pas pu être ajouté."); }
    }
    setTitle(""); setBody(""); setFiles([]); setBusy(false); await loadPosts();
  };

  const toggleLike = async (post: ForumPost) => {
    if (!session?.user) { openAuth(); return; }
    const mine = post.reactions.some((reaction) => reaction.user_id === session.user.id);
    if (mine) await supabase.from("maths_forum_reactions").delete().eq("post_id", post.id).eq("user_id", session.user.id).eq("reaction_type", "like");
    else await supabase.from("maths_forum_reactions").insert({ post_id: post.id, user_id: session.user.id, reaction_type: "like" });
    await loadPosts();
  };

  const addComment = async (postId: string) => {
    if (!session?.user || !user) { openAuth(); return; }
    const parsed = commentSchema.safeParse(comments[postId] ?? "");
    if (!parsed.success) { setError("Le commentaire doit contenir entre 1 et 1 500 caractères."); return; }
    const { error: commentError } = await supabase.from("maths_forum_comments").insert({ post_id: postId, user_id: session.user.id, author_name: user.name, body: parsed.data });
    if (commentError) setError("Le commentaire n'a pas pu être envoyé.");
    else { setComments((current) => ({ ...current, [postId]: "" })); await loadPosts(); }
  };

  const removePost = async (post: ForumPost) => {
    if (post.attachments.length) await supabase.storage.from("maths-forum-files").remove(post.attachments.map((file) => file.storage_path));
    const { error: deleteError } = await supabase.from("maths_forum_posts").delete().eq("id", post.id);
    if (deleteError) setError("La publication n'a pas pu être supprimée."); else await loadPosts();
  };

  const download = async (attachment: Attachment) => {
    const { data, error: downloadError } = await supabase.storage.from("maths-forum-files").download(attachment.storage_path);
    if (downloadError || !data) { setError("Le document n'a pas pu être téléchargé."); return; }
    const url = URL.createObjectURL(data); const anchor = document.createElement("a"); anchor.href = url; anchor.download = attachment.file_name; anchor.click(); URL.revokeObjectURL(url);
  };

  const totalFiles = useMemo(() => posts.reduce((sum, post) => sum + post.attachments.length, 0), [posts]);

  return <MathShell top={<div><h1 className="font-heading text-xl font-bold text-foreground">Forum</h1><p className="mt-1 text-sm text-muted-foreground">{posts.length} publication{posts.length === 1 ? "" : "s"} · {totalFiles} document{totalFiles === 1 ? "" : "s"}</p></div>}>
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-5 sm:px-8 lg:px-10"><MathsAdBanner />
      <header className="border-b border-border pb-5"><h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">Forum de la classe</h2><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Partagez vos questions, méthodes et documents. Tout le monde peut lire ; il faut un compte pour participer.</p></header>
      {isLoggedIn ? <form onSubmit={publish} className="space-y-4 border-b border-border pb-6"><div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]"><div className="space-y-2"><Label htmlFor="forum-title">Titre</Label><Input id="forum-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={140} placeholder="Quelle est ta question ou ta ressource ?" required /></div><div className="self-end"><Label htmlFor="forum-files" className="sr-only">Documents</Label><label htmlFor="forum-files" className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground"><Paperclip className="h-4 w-4" />{files.length ? `${files.length} fichier${files.length > 1 ? "s" : ""}` : "Joindre"}</label><Input id="forum-files" type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.ppt,.pptx,.xls,.xlsx" className="sr-only" onChange={(event) => selectFiles(event.target.files)} /></div></div><Textarea value={body} onChange={(event) => setBody(event.target.value)} maxLength={5000} rows={4} placeholder="Écris ton message…" required />{files.length > 0 && <ul className="space-y-1 text-xs text-muted-foreground">{files.map((file) => <li key={`${file.name}-${file.size}`} className="truncate">{file.name} · {(file.size / 1024 / 1024).toFixed(1)} Mo</li>)}</ul>}<div className="flex justify-end"><Button type="submit" disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : <Send />}Publier</Button></div></form> : <div className="flex flex-col items-start justify-between gap-3 border-b border-border pb-6 sm:flex-row sm:items-center"><p className="text-sm text-muted-foreground">Connecte-toi pour publier, commenter et partager un document.</p><Button onClick={openAuth}>Se connecter</Button></div>}
      {error && <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      {loading ? <div className="flex justify-center py-12"><Loader2 className="animate-spin text-muted-foreground" /></div> : posts.length === 0 ? <div className="py-14 text-center"><MessageCircle className="mx-auto h-8 w-8 text-muted-foreground" /><p className="mt-3 font-medium text-foreground">Le Forum est encore vide.</p><p className="mt-1 text-sm text-muted-foreground">Sois la première personne à lancer une discussion.</p></div> : <div className="divide-y divide-border border-y border-border">{posts.map((post) => { const canDelete = session?.user?.id === post.user_id || isAdmin; const liked = post.reactions.some((reaction) => reaction.user_id === session?.user?.id); return <article key={post.id} className="py-6"><div className="flex items-start justify-between gap-4"><div className="flex min-w-0 gap-3"><AuthorAvatar url={avatars[post.user_id]} name={post.author_name} /><div className="min-w-0"><h3 className="break-words font-heading text-xl font-bold text-foreground">{post.title}</h3><p className="mt-1 text-xs text-muted-foreground">{post.author_name} · {formatDate(post.created_at)}</p></div></div>{canDelete && <Button variant="ghost" size="icon" onClick={() => removePost(post)} aria-label="Supprimer la publication"><Trash2 className="h-4 w-4" /></Button>}</div><p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-foreground">{post.body}</p>{post.attachments.length > 0 && <div className="mt-4 grid gap-2 sm:grid-cols-2">{post.attachments.map((attachment) => <Button key={attachment.id} type="button" variant="outline" className="h-auto min-h-11 justify-start overflow-hidden" onClick={() => download(attachment)}><FileText className="shrink-0" /><span className="min-w-0 flex-1 truncate text-left">{attachment.file_name}</span><Download className="shrink-0" /></Button>)}</div>}<div className="mt-4 flex items-center gap-2"><Button variant={liked ? "secondary" : "ghost"} size="sm" onClick={() => toggleLike(post)} aria-pressed={liked}><Heart className={liked ? "fill-current" : ""} />{post.reactions.length}</Button><span className="text-xs text-muted-foreground">{post.comments.length} commentaire{post.comments.length === 1 ? "" : "s"}</span></div>{post.comments.length > 0 && <div className="mt-4 space-y-3 border-l-2 border-border pl-4">{post.comments.map((comment) => <div key={comment.id}><p className="flex items-center gap-2 text-xs font-semibold text-foreground"><AuthorAvatar small url={avatars[comment.user_id]} name={comment.author_name} />{comment.author_name} <span className="font-normal text-muted-foreground">· {formatDate(comment.created_at)}</span></p><p className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground">{comment.body}</p></div>)}</div>}<div className="mt-4 flex gap-2"><Input value={comments[post.id] ?? ""} onChange={(event) => setComments((current) => ({ ...current, [post.id]: event.target.value }))} maxLength={1500} placeholder={isLoggedIn ? "Répondre…" : "Connecte-toi pour répondre"} onFocus={() => { if (!isLoggedIn) openAuth(); }} readOnly={!isLoggedIn} /><Button variant="outline" size="icon" onClick={() => addComment(post.id)} aria-label="Envoyer le commentaire"><Send /></Button></div></article>; })}</div>}
    </div>
  </MathShell>;
};

export default MathForumPage;