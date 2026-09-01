import {
  MarketData,
  TechnicalOutput,
  FundamentalOutput,
  SentimentOutput,
  RiskOutput,
  SynthesisOutput,
  UserProfile,
  AnalysisSessionResult,
  DecisionType
} from '../types';

export const DEMO_PROFILES: Record<string, UserProfile> = {
  USER_A: {
    id: 'user_a_conservative',
    name: 'User A (Conservative)',
    riskTolerance: 'CONSERVATIVE',
    investmentHorizon: 'LONG_TERM',
    portfolio: {
      RELIANCE: 0.30, // 30% concentration
      TCS: 0.20,
      HDFC: 0.15,
      CASH: 0.35
    }
  },
  USER_B: {
    id: 'user_b_aggressive',
    name: 'User B (Aggressive)',
    riskTolerance: 'AGGRESSIVE',
    investmentHorizon: 'MEDIUM_TERM',
    portfolio: {
      RELIANCE: 0.05, // Only 5% concentration
      INFOSYS: 0.15,
      ICICI: 0.10,
      CASH: 0.70
    }
  }
};

export const DEMO_MARKET_DATA: Record<string, MarketData> = {
  RELIANCE: {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    price: 1420.50,
    priceChange: 33.30,
    priceChangePercent: 2.40,
    volume: 12450000,
    volumeChange: 1.18,
    rsi: 62.4,
    macd: {
      macdLine: 14.2,
      signalLine: 9.8,
      histogram: 4.4
    },
    movingAverages: {
      ma20: 1395.00,
      ma50: 1360.20,
      ma200: 1280.00
    },
    volatility: 14.8,
    timestamp: new Date().toISOString()
  },
  TCS: {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: 3450.00,
    priceChange: -12.50,
    priceChangePercent: -0.36,
    volume: 4500000,
    volumeChange: 0.92,
    rsi: 48.1,
    macd: {
      macdLine: -2.1,
      signalLine: -1.5,
      histogram: -0.6
    },
    movingAverages: {
      ma20: 3470.00,
      ma50: 3490.00,
      ma200: 3380.00
    },
    volatility: 11.2,
    timestamp: new Date().toISOString()
  },
  HDFC: {
    symbol: 'HDFC',
    name: 'HDFC Bank Limited',
    price: 1680.75,
    priceChange: 24.10,
    priceChangePercent: 1.45,
    volume: 8900000,
    volumeChange: 1.25,
    rsi: 58.9,
    macd: {
      macdLine: 8.4,
      signalLine: 5.1,
      histogram: 3.3
    },
    movingAverages: {
      ma20: 1645.00,
      ma50: 1610.00,
      ma200: 1540.00
    },
    volatility: 13.5,
    timestamp: new Date().toISOString()
  }
};

/**
 * Executes parallel multi-agent evaluation pipeline
 */
export async function runMultiAgentAnalysis(
  symbol: string,
  userProfile: UserProfile,
  options: {
    simulateMissingData?: boolean;
    simulateConflict?: boolean;
  } = {}
): Promise<AnalysisSessionResult> {
  const startTime = Date.now();
  const market = DEMO_MARKET_DATA[symbol] || DEMO_MARKET_DATA.RELIANCE;

  // Simulate parallel network latency
  const [technical, fundamental, sentiment] = await Promise.all([
    executeTechnicalAgent(market),
    executeFundamentalAgent(symbol),
    options.simulateMissingData ? executeDegradedSentimentAgent() : executeSentimentAgent(symbol, options.simulateConflict)
  ]);

  // Execute Risk Agent sequentially given user context
  const risk = executeRiskAgent(userProfile, symbol);

  // Execute Synthesis Agent
  const synthesis = executeSynthesisAgent(
    technical,
    fundamental,
    sentiment,
    risk,
    userProfile,
    symbol,
    options.simulateMissingData,
    options.simulateConflict
  );

  const totalLatencyMs = Date.now() - startTime;

  return {
    symbol,
    marketData: market,
    technical,
    fundamental,
    sentiment,
    risk,
    synthesis,
    totalLatencyMs,
    isDegraded: !!options.simulateMissingData,
    hasConflict: !!options.simulateConflict,
    timestamp: new Date().toISOString()
  };
}

async function executeTechnicalAgent(market: MarketData): Promise<TechnicalOutput> {
  await delay(1200); // 1.2s realistic agent runtime
  return {
    agent: 'technical',
    signal: 'BULLISH',
    confidence: 0.82,
    reasons: [
      `Price (₹${market.price.toLocaleString()}) is trading above 20-day (₹${market.movingAverages.ma20}) and 50-day moving averages`,
      `Volume ratio at 1.18x 30-day average indicates strong institutional accumulation`,
      `MACD histogram (+4.40) shows expanding bullish momentum and signal crossover`
    ],
    metrics: {
      rsi: market.rsi,
      macdSignal: 'BULLISH_CROSSOVER',
      maTrend: 'STRONG_UPTREND',
      momentumScore: 84
    },
    latencyMs: 1200,
    status: 'SUCCESS'
  };
}

async function executeFundamentalAgent(symbol: string): Promise<FundamentalOutput> {
  await delay(1800); // 1.8s RAG retrieval + LLM analysis
  return {
    agent: 'fundamental',
    signal: 'BULLISH',
    confidence: 0.79,
    reasons: [
      `Q1 FY27 consolidated revenue expanded 14.8% YoY driven by robust retail EBITDA expansion`,
      `Debt-to-Equity improved to 0.42x post strategic capital expenditure cycle completion`,
      `Management commentary confirms strong margin guidance and cash flow generation`
    ],
    sources: [
      {
        title: `${symbol} Q1 FY27 Statutory Financial Filing`,
        documentType: 'Quarterly Report',
        page: 12,
        snippet: 'Consolidated EBITDA for the quarter reached ₹41,200 Cr, representing a 14.8% expansion YoY. Capital expenditure intensity normalized.',
        confidence: 0.94,
        date: '2026-07-20'
      },
      {
        title: `${symbol} Earnings Call Transcript`,
        documentType: 'Investor Transcript',
        page: 8,
        snippet: 'Management reiterated full-year EBITDA margin target of 18.5% with disciplined capital allocation in retail and digital operations.',
        confidence: 0.88,
        date: '2026-07-21'
      }
    ],
    latencyMs: 1800,
    status: 'SUCCESS'
  };
}

async function executeSentimentAgent(symbol: string, simulateConflict?: boolean): Promise<SentimentOutput> {
  await delay(1400); // 1.4s news sentiment parsing
  if (simulateConflict) {
    return {
      agent: 'sentiment',
      signal: 'BEARISH',
      confidence: 0.78,
      reasons: [
        `Regulatory review notice issued by competition authority regarding sector dominance`,
        `Short-term supply chain bottlenecks reported in Q2 trade notes`,
        `Analyst downgrade by global investment bank due to near-term valuation multiples`
      ],
      metrics: {
        newsCount: 24,
        positiveRatio: 0.25,
        earningsCommentary: 'CAUTIOUS'
      },
      latencyMs: 1400,
      status: 'SUCCESS'
    };
  }

  return {
    agent: 'sentiment',
    signal: 'POSITIVE',
    confidence: 0.71,
    reasons: [
      `Positive analyst coverage updates with price target upgrades from 3 major brokerages`,
      `New strategic technology partnership announcement received favorably by market media`,
      `Overall retail investor sentiment index stands at 71/100 (Bullish)`
    ],
    metrics: {
      newsCount: 18,
      positiveRatio: 0.76,
      earningsCommentary: 'BULLISH'
    },
    latencyMs: 1400,
    status: 'SUCCESS'
  };
}

async function executeDegradedSentimentAgent(): Promise<SentimentOutput> {
  await delay(300);
  return {
    agent: 'sentiment',
    signal: 'NEUTRAL',
    confidence: 0.0,
    reasons: [
      '⚠ News & Sentiment feed is currently unavailable or offline',
      'System will fall back strictly to Technical and Fundamental RAG evidence'
    ],
    metrics: {
      newsCount: 0,
      positiveRatio: 0,
      earningsCommentary: 'UNAVAILABLE'
    },
    latencyMs: 300,
    status: 'UNAVAILABLE'
  };
}

function executeRiskAgent(userProfile: UserProfile, symbol: string): RiskOutput {
  const existingExposure = userProfile.portfolio[symbol] || 0.0;
  const isHighExposure = existingExposure >= 0.20;
  const isConservative = userProfile.riskTolerance === 'CONSERVATIVE';

  const riskFlags: string[] = [];
  const personalizationFactors: string[] = [];

  if (isHighExposure) {
    riskFlags.push(`High portfolio concentration: ${symbol} represents ${(existingExposure * 100).toFixed(0)}% of your portfolio.`);
  }

  if (isConservative && isHighExposure) {
    personalizationFactors.push('Conservative risk profile requires strict single-stock concentration limits (max 20%).');
  } else if (!isHighExposure) {
    personalizationFactors.push(`Low existing exposure (${(existingExposure * 100).toFixed(0)}%) allows fresh capital allocation.`);
  }

  return {
    agent: 'risk',
    riskLevel: userProfile.riskTolerance,
    concentrationScore: Math.round(existingExposure * 200), // 30% -> 60 score
    existingExposurePercent: existingExposure,
    riskFlags,
    personalizationFactors,
    latencyMs: 400
  };
}

function executeSynthesisAgent(
  technical: TechnicalOutput,
  fundamental: FundamentalOutput,
  sentiment: SentimentOutput,
  risk: RiskOutput,
  userProfile: UserProfile,
  symbol: string,
  isDegraded?: boolean,
  hasConflict?: boolean
): SynthesisOutput {
  const isHighExposure = risk.existingExposurePercent >= 0.20;
  const isConservative = userProfile.riskTolerance === 'CONSERVATIVE';

  // Base Market View
  let marketView: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'BULLISH';
  let baseConfidence = 0.78;

  if (hasConflict) {
    marketView = 'NEUTRAL';
    baseConfidence = 0.57; // Dampened confidence due to conflict
  } else if (isDegraded) {
    baseConfidence = 0.61; // Adjusted confidence due to missing sentiment source
  }

  // Personalization Matrix Logic (THE CORE DIFFERENTIATOR!)
  let personalizedDecision: DecisionType = 'CONSIDER_BUY';
  let summary = '';

  if (hasConflict) {
    personalizedDecision = 'WATCH';
    summary = `Independent agents disagree on ${symbol}. Technical signals are Bullish while Sentiment/News sources present Bearish risks. Recommending WATCH until signal consensus emerges.`;
  } else if (isConservative && isHighExposure) {
    // USER A: CONSERVATIVE + HIGH EXPOSURE (30%) -> SMALL ADD / HOLD
    personalizedDecision = 'SMALL_ADD';
    summary = `Market view is BULLISH based on strong technical momentum (+82%) and Q1 filing growth (+79%). However, because ${symbol} already comprises ${(risk.existingExposurePercent * 100).toFixed(0)}% of your Conservative portfolio, fresh allocation is restricted to a SMALL ADD to prevent concentration risk.`;
  } else {
    // USER B: AGGRESSIVE + LOW EXPOSURE (5%) -> CONSIDER BUY / STRONG BUY
    personalizedDecision = 'CONSIDER_BUY';
    summary = `Market view is BULLISH with low existing portfolio exposure (${(risk.existingExposurePercent * 100).toFixed(0)}%). Your Aggressive risk profile allows taking full advantage of positive technical and fundamental momentum.`;
  }

  const allSources = [...(fundamental.sources || [])];

  return {
    marketView,
    confidence: baseConfidence,
    personalizedDecision,
    summary,
    reasons: [
      `Technical Agent: ${technical.reasons[0]}`,
      `Fundamental Agent: ${fundamental.reasons[0]}`,
      `Risk Evaluation: Existing exposure is ${(risk.existingExposurePercent * 100).toFixed(0)}% for a ${userProfile.riskTolerance} risk profile`
    ],
    risks: risk.riskFlags.length > 0 ? risk.riskFlags : ['General market volatility and sector rotation risk'],
    sources: allSources,
    reasoningSteps: [
      { stepIndex: 1, title: 'Market Data Ingestion', agentName: 'Orchestrator', details: `Retrieved live quote, volume & indicators for ${symbol}` },
      { stepIndex: 2, title: 'Technical Momentum Evaluation', agentName: 'Technical Agent', details: `${technical.signal} (${Math.round(technical.confidence * 100)}%) — RSI ${technical.metrics.rsi}, MACD crossover` },
      { stepIndex: 3, title: 'RAG Document Retrieval', agentName: 'Fundamental Agent', details: `Retrieved ${fundamental.sources.length} financial filing chunks from vector database` },
      { stepIndex: 4, title: 'Fundamental Verification', agentName: 'Fundamental Agent', details: `${fundamental.signal} (${Math.round(fundamental.confidence * 100)}%) — EBITDA +14.8% YoY` },
      { stepIndex: 5, title: 'News Sentiment Extraction', agentName: 'Sentiment Agent', details: `${sentiment.signal} (${Math.round(sentiment.confidence * 100)}%) — ${sentiment.reasons[0]}` },
      { stepIndex: 6, title: 'Portfolio Risk Layering', agentName: 'Risk Agent', details: `Profile: ${userProfile.riskTolerance}, Holding: ${(risk.existingExposurePercent * 100).toFixed(0)}%` },
      { stepIndex: 7, title: 'Personalized Synthesis', agentName: 'Synthesis Agent', details: `Market: ${marketView} → Personalized Decision: ${personalizedDecision}` }
    ],
    latencyMs: 1100
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
