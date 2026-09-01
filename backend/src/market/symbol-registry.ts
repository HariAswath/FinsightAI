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
        symbol: 'HINDUNILVR',
        name: 'Hindustan Unilever Ltd.',
        instrumentKey: 'NSE_EQ|INE030A01027',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'LT',
        name: 'Larsen & Toubro Ltd.',
        instrumentKey: 'NSE_EQ|INE018A01030',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'BAJFINANCE',
        name: 'Bajaj Finance Ltd.',
        instrumentKey: 'NSE_EQ|INE296A01024',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'MARUTI',
        name: 'Maruti Suzuki India Ltd.',
        instrumentKey: 'NSE_EQ|INE585B01010',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'SUNPHARMA',
        name: 'Sun Pharmaceutical Industries Ltd.',
        instrumentKey: 'NSE_EQ|INE044A01036',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'KOTAKBANK',
        name: 'Kotak Mahindra Bank Ltd.',
        instrumentKey: 'NSE_EQ|INE237A01028',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'AXISBANK',
        name: 'Axis Bank Ltd.',
        instrumentKey: 'NSE_EQ|INE238A01034',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'TITAN',
        name: 'Titan Company Ltd.',
        instrumentKey: 'NSE_EQ|INE280A01028',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'ADANIENT',
        name: 'Adani Enterprises Ltd.',
        instrumentKey: 'NSE_EQ|INE423A01024',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'ADANIPORTS',
        name: 'Adani Ports & SEZ Ltd.',
        instrumentKey: 'NSE_EQ|INE742F01042',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'WIPRO',
        name: 'Wipro Ltd.',
        instrumentKey: 'NSE_EQ|INE075A01022',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'HCLTECH',
        name: 'HCL Technologies Ltd.',
        instrumentKey: 'NSE_EQ|INE860A01027',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'ASIANPAINT',
        name: 'Asian Paints Ltd.',
        instrumentKey: 'NSE_EQ|INE021A01026',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'NTPC',
        name: 'NTPC Ltd.',
        instrumentKey: 'NSE_EQ|INE733E01010',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'POWERGRID',
        name: 'Power Grid Corp. of India Ltd.',
        instrumentKey: 'NSE_EQ|INE752E01010',
        exchange: 'NSE_EQ',
        lotSize: 1,
        tickSize: 0.05
      },
      {
        symbol: 'TATASTEEL',
        name: 'Tata Steel Ltd.',
        instrumentKey: 'NSE_EQ|INE081A01020',
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
    // Dynamically register any new symbol on the fly
    const dynamicKey = `NSE_EQ|${upper}`;
    this.register({
      symbol: upper,
      name: `${upper} Equity`,
      instrumentKey: dynamicKey,
      exchange: 'NSE_EQ',
      lotSize: 1,
      tickSize: 0.05
    });
    return dynamicKey;
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
