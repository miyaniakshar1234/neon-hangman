import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    soundEnabled: boolean;
    musicEnabled: boolean;
    vibrationEnabled: boolean;
    toggleSound: () => void;
    toggleMusic: () => void;
    toggleVibration: () => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            soundEnabled: true,
            musicEnabled: true,
            vibrationEnabled: true,
            toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
            toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),
            toggleVibration: () => set((state) => ({ vibrationEnabled: !state.vibrationEnabled })),
        }),
        {
            name: 'neon-hangman-settings',
        }
    )
);
