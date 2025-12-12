import React, { useState, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { AppState } from '../types';

interface InputSectionProps {
  onAnalyze: (text: string) => void;
  appState: AppState;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, appState }) => {
  const [inputText, setInputText] = useState('');

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    onAnalyze(inputText);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const isProcessing = appState === 'ANALYZING' || appState === 'GENERATING_FINAL';
  const isDisabled = isProcessing || appState === 'SELECTION_REQUIRED';

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl opacity-20 group-hover:opacity-30 transition duration-500 blur"></div>
        <div className="relative bg-slate-900 rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
            placeholder="Enter a vague idea (e.g., 'Make this email better', 'Fix my python script')..."
            className="w-full bg-transparent text-slate-200 placeholder-slate-500 p-6 min-h-[120px] outline-none resize-none font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="bg-slate-800/50 px-4 py-3 flex justify-between items-center border-t border-slate-700/50">
            <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
              {isProcessing && (
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  PROCESSING
                </span>
              )}
              {!isProcessing && <span>SHIFT + ENTER for new line</span>}
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isDisabled || !inputText.trim()}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all duration-200
                ${
                  isDisabled || !inputText.trim()
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20 active:scale-95'
                }`}
            >
              <span>Analyze</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};