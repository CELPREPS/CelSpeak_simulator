import React from 'react';

interface HeaderProps {
  practiceCount: number;
  onResetCount: () => void;
  onToggleFullscreen: () => void;
  onHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ practiceCount, onResetCount, onToggleFullscreen, onHome }) => {
  return (
    <header className="h-20 border-b border-white/10 bg-black/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 sticky top-0 z-50">
      <div 
        className="flex items-center gap-4 cursor-pointer group" 
        onClick={onHome}
        title="Go to Home / Task 1"
      >
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 overflow-hidden rounded-full border-2 border-white/10 group-hover:border-indigo-500/50 transition-all shadow-lg shadow-indigo-500/10">
          <img 
            src="https://raw.githubusercontent.com/Neel0210/CelSpeak/main/logo.png" 
            alt="CelSpeak Logo" 
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
            onError={(e) => {
              // Fallback if the specific URL is not yet available
              (e.target as HTMLImageElement).src = 'https://img.icons8.com/fluency/96/microphone.png';
            }}
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tighter leading-none flex items-center gap-2">
            CelSpeak
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          </h1>
          <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 hidden xs:block">
            CELPIP Speaking Practice
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-xs sm:text-sm font-black text-slate-300 shadow-inner">
          <span className="text-slate-500 uppercase tracking-widest text-[10px]">Today</span>
          <span className="text-indigo-400 text-lg leading-none">{practiceCount}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); onResetCount(); }}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-500 hover:text-white"
            title="Reset Counter"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
        
        <button 
          onClick={onToggleFullscreen}
          className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl transition-all text-slate-400 hover:text-white"
          title="Toggle Fullscreen"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
