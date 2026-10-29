'use client';

import React, { useState } from 'react';
import { BlenderProject, TutorialStep } from '@/types/blender';
import { BLENDER_PROJECTS } from '@/data/blenderProjects';
import {
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Layers,
  HelpCircle,
  Lightbulb,
  Clock,
  BookOpen
} from 'lucide-react';

interface ProjectTutorialProps {
  activeProject: BlenderProject;
  activeStepIndex: number;
  onSelectProject: (projectId: string) => void;
  onSelectStep: (stepIndex: number) => void;
  onAskAI: (query: string, context?: string) => void;
}

export default function ProjectTutorial({
  activeProject,
  activeStepIndex,
  onSelectProject,
  onSelectStep,
  onAskAI
}: ProjectTutorialProps) {
  const currentStep = activeProject.steps[activeStepIndex] || activeProject.steps[0];
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStepDone = (stepId: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const hasNext = activeStepIndex < activeProject.steps.length - 1;
  const hasPrev = activeStepIndex > 0;

  return (
    <div className="flex flex-col h-full bg-[#0e141f] text-slate-100 overflow-y-auto">
      {/* Project Selector Bar */}
      <div className="p-4 border-b border-slate-800/80 bg-[#131b29]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">
            Ruta de Aprendizaje Práctica
          </span>
          <span className="text-xs text-[#f57921] font-mono">
            {activeProject.estimatedHours} · Nivel {activeProject.difficulty}
          </span>
        </div>

        {/* Project Switcher Segmented Control */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0b0f17] rounded-lg border border-slate-800">
          {BLENDER_PROJECTS.map((proj) => {
            const isSelected = proj.id === activeProject.id;
            return (
              <button
                key={proj.id}
                onClick={() => {
                  onSelectProject(proj.id);
                  onSelectStep(0);
                }}
                className={`px-2.5 py-2 text-xs font-medium rounded-md transition-all text-left flex flex-col ${
                  isSelected
                    ? 'bg-[#1e293b] text-white shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span className="truncate font-semibold">{proj.title.split(' ')[0]} {proj.title.split(' ')[1]}</span>
                <span className="text-[10px] text-slate-500 truncate">{proj.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Project Header Overview */}
      <div className="p-4 border-b border-slate-800/60">
        <h2 className="text-lg font-bold text-slate-100 font-display flex items-center justify-between">
          <span>{activeProject.title}</span>
          <span className="text-xs font-mono text-slate-400 font-normal">
            Paso {activeStepIndex + 1} de {activeProject.steps.length}
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          {activeProject.subtitle}. {activeProject.coverDescription}
        </p>

        {/* Progress Timeline Stepper */}
        <div className="flex items-center gap-1.5 mt-3">
          {activeProject.steps.map((s, idx) => {
            const isCurrent = idx === activeStepIndex;
            const isDone = completedSteps[s.id];
            return (
              <button
                key={s.id}
                onClick={() => onSelectStep(idx)}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  isCurrent
                    ? 'bg-[#f57921] ring-2 ring-[#f57921]/30'
                    : isDone
                    ? 'bg-emerald-500'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Paso ${idx + 1}: ${s.title}`}
              />
            );
          })}
        </div>
      </div>

      {/* Active Step Content */}
      <div className="p-4 flex-1 flex flex-col gap-4">
        {/* Step Title & Metadata */}
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="text-[#f57921] font-mono font-medium">Paso {currentStep.stepNumber}</span>
            <span aria-hidden="true">·</span>
            <span>{currentStep.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" />
              {currentStep.durationMinutes} min
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 font-mono">Espacio: {currentStep.blenderWorkspace}</span>
          </div>

          <h3 className="text-base font-bold text-white tracking-tight">
            {currentStep.title}
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-[#151e2e] p-2.5 rounded-lg border border-slate-800">
            {currentStep.summary}
          </p>
        </div>

        {/* Instructions List */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#f57921]" />
            Instrucciones Paso a Paso
          </h4>
          <ol className="space-y-2 text-xs text-slate-300">
            {currentStep.instructions.map((inst, i) => (
              <li key={i} className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-[11px] text-[#f57921] shrink-0 font-bold">
                  {i + 1}
                </span>
                <span className="leading-relaxed mt-0.5">{inst}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Key Shortcuts Card */}
        {currentStep.keyShortcuts.length > 0 && (
          <div className="bg-[#131c2a] rounded-lg p-3 border border-slate-800/80">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Atajos Clave de este Paso
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentStep.keyShortcuts.map((sc, i) => (
                <div key={i} className="flex items-center justify-between bg-[#0b0f17] px-2.5 py-1.5 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-300 truncate mr-2">{sc.description}</span>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-[#1e293b] border border-slate-700 rounded text-[#f57921] whitespace-nowrap">
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Pitfalls Warning Callout */}
        <div className="bg-amber-950/20 border border-amber-600/30 rounded-lg p-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-amber-300 block mb-0.5">
                Error común de principiante a evitar:
              </span>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {currentStep.commonPitfalls}
              </p>
            </div>
          </div>
        </div>

        {/* Step Completion Checkbox & AI Help */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80 mt-auto">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              checked={!!completedSteps[currentStep.id]}
              onChange={() => toggleStepDone(currentStep.id)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#f57921] focus:ring-0 cursor-pointer"
            />
            <span>Marcar este paso como completado</span>
          </label>

          <button
            onClick={() => onAskAI(`Tengo una duda sobre el ${currentStep.title} en el proyecto ${activeProject.title}: ¿Cómo realizo ${currentStep.instructions[0]}?`, currentStep.title)}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            ¿Dudas con este paso? Preguntar a IA
          </button>
        </div>

        {/* Step Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => hasPrev && onSelectStep(activeStepIndex - 1)}
            disabled={!hasPrev}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1 transition-all ${
              hasPrev
                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                : 'opacity-40 cursor-not-allowed text-slate-500'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Paso Anterior
          </button>

          <span className="text-[11px] text-slate-500 font-mono">
            {activeStepIndex + 1} / {activeProject.steps.length}
          </span>

          <button
            onClick={() => hasNext && onSelectStep(activeStepIndex + 1)}
            disabled={!hasNext}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1 transition-all ${
              hasNext
                ? 'bg-[#f57921] text-white hover:bg-[#ea580c] shadow-sm font-semibold'
                : 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
            }`}
          >
            Siguiente Paso
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
