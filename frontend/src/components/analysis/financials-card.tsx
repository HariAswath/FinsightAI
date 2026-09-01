'use client';

import React from 'react';
import { Building2, DollarSign, PieChart, TrendingUp, ShieldCheck } from 'lucide-react';
import { MarketData } from '../../types';

interface FinancialsCardProps {
  marketData: MarketData;
}

export const FinancialsCard: React.FC<FinancialsCardProps> = ({ marketData }) => {
  return (
    <div className="space-y-4">
      {/* Corporate Profile Card matching Screenshot 3 */}
      <div className="signalist-card p-5 space-y-3">
        <div className="flex items-center space-x-2 pb-2 border-b border-white/10">
          <Building2 className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            {marketData.symbol} Profile
          </h4>
        </div>

        <div className="space-y-1 text-xs font-mono text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Sector:</span>
            <span className="text-white font-semibold">Energy &amp; Technology Conglomerate</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Industry:</span>
            <span className="text-white font-semibold">Integrated Oil, Gas &amp; Retail Telecom</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Employees (FY):</span>
            <span className="text-white font-semibold">347K</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed font-sans pt-1">
          {marketData.name} engages in energy exploration, refining, retail commerce, digital telecom services, and green energy infrastructure development across India and global markets.
        </p>
      </div>

      {/* Financials & Profitability Summary Card matching Screenshot 3 */}
      <div className="signalist-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {marketData.symbol} Financials
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Fiscal FY26 Q1</span>
        </div>

        {/* Valuation & Cash Flow */}
        <div className="space-y-2 text-xs font-mono">
          <span className="text-[11px] text-amber-400 uppercase tracking-wider font-semibold block">Valuation &amp; Cash Flow</span>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Market Cap:</span>
              <span className="text-white font-bold">₹20.18T</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Operating Cash:</span>
              <span className="text-white font-bold">₹108.56B</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">P/E Ratio:</span>
              <span className="text-white font-bold">28.40</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Free Cash Flow:</span>
              <span className="text-emerald-400 font-bold">₹96.18B</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">P/B Ratio:</span>
              <span className="text-white font-bold">2.42</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">CapEx (TTM):</span>
              <span className="text-rose-400 font-bold">-₹42.38B</span>
            </div>
          </div>
        </div>

        {/* Profitability & Efficiency */}
        <div className="space-y-2 text-xs font-mono pt-2 border-t border-white/10">
          <span className="text-[11px] text-emerald-400 uppercase tracking-wider font-semibold block">Profitability &amp; Efficiency</span>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Gross Margin:</span>
              <span className="text-white font-bold">46.68%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Return on Assets:</span>
              <span className="text-white font-bold">29.94%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Operating Margin:</span>
              <span className="text-white font-bold">31.87%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Return on Equity:</span>
              <span className="text-emerald-400 font-bold">149.81%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
