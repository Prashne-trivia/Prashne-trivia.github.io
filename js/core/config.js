// App-wide constants
const SITE_URL = 'https://prashne-trivia.github.io/';
const TIME_LIMIT = 25;                       // seconds per question (must match the SQL functions)
const RING_CIRCUMFERENCE = 2 * Math.PI * 20; // timer ring (r=20)
const STORAGE_KEY = 'prashne_state_v5';      // browser storage: only theme + sound now
const MAX_POINTS = 7 * 25 + 25;              // 7 questions x 25s + 25 bonus for a perfect round

// Supabase project (Settings > API). The anon key is meant to be public: the database rules protect the data.
const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';

// Short line shown with the score (index = number of correct answers, 0-7)
const SCORE_PHRASES = [
  'Tough one today. Tomorrow is a fresh start.',
  'Every expert starts somewhere.',
  'Getting warmer.',
  'A solid start!',
  'Right in the middle. Nicely done.',
  'Strong run!',
  'So close to a perfect score!',
  'Flawless. A perfect 7!',
];
function getScorePhrase(correct) { return SCORE_PHRASES[correct] || 'Solid effort!'; }
