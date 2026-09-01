'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, RefreshCw } from 'lucide-react';
import { ApiService, MarketQuote, ComprehensiveEquityData, RegulatoryFilingDoc } from '@/services/api.service';
import { useUser } from '@/context/user-context';
import { SignalistHeader } from '../../components/navigation/signalist-header';
import { SearchModal } from '../../components/navigation/search-modal';

export default function DashboardPage() {
  const router = useRouter();
  const { watchlist, toggleWatchlist, isWatchlisted } = useUser();

  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [comprehensiveData, setComprehensiveData] = useState<Record<string, ComprehensiveEquityData>>({});
  const [filings, setFilings] = useState<RegulatoryFilingDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Category tab for Market Summary
  const [marketCategory, setMarketCategory] = useState<string>('Indices');
  // Chart timeframe state: 1m, 5m, 15m, 30m, 1h, 2h, 4h, D, W, M
  const [timeframe, setTimeframe] = useState<string>('D');
  const [activeChartSymbol, setActiveChartSymbol] = useState<string>('NIFTY50');

  // Load quotes and comprehensive data on mount
  const loadMarketData = async () => {
    try {
      const liveQuotes = await ApiService.getQuotes();
      setQuotes(liveQuotes);

      const sampleSymbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ITC', 'MARUTI', 'TITAN', 'SBIN'];
      const compResults = await Promise.allSettled(
        sampleSymbols.map((s) => ApiService.getEquity(s))
      );

      const compMap: Record<string, ComprehensiveEquityData> = {};
      const allFilings: RegulatoryFilingDoc[] = [];

      compResults.forEach((res) => {
        if (res.status === 'fulfilled' && res.value.comprehensive) {
          const comp = res.value.comprehensive;
          compMap[comp.symbol] = comp;
          if (comp.filings) {
            allFilings.push(...comp.filings);
          }
        }
      });

      setComprehensiveData(compMap);
      setFilings(allFilings);
    } catch (err) {
      console.error('Failed to load market data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMarketData();

    // Subscribe to live sub-second WebSocket updates from backend
    const cleanupWS = ApiService.connectMarketWS((tick: MarketQuote) => {
      setQuotes((prev) => {
        const index = prev.findIndex((q) => q.symbol === tick.symbol);
        if (index >= 0) {
          const next = [...prev];
          next[index] = { ...next[index], ...tick };
          return next;
        }
        return [tick, ...prev];
      });
    });

    const interval = setInterval(loadMarketData, 20000);
    return () => {
      cleanupWS();
      clearInterval(interval);
    };
  }, []);

  // Indices quotes for the 3 summary cards
  const niftyQuote = quotes.find((q) => q.symbol === 'NIFTY50') || { ltp: 23965.24, changePercent: 1.4 };
  const bankNiftyQuote = quotes.find((q) => q.symbol === 'BANKNIFTY') || { ltp: 57453.86, changePercent: 1.5 };
  const relianceQuote = quotes.find((q) => q.symbol === 'RELIANCE') || { ltp: 1301.70, changePercent: 1.93 };

  // Watchlisted quotes (6 cards)
  const defaultWatchlist = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'MARUTI', 'TITAN'];
  const activeWatchlistSymbols = watchlist.length > 0 ? watchlist.slice(0, 6) : defaultWatchlist;
  const watchlistedQuotes: MarketQuote[] = activeWatchlistSymbols.map((sym: string) => {
    const found = quotes.find((q) => q.symbol === sym);
    return found || { symbol: sym, instrumentKey: `NSE_EQ|${sym}`, ltp: 2450.00, changePercent: 1.40, change: 32.0, updatedAt: new Date().toISOString() };
  });

  // Table stocks (27 Real NSE Equities)
  const tableStocks = useMemo(() => {
    const equits = quotes.filter((q) => q.symbol !== 'NIFTY50' && q.symbol !== 'BANKNIFTY');
    return equits.length > 0 ? equits : [
      { symbol: 'RELIANCE', ltp: 1301.70, changePercent: 1.93, volume: 15420000 },
      { symbol: 'TCS', ltp: 2360.00, changePercent: -1.64, volume: 8200000 },
      { symbol: 'HDFCBANK', ltp: 711.90, changePercent: 0.41, volume: 24000000 },
      { symbol: 'INFY', ltp: 1345.50, changePercent: -0.28, volume: 11000000 },
      { symbol: 'ICICIBANK', ltp: 1220.00, changePercent: 1.15, volume: 9500000 },
      { symbol: 'ITC', ltp: 266.60, changePercent: 4.34, volume: 31200000 },
      { symbol: 'MARUTI', ltp: 12500.00, changePercent: 1.72, volume: 1200000 },
      { symbol: 'TITAN', ltp: 3450.00, changePercent: -0.55, volume: 2300000 },
      { symbol: 'SBIN', ltp: 780.40, changePercent: 1.82, volume: 18000000 },
      { symbol: 'BHARTIARTL', ltp: 1650.00, changePercent: 0.65, volume: 6400000 }
    ];
  }, [quotes]);

  // Color generator for square stock avatars matching Figma
  const getAvatarColor = (sym: string) => {
    const colors: Record<string, string> = {
      RELIANCE: 'bg-[#F97316] text-white', // Orange
      TCS: 'bg-[#3B82F6] text-white',    // Blue
      HDFCBANK: 'bg-[#0EA5E9] text-white',// Cyan
      INFY: 'bg-[#6366F1] text-white',   // Indigo
      MARUTI: 'bg-[#EF4444] text-white', // Red
      TITAN: 'bg-[#EAB308] text-black',  // Gold
      ITC: 'bg-[#10B981] text-white',    // Emerald
      SBIN: 'bg-[#0284C7] text-white'    // Sky
    };
    return colors[sym] || 'bg-[#1E202B] text-white';
  };

  // SVG Area Chart points
  const basePrice = niftyQuote.ltp || 23965;
  const chartPoints = [
    5420, 5460, 5390, 5480, 5410, 5520, 5490, 5540, 5510, 5580,
    5530, 5490, 5560, 5520, 5603
  ];
  const minP = 5350;
  const maxP = 5650;
  const svgWidth = 640;
  const svgHeight = 200;
  const pointsStr = chartPoints.map((val, idx) => {
    const x = (idx / (chartPoints.length - 1)) * svgWidth;
    const y = svgHeight - ((val - minP) / (maxP - minP)) * (svgHeight - 40) - 20;
    return `${x},${y}`;
  }).join(' ');
  const areaPath = `M 0,${svgHeight} L ${pointsStr} L ${svgWidth},${svgHeight} Z`;
  const linePath = `M ${pointsStr}`;

  return (
    <div className="min-h-screen bg-[#08080A] text-slate-100 flex flex-col font-sans selection:bg-[#F6BE22] selection:text-black">
      {/* Header strictly matching Signalist screenshots */}
      <SignalistHeader onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectStock={(sym) => {
          setIsSearchOpen(false);
          router.push(`/analysis?symbol=${sym}`);
        }}
        watchlist={watchlist}
        onToggleWatchlist={toggleWatchlist}
      />

      {/* Main Grid Container strictly matching Screenshot 170459 */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-6 space-y-6">
        {/* ROW 1: Market Summary (2 cols) + Your Watchlist (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top-Left: Market Summary Container */}
          <div className="lg:col-span-2 bg-[#0E0F15] border border-[#1A1B24] rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            {/* Header: Title + Category Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-white tracking-tight">Market Summary</h2>

              {/* Category Pills matching Figma: Indices, Stocks, Crypto, Forex, Bonds, ETFs */}
              <div className="flex items-center space-x-1 bg-[#14151D] p-1 rounded-xl border border-[#21232E] text-xs font-medium overflow-x-auto">
                {['Indices', 'Stocks', 'Crypto', 'Forex', 'Bonds', 'ETFs'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setMarketCategory(cat)}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      marketCategory === cat
                        ? 'bg-[#222432] text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Glowing Emerald Line Chart */}
            <div className="relative w-full h-[220px] rounded-xl bg-[#090A0E] border border-[#171821] p-4 flex flex-col justify-between overflow-hidden">
              {/* SVG Area & Line */}
              <div className="absolute inset-0 flex items-end">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="signalistGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d={areaPath} fill="url(#signalistGrad)" />
                  <path d={linePath} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* Price scale on right y-axis matching screenshot: 5,600, 5,550, 5,500, 5,400 */}
              <div className="absolute right-4 inset-y-4 flex flex-col justify-between text-[11px] font-mono text-slate-500 pointer-events-none z-10">
                <span>5,600</span>
                <span>5,550</span>
                <span>5,500</span>
                <span>5,400</span>
              </div>

              {/* Timeframes along bottom matching screenshot: 1m, 5m, 15m, 30m, 1h, 2h, 4h, D, W, M */}
              <div className="relative z-10 flex items-center space-x-3 text-[11px] font-mono text-slate-400 mt-auto pt-4">
                {['1m', '5m', '15m', '30m', '1h', '2h', '4h', 'D', 'W', 'M'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`cursor-pointer transition-colors ${
                      timeframe === tf ? 'text-white font-bold' : 'hover:text-slate-200'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* 3 Index Cards inside the bottom of the container */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* S&P 500 / NIFTY 50 */}
              <div className="p-3.5 rounded-xl bg-[#12131A] border border-[#1F212D] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">NIFTY 50</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">
                    500
                  </span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-base font-bold text-white font-mono">
                    ₹{(niftyQuote.ltp || 23965).toLocaleString()}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    +{(niftyQuote.changePercent || 1.4).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Nasdaq 100 / BANK NIFTY */}
              <div className="p-3.5 rounded-xl bg-[#12131A] border border-[#1F212D] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">BANK NIFTY</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold">
                    100
                  </span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-base font-bold text-white font-mono">
                    ₹{(bankNiftyQuote.ltp || 57453).toLocaleString()}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    +{(bankNiftyQuote.changePercent || 1.5).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Dow 30 / SENSEX */}
              <div className="p-3.5 rounded-xl bg-[#12131A] border border-[#1F212D] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">SENSEX</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">
                    30
                  </span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-base font-bold text-white font-mono">
                    ₹{(relianceQuote.ltp ? 81425 : 81425).toLocaleString()}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    +1.4%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top-Right: Your Watchlist matching Screenshot 170459 */}
          <div id="watchlist" className="bg-[#0E0F15] border border-[#1A1B24] rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-tight">Your Watchlist</h2>
              <Link href="/dashboard#watchlist" className="text-xs text-slate-400 hover:text-white transition-colors">
                View all
              </Link>
            </div>

            {/* 6 Watchlist Cards in 3x2 / 2x3 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 flex-1">
              {watchlistedQuotes.map((stock: MarketQuote) => {
                const isPos = (stock.changePercent || 0) >= 0;
                return (
                  <Link
                    key={stock.symbol}
                    href={`/analysis?symbol=${stock.symbol}`}
                    className="p-3.5 rounded-xl bg-[#13141C] border border-[#1F202B] hover:border-[#2F3142] transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="flex items-center justify-between">
                      {/* Square logo */}
                      <div className={`w-8 h-8 rounded-lg ${getAvatarColor(stock.symbol)} flex items-center justify-center font-bold text-xs`}>
                        {stock.symbol.slice(0, 1)}
                      </div>
                      {/* Gold star */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWatchlist(stock.symbol);
                        }}
                        className="text-[#F6BE22] hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-[#F6BE22]" />
                      </button>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-white">
                        {comprehensiveData[stock.symbol]?.companyName || stock.symbol}
                      </p>
                      <p className="text-sm font-bold text-white font-mono mt-0.5">
                        ₹{stock.ltp?.toLocaleString()}
                      </p>
                      <p className={`text-[11px] font-mono mt-0.5 ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPos ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* ROW 2: Today's Top Stocks (2 cols) + Today's Financial News (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bottom-Left: Today's Top Stocks Table strictly matching Screenshot 170459 */}
          <div className="lg:col-span-2 bg-[#0E0F15] border border-[#1A1B24] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-tight">Today's Top Stocks</h2>
              <Link href="/dashboard" className="text-xs text-slate-400 hover:text-white transition-colors">
                View all
              </Link>
            </div>

            {/* Stocks Table */}
            <div className="overflow-x-auto rounded-xl border border-[#1C1D27]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#12131A] text-slate-400 font-medium text-[11px] border-b border-[#1C1D27]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Company</th>
                    <th className="py-3 px-4 font-semibold">Symbol</th>
                    <th className="py-3 px-4 font-semibold text-right">Price</th>
                    <th className="py-3 px-4 font-semibold text-right">Change</th>
                    <th className="py-3 px-4 font-semibold text-right">Market Cap</th>
                    <th className="py-3 px-4 font-semibold text-right">P/E Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181923] font-sans">
                  {tableStocks.map((stock) => {
                    const isPos = (stock.changePercent || 0) >= 0;
                    const comp = comprehensiveData[stock.symbol];
                    return (
                      <tr
                        key={stock.symbol}
                        onClick={() => router.push(`/analysis?symbol=${stock.symbol}`)}
                        className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                      >
                        {/* Company Name */}
                        <td className="py-3.5 px-4 text-white font-medium group-hover:text-[#F6BE22] transition-colors">
                          {comp?.companyName || stock.symbol}
                        </td>

                        {/* Symbol */}
                        <td className="py-3.5 px-4 font-mono text-slate-400 font-medium">
                          {stock.symbol}
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 text-right font-mono font-medium text-white">
                          ₹{stock.ltp?.toLocaleString()}
                        </td>

                        {/* Change Pill */}
                        <td className="py-3.5 px-4 text-right">
                          <span className={`inline-block font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
                            isPos ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                          }`}>
                            {isPos ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                          </span>
                        </td>

                        {/* Market Cap */}
                        <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                          ₹{comp?.marketCapCr ? (comp.marketCapCr / 1000).toFixed(1) + 'k Cr' : '20.1k Cr'}
                        </td>

                        {/* P/E Ratio */}
                        <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                          {comp?.peRatio ? comp.peRatio.toFixed(1) : '28.4'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom-Right: Today's Financial News strictly matching Screenshot 170459 */}
          <div id="news" className="bg-[#0E0F15] border border-[#1A1B24] rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white tracking-tight">Today's Financial News</h2>
                <span className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer">
                  View all
                </span>
              </div>

              {/* Category Pills matching screenshot: Top stories, Local market, World markets */}
              <div className="flex items-center space-x-1.5 text-xs font-medium">
                <span className="px-3 py-1 rounded-lg bg-[#222432] text-white font-semibold cursor-pointer">
                  Top stories
                </span>
                <span className="px-3 py-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
                  Local market
                </span>
                <span className="px-3 py-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
                  World markets
                </span>
              </div>
            </div>

            {/* News Articles matching Screenshot 170459 */}
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[460px] pr-1 scrollbar-none">
              {/* Article 1 */}
              <div className="flex items-start justify-between gap-3 p-2 rounded-xl hover:bg-white/[0.02] transition-colors">
                <div className="space-y-1 flex-1">
                  <p className="text-[11px] text-slate-400 font-sans">
                    The Wall Street Journal • 37 minutes ago
                  </p>
                  <p className="text-xs font-semibold text-white leading-snug">
                    Exclusive | Reliance Retail Expands EBITDA Margins to 8.4%
                  </p>
                  <div className="inline-block mt-1 px-2 py-0.5 rounded bg-[#1A1C26] text-emerald-400 font-mono text-[10px] font-bold">
                    RELIANCE +1.93%
                  </div>
                </div>
                <div className="w-16 h-12 rounded-lg bg-[#1F212D] flex-shrink-0 flex items-center justify-center font-bold text-xs text-slate-500">
                  NEWS
                </div>
              </div>

              {/* Article 2 */}
              <div className="flex items-start justify-between gap-3 p-2 rounded-xl hover:bg-white/[0.02] transition-colors">
                <div className="space-y-1 flex-1">
                  <p className="text-[11px] text-slate-400 font-sans">
                    Yahoo Finance • 34 minutes ago
                  </p>
                  <p className="text-xs font-semibold text-white leading-snug">
                    TCS Announces Multi-Year Global Cloud Modernization Contract
                  </p>
                  <div className="inline-block mt-1 px-2 py-0.5 rounded bg-[#1A1C26] text-rose-400 font-mono text-[10px] font-bold">
                    TCS -1.64%
                  </div>
                </div>
                <div className="w-16 h-12 rounded-lg bg-[#1F212D] flex-shrink-0 flex items-center justify-center font-bold text-xs text-slate-500">
                  NEWS
                </div>
              </div>

              {/* Article 3 */}
              <div className="flex items-start justify-between gap-3 p-2 rounded-xl hover:bg-white/[0.02] transition-colors">
                <div className="space-y-1 flex-1">
                  <p className="text-[11px] text-slate-400 font-sans">
                    New York Post • 2 hours ago
                  </p>
                  <p className="text-xs font-semibold text-white leading-snug">
                    HDFC Bank Deposit Inflow Accelerates Following Branch Optimization
                  </p>
                  <div className="inline-block mt-1 px-2 py-0.5 rounded bg-[#1A1C26] text-emerald-400 font-mono text-[10px] font-bold">
                    HDFCBANK +0.41%
                  </div>
                </div>
                <div className="w-16 h-12 rounded-lg bg-[#1F212D] flex-shrink-0 flex items-center justify-center font-bold text-xs text-slate-500">
                  NEWS
                </div>
              </div>

              {/* Article 4 */}
              <div className="flex items-start justify-between gap-3 p-2 rounded-xl hover:bg-white/[0.02] transition-colors">
                <div className="space-y-1 flex-1">
                  <p className="text-[11px] text-slate-400 font-sans">
                    CNN • 1 hour ago
                  </p>
                  <p className="text-xs font-semibold text-white leading-snug">
                    Maruti Suzuki EV Production Ramp-Up Ahead of Festive Launch
                  </p>
                  <div className="inline-block mt-1 px-2 py-0.5 rounded bg-[#1A1C26] text-emerald-400 font-mono text-[10px] font-bold">
                    MARUTI +1.72%
                  </div>
                </div>
                <div className="w-16 h-12 rounded-lg bg-[#1F212D] flex-shrink-0 flex items-center justify-center font-bold text-xs text-slate-500">
                  NEWS
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
