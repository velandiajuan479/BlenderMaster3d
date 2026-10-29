# BlenderMaster 3D: Plataforma Interactiva de Aprendizaje de Blender

Plataforma educativa web completa, moderna e interactiva en español para dominar Blender desde cero hasta nivel avanzado, combinando un visor 3D WebGL en tiempo real con simulador de modificadores y materiales, un entrenador dinámico de atajos de teclado, un laboratorio visual de nodos (Geometry Nodes & Shaders), tutoriales por proyectos prácticos (como la mítica Dona y modelado Low-Poly), y un asistente de IA integrado impulsado por Gemini 3.8 Flash para resolver dudas y diagnosticar errores de modelado y renderizado.

## User Review & Critical Decisions

> [!IMPORTANT]
> A partir de tus respuestas en la fase de clarificación, hemos establecido los siguientes pilares de diseño y funcionalidad:
> - **Suite interactiva 3D integrada**: Se incluirá un visor 3D WebGL con viewport interactivo (modos Solid, Wireframe, Material Preview y Render simulado), entrenador de atajos de teclado de Blender (G/R/S, Extrude, Inset, Numpad) y un laboratorio visual de nodos.
> - **Estructura por proyectos prácticos**: En lugar de teoría abstracta aislada, el aprendizaje se articulará alrededor de proyectos icónicos paso a paso (El proyecto de la Dona de Blender, Espada Fantasía Low-Poly, e Isla Diorama Procedural) con slider temporal de etapas de construcción 3D.
> - **Asistente IA Técnico con Gemini 3.8 Flash**: Un copiloto especializado en Blender capaz de responder atajos según la versión, diagnosticar problemas típicos (escalas no aplicadas con `Ctrl+A`, normales invertidas con `Shift+N`, objetos negros por falta de luz o shaders desconectados) y generar scripts de `bpy` para automatización.

---

## 1. Overview & Core Concept

- **Qué hace la aplicación**: Brinda una experiencia de aprendizaje inmersiva que recrea la lógica, terminología y herramientas clave de Blender directamente en el navegador. Permite a los usuarios inspeccionar modelos en tiempo real, experimentar con modificadores (Subdivisión, Bevel, Mirror, Array, Displace), practicar la memoria muscular de atajos de teclado sin instalar nada, conectar nodos de sombreado y consultar a un mentor de IA 24/7.
- **Audiencia objetivo**: Estudiantes, artistas 3D principiantes, diseñadores gráficos que buscan dar el salto al 3D, y modeladores intermedios que desean dominar Geometry Nodes y Principled BSDF.
- **Valor diferencial**: En vez de videos pasivos de YouTube donde el usuario se pierde si cambia un botón de versión, la plataforma ofrece interactividad bidireccional inmediata: manipular el objeto 3D mientras se leen los pasos, probar atajos en un simulador activo y recibir retroalimentación instantánea ante errores comunes.

---

## 2. User Experience & Visual Design

### Dirección Estética & Paleta de Color (60-30-10)
Inspirada en la identidad profesional de Blender y las suites creativas de modelado de alto rendimiento:
- **60% Lienzo Neutro Oscuro**: `#0B0F17` (obsidiana profunda) y `#111827` que simula la interfaz oscura nativa de Blender (`Blender Dark Theme`), garantizando máximo contraste y reduciendo la fatiga visual al trabajar con mallas 3D.
- **30% Superficies Estructurales**: Paneles `#1E293B`, bordes finos de 1px en `#334155`, cabeceras estructuradas y áreas de trabajo claramente delimitadas sin tarjetas anidadas redundantes.
- **10% Acento Focal Blender**: Naranja icónico de Blender (`#F57921` / `#EA580C`) para acciones primarias, selecciones de vértices/mallas y nodos activos; acento secundario cian técnico (`#06B6D4`) para modos de geometría y wireframe.

### Tipografía & Jerarquía
- **Display & Títulos**: `Plus Jakarta Sans` (SemiBold / Bold) con espaciado óptico calibrado (`tracking-tight`) y títulos sin palabras huérfanas (`text-wrap: balance`).
- **Cuerpo de texto**: `DM Sans` (15px-16px, line-height 1.6) para explicaciones y pasos didácticos claros.
- **Atajos, Parámetros & Código**: `JetBrains Mono` / monospace tabular para teclas (`[G]`, `[Shift + A]`, `[Ctrl + B]`), coordenadas X/Y/Z y scripts en Python (`bpy`).

### Estructura de Navegación & Zonas Clave
1. **Top Bar Contract (3 zonas strictly)**:
   - *Zona 1*: Wordmark de marca con logotipo geométrico estilizado (`BlenderMaster 3D`).
   - *Zona 2*: Navegación limpia de 4 secciones (`Proyectos Guiados`, `Visor & Modificadores`, `Laboratorio de Nodos`, `Entrenador de Atajos`).
   - *Zona 3*: Botón de acción rápido (`Consultar Mentor IA`).
2. **Área Principal con Vistas Flexibles**:
   - **Módulo de Proyectos Paso a Paso**:
     - *Proyecto 1: La Mítica Dona de Blender (Nivel Principiante)*: Modelado con Toroide, esculpido orgánico con Proportional Editing (`O`), extrusión del glaseado, partículas de chispas de colores, nodo Principled BSDF y render final.
     - *Proyecto 2: Espada Fantasía Low-Poly (Nivel Principiante-Intermedio)*: Modelado a partir de un cubo, modificador Mirror en eje X, inserción de biseles, paleta de colores planos e iluminación cinemática.
     - *Proyecto 3: Isla Flotante con Árboles y Agua (Nivel Intermedio)*: Creación de terreno con displace procedural, dispersión de vegetación con Geometry Nodes y material translúcido de agua.
     - Cada paso cuenta con: Instrucción visual clara, lista de atajos utilizados, checklist de comprobación, y visor 3D interactivo con slider de estado temporal (`Paso 1: Bloqueo` → `Paso 2: Detalles` → `Paso 3: Modificadores` → `Paso 4: Shading`).
   - **Visor 3D y Simulador de Modificadores (Three.js)**:
     - Renderizador Three.js con iluminación de estudio PBR (`RoomEnvironment`), sombras suaves de contacto, y gizmo de navegación.
     - Modos de visualización: `Wireframe` (malla poligonal), `Solid` (sombrado gris de estudio con MatCap), `Material Preview` (sombrado con texturas procedurales) y `Render (Cycles)` (sombras e iluminación cálida/fría avanzada).
     - Panel de Modificadores en vivo: activa y modifica parámetros en tiempo real de `Subdivision Surface` (niveles de suavizado), `Bevel` (anchura y segmentos), `Mirror` (simetría X/Y/Z), `Array` (repetición con desplazamiento) y `Wireframe`.
   - **Entrenador de Atajos de Teclado**:
     - Teclado visual interactivo y desafíos de memoria muscular.
     - Modo entrenamiento: la app pide una acción (ej: *"Cambiar a modo edición"*, *"Extruir en Z"*, *"Separar selección"*, *"Añadir corte de bucle"*) y el usuario presiona las teclas reales en su teclado o en la interfaz para ganar maestría.
     - Filtros por categoría: Modelado, Selección, Navegación de Cámara, Shading, Esculpido.
   - **Laboratorio Visual de Nodos (Geometry Nodes & Shader Editor)**:
     - Lienzo interactivo que simula el editor de nodos de Blender con cables bezier conectables, puertos de entrada/salida (Color amarillo, Vector azul, Float gris).
     - Permite experimentar cómo conectar `Noise Texture` -> `ColorRamp` -> `Roughness` o `Base Color` y ver el resultado inmediato en el visor 3D.
   - **Asistente IA de Blender (Gemini 3.8 Flash)**:
     - Drawer interactivo optimizado para consultas rápidas y diagnóstico de problemas ("Troubleshooter").
     - Botones de preguntas frecuentes rápidas: *"¿Por qué mi objeto se ve completamente negro al renderizar?"*, *"¿Cómo arreglo el error de escala no uniforme en el biselado?"*, *"¿Cómo unir dos vértices en uno solo?"*.
     - Generador de scripts Python `bpy` con explicaciones y botón de copiar.

---

## 3. Key Product Decisions & Trade-Offs

- **Decisión 1: Renderizado 3D Procedural en Three.js en lugar de modelos pesados GLTF externos**:
  - *Enfoque*: Generar geometrías procedimentales paramétricas (toroide de la dona con glaseado paramétrico, espada low-poly ensamblada en grupos, monos Suzanne y cubos subdivididos) directamente con Three.js sin depender de archivos `.glb` remotos que puedan fallar por CORS o 404.
  - *Razón*: Garantía 100% de disponibilidad, carga instantánea, cero tiempos de espera en red y capacidad de manipular dinámicamente vértices, modificadores y shaders en el cliente.
- **Decisión 2: API de Gemini en servidor Next.js (`/api/blender-ai`) con Gemini 3.8 Flash**:
  - *Enfoque*: Endpoint seguro server-side utilizando el SDK oficial `@google/genai` con `gemini-3.8-flash` y `systemInstruction` experta en Blender 4.x/5.x.
  - *Razón*: Respuestas de alta velocidad (<1s), conocimiento actualizado de la interfaz moderna de Blender, sin exponer claves en el navegador y con soporte de streaming o respuestas estructuradas en Markdown/JSON.
- **Decisión 3: Simulador de Modificadores Reactivo**:
  - *Enfoque*: Implementar la lógica matemática de modificadores reales (subdivisión geométrica mediante recalculado de buffers, beveling visual, duplicación matricial de arrays y wireframe helpers).
  - *Razón*: Permite al usuario comprender de manera intuitiva el impacto visual y topológico de cada modificador antes de abrir Blender.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             BLENDERMASTER 3D                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  TOP BAR: Marca "BlenderMaster 3D" | Nav Links | Botón Copiloto IA          │
├──────────────────────────────────────┬──────────────────────────────────────┤
│  ZONA IZQUIERDA: CONTENIDO EDUCATIVO │  ZONA DERECHA: SUITE 3D INTERACTIVA  │
│  - Selector de Proyectos Guiados     │  - Viewport WebGL (Three.js PBR)     │
│    * Proyecto 1: La Dona de Blender  │    * Modos: Wireframe, Solid, MatCap,│
│    * Proyecto 2: Espada Low-Poly     │      Render Cycles                   │
│    * Proyecto 3: Isla Diorama        │    * Gizmo de rotación / Orbit       │
│  - Desglose de Pasos & Instrucciones │  - Simulador de Modificadores en Vivo│
│  - Atajos clave con badges de teclas │    * Subsurf, Bevel, Array, Mirror   │
│  - Slider de Progreso de Modelado    │  - Editor de Nodos Visual            │
│  - Tips de Prevención de Errores     │  - HUD inferior colapsable           │
├──────────────────────────────────────┴──────────────────────────────────────┤
│  DRAWER FLOTANTE: ASISTENTE IA DE BLENDER (Gemini 3.8 Flash via /api/ai)    │
│  - Diagnóstico de errores de render y normales                              │
│  - Consulta de atajos y flujo de trabajo                                     │
│  - Generador de scripts Python (bpy)                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Flujo de Datos y Estado Global de la Aplicación
- `activeTab`: `'projects' | 'viewport' | 'nodes' | 'shortcuts'`
- `selectedProject`: ID del proyecto actual (`'donut' | 'sword' | 'island'`)
- `projectStepIndex`: Paso activo dentro del tutorial (sincroniza la visualización 3D correspondiente)
- `viewportSettings`:
  - `renderMode`: `'wireframe' | 'solid' | 'material' | 'cycles'`
  - `modifiers`: `{ subdivision: number, bevel: boolean, bevelAmount: number, array: number, wireframe: boolean }`
  - `materialProperties`: `{ color: string, roughness: number, metalness: number, transmission: number, emission: string }`
- `activeShortcutCategory`: Categoría de atajos de teclado para práctica y filtrado
- `aiChatMessages`: Historial de conversación interactiva con el asistente técnico de Blender

---

## Plan de Ejecución tras Aprobación

1. **Paso 1: Infraestructura y Servidor Gemini**:
   - Crear endpoint `/api/blender-ai/route.ts` con `@google/genai` y modelo `gemini-3.8-flash` con instrucciones de mentor de Blender.
   - Actualizar `metadata.json` con nombre descriptivo y capabilities.
2. **Paso 2: Componente Central del Visor 3D (Three.js)**:
   - Implementar `BlenderViewport.tsx` con Three.js: escena con iluminación de tres puntos, `RoomEnvironment`, `OrbitControls`, cambio de modos (Wireframe, Solid, Material, Cycles), modificadores en tiempo real y soporte para software WebGL.
3. **Paso 3: Proyectos Guiados Paso a Paso**:
   - Implementar `ProjectTutorial.tsx` con la guía completa de la Dona de Blender, Espada Low-Poly e Isla Flotante, sincronizados con las etapas del modelo 3D.
4. **Paso 4: Entrenador de Atajos y Laboratorio de Nodos**:
   - Desarrollar `ShortcutTrainer.tsx` con simulador de teclado interactivo y desafíos.
   - Desarrollar `NodeLab.tsx` con cables interactivos y preview de materiales procedimentales.
5. **Paso 5: Asistente IA de Blender**:
   - Desarrollar `BlenderAIChat.tsx` con preguntas rápidas de diagnóstico y generador de scripts.
6. **Paso 6: Ensamblado y Verificación**:
   - Integrar todo en `app/page.tsx`, refinar diseño visual Tailwind y compilar con `compile_applet`.
