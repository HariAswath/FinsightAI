import { IMarketDataProvider } from './interfaces/IMarketDataProvider';
import { HardcodedMarketProvider } from './providers/hardcoded-market.provider';

/**
 * Market Provider Factory (Single Responsibility & Open/Closed Principle).
 * Returns Hardcoded & Simulation engine for rock-solid standalone operation with zero external keys needed.
 */
export class UpstoxMarketFactory {
  public static createProvider(): IMarketDataProvider {
    console.log('[MarketFactory] Initializing Hardcoded Market Provider with rich Indian Equity dataset.');
    return new HardcodedMarketProvider();
  }
}

export * from './providers/hardcoded-market.provider';
export * from './market.data';
export * from './symbol-registry';
export * from './types';
