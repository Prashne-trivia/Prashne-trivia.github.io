/**
 * Admin page logic: log in, pick a day file, preview it, publish it to the database.
 * Only accounts listed in the admins table can publish (enforced on the server).
 * Day file format (.js): window.PRASHNE_DAYS['YYYY-MM-DD'] = { issueNumber, title, questions: [7 items] }
 */
const $ = (id) => document.getElementById(id);
let parsed = null;   // { date, issueNumber, title, questions }

function log(msg, bad) { const p = $('log'); p.textContent = msg; p.style.color = bad ? '#c0392b' : '#1e8449'; }

// Read the day file (.js or .json) without running anything outside a tiny sandbox object
function parseDayFile(name, text) {
  let date, day;
  if (name.endsWith('.json')) {
    const j = JSON.parse(text);
    if (j.date) { date = j.date; day = j; } else { date = Object.keys(j)[0]; day = j[date]; }
  } else {
    const fake = { PRASHNE_DAYS: {} };
    new Function('window', text)(fake);
    const keys = Object.keys(fake.PRASHNE_DAYS);
    if (keys.length !== 1) throw new Error('The file must define exactly one date in window.PRASHNE_DAYS');
    date = keys[0]; day = fake.PRASHNE_DAYS[date];
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`Bad date key "${date}" (use YYYY-MM-DD)`);
  if (!Number.isInteger(day.issueNumber)) throw new Error('Missing issueNumber (a whole number)');
  if (!day.title || typeof day.title !== 'string') throw new Error('Missing title');
  if (!Array.isArray(day.questions) || day.questions.length !== 7) throw new Error('Need exactly 7 questions');
  day.questions.forEach((q, i) => {
    const n = i + 1;
    if (!q.question || !q.fact) throw new Error(`Question ${n}: missing question or fact text`);
    if (!Array.isArray(q.options) || q.options.length !== 4) throw new Error(`Question ${n}: needs exactly 4 options`);
    if (![0, 1, 2, 3].includes(q.correctIndex)) throw new Error(`Question ${n}: correctIndex must be 0-3`);
  });
  return { date, issueNumber: day.issueNumber, title: day.title, questions: day.questions };
}

function showPreview(p) {
  const L = ['A', 'B', 'C', 'D'];
  $('preview').innerHTML = `<h3>${esc(p.date)} • Issue #${p.issueNumber} • ${esc(p.title)}</h3>` + p.questions.map((q, i) =>
    `<div class="q"><b>${i + 1}. ${esc(q.question)}</b><br>${q.options.map((o, k) => (k === q.correctIndex ? '✅ ' : '▫️ ') + L[k] + '. ' + esc(o)).join('<br>')}<br><i>💡 ${esc(q.fact)}</i></div>`).join('');
}
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

async function refreshStatus() {
  let admin = false;
  try { admin = !isGuest() && await rpc('is_admin'); } catch (e) {}
  $('status').textContent = isGuest() ? 'Not logged in.' : `Logged in as ${currentUser.email || 'your account'} — ${admin ? 'admin ✓' : 'NOT an admin (see SETUP.md step 6)'}`;
  $('publish').disabled = !(admin && parsed);
}

async function publish() {
  if (!parsed) return;
  $('publish').disabled = true;
  try {
    await rpc('admin_upsert_issue', { p_date: parsed.date, p_number: parsed.issueNumber, p_title: parsed.title, p_questions: parsed.questions });
    log(`Published ${parsed.date} (Issue #${parsed.issueNumber}). Players see it on that date (India time).`);
  } catch (e) {
    const m = errorCode(e);
    log(m === 'issue_already_played' ? 'That date already has plays, so it cannot be replaced.' : m === 'not_admin' ? 'This account is not an admin.' : 'Server error: ' + m, true);
  }
  refreshStatus();
}

window.addEventListener('DOMContentLoaded', async () => {
  try { initSupabase(); await initAuth(); } catch (e) { log(String(e.message || e), true); return; }
  $('file').addEventListener('change', async (ev) => {
    const f = ev.target.files[0]; if (!f) return;
    try { parsed = parseDayFile(f.name, await f.text()); showPreview(parsed); log('File looks good. Check the preview, then publish.'); }
    catch (e) { parsed = null; $('preview').innerHTML = ''; log('Problem in file: ' + e.message, true); }
    refreshStatus();
  });
  $('google').onclick = () => signInWithGoogle();
  $('email-btn').onclick = async () => { const { error } = await signInWithEmail($('email').value.trim()); log(error ? 'Could not send link.' : 'Check your email and open the link here.', !!error); };
  $('logout').onclick = () => signOut();
  $('publish').onclick = publish;
  refreshStatus();
});
