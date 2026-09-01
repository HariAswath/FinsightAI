export type MarketFeedMode = 'ltpc' | 'full' | 'option_greeks';

export interface MarketOHLC {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
}

export interface MarketDepthQuote {
  bidQuantity: number;
  bidPrice: number;
  askQuantity: number;
  askPrice: number;
}

export interface OptionGreeks {
  optionPrice?: number;
  underlyingPrice?: number;
  impliedVolatility?: number;
  delta?: number;
  theta?: number;
  gamma?: number;
  vega?: number;
  rho?: number;
}

export interface MarketQuote {
  symbol: string;
  instrumentKey: string;
  ltp: number;
  closePrice?: number;
  openPrice?: number;
  highPrice?: number;
  lowPrice?: number;
  change?: number;
  changePercent?: number;
  volume?: number;
  lastTradedTime?: number;
  lastTradedQuantity?: number;
  totalBuyQuantity?: number;
  totalSellQuantity?: number;
  openInterest?: number;
  depth?: MarketDepthQuote[];
  greeks?: OptionGreeks;
  updatedAt: string;
}

export interface MarketFeedStatus {
  provider: string;
  isConnected: boolean;
  activeSubscriptionsCount: number;
  subscribedKeys: string[];
  lastTickTimestamp?: number;
  totalTicksReceived: number;
  mode: 'live' | 'mock' | 'disconnected';
  errorMessage?: string;
}

export type QuoteListener = (quote: MarketQuote) => void;
export type StatusListener = (status: MarketFeedStatus) => void;
export type ErrorListener = (error: Error) => void;
