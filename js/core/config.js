// App-wide constants
const SITE_URL = 'https://prashne-trivia.github.io/';
const TIME_LIMIT = 40;                       // seconds per question
const RING_CIRCUMFERENCE = 2 * Math.PI * 20; // timer ring (r=20)
const STORAGE_KEY = 'prashne_state_v4';

// Short line shown/shared with the score (index = score 0-7)
const SCORE_PHRASES = [
  "It's Okay, You missed by a lot. ",
  "Atleast it wasn't a zero.",
  'Sheesh! I thought you were better than this.',
  'A solid start!',
  'Right in the middle. Nicely done.',
  'Strong run!',
  'So close to a perfect score!',
  'Flawless. A perfect 7!',
];
function getScorePhrase(score) { return SCORE_PHRASES[score] || 'Solid effort!'; }
