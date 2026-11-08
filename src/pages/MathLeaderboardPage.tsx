import { useEffect, useMemo, useState } from "react";
import { Crown, Loader2, LogIn, Medal, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MathShell from "@/components/math/MathShell";

type Row = { user_id: string; display_name: string; avatar_url: string | null; total: number; week: number; last_done: string };
type Period = "week" | "total";

const rankIcon = (i: number) =>
  i === 0 ? <Crown className="h-4 w-4 text-primary" /> : i < 3 ? <Medal className="h-4 w-4 text-muted-foreground" /> : <span className="w-4 text-center text-sm tabular-nums text-muted-foreground">{i + 1}</span>;

const MathLeaderboardPage = () => {
  const { session } = useAuth();
  const me = session?.user?.id;
  const [rows, setRows] = useState<Row[]>([]);
  const [avatars, setAvatars] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("week");

  useEffect(() => {
    if (!me) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await (supabase as any).rpc("get_maths_leaderboard");
      const list = (data ?? []) as Row[];
      if (cancelled) return;
      setRows(list);
      setLoading(false);
      const withPhoto = list.filter((r) => r.avatar_url);
      if (withPhoto.length) {
        const { data: signed } = await supabase.storage.from("profile-avatars").createSignedUrls(withPhoto.map((r) => r.avatar_url!), 3600);
        const map: Record<string, string> = {};
        withPhoto.forEach((r, i) => { const u = signed?.[i]?.signedUrl; if (u) map[r.user_id] = u; });
        if (!cancelled) setAvatars(map);
      }
    })();
    return () => { cancelled = true; };
  }, [me]);

  const ranked = useMemo(
    () => rows.filter((r) => r[period] > 0).sort((a, b) => b[period] - a[period] || a.last_done.localeCompare(b.last_done)),
    [rows, period],
  );
  const myIndex = ranked.findIndex((r) => r.user_id === me);
  const top = ranked[0]?.[period] ?? 0;

  return (
    <MathShell>
      <div className="mx-auto max-w-3xl p-4 sm:p-6">
        <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">Classement</p>
        <h1 className="mt-0.5 font-heading text-2xl font-bold text-foreground">Leaderboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Nombre d'exercices marqués comme faits par chaque élève connecté. Seuls ton nom et ta photo de profil apparaissent.</p>

        {!me ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center">
            <Trophy className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-medium text-foreground">Connecte-toi pour voir le classement.</p>
            <p className="mt-1 text-sm text-muted-foreground">Tes exercices faits seront comptés automatiquement.</p>
            <Button className="mt-4" onClick={() => window.dispatchEvent(new Event("maths-open-auth"))}><LogIn /> Se connecter</Button>
          </div>
        ) : (
          <>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="inline-flex rounded-md border border-border p-0.5" role="tablist">
                {([["week", "7 derniers jours"], ["total", "Depuis le début"]] as const).map(([k, label]) => (
                  <button key={k} type="button" role="tab" aria-selected={period === k} onClick={() => setPeriod(k)}
                    className={cn("rounded px-4 py-1.5 text-sm font-semibold transition-colors", period === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                    {label}
                  </button>
                ))}
              </div>
              {myIndex >= 0 && <span className="text-sm text-muted-foreground">Ta place : <span className="font-semibold text-foreground">{myIndex + 1}<sup>{myIndex === 0 ? "re" : "e"}</sup></span> sur {ranked.length}</span>}
            </div>

            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : ranked.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                {period === "week" ? "Personne n'a encore fait d'exercice cette semaine. Lance-toi !" : "Personne n'a encore marqué d'exercice comme fait."}
              </div>
            ) : (
              <ol className="mt-5 space-y-2">
                {ranked.map((r, i) => (
                  <li key={r.user_id} className={cn("flex items-center gap-3 rounded-2xl border bg-card px-4 py-3", r.user_id === me ? "border-primary/60 bg-primary/5" : "border-border")}>
                    <span className="flex w-5 justify-center">{rankIcon(i)}</span>
                    <Avatar className="h-9 w-9">
                      {avatars[r.user_id] && <AvatarImage src={avatars[r.user_id]} alt="" className="object-cover" />}
                      <AvatarFallback className="text-xs font-semibold">{r.display_name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{r.display_name}{r.user_id === me && <span className="ml-1.5 font-normal text-muted-foreground">(toi)</span>}</p>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${top ? (r[period] / top) * 100 : 0}%` }} />
                      </div>
                    </div>
                    <span className="shrink-0 text-right">
                      <span className="block font-heading text-lg font-bold tabular-nums text-foreground">{r[period]}</span>
                      <span className="block text-[11px] text-muted-foreground">exercice{r[period] > 1 ? "s" : ""}</span>
                    </span>
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-4 text-xs text-muted-foreground">Les exercices faits sans être connecté restent sur ton appareil et seront comptés dès que tu te connectes.</p>
          </>
        )}
      </div>
    </MathShell>
  );
};

export default MathLeaderboardPage;
