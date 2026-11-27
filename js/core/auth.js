// Login: guests get an anonymous session (can play, not ranked). Google or email link makes a real account.
let currentUser = null;   // Supabase user (guest or real)
let profile = null;       // { nickname } for real accounts once chosen

function isGuest() { return !currentUser || currentUser.is_anonymous; }
function pageUrl() { return location.href.split('#')[0].split('?')[0]; }  // where login should return to

async function initAuth() {
  let { data: { session: s } } = await sb.auth.getSession();   // also completes a Google / email-link return
  if (!s) {
    const r = await sb.auth.signInAnonymously();
    if (r.error) throw r.error;
    s = r.data.session;
  }
  currentUser = s.user;
  await loadProfile();
}
async function loadProfile() {
  profile = null;
  if (isGuest()) return;
  const { data } = await sb.from('profiles').select('nickname').eq('user_id', currentUser.id).maybeSingle();
  profile = data || null;
}

function signInWithGoogle() { return sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: pageUrl() } }); }
function signInWithEmail(email) { return sb.auth.signInWithOtp({ email, options: { emailRedirectTo: pageUrl() } }); }
async function signOut() { await sb.auth.signOut(); location.reload(); }   // reload creates a fresh guest session
async function saveNickname(n) { await rpc('set_nickname', { p_nick: n }); await loadProfile(); }
