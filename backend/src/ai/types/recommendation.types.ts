import { AgentEvidence, AgentResult, AgentTraceEvent } from './agent.types';
import { UserProfile } from './profile.types';
import { SynthesisResult } from './synthesis.types';

export type RecommendationAction = 'BUY' | 'ACCUMULATE' | 'HOLD' | 'REDUCE' | 'AVOID';

export interface PortfolioRiskImpact {
  hasConcentrationRisk: boolean;
  currentStockWeightPct: number;
  projectedStockWeightPct: number;
  currentSectorWeightPct: number;
  maxAllowedStockPct: number;
  riskWarning?: string;
  recommendationAdjustment?: string;
}

export interface PersonalizationImpact {
  profile: UserProfile;
  rawSignal: string;
  adjustedAction: RecommendationAction;
  impactExplanation: string;
}

export interface FinalRecommendation {
  id: string;
  symbol: string;
  action: RecommendationAction;
  overallConfidence: number; // 0 to 100 or 0.0 to 1.0
  executiveSummary: string;
  keyDrivers: string[];
  risksAndLimitations: string[];
  agents: Record<string, AgentResult>;
  synthesis: SynthesisResult;
  personalization: PersonalizationImpact;
  portfolioRisk: PortfolioRiskImpact;
  citations: AgentEvidence[];
  traces: AgentTraceEvent[];
  metadata: {
    analyzedAt: string;
    totalLatencyMs: number;
    llmProvider: string;
    modelUsed: string;
  };
}
