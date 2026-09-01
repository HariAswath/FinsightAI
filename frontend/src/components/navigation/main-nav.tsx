'use client';

import React, { useState } from 'react';
import { Activity, Search, Star, User, ChevronDown, Bell, ShieldCheck, Sparkles, LayoutDashboard, LineChart, Grid, Bookmark, Newspaper, UserCheck } from 'lucide-react';
import { UserProfile } from '../../types';

export type NavTab = 'dashboard' | 'analysis' | 'heatmap' | 'watchlist' | 'news' | 'personalization';

interface MainNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSearch: () => void;
  currentProfile: UserProfile;
  onSelectProfile: (profile: UserProfile) => void;
}

export const MainNav: React.FC<MainNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenSearch,
  currentProfile,
  onSelectProfile
}) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const tabs: { id: NavTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analysis', label: 'Multi-Agent Analysis', icon: LineChart },
    { id: 'heatmap', label: 'Sector Heatmap', icon: Grid },
    { id: 'watchlist', label: 'Watchlist & Alerts', icon: Bookmark },
    { id: 'news', label: 'News Feed', icon: Newspaper },
    { id: 'personalization', label: 'Profile & Risk', icon: UserCheck }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#090A0F]/95 backdrop-blur-xl border-b border-white/10 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo - FinSight AI */}
        <div className="flex items-center space-x-8">
          <div 
            onClick={() => onSelectTab('dashboard')} 
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-[#090A0F]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center">
                Finsight<span className="text-amber-400 font-mono">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Multi-Agent Intelligence Engine</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#12131C] text-white border border-white/15 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Search Trigger & Profile Dropdown */}
        <div className="flex items-center space-x-4">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#12131C] border border-white/10 text-slate-400 hover:text-white hover:border-white/20 text-xs transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search symbol...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-black/40 text-slate-400 rounded border border-white/10">⌘K</kbd>
          </button>

          {/* User Profile Selector */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#12131C] border border-white/10 hover:border-white/20 text-xs text-white transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-[10px] text-white">
                {currentProfile.name.charAt(0)}
              </div>
              <span className="font-medium text-slate-200">{currentProfile.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#12131C] border border-white/10 shadow-2xl p-2 z-50 space-y-1">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-xs font-semibold text-white">{currentProfile.name}</p>
                  <p className="text-[10px] font-mono text-amber-400">Risk Profile: {currentProfile.riskTolerance}</p>
                </div>
                <button
                  onClick={() => {
                    onSelectTab('personalization');
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/5 hover:text-white flex items-center space-x-2"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Configure Risk Persona</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
