import http from 'http';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { createApp } from './app';
import { marketService } from './market/market.service';
import { WebSocketMarketBroadcaster } from './market/broadcaster/ws-broadcaster';

dotenv.config();

const PORT = parseInt(process.env.PORT || '5000', 10);

async function bootstrap() {
  const app = createApp();
  const server = http.createServer(app);

  // Setup WebSocket server on /ws/market for Next.js frontend streaming
  const wss = new WebSocketServer({ server, path: '/ws/market' });
  const broadcaster = new WebSocketMarketBroadcaster();
  broadcaster.initialize(wss);

  // Inject broadcaster into MarketService
  marketService.setBroadcaster(broadcaster);

  // Initialize Market Feed connection (Upstox / Mock fallback)
  await marketService.initialize();

  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 FinsightAI Market Backend Server running on port ${PORT}`);
    console.log(`📡 REST API: http://localhost:${PORT}/api/market/quotes`);
    console.log(`📡 Single Symbol: http://localhost:${PORT}/api/market/RELIANCE`);
    console.log(`⚡ WebSocket Stream: ws://localhost:${PORT}/ws/market`);
    console.log(`====================================================`);
  });

  const shutdown = async () => {
    console.log('\n[Server] Gracefully shutting down...');
    server.close(() => {
      console.log('[Server] HTTP and WebSocket servers closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch((err) => {
  console.error('[Bootstrap] Fatal startup error:', err);
  process.exit(1);
});
