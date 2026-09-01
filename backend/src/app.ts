import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { marketRouter } from './market/market.routes';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }));
  app.use(express.json());

  // Health Check
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'FinsightAI Backend', timestamp: new Date().toISOString() });
  });

  // Market Routes
  app.use('/api/market', marketRouter);

  // Fallback 404
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Endpoint not found', path: req.path });
  });

  // Global Error Handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[GlobalErrorHandler]', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  });

  return app;
}
