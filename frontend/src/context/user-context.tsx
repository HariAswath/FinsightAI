'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type RiskPersona = 'conservative' | 'moderate' | 'aggressive';

export interface PersonaDetails {
  id: RiskPersona;
  label: string;
  badgeColor: string;
  tagline: string;
  horizon: string;
  maxConcentrationPct: number;
  description: string;
  philosophy: string;
}

export const PERSONA_CONFIG: Record<RiskPersona, PersonaDetails> = {
  conservative: {
    id: 'conservative',
    label: 'Conservative',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    tagline: 'Capital Preservation & Margin of Safety',
    horizon: 'Long Term (3+ Years)',
    maxConcentrationPct: 10,
    description: 'Prioritizes robust balance sheets, low debt-to-equity, high dividend stability, and minimal drawdown risk.',
    philosophy: 'Throttles aggressive buys to HOLD or ACCUMULATE if valuation exceeds safety margins.'
  },
  moderate: {
    id: 'moderate',
    label: 'Moderate',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    tagline: 'Balanced Wealth Accumulation',
    horizon: 'Medium Term (1-3 Years)',
    maxConcentrationPct: 15,
    description: 'Balances structural business fundamentals with positive technical momentum and earnings growth.',
    philosophy: 'Follows consensus signals with systematic tranche accumulation.'
  },
  aggressive: {
    id: 'aggressive',
    label: 'Radical / Aggressive',
    badgeColor: 'bg-amber-500/10 text-[#F6BE22] border-amber-500/20',
    tagline: 'High Growth & Momentum Alpha',
    horizon: 'Short to Medium Term (<1 Year)',
    maxConcentrationPct: 25,
    description: 'Capitalizes on breakouts, volume anomalies, turnaround catalysts, and momentum surges.',
    philosophy: 'Executes rapid BUY orders when technical trend alignment and volume surges confirm momentum.'
  }
};

interface UserContextType {
  username: string;
  persona: RiskPersona;
  personaDetails: PersonaDetails;
  isLoggedIn: boolean;
  watchlist: string[];
  login: (username: string, persona: RiskPersona) => void;
  logout: () => void;
  setPersona: (persona: RiskPersona) => void;
  toggleWatchlist: (symbol: string) => void;
  isWatchlisted: (symbol: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsernameState] = useState<string>('Jane Smith');
  const [persona, setPersonaState] = useState<RiskPersona>('moderate');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [watchlist, setWatchlist] = useState<string[]>([
    'RELIANCE',
    'TCS',
    'HDFCBANK',
    'INFY',
    'MARUTI',
    'TITAN'
  ]);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('signalist_user');
      const savedPersona = localStorage.getItem('signalist_persona') as RiskPersona;
      const savedWatchlist = localStorage.getItem('signalist_watchlist');

      if (savedUser) {
        setUsernameState(savedUser);
      }
      if (savedPersona && PERSONA_CONFIG[savedPersona]) {
        setPersonaState(savedPersona);
      }
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
    } catch (e) {}
  }, []);

  const login = (newUsername: string, newPersona: RiskPersona) => {
    const trimmed = newUsername.trim() || 'Jane Smith';
    setUsernameState(trimmed);
    setPersonaState(newPersona);
    setIsLoggedIn(true);

    try {
      localStorage.setItem('signalist_user', trimmed);
      localStorage.setItem('signalist_persona', newPersona);
    } catch (e) {}
  };

  const logout = () => {
    setUsernameState('Jane Smith');
    setIsLoggedIn(false);
    try {
      localStorage.removeItem('signalist_user');
    } catch (e) {}
  };

  const setPersona = (newPersona: RiskPersona) => {
    setPersonaState(newPersona);
    try {
      localStorage.setItem('signalist_persona', newPersona);
    } catch (e) {}
  };

  const toggleWatchlist = (symbol: string) => {
    const upper = symbol.toUpperCase();
    setWatchlist((prev) => {
      const next = prev.includes(upper) ? prev.filter((s) => s !== upper) : [...prev, upper];
      try {
        localStorage.setItem('signalist_watchlist', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const isWatchlisted = (symbol: string) => watchlist.includes(symbol.toUpperCase());

  return (
    <UserContext.Provider
      value={{
        username,
        persona,
        personaDetails: PERSONA_CONFIG[persona],
        isLoggedIn,
        watchlist,
        login,
        logout,
        setPersona,
        toggleWatchlist,
        isWatchlisted
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
