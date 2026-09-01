export interface DepthLevel {
  bidQuantity: number;
  bidPrice: number;
  askQuantity: number;
  askPrice: number;
}

export interface TechnicalAnalysis {
  rsi14: number;
  rsiSignal: 'OVERSOLD' | 'NEUTRAL' | 'OVERBOUGHT';
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
    trend: 'BULLISH_CROSSOVER' | 'BEARISH_CROSSOVER' | 'NEUTRAL';
  };
  movingAverages: {
    ema20: number;
    ema50: number;
    ema200: number;
    trendAlignment: 'STRONG_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH';
  };
  volumeAnalysis: {
    currentVolume: number;
    avgVolume20D: number;
    volumeSurgeRatio: number;
    isAnomaly: boolean;
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
    bandWidth: number;
  };
}

export interface RegulatoryFilingDoc {
  id: string;
  symbol: string;
  source: 'SEBI_LODR' | 'EARNINGS_TRANSCRIPT' | 'ANNUAL_REPORT' | 'PRESS_RELEASE';
  title: string;
  filingDate: string;
  keyExcerpts: string[];
  relevanceScore: number;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'CAUTIONARY';
}

export interface MarketSignalItem {
  dimension: 'PRICE_MOMENTUM' | 'VOLUME_ANOMALY' | 'FUNDAMENTAL_FILINGS' | 'INSTITUTIONAL_FLOW';
  signal: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number; // 0.0 to 1.0
  reasoning: string;
  citedSource: string;
}

export interface ComprehensiveEquityData {
  symbol: string;
  companyName: string;
  sector: string;
  exchange: 'NSE';
  ltp: number;
  closePrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  week52High: number;
  week52Low: number;
  peRatio: number;
  marketCapCr: number;
  depth: DepthLevel[];
  technical: TechnicalAnalysis;
  filings: RegulatoryFilingDoc[];
  signals: MarketSignalItem[];
  updatedAt: string;
}

export const HARDCODED_MARKET_DATA: Record<string, ComprehensiveEquityData> = {
  RELIANCE: {
    symbol: 'RELIANCE',
    companyName: 'Reliance Industries Ltd.',
    sector: 'Oil, Gas & Consumer Conglomerate',
    exchange: 'NSE',
    ltp: 2985.40,
    closePrice: 2950.00,
    openPrice: 2955.00,
    highPrice: 2992.00,
    lowPrice: 2948.10,
    change: 35.40,
    changePercent: 1.20,
    volume: 8420150,
    week52High: 3024.90,
    week52Low: 2220.30,
    peRatio: 28.4,
    marketCapCr: 2018500,
    depth: [
      { bidQuantity: 1450, bidPrice: 2985.20, askQuantity: 820, askPrice: 2985.40 },
      { bidQuantity: 3200, bidPrice: 2984.80, askQuantity: 1900, askPrice: 2985.80 },
      { bidQuantity: 5800, bidPrice: 2984.00, askQuantity: 4100, askPrice: 2986.50 },
      { bidQuantity: 9100, bidPrice: 2983.50, askQuantity: 7300, askPrice: 2987.00 },
      { bidQuantity: 14000, bidPrice: 2982.00, askQuantity: 12500, askPrice: 2988.00 }
    ],
    technical: {
      rsi14: 64.8,
      rsiSignal: 'NEUTRAL',
      macd: {
        macdLine: 18.4,
        signalLine: 14.1,
        histogram: 4.3,
        trend: 'BULLISH_CROSSOVER'
      },
      movingAverages: {
        ema20: 2930.50,
        ema50: 2875.20,
        ema200: 2710.00,
        trendAlignment: 'STRONG_BULLISH'
      },
      volumeAnalysis: {
        currentVolume: 8420150,
        avgVolume20D: 5600000,
        volumeSurgeRatio: 1.50,
        isAnomaly: true
      },
      bollingerBands: {
        upper: 3010.00,
        middle: 2920.00,
        lower: 2830.00,
        bandWidth: 6.16
      }
    },
    filings: [
      {
        id: 'FILING-RIL-2024-Q3-01',
        symbol: 'RELIANCE',
        source: 'SEBI_LODR',
        title: 'Regulation 30 Disclosure - New Energy Giga Complex Commissioning',
        filingDate: '2024-10-18',
        keyExcerpts: [
          'Solar PV manufacturing facility phase 1 commissioned on schedule in Jamnagar with annual capacity of 10GW.',
          'Expected ROCE improvement in retail and digital services by 120 bps over the next 4 quarters.',
          'Net debt to EBITDA maintained conservatively below 0.65x.'
        ],
        relevanceScore: 0.94,
        sentiment: 'POSITIVE'
      },
      {
        id: 'TRANSCRIPT-RIL-Q3',
        symbol: 'RELIANCE',
        source: 'EARNINGS_TRANSCRIPT',
        title: 'Q3 Earnings Conference Call Transcript - Management Guidance',
        filingDate: '2024-10-19',
        keyExcerpts: [
          'ARPU for Jio increased to ₹181.7/month with 5G user base crossing 130 million active subscribers.',
          'Retail EBITDA margins expanded by 40 bps year-on-year driven by scale efficiencies in grocery and apparel.'
        ],
        relevanceScore: 0.91,
        sentiment: 'POSITIVE'
      }
    ],
    signals: [
      {
        dimension: 'PRICE_MOMENTUM',
        signal: 'BULLISH',
        confidence: 0.88,
        reasoning: 'LTP is trading firmly above EMA20 (2930.50) and EMA50 (2875.20) with positive MACD histogram expansion (+4.30).',
        citedSource: 'NSE Daily Price Feed & EMA Alignment'
      },
      {
        dimension: 'VOLUME_ANOMALY',
        signal: 'BULLISH',
        confidence: 0.82,
        reasoning: 'Volume surge ratio of 1.50x relative to 20-day baseline indicates institutional accumulation.',
        citedSource: 'NSE Tick Volume Aggregator'
      },
      {
        dimension: 'FUNDAMENTAL_FILINGS',
        signal: 'BULLISH',
        confidence: 0.91,
        reasoning: 'SEBI Lodr filing confirms Phase 1 Solar Giga-factory operational and Jio ARPU rising to ₹181.7.',
        citedSource: 'SEBI LODR Reg 30 (2024-10-18)'
      }
    ],
    updatedAt: new Date().toISOString()
  },

  HDFCBANK: {
    symbol: 'HDFCBANK',
    companyName: 'HDFC Bank Ltd.',
    sector: 'Banking & Financial Services',
    exchange: 'NSE',
    ltp: 1648.80,
    closePrice: 1655.00,
    openPrice: 1652.00,
    highPrice: 1662.00,
    lowPrice: 1642.50,
    change: -6.20,
    changePercent: -0.37,
    volume: 12540000,
    week52High: 1794.00,
    week52Low: 1363.55,
    peRatio: 18.2,
    marketCapCr: 1255000,
    depth: [
      { bidQuantity: 2800, bidPrice: 1648.50, askQuantity: 3400, askPrice: 1648.80 },
      { bidQuantity: 6200, bidPrice: 1648.00, askQuantity: 7100, askPrice: 1649.20 },
      { bidQuantity: 11000, bidPrice: 1647.50, askQuantity: 14500, askPrice: 1650.00 },
      { bidQuantity: 18500, bidPrice: 1646.00, askQuantity: 22000, askPrice: 1651.00 },
      { bidQuantity: 29000, bidPrice: 1645.00, askQuantity: 31000, askPrice: 1652.50 }
    ],
    technical: {
      rsi14: 48.2,
      rsiSignal: 'NEUTRAL',
      macd: {
        macdLine: -2.1,
        signalLine: -1.4,
        histogram: -0.7,
        trend: 'BEARISH_CROSSOVER'
      },
      movingAverages: {
        ema20: 1660.00,
        ema50: 1642.00,
        ema200: 1585.00,
        trendAlignment: 'NEUTRAL'
      },
      volumeAnalysis: {
        currentVolume: 12540000,
        avgVolume20D: 14200000,
        volumeSurgeRatio: 0.88,
        isAnomaly: false
      },
      bollingerBands: {
        upper: 1690.00,
        middle: 1655.00,
        lower: 1620.00,
        bandWidth: 4.23
      }
    },
    filings: [
      {
        id: 'FILING-HDFC-2024-Q3',
        symbol: 'HDFCBANK',
        source: 'SEBI_LODR',
        title: 'Quarterly Business Update - Credit-Deposit Ratio Normalization',
        filingDate: '2024-10-04',
        keyExcerpts: [
          'Gross Advances grew 7.0% YoY to ₹25.19 lakh crore.',
          'Total deposits increased by 15.1% YoY to ₹25.0 lakh crore.',
          'Credit-to-Deposit (LDR) ratio moderated down from 110% to 101%, progressing toward RBI guided thresholds.'
        ],
        relevanceScore: 0.96,
        sentiment: 'POSITIVE'
      }
    ],
    signals: [
      {
        dimension: 'PRICE_MOMENTUM',
        signal: 'NEUTRAL',
        confidence: 0.65,
        reasoning: 'Price consolidating between EMA50 (1642.00) and EMA20 (1660.00) with MACD flat near zero line.',
        citedSource: 'NSE Technical Indicators'
      },
      {
        dimension: 'VOLUME_ANOMALY',
        signal: 'NEUTRAL',
        confidence: 0.70,
        reasoning: 'Daily trading volume of 12.5M is below 20-day average of 14.2M (0.88x surge ratio).',
        citedSource: 'NSE Volume Profile'
      },
      {
        dimension: 'FUNDAMENTAL_FILINGS',
        signal: 'BULLISH',
        confidence: 0.89,
        reasoning: 'Deposit growth outpaced loan growth (15.1% vs 7.0%), successfully addressing LDR liquidity overhang.',
        citedSource: 'HDFC Bank SEBI LODR Quarterly Update'
      }
    ],
    updatedAt: new Date().toISOString()
  },

  TCS: {
    symbol: 'TCS',
    companyName: 'Tata Consultancy Services Ltd.',
    sector: 'Information Technology',
    exchange: 'NSE',
    ltp: 4185.00,
    closePrice: 4160.00,
    openPrice: 4170.00,
    highPrice: 4210.00,
    lowPrice: 4155.00,
    change: 25.00,
    changePercent: 0.60,
    volume: 2150000,
    week52High: 4585.90,
    week52Low: 3313.00,
    peRatio: 31.8,
    marketCapCr: 1515000,
    depth: [
      { bidQuantity: 520, bidPrice: 4184.50, askQuantity: 310, askPrice: 4185.00 },
      { bidQuantity: 1200, bidPrice: 4183.00, askQuantity: 950, askPrice: 4186.50 },
      { bidQuantity: 2400, bidPrice: 4181.00, askQuantity: 1800, askPrice: 4188.00 },
      { bidQuantity: 4100, bidPrice: 4178.00, askQuantity: 3200, askPrice: 4190.00 },
      { bidQuantity: 7500, bidPrice: 4175.00, askQuantity: 6200, askPrice: 4195.00 }
    ],
    technical: {
      rsi14: 58.5,
      rsiSignal: 'NEUTRAL',
      macd: {
        macdLine: 12.5,
        signalLine: 10.2,
        histogram: 2.3,
        trend: 'BULLISH_CROSSOVER'
      },
      movingAverages: {
        ema20: 4140.00,
        ema50: 4095.00,
        ema200: 3880.00,
        trendAlignment: 'BULLISH'
      },
      volumeAnalysis: {
        currentVolume: 2150000,
        avgVolume20D: 1900000,
        volumeSurgeRatio: 1.13,
        isAnomaly: false
      },
      bollingerBands: {
        upper: 4250.00,
        middle: 4140.00,
        lower: 4030.00,
        bandWidth: 5.31
      }
    },
    filings: [
      {
        id: 'FILING-TCS-DEAL-2024',
        symbol: 'TCS',
        source: 'SEBI_LODR',
        title: 'Press Release - Mega Deal Win in European Banking Transformation',
        filingDate: '2024-11-12',
        keyExcerpts: [
          'Signed a multi-year deal valued at $750M with leading Scandinavian financial group.',
          'Focus on AI-first core banking modernization and cloud migration over 5 years.',
          'Operating margin guidance maintained in the 26%-28% band.'
        ],
        relevanceScore: 0.95,
        sentiment: 'POSITIVE'
      }
    ],
    signals: [
      {
        dimension: 'PRICE_MOMENTUM',
        signal: 'BULLISH',
        confidence: 0.78,
        reasoning: 'Trading above 20 EMA with positive MACD histogram (+2.3) and steady support near 4140.',
        citedSource: 'NSE Market Indicators'
      },
      {
        dimension: 'VOLUME_ANOMALY',
        signal: 'NEUTRAL',
        confidence: 0.68,
        reasoning: 'Volume at 1.13x baseline represents consistent institutional participation.',
        citedSource: 'NSE Volume Feed'
      },
      {
        dimension: 'FUNDAMENTAL_FILINGS',
        signal: 'BULLISH',
        confidence: 0.92,
        reasoning: '$750M deal win in Europe provides revenue visibility for FY25-26 while maintaining 26%+ EBIT margins.',
        citedSource: 'TCS Exchange Release (2024-11-12)'
      }
    ],
    updatedAt: new Date().toISOString()
  },

  INFY: {
    symbol: 'INFY',
    companyName: 'Infosys Ltd.',
    sector: 'Information Technology',
    exchange: 'NSE',
    ltp: 1825.20,
    closePrice: 1810.00,
    openPrice: 1815.00,
    highPrice: 1832.00,
    lowPrice: 1808.00,
    change: 15.20,
    changePercent: 0.84,
    volume: 5890000,
    week52High: 1991.45,
    week52Low: 1358.35,
    peRatio: 29.1,
    marketCapCr: 758000,
    depth: [
      { bidQuantity: 1100, bidPrice: 1825.00, askQuantity: 920, askPrice: 1825.20 },
      { bidQuantity: 2600, bidPrice: 1824.50, askQuantity: 2100, askPrice: 1825.80 },
      { bidQuantity: 5400, bidPrice: 1823.00, askQuantity: 4800, askPrice: 1826.50 },
      { bidQuantity: 8900, bidPrice: 1822.00, askQuantity: 7600, askPrice: 1827.50 },
      { bidQuantity: 13500, bidPrice: 1820.00, askQuantity: 11200, askPrice: 1829.00 }
    ],
    technical: {
      rsi14: 61.2,
      rsiSignal: 'NEUTRAL',
      macd: {
        macdLine: 8.9,
        signalLine: 6.4,
        histogram: 2.5,
        trend: 'BULLISH_CROSSOVER'
      },
      movingAverages: {
        ema20: 1805.00,
        ema50: 1775.00,
        ema200: 1640.00,
        trendAlignment: 'STRONG_BULLISH'
      },
      volumeAnalysis: {
        currentVolume: 5890000,
        avgVolume20D: 4200000,
        volumeSurgeRatio: 1.40,
        isAnomaly: true
      },
      bollingerBands: {
        upper: 1860.00,
        middle: 1800.00,
        lower: 1740.00,
        bandWidth: 6.67
      }
    },
    filings: [
      {
        id: 'FILING-INFY-2024-Q3',
        symbol: 'INFY',
        source: 'SEBI_LODR',
        title: 'Financial Results & Revenue Guidance Upward Revision',
        filingDate: '2024-10-17',
        keyExcerpts: [
          'FY25 constant currency revenue guidance revised upwards to 3.75% - 4.50% from 3.0% - 4.0%.',
          'Large deal TCV for Q2 reached $2.4 Billion with 52% net new deals.',
          'Free cash flow conversion stood at 104% of net profit.'
        ],
        relevanceScore: 0.97,
        sentiment: 'POSITIVE'
      }
    ],
    signals: [
      {
        dimension: 'PRICE_MOMENTUM',
        signal: 'BULLISH',
        confidence: 0.85,
        reasoning: 'Strong breakout above 1800 with golden alignment across 20/50/200 EMA ribbons.',
        citedSource: 'NSE Chart Technicals'
      },
      {
        dimension: 'VOLUME_ANOMALY',
        signal: 'BULLISH',
        confidence: 0.79,
        reasoning: '1.40x volume spike confirms breakout conviction.',
        citedSource: 'NSE Volume Ticks'
      },
      {
        dimension: 'FUNDAMENTAL_FILINGS',
        signal: 'BULLISH',
        confidence: 0.94,
        reasoning: 'Upward revision of full-year revenue guidance and $2.4B in large deal TCV.',
        citedSource: 'Infosys SEBI LODR Filing (2024-10-17)'
      }
    ],
    updatedAt: new Date().toISOString()
  },

  TATAMOTORS: {
    symbol: 'TATAMOTORS',
    companyName: 'Tata Motors Ltd.',
    sector: 'Automobile',
    exchange: 'NSE',
    ltp: 1042.50,
    closePrice: 1038.00,
    openPrice: 1039.00,
    highPrice: 1051.00,
    lowPrice: 1035.00,
    change: 4.50,
    changePercent: 0.43,
    volume: 6850000,
    week52High: 1179.05,
    week52Low: 608.00,
    peRatio: 16.4,
    marketCapCr: 382000,
    depth: [
      { bidQuantity: 1800, bidPrice: 1042.20, askQuantity: 1400, askPrice: 1042.50 },
      { bidQuantity: 4100, bidPrice: 1041.50, askQuantity: 3600, askPrice: 1043.00 },
      { bidQuantity: 8200, bidPrice: 1040.00, askQuantity: 7900, askPrice: 1044.00 },
      { bidQuantity: 13500, bidPrice: 1038.50, askQuantity: 12400, askPrice: 1045.00 },
      { bidQuantity: 21000, bidPrice: 1036.00, askQuantity: 19500, askPrice: 1046.50 }
    ],
    technical: {
      rsi14: 53.4,
      rsiSignal: 'NEUTRAL',
      macd: {
        macdLine: 4.2,
        signalLine: 3.8,
        histogram: 0.4,
        trend: 'BULLISH_CROSSOVER'
      },
      movingAverages: {
        ema20: 1035.00,
        ema50: 1020.00,
        ema200: 940.00,
        trendAlignment: 'BULLISH'
      },
      volumeAnalysis: {
        currentVolume: 6850000,
        avgVolume20D: 7100000,
        volumeSurgeRatio: 0.96,
        isAnomaly: false
      },
      bollingerBands: {
        upper: 1080.00,
        middle: 1035.00,
        lower: 990.00,
        bandWidth: 8.70
      }
    },
    filings: [
      {
        id: 'FILING-TATAMOTORS-DEMERGER',
        symbol: 'TATAMOTORS',
        source: 'SEBI_LODR',
        title: 'Scheme of Arrangement - Demerger of CV and PV Businesses',
        filingDate: '2024-08-30',
        keyExcerpts: [
          'NCLT convened shareholders meeting approved demerger into two separate listed entities: Commercial Vehicles and Passenger Vehicles (including JLR and EV).',
          'JLR order book remains strong at 148,000 units with high-margin Range Rover models representing over 70%.',
          'Free cash flow of £496 million generated in Q1.'
        ],
        relevanceScore: 0.98,
        sentiment: 'POSITIVE'
      }
    ],
    signals: [
      {
        dimension: 'PRICE_MOMENTUM',
        signal: 'BULLISH',
        confidence: 0.74,
        reasoning: 'Holding above 1035 EMA support with positive MACD.',
        citedSource: 'NSE Technical Price Feed'
      },
      {
        dimension: 'VOLUME_ANOMALY',
        signal: 'NEUTRAL',
        confidence: 0.65,
        reasoning: 'Volume normal at 0.96x 20D average.',
        citedSource: 'NSE Volume Profile'
      },
      {
        dimension: 'FUNDAMENTAL_FILINGS',
        signal: 'BULLISH',
        confidence: 0.95,
        reasoning: 'Demerger value unlock + JLR 148k order book and net debt reduction track record.',
        citedSource: 'Tata Motors Demerger Scheme SEBI Filing'
      }
    ],
    updatedAt: new Date().toISOString()
  },

  NIFTY50: {
    symbol: 'NIFTY50',
    companyName: 'NIFTY 50 Index',
    sector: 'Benchmark Index',
    exchange: 'NSE',
    ltp: 24385.60,
    closePrice: 24280.00,
    openPrice: 24310.00,
    highPrice: 24420.00,
    lowPrice: 24270.00,
    change: 105.60,
    changePercent: 0.43,
    volume: 245000000,
    week52High: 26277.35,
    week52Low: 19223.65,
    peRatio: 22.8,
    marketCapCr: 18500000,
    depth: [],
    technical: {
      rsi14: 55.2,
      rsiSignal: 'NEUTRAL',
      macd: {
        macdLine: 48.0,
        signalLine: 35.0,
        histogram: 13.0,
        trend: 'BULLISH_CROSSOVER'
      },
      movingAverages: {
        ema20: 24250.00,
        ema50: 24100.00,
        ema200: 23200.00,
        trendAlignment: 'STRONG_BULLISH'
      },
      volumeAnalysis: {
        currentVolume: 245000000,
        avgVolume20D: 230000000,
        volumeSurgeRatio: 1.06,
        isAnomaly: false
      },
      bollingerBands: {
        upper: 24700.00,
        middle: 24250.00,
        lower: 23800.00,
        bandWidth: 3.71
      }
    },
    filings: [
      {
        id: 'MACRO-INDIA-GDP-2024',
        symbol: 'NIFTY50',
        source: 'PRESS_RELEASE',
        title: 'RBI Monetary Policy & India GDP Growth Forecast',
        filingDate: '2024-10-09',
        keyExcerpts: [
          'RBI MPC maintained repo rate at 6.50% while changing policy stance to Neutral.',
          'Real GDP growth for FY25 projected at 7.2% with robust domestic consumption and capex revival.',
          'CPI inflation projected at 4.5% for FY25.'
        ],
        relevanceScore: 0.98,
        sentiment: 'POSITIVE'
      }
    ],
    signals: [
      {
        dimension: 'PRICE_MOMENTUM',
        signal: 'BULLISH',
        confidence: 0.81,
        reasoning: 'Rebounded from EMA20 (24250) support with MACD positive histogram expanding.',
        citedSource: 'NSE Index Feed'
      },
      {
        dimension: 'VOLUME_ANOMALY',
        signal: 'NEUTRAL',
        confidence: 0.70,
        reasoning: 'Broad market liquidity stable.',
        citedSource: 'NSE Derivative & Cash Turnover'
      },
      {
        dimension: 'FUNDAMENTAL_FILINGS',
        signal: 'BULLISH',
        confidence: 0.93,
        reasoning: 'RBI policy stance shifted to Neutral with FY25 GDP growth anchored at 7.2%.',
        citedSource: 'RBI Monetary Policy Statement (Oct 2024)'
      }
    ],
    updatedAt: new Date().toISOString()
  }
};
