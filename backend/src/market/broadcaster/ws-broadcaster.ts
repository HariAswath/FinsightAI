import { WebSocket, WebSocketServer } from 'ws';
import { IMarketBroadcaster } from '../interfaces/IMarketBroadcaster';
import { MarketFeedStatus, MarketQuote } from '../types';

/**
 * WebSocket Broadcaster for Next.js and frontend clients.
 * Implements IMarketBroadcaster (Single Responsibility Principle).
 */
export class WebSocketMarketBroadcaster implements IMarketBroadcaster {
  private wss: WebSocketServer | null = null;
  private clients = new Set<WebSocket>();

  public initialize(wss: WebSocketServer): void {
    this.wss = wss;

    this.wss.on('connection', (ws: WebSocket) => {
      this.clients.add(ws);
      console.log(`[WebSocketBroadcaster] Frontend client connected (Total: ${this.clients.size})`);

      // Send initial welcome/ready message
      try {
        ws.send(JSON.stringify({ type: 'CONNECTED', timestamp: Date.now() }));
      } catch (e) {
        // Ignore initial send error
      }

      ws.on('close', () => {
        this.clients.delete(ws);
        console.log(`[WebSocketBroadcaster] Frontend client disconnected (Remaining: ${this.clients.size})`);
      });

      ws.on('error', (err) => {
        console.warn('[WebSocketBroadcaster] Client socket error:', err.message);
        this.clients.delete(ws);
      });
    });
  }

  public broadcastQuote(quote: MarketQuote): void {
    if (this.clients.size === 0) return;

    const message = JSON.stringify({
      type: 'TICK',
      data: quote
    });

    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(message);
        } catch (e) {
          this.clients.delete(client);
        }
      }
    }
  }

  public broadcastStatus(status: MarketFeedStatus): void {
    if (this.clients.size === 0) return;

    const message = JSON.stringify({
      type: 'STATUS',
      data: status
    });

    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(message);
        } catch (e) {
          this.clients.delete(client);
        }
      }
    }
  }

  public getConnectedClientCount(): number {
    return this.clients.size;
  }
}
