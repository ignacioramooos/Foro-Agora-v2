import { useEffect, useState } from "react";
import SectionFade from "@/components/SectionFade";
import { supabase } from "@/integrations/supabase/client";

interface BrokerRow {
  id: string;
  name: string;
  type: "local" | "internacional";
  min_deposit: string;
  commission: string;
  regulator: string;
  notes: string | null;
}

const BrokersPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brokers, setBrokers] = useState<BrokerRow[]>([]);
  const [filter, setFilter] = useState<"all" | "local" | "internacional">("all");
  const filtered = filter === "all" ? brokers : brokers.filter((b) => b.type === filter);

  useEffect(() => {
    const fetchBrokers = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("brokers")
        .select("id, name, type, min_deposit, commission, regulator, notes")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (fetchError) {
        setError("No pudimos cargar el directorio en este momento.");
      } else {
        setBrokers((data as BrokerRow[]) || []);
      }

      setLoading(false);
    };

    fetchBrokers();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-28 md:pt-36 pb-20">
      <div className="container max-w-5xl">
        <SectionFade>
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Directorio
          </p>
          <h1 className="text-3xl md:text-4xl text-foreground mb-2">
            Brokers para uruguayos
          </h1>
          <p className="text-muted-foreground mb-8 max-w-lg">
            Opciones reguladas para invertir desde Uruguay. Investigá cada opción antes de abrir una cuenta.
          </p>
          <p className="text-muted-foreground text-sm mb-8 max-w-lg">
            No somos sponsoreados por ninguno, son solo recomendaciones.
          </p>
        </SectionFade>

        <div className="flex gap-2 mb-6">
          {(["all", "local", "internacional"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-heading border transition-colors ${
                filter === f
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "Todos" : f === "local" ? "Locales" : "Internacionales"}
            </button>
          ))}
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-sm text-muted-foreground">Cargando brokers...</div>
            ) : error ? (
              <div className="p-6 text-sm text-destructive">{error}</div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">No hay brokers disponibles para este filtro.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left p-3 font-heading font-medium text-muted-foreground">Broker</th>
                    <th className="text-left p-3 font-heading font-medium text-muted-foreground">Tipo</th>
                    <th className="text-left p-3 font-heading font-medium text-muted-foreground">Depósito mín.</th>
                    <th className="text-left p-3 font-heading font-medium text-muted-foreground">Comisión</th>
                    <th className="text-left p-3 font-heading font-medium text-muted-foreground">Regulador</th>
                    <th className="text-left p-3 font-heading font-medium text-muted-foreground hidden md:table-cell">Notas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="p-3 font-heading font-medium text-foreground">{b.name}</td>
                      <td className="p-3 text-muted-foreground capitalize">{b.type}</td>
                      <td className="p-3 text-muted-foreground">{b.min_deposit}</td>
                      <td className="p-3 text-muted-foreground">{b.commission}</td>
                      <td className="p-3 text-muted-foreground">{b.regulator}</td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">{b.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Esta tabla es informativa. Verificá la información directamente con cada broker antes de operar.
        </p>
      </div>
    </div>
  );
};

export default BrokersPage;
