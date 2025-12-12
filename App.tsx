import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { InterpretationPanel } from './components/InterpretationPanel';
import { ResultDisplay } from './components/ResultDisplay';
import { AppState, InterpretationResponse, FinalResponse } from './types';
import { analyzeIntent, generateFinalResult } from './services/geminiService';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [userInput, setUserInput] = useState<string>('');
  const [interpretations, setInterpretations] = useState<InterpretationResponse | null>(null);
  const [finalResult, setFinalResult] = useState<FinalResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setUserInput(text);
    setAppState('ANALYZING');
    setError(null);
    setInterpretations(null);
    setFinalResult(null);

    try {
      const result = await analyzeIntent(text);
      setInterpretations(result);
      setAppState('SELECTION_REQUIRED');
    } catch (err) {
      console.error(err);
      setError("Failed to analyze intent. Please try again.");
      setAppState('ERROR');
    }
  };

  const handleSelection = async (option: string, isRecommended: boolean) => {
    setAppState('GENERATING_FINAL');
    try {
      const result = await generateFinalResult(userInput, option, isRecommended);
      setFinalResult(result);
      setAppState('COMPLETED');
    } catch (err) {
      console.error(err);
      setError("Failed to generate final result. Please try again.");
      setAppState('ERROR');
    }
  };

  const handleReset = () => {
    setAppState('IDLE');
    setUserInput('');
    setInterpretations(null);
    setFinalResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col font-sans selection:bg-cyan-500/30">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8 flex flex-col">
        {/* Intro Text - Only visible when IDLE */}
        {appState === 'IDLE' && (
          <div className="text-center mb-10 mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 pb-2">
              Perfect Your Prompts
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Vague inputs lead to generic results. A.R.I.A transforms your rough ideas into professional, high-performance prompts for any AI model.
            </p>
          </div>
        )}

        <InputSection onAnalyze={handleAnalyze} appState={appState} />

        {error && (
          <div className="w-full max-w-4xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 animate-in fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {appState === 'SELECTION_REQUIRED' && (
          <InterpretationPanel 
            data={interpretations} 
            onSelect={handleSelection} 
            isGenerating={false}
          />
        )}
        
        {appState === 'GENERATING_FINAL' && interpretations && (
           <div className="w-full max-w-4xl mx-auto text-center py-12">
             <div className="inline-flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                <p className="text-cyan-400 font-mono text-sm animate-pulse">ENGINEERING OPTIMIZED PROMPT...</p>
             </div>
           </div>
        )}

        {(appState === 'COMPLETED' || appState === 'GENERATING_FINAL') && finalResult && (
          <ResultDisplay data={finalResult} onReset={handleReset} />
        )}
        
      </main>

      <footer className="w-full py-6 text-center text-slate-600 text-sm border-t border-slate-800/50">
        <p>&copy; {new Date().getFullYear()} A.R.I.A System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;