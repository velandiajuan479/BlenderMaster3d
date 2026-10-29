import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BlenderMaster 3D - Aprende Blender Interactivo',
  description: 'Plataforma interactiva para aprender Blender con visor 3D WebGL, tutoriales paso a paso de la Dona y modelado low-poly, entrenador de atajos, laboratorio de nodos y asistente IA.',
  openGraph: {
    title: 'BlenderMaster 3D - Aprende Blender Interactivo',
    description: 'Plataforma interactiva para aprender Blender con visor 3D WebGL, tutoriales paso a paso de la Dona y modelado low-poly, entrenador de atajos, laboratorio de nodos y asistente IA.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlenderMaster 3D - Aprende Blender Interactivo',
    description: 'Plataforma interactiva para aprender Blender con visor 3D WebGL, tutoriales paso a paso de la Dona y modelado low-poly, entrenador de atajos, laboratorio de nodos y asistente IA.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`dark ${plusJakarta.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#0b0f17] text-slate-100 min-h-screen antialiased selection:bg-[#f57921]/30 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
