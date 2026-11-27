// Shared UI helpers: theme, sound toggle, toasts, view switching
function toggleTheme() { playTone('click'); appState.theme = appState.theme === 'dark' ? 'light' : 'dark'; document.documentElement.classList.toggle('dark', appState.theme === 'dark'); saveState(); }
function toggleSound() { appState.soundEnabled = !appState.soundEnabled; updateSoundIcons(); if (appState.soundEnabled) playTone('click'); saveState(); }
function updateSoundIcons() {
  const on = document.getElementById('icon-sound-on'), off = document.getElementById('icon-sound-off');
  if (!on || !off) return;
  on.classList.toggle('hidden', !appState.soundEnabled); off.classList.toggle('hidden', appState.soundEnabled);
}
function showToast(msg) {
  const c = document.getElementById('toast-container'); const t = document.createElement('div');
  t.className = 'px-4 py-2.5 rounded-2xl border shadow-lg font-display font-semibold text-xs text-center bg-ink-900 text-white border-ink-700';
  t.textContent = msg; c.appendChild(t); setTimeout(() => t.remove(), 2600);
}
// Show one of: view-home | view-game | view-results. Game view locks the page to the screen height.
function switchView(id) {
  ['view-home', 'view-game', 'view-results'].forEach(v => document.getElementById(v).classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  document.body.classList.toggle('game-active', id === 'view-game');
  window.scrollTo({ top: 0 });
}

// Escape text before putting it into innerHTML (nicknames and DB text are never trusted)
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
const fmtPoints = (p) => Number(p).toFixed(2);   // 24.55
const fmtTime = (t) => `${Number(t).toFixed(1)}s`;
