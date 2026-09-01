import { Router } from 'express';
import { MarketController } from './market.controller';
import { MarketService, marketService as defaultService } from './market.service';

/**
 * Factory to create market express router.
 * Adheres to Dependency Inversion (DIP).
 */
export function createMarketRouter(service: MarketService = defaultService): Router {
  const router = Router();
  const controller = new MarketController(service);

  // Status & Metadata
  router.get('/status', controller.getStatus);
  router.get('/instruments', controller.getInstruments);

  // Quotes & Multi-Dimensional Data
  router.get('/quotes', controller.getAllQuotes);
  router.get('/:symbol/technical', controller.getTechnicalBySymbol);
  router.get('/:symbol/filings', controller.getFilingsBySymbol);
  router.get('/:symbol/signals', controller.getSignalsBySymbol);
  router.get('/:symbol', controller.getQuoteBySymbol);

  // Actions
  router.post('/subscribe', controller.subscribe);

  return router;
}

export const marketRouter = createMarketRouter();
