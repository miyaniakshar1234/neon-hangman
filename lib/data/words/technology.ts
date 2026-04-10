import { WordData } from '../../words';

export const technologyWords: Record<'noob' | 'casual' | 'pro' | 'veteran' | 'godlike', WordData[]> = {
  noob: [
    { word: 'PEN', clue: 'You use it to write with ink.' },
    { word: 'CUP', clue: 'You drink water or juice from it.' },
    { word: 'BAG', clue: 'You carry your school books in it.' },
    { word: 'KEY', clue: 'Used to unlock a door.' },
    { word: 'BUS', clue: 'A large vehicle that takes many people to school or work.' },
    { word: 'CAR', clue: 'A vehicle with four wheels that your family drives.' },
    { word: 'BIKE', clue: 'It has two wheels and you pedal to move it.' }
  ],
  casual: [
    { word: 'BOOK', clue: 'It has pages with stories and pictures.' },
    { word: 'BOAT', clue: 'It floats on water and takes you across rivers.' },
    { word: 'VAN', clue: 'A vehicle larger than a car, used for carrying things or groups.' },
    { word: 'CLOCK', clue: 'It tells you what time it is.' }
  ],
  pro: [
    { word: 'PHONE', clue: 'You use it to call people or watch videos.' },
    { word: 'PLANE', clue: 'It has wings and flies high in the air.' },
    { word: 'TRAIN', clue: 'It runs on tracks and goes "Choo-choo".' },
    { word: 'TABLE', clue: 'A piece of furniture where you eat or do homework.' }
  ],
  veteran: [
    { word: 'COMPUTER', clue: 'A machine used for typing, games, and browsing.' },
    { word: 'UMBRELLA', clue: 'It keeps you dry when it is raining.' },
    { word: 'ROCKET', clue: 'It goes very fast into outer space.' }
  ],
  godlike: [
    { word: 'HELICOPTER', clue: 'It has spinning blades on top and can fly straight up.' },
    { word: 'TELEVISION', clue: 'A screen that shows movies and cartoons.' }
  ]
};
