'use client';

import React from 'react';
import { Cpu, ShieldCheck, Database, Zap, Sparkles, SlidersHorizontal, Lock, FileText } from 'lucide-react';
import { AgentMesh3D } from '../3d/agent-mesh-3d';

export const FeatureGrid: React.FC = () => {
  return (
    <section id="architecture" className="py-20 px-6 max-w-7xl mx-auto space-y-16">
      {/* Section Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>System Architecture &amp; Core Pillars</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          The New Standard For <br />
          <span className="gradient-text">Autonomous Investment Intelligence</span>
        </h2>
        <p className="text-slate-400 text-base leading-relaxed">
          Bridging the gap between raw data availability and personalized decision intelligence using specialized parallel AI agents.
        </p>
      </div>

      {/* Interactive 3D Agent Mesh Section */}
      <AgentMesh3D />

      {/* Feature Cards Grid (Inspired by Reference Image 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Multi-Agent Parallel Execution */}
        <div className="glass-card glass-card-hover rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="p-3 w-fit rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white">Parallel Async Engine</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Technical, Fundamental, and Sentiment agents execute in parallel. Minimizes response latency to under 3.8 seconds total execution.
          </p>
          <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-white/5">
            <span>Concurrency</span>
            <span className="text-blue-400 font-bold">3 Agents Parallel</span>
          </div>
        </div>

        {/* Card 2: Personalization Engine */}
        <div className="glass-card glass-card-hover rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="p-3 w-fit rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white">Contextual Personalization</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Evaluates portfolio concentration and risk tolerance. Same stock and market data yield different recommendations for different profiles.
          </p>
          <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-white/5">
            <span>Differentiator</span>
            <span className="text-amber-400 font-bold">Risk-Aware Synthesis</span>
          </div>
        </div>

        {/* Card 3: RAG Citation & Zero Hallucination */}
        <div className="glass-card glass-card-hover rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="p-3 w-fit rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white">RAG Evidence Attribution</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Retrieves statutory quarterly reports and transcripts from vector storage. Every fundamental claim includes page-level source citations.
          </p>
          <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-white/5">
            <span>Attribution</span>
            <span className="text-sky-400 font-bold">100% Page Verified</span>
          </div>
        </div>
      </div>
    </section>
  );
};
