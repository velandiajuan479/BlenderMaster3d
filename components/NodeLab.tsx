'use client';

import React, { useState } from 'react';
import { MaterialProperties } from '@/types/blender';
import {
  Layers,
  Sparkles,
  Sliders,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  ExternalLink
} from 'lucide-react';

interface NodeLabProps {
  onUpdateMaterial: (props: MaterialProperties) => void;
}

interface NodePreset {
  id: string;
  name: string;
  description: string;
  props: MaterialProperties;
  noiseScale: number;
  noiseDetail: number;
}

export default function NodeLab({ onUpdateMaterial }: NodeLabProps) {
  // Preset list
  const presets: NodePreset[] = [
    {
      id: 'donut-glaze',
      name: 'Glaseado Dulce de Dona',
      description: 'Color fresa vibrante, rugosidad baja para brillo azucarado y ligera transmisión.',
      props: {
        baseColor: '#e53985',
        roughness: 0.2,
        metalness: 0.05,
        transmission: 0.1,
        emission: '#000000',
        emissionStrength: 0,
        wireframe: false
      },
      noiseScale: 5.0,
      noiseDetail: 2.0
    },
    {
      id: 'fantasy-steel',
      name: 'Acero Épico de Espada',
      description: 'Metálico al 95% con rugosidad modulada para simular filo pulido.',
      props: {
        baseColor: '#94a3b8',
        roughness: 0.22,
        metalness: 0.95,
        transmission: 0,
        emission: '#000000',
        emissionStrength: 0,
        wireframe: false
      },
      noiseScale: 12.0,
      noiseDetail: 4.5
    },
    {
      id: 'cyber-rune',
      name: 'Runa Emisiva Neón',
      description: 'Emisión brillante azul eléctrico para elementos mágicos y sci-fi.',
      props: {
        baseColor: '#00e5ff',
        roughness: 0.1,
        metalness: 0.0,
        transmission: 0,
        emission: '#00e5ff',
        emissionStrength: 3.5,
        wireframe: false
      },
      noiseScale: 20.0,
      noiseDetail: 1.0
    },
    {
      id: 'island-water',
      name: 'Agua Estilizada de Lago',
      description: 'Transmisión alta con tinte turquesa e IOR de 1.333 para refracción limpia.',
      props: {
        baseColor: '#06b6d4',
        roughness: 0.08,
        metalness: 0.05,
        transmission: 0.85,
        emission: '#000000',
        emissionStrength: 0,
        wireframe: false
      },
      noiseScale: 3.5,
      noiseDetail: 1.5
    }
  ];

  const [activePreset, setActivePreset] = useState<string>('donut-glaze');
  const [noiseScale, setNoiseScale] = useState(5.0);
  const [noiseDetail, setNoiseDetail] = useState(2.0);
  const [roughness, setRoughness] = useState(0.2);
  const [metalness, setMetalness] = useState(0.05);
  const [baseColor, setBaseColor] = useState('#e53985');
  const [copiedPython, setCopiedPython] = useState(false);

  const applyPreset = (preset: NodePreset) => {
    setActivePreset(preset.id);
    setBaseColor(preset.props.baseColor);
    setRoughness(preset.props.roughness);
    setMetalness(preset.props.metalness);
    setNoiseScale(preset.noiseScale);
    setNoiseDetail(preset.noiseDetail);
    onUpdateMaterial(preset.props);
  };

  const handleParamChange = (newColor: string, newRough: number, newMetal: number) => {
    setBaseColor(newColor);
    setRoughness(newRough);
    setMetalness(newMetal);
    onUpdateMaterial({
      baseColor: newColor,
      roughness: newRough,
      metalness: newMetal,
      transmission: 0,
      emission: '#000000',
      emissionStrength: 0,
      wireframe: false
    });
  };

  const generateBlenderPythonCode = () => {
    return `import bpy

# Crear nuevo material para Blender
mat = bpy.data.materials.new(name="Procedural_${activePreset}")
mat.use_nodes = True
nodes = mat.node_tree.nodes
links = mat.node_tree.links

# Limpiar nodos predeterminados
nodes.clear()

# 1. Texture Coordinate Node
node_tex_coord = nodes.new(type="ShaderNodeTexCoord")
node_tex_coord.location = (-800, 200)

# 2. Mapping Node
node_mapping = nodes.new(type="ShaderNodeMapping")
node_mapping.location = (-600, 200)

# 3. Noise Texture Node
node_noise = nodes.new(type="ShaderNodeTexNoise")
node_noise.location = (-400, 200)
node_noise.inputs["Scale"].default_value = ${noiseScale.toFixed(1)}
node_noise.inputs["Detail"].default_value = ${noiseDetail.toFixed(1)}

# 4. ColorRamp Node
node_ramp = nodes.new(type="ShaderNodeValToRGB")
node_ramp.location = (-150, 200)

# 5. Principled BSDF
node_bsdf = nodes.new(type="ShaderNodeBsdfPrincipled")
node_bsdf.location = (150, 200)
node_bsdf.inputs["Roughness"].default_value = ${roughness.toFixed(2)}
node_bsdf.inputs["Metallic"].default_value = ${metalness.toFixed(2)}

# 6. Material Output
node_output = nodes.new(type="ShaderNodeOutputMaterial")
node_output.location = (450, 200)

# Conectar cables Bezier
links.new(node_tex_coord.outputs["Generated"], node_mapping.inputs["Vector"])
links.new(node_mapping.outputs["Vector"], node_noise.inputs["Vector"])
links.new(node_noise.outputs["Fac"], node_ramp.inputs["Fac"])
links.new(node_ramp.outputs["Color"], node_bsdf.inputs["Base Color"])
links.new(node_bsdf.outputs["BSDF"], node_output.inputs["Surface"])

print("Material '${activePreset}' generado con éxito en Blender!")`;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateBlenderPythonCode());
    setCopiedPython(true);
    setTimeout(() => setCopiedPython(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0e141f] text-slate-100 overflow-y-auto">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800 bg-[#131b29] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#f57921]" />
            Laboratorio de Nodos & Principled BSDF
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulador visual del Shader Editor de Blender: conecta nodos y observa los cambios en el viewport 3D.
          </p>
        </div>

        {/* Copy Python script for Blender */}
        <button
          onClick={copyCode}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#1e293b] hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          {copiedPython ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          <span>{copiedPython ? '¡Copiado a portapapeles!' : 'Copiar script Python (bpy)'}</span>
        </button>
      </div>

      {/* Preset Selector Bar */}
      <div className="p-4 border-b border-slate-800/80 bg-[#0f1725]">
        <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-2 font-medium">
          Cargar Configuración de Nodos Predefinida:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                activePreset === p.id
                  ? 'bg-[#1e293b] border-[#f57921] shadow-md ring-1 ring-[#f57921]/30'
                  : 'bg-[#131c2a] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-3 h-3 rounded-full border border-slate-600"
                  style={{ backgroundColor: p.props.baseColor }}
                />
                <span className="text-xs font-semibold text-white truncate">{p.name}</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">{p.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Visual Node Graph Canvas */}
      <div className="p-4 flex-1 flex flex-col gap-4">
        <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 overflow-x-auto relative min-h-[380px] flex items-center gap-4">
          {/* Subtle grid background simulating Blender node grid */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* NODE 1: Texture Coordinate */}
          <div className="relative z-10 w-44 bg-[#1e293b] border border-slate-700 rounded-lg shadow-xl overflow-hidden text-xs shrink-0">
            <div className="bg-[#2e3e54] px-3 py-1.5 font-semibold text-slate-200 border-b border-slate-700 flex items-center justify-between">
              <span>Texture Coord</span>
              <span className="text-[10px] text-slate-400">Input</span>
            </div>
            <div className="p-3 space-y-2 text-slate-300">
              <div className="flex justify-between items-center">
                <span>Generated</span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-slate-900" title="Vector Socket (Azul)" />
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Normal</span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/60" />
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>UV</span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/60" />
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Object</span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/60" />
              </div>
            </div>
          </div>

          {/* Connection Cable 1 */}
          <div className="w-8 h-[2px] bg-cyan-400 shrink-0" />

          {/* NODE 2: Noise Texture */}
          <div className="relative z-10 w-52 bg-[#1e293b] border border-slate-700 rounded-lg shadow-xl overflow-hidden text-xs shrink-0">
            <div className="bg-[#382b4a] px-3 py-1.5 font-semibold text-purple-200 border-b border-slate-700 flex items-center justify-between">
              <span>Noise Texture</span>
              <span className="text-[10px] text-purple-300">Procedural</span>
            </div>
            <div className="p-3 space-y-3">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-slate-900" />
                  Vector
                </span>
                <span className="flex items-center gap-1.5">
                  Fac (Gris)
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-900" />
                </span>
              </div>

              {/* Noise Scale Control */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                  <span>Scale</span>
                  <span className="font-mono text-cyan-400">{noiseScale.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.5"
                  value={noiseScale}
                  onChange={(e) => setNoiseScale(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1"
                />
              </div>

              {/* Noise Detail Control */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                  <span>Detail</span>
                  <span className="font-mono text-purple-400">{noiseDetail.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  step="0.5"
                  value={noiseDetail}
                  onChange={(e) => setNoiseDetail(parseFloat(e.target.value))}
                  className="w-full accent-purple-400 h-1"
                />
              </div>
            </div>
          </div>

          {/* Connection Cable 2 */}
          <div className="w-8 h-[2px] bg-slate-300 shrink-0" />

          {/* NODE 3: ColorRamp */}
          <div className="relative z-10 w-52 bg-[#1e293b] border border-slate-700 rounded-lg shadow-xl overflow-hidden text-xs shrink-0">
            <div className="bg-[#443828] px-3 py-1.5 font-semibold text-amber-200 border-b border-slate-700 flex items-center justify-between">
              <span>ColorRamp</span>
              <span className="text-[10px] text-amber-300">Converter</span>
            </div>
            <div className="p-3 space-y-2.5">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-900" />
                  Fac
                </span>
                <span className="flex items-center gap-1.5">
                  Color
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-900" />
                </span>
              </div>

              {/* Gradient preview bar */}
              <div
                className="w-full h-5 rounded border border-slate-600"
                style={{
                  background: `linear-gradient(to right, #000000 0%, ${baseColor} 100%)`
                }}
              />
              <span className="text-[10px] text-slate-400 block text-center">Interpolar Factor a Color</span>
            </div>
          </div>

          {/* Connection Cable 3 */}
          <div className="w-8 h-[2px] bg-amber-400 shrink-0" />

          {/* NODE 4: Principled BSDF */}
          <div className="relative z-10 w-60 bg-[#1e293b] border-2 border-[#f57921]/60 rounded-lg shadow-xl overflow-hidden text-xs shrink-0">
            <div className="bg-[#1e3a5f] px-3 py-1.5 font-bold text-sky-200 border-b border-slate-700 flex items-center justify-between">
              <span>Principled BSDF</span>
              <span className="text-[10px] text-sky-300">Shader</span>
            </div>
            <div className="p-3 space-y-3">
              {/* Base Color input */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-900" />
                  Base Color
                </span>
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => handleParamChange(e.target.value, roughness, metalness)}
                  className="w-6 h-6 rounded cursor-pointer border border-slate-600 bg-transparent"
                />
              </div>

              {/* Metallic input */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                  <span>Metallic</span>
                  <span className="font-mono text-cyan-400">{metalness.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={metalness}
                  onChange={(e) => handleParamChange(baseColor, roughness, parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1"
                />
              </div>

              {/* Roughness input */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                  <span>Roughness</span>
                  <span className="font-mono text-[#f57921]">{roughness.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={roughness}
                  onChange={(e) => handleParamChange(baseColor, parseFloat(e.target.value), metalness)}
                  className="w-full accent-[#f57921] h-1"
                />
              </div>

              {/* BSDF Output */}
              <div className="flex justify-end items-center gap-1.5 pt-1 border-t border-slate-700 text-slate-200">
                <span>BSDF</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900" title="Shader Socket (Verde)" />
              </div>
            </div>
          </div>

          {/* Connection Cable 4 */}
          <div className="w-8 h-[2px] bg-emerald-400 shrink-0" />

          {/* NODE 5: Material Output */}
          <div className="relative z-10 w-40 bg-[#1e293b] border border-slate-700 rounded-lg shadow-xl overflow-hidden text-xs shrink-0">
            <div className="bg-[#422020] px-3 py-1.5 font-semibold text-rose-200 border-b border-slate-700 flex items-center justify-between">
              <span>Material Output</span>
              <span className="text-[10px] text-rose-300">Final</span>
            </div>
            <div className="p-3 space-y-2 text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900" />
                <span>Surface</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/40" />
                <span>Volume</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/40" />
                <span>Displacement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Node Didactic Guide Explainer */}
        <div className="bg-[#131c2a] rounded-xl p-4 border border-slate-800">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#f57921]" />
            ¿Cómo funciona la lógica de nodos en Blender?
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="bg-[#0b0f17] p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-cyan-300 block mb-1">1. Código de Colores de Sockets</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                <strong className="text-amber-400">Amarillo</strong> = Información de Color (RGB), <strong className="text-cyan-400">Azul</strong> = Vectores 3D (X, Y, Z), <strong className="text-slate-200">Gris</strong> = Números individuales (Float / Fac 0 a 1), <strong className="text-emerald-400">Verde</strong> = Flujo de luz y sombreadores (Shaders).
              </p>
            </div>
            <div className="bg-[#0b0f17] p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-purple-300 block mb-1">2. Texturas Procedurales</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Nodos como <em>Noise</em> o <em>Voronoi</em> generan patrones matemáticos infinitos sin resolución fija. No se pixelan jamás y se adaptan a cualquier curvatura 3D sin estirar UVs.
              </p>
            </div>
            <div className="bg-[#0b0f17] p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-emerald-300 block mb-1">3. Principled BSDF PBR</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Es el estándar de la industria (Disney PBR). Al conectar una textura a <em>Roughness</em>, las zonas blancas serán mates y las negras reflectantes, creando micro-arañazos fotorrealistas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
