import { BlenderProject } from '@/types/blender';

export const BLENDER_PROJECTS: BlenderProject[] = [
  {
    id: 'donut',
    title: 'La Legendaria Dona de Blender',
    subtitle: 'El rito de iniciación de todo artista 3D en el mundo',
    difficulty: 'Principiante',
    estimatedHours: '2.5 h',
    badge: 'Proyecto Icónico',
    coverDescription: 'Aprende desde el toroide primitivo, modelado orgánico con edición proporcional, modificadores Subsurf y Solidify para el glaseado, chispas de colores y materiales Principled BSDF.',
    topics: ['Primitivas 3D', 'Proportional Editing (O)', 'Modificador Subdivision', 'Modificador Solidify', 'Principled BSDF', 'Chispas procedurales'],
    steps: [
      {
        id: 'donut-1',
        stepNumber: 1,
        title: 'Creación y dimensionamiento del Toroide',
        category: 'Geometría Base',
        durationMinutes: 15,
        summary: 'Comenzamos eliminando el cubo por defecto y añadiendo la malla base con proporciones realistas.',
        instructions: [
          'En el viewport, presiona X o Supr para eliminar el cubo inicial que Blender crea por defecto.',
          'Presiona Shift + A > Mesh > Torus para crear el cuerpo de la dona.',
          '¡MUY IMPORTANTE!: Antes de tocar nada en la escena, despliega el panel inferior izquierdo "Add Torus" (F9).',
          'Ajusta "Major Radius" a 0.10 m (10 cm de diámetro total) y "Minor Radius" a 0.04 m para darle grosor apetecible.',
          'Reduce "Major Segments" a 28 y "Minor Segments" a 14 para mantener una topología limpia y manejable para principiantes.'
        ],
        keyShortcuts: [
          { key: 'Shift + A', description: 'Añadir nueva malla o elemento a la escena' },
          { key: 'F9', description: 'Reabrir panel de última operación para ajustar medidas' },
          { key: 'X / Supr', description: 'Eliminar objeto seleccionado' },
          { key: 'Tab', description: 'Alternar entre Modo Objeto y Modo Edición' }
        ],
        commonPitfalls: 'Si haces clic en el viewport antes de cambiar las medidas en el menú flotante, el panel F9 desaparecerá. Si te ocurre, borra el toroide y vuelve a crearlo.',
        blenderWorkspace: 'Layout / Modeling',
        modelStage: 0 // Torus base
      },
      {
        id: 'donut-2',
        stepNumber: 2,
        title: 'Asimetría orgánica con Proportional Editing',
        category: 'Modelado Orgánico',
        durationMinutes: 25,
        summary: 'Las donas horneadas reales no son perfectas geométricamente. Aplicamos variaciones naturales.',
        instructions: [
          'Entra en Edit Mode presionando Tab. Asegúrate de estar en modo selección de vértices (tecla 1 en el teclado alfanumérico).',
          'Activa la Edición Proporcional presionando la tecla O (o haciendo clic en el círculo concéntrico superior central).',
          'Selecciona un vértice en la parte superior o lateral, presiona G para mover y gira la rueda del ratón (Scroll Wheel) para regular el radio de influencia (el círculo blanco punteado).',
          'Mueve ligeramente zonas para aplanar la base (donde reposó la bandeja de horneado) y dar curvaturas naturales.',
          'Sal a Object Mode (Tab) y haz clic derecho > "Shade Auto Smooth" para eliminar el aspecto facetado.'
        ],
        keyShortcuts: [
          { key: 'O', description: 'Activar / desactivar Proportional Editing' },
          { key: 'G + Rueda Ratón', description: 'Mover vértice ajustando el área de influencia elástica' },
          { key: 'Click Derecho > Shade Smooth', description: 'Suavizar normales de la superficie' }
        ],
        commonPitfalls: 'Tener el radio de influencia de la rueda del ratón demasiado grande moverá toda la dona a la vez en lugar de solo deformar una sección. Gira la rueda hacia arriba para reducirlo.',
        blenderWorkspace: 'Modeling',
        modelStage: 1 // Torus deformado suavemente
      },
      {
        id: 'donut-3',
        stepNumber: 3,
        title: 'Modelado del Glaseado con Duplicación y Extrusión',
        category: 'Modificadores',
        durationMinutes: 35,
        summary: 'Separamos la mitad superior de la dona para crear la capa dulce que gotea por los costados.',
        instructions: [
          'En Edit Mode (Tab), pulsa Alt + Z para activar el modo rayos X (X-Ray) y poder seleccionar caras traseras.',
          'Usa el cuadro de selección de caja (B) para seleccionar la mitad superior de los vértices del toroide.',
          'Presiona Shift + D para duplicar la malla y presiona Esc para no moverla de posición.',
          'Presiona P > "Selection" para separar esa porción en un objeto independiente llamado "Glaseado".',
          'Vuelve a Object Mode, selecciona el glaseado y añade un Modificador "Solidify" con grosor 0.004 m (Thickness) y Offset +1.',
          'Añade un Modificador "Subdivision Surface" (Ctrl + 2) debajo del Solidify para redondear las gotas.',
          'Vuelve al modo edición del glaseado y tira de los bordes inferiores con E (extruir) y G para crear gotas derretidas.'
        ],
        keyShortcuts: [
          { key: 'Alt + Z', description: 'Alternar modo Rayos X (X-Ray) para ver a través del modelo' },
          { key: 'Shift + D', description: 'Duplicar elementos seleccionados' },
          { key: 'P > Selection', description: 'Separar malla seleccionada en un nuevo objeto' },
          { key: 'Ctrl + 2', description: 'Añadir modificador Subdivision Surface con nivel 2 instantáneamente' }
        ],
        commonPitfalls: '¡El orden de los modificadores importa muchísimo! El Solidify debe estar ANTES del Subdivision Surface en la pila (Modifier Stack) para que los bordes del grosor no se afilen de forma extraña.',
        blenderWorkspace: 'Modeling',
        modelStage: 2 // Glaseado encima con grosor y gotas
      },
      {
        id: 'donut-4',
        stepNumber: 4,
        title: 'Chispas de Colores (Sprinkles) y Shading Principled BSDF',
        category: 'Materiales & Render',
        durationMinutes: 40,
        summary: 'Configuramos el color apetitoso del pan, la dulzura reflectante del glaseado y las chispitas festivas.',
        instructions: [
          'Cambia a la pestaña de trabajo "Shading". Selecciona la base de la dona y crea un nuevo material "Masa Dona".',
          'En el nodo Principled BSDF: Base Color a tono marrón dorado (#E8974D), Roughness a 0.65 y Subsurface a 0.05 para simular la translucidez del pan horneado.',
          'Selecciona el glaseado y crea el material "Glaseado Fresa": Base Color rosa vibrante (#E53985), Roughness bajo (0.25) para que brille y refleje la luz como azúcar fundido.',
          'Crea un cilindro diminuto (Shift + A > Cylinder), añade Bevel a sus tapas, y repártelo sobre el glaseado mediante partículas o Geometry Nodes.',
          'Configura la cámara (Ctrl + Alt + Numpad 0) y añade una luz puntual (Point Light) cálida de 35W con un relleno frío (Area Light) de 15W.'
        ],
        keyShortcuts: [
          { key: 'Ctrl + Alt + Numpad 0', description: 'Alinear la cámara a la vista actual del viewport' },
          { key: 'Z > 8', description: 'Cambiar a modo de vista Rendered' },
          { key: 'F12', description: 'Renderizar la imagen final' }
        ],
        commonPitfalls: 'Si la dona se ve como plástico rígido en lugar de comida, el Roughness está en 0 o no has activado un poco de Subsurface Scattering (SSS) para darle vida orgánica.',
        blenderWorkspace: 'Shading & Render',
        modelStage: 3 // Dona completa con glaseado y chispas
      }
    ]
  },
  {
    id: 'sword',
    title: 'Espada Fantasía Low-Poly con Runa',
    subtitle: 'Domina el flujo de trabajo de assets para videojuegos',
    difficulty: 'Principiante',
    estimatedHours: '2 h',
    badge: 'Game Ready',
    coverDescription: 'Aprende modelado poligonal preciso, el infalible modificador Mirror con clipping, extrusiones de empuñadura, inset en la hoja para el canal central y material emissive de fantasía.',
    topics: ['Modificador Mirror con Clipping', 'Extrusiones (E)', 'Inserción de caras (I)', 'Loop Cuts (Ctrl + R)', 'Material Emisivo', 'Optimización Low-Poly'],
    steps: [
      {
        id: 'sword-1',
        stepNumber: 1,
        title: 'Bloqueo del filo y simetría con Mirror',
        category: 'Bloqueo Base',
        durationMinutes: 20,
        summary: 'Construimos la hoja usando un cubo primitivo dividido con simetría en el eje X.',
        instructions: [
          'Parte de un cubo básico. Presiona S > X > 0.15 para aplanar la hoja en el grosor lateral.',
          'Entra en Edit Mode (Tab). Añade un corte central con Ctrl + R y pulsa Intro.',
          'Selecciona los vértices del lado izquierdo (X negativo) y bórralos con X > Vertices.',
          'Añade un modificador Mirror en el eje X y ACTIVA la casilla "Clipping" para que los vértices del centro se suelden automáticamente.',
          'Selecciona la cara superior y extruye con E hacia arriba (Z) unas 4 veces para definir el largo de la hoja.',
          'En la última sección, une los vértices superiores en una punta afilada con M > At Center.'
        ],
        keyShortcuts: [
          { key: 'Ctrl + R', description: 'Insertar corte de bucle (Loop Cut)' },
          { key: 'S > X', description: 'Escalar únicamente en el eje horizontal X' },
          { key: 'E + Z', description: 'Extruir en línea recta vertical hacia arriba' },
          { key: 'M > At Center', description: 'Fusionar (Merge) vértices seleccionados en el centro' }
        ],
        commonPitfalls: 'Si no activas "Clipping" en el modificador Mirror, al mover los vértices del centro la espada se abrirá por la mitad dejando un hueco.',
        blenderWorkspace: 'Modeling',
        modelStage: 0 // Hoja recta básica
      },
      {
        id: 'sword-2',
        stepNumber: 2,
        title: 'Guarda protectora y empuñadura ergonómica',
        category: 'Extrusión y Modelado',
        durationMinutes: 30,
        summary: 'Diseñamos la cruceta de protección y el mango con empuñadura octogonal.',
        instructions: [
          'En la base de la hoja, selecciona la cara inferior y presiona E para extruir una pequeña sección que será la cruceta.',
          'Selecciona la cara lateral exterior de la guarda y extruye con E en X hacia afuera.',
          'Rótala ligeramente con R para darle una curvatura de fantasía hacia la hoja.',
          'Selecciona la cara central inferior y extruye hacia abajo para crear la empuñadura cilíndrica u octogonal.',
          'Añade varios cortes con Ctrl + R en el mango y usa Alt + S (Shrink/Fatten) para crear el relieve del agarre de cuero.',
          'En el extremo inferior, extruye y escala para esculpir el pomo (pommel) de contrapeso.'
        ],
        keyShortcuts: [
          { key: 'Alt + S', description: 'Engordar / encoger vértices a lo largo de sus normales (Shrink/Fatten)' },
          { key: 'I', description: 'Hacer Inset (crear una cara interna concéntrica)' },
          { key: 'Shift + Click', description: 'Seleccionar múltiples elementos continuos' }
        ],
        commonPitfalls: 'Evita crear polígonos de más de 4 lados (N-gons) en las uniones de la guarda para que la exportación a Unity o Unreal Engine sea limpia.',
        blenderWorkspace: 'Modeling',
        modelStage: 1 // Espada con guarda y empuñadura
      },
      {
        id: 'sword-3',
        stepNumber: 3,
        title: 'Biselado de aristas y canal de sangre (Fuller)',
        category: 'Detallado Hard Surface',
        durationMinutes: 25,
        summary: 'Afilamos los bordes de la espada mediante biseles bisecados y el canal central característico.',
        instructions: [
          'Sal a Object Mode y aplica la escala con Ctrl + A > "Apply Scale". (¡Paso crítico antes de cualquier bisel!).',
          'Regresa a Edit Mode. Selecciona la arista central frontal de la hoja.',
          'Presiona Ctrl + B para biselar la arista (Bevel) creando una banda plana.',
          'Selecciona las caras de esa banda y pulsa Alt + E > "Extrude Faces Along Normals" empujando ligeramente hacia dentro para hundir el canal central.',
          'Añade un modificador Bevel general con valor de 0.005 m y 1 segmento con limitación por "Angle" (30°) para mantener los bordes duros de estilo low-poly.'
        ],
        keyShortcuts: [
          { key: 'Ctrl + A > All Transforms', description: 'Aplicar escala y rotación para evitar deformaciones' },
          { key: 'Ctrl + B', description: 'Biselar (Bevel) aristas o vértices seleccionados' },
          { key: 'Alt + E', description: 'Menú especial de extrusiones (a lo largo de normales, caras individuales)' }
        ],
        commonPitfalls: 'Si el bisel se hace más ancho en un eje que en otro, significa que no aplicaste la escala (Ctrl + A) en Object Mode antes de usar el comando.',
        blenderWorkspace: 'Modeling',
        modelStage: 2 // Espada con canal central y biseles
      },
      {
        id: 'sword-4',
        stepNumber: 4,
        title: 'Paleta de Materiales Low-Poly y Runa Mágica',
        category: 'Materiales & Emisión',
        durationMinutes: 25,
        summary: 'Aplicamos acero reflectante, cuero cálido y una runa con emisión de energía azul mística.',
        instructions: [
          'En la pestaña Shading, crea el material "Acero Hoja": Base Color gris plata claro (#CFD8DC), Metallic en 0.95 y Roughness en 0.2.',
          'Crea un segundo material "Cuero Agarre": Base Color marrón oscuro (#5D4037), Metallic en 0 y Roughness en 0.85.',
          'En Edit Mode, selecciona las caras del mango, elige el material del cuero y pulsa el botón "Assign".',
          'Selecciona dos caras en el canal de la hoja donde irá la runa mística, crea un material "Runa Celestial": Emission Color azul eléctrico (#00E5FF) y Emission Strength en 4.5.',
          'Activa Bloom en el motor EEVEE o configura el compositor en Cycles para disfrutar del resplandor de la espada.'
        ],
        keyShortcuts: [
          { key: 'Assign (en Material Properties)', description: 'Asignar material a las caras seleccionadas en Edit Mode' },
          { key: 'Z > 2', description: 'Cambiar a modo Material Preview' },
          { key: 'Numpad . (Punto)', description: 'Centrar la cámara del viewport en el objeto o cara seleccionada' }
        ],
        commonPitfalls: 'Para que la emisión brille intensamente en Blender 4+, asegúrate de ajustar el "View Transform" en Color Management a AgX para un rango dinámico cinematográfico.',
        blenderWorkspace: 'Shading',
        modelStage: 3 // Espada final texturizada con runa brillante
      }
    ]
  },
  {
    id: 'island',
    title: 'Isla Flotante Low-Poly con Lago y Árboles',
    subtitle: 'Composición ambiental y dioramas 3D estilizados',
    difficulty: 'Intermedio',
    estimatedHours: '3 h',
    badge: 'Ambiente Completo',
    coverDescription: 'Aprende a esculpir terrenos rocosos con desplazamientos angulares, modelar pinos low-poly con conos y cilindros, crear agua estilizada translúcida e iluminación cinemática ambiental.',
    topics: ['Geometría de Terreno', 'Shading Translúcido', 'Vegetación Low-Poly', 'Iluminación de Estudio de 3 Puntos', 'Composición de Diorama'],
    steps: [
      {
        id: 'island-1',
        stepNumber: 1,
        title: 'Modelado del Peñón Flotante y Base Rocosa',
        category: 'Geometría Base',
        durationMinutes: 30,
        summary: 'Generamos la masa de tierra flotante con un cilindro invertido y cortes angulares.',
        instructions: [
          'Crea un cilindro con Shift + A > Mesh > Cylinder con 8 o 10 vértices para acentuar el aspecto poligonal.',
          'En Edit Mode, selecciona el vértice inferior central y desplázalo hacia abajo con G + Z para formar la punta del peñón flotante.',
          'Selecciona la cara superior y usa I (Inset) para crear el reborde de tierra donde descansará el lago interior.',
          'Aplica pequeñas rotaciones y desplazamientos a los vértices con G para romper la simetría y simular roca arrancada de la corteza.',
          'Añade un plano adicional dentro del hueco para formar la superficie del agua del lago.'
        ],
        keyShortcuts: [
          { key: 'I', description: 'Inset para delimitar la costa interior del lago' },
          { key: 'G + Z', description: 'Mover vértices estrictamente en el eje vertical Z' },
          { key: 'Click Derecho > Shade Flat', description: 'Forzar sombreado plano (Flat) para estética Low-Poly' }
        ],
        commonPitfalls: 'No apliques Subdivision Surface si buscas el estilo estilizado Low-Poly puro; el encanto radica en las caras planas bien iluminadas con Shade Flat.',
        blenderWorkspace: 'Modeling',
        modelStage: 0 // Base rocosa
      },
      {
        id: 'island-2',
        stepNumber: 2,
        title: 'Modelado de Pinos y Rocas Circundantes',
        category: 'Props & Vegetación',
        durationMinutes: 35,
        summary: 'Construimos árboles de fantasía utilizando conos escalados en cascada.',
        instructions: [
          'Crea un tronco con un cilindro fino de 6 lados y color madera mate.',
          'Para el follaje, crea un cono con Shift + A > Cone de 6 lados. Duplica hacia arriba con Shift + D y escala ligeramente más pequeño (S) 3 veces consecutivas.',
          'Une las piezas con Ctrl + J para agrupar el pino en un único objeto reutilizable.',
          'Coloca varios árboles sobre la isla con diferentes tamaños y rotaciones aleatorias (R > Z) para dar variedad visual.',
          'Añade 2 o 3 icosaedros (Icosphere con Subdivision 1) como rocas musgosas en la orilla del agua.'
        ],
        keyShortcuts: [
          { key: 'Ctrl + J', description: 'Unir (Join) objetos seleccionados en una sola malla' },
          { key: 'Shift + D > Z', description: 'Duplicar copa de árbol y desplazarla en vertical' },
          { key: 'R + Z', description: 'Rotar objetos en el eje Z para que ningún árbol mire en la misma dirección' }
        ],
        commonPitfalls: 'Evita dejar árboles flotando en el aire. Asegúrate de que la base del tronco penetre ligeramente dentro de la malla del terreno.',
        blenderWorkspace: 'Layout / Modeling',
        modelStage: 1 // Isla con árboles colocados
      },
      {
        id: 'island-3',
        stepNumber: 3,
        title: 'Shading de Agua Translúcida y Césped Esmeralda',
        category: 'Materiales & Shaders',
        durationMinutes: 35,
        summary: 'Configuramos materiales con propiedades de transmisión para el agua y tonos orgánicos contrastados.',
        instructions: [
          'Material Roca Base: Gris pizarra (#4A5568) con Roughness 0.9.',
          'Material Césped Superior: Verde esmeralda primaveral (#2E7D32) con Roughness 0.75.',
          'Material Agua: Color turquesa cristalino (#00ACC1), Transmission en 0.85, Roughness en 0.08 e IOR (Índice de refracción) en 1.333 (valor físico real del agua).',
          'En el compositor o en la pestaña de vista, añade un plano de fondo oscuro o niebla de horizonte para realzar la flotabilidad del diorama.'
        ],
        keyShortcuts: [
          { key: 'Transmission Slider', description: 'Permite que la luz atraviese el material simulando vidrio o agua' },
          { key: 'IOR = 1.333', description: 'Índice de refracción exacto del agua líquida' }
        ],
        commonPitfalls: 'Para ver la transparencia del agua en EEVEE, debes activar "Screen Space Refraction" tanto en los ajustes de render como en las opciones del material.',
        blenderWorkspace: 'Shading',
        modelStage: 2 // Isla texturizada
      },
      {
        id: 'island-4',
        stepNumber: 4,
        title: 'Iluminación Cinemática de Tres Puntos y Render Final',
        category: 'Iluminación & Cámara',
        durationMinutes: 30,
        summary: 'Configuramos una luz principal cálida, luz de relleno fría y contraluz de silueta para acabado profesional.',
        instructions: [
          'Añade una Sun Light o Area Light principal ("Key Light") a 45 grados con tono dorado cálido (#FFE0B2) e intensidad fuerte.',
          'En el lado opuesto, añade una Area Light suave ("Fill Light") teñida de azul cielo tenue (#B3E5FC) para que las sombras no queden negras.',
          'Añade una luz trasera ("Rim Light") apuntando a los bordes de los pinos y la roca para recortar la silueta contra el fondo.',
          'Ajusta la cámara en perspectiva ortográfica o de 50mm para un aspecto de maqueta coleccionable en miniatura.',
          'Presiona F12 para renderizar tu primer diorama 3D completo en Blender.'
        ],
        keyShortcuts: [
          { key: 'F12', description: 'Iniciar renderizado de la imagen' },
          { key: 'Numpad 0', description: 'Entrar o salir de la vista de la cámara' },
          { key: 'Shift + ~ (Tilde)', description: 'Modo Fly Navigation para mover la cámara como en un videojuego (WASD)' }
        ],
        commonPitfalls: 'No uses una sola luz ambiental uniforme plana: la magia del 3D reside en el contraste entre luces cálidas y sombras frescas.',
        blenderWorkspace: 'Render',
        modelStage: 3 // Diorama completo terminado
      }
    ]
  }
];
