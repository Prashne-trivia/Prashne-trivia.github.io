/**
 * Leaderboard modal: "Today Board" and "<Month> Board" (top 25 plus your own row).
 * Ranking is decided on the server: points, then lower total time, then earlier finish.
 */
const LeaderboardComponent = {
  html: `
    <div id="leaderboard-modal" class="modal-overlay hidden" onclick="if(event.target===this)closeModal('leaderboard-modal')">
      <div class="modal-card rounded-3xl bg-white dark:bg-ink-900 border border-paper-200 dark:border-ink-700 p-5 space-y-3" style="max-width:28rem">
        <div class="flex items-center justify-between"><h3 class="font-display font-bold text-lg">Leaderboard</h3><button onclick="closeModal('leaderboard-modal')" class="text-gray-400 text-xl leading-none px-2">✕</button></div>
        <div class="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-paper-100 dark:bg-ink-800">
          <button id="lb-tab-daily" onclick="showBoard('daily')" class="py-2 rounded-xl font-display font-bold text-sm">Today Board</button>
          <button id="lb-tab-monthly" onclick="showBoard('monthly')" class="py-2 rounded-xl font-display font-bold text-sm">Month Board</button>
        </div>
        <div id="lb-note" class="text-[11px] text-gray-500"></div>
        <div id="lb-list" class="space-y-1.5"></div>
      </div>
    </div>`,
  mount() { document.body.insertAdjacentHTML('beforeend', this.html); },
};

function openLeaderboard(kind) { playTone('click'); openModal('leaderboard-modal'); showBoard(kind || 'daily'); }

async function showBoard(kind) {
  const list = document.getElementById('lb-list');
  const on = 'bg-white dark:bg-ink-900 shadow-sm', off = 'text-gray-500';
  ['daily', 'monthly'].forEach(k => { document.getElementById('lb-tab-' + k).className = `py-2 rounded-xl font-display font-bold text-sm ${k === kind ? on : off}`; });
  document.getElementById('lb-note').textContent = isGuest()
    ? 'You are playing as a guest. Log in to appear on the board.'
    : 'Ranked by points, then lower total time. Only the day\'s own issue counts.';
  list.innerHTML = '<p class="text-xs text-gray-500 py-4 text-center">Loading…</p>';
  try {
    const d = await rpc(kind === 'daily' ? 'leaderboard_daily' : 'leaderboard_monthly');
    if (kind === 'monthly') {
      const m = new Date(d.month + 'T00:00:00').toLocaleString('en', { month: 'long' });
      document.getElementById('lb-tab-monthly').textContent = `${m} Board`;
    }
    if (!d.rows.length) { list.innerHTML = '<p class="text-xs text-gray-500 py-6 text-center">No scores yet. Be the first!</p>'; return; }
    let prev = 0, html = '';
    d.rows.forEach(r => {
      if (r.pos > prev + 1) html += '<div class="text-center text-gray-400 text-xs leading-none">⋮</div>';
      prev = r.pos;
      const sub = kind === 'daily' ? `${r.correct}/7 • ${fmtTime(r.time)}` : `${r.days} day${r.days > 1 ? 's' : ''} • ${fmtTime(r.time)}`;
      html += `<div class="flex items-center gap-3 px-3 py-2 rounded-2xl border ${r.me ? 'border-saffron bg-saffron/10' : 'border-paper-200 dark:border-ink-700 bg-paper-50 dark:bg-ink-800/60'}">
        <span class="w-7 text-center font-display font-bold text-sm ${r.pos <= 3 ? 'text-saffron' : 'text-gray-500'}">${r.pos}</span>
        <div class="flex-1 min-w-0"><div class="font-display font-bold text-sm truncate">${escapeHtml(r.nickname)}${r.me ? ' <span class="text-[10px] text-saffron">(you)</span>' : ''}</div><div class="text-[11px] text-gray-500">${sub}</div></div>
        <span class="font-display font-bold text-sm tabular-nums">${fmtPoints(r.points)}</span></div>`;
    });
    list.innerHTML = html;
  } catch (e) { list.innerHTML = '<p class="text-xs text-rose-500 py-6 text-center">Could not load the leaderboard.</p>'; }
}
