import React from 'react';
import { InterpretationResponse } from '../types';
import { CheckCircle2, Circle, Star, ArrowRight } from 'lucide-react';

interface InterpretationPanelProps {
  data: InterpretationResponse | null;
  onSelect: (option: string, isRecommended: boolean) => void;
  isGenerating: boolean;
}

export const InterpretationPanel: React.FC<InterpretationPanelProps> = ({ data, onSelect, isGenerating }) => {
  if (!data) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-6 bg-cyan-500 rounded-full"></span>
          Intent Analysis
        </h2>
        <span className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          Please select the correct intent
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recommended Option */}
        <div className="md:col-span-2">
          <button
            onClick={() => onSelect(data.recommended, true)}
            disabled={isGenerating}
            className="w-full text-left group relative p-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur-sm opacity-50 transition-opacity group-hover:opacity-100"></div>
            <div className="relative h-full bg-slate-800/80 hover:bg-slate-800 border-2 border-emerald-500/50 hover:border-emerald-500 rounded-xl p-6 transition-all duration-200">
              <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                <Star className="w-3 h-3 fill-current" />
                RECOMMENDED
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-emerald-500/10 rounded-lg">
                   <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                   <h3 className="text-lg font-medium text-slate-100 mb-1 group-hover:text-emerald-300 transition-colors">
                    {data.recommended}
                   </h3>
                   <p className="text-sm text-slate-400">
                     Based on typical usage and tone analysis.
                   </p>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Alternative Options */}
        {data.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(option, false)}
            disabled={isGenerating}
            className="text-left group relative bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-500 rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
          >
             <div className="flex items-start gap-3">
                <div className="mt-0.5 text-slate-600 group-hover:text-cyan-400 transition-colors">
                  <Circle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-slate-300 group-hover:text-white font-medium text-base">
                    {option}
                  </h3>
                  <div className="mt-3 flex items-center text-xs text-cyan-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                    Select this option <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
             </div>
          </button>
        ))}
      </div>
    </div>
  );
};