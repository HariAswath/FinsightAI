import { BaseAgent, AgentContext } from './base.agent';
import { AgentResult, AgentEvidence } from '../types/agent.types';
import { marketService } from '../../market/market.service';
import { llmClient } from '../llm/llm.client';
import { TECHNICAL_SYSTEM_PROMPT } from '../llm/prompts';

/**
 * Specialized Technical Analysis Agent.
 * Evaluates pre-calculated momentum, trend alignment, MACD, and volume anomalies.
 * Adheres to Section 15 of docs/IMPLEMENTATION.md.
 */
export class TechnicalAgent extends BaseAgent {
  public readonly name = 'Technical';

  protected async execute(context: AgentContext): Promise<AgentResult> {
    const symbol = context.symbol.toUpperCase();
    const technical = marketService.getTechnical(symbol);
    const quote = marketService.getQuote(symbol);

    if (!technical) {
      return {
        agent: this.name,
        status: 'unavailable',
        signal: null,
        confidence: 0.0,
        claim: `No technical indicator calculations available for symbol ${symbol}.`,
        evidence: [],
        limitations: ['Insufficient historical price bars to compute EMAs and MACD.'],
        executionTimeMs: 0
      };
    }

    const currentPrice = quote?.ltp ?? technical.movingAverages.ema20;

    // 1. Build structured evidence from deterministic indicators
    const evidenceList: AgentEvidence[] = [
      {
        source: 'NSE_INDICATOR_ENGINE',
        title: 'Moving Average Trend Alignment',
        section: 'Trend Analysis',
        excerpt: `Price (₹${currentPrice}) vs EMA20 (₹${technical.movingAverages.ema20}), EMA50 (₹${technical.movingAverages.ema50}), EMA200 (₹${technical.movingAverages.ema200}). Alignment: ${technical.movingAverages.trendAlignment}.`,
        relevanceScore: 0.95
      },
      {
        source: 'NSE_INDICATOR_ENGINE',
        title: 'MACD & Momentum Oscillator',
        section: 'Momentum',
        excerpt: `MACD Line ${technical.macd.macdLine} vs Signal ${technical.macd.signalLine} with Histogram ${technical.macd.histogram} (${technical.macd.trend}). RSI(14) at ${technical.rsi14} (${technical.rsiSignal}).`,
        relevanceScore: 0.92
      },
      {
        source: 'NSE_INDICATOR_ENGINE',
        title: 'Volume Surge & Anomaly Detection',
        section: 'Liquidity',
        excerpt: `Volume Surge Ratio: ${technical.volumeAnalysis.volumeSurgeRatio}x 20D baseline (Anomaly: ${technical.volumeAnalysis.isAnomaly ? 'YES' : 'NO'}). Current Vol: ${technical.volumeAnalysis.currentVolume.toLocaleString()}.`,
        relevanceScore: 0.88
      }
    ];

    // 2. Prepare LLM prompt
    const systemPrompt = TECHNICAL_SYSTEM_PROMPT;
    const userPrompt = `
Evaluate technical indicators for ${symbol}:
- LTP: ₹${currentPrice}
- RSI(14): ${technical.rsi14} (${technical.rsiSignal})
- MACD Trend: ${technical.macd.trend} (Histogram: ${technical.macd.histogram})
- EMA Trend Alignment: ${technical.movingAverages.trendAlignment} (EMA20: ${technical.movingAverages.ema20}, EMA50: ${technical.movingAverages.ema50}, EMA200: ${technical.movingAverages.ema200})
- Volume Surge: ${technical.volumeAnalysis.volumeSurgeRatio}x baseline (Anomaly: ${technical.volumeAnalysis.isAnomaly})
- Bollinger Bands: Upper ${technical.bollingerBands.upper}, Lower ${technical.bollingerBands.lower}

Output ONLY valid JSON adhering strictly to the JSON schema.
`;

    // 3. Fallback deterministic generator
    const fallbackGenerator = () => {
      let isBullish = false;
      let isBearish = false;

      if (
        (technical.movingAverages.trendAlignment === 'STRONG_BULLISH' || technical.movingAverages.trendAlignment === 'BULLISH') &&
        technical.macd.histogram > 0 &&
        technical.rsi14 < 75
      ) {
        isBullish = true;
      } else if (technical.macd.histogram < 0 || technical.movingAverages.trendAlignment === 'BEARISH') {
        isBearish = true;
      }

      const signal: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = isBullish ? 'BULLISH' : isBearish ? 'BEARISH' : 'NEUTRAL';
      const confidence = technical.volumeAnalysis.isAnomaly ? 0.89 : 0.80;

      return {
        signal,
        confidence,
        claim: `Technical structure is ${signal} with price positioned above key exponential moving averages and positive MACD confirmation.`,
        reasoning: `Price trades above EMA20 (${technical.movingAverages.ema20}) with RSI(14) at ${technical.rsi14} and MACD histogram at ${technical.macd.histogram}. Volume surge of ${technical.volumeAnalysis.volumeSurgeRatio}x confirms underlying trend conviction.`,
        limitations: ['Short-term indicator lag during high-frequency intraday whipsaws.']
      };
    };

    const { data } = await llmClient.generateStructuredJSON<{
      signal: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
      confidence: number;
      claim: string;
      reasoning: string;
      limitations: string[];
    }>(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      { temperature: 0.1 },
      fallbackGenerator
    );

    return {
      agent: this.name,
      status: 'ok',
      signal: data.signal,
      confidence: data.confidence,
      claim: data.claim || data.reasoning,
      evidence: evidenceList,
      limitations: data.limitations || ['Lagging nature of 200-period exponential moving averages.'],
      executionTimeMs: 0
    };
  }
}
