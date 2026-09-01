import { AgentResult, AgentEvidence, SignalType } from '../types/agent.types';
import { SynthesisResult } from '../types/synthesis.types';
import { ConflictDetector } from './conflict.detector';
import { llmClient } from '../llm/llm.client';
import { SYNTHESIS_SYSTEM_PROMPT } from '../llm/prompts';

/**
 * Synthesis Agent.
 * Synthesizes specialized agent signals, resolves conflicts, and produces unified market thesis.
 * Adheres to Section 18 & 28 of docs/IMPLEMENTATION.md.
 */
export class SynthesisAgent {
  public async synthesize(agents: Record<string, AgentResult>, symbol: string): Promise<SynthesisResult> {
    const startTime = Date.now();

    const conflict = ConflictDetector.detect(agents);

    // Evaluate availability and degradation
    const agentList = Object.values(agents);
    const availableAgents = agentList.filter(a => a.status === 'ok');
    const totalAgents = agentList.length;

    let degradedWarning: string | undefined;
    const unavailableList = agentList.filter(a => a.status === 'unavailable').map(a => a.agent);
    if (unavailableList.length > 0) {
      degradedWarning = `${unavailableList.join(', ')} data feed unavailable. Recommendation generated using available dimensions with reduced confidence penalty.`;
    }

    // Dimension breakdown
    const fundamentalsAgent = agents['Fundamentals'] || agents['fundamentals'];
    const technicalAgent = agents['Technical'] || agents['technical'];
    const sentimentAgent = agents['Sentiment'] || agents['sentiment'];

    const dimensionScores = {
      fundamentals: {
        signal: fundamentalsAgent?.signal ?? null,
        confidence: fundamentalsAgent?.confidence ?? 0,
        weight: 0.40
      },
      technical: {
        signal: technicalAgent?.signal ?? null,
        confidence: technicalAgent?.confidence ?? 0,
        weight: 0.35
      },
      sentiment: {
        signal: sentimentAgent?.signal ?? null,
        confidence: sentimentAgent?.confidence ?? 0,
        weight: 0.25
      }
    };

    // Aggregate evidence pool
    const combinedEvidence: AgentEvidence[] = [];
    for (const ag of agentList) {
      if (ag.evidence && Array.isArray(ag.evidence)) {
        combinedEvidence.push(...ag.evidence);
      }
    }
    // Sort descending by relevance
    combinedEvidence.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Fallback deterministic synthesis calculator
    const fallbackGenerator = () => {
      let scoreSum = 0;
      let weightSum = 0;

      for (const ag of availableAgents) {
        if (!ag.signal) continue;
        const sign = ag.signal === 'BULLISH' ? 1 : ag.signal === 'BEARISH' ? -1 : 0;
        const w = ag.agent === 'Fundamentals' ? 0.40 : ag.agent === 'Technical' ? 0.35 : 0.25;
        scoreSum += sign * ag.confidence * w;
        weightSum += w;
      }

      const normalizedScore = weightSum > 0 ? scoreSum / weightSum : 0;
      let consensusSignal: SignalType = 'NEUTRAL';
      if (normalizedScore > 0.20) consensusSignal = 'BULLISH';
      else if (normalizedScore < -0.20) consensusSignal = 'BEARISH';

      // Base confidence
      const avgConfidence = availableAgents.length > 0
        ? availableAgents.reduce((sum, a) => sum + a.confidence, 0) / availableAgents.length
        : 0.5;

      // Penalties for conflicts & missing dimensions
      let adjustedConfidence = avgConfidence;
      if (conflict.severity === 'SHARP') adjustedConfidence *= 0.75;
      else if (conflict.severity === 'MILD') adjustedConfidence *= 0.90;
      if (unavailableList.length > 0) adjustedConfidence *= 0.85;

      adjustedConfidence = Math.min(0.98, Math.max(0.20, Math.round(adjustedConfidence * 100) / 100));

      const reasoning = conflict.hasConflict
        ? `${conflict.summary} ${conflict.reconciliationRationale}`
        : `Unified cross-agent alignment on ${consensusSignal}. Robust fundamental support coupled with supportive technical momentum confirms positive stance.`;

      return {
        consensusSignal,
        confidence: adjustedConfidence,
        reasoning,
        conflictSummary: conflict.summary,
        keyDrivers: [
          fundamentalsAgent?.claim || 'Solid business fundamentals',
          technicalAgent?.claim || 'Constructive technical structure',
          sentimentAgent?.claim || 'Supportive market tone'
        ]
      };
    };

    // Call LLM for natural-language cross-dimensional synthesis
    const systemPrompt = SYNTHESIS_SYSTEM_PROMPT;
    const userPrompt = `
Synthesize findings for ${symbol}:
- Fundamentals Agent: [${fundamentalsAgent?.status}] Signal: ${fundamentalsAgent?.signal} (Conf: ${fundamentalsAgent?.confidence}) | Claim: "${fundamentalsAgent?.claim}"
- Technical Agent: [${technicalAgent?.status}] Signal: ${technicalAgent?.signal} (Conf: ${technicalAgent?.confidence}) | Claim: "${technicalAgent?.claim}"
- Sentiment Agent: [${sentimentAgent?.status}] Signal: ${sentimentAgent?.signal} (Conf: ${sentimentAgent?.confidence}) | Claim: "${sentimentAgent?.claim}"
- Detected Conflict: ${conflict.summary} (Severity: ${conflict.severity})
- Missing / Degraded Feeds: ${unavailableList.join(', ') || 'None'}

Output ONLY valid JSON adhering strictly to the JSON schema.
`;

    const { data } = await llmClient.generateStructuredJSON<{
      consensusSignal: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
      confidence: number;
      reasoning: string;
      conflictSummary: string;
      keyDrivers: string[];
    }>(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      { temperature: 0.2 },
      fallbackGenerator
    );

    let finalConfidence = Number(data.confidence) || 0.8;
    if (unavailableList.length > 0 && finalConfidence > 0.82) {
      finalConfidence = 0.78; // apply degradation ceiling
    }

    return {
      consensusSignal: data.consensusSignal || 'NEUTRAL',
      confidence: Math.round(finalConfidence * 100) / 100,
      reasoning: data.reasoning,
      conflict,
      dimensionScores,
      combinedEvidence,
      dataCompleteness: {
        availableAgents: availableAgents.length,
        totalAgents,
        degradedWarning
      },
      executionTimeMs: Date.now() - startTime
    };
  }
}
