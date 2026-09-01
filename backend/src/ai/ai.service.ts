import { agentOrchestrator, AgentOrchestrator } from './orchestration/agent.orchestrator';
import { SynthesisAgent } from './synthesis/synthesis.agent';
import { personalizationEngine, PersonalizationEngine } from './personalization/personalization.engine';
import { portfolioAnalyzer, PortfolioAnalyzer } from './personalization/portfolio.analyzer';
import { recommendationEngine, RecommendationEngine } from './recommendation/recommendation.engine';
import { traceEmitter } from './orchestration/trace.emitter';
import { marketService } from '../market/market.service';
import { UserProfile, PRESET_PROFILES, PortfolioContext } from './types/profile.types';
import { FinalRecommendation } from './types/recommendation.types';
import { AgentTraceEvent } from './types/agent.types';

export interface AnalysisOptions {
  symbol: string;
  profileId?: string;
  userProfile?: UserProfile;
  portfolio?: PortfolioContext;
  simulateFailure?: boolean | 'fundamentals' | 'technical' | 'sentiment';
  onTrace?: (trace: AgentTraceEvent) => void;
}

/**
 * AI Service Facade.
 * Coordinates Market Data, Parallel Multi-Agent Orchestration, Synthesis, Personalization,
 * Concentration Risk Checks, and Real-Time Event Emission.
 */
export class AIService {
  private orchestrator: AgentOrchestrator;
  private synthesisAgent: SynthesisAgent;
  private personalization: PersonalizationEngine;
  private portfolio: PortfolioAnalyzer;
  private recommendation: RecommendationEngine;

  private cache: Map<string, { data: FinalRecommendation; expiresAt: number }> = new Map();

  constructor() {
    this.orchestrator = agentOrchestrator;
    this.synthesisAgent = new SynthesisAgent();
    this.personalization = personalizationEngine;
    this.portfolio = portfolioAnalyzer;
    this.recommendation = recommendationEngine;
  }

  public async analyze(options: AnalysisOptions): Promise<FinalRecommendation> {
    const startTime = Date.now();
    const symbol = options.symbol.toUpperCase();
    const profileId = options.profileId?.toLowerCase() || 'moderate';
    const cacheKey = `${symbol}:${profileId}`;

    // Return cached result if fresh and not testing failure simulation
    if (!options.simulateFailure && !options.onTrace && !options.portfolio && !options.userProfile) {
      const cached = this.cache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        return cached.data;
      }
    }

    // 1. Resolve User Profile (default to Moderate if not provided)
    const profile = options.userProfile ||
      PRESET_PROFILES[profileId] ||
      PRESET_PROFILES['moderate'];

    // 2. Fetch equity market metadata
    const equity = marketService.getComprehensive(symbol);
    const sector = equity?.sector || 'Diversified Equity';

    // 3. Parallel Specialized Agents Execution
    const { results: agents, traces } = await this.orchestrator.executeParallel(symbol, {
      simulateFailure: options.simulateFailure,
      onTrace: options.onTrace
    });

    // 4. Synthesis & Cross-Dimension Reconciliation
    const synthesisStart = Date.now();
    const synthesisTrace = traceEmitter.createEvent(
      'SYNTHESIS_STARTED',
      'RUNNING',
      `Reconciling cross-dimension signals from 3 specialized agents. Checking for divergence...`
    );
    traces.push(synthesisTrace);
    if (options.onTrace) options.onTrace(synthesisTrace);

    const synthesis = await this.synthesisAgent.synthesize(agents, symbol);

    const synthesisDoneTrace = traceEmitter.createEvent(
      'SYNTHESIS_COMPLETED',
      'COMPLETED',
      `Synthesis complete: Consensus=${synthesis.consensusSignal} (${Math.round(synthesis.confidence * 100)}% Conf). Conflict=${synthesis.conflict.severity}.`,
      'Synthesis',
      Date.now() - synthesisStart,
      { consensus: synthesis.consensusSignal, conflict: synthesis.conflict.severity }
    );
    traces.push(synthesisDoneTrace);
    if (options.onTrace) options.onTrace(synthesisDoneTrace);

    // 5. User Profile Personalization Layer
    const persStart = Date.now();
    const persTrace = traceEmitter.createEvent(
      'PERSONALIZATION_STARTED',
      'RUNNING',
      `Applying user profile: ${profile.name} (Risk: ${profile.riskTolerance}, Horizon: ${profile.horizon}).`
    );
    traces.push(persTrace);
    if (options.onTrace) options.onTrace(persTrace);

    const personalizationImpact = this.personalization.personalize(synthesis, profile, equity);

    // 6. Deterministic Portfolio Exposure & Concentration Check
    const portfolioContext = options.portfolio || PortfolioAnalyzer.getSamplePortfolio();
    const portfolioRisk = this.portfolio.evaluateExposure(
      symbol,
      sector,
      personalizationImpact.adjustedAction,
      profile,
      portfolioContext
    );

    const persDoneTrace = traceEmitter.createEvent(
      'PERSONALIZATION_COMPLETED',
      'COMPLETED',
      `Personalization applied: Action=${personalizationImpact.adjustedAction}. Concentration Risk=${portfolioRisk.hasConcentrationRisk ? 'YES' : 'NONE'}.`,
      'Personalization',
      Date.now() - persStart,
      { action: personalizationImpact.adjustedAction, concentrationRisk: portfolioRisk.hasConcentrationRisk }
    );
    traces.push(persDoneTrace);
    if (options.onTrace) options.onTrace(persDoneTrace);

    // 7. Final Recommendation Assembly
    const finalRec = this.recommendation.assembleRecommendation({
      symbol,
      agents,
      synthesis,
      personalization: personalizationImpact,
      portfolioRisk,
      traces,
      startTime
    });

    const completionTrace = traceEmitter.createEvent(
      'ANALYSIS_COMPLETED',
      'COMPLETED',
      `Multi-Agent Analysis finished for ${symbol}: ${finalRec.action} (${finalRec.overallConfidence}% Conf) in ${finalRec.metadata.totalLatencyMs}ms.`,
      undefined,
      finalRec.metadata.totalLatencyMs,
      { action: finalRec.action, confidence: finalRec.overallConfidence }
    );
    traces.push(completionTrace);
    if (options.onTrace) options.onTrace(completionTrace);

    if (!options.simulateFailure) {
      this.cache.set(cacheKey, { data: finalRec, expiresAt: Date.now() + 30000 });
    }

    return finalRec;
  }

  /**
   * Compare how identical market data behaves across Conservative, Moderate, and Aggressive profiles.
   * Section 22 & 38 of docs/IMPLEMENTATION.md.
   */
  public async compareProfiles(symbol: string): Promise<{
    symbol: string;
    consensusSignal: string;
    profiles: Array<{
      profileId: string;
      profileName: string;
      riskTolerance: string;
      horizon: string;
      action: string;
      explanation: string;
    }>;
    sharedAgents: any;
    conflict: any;
  }> {
    const symbolUpper = symbol.toUpperCase();
    const equity = marketService.getComprehensive(symbolUpper);

    // 1. Run multi-agent pipeline once
    const { results: agents } = await this.orchestrator.executeParallel(symbolUpper);
    const synthesis = await this.synthesisAgent.synthesize(agents, symbolUpper);

    // 2. Modulate across all 3 preset profiles with identical market inputs
    const profileKeys = ['conservative', 'moderate', 'aggressive'] as const;
    const comparison = profileKeys.map((key) => {
      const p = PRESET_PROFILES[key];
      const impact = this.personalization.personalize(synthesis, p, equity);
      return {
        profileId: p.id,
        profileName: p.name,
        riskTolerance: p.riskTolerance,
        horizon: p.horizon,
        action: impact.adjustedAction,
        explanation: impact.impactExplanation
      };
    });

    return {
      symbol: symbolUpper,
      consensusSignal: synthesis.consensusSignal || 'NEUTRAL',
      profiles: comparison,
      sharedAgents: agents,
      conflict: synthesis.conflict
    };
  }

  public getPresetProfiles(): Record<string, UserProfile> {
    return PRESET_PROFILES;
  }

  public getSamplePortfolio(): PortfolioContext {
    return PortfolioAnalyzer.getSamplePortfolio();
  }
}

export const aiService = new AIService();
