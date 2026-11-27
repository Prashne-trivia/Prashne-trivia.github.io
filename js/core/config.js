// App-wide constants
const SITE_URL = 'https://prashne-trivia.github.io/';
const TIME_LIMIT = 40;                       // seconds per question (must match the SQL functions)
const RING_CIRCUMFERENCE = 2 * Math.PI * 20; // timer ring (r=20)
const STORAGE_KEY = 'prashne_state_v5';      // browser storage: only theme + sound now
const MAX_POINTS = 7 * 40 + 20;              // 7 questions x 25s + 25 bonus for a perfect round

// Supabase project (Settings > API). The anon key is meant to be public: the database rules protect the data.
const SUPABASE_URL = 'https://zzkocmnppuovuvtfywxw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_x94yNKK3W4wmRQBHAvvp-A_jtJ972OM';

// Short line shown with the score (index = number of correct answers, 0-7)
const SCORE_PHRASES = [
  "It's Okay, You missed by a lot. ",
  "Atleast it wasn't a zero.",
  'Sheesh! I thought you were better than this.',
  'Hehe, Its not bad. /s',
  'Average.',
  'Its Okay! Average IQ is 100.',
  'Will this make your parents happy? No!',
  'Go touch some grass.'
];
function getScorePhrase(correct) { return SCORE_PHRASES[correct] || 'Solid effort!'; }
