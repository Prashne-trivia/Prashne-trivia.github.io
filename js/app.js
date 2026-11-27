/**
 * App bootstrap and game flow (start, finish, navigation).
 * Components are mounted in order; each owns its own markup + logic.
 * Scoring, timing and answer checking all happen on the server (see supabase/schema.sql).
 */
function goHome() { clearInterval(session.timerInterval); HomeComponent.render(); switchView('view-home'); }

// Fetch the finished result for a date from the server and show it
async function showResultFor(dateKey) {
  const res = await rpc('get_result', { p_date: dateKey });
  await refreshStats();
  res.streak = myStats.streak || 0;
  ResultsComponent.render(res);
  switchView('view-results');
}

// Start (or resume / review) a given issue
async function startIssue(dateKey) {
  playTone('click');
  const meta = availableIssues.issues?.[dateKey];
  if (!meta) { showToast("This issue is not available yet. Check back soon ⏳"); return; }
  if (!isGuest() && !profile) { openNicknameModal(() => startIssue(dateKey)); return; }   // real accounts need a nickname first
  try {
    if (meta.finished) { await showResultFor(dateKey); return; }
    const st = await rpc('start_attempt', { p_date: dateKey });
    if (st.state === 'finished') { await showResultFor(dateKey); return; }
    beginSession(dateKey, st);
  } catch (e) {
    if (errorCode(e) === 'nickname_required') openNicknameModal(() => startIssue(dateKey));
    else showToast(friendlyError(e));
  }
}
function startDailyQuiz() { return startIssue(getTodayKey()); }
function startArchiveQuiz(dateKey) { closeArchiveModal(); return startIssue(dateKey); }

function beginSession(dateKey, st) {
  const meta = availableIssues.issues[dateKey];
  session = { date: dateKey, issueNumber: meta.issueNumber, attemptId: st.attempt_id, ranked: st.ranked, answers: [], position: st.position, isAnswered: false, finished: false, timerInterval: null, questionStartTime: 0 };
  document.getElementById('game-mode-badge').textContent = `ISSUE #${meta.issueNumber}${st.ranked ? '' : ' • UNRANKED'}`;
  switchView('view-game');
  GameComponent.renderQuestion(st);
}

// After question 7: load the server's result, then refresh the issue list (finished flags) and home stats
async function finishQuiz() {
  playTone('finish');
  try { await showResultFor(session.date); await loadIssues(); HomeComponent.render(); }
  catch (e) { showToast('Could not load your result. Please try again.'); }
}

window.addEventListener('DOMContentLoaded', async () => {
  HeaderComponent.mount();
  HomeComponent.mount(); GameComponent.mount(); ResultsComponent.mount();
  FooterComponent.mount(); ArchiveComponent.mount();
  LoginComponent.mount(); LeaderboardComponent.mount(); ShareComponent.mount();
  loadState();
  try {
    initSupabase();
    await initAuth();
    await Promise.all([loadIssues(), refreshStats()]);
  } catch (e) {
    console.error(e);
    showToast(String(e.message || '').startsWith('Set SUPABASE') ? e.message : 'Could not connect. Check your internet and refresh.');
  }
  updateAccountLabel();
  HomeComponent.render();
});
