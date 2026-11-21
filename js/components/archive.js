/**
 * Archive modal: list of past issues
 * Edit the markup below; logic for this component lives in this file too.
 */
const ArchiveComponent = {
  html: `<div id="archive-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-center justify-center p-4"><div class="w-full max-w-md rounded-3xl bg-white dark:bg-ink-900 border-2 border-paper-200 dark:border-ink-700 p-6 shadow-2xl space-y-5 max-h-[85vh] flex flex-col"><div class="flex items-center justify-between"><div><h2 class="font-display font-bold text-xl">Prashne Archive</h2><p class="text-xs text-gray-500">Play previous past editions</p></div><button onclick="closeArchiveModal()" class="p-2 rounded-xl bg-paper-100 dark:bg-ink-800 text-gray-500 hover:text-white">✕</button></div><div id="archive-list" class="space-y-3 overflow-y-auto pr-1 flex-1"></div></div></div>`,
  mount() { document.getElementById('app-modal-slot').innerHTML = this.html; },

  // Build the list of past issues and show the modal
  open() {
    playTone('click');
    const list = document.getElementById('archive-list'); list.innerHTML = '';
    Object.entries(availableIssues.issues || {})
      .filter(([dateStr]) => dateStr <= getTodayKey())   // hide future issues
      .sort((a, b) => b[0].localeCompare(a[0]))          // newest first
      .forEach(([dateStr, meta]) => {
      const isPlayed = !!appState.completedDates[dateStr];
      const item = document.createElement('div');
      item.className = 'p-4 rounded-2xl bg-paper-50 dark:bg-ink-800/80 border border-paper-200 dark:border-ink-700 flex items-center justify-between gap-3';
      item.innerHTML = `<div><div class="font-display font-bold text-sm">Issue #${meta.issueNumber} (${dateStr})</div><p class="text-xs text-gray-500">${meta.title}</p></div><button onclick="startArchiveQuiz('${dateStr}')" class="btn-tactile py-2 px-4 rounded-xl bg-saffron text-white font-display font-bold text-xs cursor-pointer">${isPlayed ? 'Review' : 'Play'}</button>`;
      list.appendChild(item);
    });
    document.getElementById('archive-modal').classList.remove('hidden');
  },
  close() { document.getElementById('archive-modal').classList.add('hidden'); },
};
// Called from inline onclick handlers in the markup
function openArchiveModal() { ArchiveComponent.open(); }
function closeArchiveModal() { ArchiveComponent.close(); }
