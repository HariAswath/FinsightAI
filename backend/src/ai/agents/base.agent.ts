import { AgentResult, AgentStatus, SignalType } from '../types/agent.types';

export interface AgentContext {
  symbol: string;
  simulateFailure?: boolean | 'fundamentals' | 'technical' | 'sentiment';
}

/**
 * Base Agent Abstract Class enforcing standardized contract,
 * fault isolation, and execution latency measurement.
 * Adheres to Section 8 & 33 of docs/IMPLEMENTATION.md.
 */
export abstract class BaseAgent {
  public abstract readonly name: string;

  public async run(context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now();

    // Check simulated failure for graceful degradation demo
    if (
      context.simulateFailure === true ||
      context.simulateFailure === this.name.toLowerCase()
    ) {
      console.warn(`[Agent:${this.name}] Simulated failure triggered for graceful degradation demo.`);
      return {
        agent: this.name,
        status: 'unavailable',
        signal: null,
        confidence: 0.0,
        claim: `${this.name} data feed temporarily unavailable.`,
        evidence: [],
        limitations: [`External ${this.name.toLowerCase()} stream timed out or was disconnected.`],
        executionTimeMs: Date.now() - startTime
      };
    }

    try {
      const result = await this.execute(context);
      result.executionTimeMs = Date.now() - startTime;
      return this.validateResult(result);
    } catch (err: any) {
      console.error(`[Agent:${this.name}] Execution error:`, err.message);
      return {
        agent: this.name,
        status: 'degraded',
        signal: null,
        confidence: 0.0,
        claim: `${this.name} evaluation degraded due to internal parsing error.`,
        evidence: [],
        limitations: [`Error encountered: ${err.message}`],
        executionTimeMs: Date.now() - startTime
      };
    }
  }

  protected abstract execute(context: AgentContext): Promise<AgentResult>;

  protected validateResult(result: AgentResult): AgentResult {
    // Sanitize confidence
    let conf = Number(result.confidence);
    if (isNaN(conf) || conf < 0) conf = 0;
    if (conf > 1.0) conf = 1.0;

    // Validate signal
    const validSignals: SignalType[] = ['BULLISH', 'BEARISH', 'NEUTRAL', null];
    const signal = validSignals.includes(result.signal) ? result.signal : 'NEUTRAL';

    const validStatuses: AgentStatus[] = ['ok', 'degraded', 'unavailable'];
    const status = validStatuses.includes(result.status) ? result.status : 'ok';

    return {
      ...result,
      status,
      signal,
      confidence: Math.round(conf * 100) / 100,
      evidence: Array.isArray(result.evidence) ? result.evidence : [],
      limitations: Array.isArray(result.limitations) ? result.limitations : []
    };
  }
}
