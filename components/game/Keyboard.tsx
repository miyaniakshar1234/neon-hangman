'use client';

import { useGameStore } from '@/store/gameStore';
import { useAudio } from '@/hooks/useAudio';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

export function Keyboard() {
  const { word, guessedLetters, guessLetter, status } = useGameStore();
  const { playClick, playCorrect, playWrong, playHover } = useAudio();

  const handleKeyClick = (key: string) => {
    if (status !== 'playing') return;

    // Play sound based on if the guess WILL be correct or wrong
    if (word.includes(key)) {
      playCorrect();
    } else {
      playWrong();
    }

    guessLetter(key);
  };

  return (
    <div className="flex flex-col gap-2 md:gap-3 w-full max-w-3xl mx-auto">
      {ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 md:gap-2">
          {row.map((key) => {
            const isGuessed = guessedLetters.has(key);
            const isCorrect = isGuessed && word.includes(key);
            const isWrong = isGuessed && !word.includes(key);

            let btnClass = "relative flex-1 max-w-[2.5rem] sm:max-w-[3rem] h-10 sm:h-12 md:h-14 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm md:text-lg transition-all duration-300 uppercase overflow-hidden ";

            if (isCorrect) {
              btnClass += "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-95";
            } else if (isWrong) {
              btnClass += "bg-white/5 text-white/20 border border-white/5 opacity-50";
            } else {
              btnClass += "glass-panel-interactive text-white hover:text-neon-cyan hover:border-neon-cyan/50 hover:shadow-[0_0_15px_rgba(0,243,255,0.3)] active:scale-95";
            }

            return (
              <button
                key={key}
                onClick={() => handleKeyClick(key)}
                onMouseEnter={() => !isGuessed && playHover()}
                disabled={isGuessed || status !== 'playing'}
                className={btnClass}
              >
                {/* Subtle gradient overlay for active keys */}
                {!isGuessed && status === 'playing' && (
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                )}
                {/* Key Text */}
                <span className="relative z-10">{key}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
