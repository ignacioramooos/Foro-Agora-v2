import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SUPPORTED_STOCKS } from "@/lib/stockData";
import { Sparkles, Plus, X } from "lucide-react";

const landingPageWidgetsTable = () => (supabase as any).from("landing_page_widgets");

const LandingPageWidget = () => {
  const { session } = useAuth();
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadTickers = async () => {
      if (!session?.user?.id) return;
      setLoading(true);
      const { data } = await landingPageWidgetsTable()
        .select("tickers")
        .eq("user_id", session.user.id)
        .maybeSingle();
      
      setSelectedTickers(data?.tickers || []);
      setLoading(false);
    };
    loadTickers();
  }, [session?.user?.id]);

  const handleAddTicker = (ticker: string) => {
    if (!selectedTickers.includes(ticker)) {
      setSelectedTickers([...selectedTickers, ticker]);
    }
  };

  const handleRemoveTicker = (ticker: string) => {
    setSelectedTickers(selectedTickers.filter(t => t !== ticker));
  };

  const handleSave = async () => {
    if (!session?.user?.id) return;
    setSaving(true);
    
    const { error } = await landingPageWidgetsTable()
      .upsert({
        user_id: session.user.id,
        tickers: selectedTickers,
      }, {
        onConflict: "user_id"
      });

    if (!error) {
      setSaving(false);
    }
  };

  const filteredStocks = SUPPORTED_STOCKS.filter(stock =>
    stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} className="text-muted-foreground" />
        <h3 className="font-heading font-semibold text-foreground text-lg">Widget de Landing Page</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Personaliza qué acciones se muestran en el carrusel de la página de inicio.
      </p>

      {/* Selected Tickers */}
      <div className="mb-6">
        <label className="block text-xs font-heading text-muted-foreground mb-2">Acciones seleccionadas ({selectedTickers.length})</label>
        <div className="flex flex-wrap gap-2 min-h-10 p-3 rounded-md border border-border bg-background">
          {selectedTickers.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Sin acciones seleccionadas</p>
          ) : (
            selectedTickers.map(ticker => {
              const stock = SUPPORTED_STOCKS.find(s => s.ticker === ticker);
              return (
                <div
                  key={ticker}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-foreground/10 text-foreground text-xs font-heading"
                >
                  <span>{ticker}</span>
                  <button
                    onClick={() => handleRemoveTicker(ticker)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Search & Add */}
      <div className="mb-6">
        <label className="block text-xs font-heading text-muted-foreground mb-2">Agregar acciones</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por ticker o nombre..."
          className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground text-sm font-heading focus:outline-none focus:ring-2 focus:ring-ring/50 mb-3"
        />
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
          {filteredStocks.map(stock => (
            <button
              key={stock.ticker}
              onClick={() => handleAddTicker(stock.ticker)}
              disabled={selectedTickers.includes(stock.ticker)}
              className={`text-left p-2 rounded-md text-xs font-heading border transition-colors ${
                selectedTickers.includes(stock.ticker)
                  ? "bg-foreground/20 border-foreground/30 text-muted-foreground cursor-not-allowed"
                  : "border-border hover:border-foreground/30 hover:bg-foreground/5 text-foreground"
              }`}
            >
              <div className="font-semibold">{stock.ticker}</div>
              <div className="text-muted-foreground text-xs truncate">{stock.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving || loading}
        className="w-full h-10 rounded-md bg-foreground text-background text-sm font-heading font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>
  );
};

export default LandingPageWidget;
