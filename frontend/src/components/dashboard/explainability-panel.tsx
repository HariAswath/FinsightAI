'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Cpu, CheckCircle2, ArrowDown } from 'lucide-react';
import { SynthesisOutput } from '../../types';

interface ExplainabilityPanelProps {
  reasoningSteps: SynthesisOutput['reasoningSteps'];
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({ reasoningSteps }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left cursor-pointer group"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
              How did AI reach this decision?
            </h3>
            <p className="text-xs text-slate-400">Complete multi-agent reasoning &amp; evidence chain</p>
          </div>
        </div>

        <div className="p-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-white">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expandable Step-by-Step Chain */}
      {isOpen && (
        <div className="pt-4 border-t border-white/10 space-y-4">
          {reasoningSteps.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="flex items-start space-x-4">
                <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-400 text-blue-300 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 shadow-md shadow-blue-500/20">
                  {step.stepIndex}
                </div>

                <div className="flex-1 p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white font-semibold">{step.title}</span>
                    <span className="text-blue-400 font-bold">{step.agentName}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {step.details}
                  </p>
                </div>
              </div>

              {idx < reasoningSteps.length - 1 && (
                <div className="w-0.5 h-4 bg-blue-500/30 ml-3.5 my-1" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
