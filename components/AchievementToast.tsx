'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/lib/achievements';
import { useAudio } from '@/hooks/useAudio';
import { Sparkles } from 'lucide-react';

interface AchievementToastProps {
    achievement: Achievement | null;
    onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
    const { playWin } = useAudio();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (achievement) {
            setIsVisible(true);
            // Play an epic sound when an achievement pops
            playWin();

            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 1000); // Wait for exit animation
            }, 6000); // Show for 6 seconds

            return () => clearTimeout(timer);
        }
    }, [achievement, playWin, onClose]);

    return (
        <AnimatePresence>
            {isVisible && achievement && (
                <motion.div
                    initial={{ y: -100, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -100, opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
                >
                    <div className="relative group">
                        <div className={`absolute inset-0 bg-gradient-to-r ${achievement.color} opacity-40 blur-xl rounded-full`} />

                        <div className="relative bg-black/80 border border-white/20 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] min-w-[320px]">

                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center shadow-[0_0_20px_currentColor] relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-white/20 blur-sm animate-pulse" />
                                <achievement.icon className="w-8 h-8 text-white relative z-10 drop-shadow-md" />
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 text-neon-yellow">
                                    <Sparkles className="w-3 h-3 animate-pulse" />
                                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Aura Gained</span>
                                </div>
                                <h4 className="font-black tracking-wide text-lg text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                                    {achievement.title}
                                </h4>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">
                                    {achievement.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
