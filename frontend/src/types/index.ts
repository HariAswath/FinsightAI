export type SignalType = 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'POSITIVE' | 'NEGATIVE';
export type DecisionType = 'STRONG_BUY' | 'CONSIDER_BUY' | 'SMALL_ADD' | 'HOLD' | 'WATCH' | 'REDUCE' | 'AVOID';
export type RiskLevel = 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
export type InvestmentHorizon = 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  volumeChange: number;
  rsi: number;
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
  };
  movingAverages: {
    ma20: number;
    ma50: number;
    ma200: number;
  };
  volatility: number;
  timestamp: string;
}

export interface RAGSource {
  title: string;
  documentType: string;
  page: number;
  snippet: string;
  confidence: number;
  date?: string;
}

export interface AgentOutput<T = any> {
  agent: 'technical' | 'fundamental' | 'sentiment' | 'risk' | 'synthesis';
  signal: SignalType;
  confidence: number;
  reasons: string[];
  metrics?: Record<string, any>;
  sources?: RAGSource[];
  latencyMs: number;
  status: 'SUCCESS' | 'UNAVAILABLE' | 'CONFLICT';
}

export interface TechnicalOutput extends AgentOutput {
  agent: 'technical';
  metrics: {
    rsi: number;
    macdSignal: string;
    maTrend: string;
    momentumScore: number;
  };
}

export interface FundamentalOutput extends AgentOutput {
  agent: 'fundamental';
  sources: RAGSource[];
}

export interface SentimentOutput extends AgentOutput {
  agent: 'sentiment';
  metrics: {
    newsCount: number;
    positiveRatio: number;
    earningsCommentary: string;
  };
}

export interface RiskOutput {
  agent: 'risk';
  riskLevel: RiskLevel;
  concentrationScore: number; // 0 - 100
  existingExposurePercent: number; // e.g. 0.25 = 25%
  riskFlags: string[];
  personalizationFactors: string[];
  latencyMs: number;
}

export interface UserProfile {
  id: string;
  name: string;
  riskTolerance: RiskLevel;
  investmentHorizon: InvestmentHorizon;
  portfolio: Record<string, number>; // symbol -> percentage allocation e.g. { RELIANCE: 0.30, TCS: 0.20 }
}

export interface SynthesisOutput {
  marketView: SignalType;
  confidence: number;
  personalizedDecision: DecisionType;
  summary: string;
  reasons: string[];
  risks: string[];
  sources: RAGSource[];
  reasoningSteps: {
    stepIndex: number;
    title: string;
    agentName: string;
    details: string;
  }[];
  latencyMs: number;
}

export interface AnalysisSessionResult {
  symbol: string;
  marketData: MarketData;
  technical: TechnicalOutput;
  fundamental: FundamentalOutput;
  sentiment: SentimentOutput;
  risk: RiskOutput;
  synthesis: SynthesisOutput;
  totalLatencyMs: number;
  isDegraded: boolean;
  hasConflict: boolean;
  timestamp: string;
}
