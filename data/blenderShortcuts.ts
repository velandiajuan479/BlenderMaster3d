import { ShortcutItem } from '@/types/blender';

export const BLENDER_SHORTCUTS: ShortcutItem[] = [
  // Modelado / Edit Mode
  {
    id: 'sc-extrude',
    keys: ['E'],
    name: 'Extruir (Extrude)',
    category: 'Modelado',
    mode: 'Edit Mode',
    description: 'Extiende caras, aristas o vértices seleccionados creando nueva geometría a lo largo de las normales.',
    tip: 'Presiona E y luego X, Y o Z para bloquear la extrusión en un eje específico.'
  },
  {
    id: 'sc-inset',
    keys: ['I'],
    name: 'Insertar caras (Inset)',
    category: 'Modelado',
    mode: 'Edit Mode',
    description: 'Crea un borde de caras concéntricas hacia el interior de la cara seleccionada.',
    tip: 'Presiona I dos veces seguidas para hacer Inset individual a cada cara seleccionada por separado.'
  },
  {
    id: 'sc-bevel',
    keys: ['Ctrl', 'B'],
    name: 'Biselar (Bevel)',
    category: 'Modelado',
    mode: 'Edit Mode',
    description: 'Redondea o achaflana las aristas seleccionadas. Mueve el ratón y gira la rueda para añadir segmentos.',
    tip: '¡Recuerda siempre aplicar la escala (Ctrl + A) antes en Object Mode para que el bisel sea uniforme!'
  },
  {
    id: 'sc-loopcut',
    keys: ['Ctrl', 'R'],
    name: 'Corte de bucle (Loop Cut)',
    category: 'Modelado',
    mode: 'Edit Mode',
    description: 'Corta un anillo continuo de aristas alrededor de la malla. Gira la rueda del ratón para crear más cortes.',
    tip: 'Haz clic izquierdo para fijar el número de cortes, y clic derecho para centrarlos perfectamente.'
  },
  {
    id: 'sc-proportional',
    keys: ['O'],
    name: 'Edición Proporcional',
    category: 'Modelado',
    mode: 'Edit Mode',
    description: 'Mueve vértices cercanos de forma suave elástica. Gira la rueda del ratón para ajustar el radio de influencia.',
    tip: 'Ideal para formas orgánicas, ropa, rostros y la clásica curvatura de la dona.'
  },
  {
    id: 'sc-merge',
    keys: ['M'],
    name: 'Fusionar vértices (Merge)',
    category: 'Modelado',
    mode: 'Edit Mode',
    description: 'Une varios vértices seleccionados en el centro, al cursor 3D, o por proximidad (By Distance).',
    tip: 'M > By Distance es el truco maestro para eliminar vértices duplicados o basura tras un boolean.'
  },
  {
    id: 'sc-separate',
    keys: ['P'],
    name: 'Separar selección',
    category: 'Modelado',
    mode: 'Edit Mode',
    description: 'Separa la geometría seleccionada en un objeto completamente nuevo en el Outliner.',
    tip: 'Úsalo para separar el glaseado de la dona o piezas de armadura.'
  },
  {
    id: 'sc-join',
    keys: ['Ctrl', 'J'],
    name: 'Unir objetos (Join)',
    category: 'Modelado',
    mode: 'Object Mode',
    description: 'Combina múltiples objetos seleccionados en una sola malla. El objeto activo (amarillo) define el origen.',
    tip: 'El último objeto que selecciones con Shift será el que conserve el nombre y origen.'
  },
  {
    id: 'sc-apply-transforms',
    keys: ['Ctrl', 'A'],
    name: 'Aplicar transformaciones',
    category: 'Modelado',
    mode: 'Object Mode',
    description: 'Restablece la escala y rotación a valores base (1.0 y 0°) sin cambiar la forma visual del objeto.',
    tip: 'Si un modificador o textura se deforma sin sentido, aplicar escala con Ctrl + A resuelve el 95% de los casos.'
  },

  // Navegación
  {
    id: 'sc-nav-front',
    keys: ['Numpad 1'],
    name: 'Vista Frontal (Front View)',
    category: 'Navegación',
    mode: 'General',
    description: 'Alinea la cámara ortográfica directamente de frente (eje Y). Presiona Ctrl + Numpad 1 para la vista trasera.',
    tip: 'Si no tienes teclado numérico, activa "Emulate Numpad" en Preferences > Input.'
  },
  {
    id: 'sc-nav-side',
    keys: ['Numpad 3'],
    name: 'Vista Lateral Derecha (Right View)',
    category: 'Navegación',
    mode: 'General',
    description: 'Alinea la vista ortográfica desde el lateral (eje X). Presiona Ctrl + Numpad 3 para el lado izquierdo.',
    tip: 'Esencial para verificar siluetas y alinear planos de referencia.'
  },
  {
    id: 'sc-nav-top',
    keys: ['Numpad 7'],
    name: 'Vista Superior (Top View)',
    category: 'Navegación',
    mode: 'General',
    description: 'Alinea la vista ortográfica desde arriba (eje Z). Presiona Ctrl + Numpad 7 para la vista inferior.',
    tip: 'Perfecta para alinear props, mapas de nivel y organizar la escena.'
  },
  {
    id: 'sc-nav-camera',
    keys: ['Numpad 0'],
    name: 'Vista de Cámara',
    category: 'Navegación',
    mode: 'General',
    description: 'Entra o sale de la vista de la cámara activa que renderizará la imagen final.',
    tip: 'Presiona Ctrl + Alt + Numpad 0 para colocar la cámara exactamente donde estés mirando en el viewport.'
  },
  {
    id: 'sc-nav-focus',
    keys: ['Numpad .'],
    name: 'Enfocar seleccionado (Frame Selected)',
    category: 'Navegación',
    mode: 'General',
    description: 'Centra y hace zoom instantáneo sobre el objeto, cara o vértice seleccionado.',
    tip: '¡El mejor atajo cuando te pierdes en el espacio infinito 3D!'
  },

  // Selección
  {
    id: 'sc-sel-toggle',
    keys: ['Tab'],
    name: 'Alternar Modo Edición / Objeto',
    category: 'Selección',
    mode: 'General',
    description: 'Cambia rápidamente entre manipular el objeto completo y editar su geometría interna de vértices y caras.',
    tip: 'En Edit Mode, 1 = Vértices, 2 = Aristas, 3 = Caras.'
  },
  {
    id: 'sc-sel-all',
    keys: ['A'],
    name: 'Seleccionar todo (Select All)',
    category: 'Selección',
    mode: 'General',
    description: 'Selecciona todos los objetos o vértices disponibles. Pulsa Alt + A o doble A rápido para deseleccionar todo.',
    tip: 'Combínalo con M > By Distance para limpiar toda la malla.'
  },
  {
    id: 'sc-sel-box',
    keys: ['B'],
    name: 'Selección por Caja (Box Select)',
    category: 'Selección',
    mode: 'General',
    description: 'Permite arrastrar un recuadro con el ratón para seleccionar múltiples elementos simultáneamente.',
    tip: 'Arrastra con el botón central del ratón para deseleccionar en caja.'
  },
  {
    id: 'sc-sel-loop',
    keys: ['Alt', 'Click'],
    name: 'Seleccionar anillo / bucle (Loop Select)',
    category: 'Selección',
    mode: 'Edit Mode',
    description: 'Selecciona una línea continua completa de aristas o caras conectadas con un solo clic.',
    tip: 'Añade Shift + Alt + Click para seleccionar múltiples bucles continuos.'
  },
  {
    id: 'sc-sel-xray',
    keys: ['Alt', 'Z'],
    name: 'Modo Rayos X (X-Ray)',
    category: 'Selección',
    mode: 'General',
    description: 'Hace la malla translúcida permitiendo seleccionar caras y vértices situados detrás sin rotar la vista.',
    tip: 'Vital para seleccionar ambos lados de un personaje o modelo con simetría.'
  },

  // Shading & Render
  {
    id: 'sc-shade-pie',
    keys: ['Z'],
    name: 'Menú Pie de Modos de Vista',
    category: 'Shading',
    mode: 'General',
    description: 'Despliega el menú radial para alternar instantáneamente entre Wireframe, Solid, Material Preview y Rendered.',
    tip: 'Z > 8 = Rendered, Z > 4 = Wireframe, Z > 6 = Solid, Z > 2 = Material.'
  },
  {
    id: 'sc-render-f12',
    keys: ['F12'],
    name: 'Renderizar imagen actual',
    category: 'Render',
    mode: 'General',
    description: 'Procesa y renderiza el fotograma actual con el motor configurado (EEVEE o Cycles).',
    tip: 'Presiona Ctrl + F12 para renderizar una animación completa.'
  },
  {
    id: 'sc-normals-calc',
    keys: ['Shift', 'N'],
    name: 'Recalcular normales hacia afuera',
    category: 'Modelado',
    mode: 'Edit Mode',
    description: 'Orienta todas las caras para que apunten correctamente hacia el exterior del volumen 3D.',
    tip: 'Arregla caras oscuras o manchas extrañas en el sombreado producidas por caras invertidas.'
  }
];

export interface ShortcutChallenge {
  id: string;
  task: string;
  expectedKeys: string[];
  hint: string;
  category: string;
}

export const SHORTCUT_CHALLENGES: ShortcutChallenge[] = [
  {
    id: 'c-1',
    task: '¿Qué atajo usas para extruir nueva geometría a partir de una cara seleccionada?',
    expectedKeys: ['E'],
    hint: 'La letra E de "Extrude".',
    category: 'Modelado'
  },
  {
    id: 'c-2',
    task: '¿Cómo aplicas la escala y rotación de un objeto para que los modificadores no se deformen?',
    expectedKeys: ['Ctrl', 'A'],
    hint: 'Control más la tecla A de "Apply".',
    category: 'Modelado'
  },
  {
    id: 'c-3',
    task: '¿Con qué atajo insertas un corte de bucle (Loop Cut) en la malla?',
    expectedKeys: ['Ctrl', 'R'],
    hint: 'Control más la tecla R de "Ring cut".',
    category: 'Modelado'
  },
  {
    id: 'c-4',
    task: '¿Qué tecla única alterna entre Modo Objeto (Object Mode) y Modo Edición (Edit Mode)?',
    expectedKeys: ['Tab'],
    hint: 'La tecla Tabulador a la izquierda de la Q.',
    category: 'Navegación'
  },
  {
    id: 'c-5',
    task: '¿Qué atajo activa o desactiva la Edición Proporcional (curvatura suave)?',
    expectedKeys: ['O'],
    hint: 'La letra O (parecida al círculo concéntrico del icono).',
    category: 'Modelado'
  },
  {
    id: 'c-6',
    task: '¿Cómo biselas aristas para redondear bordes filosos?',
    expectedKeys: ['Ctrl', 'B'],
    hint: 'Control más la letra B de "Bevel".',
    category: 'Modelado'
  },
  {
    id: 'c-7',
    task: '¿Cómo recalculas las normales de la malla para arreglar sombras negras en caras invertidas?',
    expectedKeys: ['Shift', 'N'],
    hint: 'Mayús (Shift) + N de "Normals".',
    category: 'Modelado'
  },
  {
    id: 'c-8',
    task: '¿Qué atajo abre el menú radial (Pie Menu) para cambiar entre Wireframe, Solid y Render?',
    expectedKeys: ['Z'],
    hint: 'La letra Z.',
    category: 'Shading'
  }
];
