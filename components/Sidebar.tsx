
import React from 'react';
import { Task } from '../types';

interface SidebarProps {
  tasks: Task[];
  activeTaskId: number;
  onTaskSelect: (taskId: number) => void;
  disabled: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ tasks, activeTaskId, onTaskSelect, disabled }) => {
  return (
    <aside className="lg:w-72 lg:border-r border-white/10 bg-black lg:h-[calc(100vh-64px)] flex flex-col overflow-hidden w-full">
      <div className="p-4 border-b border-white/10 bg-white/5 hidden lg:block">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">CELPIP Tasks</h2>
      </div>
      
      {/* Mobile Horizontal Task Switcher */}
      <nav className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto p-2 lg:p-2 scrollbar-hide lg:scrollbar-default gap-2 lg:gap-0 min-h-[64px] lg:min-h-0 border-b lg:border-b-0 border-white/10">
        {tasks.map((task) => {
          const isActive = task.id === activeTaskId;
          return (
            <button
              key={task.id}
              onClick={() => onTaskSelect(task.id)}
              disabled={disabled}
              className={`flex-shrink-0 lg:w-full text-left p-2 lg:p-3 rounded-xl transition-all flex items-center lg:items-start gap-3 group whitespace-nowrap lg:whitespace-normal ${
                isActive 
                  ? 'bg-indigo-600/10 text-indigo-400 shadow-sm ring-1 ring-indigo-500/20' 
                  : 'text-slate-400 hover:bg-white/5'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-500 group-hover:bg-white/20'
              }`}>
                {task.id}
              </span>
              <div className="lg:block hidden">
                <p className="font-semibold text-sm leading-tight">{task.title}</p>
                <p className={`text-[11px] mt-1 ${isActive ? 'text-indigo-500' : 'text-slate-500'}`}>
                  {task.prepTime}s • {task.speakTime}s
                </p>
              </div>
              <div className="lg:hidden block">
                <p className="font-semibold text-xs leading-tight">{task.title.split(' ').pop()}</p>
              </div>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/10 text-[10px] text-slate-600 text-center hidden lg:block uppercase tracking-widest">
        Neel0210 • AI Optimized
      </div>
    </aside>
  );
};

export default Sidebar;
