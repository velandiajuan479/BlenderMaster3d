'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import BlenderViewport from '@/components/BlenderViewport';
import ProjectTutorial from '@/components/ProjectTutorial';
import ShortcutTrainer from '@/components/ShortcutTrainer';
import NodeLab from '@/components/NodeLab';
import BlenderAIChat from '@/components/BlenderAIChat';
import { BLENDER_PROJECTS } from '@/data/blenderProjects';
import { MaterialProperties } from '@/types/blender';
import {
  Layers,
  Sparkles,
  Zap,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function HomePage() {
  const [activeView, setActiveView] = useState<'projects' | 'viewport' | 'nodes' | 'shortcuts'>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('donut');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>(undefined);

  // Material override from NodeLab to Viewport
  const [materialOverride, setMaterialOverride] = useState<Partial<MaterialProperties>>({
    baseColor: '#e53985',
    roughness: 0.25,
    metalness: 0.1
  });

  const activeProject = BLENDER_PROJECTS.find(p => p.id === selectedProjectId) || BLENDER_PROJECTS[0];

  const handleAskAI = (query: string, context?: string) => {
    setAiInitialPrompt(query);
    setIsAIChatOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0b0f17] text-slate-100 font-sans">
      {/* 3-Zone Navbar */}
      <Navbar
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenAI={() => {
          setAiInitialPrompt(undefined);
          setIsAIChatOpen(true);
        }}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {/* VIEW 1: GUIDED PROJECTS (Split Screen: Steps on Left, Live 3D Viewport on Right) */}
        {activeView === 'projects' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-full">
            {/* Left Column: Project Steps & Instructions (5 cols on lg) */}
            <div className="lg:col-span-5 h-full overflow-hidden border-r border-slate-800 flex flex-col">
              <ProjectTutorial
                activeProject={activeProject}
                activeStepIndex={activeStepIndex}
                onSelectProject={(id) => {
                  setSelectedProjectId(id);
                  setActiveStepIndex(0);
                }}
                onSelectStep={(idx) => setActiveStepIndex(idx)}
                onAskAI={handleAskAI}
              />
            </div>

            {/* Right Column: Interactive 3D Viewport reflecting current stage (7 cols on lg) */}
            <div className="lg:col-span-7 h-full relative overflow-hidden flex flex-col">
              <BlenderViewport
                activeProject={activeProject.id}
                projectStage={activeStepIndex}
                materialOverride={materialOverride}
                onMaterialChange={(m) => setMaterialOverride(m)}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: FULLSCREEN 3D VIEWPORT & MODIFIERS PLAYGROUND */}
        {activeView === 'viewport' && (
          <div className="flex-1 w-full h-full relative overflow-hidden">
            <BlenderViewport
              activeProject={activeProject.id}
              projectStage={activeStepIndex}
              materialOverride={materialOverride}
              onMaterialChange={(m) => setMaterialOverride(m)}
            />
          </div>
        )}

        {/* VIEW 3: NODE LAB & SHADER EDITOR (Split: Nodes on Left, Live Shader Preview on Right) */}
        {activeView === 'nodes' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-full">
            <div className="lg:col-span-8 h-full overflow-hidden border-r border-slate-800">
              <NodeLab
                onUpdateMaterial={(newProps) => {
                  setMaterialOverride(newProps);
                }}
              />
            </div>
            <div className="lg:col-span-4 h-full relative overflow-hidden flex flex-col">
              <div className="bg-[#131b29] p-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Previsualización de Shading en Tiempo Real
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Principled BSDF</span>
              </div>
              <div className="flex-1 relative">
                <BlenderViewport
                  activeProject={activeProject.id}
                  projectStage={activeStepIndex}
                  materialOverride={materialOverride}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: SHORTCUT TRAINER & MUSCLE MEMORY */}
        {activeView === 'shortcuts' && (
          <div className="flex-1 w-full h-full overflow-hidden">
            <ShortcutTrainer />
          </div>
        )}
      </main>

      {/* Floating AI Assistant Drawer */}
      <BlenderAIChat
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        initialPrompt={aiInitialPrompt}
      />
    </div>
  );
}
