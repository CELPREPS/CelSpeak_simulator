
import React from 'react';
import { TimerPhase } from '../types';

interface TimerDisplayProps {
  phase: TimerPhase;
  currentTime: number;
  totalTime: number;
  variant?: 'large' | 'mini';
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ phase, currentTime, totalTime, variant = 'large' }) => {
  const radius = variant === 'mini' ? 18 : 60;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? (currentTime / totalTime) * circumference : circumference;
  
  const isLastSeconds = currentTime <= 5 && currentTime > 0 && phase !== TimerPhase.IDLE;

  let colorClass = "text-slate-500";
  let ringColor = "stroke-white/5";
  let progressColor = "stroke-slate-700";
  let bgColor = variant === 'mini' ? "bg-transparent" : "bg-white/5";

  if (phase === TimerPhase.PREPARATION) {
    colorClass = "text-amber-500";
    ringColor = "stroke-amber-500/10";
    progressColor = "stroke-amber-500";
    bgColor = variant === 'mini' ? "bg-transparent" : "bg-amber-500/5";
  } else if (phase === TimerPhase.SPEAKING) {
    colorClass = "text-rose-500";
    ringColor = "stroke-rose-500/10";
    progressColor = "stroke-rose-500";
    bgColor = variant === 'mini' ? "bg-transparent" : "bg-rose-500/5";
  } else if (phase === TimerPhase.FINISHED) {
    colorClass = "text-slate-100";
    ringColor = "stroke-white/10";
    progressColor = "stroke-indigo-500";
    bgColor = variant === 'mini' ? "bg-transparent" : "bg-indigo-500/5";
  }

  if (variant === 'mini') {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 shadow-lg backdrop-blur-md transition-colors duration-500 ${phase === TimerPhase.PREPARATION ? 'bg-amber-500/10 border-amber-500/20' : phase === TimerPhase.SPEAKING ? 'bg-rose-500/10 border-rose-500/20' : 'bg-black/40'}`}>
        <div className="relative w-10 h-10">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
            <circle
              className={ringColor}
              strokeWidth="4"
              fill="transparent"
              r={radius}
              cx="22"
              cy="22"
            />
            <circle
              className="progress-ring__circle transition-all duration-300"
              stroke={progressColor.replace('stroke-', '')}
              strokeWidth="4"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="22"
              cy="22"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs font-black tabular-nums ${colorClass} ${isLastSeconds ? 'animate-pulse' : ''}`}>
              {currentTime}
            </span>
          </div>
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${colorClass}`}>
          {phase === TimerPhase.PREPARATION ? 'Prep' : phase === TimerPhase.SPEAKING ? 'Speak' : 'Done'}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-3xl border border-white/10 transition-colors duration-500 ${bgColor}`}>
      <div className="relative w-32 h-32 sm:w-40 sm:h-40">
        <svg className="w-full h-full" viewBox="0 0 140 140">
          <circle
            className={ringColor}
            strokeWidth="6"
            fill="transparent"
            r={radius}
            cx="70"
            cy="70"
          />
          <circle
            className={`progress-ring__circle ${progressColor}`}
            strokeWidth="6"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="70"
            cy="70"
          />
        </svg>
        <div className={`absolute inset-0 flex flex-col items-center justify-center ${isLastSeconds ? 'animate-pulse-red' : ''}`}>
          <span className={`text-3xl sm:text-4xl font-black tabular-nums transition-colors duration-300 ${colorClass}`}>
            {currentTime}
          </span>
          <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
            Sec
          </span>
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <h3 className={`text-xs sm:text-sm font-bold transition-colors duration-300 ${colorClass}`}>
          {phase === TimerPhase.PREPARATION && "PREPARING"}
          {phase === TimerPhase.SPEAKING && "SPEAKING"}
          {phase === TimerPhase.IDLE && "READY"}
          {phase === TimerPhase.FINISHED && "DONE"}
        </h3>
      </div>
    </div>
  );
};

export default TimerDisplay;
