'use client';

import React from 'react';
import { Cpu, ShieldCheck, UserCheck, Activity, ChevronRight, RefreshCw, ArrowLeft } from 'lucide-react';
import { UserProfile } from '../../types';
import { DEMO_PROFILES } from '../../services/agent-engine';

interface HeaderNavProps {
  currentProfile: UserProfile;
  onSelectProfile: (profile: UserProfile) => void;
  onBackToLanding?: () => void;
  isBackendConnected: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentProfile,
  onSelectProfile,
  onBackToLanding,
  isBackendConnected
}) => {
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-white/10 px-6 py-3.5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Institutional Badge */}
        <div className="flex items-center space-x-4">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="glass-pill p-2 rounded-xl text-slate-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
              title="Return to Landing Page"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">FinSight <span className="text-blue-400 font-mono">AI</span></span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Multi-Agent Engine v1.0
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live Backend Status Tag */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs font-mono">
          <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-slate-400">
            Engine Status: <strong className={isBackendConnected ? 'text-emerald-400' : 'text-amber-400'}>{isBackendConnected ? 'Express WS Active (<12ms)' : 'Demo Engine Fallback'}</strong>
          </span>
        </div>

        {/* Right: User Risk Persona Quick Switcher Pill */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 p-1 rounded-full bg-black/50 border border-white/10">
            {Object.values(DEMO_PROFILES).map((profile) => {
              const isSelected = profile.id === currentProfile.id;
              return (
                <button
                  key={profile.id}
                  onClick={() => onSelectProfile(profile)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {profile.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
