import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BookMarked, ChevronDown, ClipboardList, Library, Menu, MessagesSquare, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import { chapters } from "@/content/math";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const itemClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
  );

const subClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "block rounded-md px-3 py-1.5 text-sm transition-colors",
    isActive ? "bg-secondary font-semibold text-secondary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
  );

const SidebarNav = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { pathname } = useLocation();
  const current = pathname.match(/^\/maths\/chapitre\/([^/]+)/)?.[1];
  const [open, setOpen] = useState<string | undefined>(current);
  useEffect(() => { if (current) setOpen(current); }, [current]);

  return (
    <nav aria-label="Navigation maths" className="space-y-1">
      <NavLink to="/maths" end className={itemClass} onClick={onNavigate}><Shuffle className="h-4 w-4" /> Aléatoire</NavLink>

      <p className="px-3 pb-1 pt-4 text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground">Chapitres</p>
      {chapters.map((c) => {
        const expanded = open === c.id;
        return (
          <div key={c.id}>
            <button
              type="button"
              onClick={() => setOpen(expanded ? undefined : c.id)}
              aria-expanded={expanded}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-muted",
                current === c.id ? "text-foreground" : "text-foreground/85",
              )}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold">{c.number}</span>
              <span className="min-w-0 flex-1 truncate">{c.title}</span>
              <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-180")} />
            </button>
            {expanded && (
              <div className="ml-5 mt-1 space-y-0.5 border-l border-border pl-3">
                <NavLink to={`/maths/chapitre/${c.id}/cours`} className={subClass} onClick={onNavigate}>Cours</NavLink>
                <NavLink to={`/maths/chapitre/${c.id}/td`} className={subClass} onClick={onNavigate}>TD</NavLink>
              </div>
            )}
          </div>
        );
      })}

      <p className="px-3 pb-1 pt-4 text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground">Préparation</p>
      <NavLink to="/maths/kholles" className={itemClass} onClick={onNavigate}><MessagesSquare className="h-4 w-4" /> Khôlles</NavLink>
      <NavLink to="/maths/dm" className={itemClass} onClick={onNavigate}><ClipboardList className="h-4 w-4" /> DM</NavLink>
      <NavLink to="/maths/ressources" className={itemClass} onClick={onNavigate}><Library className="h-4 w-4" /> Ressources</NavLink>
    </nav>
  );
};

/** Shared layout for every /maths page: sidebar on desktop, menu sheet on mobile. */
const MathShell = ({ children, top }: { children: React.ReactNode; top?: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="lg:h-[calc(100dvh-5rem)]">
      <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)] lg:h-full lg:grid-cols-[272px_minmax(0,1fr)]">
        <aside className="hidden border-r border-border bg-card p-4 lg:block lg:min-h-0 lg:overflow-y-auto">
          {top && <div className="mb-5">{top}</div>}
          <SidebarNav />
        </aside>
        <div className="border-b border-border bg-card px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">{top}</div>
            <Button variant="outline" size="sm" onClick={() => setMenuOpen(true)} className="shrink-0"><Menu /> Menu</Button>
          </div>
        </div>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetContent side="left" className="w-[86vw] max-w-sm overflow-y-auto p-4">
            <SheetTitle className="mb-4 flex items-center gap-2 font-heading"><BookMarked className="h-4 w-4" /> Maths</SheetTitle>
            <SidebarNav onNavigate={() => setMenuOpen(false)} />
          </SheetContent>
        </Sheet>
        <div className="min-w-0 lg:min-h-0 lg:overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default MathShell;
