import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageCircle, Send, ThumbsUp, Trash2, Users, RefreshCw, Megaphone, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tables } from "@/integrations/supabase/types";

type CommunityPostType = "analysis" | "announcement";
type CommunityFilter = "all" | CommunityPostType;
type CommunityPostRow = Tables<"community_posts">;
type CommunityCommentRow = Tables<"community_post_comments">;
type CommunityReactionRow = Tables<"community_post_reactions">;

interface CommunityPost extends CommunityPostRow {
  type: CommunityPostType;
  body: string;
  comments: CommunityCommentRow[];
  likeCount: number;
  likedByMe: boolean;
}

const isCommunityPostType = (value: string): value is CommunityPostType =>
  value === "analysis" || value === "announcement";

const postTypeLabel: Record<CommunityPostType, string> = {
  announcement: "Anuncio",
  analysis: "Analisis",
};

const postTypeIcon: Record<CommunityPostType, typeof Megaphone> = {
  announcement: Megaphone,
  analysis: FileText,
};

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("es-UY", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const emptyPostForm = { title: "", body: "", type: "analysis" as CommunityPostType };

const isMissingSchemaError = (message?: string | null) =>
  Boolean(
    message?.includes("Could not find the 'body' column") ||
      message?.includes("Could not find the table") ||
      message?.includes("community_post_comments") ||
      message?.includes("community_post_reactions") ||
      message?.includes("does not exist") ||
      message?.includes("PGRST204") ||
      message?.includes("PGRST205") ||
      message?.includes("schema cache"),
  );

const getCommunityErrorMessage = (message?: string | null) => {
  if (!message) return "No se pudo cargar la comunidad.";
  if (isMissingSchemaError(message)) {
    return "La comunidad todavia necesita actualizar la base de datos. Las publicaciones existentes siguen disponibles cuando el esquema anterior responde.";
  }
  if (message.includes("permission denied") || message.includes("row-level security")) {
    return "No hay permisos suficientes para cargar la comunidad. Revisá las políticas de Supabase.";
  }
  return "No se pudo cargar la comunidad. Intentá actualizar en unos segundos.";
};

const buildLegacyTitle = (title: string, body: string) => {
  const cleanTitle = title.trim();
  const cleanBody = body.trim();

  if (!cleanBody || cleanBody === cleanTitle) {
    return cleanTitle;
  }

  return `${cleanTitle} - ${cleanBody}`;
};

const CommunityFeed = () => {
  const { session, user } = useAuth();
  const { isAdmin } = useUserRole();
  const currentUserId = session?.user?.id;
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submittingPost, setSubmittingPost] = useState(false);
  const [submittingCommentFor, setSubmittingCommentFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<CommunityFilter>("all");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [postForm, setPostForm] = useState(emptyPostForm);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [legacySchema, setLegacySchema] = useState(false);

  const loadCommunity = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const modernSelect = "id, user_id, author, type, title, body, created_at, updated_at, is_published" as const;
      const legacySelect = "id, author, type, title, created_at, is_published" as const;

      const basePostQuery = supabase
        .from("community_posts")
        .select(legacySchema ? legacySelect : modernSelect)
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(30);

      let shouldUseLegacySchema = legacySchema;
      let { data: postRows, error: postsError } = (await basePostQuery) as {
        data: CommunityPostRow[] | null;
        error: any;
      };

      if (postsError && isMissingSchemaError(postsError.message)) {
        shouldUseLegacySchema = true;
        setLegacySchema(true);
        const legacyResult = await supabase
          .from("community_posts")
          .select(legacySelect)
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(30);

        postRows = legacyResult.data as CommunityPostRow[] | null;
        postsError = legacyResult.error;
      }

      if (postsError) throw postsError;

      const visiblePosts = (postRows ?? []).flatMap((post) =>
        isCommunityPostType(post.type) ? [{ ...post, body: "body" in post ? post.body : post.title, type: post.type }] : [],
      );
      const postIds = visiblePosts.map((post) => post.id);

      if (postIds.length === 0) {
        setPosts([]);
        return;
      }

      if (shouldUseLegacySchema) {
        setPosts(
          visiblePosts.map((post) => ({
            ...post,
            user_id: "user_id" in post ? post.user_id : null,
            updated_at: "updated_at" in post ? post.updated_at : post.created_at,
            comments: [],
            likeCount: 0,
            likedByMe: false,
          })),
        );
        return;
      }

      const [commentsResult, reactionsResult] = await Promise.all([
        supabase
          .from("community_post_comments")
          .select("id, post_id, user_id, author, body, created_at, updated_at")
          .in("post_id", postIds)
          .order("created_at", { ascending: true }),
        supabase
          .from("community_post_reactions")
          .select("post_id, user_id, reaction_type, created_at")
          .in("post_id", postIds)
          .eq("reaction_type", "like"),
      ]);

      if (commentsResult.error || reactionsResult.error) {
        if (
          isMissingSchemaError(commentsResult.error?.message) ||
          isMissingSchemaError(reactionsResult.error?.message)
        ) {
          setLegacySchema(true);
          setPosts(
            visiblePosts.map((post) => ({
              ...post,
              user_id: post.user_id,
              updated_at: post.updated_at,
              comments: [],
              likeCount: 0,
              likedByMe: false,
            })),
          );
          return;
        }

        if (commentsResult.error) throw commentsResult.error;
        if (reactionsResult.error) throw reactionsResult.error;
      }

      const commentsByPost = new Map<string, CommunityCommentRow[]>();
      (commentsResult.data ?? []).forEach((comment) => {
        commentsByPost.set(comment.post_id, [...(commentsByPost.get(comment.post_id) ?? []), comment]);
      });

      const reactionsByPost = new Map<string, CommunityReactionRow[]>();
      (reactionsResult.data ?? []).forEach((reaction) => {
        reactionsByPost.set(reaction.post_id, [...(reactionsByPost.get(reaction.post_id) ?? []), reaction]);
      });

      setPosts(
        visiblePosts.map((post) => {
          const reactions = reactionsByPost.get(post.id) ?? [];

          return {
            ...post,
            comments: commentsByPost.get(post.id) ?? [],
            likeCount: reactions.length,
            likedByMe: Boolean(currentUserId && reactions.some((reaction) => reaction.user_id === currentUserId)),
          };
        }),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : null;
      setError(getCommunityErrorMessage(message));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUserId, legacySchema]);

  useEffect(() => {
    loadCommunity();
  }, [loadCommunity]);

  const filteredPosts = useMemo(
    () => (filter === "all" ? posts : posts.filter((post) => post.type === filter)),
    [filter, posts],
  );

  const totals = useMemo(() => ({
    all: posts.length,
    announcement: posts.filter((post) => post.type === "announcement").length,
    analysis: posts.filter((post) => post.type === "analysis").length,
  }), [posts]);

  const canSubmitPost = postForm.title.trim().length >= 3 && postForm.body.trim().length >= 3 && !!currentUserId;

  const handleCreatePost = async () => {
    if (!currentUserId || !canSubmitPost) return;

    setSubmittingPost(true);
    const type = isAdmin ? postForm.type : "analysis";
    let usedLegacyInsert = false;

    let { error: insertError } = await supabase.from("community_posts").insert({
      user_id: currentUserId,
      author: user?.name || session?.user?.email?.split("@")[0] || "Integrante",
      title: postForm.title.trim(),
      body: postForm.body.trim(),
      type,
      is_published: true,
    });

    if (insertError && isMissingSchemaError(insertError.message)) {
      setLegacySchema(true);
      usedLegacyInsert = true;
      const legacyResult = await supabase.from("community_posts").insert({
        author: user?.name || session?.user?.email?.split("@")[0] || "Integrante",
        title: buildLegacyTitle(postForm.title, postForm.body),
        type,
        is_published: true,
      });

      insertError = legacyResult.error;
    }

    setSubmittingPost(false);

    if (insertError) {
      toast.error("No se pudo publicar", { description: insertError.message });
      return;
    }

    setPostForm(emptyPostForm);
    toast.success(
      usedLegacyInsert
        ? "Publicado en la comunidad. La base aun necesita la migracion para comentarios y likes."
        : "Publicado en la comunidad",
    );
    await loadCommunity({ silent: true });
  };

  const handleToggleLike = async (post: CommunityPost) => {
    if (legacySchema) {
      toast.error("Likes disponibles despues de aplicar la migracion de comunidad.");
      return;
    }

    if (!currentUserId) {
      toast.error("Inicia sesion para reaccionar.");
      return;
    }

    setPosts((prev) =>
      prev.map((item) =>
        item.id === post.id
          ? {
              ...item,
              likedByMe: !item.likedByMe,
              likeCount: Math.max(0, item.likeCount + (item.likedByMe ? -1 : 1)),
            }
          : item,
      ),
    );

    const result = post.likedByMe
      ? await supabase
          .from("community_post_reactions")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", currentUserId)
          .eq("reaction_type", "like")
      : await supabase.from("community_post_reactions").insert({
          post_id: post.id,
          user_id: currentUserId,
          reaction_type: "like",
        });

    if (result.error) {
      toast.error("No se pudo actualizar la reaccion", { description: result.error.message });
      await loadCommunity({ silent: true });
    }
  };

  const handleCreateComment = async (postId: string) => {
    if (legacySchema) {
      toast.error("Comentarios disponibles despues de aplicar la migracion de comunidad.");
      return;
    }

    if (!currentUserId) return;

    const body = (commentDrafts[postId] ?? "").trim();
    if (!body) return;

    setSubmittingCommentFor(postId);

    const { data, error: insertError } = await supabase
      .from("community_post_comments")
      .insert({
        post_id: postId,
        user_id: currentUserId,
        author: user?.name || session?.user?.email?.split("@")[0] || "Integrante",
        body,
      })
      .select("id, post_id, user_id, author, body, created_at, updated_at")
      .single();

    setSubmittingCommentFor(null);

    if (insertError || !data) {
      toast.error("No se pudo comentar", { description: insertError?.message });
      return;
    }

    setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
    setExpandedPostId(postId);
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, comments: [...post.comments, data] } : post,
      ),
    );
  };

  const handleDeletePost = async (postId: string) => {
    const { error: deleteError } = await supabase.from("community_posts").delete().eq("id", postId);

    if (deleteError) {
      toast.error("No se pudo borrar la publicacion", { description: deleteError.message });
      return;
    }

    setPosts((prev) => prev.filter((post) => post.id !== postId));
    toast.success("Publicacion borrada");
  };

  const handleDeleteComment = async (commentId: string, postId: string) => {
    const { error: deleteError } = await supabase.from("community_post_comments").delete().eq("id", commentId);

    if (deleteError) {
      toast.error("No se pudo borrar el comentario", { description: deleteError.message });
      return;
    }

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: post.comments.filter((comment) => comment.id !== commentId) }
          : post,
      ),
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-md bg-secondary text-foreground">
            <Users size={22} />
          </div>
          <h1 className="text-2xl md:text-3xl text-foreground mb-2">Comunidad</h1>
          <p className="text-muted-foreground max-w-2xl">
            Comparte tesis, lee anuncios del equipo y deja preguntas o comentarios sobre las ideas de otros estudiantes.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => loadCommunity({ silent: true })}
          disabled={refreshing}
          className="w-full md:w-auto"
        >
          {refreshing ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
          Actualizar
        </Button>
      </div>

      <section className="rounded-lg border border-border bg-background p-4 md:p-5">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-heading font-semibold text-foreground">Nueva publicacion</h2>
            <p className="text-sm text-muted-foreground">Usa este espacio para compartir una idea o abrir conversacion.</p>
          </div>
          {isAdmin && (
            <Select
              value={postForm.type}
              onValueChange={(value) =>
                isCommunityPostType(value) && setPostForm((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="analysis">Analisis</SelectItem>
                <SelectItem value="announcement">Anuncio</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="grid gap-3">
          <Input
            value={postForm.title}
            onChange={(event) => setPostForm((prev) => ({ ...prev, title: event.target.value }))}
            maxLength={140}
            placeholder="Titulo breve"
            disabled={!currentUserId || submittingPost}
          />
          <Textarea
            value={postForm.body}
            onChange={(event) => setPostForm((prev) => ({ ...prev, body: event.target.value }))}
            maxLength={4000}
            rows={5}
            placeholder="Escribe tu analisis, pregunta o aprendizaje..."
            disabled={!currentUserId || submittingPost}
            className="resize-none"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {currentUserId ? `${postForm.body.trim().length}/4000 caracteres` : "Necesitas iniciar sesion para publicar."}
            </p>
            <Button onClick={handleCreatePost} disabled={!canSubmitPost || submittingPost} className="w-full sm:w-auto">
              {submittingPost ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              Publicar
            </Button>
          </div>
        </div>
      </section>

      <Tabs value={filter} onValueChange={(value) => setFilter(value as CommunityFilter)}>
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-secondary/70 p-1 md:w-auto">
          <TabsTrigger value="all">Todo ({totals.all})</TabsTrigger>
          <TabsTrigger value="announcement">Anuncios ({totals.announcement})</TabsTrigger>
          <TabsTrigger value="analysis">Analisis ({totals.analysis})</TabsTrigger>
        </TabsList>
      </Tabs>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="rounded-lg border border-border p-5">
              <Skeleton className="mb-3 h-5 w-2/3" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <MessageCircle className="mx-auto mb-3 text-muted-foreground" size={34} />
          <p className="font-heading font-medium text-foreground">Todavia no hay publicaciones aca</p>
          <p className="mt-1 text-sm text-muted-foreground">Cuando alguien publique, va a aparecer en este espacio.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const Icon = postTypeIcon[post.type];
            const isOwner = post.user_id === currentUserId;
            const canDeletePost = isOwner || isAdmin;
            const expanded = expandedPostId === post.id;

            return (
              <article key={post.id} className="rounded-lg border border-border bg-background p-4 md:p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge variant={post.type === "announcement" ? "secondary" : "outline"} className="gap-1.5">
                        <Icon size={12} />
                        {postTypeLabel[post.type]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {post.author} - {formatDateTime(post.created_at)}
                      </span>
                    </div>
                    <h2 className="text-lg font-heading font-semibold text-foreground">{post.title}</h2>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{post.body}</p>
                  </div>
                  {canDeletePost && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePost(post.id)}
                      aria-label="Borrar publicacion"
                      className="self-end md:self-start"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <Button
                    variant={post.likedByMe ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handleToggleLike(post)}
                    disabled={legacySchema}
                  >
                    <ThumbsUp size={15} />
                    {post.likeCount}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedPostId(expanded ? null : post.id)}
                    disabled={legacySchema}
                  >
                    <MessageCircle size={15} />
                    {post.comments.length} comentarios
                  </Button>
                </div>

                {expanded && (
                  <div className="mt-5 border-t border-border pt-5">
                    <div className="space-y-3">
                      {post.comments.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Se el primero en comentar esta publicacion.</p>
                      ) : (
                        post.comments.map((comment) => {
                          const canDeleteComment = comment.user_id === currentUserId || isAdmin;

                          return (
                            <div key={comment.id} className="rounded-md bg-secondary/70 p-3">
                              <div className="mb-1 flex items-center justify-between gap-2">
                                <p className="text-xs font-heading font-medium text-foreground">
                                  {comment.author} - {formatDateTime(comment.created_at)}
                                </p>
                                {canDeleteComment && (
                                  <button
                                    onClick={() => handleDeleteComment(comment.id, post.id)}
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                    aria-label="Borrar comentario"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                              <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{comment.body}</p>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <Input
                        value={commentDrafts[post.id] ?? ""}
                        onChange={(event) =>
                          setCommentDrafts((prev) => ({ ...prev, [post.id]: event.target.value }))
                        }
                        maxLength={1200}
                        placeholder={currentUserId ? "Escribe un comentario..." : "Inicia sesion para comentar"}
                        disabled={!currentUserId || submittingCommentFor === post.id}
                      />
                      <Button
                        onClick={() => handleCreateComment(post.id)}
                        disabled={!currentUserId || !(commentDrafts[post.id] ?? "").trim() || submittingCommentFor === post.id}
                        className="w-full sm:w-auto"
                      >
                        {submittingCommentFor === post.id ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                        Enviar
                      </Button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
