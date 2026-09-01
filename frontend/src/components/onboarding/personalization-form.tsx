'use client';

import React, { useState } from 'react';
import { UserCheck, Star, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserProfile, RiskLevel, InvestmentHorizon } from '../../types';

interface PersonalizationFormProps {
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onCompleteOnboarding: () => void;
}

export const PersonalizationForm: React.FC<PersonalizationFormProps> = ({
  currentProfile,
  onSaveProfile,
  onCompleteOnboarding
}) => {
  const [fullName, setFullName] = useState(currentProfile.name);
  const [email, setEmail] = useState('investor@finsight.ai');
  const [country, setCountry] = useState('India');
  const [investmentGoal, setInvestmentGoal] = useState<InvestmentHorizon>(currentProfile.investmentHorizon);
  const [riskTolerance, setRiskTolerance] = useState<RiskLevel>(currentProfile.riskTolerance);
  const [preferredIndustry, setPreferredIndustry] = useState('Energy & Retail');
  const [existingHolding, setExistingHolding] = useState('30'); // 30% concentration

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentProfile,
      name: fullName || 'Retail Investor',
      riskTolerance,
      investmentHorizon: investmentGoal,
      portfolio: {
        RELIANCE: parseFloat(existingHolding) / 100,
        TCS: 0.20,
        HDFC: 0.15,
        CASH: 1 - (parseFloat(existingHolding) / 100 + 0.35)
      }
    };
    onSaveProfile(updated);
    onCompleteOnboarding();
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-6">
      {/* Left Column: Sign Up & Personalization Form */}
      <div className="signalist-card p-8 space-y-6">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Contextual Risk Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Sign Up &amp; Personalize</h2>
          <p className="text-xs text-slate-400 mt-1">Configure your risk profile to enable personalized investment synthesis.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-slate-300 block">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-black/50 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-slate-300 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Country */}
          <div className="space-y-1">
            <label className="text-slate-300 block">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-black/50 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 transition-colors"
            >
              <option value="India">🇮🇳 India</option>
              <option value="United States">🇺🇸 United States</option>
              <option value="Australia">🇦🇺 Australia</option>
              <option value="United Kingdom">🇬🇧 United Kingdom</option>
            </select>
            <span className="text-[10px] text-slate-500 block">Helps us show statutory filings and tax regulation relevant to you.</span>
          </div>

          {/* Investment Goals */}
          <div className="space-y-1">
            <label className="text-slate-300 block">Investment Goals</label>
            <select
              value={investmentGoal}
              onChange={(e) => setInvestmentGoal(e.target.value as InvestmentHorizon)}
              className="w-full bg-black/50 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 transition-colors"
            >
              <option value="LONG_TERM">Long-Term Growth &amp; Wealth Compound</option>
              <option value="MEDIUM_TERM">Medium-Term Capital Appreciation</option>
              <option value="SHORT_TERM">Short-Term Alpha Momentum</option>
            </select>
          </div>

          {/* Risk Tolerance */}
          <div className="space-y-1">
            <label className="text-slate-300 block text-amber-400 font-bold">Risk Tolerance (Personalization Layer)</label>
            <select
              value={riskTolerance}
              onChange={(e) => setRiskTolerance(e.target.value as RiskLevel)}
              className="w-full bg-black/50 border border-amber-500/40 rounded-xl p-3 text-amber-300 font-bold focus:outline-none focus:border-amber-400 transition-colors"
            >
              <option value="CONSERVATIVE">🛡 CONSERVATIVE (Strict max 20% concentration limit)</option>
              <option value="MODERATE">⚖ MODERATE (Balanced growth and risk control)</option>
              <option value="AGGRESSIVE">⚡ AGGRESSIVE (High conviction alpha opportunity focus)</option>
            </select>
          </div>

          {/* Existing Stock Holding Percentage */}
          <div className="space-y-1">
            <label className="text-slate-300 block">Current RELIANCE Portfolio Concentration (%)</label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="0"
                max="50"
                value={existingHolding}
                onChange={(e) => setExistingHolding(e.target.value)}
                className="flex-1 accent-amber-500 cursor-pointer"
              />
              <span className="text-sm font-bold text-amber-400 font-mono">{existingHolding}%</span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              Directly influences Synthesis Agent output (`SMALL ADD` vs `CONSIDER BUY`).
            </span>
          </div>

          {/* Gold Accent Primary Button */}
          <button
            type="submit"
            className="w-full gold-btn text-center cursor-pointer flex items-center justify-center space-x-2 pt-3 pb-3 mt-4"
          >
            <span>Start Your Investing Journey</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Right Column: Testimonial */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex space-x-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400" />
            ))}
          </div>

          <blockquote className="text-xl font-semibold text-white leading-relaxed italic">
            &quot;FinsightAI turned my watchlist into winning decisions. The multi-agent evidence synthesis and risk concentration alerts give me 100% confidence making moves in the market.&quot;
          </blockquote>

          <div className="text-xs font-mono">
            <span className="text-white font-bold block">— Ethan R.</span>
            <span className="text-slate-400">Retail Investor &amp; Beta User</span>
          </div>
        </div>

        {/* Mini Preview Card */}
        <div className="signalist-card p-5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono border-b border-white/10 pb-2">
            <span className="text-amber-400 font-bold">FinsightAI Personalization Matrix</span>
            <span className="text-emerald-400">ACTIVE</span>
          </div>
          <div className="space-y-2 text-xs text-slate-300 font-sans">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Same Market Data + Different User Risk = Tailored Recommendation</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% RAG Evidence Attribution with Page Numbers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
