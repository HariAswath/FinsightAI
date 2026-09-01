'use client';

import React, { useState, useEffect } from 'react';
import { MainNav, NavTab } from '../components/navigation/main-nav';
import { SearchModal } from '../components/navigation/search-modal';
import { IndexChart } from '../components/dashboard/index-chart';
import { MarketHeatmap } from '../components/dashboard/market-heatmap';
import { TopStories } from '../components/dashboard/top-stories';
import { TechnicalGauge } from '../components/analysis/technical-gauge';
import { FinancialsCard } from '../components/analysis/financials-card';
import { SynthesisCard } from '../components/dashboard/synthesis-card';
import { AgentCard } from '../components/dashboard/agent-card';
import { ExplainabilityPanel } from '../components/dashboard/explainability-panel';
import { DemoControls } from '../components/dashboard/demo-controls';
import { MetricsPanel } from '../components/dashboard/metrics-panel';
import { WatchlistTable } from '../components/watchlist/watchlist-table';
import { PersonalizationForm } from '../components/onboarding/personalization-form';
import { DEMO_PROFILES, DEMO_MARKET_DATA, runMultiAgentAnalysis } from '../services/agent-engine';
import { AnalysisSessionResult, UserProfile } from '../types';
import { Zap, AlertTriangle, ArrowRight } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedSymbol, setSelectedSymbol] = useState('RELIANCE');
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(DEMO_PROFILES.USER_A);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [watchlist, setWatchlist] = useState(['RELIANCE', 'TCS', 'HDFC', 'AAPL', 'NVDA', 'TSLA']);

  // Hackathon Resilience Switches
  const [simulateMissingData, setSimulateMissingData] = useState(false);
  const [simulateConflict, setSimulateConflict] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sessionResult, setSessionResult] = useState<AnalysisSessionResult | null>(null);

  const handleExecuteAnalysis = async (sym = selectedSymbol, prof = currentProfile) => {
    setIsAnalyzing(true);
    try {
      const result = await runMultiAgentAnalysis(sym, prof, {
        simulateMissingData,
        simulateConflict
      });
      setSessionResult(result);
    } catch (err) {
      console.error('Error running analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    handleExecuteAnalysis(selectedSymbol, currentProfile);
  }, [selectedSymbol, currentProfile, simulateMissingData, simulateConflict]);

  const handleSelectStockAndAnalyze = (symbol: string) => {
    setSelectedSymbol(symbol);
    setActiveTab('analysis');
  };

  const handleToggleWatchlist = (symbol: string) => {
    if (watchlist.includes(symbol)) {
      setWatchlist(watchlist.filter((s) => s !== symbol));
    } else {
      setWatchlist([...watchlist, symbol]);
    }
  };

  const currentMarketData = sessionResult?.marketData || DEMO_MARKET_DATA[selectedSymbol] || DEMO_MARKET_DATA.RELIANCE;

  return (
    <div className="min-h-screen bg-[#090A0F] text-white selection:bg-amber-500 selection:text-black flex flex-col font-sans">
      {/* Top Navbar matching Signalist Theme */}
      <MainNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        currentProfile={currentProfile}
        onSelectProfile={setCurrentProfile}
      />

      {/* Global Search Modal Overlay */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectStock={handleSelectStockAndAnalyze}
        watchlist={watchlist}
        onToggleWatchlist={handleToggleWatchlist}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {/* VIEW 1: DASHBOARD VIEW (Screenshot 2) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Market Summary Area Chart */}
            <IndexChart />

            {/* Sector Heatmap Grid */}
            <MarketHeatmap onSelectStock={handleSelectStockAndAnalyze} />

            {/* Top Stories & Market Indices Table */}
            <TopStories />
          </div>
        )}

        {/* VIEW 2: MULTI-AGENT STOCK ANALYSIS VIEW (Screenshot 3 + FinSight AI Core) */}
        {activeTab === 'analysis' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Hero Stock Header */}
            <div className="signalist-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">{currentMarketData.name}</h2>
                  <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-mono text-xs border border-amber-500/30 font-bold">
                    {currentMarketData.symbol}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Real-time statutory data, technical indicators &amp; multi-agent AI engine</p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="text-3xl font-bold font-mono text-white">
                    ₹{currentMarketData.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs font-mono font-semibold text-emerald-400">
                    +{currentMarketData.priceChangePercent}% (+₹{currentMarketData.priceChange})
                  </div>
                </div>

                <button
                  onClick={() => handleExecuteAnalysis()}
                  disabled={isAnalyzing}
                  className="gold-btn flex items-center space-x-2 text-xs font-bold cursor-pointer"
                >
                  <Zap className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing ? 'Analyzing...' : 'Re-Run Multi-Agent Engine'}</span>
                </button>
              </div>
            </div>

            {/* Resilience Test Controls */}
            <DemoControls
              simulateMissingData={simulateMissingData}
              onToggleMissingData={setSimulateMissingData}
              simulateConflict={simulateConflict}
              onToggleConflict={setSimulateConflict}
            />

            {/* Signal Alerts */}
            {sessionResult?.hasConflict && (
              <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-500/50 flex items-center space-x-3 text-amber-300 text-xs font-mono">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>⚠ SIGNAL CONFLICT DETECTED: Technical (Bullish) vs Sentiment (Bearish). Final decision adjusted to WATCH.</span>
              </div>
            )}

            {/* CORE SYNTHESIS CARD: Market View vs Personalized Decision */}
            {sessionResult && (
              <SynthesisCard
                synthesis={sessionResult.synthesis}
                userProfile={currentProfile}
              />
            )}

            {/* Split View: Technical Gauge & Profile (Right) + Parallel Agent Outputs (Left) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Columns: Parallel Agent Cards */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Parallel Agent Execution Outputs:
                </h3>
                {sessionResult && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AgentCard
                      output={sessionResult.technical}
                      title="Agent 1 — Technical Analyst"
                      agentType="technical"
                    />
                    <AgentCard
                      output={sessionResult.fundamental}
                      title="Agent 2 — Fundamental Analyst (RAG)"
                      agentType="fundamental"
                    />
                    <AgentCard
                      output={sessionResult.sentiment}
                      title="Agent 3 — Sentiment Analyst"
                      agentType="sentiment"
                    />
                  </div>
                )}

                {/* 7-Step Explainability Accordion */}
                {sessionResult && (
                  <ExplainabilityPanel reasoningSteps={sessionResult.synthesis.reasoningSteps} />
                )}
              </div>

              {/* Right 1 Column: Technical Gauge Meter & Profile/Financials Cards */}
              <div className="space-y-6">
                <TechnicalGauge
                  symbol={selectedSymbol}
                  signal="BUY"
                  score={78}
                />
                <FinancialsCard marketData={currentMarketData} />
              </div>
            </div>

            {/* Telemetry Metrics Panel */}
            {sessionResult && <MetricsPanel session={sessionResult} />}
          </div>
        )}

        {/* VIEW 3: SECTOR HEATMAP VIEW */}
        {activeTab === 'heatmap' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <MarketHeatmap onSelectStock={handleSelectStockAndAnalyze} />
          </div>
        )}

        {/* VIEW 4: WATCHLIST & ALERTS VIEW (Screenshot 5) */}
        {activeTab === 'watchlist' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <WatchlistTable onSelectStock={handleSelectStockAndAnalyze} />
          </div>
        )}

        {/* VIEW 5: NEWS FEED VIEW */}
        {activeTab === 'news' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <TopStories />
          </div>
        )}

        {/* VIEW 6: ONBOARDING / PERSONALIZATION FORM (Screenshot 1) */}
        {activeTab === 'personalization' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <PersonalizationForm
              currentProfile={currentProfile}
              onSaveProfile={setCurrentProfile}
              onCompleteOnboarding={() => setActiveTab('analysis')}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-white/10 text-center text-xs font-mono text-slate-500">
        <p>FinsightAI — Multi-Agent Autonomous Financial Intelligence System | Hackverse 2026</p>
      </footer>
    </div>
  );
}
