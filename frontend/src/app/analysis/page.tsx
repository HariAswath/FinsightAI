'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Star, 
  ArrowLeft, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  TrendingUp,
  TrendingDown,
  Activity,
  ChevronDown
} from 'lucide-react';
import { ApiService, FinalRecommendation, ComprehensiveEquityData } from '@/services/api.service';
import { useUser, PERSONA_CONFIG } from '@/context/user-context';
import { SignalistHeader } from '@/components/navigation/signalist-header';
import { SearchModal } from '@/components/navigation/search-modal';

function AnalysisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const symbolParam = searchParams.get('symbol') || 'RELIANCE';

  const { username, persona, personaDetails, watchlist, toggleWatchlist, isWatchlisted } = useUser();

  const [selectedSymbol, setSelectedSymbol] = useState<string>(symbolParam.toUpperCase());
  const [equityData, setEquityData] = useState<ComprehensiveEquityData | null>(null);
  const [recommendation, setRecommendation] = useState<FinalRecommendation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<string>('1D');

  // Related stocks list
  const relatedStocks = [
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 2360.00, change: -1.64 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', price: 711.90, change: +0.41 },
    { symbol: 'INFY', name: 'Infosys Limited', price: 1345.50, change: -0.28 },
    { symbol: 'MARUTI', name: 'Maruti Suzuki India', price: 12500.00, change: +1.72 },
    { symbol: 'TITAN', name: 'Titan Company Limited', price: 3450.00, change: -0.55 }
  ];

  useEffect(() => {
    if (symbolParam) {
      setSelectedSymbol(symbolParam.toUpperCase());
      setRecommendation(null);
    }
  }, [symbolParam]);

  // Fetch equity context from backend
  useEffect(() => {
    ApiService.getEquity(selectedSymbol)
      .then((res: { quote: any; comprehensive?: ComprehensiveEquityData }) => {
        if (res.comprehensive) {
          setEquityData(res.comprehensive);
        } else if (res.quote) {
          setEquityData({
            symbol: res.quote.symbol,
            companyName: `${res.quote.symbol} Ltd.`,
            sector: 'Indian Equities',
            exchange: 'NSE',
            ltp: res.quote.ltp,
            closePrice: res.quote.closePrice || res.quote.ltp,
            openPrice: res.quote.openPrice || res.quote.ltp,
            highPrice: res.quote.highPrice || res.quote.ltp * 1.01,
            lowPrice: res.quote.lowPrice || res.quote.ltp * 0.99,
            change: res.quote.change || 0,
            changePercent: res.quote.changePercent || 0,
            volume: res.quote.volume || 1000000,
            week52High: res.quote.ltp * 1.15,
            week52Low: res.quote.ltp * 0.85,
            peRatio: 28.4,
            marketCapCr: 2018500,
            updatedAt: res.quote.updatedAt
          });
        }
      })
      .catch(() => {});
  }, [selectedSymbol]);

  // Execute multi-agent analysis on-demand
  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await ApiService.analyze(selectedSymbol, persona);
      setRecommendation(result);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Multi-agent analysis failed. Please verify backend connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Automatically run multi-agent analysis when symbol or persona changes
  useEffect(() => {
    handleRunAnalysis();
  }, [selectedSymbol, persona]);

  const ltp = equityData?.ltp || 1301.70;
  const changePct = equityData?.changePercent || 1.93;
  const isPos = changePct >= 0;
  const isStarred = isWatchlisted(selectedSymbol);

  // Candlestick mock points for chart
  const candlePoints = [
    { time: '00:00', open: ltp * 0.992, high: ltp * 0.998, low: ltp * 0.989, close: ltp * 0.995 },
    { time: '03:00', open: ltp * 0.995, high: ltp * 1.002, low: ltp * 0.993, close: ltp * 0.998 },
    { time: '07:00', open: ltp * 0.998, high: ltp * 1.006, low: ltp * 0.996, close: ltp * 1.004 },
    { time: '11:00', open: ltp * 1.004, high: ltp * 1.012, low: ltp * 1.001, close: ltp * 1.008 },
    { time: '14:00', open: ltp * 1.008, high: ltp * 1.015, low: ltp * 1.005, close: ltp * 1.012 },
    { time: '18:00', open: ltp * 1.012, high: ltp * 1.020, low: ltp * 1.009, close: ltp }
  ];

  return (
    <div className="min-h-screen bg-[#08080A] text-slate-100 flex flex-col font-sans selection:bg-[#F6BE22] selection:text-black">
      {/* Header matching Signalist screenshots */}
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

      {/* Main Stock Detail Layout strictly matching Screenshot 170430 */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-6 space-y-6">
        {/* ROW 1: Main Chart Card (2 cols) + Overview Card (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top-Left: Stock Chart Container matching Screenshot 1 */}
          <div className="lg:col-span-2 bg-[#0E0F15] border border-[#1A1B24] rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
            {/* Header: Company Logo, Name, Symbol, Exchange, Sector, Star, Price & Timeframes */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                {/* Logo box */}
                <div className="w-10 h-10 rounded-xl bg-[#181923] border border-[#252736] flex items-center justify-center font-bold text-sm text-[#10B981]">
                  {selectedSymbol.slice(0, 2)}
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <span className="font-semibold text-white">
                      {equityData?.companyName || selectedSymbol}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-slate-300">{selectedSymbol}</span>
                    <span>•</span>
                    <span>NSE</span>
                    <span>•</span>
                    <span>{equityData?.sector || 'Equities'}</span>
                    <button
                      onClick={() => toggleWatchlist(selectedSymbol)}
                      className="text-[#F6BE22] hover:scale-110 transition-transform ml-1 cursor-pointer"
                    >
                      <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-[#F6BE22]' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-baseline space-x-2.5 mt-1">
                    <span className="text-2xl font-extrabold text-white font-mono">
                      ₹{ltp.toLocaleString()}
                    </span>
                    <span className={`text-xs font-semibold font-mono ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPos ? '+' : ''}{(equityData?.change || 24.5).toFixed(2)} ({isPos ? '+' : ''}{changePct.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeframe selector: 1D, 5D, 1M, 1Y */}
              <div className="flex items-center space-x-1 bg-[#14151D] p-1 rounded-xl border border-[#21232E] text-xs font-mono">
                {['1D', '5D', '1M', '1Y'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      timeframe === tf ? 'bg-white text-black font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Candlestick & Volume Chart with Left Tools */}
            <div className="relative w-full h-[280px] rounded-xl bg-[#090A0E] border border-[#171821] p-4 flex">
              {/* Left Toolbar matching Screenshot 1 */}
              <div className="flex flex-col justify-between items-center py-2 pr-4 border-r border-[#1C1D27] text-slate-500 text-xs">
                <span className="hover:text-white cursor-pointer">T</span>
                <span className="hover:text-white cursor-pointer">📈</span>
                <span className="hover:text-white cursor-pointer">◎</span>
                <span className="hover:text-white cursor-pointer">✎</span>
                <span className="hover:text-white cursor-pointer">⌕</span>
                <span className="hover:text-white cursor-pointer">🗑</span>
              </div>

              {/* Chart Body */}
              <div className="flex-1 flex flex-col justify-between pl-4 relative">
                {/* Price candles SVG */}
                <div className="flex-1 relative flex items-end justify-between px-4 pb-4">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                    <div className="border-b border-white"></div>
                    <div className="border-b border-white"></div>
                    <div className="border-b border-white"></div>
                    <div className="border-b border-white"></div>
                  </div>

                  {/* Candles */}
                  {[
                    { h: 60, bull: false }, { h: 80, bull: true }, { h: 110, bull: true },
                    { h: 75, bull: false }, { h: 90, bull: true }, { h: 140, bull: true },
                    { h: 120, bull: false }, { h: 155, bull: true }, { h: 135, bull: false },
                    { h: 170, bull: true }, { h: 160, bull: false }, { h: 190, bull: true },
                    { h: 180, bull: true }, { h: 150, bull: false }, { h: 195, bull: true }
                  ].map((c, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className={`w-[2px] h-4 ${c.bull ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}></div>
                      <div
                        style={{ height: `${c.h * 0.7}px` }}
                        className={`w-2.5 rounded-xs ${c.bull ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}
                      ></div>
                      <div className={`w-[2px] h-3 ${c.bull ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}></div>
                    </div>
                  ))}

                  {/* Price Tag Pill */}
                  <div className="absolute right-0 top-1/3 bg-rose-500 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                    ₹{ltp.toFixed(2)}
                  </div>
                </div>

                {/* Bottom Time Axis matching screenshot: 00:00, 03:00, 07:00, 11:00, 14:00, 18:00 */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-[#1C1D27]">
                  <span>00:00</span>
                  <span>03:00</span>
                  <span>07:00</span>
                  <span>11:00</span>
                  <span>14:00</span>
                  <span>18:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top-Right: Overview Card strictly matching Screenshot 1 */}
          <div className="bg-[#0E0F15] border border-[#1A1B24] rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white tracking-tight">Overview</h3>
              {/* Solid Gold Create Alert Button matching screenshot */}
              <button
                type="button"
                onClick={() => alert(`Alert set for ${selectedSymbol} at ₹${ltp}`)}
                className="px-4 py-1.5 rounded-lg bg-[#F6BE22] hover:bg-[#E5AF1D] text-black text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Create Alert
              </button>
            </div>

            {/* Today's Range Section */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Today's Range</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#F6BE22]"></span>
                    <span className="text-slate-400">Open:</span>
                  </div>
                  <span className="font-mono text-white font-medium">₹{(equityData?.openPrice || ltp * 0.99).toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                    <span className="text-slate-400">High:</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-medium">₹{(equityData?.highPrice || ltp * 1.02).toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>
                    <span className="text-slate-400">Low:</span>
                  </div>
                  <span className="font-mono text-rose-400 font-medium">₹{(equityData?.lowPrice || ltp * 0.98).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* More Info Section */}
            <div className="space-y-3 pt-2 border-t border-[#1C1D27]">
              <p className="text-xs font-bold text-white uppercase tracking-wider">More Info</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="text-slate-400">Market Cap:</span>
                  </div>
                  <span className="font-mono text-white font-medium">₹{equityData?.marketCapCr ? (equityData.marketCapCr / 1000).toFixed(1) + 'k Cr' : '20.1k Cr'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span className="text-slate-400">P/E Ratio:</span>
                  </div>
                  <span className="font-mono text-white font-medium">{equityData?.peRatio || '28.4'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span className="text-slate-400">EPS:</span>
                  </div>
                  <span className="font-mono text-white font-medium">₹45.80</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span className="text-slate-400">Previous Close:</span>
                  </div>
                  <span className="font-mono text-white font-medium">₹{(equityData?.closePrice || ltp * 0.99).toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span className="text-slate-400">Currency:</span>
                  </div>
                  <span className="font-mono text-white font-medium">INR</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Analysis & Company Info (Col 1) + Latest News (Col 2) + Related Stocks (Col 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bottom-Left: Analysis Box + Company Info Box strictly matching Screenshot 1 */}
          <div className="space-y-6">
            {/* Analysis Box strictly matching Screenshot 1 with dynamic AI multi-agent values */}
            <div className="bg-[#0E0F15] border border-[#1A1B24] rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white tracking-tight">AI Agent Analysis</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A1B26] text-[#F6BE22] border border-[#2A2C3E]">
                  {personaDetails?.label || 'Moderate'}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Dynamic Rating / Action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span className="text-slate-400">Rating:</span>
                  </div>
                  {isAnalyzing ? (
                    <span className="flex items-center space-x-1 font-mono text-[11px] text-slate-400 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Synthesizing...</span>
                    </span>
                  ) : (
                    <span className={`px-2.5 py-0.5 rounded font-bold text-xs font-mono border ${
                      recommendation?.action === 'BUY' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      recommendation?.action === 'ACCUMULATE' ? 'bg-teal-500/20 text-teal-400 border-teal-500/30' :
                      recommendation?.action === 'HOLD' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                      'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}>
                      {recommendation?.action || 'HOLD'}
                    </span>
                  )}
                </div>

                {/* Dynamic Sentiment */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                    <span className="text-slate-400">Sentiment:</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded font-semibold text-xs font-mono ${
                    recommendation?.agents?.Sentiment?.signal === 'BULLISH' ? 'bg-emerald-500/15 text-emerald-400' :
                    recommendation?.agents?.Sentiment?.signal === 'BEARISH' ? 'bg-rose-500/15 text-rose-400' :
                    'bg-white/10 text-slate-300'
                  }`}>
                    {recommendation?.agents?.Sentiment?.signal || 'Neutral'}
                  </span>
                </div>

                {/* Dynamic Conviction */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#F6BE22]"></span>
                    <span className="text-slate-400">Conviction:</span>
                  </div>
                  <span className="font-mono text-white font-bold">
                    {recommendation?.overallConfidence ? `${recommendation.overallConfidence}%` : '68%'}
                  </span>
                </div>
              </div>

              {/* On-Demand Multi-Agent Trigger Button */}
              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="w-full py-2.5 rounded-xl bg-[#F6BE22] hover:bg-[#E5AF1D] text-black font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Multi-Agent Engine...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Re-Run Multi-Agent Engine</span>
                  </>
                )}
              </button>
            </div>

            {/* Company Info Box matching Screenshot 1 */}
            <div className="bg-[#0E0F15] border border-[#1A1B24] rounded-2xl p-5 shadow-xl space-y-3 text-xs">
              <h3 className="text-base font-bold text-white tracking-tight">Company Info</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">IPO:</span>
                  <span className="text-white font-mono">1999-01-22</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Country:</span>
                  <span className="text-white font-mono">IN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shares:</span>
                  <span className="text-white font-mono">6,765M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Employees (FY):</span>
                  <span className="text-white font-mono">236K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ISIN:</span>
                  <span className="text-white font-mono">INE002A01018</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Website:</span>
                  <a href="https://reliance.com" target="_blank" className="text-[#F6BE22] hover:underline font-mono">
                    {selectedSymbol.toLowerCase()}.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom-Center: Latest News matching Screenshot 1 */}
          <div className="bg-[#0E0F15] border border-[#1A1B24] rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight">Latest News</h3>
            <div className="space-y-4">
              {/* News Item 1 */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#1C1D27]">
                <div className="space-y-1.5">
                  <p className="text-[10px] text-slate-400">The Wall Street Journal • 37 minutes ago</p>
                  <p className="text-xs font-semibold text-white leading-snug">
                    {selectedSymbol} expands retail and digital presence with strong return on capital.
                  </p>
                  <button className="text-[11px] font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer">
                    Read More
                  </button>
                </div>
                <div className="w-14 h-12 rounded-lg bg-[#1F212D] flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-500">
                  NEWS
                </div>
              </div>

              {/* News Item 2 */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#1C1D27]">
                <div className="space-y-1.5">
                  <p className="text-[10px] text-slate-400">Yahoo Finance • 34 minutes ago</p>
                  <p className="text-xs font-semibold text-white leading-snug">
                    Brokerage consensus projects 18% upside on quarterly order book expansion.
                  </p>
                  <button className="text-[11px] font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer">
                    Read More
                  </button>
                </div>
                <div className="w-14 h-12 rounded-lg bg-[#1F212D] flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-500">
                  NEWS
                </div>
              </div>

              {/* News Item 3 */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <p className="text-[10px] text-slate-400">Economic Times • 1 hour ago</p>
                  <p className="text-xs font-semibold text-white leading-snug">
                    Institutional foreign flows turn positive following clean SEBI audit disclosure.
                  </p>
                  <button className="text-[11px] font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer">
                    Read More
                  </button>
                </div>
                <div className="w-14 h-12 rounded-lg bg-[#1F212D] flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-500">
                  NEWS
                </div>
              </div>
            </div>
          </div>

          {/* Bottom-Right: Related Stocks matching Screenshot 1 */}
          <div className="bg-[#0E0F15] border border-[#1A1B24] rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight">Related stocks</h3>
            <div className="space-y-3">
              {relatedStocks.map((stk) => {
                const isStkPos = stk.change >= 0;
                return (
                  <div
                    key={stk.symbol}
                    onClick={() => router.push(`/analysis?symbol=${stk.symbol}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-[#171822] border border-[#222430] flex items-center justify-center font-bold text-xs text-white">
                        {stk.symbol.slice(0, 1)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white group-hover:text-[#F6BE22] transition-colors">
                          {stk.name}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400">{stk.symbol}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-white font-mono">₹{stk.price.toLocaleString()}</p>
                      <p className={`text-[11px] font-mono ${isStkPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isStkPos ? '+' : ''}{stk.change.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* POST-ANALYSIS RESULTS VIEW (When Multi-Agent Engine Runs) */}
        {recommendation && (
          <div className="bg-[#0E0F15] border border-[#1A1B24] rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1C1D27]">
              <div>
                <span className="text-[10px] font-mono text-[#F6BE22] uppercase font-bold">
                  Autonomous Multi-Agent Synthesis
                </span>
                <h3 className="text-xl font-bold text-white">
                  Recommendation: {recommendation.action} ({recommendation.overallConfidence}% Conviction)
                </h3>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-400 font-mono">Calibrated For: </span>
                <span className="font-bold text-white">
                  {recommendation.personalization?.profile?.riskTolerance || recommendation.personalization?.appliedProfile?.riskTolerance || personaDetails?.label || 'Moderate'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed bg-[#13141C] p-4 rounded-xl border border-[#1E202C]">
              {recommendation.executiveSummary}
            </p>

            {/* 3 Specialized Agents Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#13141C] border border-[#1E202C] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">Fundamentals Agent</span>
                  <span className="text-emerald-400 font-mono">{recommendation.agents?.Fundamentals?.signal || 'BULLISH'}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {recommendation.agents?.Fundamentals?.reasoning || 'Evaluated quarterly revenue growth and balance sheet health.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#13141C] border border-[#1E202C] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">Technical Agent</span>
                  <span className="text-emerald-400 font-mono">{recommendation.agents?.Technical?.signal || 'BULLISH'}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {recommendation.agents?.Technical?.reasoning || 'Analyzed RSI-14, MACD signal crossover, and volume expansion.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#13141C] border border-[#1E202C] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">Sentiment Agent</span>
                  <span className="text-amber-400 font-mono">{recommendation.agents?.Sentiment?.signal || 'NEUTRAL'}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {recommendation.agents?.Sentiment?.reasoning || 'Derived market narrative tone from disclosures and financial news.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#08080A] text-slate-100 flex items-center justify-center font-mono text-xs text-slate-400">
        Loading FinsightAI Analysis...
      </div>
    }>
      <AnalysisContent />
    </React.Suspense>
  );
}
