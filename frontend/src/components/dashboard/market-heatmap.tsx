'use client';

import React from 'react';
import { Grid, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface HeatmapItem {
  symbol: string;
  name: string;
  sector: string;
  changePercent: number;
  size: 'large' | 'medium' | 'small';
}

interface MarketHeatmapProps {
  onSelectStock: (symbol: string) => void;
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({ onSelectStock }) => {
  const heatmapData: HeatmapItem[] = [
    { symbol: 'RELIANCE', name: 'Reliance Ind', sector: 'Energy & Retail', changePercent: 2.40, size: 'large' },
    { symbol: 'NVDA', name: 'NVIDIA Corp', sector: 'Electronic Tech', changePercent: 1.02, size: 'large' },
    { symbol: 'AAPL', name: 'Apple Inc', sector: 'Electronic Tech', changePercent: -0.26, size: 'medium' },
    { symbol: 'MSFT', name: 'Microsoft Corp', sector: 'Tech Services', changePercent: -0.59, size: 'large' },
    { symbol: 'GOOGL', name: 'Alphabet Inc', sector: 'Tech Services', changePercent: 1.16, size: 'medium' },
    { symbol: 'AMZN', name: 'Amazon.com', sector: 'Retail Trade', changePercent: -0.39, size: 'large' },
    { symbol: 'TSLA', name: 'Tesla Inc', sector: 'Consumer Durables', changePercent: 1.94, size: 'medium' },
    { symbol: 'TCS', name: 'TCS', sector: 'Tech Services', changePercent: -0.36, size: 'small' },
    { symbol: 'HDFC', name: 'HDFC Bank', sector: 'Finance', changePercent: 1.45, size: 'medium' },
    { symbol: 'META', name: 'Meta Platforms', sector: 'Tech Services', changePercent: -0.20, size: 'small' }
  ];

  return (
    <div className="signalist-card p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Grid className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Market Sector Heatmap</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">Click tile to analyze stock</span>
      </div>

      {/* Grid Layout matching Screenshot 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {heatmapData.map((item) => {
          const isPositive = item.changePercent >= 0;
          return (
            <div
              key={item.symbol}
              onClick={() => onSelectStock(item.symbol)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 flex flex-col justify-between h-28 ${
                isPositive
                  ? item.changePercent > 1.5
                    ? 'heatmap-tile-positive-strong'
                    : 'heatmap-tile-positive'
                  : item.changePercent < -1.0
                  ? 'heatmap-tile-negative-strong'
                  : 'heatmap-tile-negative'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-300 block">{item.sector}</span>
                  <span className="text-base font-extrabold text-white">{item.symbol}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{item.name}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className={`text-sm font-bold font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-white/50" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
