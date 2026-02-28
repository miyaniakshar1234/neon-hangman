'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useSettingsStore } from '@/store/settingsStore';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { updateProfile } from 'firebase/auth';
import { ArrowLeft, Save, Volume2, VolumeX, Music, Music2, Vibrate, Smartphone, User, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function SettingsPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const { soundEnabled, musicEnabled, vibrationEnabled, toggleSound, toggleMusic, toggleVibration } = useSettingsStore();

    const [displayName, setDisplayName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        } else if (user) {
            setDisplayName(user.displayName || '');
        }
    }, [user, loading, router]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSaving(true);
        setMessage('');

        try {
            // 1. Update Firebase Auth Profile
            await updateProfile(user, { displayName });

            // 2. Update Firestore Profile Document if it exists
            if (db) {
                const userRef = doc(db, 'profiles', user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    await updateDoc(userRef, {
                        username: displayName,
                    });
                }
            }

            await user.reload(); // Refresh local user state
            setMessage('Profile updated successfully!');

            // Clear message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        } catch (error: any) {
            console.error('Failed to update profile:', error);
            setMessage('Error updating profile: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center font-mono text-neon-cyan animate-pulse">Loading System Preferences...</div>;
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-12 max-w-3xl mx-auto flex flex-col relative z-10 selection:bg-neon-cyan/30 text-white">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-between mb-6 sm:mb-8">
                <Link href="/profile" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium uppercase tracking-wider text-xs sm:text-sm">Back</span>
                </Link>
                <div className="flex items-center gap-2 sm:gap-3">
                    <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6 text-neon-purple" />
                    <h1 className="text-lg sm:text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan">Preferences</h1>
                </div>
            </div>

            <div className="space-y-8">
                {/* Profile Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl space-y-6"
                >
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <User className="w-5 h-5 text-neon-cyan" />
                        <h2 className="text-lg font-bold uppercase tracking-widest">Agent Identity</h2>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono uppercase tracking-widest text-gray-400 pl-1">Display Name</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-4 text-white font-bold placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                                placeholder="Enter new display name..."
                                maxLength={20}
                            />
                            <p className="text-xs text-gray-500 font-mono mt-1 pl-1">This name will be displayed on the global leaderboards.</p>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm font-mono h-5">
                                {message && (
                                    <span className={message.includes('Error') ? 'text-red-400' : 'text-neon-green'}>
                                        {message}
                                    </span>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={isSaving || displayName === user.displayName || displayName.trim() === ''}
                                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : 'Save Identity'}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Hardware & Audio Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl space-y-6"
                >
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <Smartphone className="w-5 h-5 text-neon-pink" />
                        <h2 className="text-lg font-bold uppercase tracking-widest">Hardware & Audio</h2>
                    </div>

                    <div className="space-y-4">
                        {/* Sound FX Toggle */}
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={toggleSound}>
                            <div className="flex items-center gap-4 text-white">
                                <div className={`p-3 rounded-xl transition-colors ${soundEnabled ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-white/10 text-gray-500'}`}>
                                    {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h3 className="font-bold tracking-widest uppercase">Sound Effects</h3>
                                    <p className="text-xs text-gray-400 font-mono mt-0.5">UI clicks and typing sounds</p>
                                </div>
                            </div>
                            <div className={`w-14 h-7 rounded-full transition-colors relative ${soundEnabled ? 'bg-neon-cyan' : 'bg-gray-600'}`}>
                                <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform ${soundEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
                            </div>
                        </div>

                        {/* Music Toggle */}
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={toggleMusic}>
                            <div className="flex items-center gap-4 text-white">
                                <div className={`p-3 rounded-xl transition-colors ${musicEnabled ? 'bg-neon-purple/20 text-neon-purple' : 'bg-white/10 text-gray-500'}`}>
                                    {musicEnabled ? <Music className="w-6 h-6" /> : <Music2 className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h3 className="font-bold tracking-widest uppercase">Background Music</h3>
                                    <p className="text-xs text-gray-400 font-mono mt-0.5">Atmospheric synthetic tracks</p>
                                </div>
                            </div>
                            <div className={`w-14 h-7 rounded-full transition-colors relative ${musicEnabled ? 'bg-neon-purple' : 'bg-gray-600'}`}>
                                <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform ${musicEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
                            </div>
                        </div>

                        {/* Haptics Toggle */}
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={toggleVibration}>
                            <div className="flex items-center gap-4 text-white">
                                <div className={`p-3 rounded-xl transition-colors ${vibrationEnabled ? 'bg-neon-green/20 text-neon-green' : 'bg-white/10 text-gray-500'}`}>
                                    {vibrationEnabled ? <Vibrate className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h3 className="font-bold tracking-widest uppercase">Haptic Feedback</h3>
                                    <p className="text-xs text-gray-400 font-mono mt-0.5">Device vibration on actions</p>
                                </div>
                            </div>
                            <div className={`w-14 h-7 rounded-full transition-colors relative ${vibrationEnabled ? 'bg-neon-green' : 'bg-gray-600'}`}>
                                <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform ${vibrationEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </div>
    );
}
