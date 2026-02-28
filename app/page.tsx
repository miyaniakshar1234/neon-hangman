'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Trophy, LogOut, LogIn, User, Sparkles, Lock, Crosshair, CheckCircle2, Layers } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'framer-motion';
import AuthModal from '@/components/AuthModal';
import { useAudio } from '@/hooks/useAudio';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { playHover, playClick } = useAudio();
  const { startDailyChallenge } = useGameStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hasPlayedDaily, setHasPlayedDaily] = useState<boolean | null>(null);

  // Floating particles gen
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        size: Math.random() * 4 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  // Check if player has already completed today's challenge
  useEffect(() => {
    async function checkDaily() {
      if (!user || !db) return;
      const now = new Date();
      // Find start of UTC day
      const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

      try {
        const q = query(
          collection(db, 'game_sessions'),
          where('user_id', '==', user.uid),
          where('isDaily', '==', true),
          where('timestamp', '>=', startOfDay)
        );
        const snapshot = await getDocs(q);
        setHasPlayedDaily(!snapshot.empty);
      } catch (err) {
        console.error("Failed to check daily status", err);
        setHasPlayedDaily(false);
      }
    }

    if (user) {
      checkDaily();
    } else {
      setHasPlayedDaily(null);
    }
  }, [user]);

  const handleStartDaily = () => {
    if (hasPlayedDaily) return;
    playClick();
    startDailyChallenge();
    router.push('/game');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-transparent selection:bg-neon-cyan/30 selection:text-neon-cyan text-white">
      {/* Dynamic Background Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20 blur-[1px] pointer-events-none"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Header / Auth */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-6 right-6 lg:right-12 z-50 glass-panel rounded-full px-4 py-2"
      >
        {!authLoading && (
          user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Link href="/profile" className="relative group cursor-pointer" onMouseEnter={playHover} onClick={playClick}>
                  {user.photoURL ? (
                    <Image src={user.photoURL} alt="Avatar" width={44} height={44} className="rounded-full border-2 border-neon-cyan/50 group-hover:border-neon-cyan transition-colors shadow-[0_0_15px_rgba(0,243,255,0.3)] object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-11 h-11 rounded-full border-2 border-neon-cyan/50 group-hover:border-neon-cyan bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.3)] backdrop-blur-md transition-colors">
                      <span className="font-bold text-lg text-neon-cyan">{user.displayName?.charAt(0).toUpperCase() || 'A'}</span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-neon-green rounded-full border-2 border-dark-bg shadow-[0_0_8px_#00ff66]" />
                </Link>
                <div className="hidden md:flex flex-col">
                  <span className="text-sm font-bold tracking-wider text-white truncate max-w-[120px]">{user.displayName || 'Agent'}</span>
                  <span className="text-[10px] text-neon-cyan font-mono uppercase tracking-widest">Online</span>
                </div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <button
                onClick={logout}
                className="p-2 rounded-full hover:bg-red-500/20 transition-colors text-gray-400 hover:text-red-400 group"
                title="Disconnect"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          ) : (
            <button
              onMouseEnter={playHover}
              onClick={() => {
                playClick();
                setIsAuthModalOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-bold tracking-widest text-sm uppercase text-white hover:text-neon-cyan hover:border-neon-cyan/50 hover:shadow-[0_0_15px_rgba(0,243,255,0.2)]"
            >
              <LogIn className="w-4 h-4" />
              Initialize Link
            </button>
          )
        )}
      </motion.div>

      {/* Hero Content */}
      <div className="z-10 flex flex-col items-center max-w-4xl w-full text-center space-y-16">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className="space-y-6 relative"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple text-xs font-mono uppercase tracking-widest mb-2 shadow-[0_0_15px_rgba(176,38,255,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            System v5.0 - Ultimate Edition
          </motion.div>

          <div className="relative group cursor-default perspective-1000">
            <motion.div
              whileHover={{ rotateX: 5, rotateY: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative preserve-3d"
            >
              {/* Main Text */}
              <h1 className="text-7xl sm:text-8xl md:text-[10rem] font-black tracking-tighter uppercase leading-none relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-2xl">
                HANG<span className="text-transparent bg-clip-text bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink">MAN</span>
              </h1>

              {/* Insane Glow Behind */}
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink opacity-30 blur-[80px] -z-10 rounded-full animate-pulse-glow" />

              {/* Glitch Layers */}
              <h1 className="text-7xl sm:text-8xl md:text-[10rem] font-black tracking-tighter uppercase leading-none text-neon-pink absolute top-0 -left-[4px] -z-10 opacity-0 group-hover:opacity-70 mix-blend-screen transition-opacity duration-300">
                HANGMAN
              </h1>
              <h1 className="text-7xl sm:text-8xl md:text-[10rem] font-black tracking-tighter uppercase leading-none text-neon-cyan absolute top-0 left-[4px] -z-10 opacity-0 group-hover:opacity-70 mix-blend-screen transition-opacity duration-300">
                HANGMAN
              </h1>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-gray-300 text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed backdrop-blur-sm"
          >
            A lexical combat simulation. Decrypt the sequence. Avoid termination. Experience the ultimate word challenge.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl px-4"
        >
          {user ? (
            <>
              {/* Daily Challenge Button */}
              <button
                onMouseEnter={playHover}
                onClick={handleStartDaily}
                disabled={hasPlayedDaily === true || hasPlayedDaily === null}
                className={`col-span-1 md:col-span-2 w-full text-left ${hasPlayedDaily ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`glass-panel-interactive h-full rounded-2xl p-6 flex items-center justify-between group relative overflow-hidden transition-all ${hasPlayedDaily ? 'border-green-500/30 bg-green-900/10' : 'border-neon-pink/30 hover:border-neon-pink/80 bg-neon-pink/5 hover:bg-neon-pink/10 shadow-[0_0_20px_rgba(255,42,133,0.1)] hover:shadow-[0_0_30px_rgba(255,42,133,0.3)]'
                  }`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-neon-pink/10 blur-[50px] rounded-full group-hover:bg-neon-pink/20 transition-colors" />

                  <div className="flex flex-col gap-2 z-10 relative">
                    <div className="flex items-center gap-2">
                      <Crosshair className={`w-5 h-5 ${hasPlayedDaily ? 'text-green-400' : 'text-neon-pink animate-pulse'}`} />
                      <span className="font-mono text-xs uppercase tracking-widest text-gray-400">Global Synchronized</span>
                    </div>
                    <span className="font-black text-2xl tracking-wider uppercase text-white">Daily Mission</span>
                    <span className="text-sm text-gray-400">
                      {hasPlayedDaily === null ? 'Checking Status...' : hasPlayedDaily ? 'Transmission Completed' : 'One attempt. No retries.'}
                    </span>
                  </div>

                  <div className="z-10 relative">
                    {hasPlayedDaily ? (
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    ) : (
                      <div className="w-12 h-12 rounded-full border border-neon-pink/50 flex items-center justify-center group-hover:scale-110 transition-transform bg-black/50 backdrop-blur-sm">
                        <Play className="w-5 h-5 text-neon-pink fill-current translate-x-0.5" />
                      </div>
                    )}
                  </div>
                </div>
              </button>

              {/* Endless Mode Button */}
              <Link href="/setup" className="col-span-1 md:col-span-2 w-full" onMouseEnter={playHover} onClick={playClick}>
                <div className="glass-panel-interactive h-full rounded-2xl p-6 flex items-center justify-between group relative overflow-hidden border-neon-cyan/30 hover:border-neon-cyan/80 bg-neon-cyan/5 hover:bg-neon-cyan/10 shadow-[0_0_20px_rgba(0,243,255,0.1)] hover:shadow-[0_0_30px_rgba(0,243,255,0.3)] transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/10 blur-[50px] rounded-full group-hover:bg-neon-cyan/20 transition-colors" />

                  <div className="flex flex-col gap-2 z-10 relative">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-neon-cyan" />
                      <span className="font-mono text-xs uppercase tracking-widest text-gray-400">Standard Operations</span>
                    </div>
                    <span className="font-black text-2xl tracking-wider uppercase text-white">Endless Run</span>
                    <span className="text-sm text-gray-400">Progress through increasing difficulty</span>
                  </div>

                  <div className="z-10 relative">
                    <div className="w-12 h-12 rounded-full border border-neon-cyan/50 flex items-center justify-center group-hover:scale-110 transition-transform bg-black/50 backdrop-blur-sm">
                      <Play className="w-5 h-5 text-neon-cyan fill-current translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </>
          ) : (
            <button onMouseEnter={playHover} onClick={() => { playClick(); setIsAuthModalOpen(true); }} className="col-span-1 md:col-span-2 lg:col-span-4 w-full max-w-xl mx-auto">
              <div className="glass-panel-interactive h-full rounded-2xl p-8 flex flex-col items-center justify-center gap-4 group relative overflow-hidden bg-white/5 hover:bg-white/10 border-white/20">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/20 to-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(255,255,255,0.5)] z-10">
                  <Lock className="w-7 h-7" />
                </div>
                <div className="flex flex-col items-center gap-2 z-10 text-center">
                  <span className="font-bold text-2xl tracking-widest uppercase group-hover:text-neon-pink transition-colors">Authenticate</span>
                  <span className="text-gray-400">Log in to access Daily Missions and Leaderboards</span>
                </div>
              </div>
            </button>
          )}

          <Link href="/leaderboard" className="col-span-1 md:col-span-1 lg:col-span-2 w-full" onMouseEnter={playHover} onClick={playClick}>
            <div className="glass-panel-interactive h-full rounded-2xl px-6 py-4 flex items-center gap-4 group relative overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-neon-yellow/10 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Trophy className="w-6 h-6 text-neon-yellow" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-widest uppercase text-white group-hover:text-neon-yellow transition-colors">Rankings</span>
                <span className="text-xs text-gray-400">Global Leaderboard</span>
              </div>
            </div>
          </Link>

          <Link href="/profile" className="col-span-1 md:col-span-1 lg:col-span-2 w-full" onMouseEnter={playHover} onClick={playClick}>
            <div className="glass-panel-interactive h-full rounded-2xl px-6 py-4 flex items-center gap-4 group relative overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-neon-green/10 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <User className="w-6 h-6 text-neon-green" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-widest uppercase text-white group-hover:text-neon-green transition-colors">Profile</span>
                <span className="text-xs text-gray-400">Career Metrics & Aura</span>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Grid Floor Effect */}
      <div className="absolute bottom-0 left-0 w-full h-[30vh] [perspective:1000px] pointer-events-none -z-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [transform:rotateX(75deg)] origin-bottom opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-dark-bg" />
      </div>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      )}
    </main>
  );
}
