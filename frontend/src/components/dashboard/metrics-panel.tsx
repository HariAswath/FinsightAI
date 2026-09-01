'use client';

import React from 'react';
import { Activity, Clock, ShieldAlert, CheckCircle } from 'lucide-react';
import { AnalysisSessionResult } from '../../types';

interface MetricsPanelProps {
  session: AnalysisSessionResult;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ session }) => {
  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">System Performance Telemetry</h3>
          <p className="text-xs text-slate-400">Real-time latency breakdown &amp; signal accuracy metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Signal Accuracy */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
          <span className="text-xs font-mono text-slate-400 block">Signal Accuracy</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">72%</span>
            <span className="text-[10px] font-mono text-slate-400">Backtested Demo Metric</span>
          </div>
        </div>

        {/* Metric 2: Agent Response Latency */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
          <span className="text-xs font-mono text-slate-400 block">Total Pipeline Latency</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-blue-400">
              {(session.totalLatencyMs / 1000).toFixed(1)}s
            </span>
            <span className="text-[10px] font-mono text-slate-400">Parallel Async</span>
          </div>
        </div>

        {/* Metric 3: Concentration Score */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
          <span className="text-xs font-mono text-slate-400 block">Concentration Score</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {session.risk.concentrationScore} / 100
            </span>
            <span className="text-[10px] font-mono text-slate-400">Risk Index</span>
          </div>
        </div>
      </div>

      {/* Latency Breakdown Bar */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
          Agent Response Latency Breakdown:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
          <div className="p-2 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-300 flex justify-between">
            <span>Technical</span>
            <strong>{session.technical.latencyMs}ms</strong>
          </div>
          <div className="p-2 rounded-lg bg-sky-950/40 border border-sky-500/30 text-sky-300 flex justify-between">
            <span>Fundamental</span>
            <strong>{session.fundamental.latencyMs}ms</strong>
          </div>
          <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 flex justify-between">
            <span>Sentiment</span>
            <strong>{session.sentiment.latencyMs}ms</strong>
          </div>
          <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 flex justify-between">
            <span>Risk Layer</span>
            <strong>{session.risk.latencyMs}ms</strong>
          </div>
          <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex justify-between">
            <span>Synthesis</span>
            <strong>{session.synthesis.latencyMs}ms</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
