'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Cpu, Zap, FileText, Newspaper, ShieldAlert, Sparkles } from 'lucide-react';

interface AgentNode {
  id: string;
  name: string;
  role: string;
  color: string;
  glowColor: string;
  x: number;
  y: number;
  z: number;
  icon: any;
  signal: string;
  confidence: string;
}

export const AgentMesh3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeNode, setActiveNode] = useState<string | null>('synthesis');
  const [rotation, setRotation] = useState({ x: 0.2, y: 0.5 });

  const nodes: AgentNode[] = [
    { id: 'technical', name: 'Technical Agent', role: 'Price & Momentum Analyst', color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.6)', x: -160, y: -80, z: 20, icon: Zap, signal: 'BULLISH', confidence: '82%' },
    { id: 'fundamental', name: 'Fundamental Agent', role: 'RAG Filing Analyst', color: '#06b6d4', glowColor: 'rgba(6, 182, 212, 0.6)', x: 0, y: -130, z: -30, icon: FileText, signal: 'BULLISH', confidence: '79%' },
    { id: 'sentiment', name: 'Sentiment Agent', role: 'News & Commentary', color: '#a855f7', glowColor: 'rgba(168, 85, 247, 0.6)', x: 160, y: -80, z: 20, icon: Newspaper, signal: 'POSITIVE', confidence: '71%' },
    { id: 'risk', name: 'Risk / Profile Layer', role: 'Concentration Shield', color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.6)', x: -90, y: 70, z: -20, icon: ShieldAlert, signal: '62/100', confidence: 'Risk Index' },
    { id: 'synthesis', name: 'Synthesis Engine', role: 'Personalized Decision', color: '#10b981', glowColor: 'rgba(16, 185, 129, 0.8)', x: 80, y: 80, z: 40, icon: Sparkles, signal: 'SMALL ADD', confidence: 'Decision' }
  ];

  const connections = [
    ['technical', 'risk'],
    ['fundamental', 'risk'],
    ['sentiment', 'risk'],
    ['risk', 'synthesis'],
    ['technical', 'synthesis'],
    ['fundamental', 'synthesis'],
    ['sentiment', 'synthesis']
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let pulseProgress = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      pulseProgress = (pulseProgress + 0.015) % 1;

      // Draw Connection Lines with 3D Depth & Glowing Data Pulses
      connections.forEach(([sourceId, targetId]) => {
        const source = nodes.find((n) => n.id === sourceId);
        const target = nodes.find((n) => n.id === targetId);
        if (!source || !target) return;

        const sx = cx + source.x;
        const sy = cy + source.y;
        const tx = cx + target.x;
        const ty = cy + target.y;

        // Line glow
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Data Pulse Particle
        const px = sx + (tx - sx) * pulseProgress;
        const py = sy + (ty - sy) * pulseProgress;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#60a5fa';
        ctx.shadowColor = '#3b82f6';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Nodes
      nodes.forEach((node) => {
        const nx = cx + node.x;
        const ny = cy + node.y;
        const isActive = activeNode === node.id;

        // Node Glow Ring
        ctx.beginPath();
        ctx.arc(nx, ny, isActive ? 24 : 18, 0, Math.PI * 2);
        ctx.fillStyle = node.glowColor;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isActive ? 25 : 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Node Inner Circle
        ctx.beginPath();
        ctx.arc(nx, ny, isActive ? 14 : 10, 0, Math.PI * 2);
        ctx.fillStyle = '#0b0c10';
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeNode]);

  return (
    <div className="relative w-full glass-card rounded-2xl p-6 border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Interactive 3D Multi-Agent Mesh</h3>
            <p className="text-xs text-slate-400">Click any node to inspect agent telemetry</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30">
          Parallel Async Flow
        </span>
      </div>

      <div className="relative w-full h-[320px] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={650}
          height={320}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Clickable Overlay HTML Badges for 3D Nodes */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 p-4 pointer-events-auto">
          {nodes.map((node) => {
            const Icon = node.icon;
            const isActive = activeNode === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setActiveNode(node.id)}
                className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  isActive ? 'z-20 scale-110' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-slate-900/90 border-blue-400 shadow-lg shadow-blue-500/30'
                      : 'bg-black/60 border-white/10'
                  }`}
                  style={{ borderColor: isActive ? node.color : undefined }}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" style={{ color: node.color }} />
                    <span className="text-xs font-semibold text-white">{node.name}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 space-x-2">
                    <span>{node.signal}</span>
                    <span className="text-slate-300 font-bold">{node.confidence}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Inspector Footer */}
      {activeNode && (
        <div className="mt-2 p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300">
              Active Inspector:{' '}
              <strong className="text-white">
                {nodes.find((n) => n.id === activeNode)?.name}
              </strong>
            </span>
          </div>
          <span className="font-mono text-blue-400 text-[11px]">
            {nodes.find((n) => n.id === activeNode)?.role}
          </span>
        </div>
      )}
    </div>
  );
};
