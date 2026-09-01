'use client';

import React, { useState } from 'react';
import { Search, X, Star, TrendingUp, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStock: (symbol: string) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectStock,
  watchlist,
  onToggleWatchlist
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const popularStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', sector: 'Conglomerate / Energy', price: '₹1,420.50', change: '+2.40%' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT Services / Technology', price: '₹3,450.00', change: '-0.36%' },
    { symbol: 'HDFC', name: 'HDFC Bank Limited', sector: 'Banking & Financials', price: '₹1,680.75', change: '+1.45%' },
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Consumer Electronics', price: '$227.16', change: '-0.26%' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Semiconductors & AI', price: '$181.46', change: '+2.21%' },
    { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Auto Manufacturers / EV', price: '$339.62', change: '+1.72%' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Enterprise Software', price: '$520.42', change: '-0.24%' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Retail & Cloud Infrastructure', price: '$244.16', change: '-1.53%' }
  ];

  const filtered = popularStocks.filter(
    (stk) =>
      stk.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stk.name.toLowerCase().includes(query.toLowerCase()) ||
      stk.sector.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#12131C] border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Search Header */}
        <div className="p-4 border-b border-white/10 flex items-center space-x-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by symbol or company name..."
            autoFocus
            className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Popular Stocks List matching Screenshot 4 */}
        <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-2">
            Popular Stocks ({filtered.length})
          </p>

          <div className="space-y-1">
            {filtered.map((stk) => {
              const isWatched = watchlist.includes(stk.symbol);
              return (
                <div
                  key={stk.symbol}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer group"
                  onClick={() => {
                    onSelectStock(stk.symbol);
                    onClose();
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(stk.symbol);
                      }}
                      className="text-slate-500 hover:text-amber-400 transition-colors p-1"
                    >
                      <Star className={`w-4 h-4 ${isWatched ? 'text-amber-400 fill-amber-400' : ''}`} />
                    </button>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                          {stk.name}
                        </span>
                        <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                          {stk.symbol}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{stk.sector}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-white">{stk.price}</p>
                      <p className={`text-[11px] font-mono ${stk.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stk.change}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
