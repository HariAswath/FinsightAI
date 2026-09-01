'use client';

import React from 'react';
import { Sparkles, ShieldCheck, AlertTriangle, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';
import { SynthesisOutput, UserProfile } from '../../types';

interface SynthesisCardProps {
  synthesis: SynthesisOutput;
  userProfile: UserProfile;
}

export const SynthesisCard: React.FC<SynthesisCardProps> = ({ synthesis, userProfile }) => {
  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'STRONG_BUY':
      case 'CONSIDER_BUY':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'SMALL_ADD':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'HOLD':
      case 'WATCH':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default:
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border-2 border-blue-500/30 shadow-2xl relative overflow-hidden space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Synthesis Agent Output</h3>
            <p className="text-xs text-slate-400">Multi-Agent Intelligence + User Context Fusion</p>
          </div>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
          Latency: {synthesis.latencyMs}ms
        </span>
      </div>

      {/* CORE PRODUCT DEMO: Split View - Market View vs Personalized Decision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Market View (Objective Market Signals) */}
        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
            Objective Market View
          </span>
          <div className="flex items-baseline space-x-3">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">
              🟢 {synthesis.marketView}
            </span>
            <span className="text-sm font-mono text-slate-300">
              Confidence: <strong className="text-white">{(synthesis.confidence * 100).toFixed(0)}%</strong>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Consensus of Technical momentum (+82%), Statutory filing growth (+79%), and News sentiment.
          </p>
        </div>

        {/* Right Column: Personalized Decision (THE DIFFERENTIATOR!) */}
        <div className="p-5 rounded-2xl bg-blue-950/30 border border-blue-500/40 space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-300 font-semibold block">
              Personalized Decision for {userProfile.name}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${getDecisionBadge(synthesis.personalizedDecision)}`}>
              {synthesis.personalizedDecision.replace('_', ' ')}
            </span>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed font-sans pt-1">
            {synthesis.summary}
          </p>

          <div className="pt-2 flex items-center space-x-2 text-[11px] font-mono text-slate-400">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Profile: <strong className="text-white">{userProfile.riskTolerance}</strong> | Holding: <strong className="text-white">{(userProfile.portfolio['RELIANCE'] * 100).toFixed(0)}%</strong></span>
          </div>
        </div>
      </div>

      {/* Rationale & Key Evidence Bullets */}
      <div className="space-y-2 pt-2">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Synthesis Evidence Chains:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {synthesis.reasons.map((reason, idx) => (
            <div key={idx} className="flex items-start space-x-2 p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
