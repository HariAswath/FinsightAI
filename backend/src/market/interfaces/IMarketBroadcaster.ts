import { MarketQuote, MarketFeedStatus } from '../types';

/**
 * Contract for broadcasting live market ticks and status to frontends (e.g. Next.js via WebSocket/SSE).
 */
export interface IMarketBroadcaster {
  broadcastQuote(quote: MarketQuote): void;
  broadcastStatus(status: MarketFeedStatus): void;
  getConnectedClientCount(): number;
}
