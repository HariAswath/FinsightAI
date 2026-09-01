import { IMarketStorage } from '../interfaces/IMarketStorage';
import { MarketQuote } from '../types';
import { symbolRegistry } from '../symbol-registry';

/**
 * High-performance In-Memory Map storage for Market Quotes.
 * Implements IMarketStorage (Single Responsibility & Interface Segregation).
 */
export class InMemoryMarketStorage implements IMarketStorage {
  private quotes = new Map<string, MarketQuote>();

  public setQuote(key: string, quote: MarketQuote): void {
    const symbol = symbolRegistry.resolveSymbol(quote.symbol || key);
    const instrumentKey = quote.instrumentKey || symbolRegistry.resolveKey(symbol);
    
    const normalizedQuote: MarketQuote = {
      ...quote,
      symbol,
      instrumentKey
    };

    // Store by instrument key as primary
    this.quotes.set(instrumentKey, normalizedQuote);
    // Also store by uppercase symbol for fast O(1) ticker lookups
    this.quotes.set(symbol.toUpperCase(), normalizedQuote);
  }

  public getQuote(keyOrSymbol: string): MarketQuote | undefined {
    const trimmed = keyOrSymbol.trim();
    return this.quotes.get(trimmed) || this.quotes.get(trimmed.toUpperCase());
  }

  public getAllQuotes(): MarketQuote[] {
    // Return unique quotes based on instrumentKey
    const unique = new Map<string, MarketQuote>();
    for (const quote of this.quotes.values()) {
      unique.set(quote.instrumentKey, quote);
    }
    return Array.from(unique.values());
  }

  public has(keyOrSymbol: string): boolean {
    const trimmed = keyOrSymbol.trim();
    return this.quotes.has(trimmed) || this.quotes.has(trimmed.toUpperCase());
  }

  public clear(): void {
    this.quotes.clear();
  }

  public size(): number {
    return this.getAllQuotes().length;
  }
}
