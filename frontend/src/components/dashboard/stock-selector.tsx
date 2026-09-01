'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Play, Activity, BarChart2, Zap } from 'lucide-react';
import { MarketData } from '../../types';

interface StockSelectorProps {
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  marketData: MarketData;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
}

export const StockSelector: React.FC<StockSelectorProps> = ({
  selectedSymbol,
  onSelectSymbol,
  marketData,
  onRunAnalysis,
  isAnalyzing
}) => {
  const stocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: '₹1,420.50', change: '+2.40%' },
    { symbol: 'TCS', name: 'Tata Consultancy', price: '₹3,450.00', change: '-0.36%' },
    { symbol: 'HDFC', name: 'HDFC Bank Ltd.', price: '₹1,680.75', change: '+1.45%' }
  ];

  const isPositive = marketData.priceChangePercent >= 0;

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
      {/* Stock Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Select Target Symbol:</span>
          <div className="flex items-center space-x-1.5 p-1 rounded-full bg-black/60 border border-white/10">
            {stocks.map((stk) => (
              <button
                key={stk.symbol}
                onClick={() => onSelectSymbol(stk.symbol)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold font-mono transition-all cursor-pointer ${
                  selectedSymbol === stk.symbol
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {stk.symbol}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Action Button: Analyze Stock */}
        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className={`primary-pill-btn flex items-center space-x-2 text-sm font-semibold cursor-pointer ${
            isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Zap className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Running Multi-Agent Engine...' : 'Execute Multi-Agent Analysis'}</span>
        </button>
      </div>

      {/* Stock Live Quote Hero Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-bold text-white tracking-tight">{marketData.name}</h2>
            <span className="px-2.5 py-1 rounded-md bg-white/5 text-slate-300 font-mono text-xs border border-white/10">
              {marketData.symbol}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Real-time market feed &amp; technical indicator metrics</p>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-3xl font-bold font-mono text-white">
              ₹{marketData.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className={`flex items-center justify-end space-x-1 text-sm font-mono font-semibold ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{isPositive ? '+' : ''}{marketData.priceChangePercent}% (₹{marketData.priceChange})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Indicators Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">RSI Momentum</span>
          <span className="text-sm font-bold font-mono text-blue-400">{marketData.rsi} (Bullish)</span>
        </div>

        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">MACD Histogram</span>
          <span className="text-sm font-bold font-mono text-emerald-400">+{marketData.macd.histogram} Hist</span>
        </div>

        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">20-Day Moving Avg</span>
          <span className="text-sm font-bold font-mono text-white">₹{marketData.movingAverages.ma20}</span>
        </div>

        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">Volume Ratio</span>
          <span className="text-sm font-bold font-mono text-sky-400">{(marketData.volume / 1000000).toFixed(2)}M (1.18x)</span>
        </div>
      </div>
    </div>
  );
};
