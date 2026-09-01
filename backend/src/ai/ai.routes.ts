import { Router } from 'express';
import { AIController, aiController as defaultController } from './ai.controller';

/**
 * Factory to create AI Express Router adhering to Dependency Inversion (DIP).
 */
export function createAIRouter(controller: AIController = defaultController): Router {
  const router = Router();

  // Status & Metadata
  router.get('/status', controller.getStatus);
  router.get('/profiles', controller.getProfiles);
  router.get('/portfolio/sample', controller.getSamplePortfolio);

  // Analysis & Streaming
  router.post('/analyze', controller.analyze);
  router.get('/analyze/stream', controller.analyzeStream);

  // Personalization Comparison Demo (Section 22 & 38)
  router.post('/compare-profiles', controller.compareProfiles);
  router.get('/compare-profiles', controller.compareProfiles);

  return router;
}

export const aiRouter = createAIRouter();
