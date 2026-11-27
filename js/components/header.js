/**
 * Header: logo, streak badge, leaderboard, account, sound and theme buttons
 * Edit the markup below; logic for this component lives in this file too.
 */
const HeaderComponent = {
  html: `<header class="w-full max-w-xl mx-auto px-4 pt-4 pb-2 flex items-center justify-between">
    <button onclick="goHome()" class="flex items-center gap-2.5 group focus:outline-none text-left" title="Return to Prashne Home">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron to-amber-500 flex items-center justify-center text-white font-display font-bold text-xl shadow-arcade-saffron group-hover:scale-105 transition-transform">P</div>
      <div class="hidden min-[430px]:block">
        <div class="flex items-center gap-1.5"><span class="font-display font-bold text-xl tracking-tight leading-none text-gray-900">Prashne</span></div>
        <p class="text-[11px] font-medium text-ink-700/70 dark:text-gray-400 mt-0.5">Daily Trivia</p>
      </div>
    </button>
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-ink-800 border border-paper-200 dark:border-ink-700 shadow-sm" title="Current Daily Streak"><span class="text-sm">🔥</span><span id="header-streak" class="font-display font-bold text-sm">0</span></div>
      <button onclick="openLeaderboard()" title="Leaderboard" class="p-2 rounded-xl bg-white dark:bg-ink-800 border border-paper-200 dark:border-ink-700 text-ink-800 dark:text-gray-200 hover:border-saffron"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4zM17 5h3v2a3 3 0 01-3 3M7 5H4v2a3 3 0 003 3"/></svg></button>
      <button onclick="onAccountClick()" title="Account" class="px-2.5 py-1.5 rounded-xl bg-white dark:bg-ink-800 border border-paper-200 dark:border-ink-700 text-ink-800 dark:text-gray-200 hover:border-saffron font-display font-bold text-xs max-w-[5.5rem] truncate"><span id="account-label">Log in</span></button>
      <button id="btn-sound" onclick="toggleSound()" class="p-2 rounded-xl bg-white dark:bg-ink-800 border border-paper-200 dark:border-ink-700 text-ink-800 dark:text-gray-200 hover:border-saffron/50 transition-colors" title="Toggle sound" aria-label="Toggle sound">
        <svg id="icon-sound-on" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" /></svg>
        <svg id="icon-sound-off" class="w-4 h-4 hidden text-gray-400" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" /></svg>
      </button>
      <button id="btn-theme" onclick="toggleTheme()" class="p-2 rounded-xl bg-white dark:bg-ink-800 border border-paper-200 dark:border-ink-700 text-ink-800 dark:text-gray-200 hover:border-saffron/50 transition-colors" title="Toggle theme" aria-label="Toggle theme">
        <svg id="icon-sun" class="w-4 h-4 hidden dark:block text-amber-400" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><path stroke-linecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>
        <svg id="icon-moon" class="w-4 h-4 block dark:hidden text-indigoRoyal" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path></svg>
      </button>
    </div>
  </header>`,
  mount() { document.getElementById('app-header').innerHTML = this.html; },
};
