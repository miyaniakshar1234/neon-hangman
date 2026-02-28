'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function useAudio() {
    const { soundEnabled, musicEnabled, vibrationEnabled } = useSettingsStore();
    const { user } = useAuth();
    const [equippedSound, setEquippedSound] = useState<string | null>(null);

    const bgmRef = useRef<HTMLAudioElement | null>(null);
    const clickRef = useRef<HTMLAudioElement | null>(null);
    const hoverRef = useRef<HTMLAudioElement | null>(null);
    const correctRef = useRef<HTMLAudioElement | null>(null);
    const wrongRef = useRef<HTMLAudioElement | null>(null);
    const winRef = useRef<HTMLAudioElement | null>(null);
    const loseRef = useRef<HTMLAudioElement | null>(null);

    // Fetch equipped audio pack
    useEffect(() => {
        if (!user || !db) return;
        const fetchAudioStyle = async () => {
            try {
                // @ts-ignore
                const userRef = doc(db, 'profiles', user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setEquippedSound(userSnap.data().equipped_sound || null);
                }
            } catch (e) { }
        };
        fetchAudioStyle();
    }, [user]);

    // Use Web Audio API for synthetic, futuristic "Neon" sounds
    const playSyntheticSound = useCallback((type: 'hover' | 'click' | 'correct' | 'wrong' | 'win' | 'lose') => {
        if (!soundEnabled || typeof window === 'undefined') return;

        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;

            switch (type) {
                case 'hover':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(400, now);
                    osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
                    gain.gain.setValueAtTime(0, now);
                    gain.gain.linearRampToValueAtTime(0.05, now + 0.05);
                    gain.gain.linearRampToValueAtTime(0, now + 0.1);
                    osc.start(now);
                    osc.stop(now + 0.1);
                    break;
                case 'click':
                    if (equippedSound === 'mechanical') {
                        // Sharp, short tap
                        osc.type = 'square';
                        osc.frequency.setValueAtTime(1200, now);
                        osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
                        gain.gain.setValueAtTime(0, now);
                        gain.gain.linearRampToValueAtTime(0.15, now + 0.01);
                        gain.gain.linearRampToValueAtTime(0, now + 0.05);
                        osc.start(now);
                        osc.stop(now + 0.05);
                    } else if (equippedSound === 'cyberpunk') {
                        // Heavy, deep thud
                        osc.type = 'sawtooth';
                        osc.frequency.setValueAtTime(200, now);
                        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
                        gain.gain.setValueAtTime(0, now);
                        gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
                        gain.gain.linearRampToValueAtTime(0, now + 0.15);
                        osc.start(now);
                        osc.stop(now + 0.15);
                    } else {
                        // Default synth click
                        osc.type = 'square';
                        osc.frequency.setValueAtTime(800, now);
                        osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
                        gain.gain.setValueAtTime(0, now);
                        gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
                        gain.gain.linearRampToValueAtTime(0, now + 0.1);
                        osc.start(now);
                        osc.stop(now + 0.1);
                    }
                    break;
                case 'correct':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(440, now); // A4
                    osc.frequency.setValueAtTime(554.37, now + 0.1); // C#5
                    osc.frequency.setValueAtTime(659.25, now + 0.2); // E5
                    gain.gain.setValueAtTime(0, now);
                    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
                    gain.gain.linearRampToValueAtTime(0, now + 0.4);
                    osc.start(now);
                    osc.stop(now + 0.4);
                    break;
                case 'wrong':
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(150, now);
                    osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
                    gain.gain.setValueAtTime(0, now);
                    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
                    gain.gain.linearRampToValueAtTime(0, now + 0.3);
                    osc.start(now);
                    osc.stop(now + 0.3);
                    break;
                case 'win':
                    osc.type = 'triangle';
                    // Simple arpeggio
                    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                        osc.frequency.setValueAtTime(freq, now + (i * 0.15));
                    });
                    gain.gain.setValueAtTime(0, now);
                    gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
                    gain.gain.linearRampToValueAtTime(0, now + 1.0);
                    osc.start(now);
                    osc.stop(now + 1.0);
                    break;
                case 'lose':
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(300, now);
                    osc.frequency.exponentialRampToValueAtTime(50, now + 0.8);
                    gain.gain.setValueAtTime(0, now);
                    gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
                    gain.gain.linearRampToValueAtTime(0, now + 0.8);
                    osc.start(now);
                    osc.stop(now + 0.8);
                    break;
            }
        } catch (e) {
            console.error("Web Audio API error:", e);
        }
    }, [soundEnabled]);

    const triggerVibration = useCallback((pattern: number | number[]) => {
        if (!vibrationEnabled) return;
        if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {
                // Ignore vibration errors as many modern browsers block it without explicit user interaction
            }
        }
    }, [vibrationEnabled]);

    const playHover = useCallback(() => playSyntheticSound('hover'), [playSyntheticSound]);
    const playClick = useCallback(() => {
        playSyntheticSound('click');
        triggerVibration(10); // Light tap
    }, [playSyntheticSound, triggerVibration]);
    const playCorrect = useCallback(() => {
        playSyntheticSound('correct');
        triggerVibration([30, 50, 30]); // Happy buzz
    }, [playSyntheticSound, triggerVibration]);
    const playWrong = useCallback(() => {
        playSyntheticSound('wrong');
        triggerVibration([100, 50, 100]); // Angry buzz
    }, [playSyntheticSound, triggerVibration]);
    const playWin = useCallback(() => {
        playSyntheticSound('win');
        triggerVibration([50, 50, 50, 50, 100]); // Celebration pattern
    }, [playSyntheticSound, triggerVibration]);
    const playLose = useCallback(() => {
        playSyntheticSound('lose');
        triggerVibration(500); // Long sad buzz
    }, [playSyntheticSound, triggerVibration]);

    return {
        playHover,
        playClick,
        playCorrect,
        playWrong,
        playWin,
        playLose,
        triggerVibration
    };
}
