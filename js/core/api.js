// Talks to Supabase. All scoring and answer checking happens on the server (see supabase/schema.sql).
let sb = null;                                        // Supabase client
let availableIssues = { today: null, issues: {} };    // issues up to today, keyed by date

function initSupabase() {
  if (SUPABASE_URL.includes('YOUR-PROJECT')) throw new Error('Set SUPABASE_URL and SUPABASE_ANON_KEY in js/core/config.js');
  sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Call a database function. Errors from the server arrive as short codes in error.message (e.g. 'nickname_taken').
async function rpc(name, args) {
  const { data, error } = await sb.rpc(name, args || {});
  if (error) throw error;
  return data;
}
function errorCode(e) { return (e && e.message) ? e.message : 'unknown_error'; }

async function loadIssues() {
  const d = await rpc('list_issues');
  availableIssues.today = d.today;
  availableIssues.issues = {};
  d.issues.forEach(i => { availableIssues.issues[i.date] = { issueNumber: i.issue_number, title: i.title, finished: i.finished }; });
}
async function refreshStats() { try { myStats = await rpc('my_stats'); } catch (e) {} }

// Friendly text for server error codes
const ERROR_TEXT = {
  nickname_taken: 'That nickname is taken. Try another.',
  invalid_nickname: 'Use 3-15 letters, numbers or underscores.',
  nickname_not_allowed: 'That nickname is not allowed.',
  nickname_change_too_soon: 'You can change your nickname once a month.',
  login_required: 'Please log in first.',
  not_available_yet: 'This issue is not available yet. Check back on its date!',
};
function friendlyError(e) { return ERROR_TEXT[errorCode(e)] || 'Something went wrong. Please try again.'; }
