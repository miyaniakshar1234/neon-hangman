import { WordData } from '../../words';

export const sportsWords: Record<'noob' | 'casual' | 'pro' | 'veteran' | 'godlike', WordData[]> = {
  noob: [
    { word: 'BALL', clue: 'A round object used in many games.' },
    { word: 'RUN', clue: 'Moving quickly on your feet.' },
    { word: 'BAT', clue: 'Used to hit the ball in baseball or cricket.' },
    { word: 'GOLF', clue: 'A game where you hit a tiny ball into a hole.' }
  ],
  casual: [
    { word: 'BALL', clue: 'A round object used in many games.' },
    { word: 'RUN', clue: 'Moving quickly on your feet.' },
    { word: 'BAT', clue: 'Used to hit the ball in baseball or cricket.' },
    { word: 'GOLF', clue: 'A game where you hit a tiny ball into a hole.' }
  ],
  pro: [
    { word: 'SOCCER', clue: 'A game where you kick a ball into a net.' },
    { word: 'TENNIS', clue: 'A game played with rackets and a yellow ball.' },
    { word: 'SWIM', clue: 'Moving through water using your arms and legs.' },
    { word: 'HOCKEY', clue: 'A game played on ice or grass with sticks.' }
  ],
  veteran: [
    { word: 'BASKETBALL', clue: 'A game where you bounce a ball and throw it through a hoop.' },
    { word: 'BASEBALL', clue: 'A game with a bat, ball, and bases.' }
  ],
  godlike: [
    { word: 'BASKETBALL', clue: 'A game where you bounce a ball and throw it through a hoop.' },
    { word: 'VOLLEYBALL', clue: 'A game where you hit a ball over a high net with your hands.' }
  ]
};
