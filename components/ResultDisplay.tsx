import React from 'react';
import { FinalResponse } from '../types';
import { Copy, Check, RotateCcw } from 'lucide-react';

interface ResultDisplayProps {
  data: FinalResponse | null;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ data, onReset }) => {
  const [copied, setCopied] = React.useState(false);

  if (!data) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(data.result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-30 blur-lg"></div>
        <div className="relative bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Header */}
          <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700 flex items-center justify-between backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
              <h3 className="font-semibold text-slate-100">Ready-to-Use Prompt</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors border border-slate-600"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="bg-slate-950 rounded-lg border border-slate-800 p-6 font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
              {data.result}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-800/50 px-6 py-4 border-t border-slate-700/50 flex justify-end">
            <button
              onClick={onReset}
              className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-2 hover:bg-slate-800 rounded-lg transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Start New Analysis
            </button>
          </div>

        </div>
      </div>

      <div className="text-center mt-8 text-slate-500 text-sm">
        Copy this prompt and paste it into your favorite AI model.
      </div>
    </div>
  );
};