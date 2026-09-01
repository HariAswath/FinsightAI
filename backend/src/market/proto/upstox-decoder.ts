import * as protobuf from 'protobufjs';
import { MarketDepthQuote, MarketQuote, OptionGreeks } from '../types';
import { symbolRegistry } from '../symbol-registry';

const PROTO_SCHEMA = `
syntax = "proto3";

package com.upstox.marketdatafeeder.rpc.proto;

enum Type {
  initial_feed = 0;
  live_feed = 1;
}

message LTPC {
  double ltp = 1;
  int64 ltt = 2;
  int64 ltq = 3;
  double cp = 4;
}

message Quote {
  int32 bq = 1;
  double bp = 2;
  int32 aq = 3;
  double ap = 4;
}

message MarketLevel {
  repeated Quote bidAskQuote = 1;
}

message OHLC {
  string interval = 1;
  double open = 2;
  double high = 3;
  double low = 4;
  double close = 5;
  int32 volume = 6;
  int64 ts = 7;
}

message MarketOHLC {
  repeated OHLC ohlc = 1;
}

message OptionGreeks {
  double op = 1;
  double up = 2;
  double iv = 3;
  double delta = 4;
  double theta = 5;
  double gamma = 6;
  double vega = 7;
  double rho = 8;
}

message ExtendedFeedDetails {
  double atp = 1;
  double cp = 2;
  int64 vtt = 3;
  double oi = 4;
  double changeOi = 5;
  double lastTradedPrice = 6;
  double totalBuyQuantity = 7;
  double totalSellQuantity = 8;
  double lowerCircuit = 9;
  double upperCircuit = 10;
  double openInterest = 11;
}

message MarketFullFeed {
  LTPC ltpc = 1;
  MarketLevel marketLevel = 2;
  OptionGreeks optionGreeks = 3;
  MarketOHLC marketOHLC = 4;
  ExtendedFeedDetails efd = 5;
}

message IndexFullFeed {
  LTPC ltpc = 1;
  MarketOHLC marketOHLC = 2;
}

message FullFeed {
  oneof FullFeedUnion {
    MarketFullFeed marketFF = 1;
    IndexFullFeed indexFF = 2;
  }
}

message Feed {
  oneof FeedUnion {
    LTPC ltpc = 1;
    FullFeed fullFeed = 2;
  }
}

message FeedResponse {
  Type type = 1;
  map<string, Feed> feeds = 2;
  int64 currentTs = 3;
}
`;

/**
 * Single Responsibility: Binary Protobuf parsing & conversion to normalized domain models.
 * Self-contained schema definition requires NO gRPC runtime.
 */
export class UpstoxProtoDecoder {
  private root: protobuf.Root;
  private feedResponseType: protobuf.Type;

  constructor() {
    const parsed = protobuf.parse(PROTO_SCHEMA);
    this.root = parsed.root;
    this.feedResponseType = this.root.lookupType('com.upstox.marketdatafeeder.rpc.proto.FeedResponse');
  }

  public async ensureLoaded(): Promise<void> {
    // Synchronously initialized
    return Promise.resolve();
  }

  /**
   * Decodes binary buffer into normalized MarketQuote array
   */
  public decode(buffer: Buffer | Uint8Array): MarketQuote[] {
    const message = this.feedResponseType.decode(new Uint8Array(buffer));
    const object = this.feedResponseType.toObject(message, {
      longs: Number,
      enums: String,
      bytes: String,
      defaults: true,
      arrays: true,
      objects: true,
      oneofs: true
    }) as any;

    const quotes: MarketQuote[] = [];
    const feeds = object?.feeds || {};
    const now = new Date().toISOString();

    for (const [instrumentKey, feedData] of Object.entries<any>(feeds)) {
      try {
        const symbol = symbolRegistry.resolveSymbol(instrumentKey);
        let ltp = 0;
        let closePrice: number | undefined;
        let openPrice: number | undefined;
        let highPrice: number | undefined;
        let lowPrice: number | undefined;
        let volume: number | undefined;
        let lastTradedTime: number | undefined;
        let lastTradedQuantity: number | undefined;
        let totalBuyQuantity: number | undefined;
        let totalSellQuantity: number | undefined;
        let openInterest: number | undefined;
        let depth: MarketDepthQuote[] | undefined;
        let greeks: OptionGreeks | undefined;

        if (feedData.ltpc) {
          ltp = feedData.ltpc.ltp || 0;
          closePrice = feedData.ltpc.cp;
          lastTradedTime = feedData.ltpc.ltt;
          lastTradedQuantity = feedData.ltpc.ltq;
        } else if (feedData.fullFeed) {
          const ff = feedData.fullFeed;
          if (ff.marketFF) {
            const mff = ff.marketFF;
            ltp = mff.ltpc?.ltp || 0;
            closePrice = mff.ltpc?.cp;
            lastTradedTime = mff.ltpc?.ltt;
            lastTradedQuantity = mff.ltpc?.ltq;

            if (mff.efd) {
              totalBuyQuantity = mff.efd.totalBuyQuantity;
              totalSellQuantity = mff.efd.totalSellQuantity;
              openInterest = mff.efd.openInterest || mff.efd.oi;
              if (mff.efd.cp) closePrice = mff.efd.cp;
            }

            if (mff.marketOHLC?.ohlc?.length) {
              const latestOHLC = mff.marketOHLC.ohlc[mff.marketOHLC.ohlc.length - 1];
              openPrice = latestOHLC.open;
              highPrice = latestOHLC.high;
              lowPrice = latestOHLC.low;
              volume = latestOHLC.volume;
            }

            if (mff.marketLevel?.bidAskQuote) {
              depth = mff.marketLevel.bidAskQuote.map((q: any) => ({
                bidQuantity: q.bq || 0,
                bidPrice: q.bp || 0,
                askQuantity: q.aq || 0,
                askPrice: q.ap || 0
              }));
            }

            if (mff.optionGreeks) {
              greeks = {
                optionPrice: mff.optionGreeks.op,
                underlyingPrice: mff.optionGreeks.up,
                impliedVolatility: mff.optionGreeks.iv,
                delta: mff.optionGreeks.delta,
                theta: mff.optionGreeks.theta,
                gamma: mff.optionGreeks.gamma,
                vega: mff.optionGreeks.vega,
                rho: mff.optionGreeks.rho
              };
            }
          } else if (ff.indexFF) {
            const iff = ff.indexFF;
            ltp = iff.ltpc?.ltp || 0;
            closePrice = iff.ltpc?.cp;
            lastTradedTime = iff.ltpc?.ltt;
            if (iff.marketOHLC?.ohlc?.length) {
              const latestOHLC = iff.marketOHLC.ohlc[iff.marketOHLC.ohlc.length - 1];
              openPrice = latestOHLC.open;
              highPrice = latestOHLC.high;
              lowPrice = latestOHLC.low;
              volume = latestOHLC.volume;
            }
          }
        }

        const change = closePrice && ltp ? Number((ltp - closePrice).toFixed(2)) : 0;
        const changePercent = closePrice && closePrice > 0 ? Number(((change / closePrice) * 100).toFixed(2)) : 0;

        quotes.push({
          symbol,
          instrumentKey,
          ltp,
          closePrice,
          openPrice,
          highPrice,
          lowPrice,
          change,
          changePercent,
          volume,
          lastTradedTime,
          lastTradedQuantity,
          totalBuyQuantity,
          totalSellQuantity,
          openInterest,
          depth,
          greeks,
          updatedAt: now
        });
      } catch (innerErr) {
        console.warn(`[UpstoxProtoDecoder] Error parsing quote for ${instrumentKey}:`, innerErr);
      }
    }

    return quotes;
  }
}
