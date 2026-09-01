'use client';

import React from 'react';
import { Zap, FileText, Newspaper, ShieldAlert, Check, Clock, ExternalLink, Award } from 'lucide-react';
import { AgentOutput, RAGSource } from '../../types';

interface AgentCardProps {
  output: AgentOutput;
  title: string;
  agentType: 'technical' | 'fundamental' | 'sentiment' | 'risk';
}

export const AgentCard: React.FC<AgentCardProps> = ({ output, title, agentType }) => {
  const getIcon = () => {
    switch (agentType) {
      case 'technical':
        return <Zap className="w-5 h-5 text-blue-400" />;
      case 'fundamental':
        return <FileText className="w-5 h-5 text-sky-400" />;
      case 'sentiment':
        return <Newspaper className="w-5 h-5 text-purple-400" />;
      case 'risk':
        return <ShieldAlert className="w-5 h-5 text-amber-400" />;
    }
  };

  const getSignalBadge = () => {
    if (output.status === 'UNAVAILABLE') {
      return 'bg-slate-800 text-slate-400 border-slate-700';
    }
    switch (output.signal) {
      case 'BULLISH':
      case 'POSITIVE':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'BEARISH':
      case 'NEGATIVE':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default:
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    }
  };

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 border border-white/10 space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10">
            {getIcon()}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{title}</h4>
            <span className="text-[11px] font-mono text-slate-400">
              {output.latencyMs ? `${output.latencyMs}ms` : 'Ready'}
            </span>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${getSignalBadge()}`}>
          {output.status === 'UNAVAILABLE' ? 'UNAVAILABLE' : `${output.signal} ${output.confidence ? `${Math.round(output.confidence * 100)}%` : ''}`}
        </span>
      </div>

      {/* Structured Reasoning Bullets */}
      <div className="space-y-2 text-xs text-slate-300">
        {output.reasons.map((reason, idx) => (
          <div key={idx} className="flex items-start space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
            <span className="leading-relaxed">{reason}</span>
          </div>
        ))}
      </div>

      {/* RAG Document Sources Attribution (Mandatory Requirement 8 & 16) */}
      {output.sources && output.sources.length > 0 && (
        <div className="pt-3 border-t border-white/10 space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 block font-semibold">
            📄 Retrieved RAG Document Citations:
          </span>
          {output.sources.map((src, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-black/50 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-white font-semibold flex items-center">
                  <ExternalLink className="w-3 h-3 mr-1 text-sky-400" />
                  {src.title}
                </span>
                <span className="text-slate-400">Page {src.page}</span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans italic">
                &quot;{src.snippet}&quot;
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                <span className="text-emerald-400 flex items-center">
                  <Award className="w-3 h-3 mr-1" />
                  {(src.confidence * 100).toFixed(0)}% Citation Match
                </span>
                <span>{src.documentType}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
