'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Search } from 'lucide-react';
import { useUser } from '@/context/user-context';

interface SignalistHeaderProps {
  onOpenSearch?: () => void;
}

export function SignalistHeader({ onOpenSearch }: SignalistHeaderProps) {
  const pathname = usePathname();
  const { username, personaDetails } = useUser();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Watchlist', href: '/dashboard#watchlist' },
    { label: 'News', href: '/dashboard#news' },
    { label: 'Analysis', href: '/analysis?symbol=RELIANCE' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#08080A]/95 backdrop-blur-md border-b border-[#1A1B24] px-6 py-3.5">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Brand Logo strictly matching Signalist screenshots */}
        <div className="flex items-center space-x-10">
          <Link href="/dashboard" className="flex items-center space-x-2.5 group">
            {/* Multi-color bars icon as in screenshot */}
            <div className="flex items-end space-x-0.5 h-6">
              <span className="w-1.5 h-3 bg-[#38BDF8] rounded-full"></span>
              <span className="w-1.5 h-4.5 bg-[#F6BE22] rounded-full"></span>
              <span className="w-1.5 h-6 bg-[#10B981] rounded-full"></span>
              <span className="w-1.5 h-4 bg-[#6366F1] rounded-full"></span>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Finsight<span className="text-[#F6BE22]">AI</span></span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link
              href="/dashboard"
              className={`transition-colors ${
                pathname === '/dashboard' ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <button
              onClick={onOpenSearch}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-medium"
            >
              Search
            </button>
            <Link
              href="/dashboard#watchlist"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Watchlist
            </Link>
            <Link
              href="/dashboard#news"
              className="text-slate-400 hover:text-white transition-colors"
            >
              News
            </Link>
            <Link
              href="/analysis?symbol=RELIANCE"
              className={`transition-colors flex items-center space-x-1.5 ${
                pathname.startsWith('/analysis') ? 'text-[#F6BE22] font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>AI Analysis</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F6BE22]"></span>
            </Link>
          </nav>
        </div>

        {/* Right Section: Persona + User Profile as in Screenshot */}
        <div className="flex items-center space-x-4">
          {/* Quick Search Button */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Search symbol (⌘K)"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Persona Tag */}
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#14151E] text-slate-300 border border-[#222430] hover:border-[#F6BE22]/40 transition-colors"
            title="Recalibrate Persona"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F6BE22] mr-1.5"></span>
            <span>{personaDetails?.label || 'Moderate'}</span>
          </Link>

          {/* User Profile matching Jane Smith layout */}
          <Link href="/login" className="flex items-center space-x-2.5 cursor-pointer group">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white border border-white/20">
              {username?.charAt(0)?.toUpperCase() || 'J'}
            </div>
            <span className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors">
              {username || 'Jane Smith'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </header>
  );
}
