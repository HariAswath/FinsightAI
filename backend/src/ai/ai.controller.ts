import { Request, Response } from 'express';
import { aiService, AIService } from './ai.service';
import { llmClient } from './llm/llm.client';
import { ragStore } from './rag/vector.store';
import { AgentTraceEvent } from './types/agent.types';

/**
 * AI Controller handling HTTP endpoints and real-time Server-Sent Events (SSE) streaming.
 * Adheres to Single Responsibility Principle (SRP).
 */
export class AIController {
  private service: AIService;

  constructor(service: AIService = aiService) {
    this.service = service;
  }

  public analyze = async (req: Request, res: Response): Promise<void> => {
    try {
      const { symbol, profileId, userProfile, portfolio, simulateFailure } = req.body;

      if (!symbol || typeof symbol !== 'string') {
        res.status(400).json({ error: 'Missing required "symbol" parameter in request body.' });
        return;
      }

      const recommendation = await this.service.analyze({
        symbol: symbol.trim().toUpperCase(),
        profileId,
        userProfile,
        portfolio,
        simulateFailure
      });

      res.status(200).json(recommendation);
    } catch (err: any) {
      console.error('[AIController:analyze] Error:', err);
      res.status(500).json({ error: 'Failed to analyze equity', message: err.message });
    }
  };

  /**
   * Real-time Server-Sent Events (SSE) stream for live Glass Box UI observation.
   */
  public analyzeStream = async (req: Request, res: Response): Promise<void> => {
    const symbol = (req.query.symbol as string || req.body?.symbol || '').trim().toUpperCase();
    const profileId = (req.query.profileId as string || 'moderate').toLowerCase();
    const simulateFailure = req.query.simulateFailure as any;

    if (!symbol) {
      res.status(400).json({ error: 'Missing "symbol" query parameter.' });
      return;
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const sendSSE = (eventType: string, payload: any) => {
      try {
        res.write(`event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`);
      } catch (err) {
        // Stream may have closed
      }
    };

    sendSSE('INIT', { symbol, profileId, timestamp: new Date().toISOString() });

    try {
      const recommendation = await this.service.analyze({
        symbol,
        profileId,
        simulateFailure,
        onTrace: (trace: AgentTraceEvent) => {
          sendSSE('TRACE', trace);
        }
      });

      sendSSE('RECOMMENDATION', recommendation);
      sendSSE('DONE', { message: 'Analysis complete', totalLatencyMs: recommendation.metadata.totalLatencyMs });
      res.end();
    } catch (err: any) {
      console.error('[AIController:analyzeStream] Stream error:', err);
      sendSSE('ERROR', { error: err.message });
      res.end();
    }
  };

  public compareProfiles = async (req: Request, res: Response): Promise<void> => {
    try {
      const symbol = (req.body?.symbol || req.query?.symbol as string || 'RELIANCE').trim().toUpperCase();

      const comparison = await this.service.compareProfiles(symbol);
      res.status(200).json(comparison);
    } catch (err: any) {
      console.error('[AIController:compareProfiles] Error:', err);
      res.status(500).json({ error: 'Failed to compare profiles', message: err.message });
    }
  };

  public getProfiles = (_req: Request, res: Response): void => {
    res.status(200).json({
      profiles: this.service.getPresetProfiles()
    });
  };

  public getSamplePortfolio = (_req: Request, res: Response): void => {
    res.status(200).json({
      portfolio: this.service.getSamplePortfolio()
    });
  };

  public getStatus = (_req: Request, res: Response): void => {
    res.status(200).json({
      service: 'FinsightAI Multi-Agent Subsystem',
      status: 'operational',
      provider: llmClient.getActiveProviderName(),
      hasActiveKey: llmClient.hasActiveKey(),
      groqConfigured: Boolean(process.env.GROQ_API_KEY),
      openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
      agentsAvailable: ['Fundamentals', 'Technical', 'Sentiment'],
      orchestration: 'Parallel (Promise.allSettled)',
      supportedProfiles: Object.keys(this.service.getPresetProfiles())
    });
  };
}

export const aiController = new AIController();
