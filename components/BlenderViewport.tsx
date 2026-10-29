'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ModifierState, RenderMode, MaterialProperties } from '@/types/blender';
import {
  Layers,
  Box,
  Eye,
  Camera,
  RotateCcw,
  Maximize2,
  Minimize2,
  Sliders,
  Sparkles,
  Palette,
  ChevronDown,
  ChevronUp,
  Cpu
} from 'lucide-react';

interface BlenderViewportProps {
  activeProject?: string; // 'donut' | 'sword' | 'island' | 'free'
  projectStage?: number; // 0, 1, 2, 3
  materialOverride?: Partial<MaterialProperties>;
  onMaterialChange?: (props: MaterialProperties) => void;
  className?: string;
}

export default function BlenderViewport({
  activeProject = 'donut',
  projectStage = 3,
  materialOverride,
  onMaterialChange,
  className = ''
}: BlenderViewportProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const requestRef = useRef<number>(0);
  const isSoftwareGlRef = useRef<boolean>(false);

  // Viewport Settings State
  const [renderMode, setRenderMode] = useState<RenderMode>('material');
  const [isZenMode, setIsZenMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'shading' | 'modifiers' | 'camera'>('shading');
  const [isWireframeOverlay, setIsWireframeOverlay] = useState(false);

  // Modifiers State
  const [modifiers, setModifiers] = useState<ModifierState>({
    subdivision: 1,
    bevel: false,
    bevelWidth: 0.05,
    array: 1,
    mirror: false,
    wireframeOverlay: false,
    displace: 0
  });

  // Material State
  const [internalMaterialProps, setInternalMaterialProps] = useState<MaterialProperties>({
    baseColor: '#e53985',
    roughness: 0.25,
    metalness: 0.1,
    transmission: 0,
    emission: '#000000',
    emissionStrength: 0,
    wireframe: false
  });

  // Derived effective material props
  const materialProps: MaterialProperties = useMemo(() => ({
    ...internalMaterialProps,
    ...(materialOverride || {})
  }), [internalMaterialProps, materialOverride]);

  // Initial Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect Software WebGL
    const detectSoftwareGl = (): boolean => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    };

    const isSoftwareGl = detectSoftwareGl();
    isSoftwareGlRef.current = isSoftwareGl;

    // 2. Setup Scene & Color Space
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x131720); // Blender viewport dark background

    // Atmospheric Fog
    scene.fog = new THREE.FogExp2(0x131720, 0.035);

    // 3. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(3.2, 2.4, 4.2);
    cameraRef.current = camera;

    // 4. Renderer with PBR tone mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
      preserveDrawingBuffer: true
    });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 5. Studio Environment Map (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    pmremGenerator.dispose();

    // 6. Studio Lighting Rig (3-Point Lighting)
    // Ambient / Hemisphere fill
    const hemiLight = new THREE.HemisphereLight(0xfff5eb, 0x1a2436, 0.7);
    scene.add(hemiLight);

    // Key Light (Warm Key)
    const keyLight = new THREE.DirectionalLight(0xfff2e0, 2.2);
    keyLight.position.set(4, 5, 3);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    // Fill Light (Cool Fill)
    const fillLight = new THREE.DirectionalLight(0x90caf9, 1.1);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    // Rim / Back Light (Crisp Contour)
    const rimLight = new THREE.DirectionalLight(0x00e5ff, 1.4);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // 7. Ground Grid & Contact Shadow Plane (Blender 3D Grid)
    const gridHelper = new THREE.GridHelper(10, 20, 0x3b4759, 0x1f2937);
    gridHelper.position.y = -0.005;
    scene.add(gridHelper);

    // Contact shadow plane
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // 8. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't go below ground
    controls.minDistance = 1.5;
    controls.maxDistance = 15;
    controls.target.set(0, 0.7, 0);
    controls.update();

    let isInteracting = false;
    controls.addEventListener('start', () => {
      isInteracting = true;
    });
    controls.addEventListener('end', () => {
      isInteracting = false;
    });

    // 9. Root Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // 10. Animation Loop
    let lastTime = performance.now();
    const animate = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (controls.enableDamping) {
        controls.update();
      }

      // Subtle slow turntable rotation for showcase if user isn't dragging
      if (modelGroup && !isInteracting) {
        modelGroup.rotation.y += delta * 0.12;
      }

      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    // 11. Responsive Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Rebuild 3D Model when active project, stage, modifiers or material changes
  useEffect(() => {
    const scene = sceneRef.current;
    const modelGroup = modelGroupRef.current;
    if (!scene || !modelGroup) return;

    // Clear existing meshes in model group
    while (modelGroup.children.length > 0) {
      const child = modelGroup.children[0] as THREE.Mesh;
      if (child.geometry) child.geometry.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach(m => m.dispose());
      } else if (child.material) {
        child.material.dispose();
      }
      modelGroup.remove(child);
    }

    // Material helper based on renderMode
    const getMaterial = (baseColorHex: string, roughnessVal = 0.5, metalnessVal = 0, isWire = false) => {
      if (renderMode === 'wireframe' || isWire) {
        return new THREE.MeshBasicMaterial({
          color: 0x00ffcc,
          wireframe: true
        });
      }

      if (renderMode === 'solid') {
        // MatCap / Clay studio shader
        return new THREE.MeshStandardMaterial({
          color: 0x94a3b8,
          roughness: 0.65,
          metalness: 0.05
        });
      }

      // Material Preview & Cycles
      const isCycles = renderMode === 'cycles';
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(baseColorHex),
        roughness: isCycles ? roughnessVal * 0.9 : roughnessVal,
        metalness: isCycles ? metalnessVal : metalnessVal,
        wireframe: materialProps.wireframe || isWireframeOverlay
      });
    };

    // Subdiv detail segments multiplier
    const subSegments = Math.pow(2, modifiers.subdivision);

    // BUILD PROJECT SPECIFIC PROCEDURAL MODEL
    if (activeProject === 'donut') {
      // 1. Dough Base (Torus)
      const doughRadius = 0.9;
      const tubeRadius = 0.42;
      const radialSegs = Math.max(16, 16 * subSegments);
      const tubularSegs = Math.max(24, 28 * subSegments);

      const torusGeo = new THREE.TorusGeometry(doughRadius, tubeRadius, radialSegs, tubularSegs);

      // Deform slightly if stage >= 1 (Organic proportional editing simulation)
      if (projectStage >= 1 || modifiers.displace > 0) {
        const pos = torusGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const u = pos.getX(i);
          const v = pos.getY(i);
          const w = pos.getZ(i);
          const noise = Math.sin(u * 4) * Math.cos(w * 4) * 0.04 * (projectStage >= 1 ? 1 : 0);
          const disp = modifiers.displace * Math.sin(u * 10 + w * 10) * 0.06;
          pos.setY(i, v + noise + disp);
        }
        torusGeo.computeVertexNormals();
      }

      const doughMat = getMaterial('#e5a05d', 0.65, 0.05);
      const doughMesh = new THREE.Mesh(torusGeo, doughMat);
      doughMesh.rotation.x = Math.PI / 2;
      doughMesh.position.y = 0.55;
      doughMesh.castShadow = true;
      doughMesh.receiveShadow = true;
      modelGroup.add(doughMesh);

      // 2. Icing Layer (Stage >= 2)
      if (projectStage >= 2) {
        // Upper half torus with solidifying thickness
        const icingGeo = new THREE.TorusGeometry(
          doughRadius * 1.015,
          tubeRadius * 1.03,
          radialSegs,
          tubularSegs,
          Math.PI * 1.15
        );

        // Deform bottom drops
        const icingPos = icingGeo.attributes.position;
        for (let i = 0; i < icingPos.count; i++) {
          const y = icingPos.getY(i);
          const x = icingPos.getX(i);
          const z = icingPos.getZ(i);
          // Drops dripping along outer edges
          const drip = Math.sin(x * 6 + z * 6) * 0.06;
          icingPos.setY(i, y + drip);
        }
        icingGeo.computeVertexNormals();

        const icingMat = getMaterial(materialProps.baseColor || '#e53985', materialProps.roughness, materialProps.metalness);
        const icingMesh = new THREE.Mesh(icingGeo, icingMat);
        icingMesh.rotation.x = Math.PI / 2;
        icingMesh.position.y = 0.56;
        icingMesh.castShadow = true;
        modelGroup.add(icingMesh);

        // 3. Sprinkles (Chispas) (Stage >= 3)
        if (projectStage >= 3) {
          const sprinkleCount = 65;
          const sprinkleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.16, 6);
          const colors = [0xffffff, 0x00e5ff, 0xffeb3b, 0x76ff03, 0xff5252, 0xff4081];

          for (let i = 0; i < sprinkleCount; i++) {
            const angle = (i / sprinkleCount) * Math.PI * 2 + Math.random() * 0.1;
            const dist = doughRadius + (Math.random() - 0.5) * 0.35;
            const x = Math.cos(angle) * dist;
            const z = Math.sin(angle) * dist;
            const y = 0.9 + Math.cos(angle * 2) * 0.06;

            const sMat = new THREE.MeshStandardMaterial({
              color: colors[i % colors.length],
              roughness: 0.3,
              metalness: 0.1
            });
            const sMesh = new THREE.Mesh(sprinkleGeo, sMat);
            sMesh.position.set(x, y, z);
            sMesh.rotation.set(
              Math.random() * Math.PI,
              Math.random() * Math.PI,
              Math.random() * Math.PI
            );
            sMesh.castShadow = true;
            modelGroup.add(sMesh);
          }
        }
      }
    } else if (activeProject === 'sword') {
      // LOW-POLY FANTASY SWORD
      const swordPivot = new THREE.Group();

      // Blade
      const bladeGeo = new THREE.BoxGeometry(0.24, projectStage >= 1 ? 2.6 : 1.8, 0.06, 2, 8, 1);
      // Taper blade tip
      const bPos = bladeGeo.attributes.position;
      for (let i = 0; i < bPos.count; i++) {
        const y = bPos.getY(i);
        if (y > 0.8) {
          const factor = 1 - (y - 0.8) / 0.7;
          bPos.setX(i, bPos.getX(i) * Math.max(0.1, factor));
        }
      }
      bladeGeo.computeVertexNormals();

      const bladeMat = getMaterial('#d1d5db', 0.25, 0.9);
      const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
      bladeMesh.position.y = 1.6;
      bladeMesh.castShadow = true;
      swordPivot.add(bladeMesh);

      // Stage >= 1: Guard & Pommel & Handle
      if (projectStage >= 1) {
        // Crossguard
        const guardGeo = new THREE.BoxGeometry(0.9, 0.14, 0.22);
        const guardMat = getMaterial('#d97706', 0.35, 0.85); // Brass / Gold
        const guardMesh = new THREE.Mesh(guardGeo, guardMat);
        guardMesh.position.y = 0.35;
        guardMesh.castShadow = true;
        swordPivot.add(guardMesh);

        // Handle Grip
        const handleGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.7, 8);
        const handleMat = getMaterial('#451a03', 0.8, 0.05); // Leather
        const handleMesh = new THREE.Mesh(handleGeo, handleMat);
        handleMesh.position.y = -0.05;
        handleMesh.castShadow = true;
        swordPivot.add(handleMesh);

        // Pommel
        const pommelGeo = new THREE.OctahedronGeometry(0.16, 0);
        const pommelMesh = new THREE.Mesh(pommelGeo, guardMat);
        pommelMesh.position.y = -0.48;
        pommelMesh.castShadow = true;
        swordPivot.add(pommelMesh);
      }

      // Stage >= 2: Fuller Groove
      if (projectStage >= 2) {
        const fullerGeo = new THREE.BoxGeometry(0.06, 1.6, 0.07);
        const fullerMat = getMaterial('#374151', 0.4, 0.6);
        const fullerMesh = new THREE.Mesh(fullerGeo, fullerMat);
        fullerMesh.position.y = 1.5;
        swordPivot.add(fullerMesh);
      }

      // Stage >= 3: Glowing Celestial Rune
      if (projectStage >= 3) {
        const runeGeo = new THREE.BoxGeometry(0.07, 0.4, 0.08);
        const runeMat = new THREE.MeshStandardMaterial({
          color: 0x00e5ff,
          emissive: new THREE.Color(0x00e5ff),
          emissiveIntensity: 3.5,
          roughness: 0.1
        });
        const runeMesh = new THREE.Mesh(runeGeo, runeMat);
        runeMesh.position.y = 1.2;
        swordPivot.add(runeMesh);
      }

      modelGroup.add(swordPivot);
    } else if (activeProject === 'island') {
      // FLOATING LOW-POLY ISLAND
      const islandPivot = new THREE.Group();

      // Rocky Mountain base (inverted faceted cone)
      const rockGeo = new THREE.ConeGeometry(1.9, 1.8, 7);
      rockGeo.rotateX(Math.PI);
      const rockMat = getMaterial('#475569', 0.85, 0.05);
      const rockMesh = new THREE.Mesh(rockGeo, rockMat);
      rockMesh.position.y = 0.3;
      rockMesh.castShadow = true;
      rockMesh.receiveShadow = true;
      islandPivot.add(rockMesh);

      // Grassy top plateau
      const grassGeo = new THREE.CylinderGeometry(1.85, 1.7, 0.4, 7);
      const grassMat = getMaterial('#15803d', 0.75, 0.0);
      const grassMesh = new THREE.Mesh(grassGeo, grassMat);
      grassMesh.position.y = 1.35;
      grassMesh.castShadow = true;
      grassMesh.receiveShadow = true;
      islandPivot.add(grassMesh);

      // Stage >= 1: Trees and low-poly rocks
      if (projectStage >= 1) {
        const addTree = (x: number, z: number, scale = 1) => {
          const treeGroup = new THREE.Group();
          // Trunk
          const trunkGeo = new THREE.CylinderGeometry(0.06 * scale, 0.08 * scale, 0.5 * scale, 5);
          const trunkMat = getMaterial('#78350f', 0.9, 0.0);
          const trunk = new THREE.Mesh(trunkGeo, trunkMat);
          trunk.position.y = 0.25 * scale;
          treeGroup.add(trunk);

          // Cones foliage
          const foliageMat = getMaterial('#166534', 0.6, 0.0);
          for (let l = 0; l < 3; l++) {
            const coneGeo = new THREE.ConeGeometry((0.45 - l * 0.1) * scale, 0.5 * scale, 6);
            const cone = new THREE.Mesh(coneGeo, foliageMat);
            cone.position.y = (0.45 + l * 0.28) * scale;
            cone.castShadow = true;
            treeGroup.add(cone);
          }

          treeGroup.position.set(x, 1.5, z);
          islandPivot.add(treeGroup);
        };

        addTree(-0.6, -0.4, 1.1);
        addTree(0.7, 0.3, 0.9);
        addTree(0.2, -0.7, 0.75);

        // Rocks
        const rock1Geo = new THREE.DodecahedronGeometry(0.2, 0);
        const r1 = new THREE.Mesh(rock1Geo, rockMat);
        r1.position.set(-0.8, 1.6, 0.5);
        r1.castShadow = true;
        islandPivot.add(r1);
      }

      // Stage >= 2: Translucent Water Pond
      if (projectStage >= 2) {
        const waterGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.1, 8);
        const waterMat = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          roughness: 0.1,
          metalness: 0.1,
          transparent: true,
          opacity: 0.8
        });
        const waterMesh = new THREE.Mesh(waterGeo, waterMat);
        waterMesh.position.set(-0.1, 1.56, 0.3);
        islandPivot.add(waterMesh);
      }

      // Stage >= 3: Low-poly fluffy clouds floating nearby
      if (projectStage >= 3) {
        const cloudMat = new THREE.MeshStandardMaterial({
          color: 0xf8fafc,
          roughness: 0.5
        });

        const cloudGroup = new THREE.Group();
        const p1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 0), cloudMat);
        const p2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.22, 0), cloudMat);
        p2.position.set(0.25, -0.05, 0);
        const p3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.2, 0), cloudMat);
        p3.position.set(-0.25, -0.05, 0);
        cloudGroup.add(p1, p2, p3);
        cloudGroup.position.set(1.4, 2.1, -0.8);
        islandPivot.add(cloudGroup);
      }

      modelGroup.add(islandPivot);
    } else {
      // FREE / MODIFIER WORKSHOP PRIMITIVE (Rounded Chamfer Torus / Cube)
      const baseGeo = new THREE.BoxGeometry(1.4, 1.4, 1.4, subSegments, subSegments, subSegments);
      const testMat = getMaterial(materialProps.baseColor, materialProps.roughness, materialProps.metalness);
      const testMesh = new THREE.Mesh(baseGeo, testMat);
      testMesh.position.y = 0.8;
      testMesh.castShadow = true;
      testMesh.receiveShadow = true;
      modelGroup.add(testMesh);
    }

    // APPLY ARRAY MODIFIER
    if (modifiers.array > 1) {
      const original = modelGroup.children[0];
      if (original) {
        for (let a = 1; a < modifiers.array; a++) {
          const clone = original.clone();
          clone.position.x += a * 2.2;
          modelGroup.add(clone);
        }
      }
    }

    // APPLY MIRROR MODIFIER (Duplicate across X with negative scale)
    if (modifiers.mirror) {
      const original = modelGroup.children[0];
      if (original) {
        const mirrorClone = original.clone();
        mirrorClone.position.x = -mirrorClone.position.x - 2.0;
        modelGroup.add(mirrorClone);
      }
    }
  }, [activeProject, projectStage, renderMode, modifiers, materialProps, isWireframeOverlay]);

  // Camera presets (matching Blender Numpad shortcuts)
  const setCameraPreset = (preset: 'front' | 'side' | 'top' | 'persp') => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (preset === 'front') {
      camera.position.set(0, 0.8, 5);
      controls.target.set(0, 0.8, 0);
    } else if (preset === 'side') {
      camera.position.set(5, 0.8, 0);
      controls.target.set(0, 0.8, 0);
    } else if (preset === 'top') {
      camera.position.set(0, 6, 0.01);
      controls.target.set(0, 0.8, 0);
    } else {
      camera.position.set(3.2, 2.4, 4.2);
      controls.target.set(0, 0.7, 0);
    }
    camera.updateProjectionMatrix();
    controls.update();
  };

  return (
    <div className={`relative w-full h-full bg-[#131720] overflow-hidden select-none flex flex-col ${className}`}>
      {/* 3D WebGL Canvas mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header HUD inside Viewport (Blender Viewport Header) */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        {/* Left: Viewport Status & Active Workspace */}
        <div className="flex items-center gap-2 bg-[#1e293b]/85 border border-slate-700/60 rounded-lg px-3 py-1.5 shadow-lg backdrop-blur-md pointer-events-auto">
          <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#f57921]" />
            Blender 3D Viewport
          </span>
          <span className="text-slate-600 text-xs">|</span>
          <span className="text-[11px] text-slate-400 font-mono">
            {activeProject === 'donut' ? 'Proyecto: Dona 3D' : activeProject === 'sword' ? 'Proyecto: Espada Low-Poly' : 'Proyecto: Isla Flotante'}
          </span>
          <span className="text-slate-600 text-xs">·</span>
          <span className="text-[11px] text-[#f57921] font-mono">
            Paso {projectStage + 1}/4
          </span>
        </div>

        {/* Right: Blender Shading Modes (Wireframe, Solid, Material, Cycles) */}
        <div className="flex items-center gap-1 bg-[#1e293b]/85 border border-slate-700/60 rounded-lg p-1 shadow-lg backdrop-blur-md pointer-events-auto">
          <button
            onClick={() => setRenderMode('wireframe')}
            title="Wireframe (Z > 4)"
            className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
              renderMode === 'wireframe'
                ? 'bg-[#06b6d4] text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Wireframe
          </button>
          <button
            onClick={() => setRenderMode('solid')}
            title="Solid Workbench (Z > 6)"
            className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
              renderMode === 'solid'
                ? 'bg-slate-200 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Solid
          </button>
          <button
            onClick={() => setRenderMode('material')}
            title="Material Preview EEVEE (Z > 2)"
            className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
              renderMode === 'material'
                ? 'bg-[#f57921] text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Material
          </button>
          <button
            onClick={() => setRenderMode('cycles')}
            title="Cycles Render (Z > 8)"
            className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
              renderMode === 'cycles'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Cycles
          </button>

          <div className="w-[1px] h-4 bg-slate-700 mx-1" />

          {/* Wireframe Overlay Toggle */}
          <button
            onClick={() => setIsWireframeOverlay(!isWireframeOverlay)}
            title="Superponer Malla Poligonal (Overlays)"
            className={`p-1.5 rounded transition-colors ${
              isWireframeOverlay ? 'bg-[#f57921]/20 text-[#f57921]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Zen / Fullscreen Toggle */}
          <button
            onClick={() => setIsZenMode(!isZenMode)}
            title="Modo Zen / Ocultar controles"
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isZenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Floating Camera Numpad Quick Switcher (Top Left underneath) */}
      <div className="absolute top-16 left-3 flex flex-col gap-1 z-10">
        <div className="bg-[#1e293b]/80 border border-slate-700/60 rounded-lg p-1 flex flex-col gap-0.5 shadow-md backdrop-blur-md">
          <button
            onClick={() => setCameraPreset('front')}
            title="Vista Frontal (Numpad 1)"
            className="px-2 py-1 text-[11px] font-mono text-slate-300 hover:bg-slate-700 rounded text-left transition-colors flex items-center justify-between gap-2"
          >
            <span>Frontal</span>
            <kbd className="text-[9px] bg-slate-900 px-1 py-0.5 rounded text-slate-400">Num 1</kbd>
          </button>
          <button
            onClick={() => setCameraPreset('side')}
            title="Vista Lateral (Numpad 3)"
            className="px-2 py-1 text-[11px] font-mono text-slate-300 hover:bg-slate-700 rounded text-left transition-colors flex items-center justify-between gap-2"
          >
            <span>Lateral</span>
            <kbd className="text-[9px] bg-slate-900 px-1 py-0.5 rounded text-slate-400">Num 3</kbd>
          </button>
          <button
            onClick={() => setCameraPreset('top')}
            title="Vista Superior (Numpad 7)"
            className="px-2 py-1 text-[11px] font-mono text-slate-300 hover:bg-slate-700 rounded text-left transition-colors flex items-center justify-between gap-2"
          >
            <span>Superior</span>
            <kbd className="text-[9px] bg-slate-900 px-1 py-0.5 rounded text-slate-400">Num 7</kbd>
          </button>
          <button
            onClick={() => setCameraPreset('persp')}
            title="Restablecer Vista Libre"
            className="px-2 py-1 text-[11px] font-mono text-[#f57921] hover:bg-slate-700 rounded text-left transition-colors flex items-center justify-between gap-2"
          >
            <span>Orbital</span>
            <RotateCcw className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* Collapsible Bottom Control Dock (Consolidated according to 3D spatial guidelines) */}
      {!isZenMode && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[92%] max-w-3xl z-20 transition-all duration-200">
          <div className="bg-[#18212f]/90 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden">
            {/* Dock Header with Tabs */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-700/60 bg-[#0f172a]/60">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('shading')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                    activeTab === 'shading'
                      ? 'bg-[#f57921] text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  Material Principled BSDF
                </button>
                <button
                  onClick={() => setActiveTab('modifiers')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                    activeTab === 'modifiers'
                      ? 'bg-[#f57921] text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Pila de Modificadores (Stack)
                </button>
              </div>

              <div className="text-[11px] text-slate-400 font-mono hidden sm:flex items-center gap-1">
                <span>Arrastra para orbitar</span>
                <span>·</span>
                <span>Rueda para zoom</span>
              </div>
            </div>

            {/* Dock Tab Content */}
            <div className="p-3">
              {activeTab === 'shading' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {/* Base Color Picker */}
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Color Base</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={materialProps.baseColor}
                        onChange={(e) => {
                          const next = { ...materialProps, baseColor: e.target.value };
                          setInternalMaterialProps(next);
                          onMaterialChange?.(next);
                        }}
                        className="w-8 h-8 rounded border border-slate-600 bg-transparent cursor-pointer"
                      />
                      <span className="font-mono text-[11px] text-slate-400 uppercase">{materialProps.baseColor}</span>
                    </div>
                  </div>

                  {/* Roughness (Rugosidad) */}
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Roughness</span>
                      <span className="font-mono text-slate-400">{materialProps.roughness.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={materialProps.roughness}
                      onChange={(e) => {
                        const next = { ...materialProps, roughness: parseFloat(e.target.value) };
                        setInternalMaterialProps(next);
                        onMaterialChange?.(next);
                      }}
                      className="w-full accent-[#f57921]"
                    />
                    <span className="text-[10px] text-slate-500 block">0 = Espejo, 1 = Mate</span>
                  </div>

                  {/* Metallic (Metálico) */}
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Metallic</span>
                      <span className="font-mono text-slate-400">{materialProps.metalness.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={materialProps.metalness}
                      onChange={(e) => {
                        const next = { ...materialProps, metalness: parseFloat(e.target.value) };
                        setInternalMaterialProps(next);
                        onMaterialChange?.(next);
                      }}
                      className="w-full accent-[#f57921]"
                    />
                    <span className="text-[10px] text-slate-500 block">Dieléctrico vs Conductor</span>
                  </div>

                  {/* Quick Preset Colors */}
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Presets de Shading</label>
                    <div className="flex items-center gap-1.5 mt-1">
                      {[
                        { name: 'Fresa Glaseado', color: '#e53985', rough: 0.2, metal: 0.05 },
                        { name: 'Oro Pulido', color: '#f59e0b', rough: 0.15, metal: 0.95 },
                        { name: 'Acero Espada', color: '#94a3b8', rough: 0.25, metal: 0.9 },
                        { name: 'Césped', color: '#15803d', rough: 0.75, metal: 0.0 }
                      ].map((p) => (
                        <button
                          key={p.name}
                          title={p.name}
                          onClick={() => {
                            const next = {
                              ...materialProps,
                              baseColor: p.color,
                              roughness: p.rough,
                              metalness: p.metal
                            };
                            setInternalMaterialProps(next);
                            onMaterialChange?.(next);
                          }}
                          className="w-6 h-6 rounded-full border border-slate-600 transition-transform hover:scale-110"
                          style={{ backgroundColor: p.color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'modifiers' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {/* Subdivision Surface */}
                  <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-slate-200">Subdivision Surface</span>
                      <span className="font-mono text-[#f57921]">Nv. {modifiers.subdivision}</span>
                    </div>
                    <div className="flex gap-1 mt-1">
                      {[0, 1, 2].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setModifiers({ ...modifiers, subdivision: lvl })}
                          className={`flex-1 py-1 text-[11px] font-mono rounded ${
                            modifiers.subdivision === lvl
                              ? 'bg-[#f57921] text-white font-bold'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Array Modifier */}
                  <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-slate-200">Array (Repetición)</span>
                      <span className="font-mono text-cyan-400">x{modifiers.array}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="1"
                      value={modifiers.array}
                      onChange={(e) => setModifiers({ ...modifiers, array: parseInt(e.target.value) })}
                      className="w-full accent-cyan-400"
                    />
                  </div>

                  {/* Mirror Modifier */}
                  <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50 flex flex-col justify-between">
                    <span className="font-medium text-slate-200">Mirror (Simetría X)</span>
                    <button
                      onClick={() => setModifiers({ ...modifiers, mirror: !modifiers.mirror })}
                      className={`w-full py-1 text-xs rounded transition-colors font-medium mt-1 ${
                        modifiers.mirror ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {modifiers.mirror ? 'Activado (Eje X)' : 'Desactivado'}
                    </button>
                  </div>

                  {/* Displace / Noise */}
                  <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-slate-200">Displace (Ondas)</span>
                      <span className="font-mono text-amber-400">{modifiers.displace.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={modifiers.displace}
                      onChange={(e) => setModifiers({ ...modifiers, displace: parseFloat(e.target.value) })}
                      className="w-full accent-amber-400"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
