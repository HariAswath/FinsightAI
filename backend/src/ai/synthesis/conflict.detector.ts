import { AgentResult, SignalType } from '../types/agent.types';
import { SignalConflict } from '../types/synthesis.types';

/**
 * Deterministic Signal Conflict Matrix & Divergence Detector.
 * Compares agent dimensions to uncover opposing structural forces.
 * Adheres to Section 19 of docs/IMPLEMENTATION.md.
 */
export class ConflictDetector {
  public static detect(agents: Record<string, AgentResult>): SignalConflict {
    const validAgents = Object.values(agents).filter(
      a => a.status === 'ok' && a.signal !== null
    );

    if (validAgents.length <= 1) {
      return {
        hasConflict: false,
        severity: 'NONE',
        summary: 'Insufficient active agent signals to detect cross-dimension conflict.',
        divergingDimensions: [],
        reconciliationRationale: 'Single or zero active signals; relying on available dimensions.'
      };
    }

    const signals = validAgents.map(a => ({
      agent: a.agent,
      signal: a.signal as NonNullable<SignalType>
    }));

    const hasBullish = signals.some(s => s.signal === 'BULLISH');
    const hasBearish = signals.some(s => s.signal === 'BEARISH');
    const hasNeutral = signals.some(s => s.signal === 'NEUTRAL');

    // Case 1: Sharp Conflict (BULLISH vs BEARISH)
    if (hasBullish && hasBearish) {
      const bullishAgents = signals.filter(s => s.signal === 'BULLISH').map(s => s.agent);
      const bearishAgents = signals.filter(s => s.signal === 'BEARISH').map(s => s.agent);

      return {
        hasConflict: true,
        severity: 'SHARP',
        summary: `Sharp directional conflict detected: [${bullishAgents.join(', ')}] are BULLISH while [${bearishAgents.join(', ')}] are BEARISH.`,
        divergingDimensions: [...bullishAgents, ...bearishAgents],
        reconciliationRationale: 'Directional divergence across structural layers indicates valuation or macro friction. Final recommendation will temper sizing and require tighter stop parameters.'
      };
    }

    // Case 2: Mild Conflict (Directional vs NEUTRAL)
    if (hasNeutral && (hasBullish || hasBearish)) {
      const directionalType = hasBullish ? 'BULLISH' : 'BEARISH';
      const directionalAgents = signals.filter(s => s.signal === directionalType).map(s => s.agent);
      const neutralAgents = signals.filter(s => s.signal === 'NEUTRAL').map(s => s.agent);

      return {
        hasConflict: true,
        severity: 'MILD',
        summary: `Mild divergence: [${directionalAgents.join(', ')}] indicate ${directionalType}, while [${neutralAgents.join(', ')}] are NEUTRAL / consolidating.`,
        divergingDimensions: neutralAgents,
        reconciliationRationale: `The primary trend is leaning ${directionalType}, but sideways or unconfirmed metrics from neutral dimensions suggest staggered accumulation rather than aggressive capital commitment.`
      };
    }

    // Case 3: Complete Alignment
    const firstSignal = signals[0].signal;
    return {
      hasConflict: false,
      severity: 'NONE',
      summary: `High cross-agent consensus: All active agents (${signals.map(s => s.agent).join(', ')}) converge on ${firstSignal}.`,
      divergingDimensions: [],
      reconciliationRationale: 'Signal convergence across fundamentals, price action, and market sentiment provides high structural conviction.'
    };
  }
}
