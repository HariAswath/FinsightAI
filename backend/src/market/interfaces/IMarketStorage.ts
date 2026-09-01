import { MarketQuote } from '../types';

/**
 * Contract for Market Quote storage / caching.
 * Supports thread-safe in-memory, Redis, or persistent implementations.
 */
export interface IMarketStorage {
  /**
   * Saves or updates a quote in storage
   */
  setQuote(key: string, quote: MarketQuote): void;

  /**
   * Retrieves a quote by symbol or instrument key
   */
  getQuote(keyOrSymbol: string): MarketQuote | undefined;

  /**
   * Retrieves all currently cached quotes
   */
  getAllQuotes(): MarketQuote[];

  /**
   * Checks if a symbol or instrument key exists in cache
   */
  has(keyOrSymbol: string): boolean;

  /**
   * Clears all quotes from storage
   */
  clear(): void;

  /**
   * Total number of cached symbols
   */
  size(): number;
}
