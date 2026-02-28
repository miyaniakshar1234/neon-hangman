'use client';

import { useEffect, useState } from 'react';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { ArrowLeft, User, History, Trophy, Star, Target, Calendar, Settings as SettingsIcon, Sparkles, Lock, Flame, Zap, BarChart3, Percent, TrendingUp, Coins, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { ACHIEVEMENTS } from '@/lib/achievements';
import { getTier } from '@/lib/tiers';

interface GameSession {
  id: string;
  word: string;
  category: string;
  difficulty: string;
  score: number;
  level: number;
  status?: string;
  aura_earned?: number;
  timestamp: any;
}

interface UserProfile {
  user_id: string;
  username: string;
  email: string;
  total_score: number;
  aura_points: number;
  games_played: number;
  games_won: number;
  coins?: number;
  hints?: number;
  createdAt: any;
  equipped_border?: string;
  unlockedAchievements?: string[];
  unlocked_items?: string[];
  equipped_sound?: string;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      if (!isFirebaseConfigured || !db) {
        setErrorMsg('Firebase is not configured.');
        setLoading(false);
        return;
      }

      try {
        // Fetch Profile Stats
        const userRef = doc(db, 'profiles', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setProfile(userSnap.data() as UserProfile);
        }

        // Fetch Game History
        // Note: Using just 'where' and sorting locally to avoid missing composite index errors in Firestore
        const q = query(
          collection(db, 'game_sessions'),
          where('user_id', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);

        const sessions: GameSession[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          sessions.push({
            id: doc.id,
            word: data.word,
            category: data.category,
            difficulty: data.difficulty,
            score: data.score,
            level: data.level,
            status: data.status,
            aura_earned: data.aura_earned,
            timestamp: data.timestamp,
          });
        });

        // Sort by timestamp descending
        sessions.sort((a, b) => {
          const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
          const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
          return timeB - timeA;
        });

        setHistory(sessions);
      } catch (error: any) {
        console.error('Error fetching profile data:', error);
        setErrorMsg(error.message || 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-neon-cyan animate-pulse">
        Loading Agent Profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <User className="w-16 h-16 text-gray-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-6">You must be logged in to view your profile.</p>
        <Link href="/" className="px-6 py-2 bg-white text-black rounded-full font-bold uppercase tracking-wider">
          Return to Base
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-12 lg:p-16 max-w-[1800px] mx-auto flex flex-col w-full">
      <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-2">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium uppercase tracking-wider text-xs sm:text-sm">Back</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <User className="w-5 h-5 sm:w-6 sm:h-6 text-neon-cyan" />
          <h1 className="text-lg sm:text-2xl font-black uppercase tracking-widest">Agent Profile</h1>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-mono text-center">
          {errorMsg}
        </div>
      )}

      {/* Calculate Tier */}
      {(() => {
        const tier = getTier(profile?.aura_points || 0);
        return (
          <>
            <style>{`@media (min-width: 1024px) { .profile-grid { grid-template-columns: 2fr 3fr 2fr !important; } }`}</style>
            <div className="profile-grid grid grid-cols-1 gap-6 lg:gap-8 items-start">
              {/* Left Column: Agent Card & Stats */}
              <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">
                {/* Agent Profile Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel-interactive p-6 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col items-center text-center shadow-[0_0_30px_rgba(0,0,0,0.4)] border border-white/10 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/5 to-transparent pointer-events-none" />
                  <div className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-4xl sm:text-5xl font-black bg-dark-bg border-2 ${profile?.equipped_border || 'border-gray-600'} shadow-lg z-10`}>
                    {user.photoURL ? (
                      <Image src={user.photoURL} alt="Avatar" width={112} height={112} className="rounded-full" />
                    ) : (
                      <span className="text-white/80">{(user.displayName || user.email || 'A')[0].toUpperCase()}</span>
                    )}
                  </div>
                  <h2 className="mt-4 text-xl sm:text-2xl font-black uppercase tracking-wider text-white z-10">
                    {user.displayName || 'Anonymous Agent'}
                  </h2>
                  <span className={`mt-2 text-xs font-mono px-3 py-1 rounded-full border ${tier.color} border-current uppercase tracking-widest z-10`}>
                    {tier.name}
                  </span>
                  <p className="mt-2 text-xs text-gray-500 font-mono truncate max-w-full z-10">{user.email}</p>
                  <div className="flex gap-3 mt-5 z-10">
                    <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                      <SettingsIcon className="w-3.5 h-3.5" /> Settings
                    </Link>
                    <Link href="/shop" className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest bg-neon-purple/10 border border-neon-purple/30 rounded-xl hover:bg-neon-purple/20 transition-colors text-neon-purple">
                      <Sparkles className="w-3.5 h-3.5" /> Black Market
                    </Link>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-panel p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl space-y-4 shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-white/5 box-border"
                >
                  <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                    <Trophy className="w-4 h-4 text-neon-yellow" /> Career Metrics
                  </h3>

                  <div className="flex justify-between items-center p-4 bg-black/30 rounded-2xl border border-white/5 hover:border-neon-cyan/30 transition-colors group">
                    <div className="flex items-center gap-4 text-gray-300">
                      <div className="p-2 bg-neon-cyan/10 rounded-lg group-hover:scale-110 transition-transform">
                        <Sparkles className="w-6 h-6 text-neon-cyan" />
                      </div>
                      <span className="font-bold tracking-widest uppercase text-sm">Aura (XP)</span>
                    </div>
                    <span className={`font-mono font-black text-2xl ${tier.color}`}>
                      {profile?.aura_points?.toLocaleString() || 0}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-black/30 rounded-2xl border border-white/5 hover:border-yellow-400/30 transition-colors group">
                    <div className="flex items-center gap-4 text-gray-300">
                      <div className="p-2 bg-yellow-400/10 rounded-lg group-hover:scale-110 transition-transform">
                        <Star className="w-6 h-6 text-yellow-400" />
                      </div>
                      <span className="font-bold tracking-widest uppercase text-sm">Total Score</span>
                    </div>
                    <span className="font-mono font-black text-2xl text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-yellow-500 drop-shadow-[0_0_10px_rgba(253,224,71,0.5)]">
                      {profile?.total_score?.toLocaleString() || 0}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-black/30 rounded-2xl border border-white/5 hover:border-yellow-500/30 transition-colors group">
                    <div className="flex items-center gap-4 text-gray-300">
                      <div className="p-2 bg-yellow-500/10 rounded-lg group-hover:scale-110 transition-transform">
                        <Coins className="w-6 h-6 text-yellow-500" />
                      </div>
                      <span className="font-bold tracking-widest uppercase text-sm">Coins</span>
                    </div>
                    <span className="font-mono font-black text-2xl text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                      {profile?.coins?.toLocaleString() || 0}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-black/30 rounded-2xl border border-white/5 hover:border-cyan-400/30 transition-colors group">
                    <div className="flex items-center gap-4 text-gray-300">
                      <div className="p-2 bg-cyan-400/10 rounded-lg group-hover:scale-110 transition-transform">
                        <Lightbulb className="w-6 h-6 text-cyan-400" />
                      </div>
                      <span className="font-bold tracking-widest uppercase text-sm">Hints</span>
                    </div>
                    <span className="font-mono font-black text-2xl text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                      {profile?.hints?.toLocaleString() || 0}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-black/30 rounded-2xl border border-white/5 hover:border-neon-pink/30 transition-colors group">
                    <div className="flex items-center gap-4 text-gray-300">
                      <div className="p-2 bg-neon-pink/10 rounded-lg group-hover:scale-110 transition-transform">
                        <Target className="w-6 h-6 text-neon-pink" />
                      </div>
                      <span className="font-bold tracking-widest uppercase text-sm">Missions Played</span>
                    </div>
                    <span className="font-mono font-black text-2xl text-transparent bg-clip-text bg-gradient-to-br from-pink-200 to-neon-pink drop-shadow-[0_0_10px_rgba(255,42,133,0.5)]">
                      {profile?.games_played?.toLocaleString() || 0}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Middle Column: Match History (wider) */}
              <div className="space-y-6 flex flex-col min-h-0 h-[calc(100vh-8rem)] lg:sticky lg:top-8 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-panel p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl h-full flex flex-col"
                >
                  <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                    <History className="w-4 h-4" /> Match History
                  </h3>

                  <div className="flex-1 overflow-y-auto pr-2 space-y-3 lg:max-h-[calc(100vh-16rem)] max-h-[600px] custom-scrollbar">
                    {history.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-500 font-mono py-12">
                        <History className="w-12 h-12 mb-4 opacity-20" />
                        <p>No mission history found.</p>
                        <Link href="/setup" className="mt-4 text-neon-cyan hover:underline">Start your first mission</Link>
                      </div>
                    ) : (
                      history.map((session, index) => (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * Math.min(index, 10) }}
                          key={session.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors gap-4"
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-gray-300">
                                {session.category}
                              </span>
                              <span className={`text-xs font-mono uppercase px-2 py-0.5 rounded ${session.difficulty === 'noob' ? 'bg-green-500/20 text-green-400' :
                                session.difficulty === 'casual' ? 'bg-blue-500/20 text-blue-400' :
                                  session.difficulty === 'pro' ? 'bg-purple-500/20 text-purple-400' :
                                    session.difficulty === 'veteran' ? 'bg-red-500/20 text-red-400' :
                                      'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                {session.difficulty}
                              </span>
                            </div>
                            <span className="font-bold text-lg tracking-wider">
                              {session.word}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <Calendar className="w-3 h-3" />
                              {session.timestamp?.toDate ? session.timestamp.toDate().toLocaleDateString() : 'Unknown Date'}
                            </div>
                          </div>

                          <div className="flex items-center gap-6 sm:justify-end">
                            <div className="text-center">
                              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Level</div>
                              <div className="font-mono font-bold text-white">{session.level}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Score</div>
                              <div className="font-mono font-bold text-neon-cyan text-xl">{session.score.toLocaleString()}</div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              </div>
              {/* Right Column: Analytics & Aura */}
              <div className="lg:col-span-1 space-y-6 flex flex-col min-h-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  className="glass-panel p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-white/5"
                >
                  <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 sm:mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                    <BarChart3 className="w-4 h-4 text-neon-cyan" /> Advanced Analytics
                  </h3>

                  {(() => {
                    const totalGames = history.length;
                    const wins = history.filter(s => s.status === 'won').length;
                    const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
                    const avgScore = totalGames > 0 ? Math.round(history.reduce((sum, s) => sum + s.score, 0) / totalGames) : 0;
                    const highestLevel = history.reduce((max, s) => Math.max(max, s.level || 0), 0);
                    const totalAura = history.reduce((sum, s) => sum + (s.aura_earned || 0), 0);

                    // Favorite category
                    const catCounts: Record<string, number> = {};
                    history.forEach(s => { catCounts[s.category] = (catCounts[s.category] || 0) + 1; });
                    const favCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

                    return (
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {/* Win Rate */}
                        <div className="bg-black/30 rounded-xl p-3 sm:p-4 border border-white/5 text-center hover:border-neon-green/30 transition-colors">
                          <Percent className="w-4 h-4 text-neon-green mx-auto mb-1" />
                          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Win Rate</div>
                          <div className={`text-2xl sm:text-3xl font-mono font-black ${winRate >= 60 ? 'text-neon-green' : winRate >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{winRate}%</div>
                          <div className="text-[10px] text-gray-600 mt-1">{wins}W / {totalGames - wins}L</div>
                        </div>

                        {/* Avg Score */}
                        <div className="bg-black/30 rounded-xl p-3 sm:p-4 border border-white/5 text-center hover:border-neon-cyan/30 transition-colors">
                          <TrendingUp className="w-4 h-4 text-neon-cyan mx-auto mb-1" />
                          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Avg Score</div>
                          <div className="text-2xl sm:text-3xl font-mono font-black text-white">{avgScore.toLocaleString()}</div>
                        </div>

                        {/* Best Level */}
                        <div className="bg-black/30 rounded-xl p-3 sm:p-4 border border-white/5 text-center hover:border-neon-purple/30 transition-colors">
                          <Flame className="w-4 h-4 text-neon-purple mx-auto mb-1" />
                          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Best Level</div>
                          <div className="text-2xl sm:text-3xl font-mono font-black text-neon-purple">{highestLevel}</div>
                        </div>

                        {/* Favorite Category */}
                        <div className="bg-black/30 rounded-xl p-3 sm:p-4 border border-white/5 text-center hover:border-neon-yellow/30 transition-colors col-span-2 lg:col-span-1">
                          <Star className="w-4 h-4 text-neon-yellow mx-auto mb-1" />
                          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Top Category</div>
                          <div className="text-lg sm:text-xl font-bold text-neon-yellow uppercase tracking-widest truncate">{favCategory}</div>
                        </div>

                        {/* Total Aura Earned */}
                        <div className="bg-black/30 rounded-xl p-3 sm:p-4 border border-neon-pink/10 text-center hover:border-neon-pink/30 transition-colors col-span-2">
                          <Zap className="w-4 h-4 text-neon-pink mx-auto mb-1" />
                          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Total Aura Earned</div>
                          <div className="text-2xl sm:text-3xl font-mono font-black text-neon-pink">{totalAura.toLocaleString()}</div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="glass-panel p-6 rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-white/5 box-border"
                >
                  <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                    <Sparkles className="w-4 h-4 text-neon-yellow animate-pulse" /> Agent Aura (Badges)
                  </h3>

                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                    {ACHIEVEMENTS.map((ach) => {
                      const isUnlocked = profile?.unlockedAchievements?.includes(ach.id);
                      const Icon = ach.icon;

                      return (
                        <div
                          key={ach.id}
                          className="relative group aspect-square rounded-xl flex items-center justify-center border border-white/5 transition-all overflow-hidden bg-black/40"
                          title={isUnlocked ? ach.title + ' - ' + ach.description : 'Locked'}
                        >
                          {isUnlocked ? (
                            <>
                              <div className={`absolute inset-0 bg-gradient-to-br ${ach.color} opacity-20`} />
                              <Icon className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 relative z-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]`} />
                            </>
                          ) : (
                            <Lock className="w-6 h-6 text-gray-700 opacity-50 relative z-10" />
                          )}

                          {/* Tooltip Hover Overlay */}
                          {isUnlocked && (
                            <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-col items-center justify-center p-2 text-center backdrop-blur-sm">
                              <span className="text-[9px] font-bold text-white uppercase leading-tight">{ach.title}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {(!profile?.unlockedAchievements || profile.unlockedAchievements.length === 0) && (
                    <p className="text-xs text-gray-500 font-mono mt-4 text-center">No aura badges unlocked yet.</p>
                  )}
                </motion.div>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}
