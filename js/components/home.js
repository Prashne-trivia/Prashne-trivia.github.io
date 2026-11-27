/**
 * Home view: issue card, play/archive buttons, stats
 * Edit the markup below; logic for this component lives in this file too.
 */
const HomeComponent = {
  html: `<section id="view-home" class="space-y-5 animate-pop">
      <div class="relative overflow-hidden rounded-3xl bg-white dark:bg-ink-900 border-2 border-paper-200 dark:border-ink-700 p-6 sm:p-8 shadow-xl">
        <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-saffron via-peacock to-indigoRoyal"></div>
        <div class="flex flex-wrap items-center justify-between gap-2 mb-5">
          <span id="home-issue-badge" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-indigoRoyal/10 dark:bg-indigoRoyal/30 text-indigoRoyal dark:text-purple-300">ISSUE #--</span>
          <span id="home-date-label" class="text-xs font-semibold text-gray-500 dark:text-gray-400">--</span>
        </div>
        <div class="space-y-3 mb-6">
          <div class="inline-flex items-center gap-2 text-saffron font-display font-bold text-sm tracking-wide"><span>THE DAILY 7</span></div>
          <h1 class="font-display font-bold text-3xl sm:text-4xl tracking-tight leading-[1.12]">Seven sharp questions. <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-saffron to-amber-500">25 seconds</span> on the clock.</h1>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">Test your general knowledge on pop culture, tech, cinema, and history. Play today's drop and share your score instantly.</p>
        </div>
        <div class="space-y-3">
          <button id="btn-play-daily" onclick="startDailyQuiz()" class="btn-tactile w-full py-4 px-6 rounded-2xl bg-saffron hover:bg-saffron-hover text-white font-display font-bold text-lg tracking-wide shadow-arcade-saffron flex items-center justify-center gap-2"><span id="btn-play-text">Play Today's Prashne</span><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></button>
          <button onclick="openArchiveModal()" class="btn-tactile w-full py-3.5 px-5 rounded-2xl bg-paper-100 dark:bg-ink-800 hover:bg-paper-200/70 dark:hover:bg-ink-700 text-ink-900 dark:text-gray-100 font-display font-bold text-sm flex items-center justify-center gap-2"><span>📂</span><span>View Archive & Past Issues</span></button>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div class="rounded-2xl bg-white dark:bg-ink-900 border border-paper-200 dark:border-ink-700 p-3.5 text-center"><div id="stat-played" class="font-display font-bold text-xl">0</div><div class="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-0.5">Played</div></div>
        <div class="rounded-2xl bg-white dark:bg-ink-900 border border-paper-200 dark:border-ink-700 p-3.5 text-center"><div id="stat-streak" class="font-display font-bold text-xl text-saffron">0 🔥</div><div class="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-0.5">Streak</div></div>
        <div class="rounded-2xl bg-white dark:bg-ink-900 border border-paper-200 dark:border-ink-700 p-3.5 text-center"><div id="stat-best" class="font-display font-bold text-xl text-peacock">- / 7</div><div class="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-0.5">Best Score</div></div>
      </div>
    </section>`,
  mount() { document.getElementById('app-main').insertAdjacentHTML('beforeend', this.html); },

  // Refresh the home view from server data (issue list + your stats)
  render() {
    const todayStr = getTodayKey();
    const issueMeta = availableIssues.issues?.[todayStr];
    document.getElementById('header-streak').textContent = myStats.streak || 0;
    document.getElementById('stat-played').textContent = myStats.played || 0;
    document.getElementById('stat-streak').textContent = `${myStats.streak || 0} 🔥`;
    document.getElementById('stat-best').textContent = myStats.best_correct != null ? `${myStats.best_correct} / 7` : '- / 7';
    if (issueMeta) {
      document.getElementById('home-issue-badge').textContent = `ISSUE #${issueMeta.issueNumber}`;
      document.getElementById('home-date-label').textContent = new Date(`${todayStr}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      document.getElementById('btn-play-text').textContent = issueMeta.finished ? `View Today's Score` : `Play Today's Prashne`;
    } else {
      document.getElementById('home-issue-badge').textContent = 'UPCOMING';
      document.getElementById('home-date-label').textContent = todayStr;
      document.getElementById('btn-play-text').textContent = `Today's Prashne Is Not Ready Yet`;
    }
  },
};
