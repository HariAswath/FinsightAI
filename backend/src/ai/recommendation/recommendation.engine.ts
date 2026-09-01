import { AgentResult, AgentTraceEvent } from '../types/agent.types';
import { SynthesisResult } from '../types/synthesis.types';
import { PersonalizationImpact, PortfolioRiskImpact, FinalRecommendation, RecommendationAction } from '../types/recommendation.types';
import { llmClient } from '../llm/llm.client';

/**
 * Recommendation Engine.
 * Assembles final multi-agent investment verdict, citations, risk disclosures,
 * and Glass Box trace history into an auditable recommendation package.
 * Adheres to Section 24 of docs/IMPLEMENTATION.md.
 */
export class RecommendationEngine {
  public assembleRecommendation(params: {
    symbol: string;
    agents: Record<string, AgentResult>;
    synthesis: SynthesisResult;
    personalization: PersonalizationImpact;
    portfolioRisk: PortfolioRiskImpact;
    traces: AgentTraceEvent[];
    startTime: number;
  }): FinalRecommendation {
    const { symbol, agents, synthesis, personalization, portfolioRisk, traces, startTime } = params;

    // Determine final actionable verdict:
    // If portfolio concentration breached and triggers downgrade, respect risk containment
    let finalAction: RecommendationAction = personalization.adjustedAction;
    if (portfolioRisk.hasConcentrationRisk && portfolioRisk.recommendationAdjustment) {
      finalAction = 'HOLD';
    }

    // Confidence calibration: Combine synthesis confidence, agent consensus, and risk penalties
    let overallConfidence = synthesis.confidence;
    if (portfolioRisk.hasConcentrationRisk) {
      overallConfidence = Math.max(0.30, overallConfidence - 0.10);
    }
    const confidencePct = Math.round(overallConfidence * 100);

    // Key investment drivers
    const keyDrivers: string[] = [];
    if (agents['Fundamentals']?.claim) keyDrivers.push(`Fundamentals: ${agents['Fundamentals'].claim}`);
    if (agents['Technical']?.claim) keyDrivers.push(`Technicals: ${agents['Technical'].claim}`);
    if (agents['Sentiment']?.claim) keyDrivers.push(`Sentiment: ${agents['Sentiment'].claim}`);

    // Consolidated risks & limitations
    const risksAndLimitations: string[] = [];
    if (synthesis.conflict.hasConflict) {
      risksAndLimitations.push(`Signal Conflict: ${synthesis.conflict.summary}`);
    }
    if (portfolioRisk.riskWarning) {
      risksAndLimitations.push(`Portfolio Risk: ${portfolioRisk.riskWarning}`);
    }
    if (synthesis.dataCompleteness.degradedWarning) {
      risksAndLimitations.push(`Data Warning: ${synthesis.dataCompleteness.degradedWarning}`);
    }
    for (const ag of Object.values(agents)) {
      if (ag.limitations) {
        risksAndLimitations.push(...ag.limitations);
      }
    }

    // Executive summary formulation
    const executiveSummary = [
      `RECOMMENDATION: ${finalAction} (${confidencePct}% Conviction) for ${symbol.toUpperCase()}.`,
      personalization.impactExplanation,
      synthesis.reasoning,
      portfolioRisk.hasConcentrationRisk ? portfolioRisk.riskWarning : ''
    ].filter(Boolean).join(' ');

    const totalLatencyMs = Date.now() - startTime;

    return {
      id: `rec-${symbol.toLowerCase()}-${Date.now()}`,
      symbol: symbol.toUpperCase(),
      action: finalAction,
      overallConfidence: confidencePct,
      executiveSummary,
      keyDrivers,
      risksAndLimitations: Array.from(new Set(risksAndLimitations)),
      agents,
      synthesis,
      personalization,
      portfolioRisk,
      citations: synthesis.combinedEvidence.slice(0, 5),
      traces,
      metadata: {
        analyzedAt: new Date().toISOString(),
        totalLatencyMs,
        llmProvider: llmClient.getActiveProviderName(),
        modelUsed: process.env.GROQ_MODEL || process.env.OPENAI_MODEL || 'FinsightDeterministic-v1'
      }
    };
  }
}

export const recommendationEngine = new RecommendationEngine();
