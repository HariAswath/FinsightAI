import { IMarketDataProvider } from '../interfaces/IMarketDataProvider';
import { HARDCODED_MARKET_DATA, ComprehensiveEquityData } from '../market.data';
import { symbolRegistry } from '../symbol-registry';
import { ErrorListener, MarketFeedMode, MarketFeedStatus, MarketQuote, QuoteListener, StatusListener } from '../types';

/**
 * Hardcoded and Simulation Market Data Provider.
 * Implements IMarketDataProvider adhering to Open/Closed (OCP) and Liskov Substitution (LSP) principles.
 * Delivers instant high-fidelity quotes, technicals, filings, and subtle live tick variations without external API dependencies.
 */
export class HardcodedMarketProvider implements IMarketDataProvider {
  public readonly name = 'HardcodedMarketEngine';

  private isConnected = false;
  private subscribedKeys = new Set<string>();
  private totalTicksReceived = 0;
  private lastTickTimestamp?: number;
  private simulationInterval: NodeJS.Timeout | null = null;

  private quoteListeners = new Set<QuoteListener>();
  private errorListeners = new Set<ErrorListener>();
  private statusListeners = new Set<StatusListener>();

  // In-memory working copy of equity data
  private marketData: Map<string, ComprehensiveEquityData> = new Map();

  constructor() {
    for (const [symbol, data] of Object.entries(HARDCODED_MARKET_DATA)) {
      this.marketData.set(symbol.toUpperCase(), JSON.parse(JSON.stringify(data)));
    }
  }

  public async connect(): Promise<void> {
    this.isConnected = true;
    console.log('[HardcodedMarketProvider] Connected. Loaded', this.marketData.size, 'instruments into memory.');
    this.startTickGenerator();
    this.notifyStatus();
  }

  public async disconnect(): Promise<void> {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    this.isConnected = false;
    this.notifyStatus();
  }

  public async subscribe(instrumentKeys: string[], mode: MarketFeedMode = 'full'): Promise<void> {
    for (const key of instrumentKeys) {
      this.subscribedKeys.add(key);
      this.emitQuoteForKey(key);
    }
  }

  public async unsubscribe(instrumentKeys: string[]): Promise<void> {
    for (const key of instrumentKeys) {
      this.subscribedKeys.delete(key);
    }
  }

  public onQuote(listener: QuoteListener): () => void {
    this.quoteListeners.add(listener);
    return () => this.quoteListeners.delete(listener);
  }

  public onError(listener: ErrorListener): () => void {
    this.errorListeners.add(listener);
    return () => this.errorListeners.delete(listener);
  }

  public onStatusChange(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  public getStatus(): MarketFeedStatus {
    return {
      provider: this.name,
      isConnected: this.isConnected,
      activeSubscriptionsCount: this.subscribedKeys.size,
      subscribedKeys: Array.from(this.subscribedKeys),
      lastTickTimestamp: this.lastTickTimestamp,
      totalTicksReceived: this.totalTicksReceived,
      mode: 'mock'
    };
  }

  public getComprehensiveData(symbol: string): ComprehensiveEquityData | undefined {
    return this.marketData.get(symbol.toUpperCase().trim());
  }

  public getAllComprehensiveData(): ComprehensiveEquityData[] {
    return Array.from(this.marketData.values());
  }

  private startTickGenerator(): void {
    if (this.simulationInterval) clearInterval(this.simulationInterval);

    // Realistic micro-fluctuations every 1 second
    this.simulationInterval = setInterval(() => {
      if (!this.isConnected || this.subscribedKeys.size === 0) return;

      const keys = Array.from(this.subscribedKeys);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      this.emitQuoteForKey(randomKey, true);
    }, 1000);
  }

  private emitQuoteForKey(instrumentKey: string, mutatePrice = false): void {
    const symbol = symbolRegistry.resolveSymbol(instrumentKey).toUpperCase();
    const item = this.marketData.get(symbol);
    if (!item) return;

    if (mutatePrice) {
      // Small tick delta between -0.15% and +0.15%
      const delta = (Math.random() - 0.49) * 0.003;
      item.ltp = Number((item.ltp * (1 + delta)).toFixed(2));
      item.change = Number((item.ltp - item.closePrice).toFixed(2));
      item.changePercent = Number(((item.change / item.closePrice) * 100).toFixed(2));
      item.highPrice = Math.max(item.highPrice, item.ltp);
      item.lowPrice = Math.min(item.lowPrice, item.ltp);
      item.volume += Math.floor(Math.random() * 500) + 50;
      item.updatedAt = new Date().toISOString();
    }

    const info = symbolRegistry.getBySymbol(symbol);
    const quote: MarketQuote = {
      symbol: item.symbol,
      instrumentKey: info ? info.instrumentKey : instrumentKey,
      ltp: item.ltp,
      closePrice: item.closePrice,
      openPrice: item.openPrice,
      highPrice: item.highPrice,
      lowPrice: item.lowPrice,
      change: item.change,
      changePercent: item.changePercent,
      volume: item.volume,
      lastTradedTime: Date.now(),
      depth: item.depth,
      updatedAt: item.updatedAt
    };

    this.totalTicksReceived++;
    this.lastTickTimestamp = Date.now();

    for (const listener of this.quoteListeners) {
      try {
        listener(quote);
      } catch (e) {
        console.error('[HardcodedMarketProvider] Quote listener error:', e);
      }
    }
  }

  private notifyStatus(): void {
    const status = this.getStatus();
    for (const listener of this.statusListeners) {
      try {
        listener(status);
      } catch (e) {
        console.error('[HardcodedMarketProvider] Status listener error:', e);
      }
    }
  }
}
