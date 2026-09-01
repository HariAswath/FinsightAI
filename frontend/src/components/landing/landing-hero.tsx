'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Cpu, Sparkles, Activity, FileCheck, Layers } from 'lucide-react';
import { FloatingCards3D } from '../3d/floating-cards-3d';

interface LandingHeroProps {
  onLaunchApp: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onLaunchApp }) => {
  return (
    <section className="relative pt-12 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden">
      {/* Left Column: Headline & Action Pills */}
      <div className="flex-1 space-y-6 text-left z-10">
        {/* Institutional Grade Top Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-mono font-medium tracking-wide text-blue-300 uppercase">
            Institutional Grade Autonomous Intelligence
          </span>
        </div>

        {/* Large Crisp High-Contrast Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
          Multi-Agent <br />
          <span className="gradient-text">Autonomous Financial</span> <br />
          Intelligence.
        </h1>

        {/* Subheadline Paragraph */}
        <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
          Transform raw price momentum, statutory financial filings, and news signals into <strong className="text-slate-200">explainable, evidence-backed investment decisions</strong> tailored specifically to your risk profile.
        </p>

        {/* Action Capsule Pill Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={onLaunchApp}
            className="primary-pill-btn flex items-center space-x-2 text-sm font-semibold cursor-pointer group"
          >
            <span>Launch Intelligence App</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <a
            href="#architecture"
            className="glass-pill px-6 py-2.5 rounded-full text-sm font-medium text-slate-300 hover:text-white flex items-center space-x-2 border border-white/10"
          >
            <Cpu className="w-4 h-4 text-sky-400" />
            <span>Explore 3D Engine</span>
          </a>
        </div>

        {/* Telemetry Stats Bar matching Mecha Pay footer tags */}
        <div className="pt-6 border-t border-white/10 flex items-center space-x-8 text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>WS LATENCY: <strong className="text-white">&lt; 12ms</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>RAG CITATIONS: <strong className="text-white">VERIFIED</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>AGENTS: <strong className="text-white">3 ASYNC + RISK</strong></span>
          </div>
        </div>
      </div>

      {/* Right Column: Floating 3D Financial Cards Component */}
      <div className="flex-1 w-full relative">
        <FloatingCards3D />
      </div>
    </section>
  );
};
