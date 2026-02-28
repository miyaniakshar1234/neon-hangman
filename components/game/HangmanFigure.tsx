'use client';

import { useGameStore } from '@/store/gameStore';
import { motion, AnimatePresence } from 'motion/react';
import { useMemo, useState, useEffect, useRef } from 'react';

export function HangmanFigure() {
  const { mistakes, maxMistakes, status, score } = useGameStore();

  const isDead = status === 'lost';
  const isWon = status === 'won';

  const [transientEmotion, setTransientEmotion] = useState<'happy' | 'hurt' | null>(null);
  const prevMistakes = useRef(mistakes);
  const prevScore = useRef(score);

  useEffect(() => {
    if (status === 'playing') {
      if (mistakes > prevMistakes.current) {
        setTimeout(() => setTransientEmotion('hurt'), 0);
        const t = setTimeout(() => setTransientEmotion(null), 1500);
        prevMistakes.current = mistakes;
        prevScore.current = score;
        return () => clearTimeout(t);
      } else if (score > prevScore.current) {
        setTimeout(() => setTransientEmotion('happy'), 0);
        const t = setTimeout(() => setTransientEmotion(null), 1500);
        prevMistakes.current = mistakes;
        prevScore.current = score;
        return () => clearTimeout(t);
      }
    }
    prevMistakes.current = mistakes;
    prevScore.current = score;
  }, [mistakes, score, status]);

  const emotion = isWon ? 'victorious' : isDead ? 'dead' : transientEmotion || 'neutral';

  // Gallows are always visible
  const showBase = true;
  const showPole = true;
  const showTop = true;
  const showRope = !isWon;

  // Man parts appear based on mistakes, but if won, show all
  const showHead = isWon || mistakes >= 1;
  const showBody = isWon || mistakes >= 2;
  const showLeftArm = isWon || mistakes >= 3;
  const showRightArm = isWon || mistakes >= 4;
  const showLeftLeg = isWon || mistakes >= 5;
  const showRightLeg = isWon || mistakes >= 6;

  // Crowd animation states based on emotion
  const crowdY = emotion === 'victorious' ? [0, -20, 0] : emotion === 'happy' ? [0, -5, 0] : emotion === 'hurt' ? [0, 2, 0] : 0;
  const crowdArms = emotion === 'victorious' ? -25 : emotion === 'happy' ? -10 : emotion === 'hurt' ? -15 : emotion === 'dead' ? 20 : 0;
  const crowdColor = emotion === 'victorious' || emotion === 'happy' ? "#0f0" : emotion === 'dead' ? "#f00" : emotion === 'hurt' ? "#ff0" : "#0ff";
  const crowdFilter = emotion === 'victorious' || emotion === 'happy' ? "url(#neon-green)" : emotion === 'dead' ? "url(#neon-red)" : emotion === 'hurt' ? "url(#neon-yellow)" : "url(#neon-cyan)";

  // Generate crowd members with varied properties
  const crowdMembers = useMemo(() => {
    return [
      { cx: 40, scale: 0.8, delay: 0.1, color: '#0ff', type: 'normal' },
      { cx: 70, scale: 1.1, delay: 0.3, color: '#f0f', type: 'glasses' },
      { cx: 100, scale: 0.9, delay: 0.2, color: '#0ff', type: 'hat' },
      { cx: 130, scale: 1.0, delay: 0.5, color: '#0f0', type: 'normal' },
      { cx: 230, scale: 0.85, delay: 0.4, color: '#f0f', type: 'glasses' },
      { cx: 260, scale: 1.15, delay: 0.1, color: '#0ff', type: 'hat' },
      { cx: 290, scale: 0.95, delay: 0.6, color: '#0f0', type: 'normal' },
    ];
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full max-w-[220px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-[400px] xl:max-w-[450px] drop-shadow-[0_0_15px_rgba(0,255,255,0.3)]"
      >
        <defs>
          <filter id="neon-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="neon-red" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="neon-pink" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="neon-green" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="neon-yellow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Base Platform */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <line x1="20" y1="280" x2="280" y2="280" stroke="#b026ff" strokeWidth="6" strokeLinecap="round" filter="url(#neon-pink)" />
          <line x1="40" y1="290" x2="260" y2="290" stroke="#b026ff" strokeWidth="2" strokeLinecap="round" filter="url(#neon-pink)" opacity="0.5" />
        </motion.g>

        {/* Main Pillar */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <line x1="80" y1="280" x2="80" y2="40" stroke="#b026ff" strokeWidth="8" strokeLinecap="round" filter="url(#neon-pink)" />
          <line x1="80" y1="280" x2="80" y2="40" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </motion.g>

        {/* Top Arm */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <line x1="76" y1="40" x2="200" y2="40" stroke="#00f3ff" strokeWidth="8" strokeLinecap="round" filter="url(#neon-cyan)" />
          <line x1="80" y1="80" x2="120" y2="40" stroke="#00f3ff" strokeWidth="4" strokeLinecap="round" filter="url(#neon-cyan)" opacity="0.7" />
        </motion.g>

        {/* Laser Tether */}
        <AnimatePresence>
          {showRope && (
            <motion.line
              key="rope"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              x1="200" y1="40" x2="200" y2="80"
              stroke={emotion === 'hurt' ? "#f00" : "#f0f"} strokeWidth="4" strokeDasharray="4 4"
              filter={emotion === 'hurt' ? "url(#neon-red)" : "url(#neon-pink)"}
            />
          )}
        </AnimatePresence>

        {/* Hangman Character */}
        <motion.g
          animate={
            isWon ? { y: 50, x: 0, rotate: 0 } :
              emotion === 'hurt' ? { rotate: [0, 10, -10, 8, -8, 0], transition: { duration: 0.5 } } :
                isDead ? { rotate: [0, 8, -8, 5, -5, 0], transition: { duration: 2.5, ease: "easeInOut" } } :
                  { rotate: [-2, 2], transition: { repeat: Infinity, repeatType: 'reverse', duration: 2, ease: "easeInOut" } }
          }
          style={{ originX: '200px', originY: '40px' }}
        >
          {/* Head */}
          <AnimatePresence>
            {showHead && (
              <motion.g
                key="head"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ originX: '200px', originY: '100px' }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                <circle cx="200" cy="100" r="22" fill={emotion === 'dead' ? "#ff4444" : emotion === 'hurt' ? "#ffaa00" : emotion === 'victorious' || emotion === 'happy' ? "#44ff44" : "#00ffff"} stroke="#fff" strokeWidth="3" filter={emotion === 'dead' ? "url(#neon-red)" : emotion === 'hurt' ? "url(#neon-yellow)" : emotion === 'victorious' || emotion === 'happy' ? "url(#neon-green)" : "url(#neon-cyan)"} />

                {/* Face Expressions */}
                {emotion === 'dead' ? (
                  <>
                    <path d="M 188 92 L 196 100 M 196 92 L 188 100" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 204 92 L 212 100 M 212 92 L 204 100" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 192 112 Q 200 104 208 112" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </>
                ) : emotion === 'hurt' ? (
                  <>
                    <path d="M 188 92 L 196 98 M 196 92 L 188 98" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 204 92 L 212 98 M 212 92 L 204 98" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="200" cy="110" r="4" fill="#000" />
                  </>
                ) : emotion === 'victorious' || emotion === 'happy' ? (
                  <>
                    <path d="M 188 96 Q 192 90 196 96" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M 204 96 Q 208 90 212 96" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M 190 106 Q 200 118 210 106" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <circle cx="192" cy="96" r="2.5" fill="#000" />
                    <circle cx="208" cy="96" r="2.5" fill="#000" />
                    <path d="M 194 108 Q 200 110 206 108" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </>
                )}
              </motion.g>
            )}
          </AnimatePresence>

          {/* Torso */}
          <AnimatePresence>
            {showBody && (
              <motion.line
                key="body"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                x1="200" y1="122" x2="200" y2="180"
                stroke={emotion === 'dead' ? "#f00" : emotion === 'hurt' ? "#ff0" : emotion === 'victorious' || emotion === 'happy' ? "#0f0" : "#0ff"} strokeWidth="6" strokeLinecap="round"
                filter={emotion === 'dead' ? "url(#neon-red)" : emotion === 'hurt' ? "url(#neon-yellow)" : emotion === 'victorious' || emotion === 'happy' ? "url(#neon-green)" : "url(#neon-cyan)"}
              />
            )}
          </AnimatePresence>

          {/* Arms */}
          <AnimatePresence>
            {showLeftArm && (
              <motion.line
                key="left-arm"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={
                  isWon ? { opacity: 1, pathLength: 1, y2: 100, x2: 150 } :
                    emotion === 'hurt' ? { opacity: 1, pathLength: 1, y2: 120, x2: 170 } :
                      isDead ? { opacity: 1, pathLength: 1, y2: 180, x2: 190 } :
                        { opacity: 1, pathLength: 1, y2: 170, x2: 160 }
                }
                x1="200" y1="130" x2="160" y2="170"
                stroke={emotion === 'dead' ? "#f00" : emotion === 'hurt' ? "#ff0" : emotion === 'victorious' || emotion === 'happy' ? "#0f0" : "#0ff"} strokeWidth="6" strokeLinecap="round"
                filter={emotion === 'dead' ? "url(#neon-red)" : emotion === 'hurt' ? "url(#neon-yellow)" : emotion === 'victorious' || emotion === 'happy' ? "url(#neon-green)" : "url(#neon-cyan)"}
              />
            )}
            {showRightArm && (
              <motion.line
                key="right-arm"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={
                  isWon ? { opacity: 1, pathLength: 1, y2: 100, x2: 250 } :
                    emotion === 'hurt' ? { opacity: 1, pathLength: 1, y2: 120, x2: 230 } :
                      isDead ? { opacity: 1, pathLength: 1, y2: 180, x2: 210 } :
                        { opacity: 1, pathLength: 1, y2: 170, x2: 240 }
                }
                x1="200" y1="130" x2="240" y2="170"
                stroke={emotion === 'dead' ? "#f00" : emotion === 'hurt' ? "#ff0" : emotion === 'victorious' || emotion === 'happy' ? "#0f0" : "#0ff"} strokeWidth="6" strokeLinecap="round"
                filter={emotion === 'dead' ? "url(#neon-red)" : emotion === 'hurt' ? "url(#neon-yellow)" : emotion === 'victorious' || emotion === 'happy' ? "url(#neon-green)" : "url(#neon-cyan)"}
              />
            )}
          </AnimatePresence>

          {/* Legs */}
          <AnimatePresence>
            {showLeftLeg && (
              <motion.line
                key="left-leg"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={
                  isWon ? { opacity: 1, pathLength: 1, y2: 220, x2: 170 } :
                    emotion === 'hurt' ? { opacity: 1, pathLength: 1, y2: 210, x2: 180 } :
                      isDead ? { opacity: 1, pathLength: 1, y2: 240, x2: 195 } :
                        { opacity: 1, pathLength: 1, y2: 230, x2: 160 }
                }
                x1="200" y1="180" x2="160" y2="230"
                stroke={emotion === 'dead' ? "#f00" : emotion === 'hurt' ? "#ff0" : emotion === 'victorious' || emotion === 'happy' ? "#0f0" : "#0ff"} strokeWidth="6" strokeLinecap="round"
                filter={emotion === 'dead' ? "url(#neon-red)" : emotion === 'hurt' ? "url(#neon-yellow)" : emotion === 'victorious' || emotion === 'happy' ? "url(#neon-green)" : "url(#neon-cyan)"}
              />
            )}
            {showRightLeg && (
              <motion.line
                key="right-leg"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={
                  isWon ? { opacity: 1, pathLength: 1, y2: 220, x2: 230 } :
                    emotion === 'hurt' ? { opacity: 1, pathLength: 1, y2: 210, x2: 220 } :
                      isDead ? { opacity: 1, pathLength: 1, y2: 240, x2: 205 } :
                        { opacity: 1, pathLength: 1, y2: 230, x2: 240 }
                }
                x1="200" y1="180" x2="240" y2="230"
                stroke={emotion === 'dead' ? "#f00" : emotion === 'hurt' ? "#ff0" : emotion === 'victorious' || emotion === 'happy' ? "#0f0" : "#0ff"} strokeWidth="6" strokeLinecap="round"
                filter={emotion === 'dead' ? "url(#neon-red)" : emotion === 'hurt' ? "url(#neon-yellow)" : emotion === 'victorious' || emotion === 'happy' ? "url(#neon-green)" : "url(#neon-cyan)"}
              />
            )}
          </AnimatePresence>
        </motion.g>

        {/* Crowd */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {crowdMembers.map((member, i) => (
            <motion.g
              key={i}
              animate={{ y: crowdY }}
              transition={{
                repeat: emotion === 'victorious' || emotion === 'happy' || emotion === 'hurt' ? Infinity : 0,
                duration: emotion === 'hurt' ? 0.1 : 0.3 + (i % 3) * 0.1,
                delay: member.delay,
                repeatType: "reverse"
              }}
              style={{ transformOrigin: `${member.cx}px 280px`, transform: `scale(${member.scale})` }}
            >
              {/* Accessories */}
              {member.type === 'hat' && (
                <path d={`M ${member.cx - 12} 235 L ${member.cx + 12} 235 L ${member.cx + 8} 228 L ${member.cx - 8} 228 Z`} fill={emotion === 'dead' ? "#444" : member.color} filter={crowdFilter} />
              )}

              {/* Cartoon Head */}
              <circle cx={member.cx} cy="245" r="10" fill={emotion === 'victorious' || emotion === 'happy' ? "#44ff44" : emotion === 'dead' ? "#444" : emotion === 'hurt' ? "#ffaa00" : member.color} stroke="#fff" strokeWidth="1.5" filter={crowdFilter} />

              {/* Glasses */}
              {member.type === 'glasses' && (
                <g>
                  <rect x={member.cx - 8} y={240} width="6" height="4" fill="#000" />
                  <rect x={member.cx + 2} y={240} width="6" height="4" fill="#000" />
                  <line x1={member.cx - 2} y1={242} x2={member.cx + 2} y2={242} stroke="#000" strokeWidth="1" />
                </g>
              )}

              {/* Faces */}
              {emotion === 'victorious' || emotion === 'happy' ? (
                <>
                  {member.type !== 'glasses' && (
                    <>
                      <path d={`M ${member.cx - 4} 242 Q ${member.cx - 2} 239 ${member.cx} 242`} stroke="#000" strokeWidth="1.5" fill="none" />
                      <path d={`M ${member.cx + 1} 242 Q ${member.cx + 3} 239 ${member.cx + 5} 242`} stroke="#000" strokeWidth="1.5" fill="none" />
                    </>
                  )}
                  <path d={`M ${member.cx - 4} 247 Q ${member.cx} 253 ${member.cx + 4} 247`} stroke="#000" strokeWidth="1.5" fill="none" />
                </>
              ) : emotion === 'dead' ? (
                <>
                  {member.type !== 'glasses' && (
                    <>
                      <circle cx={member.cx - 3} cy="243" r="1.5" fill="#000" />
                      <circle cx={member.cx + 3} cy="243" r="1.5" fill="#000" />
                    </>
                  )}
                  <path d={`M ${member.cx - 3} 250 Q ${member.cx} 246 ${member.cx + 3} 250`} stroke="#000" strokeWidth="1.5" fill="none" />
                </>
              ) : emotion === 'hurt' ? (
                <>
                  {member.type !== 'glasses' && (
                    <>
                      <circle cx={member.cx - 3} cy="243" r="2" fill="#000" />
                      <circle cx={member.cx + 3} cy="243" r="2" fill="#000" />
                    </>
                  )}
                  <circle cx={member.cx} cy="249" r="2.5" fill="#000" />
                </>
              ) : (
                <>
                  {member.type !== 'glasses' && (
                    <>
                      <circle cx={member.cx - 3} cy="243" r="1.5" fill="#000" />
                      <circle cx={member.cx + 3} cy="243" r="1.5" fill="#000" />
                    </>
                  )}
                  <path d={`M ${member.cx - 3} 248 Q ${member.cx} 250 ${member.cx + 3} 248`} stroke="#000" strokeWidth="1.5" fill="none" />
                </>
              )}

              {/* Body */}
              <line x1={member.cx} y1="255" x2={member.cx} y2="270" stroke={emotion === 'victorious' || emotion === 'happy' ? "#44ff44" : emotion === 'dead' ? "#444" : emotion === 'hurt' ? "#ffaa00" : member.color} strokeWidth="3" filter={crowdFilter} strokeLinecap="round" />

              {/* Arms */}
              <motion.line
                animate={emotion === 'hurt' ? { y2: 245, x2: member.cx - 10 } : { y2: 262 + crowdArms, x2: member.cx - 10 }}
                x1={member.cx} y1="260" x2={member.cx - 10} y2="262"
                stroke={emotion === 'victorious' || emotion === 'happy' ? "#44ff44" : emotion === 'dead' ? "#444" : emotion === 'hurt' ? "#ffaa00" : member.color} strokeWidth="2.5" filter={crowdFilter} strokeLinecap="round"
              />
              <motion.line
                animate={emotion === 'hurt' ? { y2: 245, x2: member.cx + 10 } : { y2: 262 + crowdArms, x2: member.cx + 10 }}
                x1={member.cx} y1="260" x2={member.cx + 10} y2="262"
                stroke={emotion === 'victorious' || emotion === 'happy' ? "#44ff44" : emotion === 'dead' ? "#444" : emotion === 'hurt' ? "#ffaa00" : member.color} strokeWidth="2.5" filter={crowdFilter} strokeLinecap="round"
              />

              {/* Legs */}
              <line x1={member.cx} y1="270" x2={member.cx - 6} y2="282" stroke={emotion === 'victorious' || emotion === 'happy' ? "#44ff44" : emotion === 'dead' ? "#444" : emotion === 'hurt' ? "#ffaa00" : member.color} strokeWidth="2.5" filter={crowdFilter} strokeLinecap="round" />
              <line x1={member.cx} y1="270" x2={member.cx + 6} y2="282" stroke={emotion === 'victorious' || emotion === 'happy' ? "#44ff44" : emotion === 'dead' ? "#444" : emotion === 'hurt' ? "#ffaa00" : member.color} strokeWidth="2.5" filter={crowdFilter} strokeLinecap="round" />

              {/* Tears for lost state */}
              {emotion === 'dead' && (
                <motion.g
                  animate={{ y: [0, 8, 15], opacity: [1, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: member.delay * 2 }}
                >
                  <circle cx={member.cx - 4} cy="245" r="1.5" fill="#0ff" />
                  <circle cx={member.cx + 4} cy="245" r="1.5" fill="#0ff" />
                </motion.g>
              )}
            </motion.g>
          ))}
        </motion.g>

        {/* Game Over Overlay */}
        <AnimatePresence>
          {isDead && (
            <motion.g
              key="game-over-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <text x="150" y="150" fill="#f00" fontSize="48" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" filter="url(#neon-red)" className="animate-pulse" style={{ transform: 'rotate(-10deg)', transformOrigin: '150px 150px' }}>
                GAME OVER
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* System Restored Overlay */}
        <AnimatePresence>
          {isWon && (
            <motion.g
              key="you-saved-him-text"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <text x="150" y="150" fill="#0f0" fontSize="40" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" filter="url(#neon-green)" className="animate-pulse" style={{ transform: 'rotate(-10deg)', transformOrigin: '150px 150px' }}>
                YOU SAVED HIM!
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
