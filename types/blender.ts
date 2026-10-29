export type RenderMode = 'wireframe' | 'solid' | 'material' | 'cycles';

export interface ModifierState {
  subdivision: number; // 0 to 3
  bevel: boolean;
  bevelWidth: number;
  array: number; // 1 to 5
  mirror: boolean;
  wireframeOverlay: boolean;
  displace: number; // 0 to 1
}

export interface MaterialProperties {
  baseColor: string;
  roughness: number;
  metalness: number;
  transmission: number;
  emission: string;
  emissionStrength: number;
  wireframe: boolean;
}

export interface TutorialStep {
  id: string;
  stepNumber: number;
  title: string;
  category: string;
  durationMinutes: number;
  summary: string;
  instructions: string[];
  keyShortcuts: { key: string; description: string }[];
  commonPitfalls: string;
  blenderWorkspace: string;
  modelStage: number; // Sincroniza la visualización 3D (0: Bloqueo básico, 1: Modelado medio, 2: Modificadores, 3: Shading/Detalle)
}

export interface BlenderProject {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  estimatedHours: string;
  badge: string;
  coverDescription: string;
  topics: string[];
  steps: TutorialStep[];
}

export interface ShortcutItem {
  id: string;
  keys: string[];
  name: string;
  category: 'Modelado' | 'Navegación' | 'Selección' | 'Shading' | 'Escultura' | 'Render';
  mode: 'Object Mode' | 'Edit Mode' | 'Sculpt Mode' | 'General';
  description: string;
  tip?: string;
}

export interface ShaderNode {
  id: string;
  title: string;
  category: 'Input' | 'Texture' | 'Color' | 'Shader' | 'Output';
  x: number;
  y: number;
  inputs: { id: string; label: string; type: 'vector' | 'color' | 'float' | 'shader'; value?: any }[];
  outputs: { id: string; label: string; type: 'vector' | 'color' | 'float' | 'shader' }[];
  params?: Record<string, any>;
}

export interface NodeConnection {
  fromNode: string;
  fromOutput: string;
  toNode: string;
  toInput: string;
}
