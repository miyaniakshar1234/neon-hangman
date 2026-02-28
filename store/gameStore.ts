import { create } from 'zustand';
import { WORDS, Category, Difficulty, WordData } from '@/lib/words';
import { getDailyChallenge } from '@/lib/daily';

export type { Category, Difficulty };

interface GameState {
  word: string;
  clue: string;
  category: Category | null;
  difficulty: Difficulty | null;
  guessedLetters: Set<string>;
  mistakes: number;
  maxMistakes: number;
  status: 'idle' | 'playing' | 'won' | 'lost';
  score: number;
  level: number;
  combo: number;
  isDaily: boolean;
  sessionAura: number;
  sessionCoins: number;
  sessionHints: number;
  freeServices: number;
  buyHint: () => void;
  consumeGlobalHint: () => void;
  buyHeal: () => void;
  buyRevealVowels: () => void;
  useFreeService: (type: 'hint' | 'heal') => void;
  startGame: (category: Category, difficulty: Difficulty) => void;
  startDailyChallenge: () => void;
  guessLetter: (letter: string) => void;
  resetGame: () => void;
  nextLevel: () => void;
}

const getMaxMistakes = (diff: Difficulty) => {
  if (diff === 'noob') return 8;
  if (diff === 'casual') return 7;
  if (diff === 'pro') return 6;
  if (diff === 'veteran') return 5;
  return 4; // godlike
};

const getRandomWordData = (category: Category, difficulty: Difficulty): WordData => {
  const words = WORDS[category][difficulty];
  return words[Math.floor(Math.random() * words.length)];
};

export const useGameStore = create<GameState>((set, get) => ({
  word: '',
  clue: '',
  category: null,
  difficulty: null,
  guessedLetters: new Set(),
  mistakes: 0,
  maxMistakes: 6,
  status: 'idle',
  score: 0,
  level: 1,
  combo: 1,
  isDaily: false,
  sessionAura: 0,
  sessionCoins: 0,
  sessionHints: 0,
  freeServices: 5,

  startGame: (category, difficulty) => {
    const wordData = getRandomWordData(category, difficulty);
    set({
      word: wordData.word,
      clue: wordData.clue,
      category,
      difficulty,
      guessedLetters: new Set(),
      mistakes: 0,
      maxMistakes: getMaxMistakes(difficulty),
      status: 'playing',
      score: 0,
      level: 1,
      combo: 1,
      isDaily: false,
      sessionAura: 0,
      sessionCoins: 0,
      sessionHints: 0,
      freeServices: 5,
    });
  },

  startDailyChallenge: () => {
    const dailyData = getDailyChallenge();
    set({
      word: dailyData.word,
      clue: dailyData.clue,
      category: dailyData.category,
      difficulty: dailyData.difficulty,
      guessedLetters: new Set(),
      mistakes: 0,
      maxMistakes: getMaxMistakes(dailyData.difficulty),
      status: 'playing',
      score: 0,
      level: 1,
      combo: 1,
      isDaily: true,
      sessionAura: 0,
      sessionCoins: 0,
      sessionHints: 0,
      freeServices: 5,
    });
  },

  guessLetter: (letter) => {
    const { word, guessedLetters, mistakes, maxMistakes, status, score, level, combo, difficulty } = get();

    if (status !== 'playing' || guessedLetters.has(letter)) return;

    const newGuessedLetters = new Set(guessedLetters).add(letter);
    let newMistakes = mistakes;
    let newScore = score;
    let newCombo = combo;

    if (!word.includes(letter)) {
      newMistakes += 1;
      newCombo = 1; // Reset combo
      newScore = Math.max(0, newScore - 5);
    } else {
      newScore += 10 * newCombo;
      newCombo += 1; // Increase combo
    }

    const isWon = word.split('').every(char => newGuessedLetters.has(char));
    const isLost = newMistakes >= maxMistakes;

    if (isWon) {
      newScore += 50 * level; // Bonus for winning

      // Calculate Rewards explicitly for this level
      const diffMultiplier = difficulty === 'noob' ? 1 : difficulty === 'casual' ? 2 : difficulty === 'pro' ? 3 : difficulty === 'veteran' ? 5 : 8;

      let levelAura = Math.floor(word.length * diffMultiplier * (newCombo / 2));
      levelAura = Math.max(10, levelAura);

      let levelCoins = Math.floor((diffMultiplier * 5) + (newCombo * 2));
      let levelHints = (diffMultiplier >= 3 && Math.random() > 0.6) ? 1 : 0;

      set({
        sessionAura: get().sessionAura + levelAura,
        sessionCoins: get().sessionCoins + levelCoins,
        sessionHints: get().sessionHints + levelHints
      });
    }

    set({
      guessedLetters: newGuessedLetters,
      mistakes: newMistakes,
      score: newScore,
      combo: newCombo,
      status: isWon ? 'won' : isLost ? 'lost' : 'playing',
    });
  },

  buyHint: () => {
    const { word, guessedLetters, status, score } = get();
    const COST = 30; // Legacy Score cost
    if (status !== 'playing' || score < COST) return;

    const unrevealedLetters = word.split('').filter(char => !guessedLetters.has(char));
    if (unrevealedLetters.length === 0) return;

    const randomLetter = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];

    set({ score: score - COST });
    get().guessLetter(randomLetter);
  },

  consumeGlobalHint: () => {
    // This is called by the UI after successfully deducting a hint from Firebase
    const { word, guessedLetters, status } = get();
    if (status !== 'playing') return;

    const unrevealedLetters = word.split('').filter(char => !guessedLetters.has(char));
    if (unrevealedLetters.length === 0) return;

    const randomLetter = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];

    // We don't deduct cost here, we just apply the hint
    get().guessLetter(randomLetter);
  },

  buyHeal: () => {
    const { status, score, mistakes } = get();
    const COST = 50;
    if (status !== 'playing' || score < COST || mistakes === 0) return;

    set({
      score: score - COST,
      mistakes: mistakes - 1
    });
  },

  buyRevealVowels: () => {
    const { word, guessedLetters, status, score } = get();
    const COST = 80;
    if (status !== 'playing' || score < COST) return;

    const vowels = ['A', 'E', 'I', 'O', 'U'];
    const unrevealedVowels = word.split('').filter(char => vowels.includes(char) && !guessedLetters.has(char));

    if (unrevealedVowels.length === 0) return;

    // We deduplicate the vowels to reveal
    const uniqueVowels = Array.from(new Set(unrevealedVowels));

    set({ score: score - COST });
    uniqueVowels.forEach(v => get().guessLetter(v));
  },

  useFreeService: (type) => {
    const { word, guessedLetters, status, freeServices, mistakes } = get();
    if (status !== 'playing' || freeServices <= 0) return;

    if (type === 'hint') {
      const unrevealedLetters = word.split('').filter(char => !guessedLetters.has(char));
      if (unrevealedLetters.length === 0) return;
      const randomLetter = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
      set({ freeServices: freeServices - 1 });
      get().guessLetter(randomLetter);
    } else if (type === 'heal') {
      if (mistakes === 0) return;
      set({ freeServices: freeServices - 1, mistakes: mistakes - 1 });
    }
  },

  resetGame: () => {
    set({
      word: '',
      clue: '',
      category: null,
      difficulty: null,
      guessedLetters: new Set(),
      mistakes: 0,
      status: 'idle',
      score: 0,
      level: 1,
      combo: 1,
      isDaily: false,
    });
  },

  nextLevel: () => {
    const { category, difficulty, level } = get();
    if (!category || !difficulty) return;

    const wordData = getRandomWordData(category, difficulty);
    set({
      word: wordData.word,
      clue: wordData.clue,
      guessedLetters: new Set(),
      mistakes: 0,
      status: 'playing',
      level: level + 1,
      combo: 1,
      freeServices: get().freeServices + 2,
    });
  },
}));
