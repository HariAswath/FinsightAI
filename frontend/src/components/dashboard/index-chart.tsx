'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Activity, LineChart } from 'lucide-react';

export const IndexChart: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Indices');
  const [activeTimeframe, setActiveTimeframe] = useState('1Y');

  const categories = ['Indices', 'Stocks', 'Futures', 'Bonds', 'Forex'];
  const timeframes = ['1D', '1M', '3M', '1Y', '5Y', 'All'];

  const indicesList = [
    { name: 'NIFTY 50 (NSE India)', symbol: 'NIFTY50', value: '23,390.40', change: '+184.20 (+0.79%)', isPositive: true },
    { name: 'S&P 500 Index', symbol: 'SPXUSD', value: '6,432.50', change: '-11.60 (-0.18%)', isPositive: false },
    { name: 'US 100 Cash CFD (Nasdaq)', symbol: 'NSXUSD', value: '23,392.20', change: '-42.40 (-0.18%)', isPositive: false },
    { name: 'Dow Jones Industrial', symbol: 'DJI', value: '45,222.40', change: '-99.30 (-0.21%)', isPositive: false }
  ];

  return (
    <div className="signalist-card p-6 space-y-6">
      {/* Header & Category Switcher matching Screenshot 2 */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Market Summary</h3>
        </div>

        <div className="flex items-center space-x-1 bg-black/50 p-1 rounded-lg border border-white/10 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
                activeCategory === cat ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Interactive Area Chart */}
      <div className="relative w-full h-[220px] bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col justify-between">
        <div className="flex items-center justify-between z-10">
          <div>
            <span className="text-xs font-mono text-slate-400">NSE NIFTY 50 / Global Benchmark</span>
            <div className="text-2xl font-bold font-mono text-white flex items-center space-x-2">
              <span>23,390.40</span>
              <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                +0.79%
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1 bg-black/60 p-1 rounded-lg border border-white/10 text-xs font-mono">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={`px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer ${
                  activeTimeframe === tf ? 'bg-white/20 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Area Path Visualizer */}
        <svg className="absolute inset-0 w-full h-full p-2 pt-12" viewBox="0 0 500 150" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 120 Q 80 40, 150 90 T 300 30 T 420 70 T 500 20 L 500 150 L 0 150 Z"
            fill="url(#chartGrad)"
          />
          <path
            d="M 0 120 Q 80 40, 150 90 T 300 30 T 420 70 T 500 20"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
          />
        </svg>
      </div>

      {/* Indices Quick List matching Screenshot 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        {indicesList.map((idx) => (
          <div key={idx.symbol} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 block truncate">{idx.name}</span>
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">{idx.value}</span>
              <span className={`text-[11px] font-bold ${idx.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {idx.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
