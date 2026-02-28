'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';
import { Skull, PartyPopper, ArrowRight, RotateCcw, Home, Zap, Clock, Target, Flame, TrendingUp, Coins, Lightbulb } from 'lucide-react';

export function GameOverModal({ onSave }: { onSave?: () => Promise<void> | void }) {
  const { status, score, level, nextLevel, resetGame, word, combo, isDaily, difficulty, category, mistakes, sessionAura, sessionCoins, sessionHints } = useGameStore();
  const maxMistakes = useGameStore(s => s.maxMistakes);
  const router = useRouter();

  const isWon = status === 'won';

  // Read accumulated session rewards directly from the store
  const auraEarned = sessionAura || 0;
  const coinsEarned = sessionCoins || 0;
  const hintsEarned = sessionHints || 0;

  const accuracy = word.length > 0 ? Math.round(((maxMistakes - mistakes) / maxMistakes) * 100) : 0;
  const wordDifficulty = word.length <= 4 ? 'Easy' : word.length <= 7 ? 'Medium' : word.length <= 10 ? 'Hard' : 'Extreme';
  const wordDiffColor = word.length <= 4 ? 'text-green-400' : word.length <= 7 ? 'text-yellow-400' : word.length <= 10 ? 'text-orange-400' : 'text-red-400';

  useEffect(() => {
    if (status === 'won') {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [status]);

  const [isSaving, setIsSaving] = useState(false);

  const handleQuit = async () => {
    if (status === 'won' && onSave) {
      setIsSaving(true);
      await onSave();
      setIsSaving(false);
    }
    resetGame();
    router.push('/');
  };

  const handleNextLevel = () => {
    nextLevel();
  };

  const handleRetry = () => {
    resetGame();
    router.push('/setup');
  };

  const handleHome = async () => {
    if (status === 'won' && onSave) {
      setIsSaving(true);
      await onSave();
      setIsSaving(false);
    }
    resetGame();
    router.push('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-lg w-full flex flex-col items-center text-center relative overflow-hidden border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {isWon ? (
          <>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neon-green to-neon-cyan" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neon-green/20 border-2 border-neon-green flex items-center justify-center mb-4 sm:mb-6 shadow-[0_0_30px_rgba(0,255,0,0.3)]"
            >
              <PartyPopper className="w-8 h-8 sm:w-10 sm:h-10 text-neon-green" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-cyan mb-1">
              Level Cleared!
            </h2>
            <p className="text-gray-400 mb-4 sm:mb-6 font-mono text-xs sm:text-sm">Level {level} completed successfully.</p>

            {/* Detailed Post-Game Stats Grid */}
            <div className="bg-black/50 rounded-2xl p-4 sm:p-5 w-full mb-4 sm:mb-6 border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-green/5 to-transparent pointer-events-none" />

              <div className="grid grid-cols-2 gap-3 sm:gap-4 relative z-10">
                {/* Score */}
                <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-3 h-3 text-neon-cyan" />
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Score</span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-white">{score.toLocaleString()}</span>
                </div>

                {/* Aura Earned */}
                <div className="bg-white/5 rounded-xl p-3 text-center border border-neon-purple/20">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Flame className="w-3 h-3 text-neon-purple" />
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Aura XP</span>
                  </div>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="text-2xl sm:text-3xl font-mono font-bold text-neon-purple"
                  >
                    +{auraEarned}
                  </motion.span>
                </div>

                {/* Coins Earned */}
                <div className="bg-white/5 rounded-xl p-3 text-center border border-yellow-500/20 col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Coins className="w-3 h-3 text-yellow-500" />
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Coins</span>
                  </div>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring" }}
                    className="text-2xl sm:text-3xl font-mono font-bold text-yellow-500"
                  >
                    +{coinsEarned}
                  </motion.span>
                </div>

                {/* Combo */}
                {combo > 1 && (
                  <div className="bg-white/5 rounded-xl p-3 text-center border border-neon-pink/20">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Zap className="w-3 h-3 text-neon-pink" />
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Combo</span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-neon-pink italic">x{combo}</span>
                  </div>
                )}

                {/* Accuracy */}
                <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className="w-3 h-3 text-neon-yellow" />
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Accuracy</span>
                  </div>
                  <span className={`text-2xl sm:text-3xl font-mono font-bold ${accuracy >= 80 ? 'text-neon-green' : accuracy >= 50 ? 'text-yellow-400' : 'text-orange-400'}`}>
                    {accuracy}%
                  </span>
                </div>
              </div>

              {/* Word Info Bar */}
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-500">
                <span>Word: <span className="text-white font-bold">{word.length} letters</span></span>
                <span>Difficulty: <span className={`font-bold ${wordDiffColor}`}>{wordDifficulty}</span></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full">
              {isDaily ? (
                <button
                  onClick={handleHome}
                  disabled={isSaving}
                  className={`w-full py-3 sm:py-4 rounded-xl font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${isWon
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 hover:bg-neon-cyan hover:text-black shadow-[0_0_20px_rgba(0,243,255,0.3)]'
                    : 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSaving ? 'Saving...' : <><Home className="w-5 h-5" /> Return to Base</>}
                </button>
              ) : (
                <>
                  <button
                    onClick={handleNextLevel}
                    className="w-full py-3 sm:py-4 rounded-xl bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 font-bold tracking-widest uppercase hover:bg-neon-cyan hover:text-black transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)] flex items-center justify-center gap-2 group"
                  >
                    Proceed to Level {level + 1} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={handleHome}
                    disabled={isSaving}
                    className="w-full py-2.5 sm:py-3 rounded-xl border border-white/10 text-gray-400 font-bold tracking-widest uppercase hover:bg-white/5 hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : <><Home className="w-4 h-4" /> Return to Base</>}
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 to-red-400" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center mb-4 sm:mb-6 shadow-[0_0_30px_rgba(255,0,0,0.3)]"
            >
              <Skull className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 animate-pulse" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-red-500 mb-2 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
              Game Over
            </h2>
            <p className="text-gray-400 mb-4 sm:mb-6 font-mono text-sm">
              The target word was <br />
              <span className="text-white font-bold text-2xl tracking-widest mt-2 block">{word}</span>
            </p>

            {/* Game Over Stats */}
            <div className="bg-black/50 rounded-2xl p-4 sm:p-5 w-full mb-4 sm:mb-6 border border-red-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none" />

              <div className="grid grid-cols-3 gap-3 relative z-10">
                <div className="text-center">
                  <span className="text-[10px] font-mono text-red-400 uppercase block mb-1 tracking-widest">Final Score</span>
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-white">{score.toLocaleString()}</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1 tracking-widest">Level</span>
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-gray-300">{level}</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1 tracking-widest">Word</span>
                  <span className={`text-lg font-mono font-bold ${wordDiffColor}`}>{wordDifficulty}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => { resetGame(); router.push('/setup'); }}
              className="group w-full py-3 sm:py-4 rounded-xl bg-red-500 text-white font-bold uppercase tracking-widest hover:bg-red-400 hover:scale-[1.02] active:scale-[0.98] transition-all mb-3 shadow-[0_0_20px_rgba(255,0,0,0.3)] flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform" /> Try Again
            </button>
            <button
              onClick={handleHome}
              disabled={isSaving}
              className="w-full py-2.5 sm:py-3 rounded-xl border border-white/10 text-gray-400 font-bold tracking-widest uppercase hover:bg-white/5 hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : <><Home className="w-4 h-4" /> Return to Base</>}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
