import axios from 'axios';
import WebSocket from 'ws';
import { IMarketDataProvider } from '../interfaces/IMarketDataProvider';
import { UpstoxProtoDecoder } from '../proto/upstox-decoder';
import { ErrorListener, MarketFeedMode, MarketFeedStatus, MarketQuote, QuoteListener, StatusListener } from '../types';

export interface UpstoxProviderConfig {
  accessToken?: string;
  authApiUrl?: string;
  defaultMode?: MarketFeedMode;
  autoReconnect?: boolean;
  reconnectIntervalMs?: number;
}

/**
 * Concrete Upstox V3 Market Data Feed WebSocket Provider.
 * Implements IMarketDataProvider adhering to SRP & LSP.
 */
export class UpstoxProvider implements IMarketDataProvider {
  public readonly name = 'UpstoxV3Feed';
  
  private ws: WebSocket | null = null;
  private decoder: UpstoxProtoDecoder;
  private accessToken: string;
  private authApiUrl: string;
  private defaultMode: MarketFeedMode;
  private autoReconnect: boolean;
  private reconnectIntervalMs: number;

  private isConnected = false;
  private subscribedKeys = new Set<string>();
  private totalTicksReceived = 0;
  private lastTickTimestamp?: number;
  private errorMessage?: string;

  private quoteListeners = new Set<QuoteListener>();
  private errorListeners = new Set<ErrorListener>();
  private statusListeners = new Set<StatusListener>();

  private reconnectTimer: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;

  constructor(config: UpstoxProviderConfig = {}) {
    this.accessToken = config.accessToken || process.env.UPSTOX_ACCESS_TOKEN || '';
    this.authApiUrl = config.authApiUrl || 'https://api.upstox.com/v2/feed/market-data-feed/authorize';
    this.defaultMode = config.defaultMode || 'full';
    this.autoReconnect = config.autoReconnect ?? true;
    this.reconnectIntervalMs = config.reconnectIntervalMs ?? 5000;
    this.decoder = new UpstoxProtoDecoder();
  }

  public setAccessToken(token: string): void {
    this.accessToken = token;
  }

  public async connect(): Promise<void> {
    if (!this.accessToken) {
      const err = new Error('Upstox Access Token is missing. Please set UPSTOX_ACCESS_TOKEN in .env or call setAccessToken().');
      this.errorMessage = err.message;
      this.notifyError(err);
      throw err;
    }

    try {
      await this.decoder.ensureLoaded();
      const wsUrl = await this.getAuthorizedWebSocketUrl();
      await this.initWebSocket(wsUrl);
    } catch (err: any) {
      this.errorMessage = err.message || 'Connection failed';
      this.notifyError(err);
      this.scheduleReconnect();
      throw err;
    }
  }

  public async disconnect(): Promise<void> {
    this.autoReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.pingInterval) clearInterval(this.pingInterval);

    if (this.ws) {
      this.ws.removeAllListeners();
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
    this.notifyStatus();
  }

  public async subscribe(instrumentKeys: string[], mode: MarketFeedMode = this.defaultMode): Promise<void> {
    const validKeys = instrumentKeys.filter(k => Boolean(k?.trim()));
    if (!validKeys.length) return;

    for (const key of validKeys) {
      this.subscribedKeys.add(key);
    }

    if (this.isConnected && this.ws && this.ws.readyState === WebSocket.OPEN) {
      const payload = {
        guid: `sub_${Date.now()}`,
        method: 'sub',
        data: {
          mode: mode === 'option_greeks' ? 'full' : mode,
          instrumentKeys: validKeys
        }
      };
      this.ws.send(JSON.stringify(payload));
      console.log(`[UpstoxProvider] Subscribed to ${validKeys.length} instruments (mode: ${mode})`);
    }
  }

  public async unsubscribe(instrumentKeys: string[]): Promise<void> {
    const validKeys = instrumentKeys.filter(k => Boolean(k?.trim()));
    if (!validKeys.length) return;

    for (const key of validKeys) {
      this.subscribedKeys.delete(key);
    }

    if (this.isConnected && this.ws && this.ws.readyState === WebSocket.OPEN) {
      const payload = {
        guid: `unsub_${Date.now()}`,
        method: 'unsub',
        data: {
          instrumentKeys: validKeys
        }
      };
      this.ws.send(JSON.stringify(payload));
      console.log(`[UpstoxProvider] Unsubscribed from ${validKeys.length} instruments`);
    }
  }

  public onQuote(listener: QuoteListener): () => void {
    this.quoteListeners.add(listener);
    return () => this.quoteListeners.delete(listener);
  }

  public onError(listener: ErrorListener): () => void {
    this.errorListeners.add(listener);
    return () => this.errorListeners.delete(listener);
  }

  public onStatusChange(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  public getStatus(): MarketFeedStatus {
    return {
      provider: this.name,
      isConnected: this.isConnected,
      activeSubscriptionsCount: this.subscribedKeys.size,
      subscribedKeys: Array.from(this.subscribedKeys),
      lastTickTimestamp: this.lastTickTimestamp,
      totalTicksReceived: this.totalTicksReceived,
      mode: this.isConnected ? 'live' : 'disconnected',
      errorMessage: this.errorMessage
    };
  }

  private async getAuthorizedWebSocketUrl(): Promise<string> {
    console.log('[UpstoxProvider] Requesting authorized WebSocket redirect URI from Upstox API...');
    const response = await axios.get(this.authApiUrl, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      },
      timeout: 10000
    });

    const redirectUri = response.data?.data?.authorizedRedirectUri;
    if (!redirectUri) {
      throw new Error(`Upstox authorize response did not return authorizedRedirectUri: ${JSON.stringify(response.data)}`);
    }

    return redirectUri;
  }

  private async initWebSocket(wsUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('[UpstoxProvider] Connecting to WebSocket feed URL...');
      this.ws = new WebSocket(wsUrl, {
        headers: {
          'Api-Version': '2.0'
        },
        followRedirects: true
      });

      this.ws.on('open', () => {
        console.log('[UpstoxProvider] Upstox V3 WebSocket connected successfully.');
        this.isConnected = true;
        this.errorMessage = undefined;
        this.notifyStatus();

        // Resubscribe existing keys if any
        if (this.subscribedKeys.size > 0) {
          this.subscribe(Array.from(this.subscribedKeys), this.defaultMode);
        }

        resolve();
      });

      this.ws.on('message', (data: WebSocket.Data) => {
        try {
          if (Buffer.isBuffer(data) || data instanceof Uint8Array || data instanceof ArrayBuffer) {
            const quotes = this.decoder.decode(data as any);
            this.totalTicksReceived += quotes.length;
            this.lastTickTimestamp = Date.now();

            for (const quote of quotes) {
              this.notifyQuote(quote);
            }
          } else if (typeof data === 'string') {
            // Might be JSON heartbeat/control message
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'ping' || parsed.type === 'heartbeat') {
                // Heartbeat
              }
            } catch {
              // Ignore non-json text
            }
          }
        } catch (decodeErr: any) {
          console.error('[UpstoxProvider] Error decoding protobuf tick message:', decodeErr);
        }
      });

      this.ws.on('error', (err: Error) => {
        console.error('[UpstoxProvider] WebSocket error:', err.message);
        this.errorMessage = err.message;
        this.notifyError(err);
        if (!this.isConnected) {
          reject(err);
        }
      });

      this.ws.on('close', (code, reason) => {
        console.warn(`[UpstoxProvider] WebSocket closed (code: ${code}, reason: ${reason.toString()})`);
        this.isConnected = false;
        this.notifyStatus();
        this.scheduleReconnect();
      });
    });
  }

  private scheduleReconnect(): void {
    if (!this.autoReconnect || this.reconnectTimer) return;

    console.log(`[UpstoxProvider] Scheduling reconnect in ${this.reconnectIntervalMs / 1000}s...`);
    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      try {
        console.log('[UpstoxProvider] Attempting reconnect...');
        await this.connect();
      } catch (err: any) {
        console.warn('[UpstoxProvider] Reconnect failed:', err.message);
      }
    }, this.reconnectIntervalMs);
  }

  private notifyQuote(quote: MarketQuote): void {
    for (const listener of this.quoteListeners) {
      try {
        listener(quote);
      } catch (e) {
        console.error('[UpstoxProvider] Quote listener exception:', e);
      }
    }
  }

  private notifyError(err: Error): void {
    for (const listener of this.errorListeners) {
      try {
        listener(err);
      } catch (e) {
        console.error('[UpstoxProvider] Error listener exception:', e);
      }
    }
  }

  private notifyStatus(): void {
    const status = this.getStatus();
    for (const listener of this.statusListeners) {
      try {
        listener(status);
      } catch (e) {
        console.error('[UpstoxProvider] Status listener exception:', e);
      }
    }
  }
}
