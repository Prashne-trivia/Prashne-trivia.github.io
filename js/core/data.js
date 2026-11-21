// Loads data/config.json (issue list) and individual issue files
let availableIssues = {};

async function loadManifest() {
  try { const res = await fetch('data/config.json'); availableIssues = await res.json(); }
  catch (e) { availableIssues = { startDate: '2026-11-19', issues: { '2026-11-19': { issueNumber: 1, title: 'Issue #1', file: 'data/2026-11-19.json' } } }; }
}
async function loadIssueQuestions(meta) { const res = await fetch(meta.file); return (await res.json()).questions; }
