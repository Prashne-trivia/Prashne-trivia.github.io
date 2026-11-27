/**
 * Login, nickname and account modals.
 * Guests can play without logging in; logging in (Google or email link) adds them to the leaderboards.
 */
const LoginComponent = {
  html: `
    <!-- Login -->
    <div id="login-modal" class="modal-overlay hidden" onclick="if(event.target===this)closeModal('login-modal')">
      <div class="modal-card rounded-3xl bg-white dark:bg-ink-900 border border-paper-200 dark:border-ink-700 p-5 space-y-4">
        <div class="flex items-center justify-between"><h3 class="font-display font-bold text-lg">Log in</h3><button onclick="closeModal('login-modal')" class="text-gray-400 text-xl leading-none px-2">✕</button></div>
        <p class="text-xs text-gray-600 dark:text-gray-400">Log in to appear on the leaderboards and keep your streak on every device. You can always play as a guest.</p>
        <button onclick="doGoogleLogin()" class="btn-tactile w-full py-3 px-4 rounded-2xl bg-white dark:bg-ink-800 border border-paper-200 dark:border-ink-700 font-display font-bold text-sm">Continue with Google</button>
        <div class="flex items-center gap-2 text-[11px] text-gray-400"><div class="flex-1 h-px bg-paper-200 dark:bg-ink-700"></div>or<div class="flex-1 h-px bg-paper-200 dark:bg-ink-700"></div></div>
        <input id="login-email" type="email" autocomplete="email" placeholder="you@example.com" class="w-full px-4 py-3 rounded-2xl bg-paper-50 dark:bg-ink-800 border border-paper-200 dark:border-ink-700 text-sm outline-none focus:border-saffron" />
        <button id="login-email-btn" onclick="doEmailLogin()" class="btn-tactile w-full py-3 px-4 rounded-2xl bg-saffron hover:bg-saffron-hover text-white font-display font-bold text-sm">Email me a login link</button>
        <p id="login-msg" class="text-xs text-center min-h-[1rem]"></p>
      </div>
    </div>

    <!-- Sign-in prompt for guests (closable, shown at most once a day) -->
    <div id="login-prompt-modal" class="modal-overlay hidden" onclick="if(event.target===this)dismissLoginPrompt()">
      <div class="modal-card rounded-3xl bg-white dark:bg-ink-900 border border-paper-200 dark:border-ink-700 p-5 space-y-4 text-center">
        <div class="flex justify-end"><button onclick="dismissLoginPrompt()" aria-label="Close" class="text-gray-400 text-xl leading-none px-2">✕</button></div>
        <div class="text-4xl -mt-2">🏆</div>
        <h3 class="font-display font-bold text-lg">Sign in to join the leaderboards</h3>
        <p class="text-xs text-gray-600 dark:text-gray-400">You're playing as a guest, so your score isn't ranked. Sign in to compete on the daily and monthly boards and keep your streak on every device.</p>
        <button onclick="acceptLoginPrompt()" class="btn-tactile w-full py-3 px-4 rounded-2xl bg-saffron hover:bg-saffron-hover text-white font-display font-bold text-sm">Sign in</button>
        <button onclick="dismissLoginPrompt()" class="w-full py-2 text-xs text-gray-500 underline">Maybe later</button>
      </div>
    </div>

    <!-- Nickname -->
    <div id="nickname-modal" class="modal-overlay hidden">
      <div class="modal-card rounded-3xl bg-white dark:bg-ink-900 border border-paper-200 dark:border-ink-700 p-5 space-y-4">
        <div class="flex items-center justify-between"><h3 class="font-display font-bold text-lg">Choose a nickname</h3><button onclick="closeModal('nickname-modal')" class="text-gray-400 text-xl leading-none px-2">✕</button></div>
        <p class="text-xs text-gray-600 dark:text-gray-400">This is the only thing shown on the leaderboard. 3-15 letters, numbers or underscores. You can change it once a month.</p>
        <input id="nickname-input" type="text" maxlength="15" autocomplete="off" placeholder="e.g. QuizFox_7" class="w-full px-4 py-3 rounded-2xl bg-paper-50 dark:bg-ink-800 border border-paper-200 dark:border-ink-700 text-sm outline-none focus:border-saffron" />
        <button id="nickname-save-btn" onclick="doSaveNickname()" class="btn-tactile w-full py-3 px-4 rounded-2xl bg-saffron hover:bg-saffron-hover text-white font-display font-bold text-sm">Save nickname</button>
        <p id="nickname-msg" class="text-xs text-center min-h-[1rem] text-rose-500"></p>
      </div>
    </div>

    <!-- Account -->
    <div id="account-modal" class="modal-overlay hidden" onclick="if(event.target===this)closeModal('account-modal')">
      <div class="modal-card rounded-3xl bg-white dark:bg-ink-900 border border-paper-200 dark:border-ink-700 p-5 space-y-3">
        <div class="flex items-center justify-between"><h3 class="font-display font-bold text-lg">Your account</h3><button onclick="closeModal('account-modal')" class="text-gray-400 text-xl leading-none px-2">✕</button></div>
        <p class="text-sm">Nickname: <span id="account-nick" class="font-bold"></span></p>
        <button onclick="closeModal('account-modal'); openNicknameModal()" class="btn-tactile w-full py-3 px-4 rounded-2xl bg-paper-100 dark:bg-ink-800 border border-paper-200 dark:border-ink-700 font-display font-bold text-sm">Change nickname</button>
        <button onclick="signOut()" class="btn-tactile w-full py-3 px-4 rounded-2xl bg-white dark:bg-ink-900 border border-paper-200 dark:border-ink-700 font-display font-bold text-sm">Log out</button>
      </div>
    </div>`,
  mount() { document.body.insertAdjacentHTML('beforeend', this.html); },
};

let nicknameDoneCallback = null;   // run after the nickname is saved (e.g. continue starting a game)

function updateAccountLabel() {
  const el = document.getElementById('account-label'); if (!el) return;
  el.textContent = isGuest() ? 'Log in' : (profile ? profile.nickname : 'Set nickname');
}
function onAccountClick() {
  playTone('click');
  if (isGuest()) openLoginModal();
  else if (!profile) openNicknameModal();
  else { document.getElementById('account-nick').textContent = profile.nickname; openModal('account-modal'); }
}
function openLoginModal() { document.getElementById('login-msg').textContent = ''; openModal('login-modal'); }
function openNicknameModal(onDone) {
  nicknameDoneCallback = onDone || null;
  document.getElementById('nickname-msg').textContent = '';
  document.getElementById('nickname-input').value = profile ? profile.nickname : '';
  openModal('nickname-modal');
}

async function doGoogleLogin() {
  const { error } = await signInWithGoogle();
  if (error) { const m = document.getElementById('login-msg'); m.className = 'text-xs text-center text-rose-500'; m.textContent = 'Could not start Google login.'; }
}
async function doEmailLogin() {
  const email = document.getElementById('login-email').value.trim();
  const msg = document.getElementById('login-msg');
  if (!/^\S+@\S+\.\S+$/.test(email)) { msg.className = 'text-xs text-center text-rose-500'; msg.textContent = 'Enter a valid email.'; return; }
  const btn = document.getElementById('login-email-btn'); btn.disabled = true;
  const { error } = await signInWithEmail(email);
  btn.disabled = false;
  if (error) { msg.className = 'text-xs text-center text-rose-500'; msg.textContent = 'Could not send the link. Try again in a minute.'; }
  else { msg.className = 'text-xs text-center text-peacock'; msg.textContent = 'Check your email and open the link on this device.'; }
}
async function doSaveNickname() {
  const msg = document.getElementById('nickname-msg'); msg.textContent = '';
  const btn = document.getElementById('nickname-save-btn'); btn.disabled = true;
  try {
    await saveNickname(document.getElementById('nickname-input').value);
    closeModal('nickname-modal'); updateAccountLabel(); showToast('Nickname saved ✓');
    const cb = nicknameDoneCallback; nicknameDoneCallback = null; if (cb) cb();
  } catch (e) { msg.textContent = friendlyError(e); }
  btn.disabled = false;
}

// ---- Guest sign-in prompt ----
// Shows a closable popup to guests, at most once per day. Call maybeShowLoginPrompt() wherever you want it.
function maybeShowLoginPrompt() {
  if (!isGuest()) return;                                        // already logged in
  if (appState.promptDismissedDate === getTodayKey()) return;    // already closed today
  openModal('login-prompt-modal');
}
function dismissLoginPrompt() {
  closeModal('login-prompt-modal');
  appState.promptDismissedDate = getTodayKey(); saveState();     // don't show again today
}
function acceptLoginPrompt() { closeModal('login-prompt-modal'); openLoginModal(); }
