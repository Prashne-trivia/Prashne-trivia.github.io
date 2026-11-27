// App-wide constants
const SITE_URL = 'https://prashne-trivia.github.io/';
const TIME_LIMIT = 40;                       // seconds per question (must match time_limit() in schema.sql)
const RING_CIRCUMFERENCE = 2 * Math.PI * 20; // timer ring (r=20)
const STORAGE_KEY = 'prashne_state_v5';      // browser storage: only theme + sound now
const BONUS_POINTS = 20;                     // bonus for 7/7 (must match bonus_points() in schema.sql)
const MAX_POINTS = 7 * TIME_LIMIT + BONUS_POINTS;   // 7 x 40 + 20 = 300

// Supabase project (Settings > API). The anon key is meant to be public: the database rules protect the data.
const SUPABASE_URL = 'https://zzkocmnppuovuvtfywxw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_x94yNKK3W4wmRQBHAvvp-A_jtJ972OM';

// Short line shown with the score (index = number of correct answers, 0-7)
/* const SCORE_PHRASES = [
  "It's Okay, You missed by a lot. ",
  "Atleast it wasn't a zero.",
  'Sheesh! I thought you were better than this.',
  'Hehe, Its not bad. /s',
  'Average.',
  'Its Okay! Average IQ is 100.',
  'Will this make your parents happy? No!',
  'Go touch some grass.'
]; */

const SCORE_PHRASES = [
  "Even random guessing would've got you one. Probably.",   // 0
  "One whole point. Treasure it.",                          // 1
  "Two! That's... a number.",                               // 2
  "Almost half. Almost.",                                   // 3
  "Passing, if you squint.",                                // 4
  "Not bad. Your confidence was probably higher, though.",  // 5
  "So close. Don't think about the one you missed. (You will.)", // 6
  "A perfect 7. Go touch some grass.",                                 // 7
];
function getScorePhrase(correct) { return SCORE_PHRASES[correct] || 'Solid effort!'; }
