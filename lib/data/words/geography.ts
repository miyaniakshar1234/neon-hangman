import { WordData } from '../../words';

export const geographyWords: Record<'noob' | 'casual' | 'pro' | 'veteran' | 'godlike', WordData[]> = {
  noob: [
    { word: 'DESK', clue: 'A table you sit at in school.' },
    { word: 'BELL', clue: 'It rings when it is time for class or break.' },
    { word: 'BOOK', clue: 'Read this to learn new things.' },
    { word: 'MAP', clue: 'A drawing that shows where places are in the world.' }
  ],
  casual: [
    { word: 'DESK', clue: 'A table you sit at in school.' },
    { word: 'BELL', clue: 'It rings when it is time for class or break.' },
    { word: 'BOOK', clue: 'Read this to learn new things.' },
    { word: 'MAP', clue: 'A drawing that shows where places are in the world.' }
  ],
  pro: [
    { word: 'PENCIL', clue: 'Used for writing and can be erased.' },
    { word: 'ERASER', clue: 'Used to rub out pencil mistakes.' },
    { word: 'TEACHER', clue: 'The person who helps you learn in class.' },
    { word: 'STUDENT', clue: 'A person who is learning at school.' }
  ],
  veteran: [
    { word: 'PAPER', clue: 'A thin material you write on.' },
    { word: 'SCHOOL', clue: 'The place where you go to learn.' }
  ],
  godlike: [
    { word: 'LIBRARY', clue: 'A place where many books are kept.' },
    { word: 'HOMEWORK', clue: 'Work your teacher gives you to do at home.' }
  ]
};
