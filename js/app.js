/**
 * App bootstrap and game flow (start, finish, navigation).
 * Components are mounted in order; each owns its own markup + logic.
 */
function goHome() { clearInterval(session.timerInterval); HomeComponent.render(); switchView('view-home'); }

function showResult(res) { ResultsComponent.render(res); switchView('view-results'); }

// Start (or review) a given issue
async function startIssue(dateKey, errorMsg) {
  playTone('click');
  const meta = availableIssues.issues?.[dateKey];
  if (!meta) { showToast("Today's Prashne is not ready yet! Check back tomorrow ⏳"); return; }
  if (appState.completedDates[dateKey]) { showResult(appState.completedDates[dateKey]); return; }
  try { setupQuizSession(dateKey, meta.issueNumber, await loadIssueQuestions(meta, dateKey)); }
  catch (e) { showToast(errorMsg); }
}
function startDailyQuiz() { return startIssue(getTodayKey(), "Could not load today's questions."); }
function startArchiveQuiz(dateKey) { closeArchiveModal(); return startIssue(dateKey, 'Could not load archive issue.'); }

function setupQuizSession(dateKey, issueNum, questions) {
  session = { dateKey, issueNumber: issueNum, questions, currentIndex: 0, answers: [], timerInterval: null, questionStartTime: 0, timeRemaining: TIME_LIMIT, isAnswered: false };
  document.getElementById('game-mode-badge').textContent = `ISSUE #${issueNum}`;
  switchView('view-game'); GameComponent.renderQuestion();
}

// Compute score, update stats/streak, save, show results
function finishQuiz() {
  playTone('finish');
  const score = session.answers.filter(a => a.isCorrect).length;
  const totalTime = Number(session.answers.reduce((acc, a) => acc + a.timeTaken, 0).toFixed(1));
  const avgTime = Number((totalTime / 7).toFixed(1));
  const emojiBlocks = session.answers.map(a => a.isTimeout ? '🟨' : (a.isCorrect ? '🟩' : '🟥')).join('');
  appState.gamesPlayed += 1;
  if (appState.bestScore === null || score > appState.bestScore) appState.bestScore = score;
  const todayStr = getTodayKey();
  if (session.dateKey === todayStr && !appState.completedDates[todayStr]) appState.streak += 1;
  const res = { date: session.dateKey, issueNumber: session.issueNumber, score, totalTime, avgTime, accuracy: Math.round((score / 7) * 100), streak: appState.streak, punchline: getScorePhrase(score), emojiBlocks, questions: session.questions, answers: session.answers };
  appState.completedDates[session.dateKey] = res; saveState(); showResult(res);
}

window.addEventListener('DOMContentLoaded', async () => {
  HeaderComponent.mount();
  HomeComponent.mount(); GameComponent.mount(); ResultsComponent.mount();
  FooterComponent.mount(); ArchiveComponent.mount();
  await loadManifest();
  loadState(); HomeComponent.render();
});
