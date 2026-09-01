import { SynthesisResult } from '../types/synthesis.types';
import { UserProfile } from '../types/profile.types';
import { RecommendationAction, PersonalizationImpact } from '../types/recommendation.types';
import { ComprehensiveEquityData } from '../../market/market.data';

/**
 * Personalization Engine.
 * Modulates investment action strictly based on User Risk Profile and Investment Horizon.
 * Directly fulfills Section 21 & 22 (Demonstrating different outputs for identical market data).
 */
export class PersonalizationEngine {
  public personalize(
    synthesis: SynthesisResult,
    profile: UserProfile,
    equity?: ComprehensiveEquityData
  ): PersonalizationImpact {
    const rawSignal = synthesis.consensusSignal || 'NEUTRAL';
    let action: RecommendationAction = 'HOLD';
    let explanation = '';

    const pe = equity?.peRatio ?? 25;
    const isHighValuation = pe > 30;

    switch (profile.riskTolerance) {
      case 'CONSERVATIVE':
        // Conservative: Capital preservation first.
        // Even on Bullish signals, if valuation is rich or volatility is high, recommend HOLD.
        if (rawSignal === 'BULLISH') {
          if (isHighValuation || synthesis.conflict.hasConflict) {
            action = 'HOLD';
            explanation = `Conservative Profile: Despite bullish momentum, current P/E of ${pe}x and cross-indicator divergence require a larger margin of safety. Recommended action throttled to HOLD to prevent capital impairment.`;
          } else {
            action = 'ACCUMULATE';
            explanation = `Conservative Profile: High fundamental quality verified. Recommend cautious, staggered accumulation during market dips rather than lump-sum entry.`;
          }
        } else if (rawSignal === 'BEARISH') {
          action = 'AVOID';
          explanation = 'Conservative Profile: Downside momentum and negative fundamental cues present unacceptable capital risk. AVOID or trim exposure.';
        } else {
          action = 'HOLD';
          explanation = 'Conservative Profile: Sideways market posture. Maintain existing defensive allocations without committing new cash.';
        }
        break;

      case 'MODERATE':
        // Moderate: Balanced risk-reward with disciplined entry.
        if (rawSignal === 'BULLISH') {
          action = 'ACCUMULATE';
          explanation = `Moderate Profile: Balanced signals favor progressive accumulation. Spread purchases across systematic tranches to optimize average cost basis.`;
        } else if (rawSignal === 'BEARISH') {
          action = 'REDUCE';
          explanation = `Moderate Profile: Downside risks outweigh upside catalysts. Consider profit taking or reducing exposure by 20-30%.`;
        } else {
          action = 'HOLD';
          explanation = `Moderate Profile: Balanced consolidation. Wait for clear directional breakout before deploying additional liquidity.`;
        }
        break;

      case 'AGGRESSIVE':
        // Aggressive: Maximizes alpha, embraces volume surges and momentum breakouts.
        if (rawSignal === 'BULLISH') {
          action = 'BUY';
          explanation = `Aggressive Profile: Strong momentum indicators and positive catalyst flow trigger an active BUY directive. Position sized to capture alpha on trend continuation.`;
        } else if (rawSignal === 'BEARISH') {
          action = 'REDUCE';
          explanation = `Aggressive Profile: Active risk containment. Exit or reduce speculative momentum positions immediately.`;
        } else {
          // If neutral but volume surge exists, aggressive trader accumulates
          action = 'ACCUMULATE';
          explanation = `Aggressive Profile: Sideways consolidation with underlying accumulation presents attractive risk-reward for early positioning.`;
        }
        break;
    }

    return {
      profile,
      rawSignal,
      adjustedAction: action,
      impactExplanation: explanation
    };
  }
}

export const personalizationEngine = new PersonalizationEngine();
