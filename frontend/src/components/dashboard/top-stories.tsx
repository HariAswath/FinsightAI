'use client';

import React from 'react';
import { Newspaper, Table, ExternalLink } from 'lucide-react';

export const TopStories: React.FC = () => {
  const stories = [
    { source: 'SEBI / Regulatory', title: 'EUR/USD: Rally Cools Off After Central Bank Speech Knocked Dollar — Rate Cuts Ahead?', time: 'Yesterday' },
    { source: 'Market Media', title: 'ETH/USD: Ether Hits Record Near $5,000 but Traders Caution Near Key Resistance', time: 'Yesterday' },
    { source: 'Financial Times', title: 'SPX: S&P 500 Futures Dip After Speech Pumped Market Rally. Next Up — Nvidia Earnings', time: 'Yesterday' },
    { source: 'Reuters', title: 'GBP/USD: Sterling Drops 1.5% After Hitting Resistance at Double Top', time: '3 days ago' }
  ];

  const tableData = [
    { name: 'S&P 500 Index', symbol: 'SPX', value: '6,432.5', change: '-11.10', chgPct: '-0.17%', open: '6,443.6', high: '6,448.0', low: '6,415.0' },
    { name: 'US 100 Cash CFD', symbol: 'NSX', value: '23,392.2', change: '-42.40', chgPct: '-0.18%', open: '23,434.6', high: '23,454.9', low: '23,306.4' },
    { name: 'Dow Jones Industrial', symbol: 'DJI', value: '45,226.4', change: '-95.30', chgPct: '-0.21%', open: '45,321.7', high: '45,352.4', low: '45,312.7' },
    { name: 'NSE NIFTY 50 India', symbol: 'NIFTY', value: '23,390.4', change: '+184.20', chgPct: '+0.79%', open: '23,210.0', high: '23,410.0', low: '23,190.0' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Stories List matching Screenshot 2 (Bottom Left) */}
      <div className="signalist-card p-6 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-white/10">
          <Newspaper className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Top Market Stories</h3>
        </div>

        <div className="space-y-3">
          {stories.map((st, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5 hover:border-white/15 transition-colors space-y-1 cursor-pointer">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-amber-400 font-semibold">{st.source}</span>
                <span>{st.time}</span>
              </div>
              <h4 className="text-xs font-semibold text-white leading-relaxed hover:text-amber-300 transition-colors">
                {st.title}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* Market Summary Table matching Screenshot 2 (Bottom Right) */}
      <div className="signalist-card p-6 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-white/10">
          <Table className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Market Indices &amp; Benchmarks</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-400 border-b border-white/10 pb-2">
                <th className="py-2 px-2">Name</th>
                <th className="py-2 px-2">Value</th>
                <th className="py-2 px-2">Change</th>
                <th className="py-2 px-2">Chg%</th>
                <th className="py-2 px-2">Open</th>
                <th className="py-2 px-2">High</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tableData.map((row, idx) => {
                const isPos = row.chgPct.startsWith('+');
                return (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-2 font-semibold text-white">{row.name}</td>
                    <td className="py-2.5 px-2 text-white font-bold">{row.value}</td>
                    <td className={`py-2.5 px-2 font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>{row.change}</td>
                    <td className={`py-2.5 px-2 font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>{row.chgPct}</td>
                    <td className="py-2.5 px-2 text-slate-400">{row.open}</td>
                    <td className="py-2.5 px-2 text-slate-400">{row.high}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
