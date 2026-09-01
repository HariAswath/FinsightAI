export type SignalType = 'BULLISH' | 'BEARISH' | 'NEUTRAL' | null;

export type AgentStatus = 'ok' | 'degraded' | 'unavailable';

export interface AgentEvidence {
  source: string;
  title: string;
  filingDate?: string;
  section?: string;
  excerpt: string;
  relevanceScore: number;
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'CAUTIONARY';
}

/**
 * Standard Agent Contract adhering to Section 8 of docs/IMPLEMENTATION.md
 */
export interface AgentResult {
  agent: string;
  status: AgentStatus;
  signal: SignalType;
  confidence: number; // 0.0 to 1.0
  claim: string | null;
  evidence: AgentEvidence[];
  limitations: string[];
  executionTimeMs: number;
}

export type TraceStepType =
  | 'ANALYSIS_STARTED'
  | 'AGENT_STARTED'
  | 'AGENT_PROGRESS'
  | 'AGENT_COMPLETED'
  | 'AGENT_DEGRADED'
  | 'SYNTHESIS_STARTED'
  | 'SYNTHESIS_COMPLETED'
  | 'PERSONALIZATION_STARTED'
  | 'PERSONALIZATION_COMPLETED'
  | 'ANALYSIS_COMPLETED'
  | 'ANALYSIS_FAILED';

export interface AgentTraceEvent {
  step: TraceStepType;
  agent?: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  message: string;
  timestamp: string;
  durationMs?: number;
  data?: any;
}
