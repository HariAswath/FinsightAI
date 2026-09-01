export type RiskTolerance = 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';

export type InvestmentHorizon = 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';

export interface UserProfile {
  id: string;
  name: string;
  riskTolerance: RiskTolerance;
  horizon: InvestmentHorizon;
  maxStockConcentrationPct: number; // e.g. 15 for 15%
  maxSectorConcentrationPct: number; // e.g. 30 for 30%
  description: string;
}

export interface PortfolioHolding {
  symbol: string;
  companyName: string;
  sector: string;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  totalValue: number;
  weightPct: number; // 0 to 100
}

export interface PortfolioContext {
  totalPortfolioValue: number;
  cashBalance: number;
  holdings: PortfolioHolding[];
  sectorAllocations: Record<string, number>; // sector -> totalValue
}

export const PRESET_PROFILES: Record<string, UserProfile> = {
  conservative: {
    id: 'conservative',
    name: 'Capital Preservation (Conservative)',
    riskTolerance: 'CONSERVATIVE',
    horizon: 'LONG_TERM',
    maxStockConcentrationPct: 10,
    maxSectorConcentrationPct: 25,
    description: 'Focuses on capital preservation, robust balance sheets, low debt, and steady dividend yields with zero speculative exposure.'
  },
  moderate: {
    id: 'moderate',
    name: 'Balanced Growth (Moderate)',
    riskTolerance: 'MODERATE',
    horizon: 'MEDIUM_TERM',
    maxStockConcentrationPct: 15,
    maxSectorConcentrationPct: 35,
    description: 'Balances fundamental valuation quality with technical entry points and growth momentum.'
  },
  aggressive: {
    id: 'aggressive',
    name: 'High Alpha / Momentum (Aggressive)',
    riskTolerance: 'AGGRESSIVE',
    horizon: 'SHORT_TERM',
    maxStockConcentrationPct: 25,
    maxSectorConcentrationPct: 50,
    description: 'Maximizes alpha through high-momentum breakouts, volume surge anomalies, and growth turnaround plays.'
  }
};
