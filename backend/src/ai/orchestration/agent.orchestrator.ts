import { BaseAgent, AgentContext } from '../agents/base.agent';
import { FundamentalsAgent } from '../agents/fundamentals.agent';
import { TechnicalAgent } from '../agents/technical.agent';
import { SentimentAgent } from '../agents/sentiment.agent';
import { AgentResult, AgentTraceEvent } from '../types/agent.types';
import { traceEmitter } from './trace.emitter';

/**
 * Parallel Agent Orchestrator.
 * Executes specialized agents concurrently (Promise.allSettled) with fault isolation,
 * timing metrics, and event streaming.
 * Adheres to Section 17 & 25 of docs/IMPLEMENTATION.md.
 */
export class AgentOrchestrator {
  private agents: BaseAgent[];

  constructor(agents?: BaseAgent[]) {
    this.agents = agents || [
      new FundamentalsAgent(),
      new TechnicalAgent(),
      new SentimentAgent()
    ];
  }

  public async executeParallel(
    symbol: string,
    options: {
      simulateFailure?: boolean | 'fundamentals' | 'technical' | 'sentiment';
      onTrace?: (trace: AgentTraceEvent) => void;
    } = {}
  ): Promise<{ results: Record<string, AgentResult>; traces: AgentTraceEvent[] }> {
    const traces: AgentTraceEvent[] = [];

    const recordTrace = (event: AgentTraceEvent) => {
      traces.push(event);
      if (options.onTrace) {
        options.onTrace(event);
      }
    };

    recordTrace(
      traceEmitter.createEvent(
        'ANALYSIS_STARTED',
        'RUNNING',
        `Initiating multi-agent parallel analysis for equity ${symbol.toUpperCase()} across 3 specialized dimensions.`,
        undefined,
        undefined,
        { symbol: symbol.toUpperCase() }
      )
    );

    const startTime = Date.now();

    // Launch all agents concurrently
    const agentPromises = this.agents.map(async (agent) => {
      const agentStart = Date.now();

      recordTrace(
        traceEmitter.createEvent(
          'AGENT_STARTED',
          'RUNNING',
          `Specialized ${agent.name} Agent started evaluation.`,
          agent.name
        )
      );

      const context: AgentContext = {
        symbol,
        simulateFailure: options.simulateFailure
      };

      const result = await agent.run(context);
      const durationMs = Date.now() - agentStart;

      if (result.status === 'ok') {
        recordTrace(
          traceEmitter.createEvent(
            'AGENT_COMPLETED',
            'COMPLETED',
            `${agent.name} Agent finished: Signal=${result.signal}, Confidence=${Math.round(result.confidence * 100)}% (${durationMs}ms)`,
            agent.name,
            durationMs,
            { signal: result.signal, confidence: result.confidence }
          )
        );
      } else {
        recordTrace(
          traceEmitter.createEvent(
            'AGENT_DEGRADED',
            'FAILED',
            `${agent.name} Agent entered ${result.status.toUpperCase()} state: ${result.claim} (${durationMs}ms)`,
            agent.name,
            durationMs,
            { status: result.status }
          )
        );
      }

      return result;
    });

    const settled = await Promise.allSettled(agentPromises);

    const results: Record<string, AgentResult> = {};
    for (let i = 0; i < this.agents.length; i++) {
      const agent = this.agents[i];
      const outcome = settled[i];

      if (outcome.status === 'fulfilled') {
        results[agent.name] = outcome.value;
      } else {
        results[agent.name] = {
          agent: agent.name,
          status: 'degraded',
          signal: null,
          confidence: 0.0,
          claim: `Unhandled agent crash: ${outcome.reason?.message || 'Unknown exception'}`,
          evidence: [],
          limitations: ['Internal worker promise rejected.'],
          executionTimeMs: Date.now() - startTime
        };
      }
    }

    return { results, traces };
  }
}

export const agentOrchestrator = new AgentOrchestrator();
