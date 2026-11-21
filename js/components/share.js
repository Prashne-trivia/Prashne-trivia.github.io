/**
 * Share logic (no markup; the buttons live in results.js).
 * Edit buildShareMessage() to change the text people share.
 */
let latestRes = null; // last result shown on the results view

// Neutral, shareable text (no region-specific flags or slang)
function buildShareMessage(res) {
  return [
    `Prashne #${res.issueNumber} ${res.score}/7`,
    `"${res.punchline}"`,
    res.emojiBlocks,
    `⚡ Avg: ${res.avgTime}s/q | 🔥 Streak: ${res.streak}`,
    `Play now 👉 ${SITE_URL}`,
  ].join('\n');
}
function copyTextSilently(text) {
  const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.focus(); ta.select();
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta);
}
function shareWhatsApp() { window.open(`https://wa.me/?text=${encodeURIComponent(buildShareMessage(latestRes))}`, '_blank'); }
function shareFacebook() { copyTextSilently(buildShareMessage(latestRes)); window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}`, '_blank'); }
function copyScoreText() { copyTextSilently(buildShareMessage(latestRes)); showToast('Score & link copied! 📋', 'success'); }
function shareAnywhere() { if (navigator.share) navigator.share({ title: 'Prashne', text: buildShareMessage(latestRes), url: SITE_URL }); else copyScoreText(); }
function shareInstagram() { copyTextSilently(buildShareMessage(latestRes)); showToast('Caption copied! Paste into your Instagram Story 📸', 'info'); }
