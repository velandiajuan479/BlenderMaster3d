'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Copy,
  Check,
  AlertCircle,
  Code,
  Wrench,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface BlenderAIChatProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export default function BlenderAIChat({
  isOpen,
  onClose,
  initialPrompt
}: BlenderAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: '¡Hola! Soy tu mentor y copiloto técnico de Blender. Puedo ayudarte a resolver cualquier error de render (objetos negros, fuego/humo que no aparece), solucionar problemas de escala y modificadores (`Ctrl + A`), explicar nodos o generar scripts en Python con `bpy`. ¿En qué estás trabajando?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested troubleshooting quick prompts
  const quickPrompts = [
    '¿Por qué mi objeto sale negro al renderizar?',
    'El modificador Bevel me deforma la malla de forma despareja',
    '¿Cómo aplico la escala (Ctrl + A) y por qué es importante?',
    'Generar script Python (bpy) para crear 50 cubos procedurales',
    '¿Cómo arreglar normales invertidas (caras oscuras)?'
  ];

  const sendMessage = useCallback(async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/blender-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || 'Error consultando al asistente');
      }

      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `Lo siento, ocurrió un error al procesar tu consulta: ${err.message}. Asegúrate de que las credenciales de API estén disponibles.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle external initial prompt asynchronously
  useEffect(() => {
    if (initialPrompt && isOpen) {
      const timer = setTimeout(() => {
        sendMessage(initialPrompt);
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [initialPrompt, isOpen, sendMessage]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-[#111827] border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-[#162032] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#f57921]/15 border border-[#f57921]/40 flex items-center justify-center text-[#f57921]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              BlenderMaster AI
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                Gemini 3.8 Flash
              </span>
            </h3>
            <span className="text-[11px] text-slate-400">Mentor técnico 3D & Solucionador de errores</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-[#f57921] text-white'
                    : 'bg-[#1e293b] text-cyan-400 border border-slate-700'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-[#f57921] text-white rounded-tr-none'
                    : 'bg-[#182234] text-slate-200 border border-slate-800 rounded-tl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/10 text-[10px] opacity-75">
                  <span className="font-mono">{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className="hover:text-white flex items-center gap-1 transition-opacity"
                      title="Copiar respuesta"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === msg.id ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#1e293b] text-cyan-400 border border-slate-700 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-[#182234] border border-slate-800 rounded-xl rounded-tl-none p-3.5 text-xs text-slate-400 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#f57921] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[#f57921] animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-[#f57921] animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] font-mono ml-1">Consultando conocimiento de Blender...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-[#0f1725]">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1.5 font-medium flex items-center gap-1">
          <Wrench className="w-3 h-3 text-[#f57921]" />
          Diagnósticos frecuentes rápidos:
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(qp)}
              disabled={isLoading}
              className="text-[11px] text-slate-300 hover:text-white bg-[#1a2538] hover:bg-slate-700 border border-slate-700/60 rounded-md px-2.5 py-1 whitespace-nowrap transition-colors shrink-0"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-800 bg-[#162032]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta sobre atajos, modificadores, errores de render..."
            disabled={isLoading}
            className="flex-1 bg-[#0b0f17] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#f57921]"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-lg bg-[#f57921] hover:bg-[#ea580c] disabled:opacity-40 disabled:hover:bg-[#f57921] text-white transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <span className="text-[10px] text-slate-500 block text-center mt-1.5">
          Impulsado por Gemini 3.8 Flash con conocimiento experto de Blender 4 & 5
        </span>
      </div>
    </div>
  );
}
