import {
    ShieldAlert,
    Crown,
    Zap,
    Flame,
    Target,
    Ghost,
    Skull,
    Swords,
    Award,
    Sparkles,
    Heart
} from 'lucide-react';
import React from 'react';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    condition: (gameData: any, profileData: any) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_blood',
        title: 'First Blood',
        description: 'Complete your first successful mission.',
        icon: Target,
        color: 'from-blue-500 to-cyan-500',
        condition: (gameData, profileData) => gameData.status === 'won' && profileData.games_won === 0
    },
    {
        id: 'veteran_agent',
        title: 'Veteran Agent',
        description: 'Play 10 missions.',
        icon: ShieldAlert,
        color: 'from-purple-500 to-pink-500',
        condition: (gameData, profileData) => profileData.games_played >= 9 // Checked before the current game is added
    },
    {
        id: 'flawless',
        title: 'Flawless Execution',
        description: 'Win a mission without making a single mistake.',
        icon: Sparkles,
        color: 'from-emerald-400 to-green-500',
        condition: (gameData, profileData) => gameData.status === 'won' && gameData.mistakes === 0
    },
    {
        id: 'combo_master',
        title: 'Combo Master',
        description: 'Reach a 5x combo multiplier in a single game.',
        icon: Flame,
        color: 'from-orange-500 to-red-500',
        condition: (gameData, profileData) => gameData.combo >= 5
    },
    {
        id: 'godlike',
        title: 'Cyber-Godlike',
        description: 'Win a mission on Nightmare difficulty.',
        icon: Skull,
        color: 'from-red-600 to-rose-700',
        condition: (gameData, profileData) => gameData.status === 'won' && gameData.difficulty === 'godlike'
    },
    {
        id: 'survivor',
        title: 'Close Call',
        description: 'Win a mission with only 1 life remaining.',
        icon: Heart,
        color: 'from-pink-500 to-rose-400',
        condition: (gameData, profileData) => {
            // Need max mistakes. If max is 6, and mistakes is 5, lives left is 1
            const maxMistakes = gameData.maxMistakes || 6;
            return gameData.status === 'won' && (maxMistakes - gameData.mistakes) === 1;
        }
    },
    {
        id: 'high_roller',
        title: 'High Roller',
        description: 'Score over 1,000 points in a single mission.',
        icon: Crown,
        color: 'from-yellow-400 to-amber-500',
        condition: (gameData, profileData) => gameData.score >= 1000
    },
    {
        id: 'persistence',
        title: 'Persistence',
        description: 'Reach Level 5 in a single continuous session.',
        icon: Zap,
        color: 'from-cyan-400 to-blue-600',
        condition: (gameData, profileData) => gameData.level >= 5
    }
];

export const checkAchievements = (gameData: any, profileData: any, currentAchievements: string[] = []): Achievement[] => {
    const newUnlocks: Achievement[] = [];

    for (const achievement of ACHIEVEMENTS) {
        if (!currentAchievements.includes(achievement.id)) {
            if (achievement.condition(gameData, profileData)) {
                newUnlocks.push(achievement);
            }
        }
    }

    return newUnlocks;
};
