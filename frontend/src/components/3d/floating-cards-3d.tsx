'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Zap, FileText, TrendingUp, Cpu, Award } from 'lucide-react';

export const FloatingCards3D: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalize mouse coordinates to -1 ... 1
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-[450px] flex items-center justify-center perspective-1000 overflow-visible select-none">
      {/* Background Ambient Glow */}
      <div 
        className="absolute w-72 h-72 rounded-full bg-blue-600/20 blur-3xl transition-transform duration-500 pointer-events-none"
        style={{
          transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`
        }}
      />

      {/* CARD 1: 3D Technical Analyst Token (Top Right Layer) */}
      <div
        className="absolute z-30 w-72 p-5 rounded-2xl glass-card border border-blue-500/30 shadow-2xl transition-transform duration-200 ease-out cursor-pointer hover:border-blue-400/60"
        style={{
          transform: `translate3d(${mousePos.x * 25 + 60}px, ${mousePos.y * 20 - 70}px, 40px) rotateY(${mousePos.x * 12 + 10}deg) rotateX(${-mousePos.y * 12 - 5}deg)`,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-blue-400">Agent 01</p>
              <h4 className="text-sm font-semibold text-white">Technical Analyst</h4>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
            BULLISH 82%
          </span>
        </div>
        <div className="space-y-2 text-xs text-slate-300 font-mono">
          <div className="flex justify-between items-center bg-black/40 p-2 rounded-lg border border-white/5">
            <span className="text-slate-400">RSI (14)</span>
            <span className="text-blue-400 font-bold">62.4 (Strong)</span>
          </div>
          <div className="flex justify-between items-center bg-black/40 p-2 rounded-lg border border-white/5">
            <span className="text-slate-400">MACD Cross</span>
            <span className="text-emerald-400 font-bold">+4.40 Hist</span>
          </div>
        </div>
      </div>

      {/* CARD 2: 3D RAG Filing Document Card (Center Floating Layer) */}
      <div
        className="absolute z-20 w-80 p-5 rounded-2xl glass-card border border-sky-400/25 shadow-2xl transition-transform duration-200 ease-out cursor-pointer hover:border-sky-400/50"
        style={{
          transform: `translate3d(${mousePos.x * -20 - 40}px, ${mousePos.y * -15 + 20}px, 0px) rotateY(${mousePos.x * 15 - 8}deg) rotateX(${-mousePos.y * 15 + 4}deg)`,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-sky-400">RAG Document Verification</p>
              <h4 className="text-sm font-semibold text-white">RELIANCE Q1 Filing</h4>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">Page 12</span>
        </div>
        <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-300 leading-relaxed font-sans mb-2">
          &quot;Consolidated EBITDA for the quarter expanded <span className="text-sky-300 font-semibold">14.8% YoY</span> to ₹41,200 Cr. Capex intensity normalized.&quot;
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="flex items-center text-emerald-400">
            <Award className="w-3 h-3 mr-1" /> 94% Citation Confidence
          </span>
          <span>Verified Document</span>
        </div>
      </div>

      {/* CARD 3: 3D Portfolio Risk Shield Card (Bottom Right Background Layer) */}
      <div
        className="absolute z-10 w-72 p-5 rounded-2xl glass-card border border-indigo-500/30 shadow-2xl transition-transform duration-200 ease-out cursor-pointer hover:border-indigo-400/60"
        style={{
          transform: `translate3d(${mousePos.x * 15 + 80}px, ${mousePos.y * 25 + 110}px, -40px) rotateY(${mousePos.x * 10 + 5}deg) rotateX(${-mousePos.y * 10 - 2}deg)`,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-indigo-400">Risk Engine</p>
              <h4 className="text-sm font-semibold text-white">Portfolio Shield</h4>
            </div>
          </div>
          <span className="text-xs font-mono text-amber-400 font-bold">62/100 Index</span>
        </div>
        <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden mb-2 border border-white/5">
          <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 h-full w-[62%]" />
        </div>
        <p className="text-xs font-mono text-slate-400">
          Existing exposure: <span className="text-white font-bold">30% Concentration</span>
        </p>
      </div>

      {/* Floating Ambient Glowing Particles */}
      <div className="absolute top-10 left-20 w-3 h-3 rounded-full bg-blue-400/60 blur-sm animate-ping pointer-events-none" />
      <div className="absolute bottom-12 right-24 w-2 h-2 rounded-full bg-sky-300/80 blur-xs animate-pulse pointer-events-none" />
    </div>
  );
};
