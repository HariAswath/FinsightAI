export interface InstrumentInfo {
  symbol: string;
  name: string;
  instrumentKey: string;
  exchange: 'NSE_EQ' | 'NSE_INDEX' | 'BSE_EQ' | 'NSE_FO';
  lotSize?: number;
  tickSize?: number;
}

/**
 * Standard Symbol and Instrument Key Registry for Indian Equities and Indices.
 */
class SymbolRegistry {
  private symbolToInfo = new Map<string, InstrumentInfo>();
  private keyToInfo = new Map<string, InstrumentInfo>();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults() {
    const defaultInstruments: InstrumentInfo[] = [
      {
        symbol: 'RELIANCE',
        name: 'Reliance Industries Ltd.',
        instrumentKey: 'NSE_EQ|INE002A01018',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'HDFCBANK',
        name: 'HDFC Bank Ltd.',
        instrumentKey: 'NSE_EQ|INE040A01034',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'TCS',
        name: 'Tata Consultancy Services Ltd.',
        instrumentKey: 'NSE_EQ|INE467B01029',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'INFY',
        name: 'Infosys Ltd.',
        instrumentKey: 'NSE_EQ|INE009A01021',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'ICICIBANK',
        name: 'ICICI Bank Ltd.',
        instrumentKey: 'NSE_EQ|INE090A01021',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'SBIN',
        name: 'State Bank of India',
        instrumentKey: 'NSE_EQ|INE062A01020',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'BHARTIARTL',
        name: 'Bharti Airtel Ltd.',
        instrumentKey: 'NSE_EQ|INE397D01024',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'ITC',
        name: 'ITC Ltd.',
        instrumentKey: 'NSE_EQ|INE154A01025',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'TATAMOTORS',
        name: 'Tata Motors Ltd.',
        instrumentKey: 'NSE_EQ|INE155A01022',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'NIFTY50',
        name: 'NIFTY 50 Index',
        instrumentKey: 'NSE_INDEX|Nifty 50',
        exchange: 'NSE_INDEX',
        lotSize: 25,
        tickSize: 0.05
      },
      {
        symbol: 'BANKNIFTY',
        name: 'NIFTY Bank Index',
        instrumentKey: 'NSE_INDEX|Nifty Bank',
        exchange: 'NSE_INDEX',
        lotSize: 15,
        tickSize: 0.05
      }
    ];

    for (const item of defaultInstruments) {
      this.register(item);
    }
  }

  public register(info: InstrumentInfo): void {
    const cleanSymbol = info.symbol.toUpperCase().trim();
    this.symbolToInfo.set(cleanSymbol, info);
    this.keyToInfo.set(info.instrumentKey, info);
  }

  public getBySymbol(symbol: string): InstrumentInfo | undefined {
    return this.symbolToInfo.get(symbol.toUpperCase().trim());
  }

  public getByKey(instrumentKey: string): InstrumentInfo | undefined {
    return this.keyToInfo.get(instrumentKey);
  }

  public resolveKey(identifier: string): string {
    const upper = identifier.toUpperCase().trim();
    if (this.symbolToInfo.has(upper)) {
      return this.symbolToInfo.get(upper)!.instrumentKey;
    }
    return identifier; // Assuming it's already an instrument key
  }

  public resolveSymbol(instrumentKeyOrSymbol: string): string {
    if (this.keyToInfo.has(instrumentKeyOrSymbol)) {
      return this.keyToInfo.get(instrumentKeyOrSymbol)!.symbol;
    }
    const upper = instrumentKeyOrSymbol.toUpperCase().trim();
    if (this.symbolToInfo.has(upper)) {
      return upper;
    }
    // Fallback: extract symbol from format NSE_EQ|XYZ
    const parts = instrumentKeyOrSymbol.split('|');
    return parts.length > 1 ? parts[1] : instrumentKeyOrSymbol;
  }

  public getAll(): InstrumentInfo[] {
    return Array.from(this.symbolToInfo.values());
  }
}

export const symbolRegistry = new SymbolRegistry();
