import type { Category } from '../types';

/**
 * Category order and colors match the six stacks of printed ŠtartUP cards.
 * Edit this file to adapt the game for another GDG event.
 */
export const CATEGORIES: readonly Category[] = [
  {
    id: 'google', name: 'Google & Tech', lines: ['GOOGLE', '& TECH'],
    color: '#4285F4',
    description: 'A little Google knowledge and everyday technology. Grab a blue card!',
  },
  {
    id: 'cyber', name: 'Cyber Smart', lines: ['CYBER', 'SMART'],
    color: '#EA4335',
    description: 'Spot a scam, protect your accounts, and stay safe online. Grab a red card!',
  },
  {
    id: 'guess', name: 'Guess the Tech', lines: ['GUESS', 'THE TECH'],
    color: '#34A853',
    description: 'Look at the clues and identify the tech. Grab a green card!',
  },
  {
    id: 'debug', name: 'Debug It!', lines: ['DEBUG', 'IT!'],
    color: '#DA9600',
    description: 'Find the problem and suggest a quick fix. Grab an orange card!',
  },
  {
    id: 'trivia', name: 'Tech Trivia', lines: ['TECH', 'TRIVIA'],
    color: '#7657D9',
    description: 'Fun technology facts — no specialist knowledge needed. Grab a purple card!',
  },
  {
    id: 'wild', name: 'Wildcard', lines: ['WILD', 'CARD'],
    color: '#D44C9A',
    description: 'Expect the unexpected! A quick and playful challenge. Grab a pink card!',
  },
] as const;
