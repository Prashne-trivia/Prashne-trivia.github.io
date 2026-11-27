/**
 * Share popup: link, text, platform buttons and a generated score-card image (see scorecard.js).
 * Edit buildShareMessage() to change the shared text.
 */
let latestRes = null;        // last result shown on the results view
let shareCardBlob = null;    // generated score-card PNG
let shareCardUrl = null;     // object URL used for the preview

const ShareComponent = {
  html: `
    <div id="share-modal" class="modal-overlay hidden" onclick="if(event.target===this)closeModal('share-modal')">
      <div class="modal-card rounded-3xl bg-white dark:bg-ink-900 border border-paper-200 dark:border-ink-700 p-5 space-y-4">
        <div class="flex items-center justify-between"><h3 class="font-display font-bold text-lg">Share</h3><button onclick="closeModal('share-modal')" class="text-gray-400 text-xl leading-none px-2">✕</button></div>
        <img id="share-card-img" alt="Your score card" class="w-full rounded-2xl border border-paper-200 dark:border-ink-700 bg-paper-100 dark:bg-ink-800" style="aspect-ratio:4/5;object-fit:cover" />
        <div class="grid grid-cols-3 gap-2">
          <button id="share-native-btn" onclick="shareNative()" class="hidden col-span-3 btn-tactile py-3 rounded-2xl bg-saffron text-white font-display font-bold text-sm">Share with image</button>
          <button onclick="downloadCard()" class="btn-tactile py-2.5 rounded-2xl bg-paper-100 dark:bg-ink-800 border border-paper-200 dark:border-ink-700 font-display font-bold text-xs">Save image</button>
          <button id="share-copyimg-btn" onclick="copyCardImage()" class="btn-tactile py-2.5 rounded-2xl bg-paper-100 dark:bg-ink-800 border border-paper-200 dark:border-ink-700 font-display font-bold text-xs">Copy image</button>
          <button onclick="copyShareText()" class="btn-tactile py-2.5 rounded-2xl bg-paper-100 dark:bg-ink-800 border border-paper-200 dark:border-ink-700 font-display font-bold text-xs">Copy text</button>
        </div>
        <div class="flex gap-3 overflow-x-auto pb-1">
          <button onclick="shareTo('whatsapp')" class="shrink-0 w-16 text-center text-[11px]"><span class="mx-auto mb-1 flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white font-bold text-lg">W</span>WhatsApp</button>
          <button onclick="shareTo('telegram')" class="shrink-0 w-16 text-center text-[11px]"><span class="mx-auto mb-1 flex items-center justify-center w-12 h-12 rounded-full bg-[#229ED9] text-white font-bold text-lg">T</span>Telegram</button>
          <button onclick="shareTo('x')" class="shrink-0 w-16 text-center text-[11px]"><span class="mx-auto mb-1 flex items-center justify-center w-12 h-12 rounded-full bg-black text-white font-bold text-lg">X</span>X</button>
          <button onclick="shareTo('facebook')" class="shrink-0 w-16 text-center text-[11px]"><span class="mx-auto mb-1 flex items-center justify-center w-12 h-12 rounded-full bg-[#1877F2] text-white font-bold text-lg">f</span>Facebook</button>
          <button onclick="shareTo('reddit')" class="shrink-0 w-16 text-center text-[11px]"><span class="mx-auto mb-1 flex items-center justify-center w-12 h-12 rounded-full bg-[#FF4500] text-white font-bold text-lg">R</span>Reddit</button>
          <button onclick="shareTo('email')" class="shrink-0 w-16 text-center text-[11px]"><span class="mx-auto mb-1 flex items-center justify-center w-12 h-12 rounded-full bg-gray-500 text-white font-bold text-lg">✉</span>Email</button>
        </div>
        <div class="flex gap-2">
          <input id="share-link" readonly class="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-paper-50 dark:bg-ink-800 border border-paper-200 dark:border-ink-700 text-xs" />
          <button onclick="copyShareLink()" class="btn-tactile px-4 rounded-xl bg-saffron text-white font-display font-bold text-xs">Copy</button>
        </div>
        <textarea id="share-text" readonly rows="5" class="w-full px-3 py-2.5 rounded-xl bg-paper-50 dark:bg-ink-800 border border-paper-200 dark:border-ink-700 text-xs"></textarea>
        <p class="text-[11px] text-gray-500">Instagram and some apps only accept an image: use "Save image" or "Share with image".</p>
      </div>
    </div>`,
  mount() { document.body.insertAdjacentHTML('beforeend', this.html); },
};

// The shared text. withLink=false is for platforms that add the link themselves.
function buildShareMessage(res, withLink = true) {
  const lines = [
    `Prashne #${res.issue_number} | ${fmtPoints(res.points)} pts`,
    `"${res.punchline}"`,
    `${res.emojiBlocks} (${res.correct_count}/7)`,
    `⏱ ${fmtTime(res.total_time)} | 🔥 Streak: ${res.streak || 0}`,
  ];
  if (res.ranked && res.rank_today) lines.splice(3, 0, `🏆 #${res.rank_today} on today's board`);
  if (withLink) lines.push(`Play now 👉 ${SITE_URL}`);
  return lines.join('\n');
}

// Open the popup and generate the score-card image
async function openShareModal() {
  playTone('click');
  if (!latestRes) return;
  document.getElementById('share-link').value = SITE_URL;
  document.getElementById('share-text').value = buildShareMessage(latestRes);
  const img = document.getElementById('share-card-img'); img.removeAttribute('src');
  document.getElementById('share-copyimg-btn').classList.toggle('hidden', !(navigator.clipboard && window.ClipboardItem));
  openModal('share-modal');
  shareCardBlob = null;
  try {
    shareCardBlob = await renderScoreCard(latestRes);
    if (shareCardUrl) URL.revokeObjectURL(shareCardUrl);
    shareCardUrl = URL.createObjectURL(shareCardBlob); img.src = shareCardUrl;
    const file = new File([shareCardBlob], 'prashne-score.png', { type: 'image/png' });
    document.getElementById('share-native-btn').classList.toggle('hidden', !(navigator.canShare && navigator.canShare({ files: [file] })));
  } catch (e) { /* image is optional; text and link still work */ }
}

function shareTo(platform) {
  const full = encodeURIComponent(buildShareMessage(latestRes, true));
  const text = encodeURIComponent(buildShareMessage(latestRes, false));
  const url = encodeURIComponent(SITE_URL);
  const links = {
    whatsapp: `https://wa.me/?text=${full}`,
    telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    x: `https://x.com/intent/post?text=${text}&url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
    reddit: `https://www.reddit.com/submit?url=${url}&title=${encodeURIComponent('My Prashne score #' + latestRes.issue_number)}`,
    email: `mailto:?subject=${encodeURIComponent('My Prashne score')}&body=${full}`,
  };
  if (platform === 'email') location.href = links.email; else window.open(links[platform], '_blank', 'noopener');
}

// Phone share sheet: attaches the image when the device allows it
async function shareNative() {
  try {
    const file = new File([shareCardBlob], 'prashne-score.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) await navigator.share({ files: [file], title: 'Prashne', text: buildShareMessage(latestRes, true) });
    else if (navigator.share) await navigator.share({ title: 'Prashne', text: buildShareMessage(latestRes, false), url: SITE_URL });
  } catch (e) { /* user cancelled */ }
}

async function copyToClipboard(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch (e) {}
  const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  let ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta); return ok;
}
async function copyShareLink() { showToast(await copyToClipboard(SITE_URL) ? 'Link copied 🔗' : 'Could not copy'); }
async function copyShareText() { showToast(await copyToClipboard(buildShareMessage(latestRes)) ? 'Text copied 📋' : 'Could not copy'); }
async function copyCardImage() {
  try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': shareCardBlob })]); showToast('Image copied 🖼️'); }
  catch (e) { showToast('Could not copy the image. Use Save image.'); }
}
function downloadCard() {
  if (!shareCardUrl) return;
  const a = document.createElement('a'); a.href = shareCardUrl; a.download = `prashne-${latestRes.date}.png`; a.click();
}
