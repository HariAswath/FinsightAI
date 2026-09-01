import { IMarketDataProvider } from './interfaces/IMarketDataProvider';
import { IMarketStorage } from './interfaces/IMarketStorage';
import { IMarketBroadcaster } from './interfaces/IMarketBroadcaster';
import { InMemoryMarketStorage } from './storage/in-memory-market.storage';
import { UpstoxMarketFactory } from './upstox';
import { HardcodedMarketProvider } from './providers/hardcoded-market.provider';
import { MarketFeedMode, MarketFeedStatus, MarketQuote } from './types';
import { symbolRegistry } from './symbol-registry';
import { ComprehensiveEquityData, RegulatoryFilingDoc, TechnicalAnalysis, MarketSignalItem } from './market.data';

/**
 * Market Service - Coordinates in-memory caching Map<symbol, latestQuote>,
 * technical indicators, SEBI filings, and real-time broadcasting.
 * Adheres to Dependency Inversion Principle (DIP) and Single Responsibility Principle (SRP).
 */
export class MarketService {
  private provider: IMarketDataProvider;
  private storage: IMarketStorage;
  private broadcaster: IMarketBroadcaster | null = null;
  private isInitialized = false;

  private defaultSymbols = [
    'RELIANCE', 'HDFCBANK', 'TCS', 'INFY', 'ICICIBANK', 'SBIN', 'BHARTIARTL', 'ITC',
    'HINDUNILVR', 'LT', 'BAJFINANCE', 'MARUTI', 'SUNPHARMA', 'KOTAKBANK', 'AXISBANK',
    'TITAN', 'ADANIENT', 'ADANIPORTS', 'WIPRO', 'HCLTECH', 'ASIANPAINT', 'NTPC',
    'POWERGRID', 'TATASTEEL', 'TATAMOTORS', 'NIFTY50', 'BANKNIFTY'
  ];

  constructor(
    provider?: IMarketDataProvider,
    storage?: IMarketStorage,
    broadcaster?: IMarketBroadcaster
  ) {
    this.storage = storage || new InMemoryMarketStorage();
    this.provider = provider || UpstoxMarketFactory.createProvider();
    this.broadcaster = broadcaster || null;

    this.setupListeners();
  }

  public setBroadcaster(broadcaster: IMarketBroadcaster): void {
    this.broadcaster = broadcaster;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log(`[MarketService] Initializing with provider: ${this.provider.name}...`);
      await this.provider.connect();

      const keys = this.defaultSymbols.map(sym => symbolRegistry.resolveKey(sym));
      await this.provider.subscribe(keys, 'full');

      this.isInitialized = true;
      console.log(`[MarketService] Initialized. Subscribed to default watchlist: ${this.defaultSymbols.join(', ')}`);
    } catch (err: any) {
      console.error('[MarketService] Failed to initialize market service:', err.message);
    }
  }

  public async subscribeSymbols(symbols: string[], mode: MarketFeedMode = 'full'): Promise<{ subscribed: string[]; instrumentKeys: string[] }> {
    const instrumentKeys = symbols.map(sym => symbolRegistry.resolveKey(sym.toUpperCase()));
    await this.provider.subscribe(instrumentKeys, mode);
    return {
      subscribed: symbols.map(s => s.toUpperCase()),
      instrumentKeys
    };
  }

  public async ensureSymbol(symbol: string): Promise<void> {
    const cleanSymbol = symbol.toUpperCase().trim();
    if (!this.storage.getQuote(cleanSymbol)) {
      const key = symbolRegistry.resolveKey(cleanSymbol);
      await this.provider.subscribe([key], 'full');
    }
  }

  public getQuote(symbolOrKey: string): MarketQuote | undefined {
    return this.storage.getQuote(symbolOrKey);
  }

  public getAllQuotes(): MarketQuote[] {
    return this.storage.getAllQuotes();
  }

  public getComprehensive(symbol: string): ComprehensiveEquityData | undefined {
    if (typeof (this.provider as any).getComprehensiveData === 'function') {
      return (this.provider as any).getComprehensiveData(symbol);
    }
    return undefined;
  }

  public getTechnical(symbol: string): TechnicalAnalysis | undefined {
    const comp = this.getComprehensive(symbol);
    return comp?.technical;
  }

  public getFilings(symbol: string): RegulatoryFilingDoc[] {
    const comp = this.getComprehensive(symbol);
    return comp?.filings || [];
  }

  public getSignals(symbol: string): MarketSignalItem[] {
    const comp = this.getComprehensive(symbol);
    return comp?.signals || [];
  }

  public getStatus(): MarketFeedStatus & { totalCachedSymbols: number; connectedClients: number } {
    const baseStatus = this.provider.getStatus();
    return {
      ...baseStatus,
      totalCachedSymbols: this.storage.size(),
      connectedClients: this.broadcaster ? this.broadcaster.getConnectedClientCount() : 0
    };
  }

  private setupListeners(): void {
    this.provider.onQuote((quote: MarketQuote) => {
      this.storage.setQuote(quote.instrumentKey, quote);

      if (this.broadcaster) {
        this.broadcaster.broadcastQuote(quote);
      }
    });

    this.provider.onStatusChange((status: MarketFeedStatus) => {
      if (this.broadcaster) {
        this.broadcaster.broadcastStatus(status);
      }
    });

    this.provider.onError((err: Error) => {
      console.error(`[MarketService] Provider error [${this.provider.name}]:`, err.message);
    });
  }
}

export const marketService = new MarketService();
