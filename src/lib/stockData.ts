import { supabase } from "@/integrations/supabase/client";

export const SUPPORTED_STOCKS = [
  // Top 100 Market Cap - Tech Giants
  { ticker: "AAPL", name: "Apple Inc.", sector: "Tecnología" },
  { ticker: "MSFT", name: "Microsoft Corp.", sector: "Tecnología" },
  { ticker: "GOOGL", name: "Alphabet Inc.", sector: "Tecnología" },
  { ticker: "AMZN", name: "Amazon.com Inc.", sector: "Consumo" },
  { ticker: "META", name: "Meta Platforms", sector: "Tecnología" },
  { ticker: "TSLA", name: "Tesla Inc.", sector: "Automotriz" },
  { ticker: "NVDA", name: "NVIDIA Corp.", sector: "Semiconductores" },
  { ticker: "AVGO", name: "Broadcom Inc.", sector: "Semiconductores" },
  { ticker: "ASML", name: "ASML Holding N.V.", sector: "Semiconductores" },
  { ticker: "QCOM", name: "Qualcomm Inc.", sector: "Semiconductores" },
  { ticker: "AMD", name: "Advanced Micro Devices", sector: "Semiconductores" },
  { ticker: "INTC", name: "Intel Corporation", sector: "Semiconductores" },
  { ticker: "CRM", name: "Salesforce Inc.", sector: "Software" },
  { ticker: "ADBE", name: "Adobe Inc.", sector: "Software" },
  { ticker: "NFLX", name: "Netflix Inc.", sector: "Entretenimiento" },
  { ticker: "DIS", name: "The Walt Disney Company", sector: "Entretenimiento" },
  
  // Top 100 - Finance & Banking
  { ticker: "JPM", name: "JPMorgan Chase", sector: "Finanzas" },
  { ticker: "BAC", name: "Bank of America", sector: "Finanzas" },
  { ticker: "WFC", name: "Wells Fargo", sector: "Finanzas" },
  { ticker: "GS", name: "Goldman Sachs Group", sector: "Finanzas" },
  { ticker: "MS", name: "Morgan Stanley", sector: "Finanzas" },
  { ticker: "BLK", name: "BlackRock Inc.", sector: "Finanzas" },
  { ticker: "V", name: "Visa Inc.", sector: "Finanzas" },
  { ticker: "MA", name: "Mastercard Inc.", sector: "Finanzas" },
  { ticker: "AXP", name: "American Express", sector: "Finanzas" },
  
  // Top 100 - Healthcare & Pharma
  { ticker: "JNJ", name: "Johnson & Johnson", sector: "Salud" },
  { ticker: "UNH", name: "UnitedHealth Group", sector: "Salud" },
  { ticker: "PFE", name: "Pfizer Inc.", sector: "Farmacéutica" },
  { ticker: "MRK", name: "Merck & Co.", sector: "Farmacéutica" },
  { ticker: "ABBV", name: "AbbVie Inc.", sector: "Farmacéutica" },
  { ticker: "LLY", name: "Eli Lilly and Company", sector: "Farmacéutica" },
  { ticker: "TMO", name: "Thermo Fisher Scientific", sector: "Biotecnología" },
  
  // Top 100 - Energy & Industrials
  { ticker: "XOM", name: "Exxon Mobil Corporation", sector: "Energía" },
  { ticker: "CVX", name: "Chevron Corporation", sector: "Energía" },
  { ticker: "COP", name: "ConocoPhillips", sector: "Energía" },
  { ticker: "CAT", name: "Caterpillar Inc.", sector: "Industriales" },
  { ticker: "DE", name: "Deere & Company", sector: "Industriales" },
  { ticker: "GE", name: "General Electric", sector: "Industriales" },
  { ticker: "BA", name: "The Boeing Company", sector: "Aeroespacial" },
  { ticker: "RTX", name: "Raytheon Technologies", sector: "Defensa" },
  { ticker: "LMT", name: "Lockheed Martin", sector: "Defensa" },
  
  // Top 100 - Consumer & Retail
  { ticker: "WMT", name: "Walmart Inc.", sector: "Retail" },
  { ticker: "COST", name: "Costco Wholesale", sector: "Retail" },
  { ticker: "HD", name: "The Home Depot", sector: "Retail" },
  { ticker: "LOW", name: "Lowe's Companies", sector: "Retail" },
  { ticker: "MCD", name: "McDonald's Corporation", sector: "Consumo" },
  { ticker: "SBUX", name: "Starbucks Corporation", sector: "Consumo" },
  { ticker: "NKE", name: "Nike Inc.", sector: "Consumo" },
  { ticker: "PG", name: "Procter & Gamble", sector: "Consumo" },
  { ticker: "KO", name: "The Coca-Cola Company", sector: "Bebidas" },
  
  // Top 100 - Utilities & Real Estate
  { ticker: "NEE", name: "NextEra Energy", sector: "Utilidades" },
  { ticker: "DUK", name: "Duke Energy", sector: "Utilidades" },
  { ticker: "SO", name: "The Southern Company", sector: "Utilidades" },
  { ticker: "SPG", name: "Simon Property Group", sector: "Real Estate" },
  { ticker: "VTR", name: "Ventas Inc.", sector: "Real Estate" },
  { ticker: "PLD", name: "Prologis Inc.", sector: "Real Estate" },
  
  // ETFs & Index
  { ticker: "SPY", name: "S&P 500 ETF", sector: "ETF" },
  { ticker: "QQQ", name: "Nasdaq 100 ETF", sector: "ETF" },
  { ticker: "IWM", name: "Russell 2000 ETF", sector: "ETF" },
  { ticker: "EEM", name: "MSCI Emerging Markets ETF", sector: "ETF" },
  { ticker: "EFA", name: "MSCI EAFE ETF", sector: "ETF" },
  { ticker: "AGG", name: "Bloomberg Aggregate Bond ETF", sector: "ETF" },
  { ticker: "TLT", name: "iShares 20+ Year Treasury ETF", sector: "ETF" },
  { ticker: "GLD", name: "SPDR Gold Shares", sector: "ETF" },
  { ticker: "USO", name: "U.S. Oil ETF", sector: "ETF" },
  
  // Popular & Common Stocks
  { ticker: "SNPS", name: "Synopsys Inc.", sector: "Software" },
  { ticker: "CDNS", name: "Cadence Design Systems", sector: "Software" },
  { ticker: "ROKU", name: "Roku Inc.", sector: "Entretenimiento" },
  { ticker: "RKLB", name: "Rocket Lab USA Inc.", sector: "Aeroespacial" },
  { ticker: "PLTR", name: "Palantir Technologies", sector: "Software" },
  { ticker: "COIN", name: "Coinbase Global", sector: "Cripto" },
  { ticker: "HOOD", name: "Robinhood Markets", sector: "Finanzas" },
  { ticker: "SCHW", name: "Charles Schwab", sector: "Finanzas" },
  { ticker: "LRCX", name: "Lam Research", sector: "Semiconductores" },
  { ticker: "AMAT", name: "Applied Materials", sector: "Semiconductores" },
  { ticker: "MU", name: "Micron Technology", sector: "Semiconductores" },
  { ticker: "MSTR", name: "MicroStrategy", sector: "Software" },
  { ticker: "SLB", name: "Schlumberger Limited", sector: "Energía" },
  { ticker: "HAL", name: "Halliburton Company", sector: "Energía" },
  
  // Transport & Airlines
  { ticker: "AAL", name: "American Airlines", sector: "Transporte" },
  { ticker: "DAL", name: "Delta Air Lines", sector: "Transporte" },
  { ticker: "UAL", name: "United Airlines", sector: "Transporte" },
  { ticker: "LUV", name: "Southwest Airlines", sector: "Transporte" },
  { ticker: "ABNB", name: "Airbnb Inc.", sector: "Viajes" },
  { ticker: "UBER", name: "Uber Technologies", sector: "Tecnología" },
  { ticker: "LYFT", name: "Lyft Inc.", sector: "Transporte" },
  
  // Retail & Consumer Extra
  { ticker: "TGT", name: "Target Corporation", sector: "Retail" },
  { ticker: "YUM", name: "Yum! Brands", sector: "Consumo" },
  { ticker: "LULU", name: "Lululemon Athletica", sector: "Consumo" },
  { ticker: "VFC", name: "V.F. Corporation", sector: "Consumo" },
  
  // Latin America & Emerging Markets
  { ticker: "MELI", name: "MercadoLibre Inc.", sector: "E-commerce LatAm" },
  { ticker: "GLOB", name: "Globant S.A.", sector: "Tecnología LatAm" },
  { ticker: "NU", name: "Nu Holdings", sector: "Fintech LatAm" },
  { ticker: "DESP", name: "Despegar.com", sector: "Turismo LatAm" },
  { ticker: "ABEV", name: "Ambev S.A.", sector: "Beverages LatAm" },
  { ticker: "PBR", name: "Petróleo Brasileiro S.A.", sector: "Energía LatAm" },
  { ticker: "ITUB", name: "Itaú Unibanco Holding S.A.", sector: "Finanzas LatAm" },
  { ticker: "BBD", name: "Banco Bradesco S.A.", sector: "Finanzas LatAm" },
  { ticker: "GFI", name: "Grupo Financiero Inbursa S.A.", sector: "Finanzas LatAm" },
  
  // Holding & Diversified
  { ticker: "BRK-B", name: "Berkshire Hathaway B", sector: "Holding" },
  { ticker: "BRK-A", name: "Berkshire Hathaway A", sector: "Holding" },
  { ticker: "BDX", name: "Becton, Dickinson and Company", sector: "Holding" },
  { ticker: "MMM", name: "3M Company", sector: "Holding" },
  { ticker: "ILMN", name: "Illumina Inc.", sector: "Biotecnología" },
  { ticker: "CRSP", name: "CRISPR Therapeutics", sector: "Biotecnología" },
  { ticker: "BNTX", name: "BioNTech SE", sector: "Biotecnología" },
  { ticker: "WELL", name: "Welltower Inc.", sector: "Real Estate" },
  { ticker: "DFS", name: "Discover Financial Services", sector: "Finanzas" },
  { ticker: "COF", name: "Capital One Financial", sector: "Finanzas" },
];

export interface StockQuote {
  ticker: string;
  price: number | null;
  previousClose: number | null;
  changePercent: number | null;
  companyName: string;
  error?: boolean;
}

export interface HistoryPoint {
  date: string;
  close: number;
}

export async function fetchStockPrices(tickers: string[]): Promise<StockQuote[]> {
  if (!tickers.length) return [];
  try {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const url = `https://${projectId}.supabase.co/functions/v1/stock-price?tickers=${tickers.join(",")}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return tickers.map(ticker => ({
      ticker, price: null, previousClose: null, changePercent: null, companyName: ticker, error: true,
    }));
  }
}

export async function fetchStockHistory(ticker: string, range = "3mo"): Promise<HistoryPoint[]> {
  try {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const url = `https://${projectId}.supabase.co/functions/v1/stock-history?ticker=${ticker}&range=${range}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}
