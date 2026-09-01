'use client';

import React, { useState } from 'react';
import { Activity, Gauge } from 'lucide-react';

interface TechnicalGaugeProps {
  symbol: string;
  signal: 'STRONG_SELL' | 'SELL' | 'NEUTRAL' | 'BUY' | 'STRONG_BUY';
  score?: number; // 0 to 100
}

export const TechnicalGauge: React.FC<TechnicalGaugeProps> = ({ symbol, signal = 'BUY', score = 78 }) => {
  const [timeframe, setTimeframe] = useState('5 minutes');

  const timeframes = ['1 minute', '5 minutes', '15 minutes'];

  // Gauge Needle Rotation mapping (0% -> -90deg, 100% -> 90deg)
  const getNeedleRotation = () => {
    switch (signal) {
      case 'STRONG_SELL':
        return -75;
      case 'SELL':
        return -40;
      case 'NEUTRAL':
        return 0;
      case 'BUY':
        return 45;
      case 'STRONG_BUY':
        return 75;
    }
  };

  const getSignalColor = () => {
    switch (signal) {
      case 'STRONG_SELL':
      case 'SELL':
        return 'text-rose-400';
      case 'NEUTRAL':
        return 'text-amber-400';
      case 'BUY':
      case 'STRONG_BUY':
        return 'text-emerald-400';
    }
  };

  return (
    <div className="signalist-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Technical Analysis for <span className="text-amber-400 font-extrabold">{symbol}</span>
        </h4>
        <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-lg border border-white/10 text-xs">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-1 rounded text-[11px] font-mono cursor-pointer transition-all ${
                timeframe === tf ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Semi-Circular Gauge Meter Arc matching Screenshot 3 */}
      <div className="relative flex flex-col items-center justify-center pt-4 pb-2">
        <svg className="w-56 h-28" viewBox="0 0 200 100">
          {/* Background Arc */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="#1e202e"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Color Gradients Arc (Red -> Yellow -> Green) */}
          <path
            d="M 20 90 A 80 80 0 0 1 60 35"
            fill="none"
            stroke="#ef4444"
            strokeWidth="16"
          />
          <path
            d="M 60 35 A 80 80 0 0 1 140 35"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="16"
          />
          <path
            d="M 140 35 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="#10b981"
            strokeWidth="16"
          />

          {/* Pivot Base Circle */}
          <circle cx="100" cy="90" r="8" fill="#ffffff" />

          {/* Gauge Needle */}
          <g transform={`rotate(${getNeedleRotation()}, 100, 90)`} className="transition-transform duration-700 ease-out">
            <line x1="100" y1="90" x2="100" y2="25" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
          </g>
        </svg>

        {/* Dynamic Signal Text */}
        <div className="text-center mt-2">
          <span className={`text-lg font-bold font-mono uppercase tracking-wider ${getSignalColor()}`}>
            {signal.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Numerical Indicator Count Breakdown matching Screenshot 3 */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2 border-t border-white/10">
        <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-500/20">
          <span className="text-rose-400 font-bold block text-sm">16</span>
          <span className="text-slate-400 text-[10px]">Sell</span>
        </div>
        <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/20">
          <span className="text-amber-400 font-bold block text-sm">9</span>
          <span className="text-slate-400 text-[10px]">Neutral</span>
        </div>
        <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
          <span className="text-emerald-400 font-bold block text-sm">1</span>
          <span className="text-slate-400 text-[10px]">Buy</span>
        </div>
      </div>
    </div>
  );
};
