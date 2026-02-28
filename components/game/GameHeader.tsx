'use client';

import { useGameStore } from '@/store/gameStore';
import { Heart, Trophy, Layers, Zap, Lightbulb, LogOut, Search, ShieldPlus, Eye, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useAudio } from '@/hooks/useAudio';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export function GameHeader({ onSaveProgress }: { onSaveProgress?: () => Promise<void> }) {
  const { category, difficulty, level, score, mistakes, status, resetGame, maxMistakes, combo, buyHint, consumeGlobalHint, buyHeal, buyRevealVowels, useFreeService, freeServices, isDaily } = useGameStore();
  const { playClick, playHover, playLose } = useAudio();
  const { user } = useAuth();
  const router = useRouter();

  const [showGiveUp, setShowGiveUp] = useState(false);
  const [globalHints, setGlobalHints] = useState<number>(0);
  const [isConsumingHint, setIsConsumingHint] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const livesLeft = maxMistakes - mistakes;

  // Listen to user profile for real-time hint balance
  useEffect(() => {
    if (!user || !db) return;
    const unsub = onSnapshot(doc(db, 'profiles', user.uid), (docSnap) => {
      if (docSnap.exists() && docSnap.data().hints !== undefined) {
        setGlobalHints(docSnap.data().hints);
      }
    });
    return () => unsub();
  }, [user]);

  const handleUseGlobalHint = async () => {
    if (!user || !db || globalHints <= 0 || status !== 'playing' || isConsumingHint) return;

    playClick();
    setIsConsumingHint(true);
    try {
      // Deduct 1 hint from Firestore
      const userRef = doc(db, 'profiles', user.uid);
      await updateDoc(userRef, { hints: increment(-1) });

      // Tell store to reveal a letter
      consumeGlobalHint();
    } catch (err) {
      console.error("Failed to consume hint", err);
    } finally {
      setIsConsumingHint(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 glass-panel rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)] border border-white/10">
        {/* Combo Background Effect */}
        <AnimatePresence>
          {combo > 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan pointer-events-none mix-blend-screen"
            />
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 z-10">
          {/* Changed Link to Button to trigger modal */}
          <button
            onMouseEnter={playHover}
            onClick={() => {
              playClick();
              setShowGiveUp(true);
            }}
            className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-neon-pink hover:text-white transition-all uppercase tracking-widest border border-neon-pink/30 hover:border-neon-pink hover:shadow-[0_0_15px_rgba(255,0,234,0.4)] hover:bg-neon-pink/10 rounded-lg px-2.5 sm:px-4 py-1.5 sm:py-2 bg-black/50 backdrop-blur-sm"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Abort</span>
          </button>
          <div className="hidden md:flex flex-col">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Target Database</span>
            <span className="font-bold text-neon-cyan uppercase tracking-wide drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]">{category}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-8 z-10 flex-wrap justify-end">
          {/* Power-ups Section - visible on all screens, compact on mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-black/30 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-white/5 backdrop-blur-sm">
            {/* Free Services - Glow green, no cost */}
            <button
              onMouseEnter={playHover}
              onClick={() => { playClick(); useFreeService('hint'); }}
              disabled={status !== 'playing' || freeServices <= 0}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border transition-all ${freeServices > 0 && status === 'playing'
                ? 'border-green-400/50 text-green-400 hover:bg-green-400/10 hover:shadow-[0_0_15px_rgba(74,222,128,0.4)] animate-pulse'
                : 'border-white/5 text-gray-600 bg-black/20 cursor-not-allowed opacity-50'
                }`}
              title={`Free Hint Decode (${freeServices} left)`}
            >
              <Lightbulb className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="font-mono text-[10px] sm:text-xs font-bold">FREE</span>
              <span className="font-mono text-[9px] sm:text-[10px] opacity-70">x{freeServices}</span>
            </button>

            <button
              onMouseEnter={playHover}
              onClick={() => { playClick(); useFreeService('heal'); }}
              disabled={status !== 'playing' || freeServices <= 0 || mistakes === 0}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border transition-all ${freeServices > 0 && status === 'playing' && mistakes > 0
                ? 'border-green-400/50 text-green-400 hover:bg-green-400/10 hover:shadow-[0_0_15px_rgba(74,222,128,0.4)] animate-pulse'
                : 'border-white/5 text-gray-600 bg-black/20 cursor-not-allowed opacity-50'
                }`}
              title={`Free Heal (${freeServices} left)`}
            >
              <ShieldPlus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="font-mono text-[10px] sm:text-xs font-bold">FREE</span>
              <span className="font-mono text-[9px] sm:text-[10px] opacity-70">x{freeServices}</span>
            </button>

            <div className="w-px h-5 bg-white/10 mx-0.5" />

            {/* Global Hint (Uses Profile Balance instead of Game Score) */}
            <button
              onMouseEnter={playHover}
              onClick={handleUseGlobalHint}
              disabled={status !== 'playing' || globalHints <= 0 || isConsumingHint}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border transition-all ${globalHints > 0 && status === 'playing' && !isConsumingHint
                ? 'border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                : 'border-white/5 text-gray-600 bg-black/20 cursor-not-allowed opacity-50'
                }`}
              title="Use a Global Hint"
            >
              <Lightbulb className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="font-mono text-[10px] sm:text-xs font-bold">{globalHints}</span>
            </button>

            {/* Legacy Buy Hint */}
            <button
              onMouseEnter={playHover}
              onClick={() => { playClick(); buyHint(); }}
              disabled={status !== 'playing' || score < 30}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border transition-all ${score >= 30 && status === 'playing'
                ? 'border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 hover:shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                : 'border-white/5 text-gray-600 bg-black/20 cursor-not-allowed opacity-50'
                }`}
              title="Decode random letter (Cost: 30 Score)"
            >
              <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="font-mono text-[10px] sm:text-xs font-bold">-30</span>
            </button>

            {/* Buy Heal */}
            <button
              onMouseEnter={playHover}
              onClick={() => { playClick(); buyHeal(); }}
              disabled={status !== 'playing' || score < 50 || mistakes === 0}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border transition-all ${score >= 50 && status === 'playing' && mistakes > 0
                ? 'border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'border-white/5 text-gray-600 bg-black/20 cursor-not-allowed opacity-50'
                }`}
              title="Restore Integrity (Cost: 50)"
            >
              <ShieldPlus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-mono text-[10px] sm:text-xs font-bold">-50</span>
            </button>

            {/* Buy Reveal Vowels */}
            <button
              onMouseEnter={playHover}
              onClick={() => { playClick(); buyRevealVowels(); }}
              disabled={status !== 'playing' || score < 80}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border transition-all ${score >= 80 && status === 'playing'
                ? 'border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'border-white/5 text-gray-600 bg-black/20 cursor-not-allowed opacity-50'
                }`}
              title="Clairvoyance - Reveal all Vowels (Cost: 80)"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-mono text-[10px] sm:text-xs font-bold">-80</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 bg-black/30 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-white/5 backdrop-blur-sm">
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neon-purple" />
            <span className="font-mono text-xs sm:text-sm font-bold tracking-wider">
              {isDaily ? (
                <span className="text-neon-pink">DAILY</span>
              ) : (
                <>LVL <span className="text-white">{level}</span></>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 bg-black/30 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-white/5 backdrop-blur-sm relative">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neon-cyan" />
            <div className="flex flex-col">
              <span className="text-[8px] sm:text-[10px] font-mono text-gray-500 uppercase leading-none tracking-wider">Score</span>
              <span className="font-bold font-mono text-base sm:text-xl leading-none text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{score}</span>
            </div>

            <AnimatePresence>
              {combo > 1 && (
                <motion.div
                  key={combo}
                  initial={{ opacity: 0, y: 10, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -top-5 -right-4 sm:-top-6 sm:-right-6 flex items-center text-neon-pink font-black italic text-sm sm:text-base"
                >
                  x{combo}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 bg-red-950/30 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-red-500/20 backdrop-blur-sm">
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${livesLeft <= 2 ? 'text-neon-pink animate-pulse drop-shadow-[0_0_8px_rgba(255,0,234,0.8)]' : 'text-red-400'}`} />
            <div className="flex flex-col">
              <span className="text-[8px] sm:text-[10px] font-mono text-red-500/80 uppercase leading-none tracking-wider">HP</span>
              <span className={`font-bold font-mono text-base sm:text-xl leading-none ${livesLeft <= 2 ? 'text-neon-pink' : 'text-white'}`}>{livesLeft}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Give Up Modal */}
      <AnimatePresence>
        {showGiveUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel rounded-2xl p-6 max-w-sm w-full flex flex-col items-center text-center border border-neon-pink/30 shadow-[0_0_30px_rgba(255,42,133,0.3)]"
            >
              <div className="w-16 h-16 rounded-full bg-neon-pink/20 flex flex-col items-center justify-center mb-4 border border-neon-pink">
                <AlertTriangle className="w-8 h-8 text-neon-pink" />
              </div>
              <h2 className="text-2xl font-black uppercase text-white mb-2">Abort Mission?</h2>
              <p className="text-gray-400 text-sm mb-6 font-mono">
                All progress in this sector will be lost. This cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onMouseEnter={playHover}
                  onClick={() => {
                    playClick();
                    setShowGiveUp(false);
                  }}
                  className="flex-1 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold tracking-widest uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  onMouseEnter={playHover}
                  onClick={async () => {
                    setIsSaving(true);
                    if (onSaveProgress) {
                      await onSaveProgress();
                    }
                    setIsSaving(false);
                    setShowGiveUp(false);
                    resetGame();
                    router.push('/setup');
                  }}
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-neon-pink/10 hover:bg-neon-pink/20 text-neon-pink rounded-xl font-bold uppercase tracking-widest text-sm transition-colors border border-neon-pink/30 hover:border-neon-pink relative"
                >
                  {isSaving ? <span className="animate-pulse">Saving Assets...</span> : "Confirm Abort"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
