'use client';

import { useEffect, useState } from 'react';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { ArrowLeft, Sparkles, Lock, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { SHOP_ITEMS, ShopItem } from '@/lib/shop';

interface UserProfile {
    total_score: number;
    coins?: number;
    hints?: number;
    unlocked_items?: string[];
    equipped_border?: string;
    equipped_sound?: string;
}

export default function ShopPage() {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
                const userRef = doc(db, 'profiles', user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setProfile(userSnap.data() as UserProfile);
                }
            } catch (error: any) {
                console.error('Error fetching profile data:', error);
                setErrorMsg(error.message || 'Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [user, authLoading]);

    const handlePurchase = async (item: ShopItem) => {
        if (!user || !db || !profile) return;
        setSuccessMsg(null);
        setErrorMsg(null);

        const isCoinPurchase = item.currency === 'coins';
        const userBalance = isCoinPurchase ? (profile.coins || 0) : profile.total_score;

        if (userBalance < item.price) {
            setErrorMsg(`Insufficient Funds! You need ${item.price.toLocaleString()} ${isCoinPurchase ? 'Coins' : 'Score'} to acquire this.`);
            return;
        }

        try {
            const userRef = doc(db, 'profiles', user.uid);
            const updatePayload: any = {};

            if (isCoinPurchase) {
                updatePayload.coins = increment(-item.price);
            } else {
                updatePayload.total_score = increment(-item.price);
            }

            if (item.type !== 'consumable' && !profile.unlocked_items?.includes(item.id)) {
                updatePayload.unlocked_items = arrayUnion(item.id);
            }

            if (item.type === 'consumable') {
                updatePayload.hints = increment(parseInt(item.value));
            }

            await updateDoc(userRef, updatePayload);

            // Update local state instantly for UI feedback
            setProfile(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    total_score: isCoinPurchase ? prev.total_score : prev.total_score - item.price,
                    coins: isCoinPurchase ? (prev.coins || 0) - item.price : prev.coins,
                    unlocked_items: item.type === 'consumable' ? prev.unlocked_items : [...(prev.unlocked_items || []), item.id],
                    hints: item.type === 'consumable' ? (prev.hints || 0) + parseInt(item.value) : prev.hints
                };
            });

            setSuccessMsg(`Acquired ${item.name}!`);
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (error: any) {
            console.error('Purchase failed:', error);
            setErrorMsg('Failed to process transaction.');
        }
    };

    const handleEquip = async (item: ShopItem) => {
        if (!user || !db || !profile) return;

        try {
            const userRef = doc(db, 'profiles', user.uid);
            const updatePayload: any = {};

            if (item.type === 'avatar_border') {
                updatePayload.equipped_border = item.value;
            } else if (item.type === 'sound_pack') {
                updatePayload.equipped_sound = item.value;
            }

            await updateDoc(userRef, updatePayload);

            setProfile(prev => prev ? {
                ...prev,
                ...updatePayload
            } : null);

            setSuccessMsg(`Equipped ${item.name}!`);
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (error: any) {
            console.error('Equip failed:', error);
            setErrorMsg('Failed to equip item.');
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center font-mono text-neon-pink animate-pulse">
                Accessing Black Market...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <Lock className="w-16 h-16 text-gray-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                <p className="text-gray-400 mb-6">You must be logged in to enter the Black Market.</p>
                <Link href="/" className="px-6 py-2 bg-white text-black rounded-full font-bold uppercase tracking-wider">
                    Return to Base
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-12 max-w-5xl mx-auto flex flex-col">
            <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3">
                <Link href="/profile" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium uppercase tracking-wider text-xs sm:text-sm">Back</span>
                </Link>
                <div className="flex items-center gap-2 sm:gap-3">
                    <h1 className="text-lg sm:text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-neon-pink">
                        Black Market
                    </h1>
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-neon-pink animate-pulse" />
                </div>
            </div>

            <div className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-neon-pink/30 mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-[0_0_30px_rgba(255,42,133,0.15)]">
                <div>
                    <h2 className="text-sm font-mono uppercase tracking-widest text-gray-400">Available Funds</h2>
                    <p className="text-gray-400 mt-2 font-mono text-xs sm:text-sm">Use your accumulated Coins or Score to purchase permanent upgrades and items.</p>
                </div>
                <div className="text-right">
                    <span className="font-mono font-black text-3xl text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                        {profile?.total_score?.toLocaleString() || 0}
                    </span>
                    <span className="text-xs ml-2 text-yellow-500/50 uppercase tracking-widest">Score</span>
                </div>
            </div>

            {errorMsg && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-mono text-center">
                    {errorMsg}
                </div>
            )}
            {successMsg && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm font-mono text-center shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                    {successMsg}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SHOP_ITEMS.map((item, index) => {
                    const isUnlocked = profile?.unlocked_items?.includes(item.id);
                    const isEquipped = item.type === 'avatar_border' ? profile?.equipped_border === item.value : profile?.equipped_sound === item.value;

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={item.id}
                            className={`glass-panel p-6 rounded-2xl border ${isEquipped ? 'border-neon-cyan/50 shadow-[0_0_20px_rgba(0,243,255,0.2)]' : isUnlocked ? 'border-white/20' : 'border-white/5'} flex flex-col justify-between group hover:bg-white/5 transition-all`}
                        >
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold tracking-wider">{item.name}</h3>
                                    <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-md bg-white/10 text-gray-300">
                                        {item.type.replace('_', ' ')}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400 mb-6">{item.description}</p>

                                {/* Visual Preview for Borders */}
                                {item.type === 'avatar_border' && (
                                    <div className="flex justify-center mb-6">
                                        <div className={`w-16 h-16 rounded-full border-4 ${item.value} bg-dark-bg flex items-center justify-center`}>
                                            <span className="opacity-50 font-bold">A</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="font-mono text-lg font-bold text-yellow-500 flex items-center gap-2">
                                    {(!isUnlocked || item.type === 'consumable') && (
                                        <>
                                            {item.price.toLocaleString()}
                                            <span className="text-[10px] text-yellow-500/50 uppercase tracking-widest">
                                                {item.currency === 'coins' ? 'Coins' : 'Score'}
                                            </span>
                                        </>
                                    )}
                                </div>

                                <div>
                                    {isEquipped && item.type !== 'consumable' ? (
                                        <button disabled className="px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 flex items-center gap-2">
                                            <Check className="w-4 h-4" /> Equipped
                                        </button>
                                    ) : isUnlocked && item.type !== 'consumable' ? (
                                        <button
                                            onClick={() => handleEquip(item)}
                                            className="px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm bg-white text-black hover:bg-gray-200 transition-colors"
                                        >
                                            Equip
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handlePurchase(item)}
                                            className="px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm bg-yellow-500 text-black hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                                        >
                                            Acquire
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
