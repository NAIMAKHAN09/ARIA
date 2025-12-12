import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-cyan-500 rounded-full opacity-25 blur-md animate-pulse"></div>
            <div className="relative w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
              <Bot className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              A.R.I.A
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">v1.0</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono tracking-wide">AMBIGUITY RESOLUTION & INTENT ANALYSIS</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
          <Sparkles className="w-3 h-3 text-yellow-500" />
          <span>Powered by Gemini 2.5</span>
        </div>
      </div>
    </header>
  );
};