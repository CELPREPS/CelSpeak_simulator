
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CELPIP_TASKS } from './data/tasks';
import { TimerPhase, Task } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ImageUploader from './components/ImageUploader';
import TimerDisplay from './components/TimerDisplay';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  // State
  const [currentTaskId, setCurrentTaskId] = useState(1);
  const [phase, setPhase] = useState<TimerPhase>(TimerPhase.IDLE);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customText, setCustomText] = useState('');
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [practiceCount, setPracticeCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHelperOpen, setIsHelperOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Refs
  const timerRef = useRef<number | null>(null);
  const activeTask = CELPIP_TASKS.find(t => t.id === currentTaskId) || CELPIP_TASKS[0];

  const handleHome = () => {
    if (phase === TimerPhase.PREPARATION || phase === TimerPhase.SPEAKING) {
      if (!confirm("Your current session is active. Do you want to stop and return to Home?")) return;
    }
    resetTimer();
    setCurrentTaskId(1);
    setSelectedSampleIndex(0);
    setIsCustomMode(false);
    setAiResponse(null);
  };

  // AI Model Answer Logic using Gemini API
  const getAIModelAnswer = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setAiResponse(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const taskPrompt = isCustomMode ? customText : activeTask.samples[selectedSampleIndex];
      const prompt = `As a CELPIP English test expert (Level 12), provide a high-scoring spoken model answer for this task:
      
Task Type: ${activeTask.title}
Description: ${activeTask.description}
Prompt: "${taskPrompt}"

Please provide only the transcript of the spoken answer. Ensure it uses natural, fluent English suitable for a top-tier score (Level 9-12). Include appropriate transitions, vivid descriptions (if it's an image task), and advanced vocabulary.`;

      let response;
      if (activeTask.requiresImage && uploadedImage) {
        const base64Data = uploadedImage.split(',')[1];
        const mimeType = uploadedImage.split(';')[0].split(':')[1] || 'image/png';
        response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: {
            parts: [
              { inlineData: { data: base64Data, mimeType } },
              { text: prompt }
            ]
          }
        });
      } else {
        response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt
        });
      }
      setAiResponse(response.text || "No response generated.");
    } catch (err) {
      console.error("Gemini AI error:", err);
      setAiResponse("Failed to generate AI feedback. Please check your network or API configuration.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Sounds
  const playBeep = (freq = 440, duration = 0.1) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) { console.log('Audio error', e); }
  };

  const playDoubleBeep = () => {
    playBeep(660, 0.1);
    setTimeout(() => playBeep(880, 0.1), 150);
  };

  // Local Storage
  useEffect(() => {
    const savedCount = localStorage.getItem('celSpeak_count');
    if (savedCount) setPracticeCount(parseInt(savedCount));
    const savedCustom = localStorage.getItem('celSpeak_custom');
    if (savedCustom) setCustomText(savedCustom);
  }, []);

  useEffect(() => {
    localStorage.setItem('celSpeak_count', practiceCount.toString());
  }, [practiceCount]);

  useEffect(() => {
    localStorage.setItem('celSpeak_custom', customText);
  }, [customText]);

  // Timer Logic
  const startTimer = useCallback(() => {
    if (activeTask.requiresImage && !uploadedImage) {
      alert("Please upload a picture to continue for this task.");
      return;
    }
    setPhase(TimerPhase.PREPARATION);
    setTimeLeft(activeTask.prepTime);
    setIsPaused(false);
    setAiResponse(null); 
    playBeep(440, 0.2);
  }, [activeTask, uploadedImage]);

  const pauseTimer = () => setIsPaused(prev => !prev);
  
  const resetTimer = () => {
    setPhase(TimerPhase.IDLE);
    setTimeLeft(0);
    setIsPaused(false);
    setAiResponse(null);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const skipPrep = () => {
    if (phase === TimerPhase.PREPARATION) {
      setPhase(TimerPhase.SPEAKING);
      setTimeLeft(activeTask.speakTime);
      playDoubleBeep();
    }
  };

  const handleNextPhase = useCallback(() => {
    if (phase === TimerPhase.PREPARATION) {
      setPhase(TimerPhase.SPEAKING);
      setTimeLeft(activeTask.speakTime);
      playDoubleBeep();
    } else if (phase === TimerPhase.SPEAKING) {
      setPhase(TimerPhase.FINISHED);
      setTimeLeft(0);
      setPracticeCount(prev => prev + 1);
      playDoubleBeep();
    }
  }, [phase, activeTask]);

  useEffect(() => {
    if (isPaused || phase === TimerPhase.IDLE || phase === TimerPhase.FINISHED) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleNextPhase();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, isPaused, handleNextPhase]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (phase === TimerPhase.IDLE) startTimer();
        else if (phase !== TimerPhase.FINISHED) pauseTimer();
      } else if (e.code === 'KeyR') {
        resetTimer();
      } else if (e.code === 'KeyN') {
        if (phase === TimerPhase.IDLE) {
          const nextIdx = (selectedSampleIndex + 1) % activeTask.samples.length;
          setSelectedSampleIndex(nextIdx);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, startTimer, selectedSampleIndex, activeTask]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-slate-100 selection:bg-indigo-500/30">
      <Header 
        practiceCount={practiceCount} 
        onResetCount={() => setPracticeCount(0)} 
        onToggleFullscreen={toggleFullscreen}
        onHome={handleHome}
      />
      
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        <Sidebar 
          tasks={CELPIP_TASKS} 
          activeTaskId={currentTaskId} 
          onTaskSelect={(id) => {
            setCurrentTaskId(id);
            resetTimer();
            setSelectedSampleIndex(0);
            setIsHelperOpen(false);
          }}
          disabled={phase === TimerPhase.PREPARATION || phase === TimerPhase.SPEAKING}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 flex flex-col items-center relative">
          
          {/* MOBILE STICKY TIMER (Small timer around/above the question) */}
          {phase !== TimerPhase.IDLE && phase !== TimerPhase.FINISHED && (
            <div className="lg:hidden sticky top-2 z-[60] w-full flex justify-center mb-4 pointer-events-none">
              <div className="pointer-events-auto">
                <TimerDisplay 
                  variant="mini"
                  phase={phase} 
                  currentTime={timeLeft} 
                  totalTime={phase === TimerPhase.PREPARATION ? activeTask.prepTime : activeTask.speakTime} 
                />
              </div>
            </div>
          )}

          <div className="w-full max-w-5xl flex flex-col gap-6 sm:gap-8">
            
            {/* TASK 3 & 4 IMAGE - Prominent on Top */}
            {activeTask.requiresImage && (
              <div className="w-full order-1">
                <ImageUploader 
                  image={uploadedImage} 
                  onImageChange={(img) => setUploadedImage(img)}
                />
              </div>
            )}

            {/* MAIN CONTENT AREA: Question Prompt (Most Important) */}
            <div className={`flex flex-col lg:flex-row gap-6 sm:gap-8 ${activeTask.requiresImage ? 'order-2' : 'order-1'}`}>
              
              {/* Question Column */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] shadow-2xl p-6 sm:p-10 transition-all border-l-4 border-l-indigo-600 relative overflow-hidden">
                  
                  {/* Small inline timer for desktop/large screens when active, or persistent ref */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                          Task {activeTask.id}
                        </h2>
                        {/* Inline small indicator if active */}
                        {phase !== TimerPhase.IDLE && phase !== TimerPhase.FINISHED && (
                          <div className="hidden lg:block ml-2">
                             <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${phase === TimerPhase.PREPARATION ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'}`}>
                               {phase}
                             </span>
                          </div>
                        )}
                      </div>
                      <p className="text-slate-400 text-base sm:text-lg font-medium mt-1 uppercase tracking-wide opacity-70">{activeTask.title}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setIsCustomMode(!isCustomMode)}
                        disabled={phase !== TimerPhase.IDLE}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isCustomMode ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'} ${phase !== TimerPhase.IDLE ? 'opacity-30' : ''}`}
                      >
                        {isCustomMode ? 'Edit Custom' : 'Custom Mode'}
                      </button>
                    </div>
                  </div>

                  {isCustomMode ? (
                    <textarea
                      className="w-full h-40 sm:h-52 p-6 bg-black/40 border border-white/10 rounded-3xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none resize-none transition-all text-slate-100 leading-relaxed text-lg sm:text-xl placeholder:text-slate-700 shadow-inner"
                      placeholder="Type your own CELPIP practice question here..."
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      disabled={phase !== TimerPhase.IDLE}
                    />
                  ) : (
                    <div className="space-y-8">
                      <div className="p-6 sm:p-10 bg-indigo-600/5 border border-indigo-500/10 rounded-3xl text-white font-medium leading-relaxed text-xl sm:text-3xl italic relative">
                        "{activeTask.samples[selectedSampleIndex]}"
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-8">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2">Samples</span>
                          {activeTask.samples.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedSampleIndex(i)}
                              disabled={phase !== TimerPhase.IDLE}
                              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-sm sm:text-base font-black transition-all ${
                                selectedSampleIndex === i 
                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40 scale-110 ring-2 ring-indigo-500/50' 
                                : 'bg-white/5 border border-white/10 text-slate-500 hover:bg-white/10'
                              } ${phase !== TimerPhase.IDLE ? 'opacity-30 cursor-not-allowed' : ''}`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                        <button 
                          onClick={() => setSelectedSampleIndex(Math.floor(Math.random() * activeTask.samples.length))}
                          disabled={phase !== TimerPhase.IDLE}
                          className="flex items-center gap-2 px-5 py-3 text-xs font-black text-indigo-400 bg-indigo-600/10 hover:bg-indigo-600/20 rounded-2xl transition-all active:scale-95 disabled:opacity-30"
                        >
                          RANDOM
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Helper Section - Below Question */}
                {activeTask.helper && (
                  <div className="bg-white/5 border border-white/10 rounded-3xl shadow-xl overflow-hidden">
                    <button 
                      onClick={() => setIsHelperOpen(!isHelperOpen)}
                      className="w-full flex items-center justify-between p-6 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <span className="font-black text-slate-200 text-sm uppercase tracking-widest">{activeTask.helper.title}</span>
                      </div>
                      <svg className={`w-5 h-5 text-slate-500 transition-transform ${isHelperOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {isHelperOpen && (
                      <div className="px-6 pb-6 pt-0">
                        <div className="flex flex-wrap gap-3">
                          {activeTask.helper.points.map((p, i) => (
                            <div key={i} className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/10 rounded-2xl text-sm text-slate-300 font-bold">
                              <span className="text-indigo-400">{i + 1}.</span>
                              {p}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar Controls Column: Timer (Smaller) and Actions */}
              <div className="w-full lg:w-80 flex flex-col gap-6">
                <div className="bg-white/5 border border-white/10 rounded-[2rem] shadow-2xl p-6 lg:sticky lg:top-24">
                  
                  {/* Main Timer Display (Hidden on mobile when session is active to avoid double timer, or just keep as ref) */}
                  <div className={`${(phase === TimerPhase.PREPARATION || phase === TimerPhase.SPEAKING) ? 'hidden lg:block' : ''}`}>
                    <TimerDisplay 
                      phase={phase} 
                      currentTime={timeLeft} 
                      totalTime={phase === TimerPhase.PREPARATION ? activeTask.prepTime : activeTask.speakTime} 
                    />
                  </div>

                  {/* Actions Area */}
                  <div className="mt-8 space-y-4">
                    {phase === TimerPhase.IDLE && (
                      <button 
                        onClick={startTimer}
                        className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-2xl shadow-indigo-900/40 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 tracking-tighter text-lg"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                        START TASK
                      </button>
                    )}

                    {(phase === TimerPhase.PREPARATION || phase === TimerPhase.SPEAKING) && (
                      <div className="flex flex-col gap-3">
                        <button 
                          onClick={pauseTimer}
                          className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs"
                        >
                          {isPaused ? 'RESUME SESSION' : 'PAUSE SESSION'}
                        </button>
                        <button 
                          onClick={resetTimer}
                          className="w-full py-4 bg-rose-600/10 border border-rose-500/20 hover:bg-rose-600/20 text-rose-400 font-black rounded-2xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          CANCEL & RESET
                        </button>
                      </div>
                    )}

                    {phase === TimerPhase.PREPARATION && (
                      <button 
                        onClick={skipPrep}
                        className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-black rounded-2xl transition-all transform hover:-translate-y-1 active:scale-95 text-xs tracking-widest"
                      >
                        SKIP TO SPEAKING
                      </button>
                    )}

                    {phase === TimerPhase.FINISHED && (
                      <div className="space-y-4">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-5 rounded-2xl text-center font-black text-sm uppercase tracking-widest animate-pulse">
                          TASK COMPLETED
                        </div>

                        <button 
                          onClick={getAIModelAnswer}
                          disabled={isGenerating}
                          className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/40 text-sm tracking-tight"
                        >
                          {isGenerating ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              ANALYZING...
                            </span>
                          ) : (
                            <>
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                              GET MODEL ANSWER
                            </>
                          )}
                        </button>

                        <button 
                          onClick={startTimer}
                          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all text-xs tracking-widest"
                        >
                          RETRY TASK
                        </button>
                        <button 
                          onClick={resetTimer}
                          className="w-full py-4 bg-white/5 border border-white/10 text-slate-400 font-black rounded-2xl hover:bg-white/10 transition-all text-xs tracking-widest"
                        >
                          NEXT PRACTICE
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Keyboard Visual for Desktop */}
                <div className="hidden sm:block p-6 bg-white/5 border border-white/10 rounded-3xl mt-2">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Master Shortcuts</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Toggle Timer</span>
                      <kbd className="px-2 py-1 bg-white/10 border border-white/10 rounded text-[9px] font-black text-white">SPACE</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Instant Reset</span>
                      <kbd className="px-2 py-1 bg-white/10 border border-white/10 rounded text-[9px] font-black text-white">R</kbd>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Response Full Width below content if active */}
            {aiResponse && (
              <div className="order-3 w-full bg-emerald-900/10 border border-emerald-500/20 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative">
                <div className="flex items-center justify-between mb-8 border-b border-emerald-500/10 pb-6">
                  <div>
                    <h4 className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight uppercase">Level 12 Model Transcript</h4>
                    <p className="text-emerald-500/60 text-xs sm:text-sm font-bold mt-1 uppercase tracking-widest">Expert Speaker Perspective</p>
                  </div>
                  <button 
                    onClick={() => setAiResponse(null)} 
                    className="p-3 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="text-slate-100 text-lg sm:text-2xl font-medium leading-relaxed sm:leading-loose whitespace-pre-wrap italic opacity-90">
                  {aiResponse}
                </div>
              </div>
            )}
            
            {/* Footer Credit */}
            <footer className="order-4 w-full py-12 text-center border-t border-white/5">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                Made with <span className="text-rose-600 text-xs">♥️</span> by Neel0210 leveraging AI
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
