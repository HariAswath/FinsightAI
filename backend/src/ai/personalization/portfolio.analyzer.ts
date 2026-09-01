import { PortfolioContext, PortfolioHolding, UserProfile } from '../types/profile.types';
import { RecommendationAction, PortfolioRiskImpact } from '../types/recommendation.types';

/**
 * Deterministic Portfolio Concentration & Exposure Analyzer.
 * Adheres to Section 23 of docs/IMPLEMENTATION.md (Code does math, not LLMs).
 */
export class PortfolioAnalyzer {
  public evaluateExposure(
    symbol: string,
    sector: string,
    action: RecommendationAction,
    profile: UserProfile,
    portfolio?: PortfolioContext
  ): PortfolioRiskImpact {
    if (!portfolio || portfolio.holdings.length === 0 || portfolio.totalPortfolioValue === 0) {
      return {
        hasConcentrationRisk: false,
        currentStockWeightPct: 0,
        projectedStockWeightPct: 5,
        currentSectorWeightPct: 0,
        maxAllowedStockPct: profile.maxStockConcentrationPct
      };
    }

    const sym = symbol.toUpperCase();
    const existingHolding = portfolio.holdings.find(h => h.symbol.toUpperCase() === sym);

    const currentStockWeightPct = existingHolding
      ? Math.round((existingHolding.totalValue / portfolio.totalPortfolioValue) * 1000) / 10
      : 0;

    const sectorValue = portfolio.sectorAllocations[sector] || 0;
    const currentSectorWeightPct = Math.round((sectorValue / portfolio.totalPortfolioValue) * 1000) / 10;

    const maxStockAllowed = profile.maxStockConcentrationPct;
    const isConcentrated = currentStockWeightPct >= maxStockAllowed;

    let riskWarning: string | undefined;
    let recommendationAdjustment: string | undefined;

    if (isConcentrated && (action === 'BUY' || action === 'ACCUMULATE')) {
      riskWarning = `Concentration Cap Warning: Existing position in ${sym} constitutes ${currentStockWeightPct}% of total portfolio value, exceeding profile ceiling of ${maxStockAllowed}%.`;
      recommendationAdjustment = `Downgraded from ${action} to HOLD to enforce strict portfolio diversification constraints.`;
    } else if (currentSectorWeightPct >= profile.maxSectorConcentrationPct && (action === 'BUY' || action === 'ACCUMULATE')) {
      riskWarning = `Sector Concentration Alert: ${sector} allocation is at ${currentSectorWeightPct}% (Max: ${profile.maxSectorConcentrationPct}%).`;
      recommendationAdjustment = `Throttled to ACCUMULATE to prevent excessive sector exposure.`;
    }

    const projectedStockWeightPct = action === 'BUY'
      ? Math.min(100, currentStockWeightPct + 5)
      : action === 'ACCUMULATE'
      ? Math.min(100, currentStockWeightPct + 2.5)
      : currentStockWeightPct;

    return {
      hasConcentrationRisk: Boolean(riskWarning),
      currentStockWeightPct,
      projectedStockWeightPct,
      currentSectorWeightPct,
      maxAllowedStockPct: maxStockAllowed,
      riskWarning,
      recommendationAdjustment
    };
  }

  /**
   * Sample retail portfolio for instant demonstrations and testing
   */
  public static getSamplePortfolio(): PortfolioContext {
    const holdings: PortfolioHolding[] = [
      {
        symbol: 'RELIANCE',
        companyName: 'Reliance Industries Ltd.',
        sector: 'Oil, Gas & Consumer Conglomerate',
        quantity: 100,
        averageBuyPrice: 2850.00,
        currentPrice: 2985.40,
        totalValue: 298540,
        weightPct: 18.2
      },
      {
        symbol: 'HDFCBANK',
        companyName: 'HDFC Bank Ltd.',
        sector: 'Banking & Financial Services',
        quantity: 150,
        averageBuyPrice: 1580.00,
        currentPrice: 1648.80,
        totalValue: 247320,
        weightPct: 15.1
      },
      {
        symbol: 'TCS',
        companyName: 'Tata Consultancy Services Ltd.',
        sector: 'Information Technology',
        quantity: 50,
        averageBuyPrice: 3820.00,
        currentPrice: 4210.00,
        totalValue: 210500,
        weightPct: 12.8
      },
      {
        symbol: 'TATAMOTORS',
        companyName: 'Tata Motors Ltd.',
        sector: 'Automobile',
        quantity: 120,
        averageBuyPrice: 940.00,
        currentPrice: 1042.50,
        totalValue: 125100,
        weightPct: 7.6
      }
    ];

    const cashBalance = 758540;
    const totalEquities = holdings.reduce((sum, h) => sum + h.totalValue, 0);
    const totalPortfolioValue = totalEquities + cashBalance; // ₹16,40,000

    const sectorAllocations: Record<string, number> = {};
    for (const h of holdings) {
      sectorAllocations[h.sector] = (sectorAllocations[h.sector] || 0) + h.totalValue;
    }

    return {
      totalPortfolioValue,
      cashBalance,
      holdings,
      sectorAllocations
    };
  }
}

export const portfolioAnalyzer = new PortfolioAnalyzer();
