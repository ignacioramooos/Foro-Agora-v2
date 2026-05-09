import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

const DashboardSettings = () => {
  const { user, session, logout, refreshProfile } = useAuth();
  const { updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || "");

  // Sync local state with context when profile changes and not in edit mode
  useEffect(() => {
    if (!editing && user?.name) {
      setDisplayName(user.name);
    }
  }, [user?.name, editing]);

  const handleSaveDisplayName = async () => {
    if (!session?.user?.id) return;
    if (!displayName.trim()) {
      toast.error("El nombre no puede estar vacío");
      return;
    }

    setSaving(true);
    try {
      const result = await updateProfile(session.user.id, {
        display_name: displayName.trim(),
      });

      if (result.success) {
        await refreshProfile();
        setEditing(false);
        toast.success("Nombre actualizado");
      } else {
        toast.error(result.error || "Error al actualizar nombre");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-xl">
      <h1 className="text-2xl md:text-3xl text-foreground mb-2">Configuración</h1>
      <p className="text-muted-foreground mb-8">Ajustes de tu cuenta.</p>

      <div className="border border-border rounded-lg divide-y divide-border">
        <div className="p-5">
          <p className="text-xs font-heading text-muted-foreground mb-2">Nombre</p>
          {editing ? (
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground text-sm font-heading focus:outline-none focus:ring-2 focus:ring-ring/50"
                />
              </div>
              <button
                onClick={handleSaveDisplayName}
                disabled={saving}
                className="h-10 px-4 rounded-md bg-foreground text-background text-sm font-heading font-medium hover:bg-foreground/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Guardar
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setDisplayName(user?.name || "");
                }}
                disabled={saving}
                className="h-10 px-4 rounded-md border border-border text-foreground text-sm font-heading font-medium hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <p className="text-sm font-heading font-medium text-foreground">{user?.name}</p>
              <button
                onClick={() => setEditing(true)}
                className="text-xs font-heading text-accent hover:underline"
              >
                Editar
              </button>
            </div>
          )}
        </div>
        <div className="p-5">
          <p className="text-xs font-heading text-muted-foreground mb-1">Email</p>
          <p className="text-sm font-heading font-medium text-foreground">{user?.email}</p>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-xs font-heading text-muted-foreground mb-2">Progreso</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-border rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground font-heading mb-1">Clases</p>
              <p className="text-lg font-heading font-semibold text-foreground">{user?.completedClasses}/{user?.totalClasses}</p>
            </div>
            <div className="border border-border rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground font-heading mb-1">Racha</p>
              <p className="text-lg font-heading font-semibold text-foreground">{user?.streak} días</p>
            </div>
            <div className="border border-border rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground font-heading mb-1">Tesis</p>
              <p className="text-lg font-heading font-semibold text-foreground">{user?.publishedTheses}</p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <button
            onClick={logout}
            className="h-9 px-4 rounded-md border border-destructive text-destructive text-sm font-heading font-medium hover:bg-destructive/10 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
