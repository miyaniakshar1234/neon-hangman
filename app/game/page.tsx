'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { HangmanFigure } from '@/components/game/HangmanFigure';
import { WordDisplay } from '@/components/game/WordDisplay';
import { Keyboard } from '@/components/game/Keyboard';
import { GameHeader } from '@/components/game/GameHeader';
import { GameOverModal } from '@/components/game/GameOverModal';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, arrayUnion } from 'firebase/firestore';
import { useAudio } from '@/hooks/useAudio';
import { checkAchievements, Achievement } from '@/lib/achievements';
import { AchievementToast } from '@/components/AchievementToast';
import { getTier } from '@/lib/tiers';
import confetti from 'canvas-confetti';

export default function GamePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { status, word, category, difficulty, score, level, guessLetter, mistakes } = useGameStore();
  const { playWin, playLose, playCorrect, playWrong } = useAudio();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [currentToast, setCurrentToast] = useState<Achievement | null>(null);
  const toastQueue = useRef<Achievement[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (status !== 'playing') return;
    const key = e.key.toUpperCase();
    if (/^[A-Z]$/.test(key)) {
      if (word.includes(key)) {
        playCorrect();
      } else {
        playWrong();
      }
      guessLetter(key);
    }
  }, [status, guessLetter, word, playCorrect, playWrong]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const saveGameData = useCallback(async () => {
    if (!user || !db) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      // 1. Update User Profile
      const userRef = doc(db, 'profiles', user.uid);
      const userSnap = await getDoc(userRef);

      // Aura Points Calculation (hoisted so it's available for both branches and the session save)
      // Pull accumulated rewards safely from the store instead of gambling on final state
      let earnedAura = useGameStore.getState().sessionAura || 0;
      let earnedCoins = useGameStore.getState().sessionCoins || 0;
      let earnedHints = useGameStore.getState().sessionHints || 0;

      if (userSnap.exists()) {
        const profileData = userSnap.data();
        const currentUnlocks = profileData.unlockedAchievements || [];

        // Prepare mock stats for checking achievements before saving
        const mockProfileStats = {
          ...profileData,
          total_score: (profileData.total_score || 0) + score,
          games_played: (profileData.games_played || 0) + 1,
          games_won: (profileData.games_won || 0) + (status === 'won' ? 1 : 0),
        };

        const currentGameState = { status, word, category, difficulty, score, level, mistakes, maxMistakes: useGameStore.getState().maxMistakes, combo: useGameStore.getState().combo };
        const newUnlocks = checkAchievements(currentGameState, mockProfileStats, currentUnlocks);



        const updatePayload: any = {
          total_score: increment(score),
          aura_points: increment(earnedAura),
          coins: increment(earnedCoins),
          hints: increment(earnedHints),
          games_played: increment(1),
          games_won: increment(status === 'won' ? 1 : 0),
          username: user.displayName || 'Anonymous',
          email: user.email || '',
        };

        if (newUnlocks.length > 0) {
          updatePayload.unlockedAchievements = arrayUnion(...newUnlocks.map(a => a.id));

          // Queue toasts
          newUnlocks.forEach(ach => toastQueue.current.push(ach));
          if (!currentToast) {
            popNextToast();
          }
        }

        await updateDoc(userRef, updatePayload);
      } else {
        const currentGameState = { status, word, category, difficulty, score, level, mistakes, maxMistakes: useGameStore.getState().maxMistakes, combo: useGameStore.getState().combo };
        const mockProfileStats = { total_score: score, games_played: 1, games_won: status === 'won' ? 1 : 0 };
        const newUnlocks = checkAchievements(currentGameState, mockProfileStats, []);

        if (newUnlocks.length > 0) {
          newUnlocks.forEach(ach => toastQueue.current.push(ach));
          if (!currentToast) {
            popNextToast();
          }
        }



        await setDoc(userRef, {
          user_id: user.uid,
          username: user.displayName || 'Anonymous',
          email: user.email || '',
          total_score: score,
          aura_points: earnedAura,
          coins: earnedCoins,
          hints: 5 + earnedHints, // Give 5 starter hints to new profiles
          games_played: 1,
          games_won: status === 'won' ? 1 : 0,
          createdAt: new Date(),
          unlockedAchievements: newUnlocks.map(a => a.id)
        });
      }

      // 2. Save Game Session
      await addDoc(collection(db, 'game_sessions'), {
        user_id: user.uid,
        username: user.displayName || 'Anonymous',
        email: user.email || '',
        word,
        category,
        difficulty,
        status,
        score,
        aura_earned: earnedAura || 0,
        coins_earned: earnedCoins || 0,
        hints_earned: earnedHints || 0,
        level,
        isDaily: useGameStore.getState().isDaily || false,
        timestamp: new Date(),
      });

    } catch (error: any) {
      console.error('Failed to save score:', error);
      setSaveError(error.message || 'Failed to sync with server');
    } finally {
      setIsSaving(false);
    }
  }, [user, score, word, category, difficulty, status, level]);

  const popNextToast = useCallback(() => {
    if (toastQueue.current.length > 0) {
      const next = toastQueue.current.shift();
      if (next) setCurrentToast(next);
    } else {
      setCurrentToast(null);
    }
  }, []);

  useEffect(() => {
    // ONLY save when the game is completely lost (Game Over)
    // This prevents saving the score multiple times if they win multiple levels
    if (status === 'lost' && user && db && !isSaving) {
      saveGameData();
    }
  }, [status, user, isSaving, saveGameData]);

  const [showModal, setShowModal] = useState(false);
  const [shake, setShake] = useState(false);
  const prevMistakes = useRef(mistakes);

  useEffect(() => {
    if (mistakes > prevMistakes.current) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    prevMistakes.current = mistakes;
  }, [mistakes]);

  // Combo particle explosions
  const prevCombo = useRef(0);
  useEffect(() => {
    const currentCombo = useGameStore.getState().combo;
    if (currentCombo > prevCombo.current && currentCombo >= 3) {
      // Burst intensity scales with combo
      const intensity = currentCombo >= 8 ? 100 : currentCombo >= 5 ? 60 : 30;
      const colors = currentCombo >= 8 ? ['#ff00ea', '#b026ff', '#00f3ff'] : currentCombo >= 5 ? ['#00f3ff', '#00ff66'] : ['#fffb00', '#00f3ff'];
      confetti({
        particleCount: intensity,
        spread: 70,
        origin: { x: 0.5, y: 0.5 },
        colors,
        startVelocity: 25,
        ticks: 40,
        zIndex: 60,
      });
    }
    prevCombo.current = currentCombo;
  }, [score]); // score changes on correct guess which increments combo

  useEffect(() => {
    if (status === 'won') {
      playWin();
    } else if (status === 'lost') {
      playLose();
    }

    if (status === 'won' || status === 'lost') {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 5000); // 5 seconds delay
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [status, playWin, playLose]);

  // If there's no word, the game hasn't started properly
  useEffect(() => {
    if (!word && status === 'idle') {
      router.push('/setup');
    }
  }, [word, status, router]);

  if (loading || !user || !word) {
    return <div className="min-h-screen flex items-center justify-center font-mono text-neon-cyan animate-pulse">Loading...</div>;
  }

  return (
    <div className={`min-h-screen flex flex-col p-2 sm:p-4 md:p-6 relative overflow-hidden bg-transparent text-white selection:bg-neon-cyan/30 ${shake ? 'animate-shake' : ''}`}>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col h-full min-h-[calc(100vh-3rem)]">
        <GameHeader onSaveProgress={saveGameData} />

        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-8 lg:gap-12 xl:gap-20 my-4 sm:my-8">
          <div className="w-full lg:w-2/5 xl:w-[45%] flex justify-center lg:justify-end">
            <HangmanFigure />
          </div>

          <div className="w-full lg:w-3/5 xl:w-[55%] flex flex-col items-center gap-6 sm:gap-10 lg:gap-12 glass-panel p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
            <WordDisplay />
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <Keyboard />
          </div>
        </div>

        {showModal && <GameOverModal onSave={saveGameData} />}

        {/* Non-intrusive error if saving failed */}
        {saveError && (
          <div className="fixed bottom-4 right-4 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-xs font-mono z-50 backdrop-blur-md">
            Sync Error: {saveError} (Progress saved locally)
          </div>
        )}

        {/* Achievement Toast Overlay */}
        <AchievementToast
          achievement={currentToast}
          onClose={popNextToast}
        />
      </div>
    </div>
  );
}
