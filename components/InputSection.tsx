import React, { useState, KeyboardEvent, useRef } from 'react';
import { Send, Loader2, Mic, Paperclip, X, Image as ImageIcon, Video } from 'lucide-react';
import { AppState } from '../types';
import { transcribeAudio, analyzeMedia } from '../services/geminiService';

interface InputSectionProps {
  onAnalyze: (text: string) => void;
  appState: AppState;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, appState }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMediaProcessing, setIsMediaProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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

  const handleMicClick = async () => {
    if (isRecording) {
      // Stop Recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      // Start Recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = async () => {
          setIsMediaProcessing(true);
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(',')[1];
            try {
              const transcription = await transcribeAudio(base64Audio, 'audio/webm');
              setInputText((prev) => (prev ? prev + ' ' + transcription : transcription));
            } catch (error) {
              console.error(error);
            } finally {
              setIsMediaProcessing(false);
              stream.getTracks().forEach(track => track.stop());
            }
          };
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Microphone access denied or error:", err);
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) return;

    setIsMediaProcessing(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Data = (reader.result as string).split(',')[1];
      try {
        const description = await analyzeMedia(base64Data, file.type);
        const contextPrefix = isImage ? '[Image Context: ' : '[Video Context: ';
        const contextText = `\n\n${contextPrefix}${description}]`;
        setInputText((prev) => prev + contextText);
      } catch (error) {
        console.error("Media analysis failed:", error);
      } finally {
        setIsMediaProcessing(false);
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
  };

  const isProcessing = appState === 'ANALYZING' || appState === 'GENERATING_FINAL' || isMediaProcessing;
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
            placeholder={isRecording ? "Listening..." : "Enter a vague idea, record voice, or attach media..."}
            className={`w-full bg-transparent text-slate-200 placeholder-slate-500 p-6 min-h-[120px] outline-none resize-none font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed ${isRecording ? 'animate-pulse bg-red-900/10' : ''}`}
          />
          
          <div className="bg-slate-800/50 px-4 py-3 flex justify-between items-center border-t border-slate-700/50">
            <div className="flex items-center gap-2">
               {/* Tools */}
               <button
                onClick={handleMicClick}
                disabled={isDisabled}
                className={`p-2 rounded-full transition-all duration-200 ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:bg-slate-700 hover:text-cyan-400'}`}
                title="Record Audio"
               >
                 <Mic className="w-5 h-5" />
               </button>

               <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isDisabled}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-cyan-400 transition-all duration-200"
                title="Attach Image/Video"
               >
                 <Paperclip className="w-5 h-5" />
               </button>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*,video/*"
                 onChange={handleFileSelect}
               />
            </div>

            <div className="flex items-center gap-4">
              <div className="text-xs text-slate-500 font-mono hidden sm:block">
                {isMediaProcessing && (
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    ANALYZING MEDIA
                  </span>
                )}
                {isProcessing && !isMediaProcessing && (
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    PROCESSING
                  </span>
                )}
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
    </div>
  );
};
