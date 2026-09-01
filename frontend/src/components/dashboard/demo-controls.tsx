'use client';

import React from 'react';
import { Sliders, AlertOctagon, WifiOff, CheckCircle2 } from 'lucide-react';

interface DemoControlsProps {
  simulateMissingData: boolean;
  onToggleMissingData: (val: boolean) => void;
  simulateConflict: boolean;
  onToggleConflict: (val: boolean) => void;
}

export const DemoControls: React.FC<DemoControlsProps> = ({
  simulateMissingData,
  onToggleMissingData,
  simulateConflict,
  onToggleConflict
}) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-amber-500/30 bg-amber-950/10 space-y-4">
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Hackathon Resilience &amp; Fault Testing</h4>
          <p className="text-xs text-slate-400">Simulate real-world API outages and signal disagreements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Toggle 1: Simulate Missing Data */}
        <div
          onClick={() => onToggleMissingData(!simulateMissingData)}
          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
            simulateMissingData
              ? 'bg-rose-950/40 border-rose-500/50 text-white'
              : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <WifiOff className={`w-4 h-4 ${simulateMissingData ? 'text-rose-400' : 'text-slate-400'}`} />
            <div>
              <span className="text-xs font-semibold block">Simulate Missing News Data</span>
              <span className="text-[10px] font-mono text-slate-400">Tests graceful confidence decay</span>
            </div>
          </div>
          <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${simulateMissingData ? 'bg-rose-600' : 'bg-slate-700'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${simulateMissingData ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </div>

        {/* Toggle 2: Simulate Signal Conflict */}
        <div
          onClick={() => onToggleConflict(!simulateConflict)}
          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
            simulateConflict
              ? 'bg-amber-950/40 border-amber-500/50 text-white'
              : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <AlertOctagon className={`w-4 h-4 ${simulateConflict ? 'text-amber-400' : 'text-slate-400'}`} />
            <div>
              <span className="text-xs font-semibold block">Simulate Signal Disagreement</span>
              <span className="text-[10px] font-mono text-slate-400">Technical Bullish vs Sentiment Bearish</span>
            </div>
          </div>
          <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${simulateConflict ? 'bg-amber-600' : 'bg-slate-700'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${simulateConflict ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
