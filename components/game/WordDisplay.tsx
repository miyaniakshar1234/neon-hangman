'use client';

import { useGameStore } from '@/store/gameStore';
import { motion } from 'motion/react';

export function WordDisplay() {
  const { word, clue, guessedLetters, status } = useGameStore();

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full">
      {/* Clue Display */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl px-6 py-4 glass-panel rounded-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50" />
        <span className="text-xs font-mono text-neon-cyan uppercase tracking-widest block mb-2 opacity-80 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
          Target Intel
        </span>
        <p className="text-lg md:text-2xl font-medium text-white tracking-wide">{clue}</p>
      </motion.div>

      {/* Word Display */}
      <div className="flex flex-col items-center gap-2">
        {/* Word Difficulty Badge */}
        {(() => {
          const len = word.length;
          const label = len <= 4 ? 'Easy' : len <= 7 ? 'Medium' : len <= 10 ? 'Hard' : 'Extreme';
          const color = len <= 4 ? 'bg-green-500/20 text-green-400 border-green-500/30' : len <= 7 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : len <= 10 ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30';
          return (
            <span className={`text-[10px] font-mono uppercase tracking-widest px-3 py-0.5 rounded-full border ${color}`}>
              {label} • {len} letters
            </span>
          );
        })()}
      </div>

      <div className="flex flex-wrap justify-center gap-2 md:gap-4">
        {word.split('').map((letter, index) => {
          const isGuessed = guessedLetters.has(letter);
          const isLost = status === 'lost';
          const showLetter = isGuessed || isLost;
          const isMissed = isLost && !isGuessed;

          return (
            <div
              key={index}
              className={`w-9 h-12 sm:w-12 sm:h-16 md:w-16 md:h-20 flex items-center justify-center rounded-lg sm:rounded-xl transition-all duration-500 relative ${showLetter
                ? 'glass-panel border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                : 'bg-white/5 border border-white/10'
                }`}
            >
              {showLetter && (
                <motion.span
                  initial={{ y: 20, opacity: 0, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`text-2xl sm:text-4xl md:text-5xl font-black uppercase ${isMissed ? 'text-neon-pink' : 'text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]'
                    }`}
                >
                  {letter}
                </motion.span>
              )}
              {isMissed && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="absolute inset-0 border-2 border-neon-pink rounded-xl shadow-[0_0_15px_rgba(255,0,234,0.5)] pointer-events-none"
                />
              )}
              {/* Bottom line for unrevealed letters */}
              {!showLetter && (
                <div className="absolute bottom-2 w-1/2 h-1 bg-white/20 rounded-full" />
              )}
              {/* Active Glow for revealed letters */}
              {showLetter && !isMissed && (
                <div className="absolute inset-0 bg-gradient-to-t from-neon-cyan/20 to-transparent rounded-xl pointer-events-none mix-blend-screen" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
