// Loads issue data via <script> tags (works when opened as a local file; no fetch needed).
// data/config.js sets window.PRASHNE_CONFIG; data/<date>.js sets window.PRASHNE_DAYS[<date>].
let availableIssues = {};

// Inject a script tag and wait for it to load
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = () => reject(new Error('Failed to load ' + src));
    document.head.appendChild(s);
  });
}

async function loadManifest() {
  try { await loadScript('data/config.js'); availableIssues = window.PRASHNE_CONFIG || { issues: {} }; }
  catch (e) { availableIssues = { issues: {} }; }
}

// Load one day's questions (script file registers itself under its date key)
async function loadIssueQuestions(meta, dateKey) {
  if (!window.PRASHNE_DAYS?.[dateKey]) await loadScript(meta.file);
  return window.PRASHNE_DAYS[dateKey].questions;
}
