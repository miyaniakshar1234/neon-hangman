import { WordData } from '../../words';

export const natureWords: Record<'noob' | 'casual' | 'pro' | 'veteran' | 'godlike', WordData[]> = {
  noob: [
    { word: 'SUN', clue: 'The big yellow star that gives us light.' },
    { word: 'MOON', clue: 'It shines in the night sky.' },
    { word: 'STAR', clue: 'A tiny twinkling light in the night sky.' },
    { word: 'RAIN', clue: 'Water that falls from the clouds.' },
    { word: 'TREE', clue: 'A tall plant with a trunk and leaves.' },
    { word: 'SNOW', clue: 'Cold white flakes that fall in winter.' }
  ],
  casual: [
    { word: 'SUN', clue: 'The big yellow star that gives us light.' },
    { word: 'MOON', clue: 'It shines in the night sky.' },
    { word: 'STAR', clue: 'A tiny twinkling light in the night sky.' },
    { word: 'RAIN', clue: 'Water that falls from the clouds.' },
    { word: 'TREE', clue: 'A tall plant with a trunk and leaves.' },
    { word: 'SNOW', clue: 'Cold white flakes that fall in winter.' }
  ],
  pro: [
    { word: 'RIVER', clue: 'A long stream of flowing water.' },
    { word: 'FLOWER', clue: 'A colorful plant that smells nice.' },
    { word: 'CLOUD', clue: 'A white fluffy thing in the sky.' },
    { word: 'MOUNTAIN', clue: 'A very tall pile of rock and earth.' }
  ],
  veteran: [
    { word: 'FOREST', clue: 'A large area covered with many trees.' },
    { word: 'OCEAN', clue: 'A vast body of salty water.' }
  ],
  godlike: [
    { word: 'RAINBOW', clue: 'A colorful arc in the sky after rain.' },
    { word: 'FOREST', clue: 'A large area covered with many trees.' }
  ]
};
