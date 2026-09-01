import { IMarketDataProvider } from './interfaces/IMarketDataProvider';
import { HardcodedMarketProvider } from './providers/hardcoded-market.provider';
import { YahooFinanceMarketProvider } from './providers/yahoo-finance.provider';
import { UpstoxProvider } from './providers/upstox.provider';

/**
 * Market Provider Factory (Single Responsibility & Open/Closed Principle).
 * Automatically provides real-time Live Market Data via Yahoo Finance (zero-key)
 * or Upstox V3 WebSocket Feed (if UPSTOX_ACCESS_TOKEN is configured).
 */
export class UpstoxMarketFactory {
  public static createProvider(): IMarketDataProvider {
    const upstoxToken = process.env.UPSTOX_ACCESS_TOKEN?.trim();

    if (upstoxToken) {
      console.log('[MarketFactory] Initializing Upstox V3 Live Feed Provider with configured access token.');
      return new UpstoxProvider({ accessToken: upstoxToken });
    }

    console.log('[MarketFactory] Initializing Yahoo Finance Live Market Provider (Real Live NSE Prices, Zero-Key).');
    return new YahooFinanceMarketProvider();
  }
}

export * from './providers/yahoo-finance.provider';
export * from './providers/hardcoded-market.provider';
export * from './market.data';
export * from './symbol-registry';
export * from './types';
