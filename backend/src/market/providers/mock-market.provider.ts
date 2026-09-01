import { IMarketDataProvider } from '../interfaces/IMarketDataProvider';
import { symbolRegistry } from '../symbol-registry';
import { ErrorListener, MarketFeedMode, MarketFeedStatus, MarketQuote, QuoteListener, StatusListener } from '../types';

/**
 * Mock & Simulation Market Data Provider.
 * Implements IMarketDataProvider (Liskov Substitution Principle).
 * Automatically generates realistic tick fluctuations for NSE instruments when live Upstox token is offline.
 */
export class MockMarketProvider implements IMarketDataProvider {
  public readonly name = 'MockSimulationFeed';

  private isConnected = false;
  private subscribedKeys = new Set<string>();
  private totalTicksReceived = 0;
  private lastTickTimestamp?: number;
  private simulationTimer: NodeJS.Timeout | null = null;

  private quoteListeners = new Set<QuoteListener>();
  private errorListeners = new Set<ErrorListener>();
  private statusListeners = new Set<StatusListener>();

  // Base price reference for Indian stocks
  private basePrices: Record<string, { base: number; close: number }> = {
    RELIANCE: { base: 2985.50, close: 2970.00 },
    HDFCBANK: { base: 1645.20, close: 1650.00 },
    TCS: { base: 4180.00, close: 4165.50 },
    INFY: { base: 1820.75, close: 1810.00 },
    ICICIBANK: { base: 1210.00, close: 1205.00 },
    SBIN: { base: 825.40, close: 830.00 },
    BHARTIARTL: { base: 1540.00, close: 1532.00 },
    ITC: { base: 485.60, close: 488.00 },
    TATAMOTORS: { base: 1045.00, close: 1040.00 },
    NIFTY50: { base: 24350.00, close: 24280.00 },
    BANKNIFTY: { base: 51200.00, close: 51050.00 }
  };

  private currentPrices: Map<string, number> = new Map();

  constructor() {
    for (const [sym, data] of Object.entries(this.basePrices)) {
      this.currentPrices.set(sym, data.base);
    }
  }

  public async connect(): Promise<void> {
    this.isConnected = true;
    console.log('[MockMarketProvider] Connected to Mock/Simulated Market Tick Engine.');
    this.startSimulation();
    this.notifyStatus();
  }

  public async disconnect(): Promise<void> {
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
      this.simulationTimer = null;
    }
    this.isConnected = false;
    this.notifyStatus();
    console.log('[MockMarketProvider] Disconnected.');
  }

  public async subscribe(instrumentKeys: string[], mode: MarketFeedMode = 'full'): Promise<void> {
    for (const key of instrumentKeys) {
      this.subscribedKeys.add(key);
    }
    console.log(`[MockMarketProvider] Subscribed to ${instrumentKeys.length} instruments (mode: ${mode})`);
    // Emit initial quote immediately
    for (const key of instrumentKeys) {
      this.emitTickForKey(key);
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

  private startSimulation(): void {
    if (this.simulationTimer) clearInterval(this.simulationTimer);

    // Generate randomized tick stream every 500ms
    this.simulationTimer = setInterval(() => {
      if (!this.isConnected || this.subscribedKeys.size === 0) return;

      const keysArray = Array.from(this.subscribedKeys);
      // Pick 1 to 3 random instruments per interval
      const count = Math.min(keysArray.length, Math.floor(Math.random() * 3) + 1);
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * keysArray.length);
        const randomKey = keysArray[randomIndex];
        this.emitTickForKey(randomKey);
      }
    }, 800);
  }

  private emitTickForKey(instrumentKey: string): void {
    const symbol = symbolRegistry.resolveSymbol(instrumentKey).toUpperCase();
    const info = symbolRegistry.getBySymbol(symbol);
    const baseInfo = this.basePrices[symbol] || { base: 1000, close: 1000 };

    let currentPrice = this.currentPrices.get(symbol) || baseInfo.base;
    // Small random walk delta: between -0.3% and +0.3%
    const deltaPercent = (Math.random() - 0.49) * 0.005;
    currentPrice = Number((currentPrice * (1 + deltaPercent)).toFixed(2));
    this.currentPrices.set(symbol, currentPrice);

    const closePrice = baseInfo.close;
    const change = Number((currentPrice - closePrice).toFixed(2));
    const changePercent = Number(((change / closePrice) * 100).toFixed(2));
    const now = Date.now();

    const quote: MarketQuote = {
      symbol,
      instrumentKey: info ? info.instrumentKey : instrumentKey,
      ltp: currentPrice,
      closePrice,
      openPrice: baseInfo.close,
      highPrice: Number((Math.max(currentPrice, baseInfo.base * 1.015)).toFixed(2)),
      lowPrice: Number((Math.min(currentPrice, baseInfo.base * 0.985)).toFixed(2)),
      change,
      changePercent,
      volume: Math.floor(Math.random() * 50000) + 100000,
      lastTradedTime: now,
      lastTradedQuantity: Math.floor(Math.random() * 100) + 1,
      totalBuyQuantity: 450000,
      totalSellQuantity: 420000,
      depth: [
        { bidQuantity: 500, bidPrice: Number((currentPrice - 0.05).toFixed(2)), askQuantity: 300, askPrice: Number((currentPrice + 0.05).toFixed(2)) },
        { bidQuantity: 1200, bidPrice: Number((currentPrice - 0.10).toFixed(2)), askQuantity: 900, askPrice: Number((currentPrice + 0.10).toFixed(2)) }
      ],
      updatedAt: new Date(now).toISOString()
    };

    this.totalTicksReceived++;
    this.lastTickTimestamp = now;

    for (const listener of this.quoteListeners) {
      try {
        listener(quote);
      } catch (e) {
        console.error('[MockMarketProvider] Listener error:', e);
      }
    }
  }

  private notifyStatus(): void {
    const status = this.getStatus();
    for (const listener of this.statusListeners) {
      try {
        listener(status);
      } catch (e) {
        console.error('[MockMarketProvider] Status listener error:', e);
      }
    }
  }
}
