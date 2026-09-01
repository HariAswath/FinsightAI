'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShieldCheck, TrendingUp, Flame } from 'lucide-react';
import { useUser, RiskPersona, PERSONA_CONFIG } from '@/context/user-context';

export default function LoginPage() {
  const router = useRouter();
  const { login, username: initialUser, persona: initialPersona } = useUser();

  const [username, setUsername] = useState<string>(initialUser === 'Guest Trader' ? '' : initialUser);
  const [selectedPersona, setSelectedPersona] = useState<RiskPersona>(initialPersona || 'moderate');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username or email to continue.');
      return;
    }

    login(username.trim(), selectedPersona);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-[#F6BE22] selection:text-black">
      {/* Left Column: Log In Your Account form strictly matching Screenshot 170509 */}
      <div className="w-full md:w-5/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
        {/* Brand Logo */}
        <div>
          <Link href="/dashboard" className="flex items-center space-x-2.5">
            <div className="flex items-end space-x-0.5 h-6">
              <span className="w-1.5 h-3 bg-[#38BDF8] rounded-full"></span>
              <span className="w-1.5 h-4.5 bg-[#F6BE22] rounded-full"></span>
              <span className="w-1.5 h-6 bg-[#10B981] rounded-full"></span>
              <span className="w-1.5 h-4 bg-[#6366F1] rounded-full"></span>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Finsight<span className="text-[#F6BE22]">AI</span></span>
          </Link>
        </div>

        {/* Center Form */}
        <div className="max-w-md w-full my-auto py-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-8 tracking-tight">
            Log In Your Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username / Handle Field */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Username / Trader Handle
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your username (e.g. Jane Smith)"
                className="w-full px-4 py-3.5 bg-[#14151B] border border-[#21232D] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#F6BE22] transition-colors font-medium"
              />
              {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
            </div>

            {/* Investor Persona Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Select Investor Persona (Risk Calibration)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPersona('conservative')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedPersona === 'conservative'
                      ? 'bg-emerald-500/15 border-emerald-500 text-white'
                      : 'bg-[#14151B] border-[#21232D] text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                  <p className="text-xs font-bold">Conservative</p>
                  <p className="text-[10px] text-slate-400">10% Cap</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPersona('moderate')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedPersona === 'moderate'
                      ? 'bg-blue-500/15 border-blue-500 text-white'
                      : 'bg-[#14151B] border-[#21232D] text-slate-400 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                  <p className="text-xs font-bold">Moderate</p>
                  <p className="text-[10px] text-slate-400">15% Cap</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPersona('aggressive')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedPersona === 'aggressive'
                      ? 'bg-amber-500/15 border-[#F6BE22] text-white'
                      : 'bg-[#14151B] border-[#21232D] text-slate-400 hover:text-white'
                  }`}
                >
                  <Flame className="w-4 h-4 mx-auto mb-1 text-[#F6BE22]" />
                  <p className="text-xs font-bold">Radical</p>
                  <p className="text-[10px] text-slate-400">25% Cap</p>
                </button>
              </div>
            </div>

            {/* Solid Gold Log In Button matching Screenshot 170509 */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#F6BE22] hover:bg-[#E5AF1D] font-bold text-sm text-black transition-all shadow-md cursor-pointer"
            >
              Log In
            </button>

            <p className="text-center text-xs text-slate-400 pt-2">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setUsername('Jane Smith');
                  setSelectedPersona('moderate');
                }}
                className="font-semibold text-white hover:underline cursor-pointer"
              >
                Sign Up (Quick Demo)
              </button>
            </p>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-[11px] text-slate-500">
          FinsightAI Institutional Financial Intelligence Platform
        </p>
      </div>

      {/* Right Column: Testimonial + Dashboard Mockup matching Screenshot 170509 */}
      <div className="hidden md:flex w-full md:w-7/12 bg-[#111217] border-l border-[#1A1B24] p-12 lg:p-16 flex-col justify-between overflow-hidden relative">
        {/* Testimonial Quote */}
        <div className="max-w-lg space-y-4">
          <p className="text-lg lg:text-xl font-medium text-slate-100 leading-relaxed">
            "FinsightAI turned my watchlist into a winning list. The alerts are spot-on, and I feel more confident making moves in the market"
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm text-white">— Ethan R.</p>
              <p className="text-xs text-slate-400">Retail Investor</p>
            </div>
            {/* 5 Stars */}
            <div className="flex items-center space-x-1 text-[#F6BE22]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#F6BE22]" />
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Preview Frame matching screenshot */}
        <div className="mt-8 rounded-2xl bg-[#08080A] border border-[#21232D] shadow-2xl p-4 overflow-hidden relative translate-x-4 translate-y-4 scale-[1.02]">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A1B24] mb-3 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-xs">FinsightAI</span>
              <span className="text-[10px] text-slate-400 font-mono">Terminal Active</span>
            </div>
            <div className="flex items-center space-x-4 text-slate-400 text-[11px]">
              <span className="text-white font-medium">Dashboard</span>
              <span>Search</span>
              <span>Watchlist</span>
              <span>News</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="col-span-2 p-3 bg-[#12131A] rounded-xl border border-[#1F212D] space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Market Summary</span>
              <p className="font-mono text-base font-bold text-white">NIFTY 50 • ₹23,965.00</p>
              <div className="h-16 w-full flex items-end">
                <svg viewBox="0 0 100 30" className="w-full h-full">
                  <path d="M0,25 Q20,10 40,20 T70,5 T100,15" fill="none" stroke="#10B981" strokeWidth="2" />
                </svg>
              </div>
            </div>

            <div className="p-3 bg-[#12131A] rounded-xl border border-[#1F212D] space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Watchlist</span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-white font-bold">RELIANCE</span>
                  <span className="text-emerald-400">+1.93%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white font-bold">TCS</span>
                  <span className="text-rose-400">-1.64%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white font-bold">HDFCBANK</span>
                  <span className="text-emerald-400">+0.41%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
