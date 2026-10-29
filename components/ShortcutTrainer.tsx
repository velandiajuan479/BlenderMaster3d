'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BLENDER_SHORTCUTS, SHORTCUT_CHALLENGES, ShortcutChallenge } from '@/data/blenderShortcuts';
import { ShortcutItem } from '@/types/blender';
import {
  Keyboard,
  Trophy,
  Zap,
  Search,
  CheckCircle,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Command
} from 'lucide-react';

export default function ShortcutTrainer() {
  const [activeTab, setActiveTab] = useState<'trainer' | 'cheatsheet'>('trainer');

  // Trainer State
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'failure'>('idle');
  const [showHint, setShowHint] = useState(false);

  // Cheat Sheet State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const currentChallenge: ShortcutChallenge = SHORTCUT_CHALLENGES[currentChallengeIndex] || SHORTCUT_CHALLENGES[0];

  const verifyAnswer = useCallback((keys: string[]) => {
    if (feedback !== 'idle') return;

    const expected = currentChallenge.expectedKeys.map(k => k.toLowerCase());
    const actual = keys.map(k => k.toLowerCase());

    // Check if lengths match and every expected key is pressed
    const isCorrect =
      expected.length === actual.length &&
      expected.every(k => actual.includes(k));

    if (isCorrect) {
      setFeedback('success');
      setScore(s => s + 100);
      setStreak(st => st + 1);

      setTimeout(() => {
        setFeedback('idle');
        setPressedKeys([]);
        setShowHint(false);
        setCurrentChallengeIndex(i => (i + 1) % SHORTCUT_CHALLENGES.length);
      }, 1200);
    } else if (actual.length >= expected.length) {
      setFeedback('failure');
      setStreak(0);

      setTimeout(() => {
        setFeedback('idle');
        setPressedKeys([]);
      }, 1000);
    }
  }, [feedback, currentChallenge]);

  // Keyboard Event Listener for Trainer
  useEffect(() => {
    if (activeTab !== 'trainer') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      e.preventDefault();

      const pressed: string[] = [];
      if (e.ctrlKey || e.metaKey) pressed.push('Ctrl');
      if (e.shiftKey) pressed.push('Shift');
      if (e.altKey) pressed.push('Alt');

      // Key name cleanup
      let mainKey = e.key;
      if (mainKey === 'Control' || mainKey === 'Shift' || mainKey === 'Alt' || mainKey === 'Meta') {
        setPressedKeys(pressed);
        return;
      }

      if (mainKey.toLowerCase() === 'tab') mainKey = 'Tab';
      else if (mainKey === ' ') mainKey = 'Space';
      else if (mainKey.startsWith('Numpad') || mainKey.startsWith('Num')) {
        mainKey = `Numpad ${mainKey.replace(/[^0-9]/g, '')}`;
      } else {
        mainKey = mainKey.toUpperCase();
      }

      if (!pressed.includes(mainKey)) {
        pressed.push(mainKey);
      }

      setPressedKeys(pressed);

      // Verify answer against expected keys
      verifyAnswer(pressed);
    };

    const handleKeyUp = () => {
      // Clear key state after release if idle
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeTab, verifyAnswer]);

  const handleVirtualKeyPress = (key: string) => {
    const updated = [...pressedKeys];
    if (!updated.includes(key)) {
      updated.push(key);
      setPressedKeys(updated);
      verifyAnswer(updated);
    }
  };

  const resetTrainer = () => {
    setScore(0);
    setStreak(0);
    setCurrentChallengeIndex(0);
    setPressedKeys([]);
    setFeedback('idle');
    setShowHint(false);
  };

  // Filter shortcuts
  const filteredShortcuts = BLENDER_SHORTCUTS.filter(sc => {
    const matchesCat = selectedCategory === 'Todos' || sc.category === selectedCategory;
    const matchesSearch =
      sc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.keys.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const categories = ['Todos', 'Modelado', 'Navegación', 'Selección', 'Shading', 'Render'];

  return (
    <div className="flex flex-col h-full bg-[#0e141f] text-slate-100 overflow-y-auto">
      {/* Top Controls Bar */}
      <div className="p-4 border-b border-slate-800 bg-[#131b29] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-[#f57921]" />
            Entrenador de Atajos & Memoria Muscular
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Domina los atajos estándar de Blender 4.x/5.x para trabajar 10 veces más rápido.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#0b0f17] rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('trainer')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'trainer'
                ? 'bg-[#f57921] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Modo Desafío
          </button>
          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'cheatsheet'
                ? 'bg-[#1e293b] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Guía de Referencia
          </button>
        </div>
      </div>

      {/* TAB 1: TRAINER MODE */}
      {activeTab === 'trainer' && (
        <div className="p-6 max-w-2xl mx-auto w-full flex flex-col gap-6">
          {/* Score & Streak Header */}
          <div className="flex items-center justify-between bg-[#151e2e] p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#f57921]/15 border border-[#f57921]/30 flex items-center justify-center text-[#f57921]">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Puntuación</span>
                <span className="text-lg font-bold font-mono text-white">{score} pts</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Racha:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-600/40 text-emerald-400 font-mono text-xs font-bold">
                🔥 {streak} seguidas
              </span>
            </div>

            <button
              onClick={resetTrainer}
              title="Reiniciar desafío"
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Challenge Card */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
            feedback === 'success'
              ? 'bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-900/20'
              : feedback === 'failure'
              ? 'bg-rose-950/30 border-rose-500/60 shadow-lg shadow-rose-900/20'
              : 'bg-[#131c2a] border-slate-800 shadow-xl'
          }`}>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="text-[#f57921] font-mono font-medium">
                Desafío {currentChallengeIndex + 1} de {SHORTCUT_CHALLENGES.length}
              </span>
              <span className="text-slate-500 font-mono">{currentChallenge.category}</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-6 leading-snug">
              {currentChallenge.task}
            </h3>

            {/* Live Pressed Keys Display */}
            <div className="bg-[#0b0f17] rounded-xl p-6 border border-slate-800/80 flex flex-col items-center justify-center min-h-[120px] mb-4">
              <span className="text-[11px] text-slate-500 uppercase tracking-widest mb-3">
                Presiona las teclas en tu teclado físico o haz clic abajo:
              </span>

              <div className="flex items-center gap-2">
                {pressedKeys.length > 0 ? (
                  pressedKeys.map((k, i) => (
                    <kbd
                      key={i}
                      className="px-3.5 py-2 text-sm font-mono font-bold bg-[#1e293b] border-2 border-[#f57921] rounded-lg text-white shadow-md animate-in fade-in"
                    >
                      {k}
                    </kbd>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 font-mono italic animate-pulse">
                    [ Esperando pulsación de teclas... ]
                  </span>
                )}
              </div>

              {/* Success / Failure Feedback banner */}
              {feedback === 'success' && (
                <div className="mt-4 flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  ¡Correcto! Excelente memoria muscular (+100 pts)
                </div>
              )}
              {feedback === 'failure' && (
                <div className="mt-4 flex items-center gap-1.5 text-rose-400 text-xs font-semibold">
                  <XCircle className="w-4 h-4" />
                  Combinación incorrecta. Inténtalo de nuevo.
                </div>
              )}
            </div>

            {/* Virtual Clickable Key Shortcuts Helper */}
            <div className="flex flex-wrap gap-1.5 justify-center pt-2">
              {['Ctrl', 'Shift', 'Alt', 'Tab', 'E', 'I', 'B', 'R', 'O', 'M', 'P', 'A', 'Z', 'N'].map((k) => (
                <button
                  key={k}
                  onClick={() => handleVirtualKeyPress(k)}
                  className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all hover:scale-105 active:scale-95"
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Hint Footer */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#f57921]" />
                {showHint ? 'Ocultar pista' : 'Ver pista'}
              </button>

              {showHint && (
                <span className="text-amber-300 text-xs font-mono bg-amber-950/30 px-2 py-1 rounded border border-amber-600/30">
                  Pista: {currentChallenge.hint}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHEAT SHEET SEARCHABLE DIRECTORY */}
      {activeTab === 'cheatsheet' && (
        <div className="p-4 flex flex-col gap-4 max-w-4xl mx-auto w-full">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar atajo o acción (ej: Biselar, Loop cut)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#131c2a] border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#f57921]"
              />
            </div>

            {/* Category Filter Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#f57921] text-white shadow-sm'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Shortcuts Grid List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredShortcuts.map((sc) => (
              <div
                key={sc.id}
                className="bg-[#131c2a] p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-xs text-white tracking-tight">{sc.name}</span>
                    <div className="flex items-center gap-1">
                      {sc.keys.map((k, idx) => (
                        <kbd
                          key={idx}
                          className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#1e293b] border border-slate-700 text-[#f57921] rounded"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-2">
                    {sc.description}
                  </p>
                </div>

                {sc.tip && (
                  <div className="text-[11px] text-cyan-300/90 bg-cyan-950/20 px-2 py-1.5 rounded border border-cyan-800/30 font-mono mt-1">
                    💡 Tip Pro: {sc.tip}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredShortcuts.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-xs">
              No se encontraron atajos con la búsqueda &quot;{searchQuery}&quot;.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
