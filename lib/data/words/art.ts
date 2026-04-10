import { WordData } from '../../words';

export const artWords: Record<'noob' | 'casual' | 'pro' | 'veteran' | 'godlike', WordData[]> = {
  noob: [
    { word: 'RED', clue: 'The color of an apple or a fire truck.' },
    { word: 'BLUE', clue: 'The color of the sky and the ocean.' },
    { word: 'GREEN', clue: 'The color of grass and leaves.' },
    { word: 'PINK', clue: 'A light red color often associated with flamingos.' },
    { word: 'WHITE', clue: 'The color of snow or a clean sheet of paper.' },
    { word: 'BLACK', clue: 'The color of the night sky.' }
  ],
  casual: [
    { word: 'RED', clue: 'The color of an apple or a fire truck.' },
    { word: 'BLUE', clue: 'The color of the sky and the ocean.' },
    { word: 'GREEN', clue: 'The color of grass and leaves.' },
    { word: 'PINK', clue: 'A light red color often associated with flamingos.' },
    { word: 'WHITE', clue: 'The color of snow or a clean sheet of paper.' },
    { word: 'BLACK', clue: 'The color of the night sky.' }
  ],
  pro: [
    { word: 'YELLOW', clue: 'The color of the sun and ripe bananas.' },
    { word: 'ORANGE', clue: 'The color of the fruit with the same name.' },
    { word: 'PURPLE', clue: 'A royal color made by mixing red and blue.' },
    { word: 'BROWN', clue: 'The color of chocolate or tree bark.' }
  ],
  veteran: [
    { word: 'SILVER', clue: 'A shiny color like a new coin.' },
    { word: 'GOLDEN', clue: 'A bright shiny color like a trophy.' }
  ],
  godlike: [
    { word: 'RAINBOW', clue: 'It has seven colors and appears after rain.' },
    { word: 'GOLDEN', clue: 'A bright shiny color like a trophy.' }
  ]
};
