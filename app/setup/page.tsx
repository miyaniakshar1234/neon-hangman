'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore, Category, Difficulty } from '@/store/gameStore';
import { motion, AnimatePresence } from 'motion/react';
import { Monitor, Cat, Globe2, Film, FlaskConical, Zap, ShieldAlert, Skull, BookOpen, Gamepad2, History, Tv, Pizza, ArrowLeft, Crosshair, Fingerprint, Activity, Music, Trophy, Library, Rocket, Wand2, Palette, Leaf, Briefcase, HeartPulse, Landmark } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { useAudio } from '@/hooks/useAudio';

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'technology', label: 'Tech Core', icon: <Monitor className="w-6 h-6" />, color: 'from-blue-500 to-cyan-400' },
  { id: 'science', label: 'Quantum', icon: <FlaskConical className="w-6 h-6" />, color: 'from-indigo-500 to-blue-400' },
  { id: 'gaming', label: 'Simulations', icon: <Gamepad2 className="w-6 h-6" />, color: 'from-rose-500 to-pink-500' },
  { id: 'movies', label: 'Cinematics', icon: <Film className="w-6 h-6" />, color: 'from-purple-500 to-fuchsia-400' },
  { id: 'animals', label: 'Bio-Forms', icon: <Cat className="w-6 h-6" />, color: 'from-orange-500 to-amber-400' },
  { id: 'geography', label: 'Territories', icon: <Globe2 className="w-6 h-6" />, color: 'from-emerald-500 to-teal-400' },
  { id: 'history', label: 'Archives', icon: <History className="w-6 h-6" />, color: 'from-stone-400 to-neutral-400' },
  { id: 'mythology', label: 'Lore', icon: <BookOpen className="w-6 h-6" />, color: 'from-yellow-500 to-orange-400' },
  { id: 'anime', label: 'Neo-Tokyo', icon: <Tv className="w-6 h-6" />, color: 'from-fuchsia-600 to-purple-500' },
  { id: 'food', label: 'Rations', icon: <Pizza className="w-6 h-6" />, color: 'from-lime-500 to-emerald-400' },
  { id: 'music', label: 'Frequencies', icon: <Music className="w-6 h-6" />, color: 'from-pink-500 to-rose-400' },
  { id: 'sports', label: 'Athletics', icon: <Trophy className="w-6 h-6" />, color: 'from-yellow-400 to-yellow-600' },
  { id: 'literature', label: 'Manuscripts', icon: <Library className="w-6 h-6" />, color: 'from-amber-600 to-orange-800' },
  { id: 'space', label: 'Cosmos', icon: <Rocket className="w-6 h-6" />, color: 'from-slate-800 to-indigo-900' },
  { id: 'magic', label: 'Arcane', icon: <Wand2 className="w-6 h-6" />, color: 'from-violet-600 to-fuchsia-700' },
  { id: 'art', label: 'Aesthetics', icon: <Palette className="w-6 h-6" />, color: 'from-red-400 to-orange-400' },
  { id: 'nature', label: 'Ecosystems', icon: <Leaf className="w-6 h-6" />, color: 'from-green-500 to-emerald-700' },
  { id: 'business', label: 'Commerce', icon: <Briefcase className="w-6 h-6" />, color: 'from-slate-500 to-slate-700' },
  { id: 'medicine', label: 'Biotech', icon: <HeartPulse className="w-6 h-6" />, color: 'from-red-500 to-rose-600' },
  { id: 'politics', label: 'Governance', icon: <Landmark className="w-6 h-6" />, color: 'from-blue-700 to-indigo-800' }
];

const DIFFICULTIES: { id: Difficulty; label: string; highlight: string; desc: string; icon: React.ReactNode }[] = [
  { id: 'noob', label: 'Recruit', highlight: 'text-green-400', desc: 'Maximum tolerance (8 mistakes)', icon: <Activity className="w-5 h-5 text-green-400" /> },
  { id: 'casual', label: 'Operative', highlight: 'text-emerald-400', desc: 'Standard tolerance (7 mistakes)', icon: <Zap className="w-5 h-5 text-emerald-400" /> },
  { id: 'pro', label: 'Specialist', highlight: 'text-yellow-400', desc: 'Low tolerance (6 mistakes)', icon: <ShieldAlert className="w-5 h-5 text-yellow-400" /> },
  { id: 'veteran', label: 'Veteran', highlight: 'text-orange-500', desc: 'Critical tolerance (5 mistakes)', icon: <Crosshair className="w-5 h-5 text-orange-500" /> },
  { id: 'godlike', label: 'Nightmare', highlight: 'text-red-500', desc: 'Zero tolerance (4 mistakes)', icon: <Skull className="w-5 h-5 text-red-500" /> },
];

export default function SetupPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const startGame = useGameStore(state => state.startGame);
  const { playHover, playClick } = useAudio();

  const [category, setCategory] = useState<Category>('technology');
  const [difficulty, setDifficulty] = useState<Difficulty>('pro');
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleStart = () => {
    setIsInitializing(true);
    setTimeout(() => {
      startGame(category, difficulty);
      router.push('/game');
    }, 800);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-neon-cyan/50 animate-pulse bg-dark-bg">
        <div className="flex flex-col items-center gap-4">
          <Fingerprint className="w-12 h-12" />
          <span>Verifying Clearance...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-transparent text-white overflow-hidden relative selection:bg-neon-cyan/30">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl space-y-8 z-10"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
          <Link href="/" className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors" onMouseEnter={playHover} onClick={playClick}>
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors border border-white/10 group-hover:border-neon-cyan/50">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="font-mono uppercase tracking-widest text-xs group-hover:text-neon-cyan transition-colors">Abort Mission</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-mono text-neon-cyan mb-1 uppercase tracking-widest">Active Agent</div>
              <div className="font-bold tracking-wider">{user.displayName || 'GUEST-001'}</div>
            </div>
            {user.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-12 h-12 rounded-lg border border-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.2)] object-cover bg-black/50" />
            ) : (
              <div className="w-12 h-12 rounded-lg border border-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.2)] bg-neon-cyan/10 flex items-center justify-center">
                <Fingerprint className="w-6 h-6 text-neon-cyan" />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* Main Left Panel - Category Selection */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-6 bg-neon-purple rounded-sm shadow-[0_0_10px_#b026ff]" />
              <h2 className="text-2xl font-black uppercase tracking-widest">Target Database</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onMouseEnter={playHover}
                    onClick={() => { playClick(); setCategory(cat.id); }}
                    className={`group relative h-24 sm:h-32 rounded-xl sm:rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-2 sm:gap-3 overflow-hidden ${isSelected
                      ? 'bg-white/10 border-2 border-white'
                      : 'glass-panel-interactive border-white/5'
                      }`}
                  >
                    {/* Background glow for selected state */}
                    {isSelected && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-20`} />
                    )}

                    {/* Hover effect for unselected */}
                    {!isSelected && (
                      <div className={`absolute -bottom-10 -right-10 w-20 h-20 bg-gradient-to-tl ${cat.color} blur-[20px] opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                    )}

                    <div className={`z-10 p-3 rounded-xl transition-colors duration-300 ${isSelected ? 'bg-white text-black' : 'bg-black/40 text-gray-300 group-hover:text-white'}`}>
                      {cat.icon}
                    </div>

                    <span className={`z-10 font-bold text-xs sm:text-sm uppercase tracking-widest transition-colors ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                      {cat.label}
                    </span>

                    {/* Active Indicator Line */}
                    {isSelected && (
                      <motion.div layoutId="cat-indicator" className={`absolute bottom-0 left-0 h-1 z-20 w-full bg-gradient-to-r ${cat.color} shadow-[0_0_10px_currentColor]`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel - Difficulty & Start */}
          <div className="lg:col-span-4 flex flex-col h-full gap-8">
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-neon-pink rounded-sm shadow-[0_0_10px_#ff00ea]" />
                <h2 className="text-2xl font-black uppercase tracking-widest">Threat Level</h2>
              </div>

              <div className="flex flex-col gap-3">
                {DIFFICULTIES.map((diff) => {
                  const isSelected = difficulty === diff.id;
                  return (
                    <button
                      key={diff.id}
                      onMouseEnter={playHover}
                      onClick={() => { playClick(); setDifficulty(diff.id); }}
                      className={`group relative p-4 rounded-2xl transition-all duration-300 flex items-center justify-between overflow-hidden ${isSelected
                        ? 'bg-white/10 border-2 border-white'
                        : 'glass-panel-interactive border-white/5'
                        }`}
                    >
                      {/* Subdued background matching highlight color when selected */}
                      {isSelected && (
                        <div className={`absolute inset-0 opacity-10 ${diff.highlight.replace('text-', 'bg-')}`} />
                      )}

                      <div className="flex items-center gap-4 z-10 w-full">
                        <div className={`p-2 rounded-lg transition-colors ${isSelected ? 'bg-white/20' : 'bg-black/40'}`}>
                          {diff.icon}
                        </div>
                        <div className="flex flex-col items-start flex-1">
                          <span className={`font-bold uppercase tracking-widest text-sm transition-colors ${isSelected ? diff.highlight : 'text-gray-300'}`}>
                            {diff.label}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wide mt-1">
                            {diff.desc}
                          </span>
                        </div>

                        {/* Selected Radio Indicator */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-white' : 'border-gray-600'}`}>
                          {isSelected && <motion.div layoutId="diff-radio" className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Launch Button Container - Sticks to bottom of panel */}
            <div className="relative mt-auto pt-6 border-t border-white/10">
              <AnimatePresence>
                {isInitializing && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-0 left-0 w-full h-1 bg-neon-cyan shadow-[0_0_15px_#00f3ff] origin-left"
                    transition={{ duration: 0.8, ease: "linear" }}
                  />
                )}
              </AnimatePresence>

              <button
                onMouseEnter={playHover}
                onClick={() => { playClick(); handleStart(); }}
                disabled={isInitializing}
                className="btn-premium w-full py-5 rounded-2xl text-lg flex items-center justify-center gap-3 overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {isInitializing ? (
                  <>
                    <Fingerprint className="w-6 h-6 animate-pulse" />
                    Initializing Simulation...
                  </>
                ) : (
                  <>
                    <Activity className="w-6 h-6" />
                    Commence Decryption
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
