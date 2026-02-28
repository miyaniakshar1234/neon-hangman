export interface Tier {
    id: string;
    name: string;
    minPoints: number;
    color: string;
    bgGradient: string;
    borderStyle: string;
}

export const TIERS: Tier[] = [
    {
        id: 'novice',
        name: 'Novice',
        minPoints: 0,
        color: 'text-gray-400',
        bgGradient: 'from-gray-500/20 to-transparent',
        borderStyle: 'border-white/20'
    },
    {
        id: 'hacker',
        name: 'Hacker',
        minPoints: 500,
        color: 'text-neon-green',
        bgGradient: 'from-neon-green/20 to-transparent',
        borderStyle: 'border-neon-green/50 shadow-[0_0_10px_rgba(0,255,102,0.3)]'
    },
    {
        id: 'cyber-god',
        name: 'Cyber-God',
        minPoints: 2500,
        color: 'text-neon-cyan',
        bgGradient: 'from-neon-cyan/20 to-transparent',
        borderStyle: 'border-neon-cyan/50 shadow-[0_0_15px_rgba(0,243,255,0.5)]'
    },
    {
        id: 'neon-legend',
        name: 'Neon Legend',
        minPoints: 10000,
        color: 'text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple',
        bgGradient: 'from-neon-pink/20 via-neon-purple/20 to-transparent',
        borderStyle: 'border-neon-pink shadow-[0_0_20px_rgba(255,42,133,0.6)] animate-pulse'
    }
];

export function getTier(points: number = 0): Tier {
    // Find the highest tier where points >= minPoints
    for (let i = TIERS.length - 1; i >= 0; i--) {
        if (points >= TIERS[i].minPoints) {
            return TIERS[i];
        }
    }
    return TIERS[0];
}
