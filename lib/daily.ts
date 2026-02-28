import { WORDS, Category, Difficulty, WordData } from './words';

// pseudo-random number generator based on a seed
function sfc32(a: number, b: number, c: number, d: number) {
    return function () {
        a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
        let t = (a + b) | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        d = d + 1 | 0;
        t = t + d | 0;
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    }
}

function generateSeed(dateStr: string) {
    let h = 1779033703 ^ dateStr.length;
    for (let i = 0; i < dateStr.length; i++) {
        h = Math.imul(h ^ dateStr.charCodeAt(i), 3432918353);
        h = h << 13 | h >>> 19;
    }
    return h;
}

export interface DailyChallengeData extends WordData {
    category: Category;
    difficulty: Difficulty;
    dateStr: string;
}

export function getDailyChallenge(): DailyChallengeData {
    // Use UTC date to ensure everyone gets the same word simultaneously regardless of timezone
    const now = new Date();
    const dateStr = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;

    const seed = generateSeed(dateStr);
    const rand = sfc32(seed, seed ^ 0xdeadbeef, seed ^ 0x8badf00d, seed ^ 0x12345678);

    const categories = Object.keys(WORDS) as Category[];
    const selectedCategory = categories[Math.floor(rand() * categories.length)];

    const difficulties = Object.keys(WORDS[selectedCategory]) as Difficulty[];
    // Heavily weight towards Pro, Veteran, and Godlike for the daily challenge (indexes 2, 3, 4)
    const diffRandom = rand();
    let selectedDifficulty: Difficulty;
    if (diffRandom < 0.1) selectedDifficulty = 'casual';
    else if (diffRandom < 0.4) selectedDifficulty = 'pro';
    else if (diffRandom < 0.8) selectedDifficulty = 'veteran';
    else selectedDifficulty = 'godlike';

    const words = WORDS[selectedCategory][selectedDifficulty];
    if (!words || words.length === 0) {
        // Fallback if somehow a category/difficulty combo is empty
        return {
            word: 'ABORT',
            clue: 'System malfunction fallback protocol',
            category: 'technology',
            difficulty: 'noob',
            dateStr
        };
    }

    const selectedWordData = words[Math.floor(rand() * words.length)];

    return {
        ...selectedWordData,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        dateStr
    };
}
