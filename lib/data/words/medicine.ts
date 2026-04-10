import { WordData } from '../../words';

export const medicineWords: Record<'noob' | 'casual' | 'pro' | 'veteran' | 'godlike', WordData[]> = {
  noob: [
    { word: 'EYE', clue: 'You use these to see the world.' },
    { word: 'EAR', clue: 'You use these to hear sounds.' },
    { word: 'HAND', clue: 'You have five fingers on each of these.' },
    { word: 'FOOT', clue: 'You wear a shoe on this.' },
    { word: 'NOSE', clue: 'You use this to smell flowers.' },
    { word: 'HEAD', clue: 'The part of your body where your brain is.' }
  ],
  casual: [
    { word: 'EYE', clue: 'You use these to see the world.' },
    { word: 'EAR', clue: 'You use these to hear sounds.' },
    { word: 'HAND', clue: 'You have five fingers on each of these.' },
    { word: 'FOOT', clue: 'You wear a shoe on this.' },
    { word: 'NOSE', clue: 'You use this to smell flowers.' },
    { word: 'HEAD', clue: 'The part of your body where your brain is.' }
  ],
  pro: [
    { word: 'LEG', clue: 'You use these to walk and run.' },
    { word: 'ARM', clue: 'Part of your body between your shoulder and hand.' },
    { word: 'MOUTH', clue: 'You use this to talk and eat.' },
    { word: 'KNEE', clue: 'The joint in the middle of your leg.' }
  ],
  veteran: [
    { word: 'FINGER', clue: 'You have ten of these on your hands.' },
    { word: 'STOMACH', clue: 'Where your food goes after you eat it.' }
  ],
  godlike: [
    { word: 'STOMACH', clue: 'Where your food goes after you eat it.' }
  ]
};
