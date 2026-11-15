import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  BookMarked,
  ChevronDown,
  ClipboardList,
  Library,
  ListOrdered,
  Menu,
  MessagesSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Printer,
  Shuffle,
  Sigma,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useSubject } from "./SubjectContext";

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
  const { subject, index, basePath, t } = useSubject();
  const escaped = basePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const current = pathname.match(new RegExp(`^${escaped}/chapitre/([^/]+)`))?.[1];
  const [open, setOpen] = useState<string | undefined>(current);
  useEffect(() => {
    if (current) setOpen(current);
  }, [current]);

  const f = subject.features;
  const hasCoursTd = !!f.coursTdSplit;
  const showFormulaire = f.formulaire !== false && (subject.formulaire?.length ?? 0) > 0;
  const showAssignments = !!f.assignments && (subject.assignments?.length ?? 0) > 0;
  const showResources =
    !!f.resources && ((subject.resourceDocs?.length ?? 0) > 0 || (subject.bonusSheets?.length ?? 0) > 0);
  const showKholles = !!f.kholles && (subject.kholleWeeks?.length ?? 0) > 0;
  const showKholleSim = !!f.kholleSimulator && (subject.kholleWeeks?.length ?? 0) > 0;

  return (
    <nav aria-label={`Navigation ${subject.name}`} className="space-y-1">
      <NavLink to={basePath} end className={itemClass} onClick={onNavigate}>
        <Shuffle className="h-4 w-4" /> {t.nav.daily}
      </NavLink>

      <p className="px-3 pb-1 pt-4 text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground">
        {t.nav.chapters}
      </p>
      {index.chapters.map((c) => {
        if (!hasCoursTd) {
          return (
            <NavLink
              key={c.id}
              to={`${basePath}/chapitre/${c.id}`}
              className={({ isActive }) =>
                cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground/85 hover:bg-muted",
                )
              }
              onClick={onNavigate}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-foreground">
                {c.number}
              </span>
              <span className="min-w-0 flex-1 truncate">{c.title}</span>
            </NavLink>
          );
        }

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
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold">
                {c.number}
              </span>
              <span className="min-w-0 flex-1 truncate">{c.title}</span>
              <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-180")} />
            </button>
            {expanded && (
              <div className="ml-5 mt-1 space-y-0.5 border-l border-border pl-3">
                <NavLink to={`${basePath}/chapitre/${c.id}/cours`} className={subClass} onClick={onNavigate}>
                  {t.nav.cours}
                </NavLink>
                <NavLink to={`${basePath}/chapitre/${c.id}/td`} className={subClass} onClick={onNavigate}>
                  {t.nav.td}
                </NavLink>
              </div>
            )}
          </div>
        );
      })}

      <p className="px-3 pb-1 pt-4 text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground">
        {t.nav.tools}
      </p>
      <NavLink to={`${basePath}/index`} className={itemClass} onClick={onNavigate}>
        <ListOrdered className="h-4 w-4" /> {t.nav.index}
      </NavLink>
      {showKholles && (
        <NavLink to={`${basePath}/kholles`} className={itemClass} onClick={onNavigate}>
          <MessagesSquare className="h-4 w-4" /> {t.nav.kholles}
        </NavLink>
      )}
      {showKholleSim && (
        <NavLink to={`${basePath}/simulateur`} className={itemClass} onClick={onNavigate}>
          <Timer className="h-4 w-4" /> {t.nav.simulator}
        </NavLink>
      )}
      {showFormulaire && (
        <NavLink to={`${basePath}/formulaire`} className={itemClass} onClick={onNavigate}>
          <Sigma className="h-4 w-4" /> {t.nav.formulaire}
        </NavLink>
      )}
      <NavLink to={`${basePath}/progression`} className={itemClass} onClick={onNavigate}>
        <BarChart3 className="h-4 w-4" /> {t.nav.progression}
      </NavLink>
      {f.printableSheet !== false && (
        <NavLink to={`${basePath}/planche`} className={itemClass} onClick={onNavigate}>
          <Printer className="h-4 w-4" /> {t.nav.printable}
        </NavLink>
      )}
      {showAssignments && (
        <NavLink to={`${basePath}/devoirs`} className={itemClass} onClick={onNavigate}>
          <ClipboardList className="h-4 w-4" /> {t.nav.assignments}
        </NavLink>
      )}
      {showResources && (
        <NavLink to={`${basePath}/ressources`} className={itemClass} onClick={onNavigate}>
          <Library className="h-4 w-4" /> {t.nav.resources}
        </NavLink>
      )}
    </nav>
  );
};

/** Shared layout for every /classes/:slug page: sidebar on desktop, menu sheet on mobile. */
const SubjectShell = ({ children, top }: { children: React.ReactNode; top?: React.ReactNode }) => {
  const { subject, storagePrefix, t } = useSubject();
  const [menuOpen, setMenuOpen] = useState(false);
  const collapseKey = `${storagePrefix}_sidebar_collapsed`;
  const [collapsed, setCollapsed] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(collapseKey) === "true",
  );
  const toggleCollapsed = () =>
    setCollapsed((c) => {
      localStorage.setItem(collapseKey, String(!c));
      return !c;
    });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleCollapsed();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="lg:h-[calc(100dvh-5rem)]">
      <div
        className={cn(
          "grid w-full min-w-0 grid-cols-[minmax(0,1fr)] transition-[grid-template-columns] duration-200 ease-out motion-reduce:transition-none lg:h-full",
          collapsed ? "lg:grid-cols-[52px_minmax(0,1fr)]" : "lg:grid-cols-[272px_minmax(0,1fr)]",
        )}
      >
        <aside
          className={cn(
            "hidden border-r border-border bg-card lg:block lg:min-h-0 lg:overflow-y-auto lg:overflow-x-hidden",
            collapsed ? "p-2" : "p-4",
          )}
        >
          <div className={cn("mb-2 flex", collapsed ? "justify-center" : "justify-end")}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleCollapsed}
              aria-expanded={!collapsed}
              aria-label={collapsed ? t.nav.showMenu : t.nav.hideMenu}
              title={`${collapsed ? t.nav.showMenu : t.nav.hideMenu} (Ctrl+B)`}
            >
              {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            </Button>
          </div>
          {!collapsed && (
            <>
              {top && <div className="mb-5">{top}</div>}
              <SidebarNav />
            </>
          )}
        </aside>
        <div className="border-b border-border bg-card px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">{top}</div>
            <Button variant="outline" size="sm" onClick={() => setMenuOpen(true)} className="shrink-0">
              <Menu /> {t.nav.menu}
            </Button>
          </div>
        </div>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetContent side="left" className="w-[86vw] max-w-sm overflow-y-auto p-4">
            <SheetTitle className="mb-4 flex items-center gap-2 font-heading">
              <BookMarked className="h-4 w-4" /> {subject.name}
            </SheetTitle>
            <SidebarNav onNavigate={() => setMenuOpen(false)} />
          </SheetContent>
        </Sheet>
        <div className="min-w-0 lg:min-h-0 lg:overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default SubjectShell;
