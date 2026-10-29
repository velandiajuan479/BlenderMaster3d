import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

export async function POST(req: NextRequest) {
  try {
    const { message, category } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Mensaje requerido para el asistente de Blender" },
        { status: 400 }
      );
    }

    const systemInstruction = `Eres "BlenderMaster AI", un experto instructor y artista técnico senior en Blender 4.x y 5.x.
Tu objetivo es ayudar a estudiantes, principiantes y artistas 3D avanzados a resolver dudas técnicas, solucionar errores de render/modelado y optimizar sus flujos de trabajo.

Pautas de respuesta:
1. Sé conciso, directo y pedagógico. Utiliza formato Markdown con títulos limpios, listas numeradas y negritas para atajos clave.
2. Cada vez que menciones una tecla o atajo, ponlo en formato de teclado destacado, por ejemplo: \`Ctrl + A\`, \`Shift + N\`, \`G\` + \`Z\`, \`Tab\`.
3. Para problemas frecuentes (como malla negra, escala deformada, bevel que no funciona parejo, subdivision surface colapsando la malla), explica primero la CAUSA exacta y luego la SOLUCIÓN paso a paso en 2-4 pasos claros.
4. Si la consulta pide o involucra automatización o scripts de Python, provee un bloque de código \`\`\`python limpio con import bpy listo para ejecutar en el Text Editor de Blender.
5. Responde siempre en español claro y profesional con terminología estándar de Blender (viewport, outliner, modifier stack, Principled BSDF, normal map, topology, loop cut).`;

    const promptContext = category
      ? `[Categoría de consulta: ${category}]\nConsulta del usuario sobre Blender:\n${message}`
      : `Consulta del usuario sobre Blender:\n${message}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptContext,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "No se pudo obtener respuesta del mentor de Blender. Por favor intenta de nuevo.";

    return NextResponse.json({
      text: reply,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in blender-ai route:", error);
    return NextResponse.json(
      {
        error: "Error procesando la consulta con Gemini AI",
        details: error?.message || "Error desconocido",
      },
      { status: 500 }
    );
  }
}
