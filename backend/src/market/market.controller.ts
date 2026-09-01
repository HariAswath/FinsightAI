import { Request, Response } from 'express';
import { MarketService } from './market.service';
import { symbolRegistry } from './symbol-registry';

/**
 * Controller for Market API endpoints (Single Responsibility Principle).
 */
export class MarketController {
  constructor(private marketService: MarketService) {}

  public getQuoteBySymbol = async (req: Request, res: Response): Promise<void> => {
    try {
      const rawSymbol = req.params.symbol;
      const symbolParam = Array.isArray(rawSymbol) ? rawSymbol[0] : rawSymbol;
      if (!symbolParam) {
        res.status(400).json({ error: 'Symbol parameter is required' });
        return;
      }

      const cleanSymbol = symbolParam.toUpperCase().trim();
      await this.marketService.ensureSymbol(cleanSymbol);
      const comprehensive = this.marketService.getComprehensive(cleanSymbol);
      const quote = this.marketService.getQuote(cleanSymbol);

      if (!quote && !comprehensive) {
        res.status(404).json({
          error: `Quote not found for symbol: ${cleanSymbol}`,
          symbol: cleanSymbol,
          availableInstruments: symbolRegistry.getAll().map(i => i.symbol)
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          quote: quote || { symbol: cleanSymbol, ltp: comprehensive?.ltp },
          comprehensive
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Internal server error', message: err.message });
    }
  };

  public getTechnicalBySymbol = async (req: Request, res: Response): Promise<void> => {
    try {
      const rawSymbol = req.params.symbol;
      const symbolParam = Array.isArray(rawSymbol) ? rawSymbol[0] : rawSymbol;
      if (!symbolParam) {
        res.status(400).json({ error: 'Symbol parameter is required' });
        return;
      }

      const cleanSymbol = symbolParam.toUpperCase().trim();
      const technical = this.marketService.getTechnical(cleanSymbol);

      if (!technical) {
        res.status(404).json({ error: `Technical indicators not found for symbol: ${cleanSymbol}` });
        return;
      }

      res.status(200).json({
        success: true,
        symbol: cleanSymbol,
        data: technical
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Internal server error', message: err.message });
    }
  };

  public getFilingsBySymbol = async (req: Request, res: Response): Promise<void> => {
    try {
      const rawSymbol = req.params.symbol;
      const symbolParam = Array.isArray(rawSymbol) ? rawSymbol[0] : rawSymbol;
      if (!symbolParam) {
        res.status(400).json({ error: 'Symbol parameter is required' });
        return;
      }

      const cleanSymbol = symbolParam.toUpperCase().trim();
      const filings = this.marketService.getFilings(cleanSymbol);

      res.status(200).json({
        success: true,
        symbol: cleanSymbol,
        count: filings.length,
        data: filings
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Internal server error', message: err.message });
    }
  };

  public getSignalsBySymbol = async (req: Request, res: Response): Promise<void> => {
    try {
      const rawSymbol = req.params.symbol;
      const symbolParam = Array.isArray(rawSymbol) ? rawSymbol[0] : rawSymbol;
      if (!symbolParam) {
        res.status(400).json({ error: 'Symbol parameter is required' });
        return;
      }

      const cleanSymbol = symbolParam.toUpperCase().trim();
      const signals = this.marketService.getSignals(cleanSymbol);

      res.status(200).json({
        success: true,
        symbol: cleanSymbol,
        count: signals.length,
        data: signals
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Internal server error', message: err.message });
    }
  };

  public getAllQuotes = async (_req: Request, res: Response): Promise<void> => {
    try {
      const quotes = this.marketService.getAllQuotes();
      res.status(200).json({
        success: true,
        count: quotes.length,
        data: quotes
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Internal server error', message: err.message });
    }
  };

  public getStatus = async (_req: Request, res: Response): Promise<void> => {
    try {
      const status = this.marketService.getStatus();
      res.status(200).json({
        success: true,
        data: status
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Internal server error', message: err.message });
    }
  };

  public subscribe = async (req: Request, res: Response): Promise<void> => {
    try {
      const { symbols, mode } = req.body;
      if (!Array.isArray(symbols) || symbols.length === 0) {
        res.status(400).json({ error: 'Body must include an array of symbols' });
        return;
      }

      const result = await this.marketService.subscribeSymbols(symbols, mode || 'full');
      res.status(200).json({
        success: true,
        message: `Successfully subscribed to ${result.subscribed.length} instruments`,
        data: result
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Subscription failed', message: err.message });
    }
  };

  public getInstruments = async (_req: Request, res: Response): Promise<void> => {
    try {
      const instruments = symbolRegistry.getAll();
      res.status(200).json({
        success: true,
        count: instruments.length,
        data: instruments
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Internal server error', message: err.message });
    }
  };
}
