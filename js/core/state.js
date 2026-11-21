// Persistent app state (saved to localStorage) and in-progress game session
let appState = { theme: 'dark', soundEnabled: true, streak: 0, gamesPlayed: 0, bestScore: null, completedDates: {} };
let session = { dateKey: null, issueNumber: 1, questions: [], currentIndex: 0, answers: [], timerInterval: null, questionStartTime: 0, timeRemaining: TIME_LIMIT, isAnswered: false };

function loadState() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) appState = { ...appState, ...JSON.parse(raw) }; } catch (e) {}
  document.documentElement.classList.toggle('dark', appState.theme === 'dark');
  updateSoundIcons();
}
function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(appState)); } catch (e) {} }

// Date key (YYYY-MM-DD) used to match daily issues in data/config.json.
// Kept on a fixed UTC+5:30 clock so everyone gets the new issue at the same moment.
function getTodayKey() {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const t = new Date(utc + (3600000 * 5.5));
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}
