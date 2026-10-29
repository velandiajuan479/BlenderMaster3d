'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface NavbarProps {
  activeView: 'projects' | 'viewport' | 'nodes' | 'shortcuts';
  onSelectView: (view: 'projects' | 'viewport' | 'nodes' | 'shortcuts') => void;
  onOpenAI: () => void;
}

export default function Navbar({ activeView, onSelectView, onOpenAI }: NavbarProps) {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-[#0e141f] shrink-0 z-30">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => onSelectView('projects')}
        className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2 text-left"
      >
        <span className="w-5 h-5 rounded-md bg-[#f57921] flex items-center justify-center text-slate-950 text-xs font-black">
          B
        </span>
        <span>BlenderMaster 3D</span>
      </button>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => onSelectView('projects')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeView === 'projects'
              ? 'text-white border-b-2 border-[#f57921] font-semibold'
              : 'text-slate-400'
          }`}
        >
          Proyectos Guiados
        </button>

        <button
          onClick={() => onSelectView('viewport')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeView === 'viewport'
              ? 'text-white border-b-2 border-[#f57921] font-semibold'
              : 'text-slate-400'
          }`}
        >
          Visor 3D
        </button>

        <button
          onClick={() => onSelectView('nodes')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeView === 'nodes'
              ? 'text-white border-b-2 border-[#f57921] font-semibold'
              : 'text-slate-400'
          }`}
        >
          Laboratorio de Nodos
        </button>

        <button
          onClick={() => onSelectView('shortcuts')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeView === 'shortcuts'
              ? 'text-white border-b-2 border-[#f57921] font-semibold'
              : 'text-slate-400'
          }`}
        >
          Entrenador de Atajos
        </button>
      </nav>

      {/* Zone 3: 1 primary action button */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenAI}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#f57921] hover:bg-[#ea580c] rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Consultar Mentor IA</span>
        </button>
      </div>
    </header>
  );
}
