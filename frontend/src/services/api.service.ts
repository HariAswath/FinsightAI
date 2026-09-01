/**
 * Signalist / FinsightAI API Service
 * Strongly-typed integration connecting to backend on port 5000.
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000/ws/market';

export interface MarketQuote {
  symbol: string;
  instrumentKey: string;
  ltp: number;
  closePrice?: number;
  openPrice?: number;
  highPrice?: number;
  lowPrice?: number;
  change?: number;
  changePercent?: number;
  volume?: number;
  lastTradedTime?: number;
  updatedAt: string;
}

export interface TechnicalAnalysis {
  rsi14: number;
  rsiSignal: 'OVERSOLD' | 'NEUTRAL' | 'OVERBOUGHT';
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
    trend: 'BULLISH_CROSSOVER' | 'BEARISH_CROSSOVER' | 'NEUTRAL';
  };
  movingAverages: {
    ema20: number;
    ema50: number;
    ema200: number;
    trendAlignment: 'STRONG_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH';
  };
  volumeAnalysis: {
    currentVolume: number;
    avgVolume20D: number;
    volumeSurgeRatio: number;
    isAnomaly: boolean;
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
    bandWidth: number;
  };
}

export interface RegulatoryFilingDoc {
  id: string;
  symbol: string;
  source: 'SEBI_LODR' | 'EARNINGS_TRANSCRIPT' | 'ANNUAL_REPORT' | 'PRESS_RELEASE';
  title: string;
  filingDate: string;
  keyExcerpts: string[];
  relevanceScore: number;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'CAUTIONARY';
}

export interface ComprehensiveEquityData {
  symbol: string;
  companyName: string;
  sector: string;
  exchange: 'NSE';
  ltp: number;
  closePrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  week52High: number;
  week52Low: number;
  peRatio: number;
  marketCapCr: number;
  technical?: TechnicalAnalysis;
  filings?: RegulatoryFilingDoc[];
  updatedAt: string;
}

export interface EvidenceCitation {
  id: string;
  source: string;
  title: string;
  section: string;
  excerpt: string;
  relevanceScore: number;
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'CAUTIONARY';
}

export interface AgentResult {
  agentName: string;
  status: 'completed' | 'degraded' | 'unavailable';
  signal: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number;
  claim: string;
  reasoning: string;
  evidence: EvidenceCitation[];
  limitations: string[];
  latencyMs: number;
}

export interface FinalRecommendation {
  id: string;
  symbol: string;
  timestamp: string;
  action: 'BUY' | 'ACCUMULATE' | 'HOLD' | 'REDUCE' | 'AVOID';
  overallConfidence: number;
  executiveSummary: string;
  agents: {
    Fundamentals: AgentResult;
    Technical: AgentResult;
    Sentiment: AgentResult;
  };
  synthesis: {
    consensusSignal: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    adjustedConfidence: number;
    reasoning: string;
    conflict: {
      hasConflict: boolean;
      severity: 'NONE' | 'MILD' | 'SHARP';
      summary: string;
      conflictingDimensions: string[];
    };
    dataCompleteness: {
      availableDimensionsCount: number;
      isFullySourced: boolean;
      unavailableDimensions: string[];
      degradedWarning?: string;
    };
  };
  personalization: {
    appliedProfile: {
      riskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
      horizon: 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';
      maxStockConcentrationPct: number;
    };
    actionModulationReasoning: string;
    originalSynthesisSignal: string;
    adjustedAction: string;
  };
  portfolioRisk: {
    currentHoldingWeightPct: number;
    concentrationCapPct: number;
    isConcentrationExceeded: boolean;
    concentrationWarning?: string;
  };
  citations: EvidenceCitation[];
  metadata: {
    totalLatencyMs: number;
    llmProvider: string;
    modelVersion: string;
    ragIndexedDocsCount: number;
    marketDataSource: string;
  };
}

export class ApiService {
  public static async getQuotes(): Promise<MarketQuote[]> {
    const res = await fetch(`${API_BASE}/api/market/quotes`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch quotes: ${res.statusText}`);
    const json = await res.json();
    return json.data || [];
  }

  public static async getEquity(symbol: string): Promise<{ quote: MarketQuote; comprehensive?: ComprehensiveEquityData }> {
    const res = await fetch(`${API_BASE}/api/market/${symbol.toUpperCase()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch equity for ${symbol}: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  }

  public static async analyze(symbol: string, profileId: string = 'moderate'): Promise<FinalRecommendation> {
    const res = await fetch(`${API_BASE}/api/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol: symbol.toUpperCase(), profileId: profileId.toLowerCase() })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Analysis failed: ${res.statusText}`);
    }
    const json = await res.json();
    return json.recommendation;
  }

  public static connectMarketWS(
    onQuote: (quote: MarketQuote) => void,
    onStatus?: (status: any) => void
  ): () => void {
    try {
      const ws = new WebSocket(WS_BASE);
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'quote' && payload.data) {
            onQuote(payload.data);
          } else if (payload.type === 'status' && onStatus) {
            onStatus(payload.data);
          }
        } catch (e) {}
      };
      ws.onerror = () => {};
      return () => {
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close();
        }
      };
    } catch (e) {
      return () => {};
    }
  }
}
