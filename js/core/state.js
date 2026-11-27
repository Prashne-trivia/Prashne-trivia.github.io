// Local state (theme + sound only) and the in-progress game session.
// Scores, streaks and results now live on the server (see api.js).
let appState = { theme: 'dark', soundEnabled: true, promptDismissedDate: null };   // promptDismissedDate: day the login prompt was closed
let myStats = { played: 0, best_correct: null, best_points: null, streak: 0 };
let session = { date: null, issueNumber: 1, attemptId: null, ranked: false, answers: [], position: 1, isAnswered: false, finished: false, timerInterval: null, questionStartTime: 0 };

function loadState() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) appState = { ...appState, ...JSON.parse(raw) }; } catch (e) {}
  document.documentElement.classList.toggle('dark', appState.theme === 'dark');
  updateSoundIcons();
}
function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(appState)); } catch (e) {} }

// Today's date key (YYYY-MM-DD). The server's date wins; the local calculation (fixed UTC+5:30) is only a fallback.
function getTodayKey() {
  if (availableIssues.today) return availableIssues.today;
  const d = new Date();
  const t = new Date(d.getTime() + d.getTimezoneOffset() * 60000 + 3600000 * 5.5);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}
