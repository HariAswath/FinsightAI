import { MarketFeedMode, MarketFeedStatus, MarketQuote, QuoteListener, ErrorListener, StatusListener } from '../types';

/**
 * Interface for Market Data Providers (e.g. Upstox, Mock, Zerodha)
 * Adheres to Open/Closed Principle (OCP) and Liskov Substitution Principle (LSP).
 */
export interface IMarketDataProvider {
  readonly name: string;
  
  /**
   * Initializes the connection to the data provider
   */
  connect(): Promise<void>;
  
  /**
   * Disconnects from the data provider
   */
  disconnect(): Promise<void>;
  
  /**
   * Subscribes to one or more instrument keys
   */
  subscribe(instrumentKeys: string[], mode?: MarketFeedMode): Promise<void>;
  
  /**
   * Unsubscribes from instrument keys
   */
  unsubscribe(instrumentKeys: string[]): Promise<void>;
  
  /**
   * Registers a callback for incoming market quotes
   */
  onQuote(listener: QuoteListener): () => void;
  
  /**
   * Registers a callback for provider error events
   */
  onError(listener: ErrorListener): () => void;
  
  /**
   * Registers a callback for connection status changes
   */
  onStatusChange(listener: StatusListener): () => void;
  
  /**
   * Returns current health and subscription status
   */
  getStatus(): MarketFeedStatus;
}
