import { AgentEvidence, SignalType } from './agent.types';

export interface SignalConflict {
  hasConflict: boolean;
  severity: 'NONE' | 'MILD' | 'SHARP';
  summary: string;
  divergingDimensions: string[];
  reconciliationRationale: string;
}

export interface SynthesisResult {
  consensusSignal: SignalType;
  confidence: number; // 0.0 to 1.0
  reasoning: string;
  conflict: SignalConflict;
  dimensionScores: {
    fundamentals: { signal: SignalType; confidence: number; weight: number };
    technical: { signal: SignalType; confidence: number; weight: number };
    sentiment: { signal: SignalType; confidence: number; weight: number };
  };
  combinedEvidence: AgentEvidence[];
  dataCompleteness: {
    availableAgents: number;
    totalAgents: number;
    degradedWarning?: string;
  };
  executionTimeMs: number;
}
