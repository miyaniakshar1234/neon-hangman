'use client';

import { useEffect, useState } from 'react';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, ArrowLeft, Medal } from 'lucide-react';
import { getTier } from '@/lib/tiers';

interface Profile {
  user_id: string;
  username: string;
  email?: string;
  photoURL?: string;
  total_score: number;
  games_played: number;
}

interface DailyRecord {
  user_id: string;
  username: string;
  email?: string;
  score: number;
  level: number;
  word: string;
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'global' | 'daily'>('global');
  const [leaders, setLeaders] = useState<Profile[]>([]);
  const [dailyLeaders, setDailyLeaders] = useState<DailyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaders = async () => {
      if (!isFirebaseConfigured || !db) {
        setLoading(false);
        setErrorMsg('Firebase is not configured. Please add your Firebase configuration to the environment variables.');
        return;
      }

      setLoading(true);

      try {
        if (activeTab === 'global') {
          const q = query(collection(db, 'profiles'), orderBy('total_score', 'desc'), limit(50));
          const querySnapshot = await getDocs(q);

          const data: Profile[] = [];
          querySnapshot.forEach((doc) => {
            data.push(doc.data() as Profile);
          });
          setLeaders(data);
        } else {
          // Fetch Daily Leaders
          const now = new Date();
          const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

          const q = query(
            collection(db, 'game_sessions'),
            where('isDaily', '==', true),
            where('timestamp', '>=', startOfDay)
          );

          const querySnapshot = await getDocs(q);
          const data: DailyRecord[] = [];

          querySnapshot.forEach((docSnap) => {
            const row = docSnap.data();
            data.push({
              user_id: row.user_id,
              username: row.username || 'Agent', // Need to fetch username or join, but we'll try to use stored username if available or fallback
              email: row.email || '',
              score: row.score,
              level: row.level,
              word: row.word
            });
          });

          // Sort daily leaders locally by score (highest first) since we might lack a composite index
          data.sort((a, b) => b.score - a.score);

          // Deduplicate if a user somehow played twice (take highest)
          const uniqueDailyData = Array.from(new Map(data.map(item => [item.user_id, item])).values());

          setDailyLeaders(uniqueDailyData.slice(0, 50));
        }
      } catch (error: any) {
        console.error('Error fetching leaderboard:', error);
        if (error.code === 'permission-denied') {
          setErrorMsg('Leaderboard is currently offline. (Missing Firestore permissions)');
        } else if (error.message?.includes('index')) {
          setErrorMsg('Leaderboard is building indexes... Please ensure you clicked the indexing link in your Firebase Console.');
          console.warn("Firebase index required. Look at the console error for the exact link.");
        } else {
          setErrorMsg(error.message || 'Failed to connect to Firebase Firestore. Please check your configuration.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, [activeTab]);

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-12 max-w-5xl mx-auto flex flex-col">
      <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-2">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium uppercase tracking-wider text-xs sm:text-sm">Back</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-neon-yellow" />
          <h1 className="text-lg sm:text-2xl font-black uppercase tracking-widest">Rankings</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-black/40 p-1.5 rounded-full border border-white/5 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('global')}
            className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm transition-all ${activeTab === 'global' ? 'bg-neon-cyan/20 text-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.2)]' : 'text-gray-500 hover:text-white'
              }`}
          >
            Global All-Time
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm transition-all ${activeTab === 'daily' ? 'bg-neon-pink/20 text-neon-pink shadow-[0_0_15px_rgba(255,42,133,0.2)]' : 'text-gray-500 hover:text-white'
              }`}
          >
            Daily Mission
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden flex-1">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-4 border-b border-white/10 text-xs font-mono text-gray-500 uppercase tracking-widest">
          <div className="w-12 text-center">Rank</div>
          <div>Agent</div>
          <div className="text-right w-24">{activeTab === 'global' ? 'Games' : 'Level'}</div>
          <div className="text-right w-32">Score</div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-neon-cyan font-mono animate-pulse flex flex-col items-center gap-4">
            <Trophy className="w-12 h-12 opacity-50" />
            <p>Decrypting global rankings...</p>
          </div>
        ) : errorMsg ? (
          <div className="p-12 text-center text-red-400 font-mono flex flex-col items-center gap-4">
            <p>{errorMsg}</p>
            {errorMsg.includes('permissions') && (
              <div className="text-sm text-gray-400 max-w-md text-left bg-black/30 p-4 rounded-lg border border-white/10">
                <p className="mb-2 font-bold text-white">To enable the leaderboard:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to Firebase Console</li>
                  <li>Open Firestore Database &gt; Rules</li>
                  <li>Set <code className="text-neon-cyan">allow read: if true;</code> for profiles</li>
                  <li>Publish rules</li>
                </ol>
              </div>
            )}
          </div>
        ) : (activeTab === 'global' && leaders.length === 0) || (activeTab === 'daily' && dailyLeaders.length === 0) ? (
          <div className="p-12 text-center text-gray-500 font-mono flex flex-col items-center gap-4">
            <Medal className="w-12 h-12 opacity-20" />
            <p>{activeTab === 'daily' ? 'No Agents have completed today\'s mission yet.' : 'No records found. Be the first to play!'}</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {(activeTab === 'global' ? leaders : dailyLeaders).map((leader: any, index: number) => {
              // Determine display name: Use username if valid, otherwise email prefix, otherwise 'Agent'
              let displayName = leader.username;
              if (!displayName || displayName === 'Anonymous') {
                if (leader.email) {
                  displayName = leader.email.split('@')[0];
                } else {
                  displayName = 'Agent';
                }
              }

              // Calculate Tier for visual styling (only applies if we have aura points on the record, fallback to novice)
              const tier = getTier(leader.aura_points || 0);

              return (
                <div
                  key={leader.user_id || `leader-${index}`}
                  className={`grid grid-cols-[auto_1fr_auto_auto] gap-4 p-4 items-center border-b border-white/5 hover:bg-white/10 transition-all ${index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent' :
                    index === 1 ? 'bg-gradient-to-r from-gray-400/10 to-transparent' :
                      index === 2 ? 'bg-gradient-to-r from-amber-700/10 to-transparent' :
                        'hover:pl-5'
                    }`}
                >
                  <div className="w-12 flex justify-center">
                    {index === 0 ? <Medal className="w-7 h-7 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" /> :
                      index === 1 ? <Medal className="w-6 h-6 text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]" /> :
                        index === 2 ? <Medal className="w-5 h-5 text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]" /> :
                          <span className="font-mono text-gray-500">{index + 1}</span>}
                  </div>
                  <div className="font-bold text-lg truncate flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full border-2 ${tier.borderStyle} bg-gradient-to-br ${tier.bgGradient} flex items-center justify-center text-sm shadow-[0_0_10px_rgba(0,0,0,0.3)]`}>
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className={`${tier.color} drop-shadow-md`}>{displayName}</span>
                      {leader.email && leader.username !== 'Anonymous' && (
                        <span className="text-[10px] text-neon-cyan font-mono opacity-60">
                          {activeTab === 'daily' ? `Word: ${leader.word}` : leader.email.split('@')[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right w-24 flex flex-col items-end">
                    <span className="font-mono text-gray-300">{activeTab === 'global' ? leader.games_played : leader.level}</span>
                    <span className="text-[10px] text-gray-500 uppercase">{activeTab === 'global' ? 'Missions' : 'Level'}</span>
                  </div>
                  <div className={`text-right w-32 flex flex-col items-end`}>
                    <span className={`font-mono font-black text-2xl ${index === 0 ? 'text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-yellow-500 drop-shadow-[0_0_10px_rgba(253,224,71,0.5)]' :
                      index === 1 ? 'text-gray-200' :
                        index === 2 ? 'text-amber-500' :
                          'text-white'
                      }`}>
                      {leader.score !== undefined ? leader.score.toLocaleString() : leader.total_score?.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Score</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
