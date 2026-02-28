export type Difficulty = 'noob' | 'casual' | 'pro' | 'veteran' | 'godlike';
export type Category =
  | 'technology' | 'animals' | 'geography' | 'movies' | 'science'
  | 'mythology' | 'gaming' | 'history' | 'anime' | 'food'
  | 'music' | 'sports' | 'literature' | 'space' | 'magic'
  | 'art' | 'nature' | 'business' | 'medicine' | 'politics';

export interface WordData {
  word: string;
  clue: string;
}

import { EXPANDED_WORDS } from './data/words';

// Merge or use directly the expanded words. We'll export WORDS as the reference.
export const WORDS: Record<Category, Record<Difficulty, WordData[]>> = EXPANDED_WORDS;

