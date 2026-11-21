/**
 * Results view: score, shareable summary, share buttons, question breakdown
 * Edit the markup below; logic for this component lives in this file too.
 */
const ResultsComponent = {
  html: `<section id="view-results" class="hidden space-y-5 animate-pop">
      <div class="relative overflow-hidden rounded-3xl bg-white dark:bg-ink-900 border-2 border-paper-200 dark:border-ink-700 p-6 sm:p-7 shadow-xl text-center">
        <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-saffron via-peacock to-indigoRoyal"></div>
        <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-saffron/15 text-saffron border border-saffron/30 mb-3"><span id="res-rank-emoji">🏆</span><span id="res-rank-title">Daily Champ</span></div>
        <div class="my-2"><div class="font-display font-bold text-5xl sm:text-6xl tracking-tight"><span id="res-score" class="text-saffron">6</span><span class="text-gray-400 dark:text-gray-600 text-3xl sm:text-4xl">/7</span></div><p id="res-subtitle" class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Prashne #-- • Avg Speed: 6.4s/q</p></div>
        <div class="my-5 p-4 rounded-2xl bg-paper-100 dark:bg-ink-800 border border-paper-200 dark:border-ink-700 max-w-xs mx-auto"><div id="res-emoji-header" class="font-display font-bold text-xs text-gray-600 dark:text-gray-300 mb-2">Prashne #-- 6/7 (68s)</div><div id="res-emoji-grid" class="text-2xl tracking-widest select-all my-1">🟩🟩🟥🟩🟩🟩🟩</div><div id="res-emoji-footer" class="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mt-2">⚡ Avg: 9.8s/q • 🔥 Streak: 1</div><div id="res-site-link-preview" class="text-[11px] font-bold text-saffron mt-1">https://prashne-trivia.github.io/</div></div>
        <div class="grid grid-cols-3 gap-2 mb-6"><div class="p-2.5 rounded-2xl bg-paper-50 dark:bg-ink-800/60 border border-paper-200 dark:border-ink-700"><div id="res-accuracy" class="font-display font-bold text-base sm:text-lg text-peacock">86%</div><div class="text-[10px] font-bold uppercase tracking-wider text-gray-500">Accuracy</div></div><div class="p-2.5 rounded-2xl bg-paper-50 dark:bg-ink-800/60 border border-paper-200 dark:border-ink-700"><div id="res-avg-speed" class="font-display font-bold text-base sm:text-lg">6.4s</div><div class="text-[10px] font-bold uppercase tracking-wider text-gray-500">Avg Speed</div></div><div class="p-2.5 rounded-2xl bg-paper-50 dark:bg-ink-800/60 border border-paper-200 dark:border-ink-700"><div id="res-streak" class="font-display font-bold text-base sm:text-lg text-saffron">1 🔥</div><div class="text-[10px] font-bold uppercase tracking-wider text-gray-500">Daily Streak</div></div></div>
        <div class="space-y-2.5"><button onclick="shareWhatsApp()" class="btn-tactile w-full py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-ink-950 font-display font-bold text-sm sm:text-base shadow-arcade flex items-center justify-center gap-2">📱 <span>Share on WhatsApp</span></button><div class="grid grid-cols-2 gap-2.5"><button onclick="shareInstagram()" class="btn-tactile py-3 px-4 rounded-2xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white font-display font-bold text-xs sm:text-sm">📸 Instagram</button><button onclick="shareFacebook()" class="btn-tactile py-3 px-4 rounded-2xl bg-[#1877F2] hover:bg-[#166FE5] text-white font-display font-bold text-xs sm:text-sm">f Facebook</button></div><div class="grid grid-cols-2 gap-2.5"><button onclick="shareAnywhere()" class="btn-tactile py-3 px-4 rounded-2xl bg-indigoRoyal hover:bg-indigoRoyal/90 text-white font-display font-bold text-xs sm:text-sm">Share score</button><button onclick="copyScoreText()" class="btn-tactile py-3 px-4 rounded-2xl bg-paper-100 dark:bg-ink-800 hover:bg-paper-200 dark:hover:bg-ink-700 border border-paper-200 dark:border-ink-700 font-display font-bold text-xs sm:text-sm">Copy score</button></div></div>
      </div>
      <div class="flex gap-2.5"><button onclick="goHome()" class="btn-tactile w-full py-3.5 px-5 rounded-2xl bg-white dark:bg-ink-900 border border-paper-200 dark:border-ink-700 font-display font-bold text-sm">Return Home</button></div>
      <div class="rounded-3xl bg-white dark:bg-ink-900 border border-paper-200 dark:border-ink-700 p-5 sm:p-6 space-y-4"><div class="flex items-center justify-between"><h3 class="font-display font-bold text-base sm:text-lg">Question Breakdown</h3><span class="text-xs font-semibold text-gray-500">7 Questions</span></div><div id="review-list" class="space-y-3"></div></div>
    </section>`,
  mount() { document.getElementById('app-main').insertAdjacentHTML('beforeend', this.html); },

  // Fill the results view from a finished-game result object
  render(res) {
    latestRes = res;
    const $ = (id) => document.getElementById(id);
    $('res-rank-title').textContent = res.punchline;
    $('res-score').textContent = res.score;
    $('res-subtitle').textContent = `Prashne #${res.issueNumber} • Avg Speed: ${res.avgTime}s/q`;
    $('res-emoji-header').textContent = `Prashne #${res.issueNumber} ${res.score}/7 (${Math.round(res.totalTime)}s)`;
    $('res-emoji-grid').textContent = res.emojiBlocks;
    $('res-emoji-footer').textContent = `⚡ Avg: ${res.avgTime}s/q • 🔥 Streak: ${res.streak}`;
    $('res-accuracy').textContent = `${res.accuracy}%`;
    $('res-avg-speed').textContent = `${res.avgTime}s`;
    $('res-streak').textContent = `${res.streak} 🔥`;

    // Per-question breakdown
    const list = $('review-list'); list.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    res.questions.forEach((q, idx) => {
      const ans = res.answers[idx];
      const item = document.createElement('div');
      item.className = 'p-4 rounded-2xl bg-paper-50 dark:bg-ink-800/70 border border-paper-200 dark:border-ink-700 space-y-2';
      item.innerHTML = `<div class="flex items-center justify-between"><span class="font-bold text-xs text-gray-500">Q${idx + 1}/7</span><span class="text-xs font-bold ${ans.isCorrect ? 'text-peacock' : 'text-rose-500'}">${ans.isCorrect ? 'Correct' : ans.isTimeout ? 'Time out' : 'Incorrect'}</span></div><p class="font-display font-bold text-sm">${q.question}</p><p class="text-xs text-peacock font-semibold">Correct: ${letters[q.correctIndex]}. ${q.options[q.correctIndex]}</p><p class="text-xs text-gray-500">💡 ${q.fact}</p>`;
      list.appendChild(item);
    });
  },
};
