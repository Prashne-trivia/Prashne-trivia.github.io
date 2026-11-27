/**
 * Results view: points, rank, share button, and a "what you learned" review of every question.
 * Data comes from the server (get_result), so it matches what the leaderboard uses.
 */
const ResultsComponent = {
  html: `
    <section id="view-results" class="hidden space-y-4 animate-pop">
      <div class="rounded-3xl bg-white dark:bg-ink-900 border-2 border-paper-200 dark:border-ink-700 p-5 text-center shadow-lg">
        <div class="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-saffron/15 text-saffron border border-saffron/30 mb-3"><span id="res-rank-title">Done!</span></div>
        <div class="font-display font-bold text-5xl sm:text-6xl tracking-tight"><span id="res-points" class="text-saffron">0.00</span><span id="res-max" class="text-gray-400 dark:text-gray-600 text-xl sm:text-2xl"> / 300</span></div>
        <p id="res-subtitle" class="text-xs text-gray-500 mt-1"></p>
        <p id="res-bonus" class="hidden text-xs font-bold text-peacock mt-1"><span id="res-bonus-text">+20</span> perfect-round bonus</p>
        <div id="res-rank-box" class="mt-4 p-3 rounded-2xl bg-paper-100 dark:bg-ink-800 border border-paper-200 dark:border-ink-700 text-sm"></div>
        <div class="mt-4 p-4 rounded-2xl bg-paper-100 dark:bg-ink-800 border border-paper-200 dark:border-ink-700 max-w-xs mx-auto">
          <div id="res-emoji-header" class="font-display font-bold text-xs mb-2"></div>
          <div id="res-emoji-grid" class="text-2xl tracking-wide mb-2"></div>
          <div id="res-emoji-footer" class="text-xs text-gray-500"></div>
        </div>
      </div>
      <div class="space-y-2.5">
        <button onclick="openShareModal()" class="btn-tactile w-full py-3.5 px-5 rounded-2xl bg-saffron hover:bg-saffron-hover text-white font-display font-bold text-sm">Share your score</button>
        <div class="flex gap-2.5">
          <button onclick="openLeaderboard()" class="btn-tactile w-full py-3.5 px-5 rounded-2xl bg-white dark:bg-ink-900 border border-paper-200 dark:border-ink-700 font-display font-bold text-sm">Leaderboard</button>
          <button onclick="goHome()" class="btn-tactile w-full py-3.5 px-5 rounded-2xl bg-white dark:bg-ink-900 border border-paper-200 dark:border-ink-700 font-display font-bold text-sm">Home</button>
        </div>
      </div>
      <div class="rounded-3xl bg-white dark:bg-ink-900 border border-paper-200 dark:border-ink-700 p-5 space-y-3">
        <h3 class="font-display font-bold text-base">What you learned today</h3>
        <div id="review-list" class="space-y-2.5"></div>
      </div>
    </section>`,
  mount() { document.getElementById('app-main').insertAdjacentHTML('beforeend', this.html); },

  // Fill the view from a get_result response (plus res.streak added by app.js)
  render(res) {
    res.emojiBlocks = res.answers.map(a => a.selected_index === null ? '🟨' : (a.correct ? '🟩' : '🟥')).join('');
    res.punchline = getScorePhrase(res.correct_count);
    latestRes = res;
    const $ = (id) => document.getElementById(id);
    $('res-rank-title').textContent = res.punchline;
    $('res-points').textContent = fmtPoints(res.points);
    $('res-max').textContent = ` / ${MAX_POINTS}`;
    $('res-bonus-text').textContent = `+${Number(res.bonus)}`;
    $('res-subtitle').textContent = `Prashne #${res.issue_number} • ${res.correct_count}/7 correct • ${fmtTime(res.total_time)} total`;
    $('res-bonus').classList.toggle('hidden', !(Number(res.bonus) > 0));
    $('res-emoji-header').textContent = `Prashne #${res.issue_number} • ${fmtPoints(res.points)} pts`;
    $('res-emoji-grid').textContent = res.emojiBlocks;
    $('res-emoji-footer').textContent = `${res.correct_count}/7 • ${fmtTime(res.total_time)} • 🔥 Streak: ${res.streak || 0}`;

    // Rank / guest / practice note
    const box = $('res-rank-box');
    if (res.ranked && res.rank_today) {
      box.innerHTML = `You are <b class="text-saffron">#${res.rank_today}</b> on today's board. <button onclick="openLeaderboard()" class="underline font-semibold">See board</button>`;
    } else if (res.date === getTodayKey() && isGuest()) {
      box.innerHTML = `Playing as a guest, so this score is not ranked. <button onclick="openLoginModal()" class="underline font-semibold text-saffron">Log in</button> to join the board.`;
    } else {
      box.textContent = 'Past issue: practice only, not ranked.';
    }

    // Invite guests to sign in (closable popup, once a day)
    if (!res.ranked && isGuest() && res.date === getTodayKey()) setTimeout(maybeShowLoginPrompt, 900);

    // Review: the fact is the main point of each card
    const letters = ['A', 'B', 'C', 'D'];
    const list = $('review-list'); list.innerHTML = '';
    res.answers.forEach((a, idx) => {
      const timeout = a.selected_index === null;
      const status = a.correct ? `<span class="text-peacock">Correct +${fmtPoints(a.points)}</span>` : (timeout ? '<span class="text-amber-500">Time out</span>' : '<span class="text-rose-500">Incorrect</span>');
      const yours = (!a.correct && !timeout) ? `<p class="text-xs text-gray-500">Your answer: ${letters[a.selected_index]}. ${escapeHtml(a.options[a.selected_index])}</p>` : '';
      const item = document.createElement('div');
      item.className = 'p-4 rounded-2xl bg-paper-50 dark:bg-ink-800/70 border border-paper-200 dark:border-ink-700 space-y-2';
      item.innerHTML = `<div class="flex items-center justify-between text-xs font-bold"><span class="text-gray-500">Q${idx + 1}/7</span>${status}</div>
        <p class="font-display font-bold text-sm">${escapeHtml(a.question)}</p>
        <p class="text-xs text-peacock font-semibold">Answer: ${letters[a.correct_index]}. ${escapeHtml(a.options[a.correct_index])}</p>${yours}
        <p class="text-xs text-gray-700 dark:text-gray-300 bg-saffron/10 border border-saffron/20 rounded-xl p-2.5">💡 ${escapeHtml(a.fact)}</p>`;
      list.appendChild(item);
    });
  },
};
