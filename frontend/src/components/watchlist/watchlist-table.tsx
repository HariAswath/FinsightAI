'use client';

import React, { useState } from 'react';
import { Star, Plus, Bell, Trash2, ExternalLink, Bookmark } from 'lucide-react';

interface WatchlistTableProps {
  onSelectStock: (symbol: string) => void;
}

export const WatchlistTable: React.FC<WatchlistTableProps> = ({ onSelectStock }) => {
  const [watchlist, setWatchlist] = useState([
    { symbol: 'AAPL', company: 'Apple Inc', price: '$233.16', change: '+1.54%', marketCap: '$3.56T', pe: '35.5', isStarred: true },
    { symbol: 'MSFT', company: 'Microsoft Corp', price: '$520.42', change: '-0.24%', marketCap: '$3.75T', pe: '32.6', isStarred: true },
    { symbol: 'GOOGL', company: 'Alphabet Inc', price: '$201.56', change: '+2.65%', marketCap: '$2.52T', pe: '21.5', isStarred: true },
    { symbol: 'AMZN', company: 'Amazon.com Inc', price: '$244.16', change: '-1.53%', marketCap: '$1.45T', pe: '33.5', isStarred: true },
    { symbol: 'TSLA', company: 'Tesla Inc', price: '$339.62', change: '+1.72%', marketCap: '$1.56T', pe: '161.2', isStarred: true },
    { symbol: 'RELIANCE', company: 'Reliance Industries', price: '₹1,420.50', change: '+2.40%', marketCap: '₹20.18T', pe: '28.4', isStarred: true }
  ]);

  const [alerts, setAlerts] = useState([
    { id: '1', symbol: 'AAPL', company: 'Apple Inc.', price: '$229.65', change: '+1.4%', condition: 'Price > $240.60', frequency: 'Once per day' },
    { id: '2', symbol: 'TSLA', company: 'Tesla, Inc.', price: '$340.84', change: '-2.53%', condition: 'Price = $300.80', frequency: 'Once per minute' },
    { id: '3', symbol: 'META', company: 'Meta Platforms Inc.', price: '$790.00', change: '+1.4%', condition: 'Price < $700.40', frequency: 'Once per hour' }
  ]);

  const [newAlertSymbol, setNewAlertSymbol] = useState('RELIANCE');
  const [newAlertPrice, setNewAlertPrice] = useState('1500');

  const handleAddAlert = () => {
    if (!newAlertPrice) return;
    setAlerts([
      ...alerts,
      {
        id: Date.now().toString(),
        symbol: newAlertSymbol,
        company: `${newAlertSymbol} Stock`,
        price: 'Live',
        change: '+0.0%',
        condition: `Price > ₹${newAlertPrice}`,
        frequency: 'Once per day'
      }
    ]);
  };

  return (
    <div className="space-y-8">
      {/* Top Grid: Watchlist Table (Left) + Alerts Manager (Right) matching Screenshot 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Watchlist Table (2 Columns) */}
        <div className="lg:col-span-2 signalist-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Your Watchlist</h3>
            </div>
            <button
              onClick={() => onSelectStock('RELIANCE')}
              className="gold-btn-sm flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Stock</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 pb-2">
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Change</th>
                  <th className="py-2.5 px-3">Market Cap</th>
                  <th className="py-2.5 px-3">P/E Ratio</th>
                  <th className="py-2.5 px-3 text-right">Alert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {watchlist.map((stk) => (
                  <tr
                    key={stk.symbol}
                    onClick={() => onSelectStock(stk.symbol)}
                    className="hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-semibold text-white flex items-center space-x-2">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{stk.company}</span>
                    </td>
                    <td className="py-3 px-3 text-amber-400 font-bold">{stk.symbol}</td>
                    <td className="py-3 px-3 text-white font-bold">{stk.price}</td>
                    <td className={`py-3 px-3 font-bold ${stk.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stk.change}
                    </td>
                    <td className="py-3 px-3 text-slate-300">{stk.marketCap}</td>
                    <td className="py-3 px-3 text-slate-300">{stk.pe}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewAlertSymbol(stk.symbol);
                          handleAddAlert();
                        }}
                        className="gold-outline-btn"
                      >
                        + Alert
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts Manager (Right Column) matching Screenshot 5 */}
        <div className="signalist-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Active Alerts</h3>
            </div>
            <button onClick={handleAddAlert} className="gold-btn-sm cursor-pointer">
              Create Alert
            </button>
          </div>

          {/* Alert Creation Quick Form */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
            <span className="text-slate-300 font-mono font-semibold block">Quick Add Price Alert</span>
            <div className="flex space-x-2">
              <select
                value={newAlertSymbol}
                onChange={(e) => setNewAlertSymbol(e.target.value)}
                className="bg-[#12131C] text-white border border-white/20 rounded-lg p-1.5 font-mono text-xs focus:outline-none"
              >
                <option value="RELIANCE">RELIANCE</option>
                <option value="TCS">TCS</option>
                <option value="HDFC">HDFC</option>
                <option value="AAPL">AAPL</option>
                <option value="TSLA">TSLA</option>
              </select>
              <input
                type="text"
                value={newAlertPrice}
                onChange={(e) => setNewAlertPrice(e.target.value)}
                placeholder="Target Price"
                className="flex-1 bg-[#12131C] text-white border border-white/20 rounded-lg p-1.5 font-mono text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Active Alerts List */}
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {alerts.map((alt) => (
              <div key={alt.id} className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">{alt.company}</span>
                    <span className="ml-2 text-xs font-mono text-amber-400 font-bold">{alt.symbol}</span>
                  </div>
                  <button
                    onClick={() => setAlerts(alerts.filter((a) => a.id !== alt.id))}
                    className="text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Trigger:</span>
                  <span className="text-emerald-400 font-bold">{alt.condition}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 text-right">
                  Frequency: {alt.frequency}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial News Grid (Bottom) matching Screenshot 5 */}
      <div className="signalist-card p-6 space-y-4">
        <h3 className="text-base font-bold text-white pb-3 border-b border-white/10">
          Today&apos;s Financial News &amp; Sentiment Feeds
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { tag: 'RELIANCE', headline: 'Reliance Q1 Consolidated EBITDA Expands 14.8% YoY on Retail Growth', source: 'Financial Express', time: '12 mins ago' },
            { tag: 'AAPL', headline: 'Apple Prepares Major iPhone Redesign & AI Integration Strategy for 2026', source: 'Bloomberg', time: '24 mins ago' },
            { tag: 'TSLA', headline: 'Tesla Announces Affordable EV Model Target for Global Emerging Markets', source: 'CNBC', time: '37 mins ago' },
            { tag: 'NVDA', headline: 'NVIDIA Hardware Dominance Accelerates Enterprise AI Datacenter Demand', source: 'Wall Street Journal', time: '45 mins ago' }
          ].map((news, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  {news.tag}
                </span>
                <h4 className="text-xs font-semibold text-white leading-relaxed">{news.headline}</h4>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{news.source} • {news.time}</span>
                <span className="text-amber-400 font-semibold cursor-pointer hover:underline flex items-center">
                  Read <ExternalLink className="w-2.5 h-2.5 ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
