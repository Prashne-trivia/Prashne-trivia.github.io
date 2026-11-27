/**
 * Draws the shareable score-card image on a <canvas> (no server needed).
 * Returns a PNG Blob. Tweak sizes/colours here; the card is 1080 x 1350 (4:5).
 */
async function renderScoreCard(res) {
  try { await Promise.all([document.fonts.load('700 100px "Space Grotesk"'), document.fonts.load('600 40px "Plus Jakarta Sans"')]); } catch (e) {}
  const W = 1080, H = 1350;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  const DISPLAY = '"Space Grotesk", "Plus Jakarta Sans", sans-serif';
  const BODY = '"Plus Jakarta Sans", "Space Grotesk", sans-serif';

  const text = (str, x, y, font, color, align = 'left') => { g.font = font; g.fillStyle = color; g.textAlign = align; g.textBaseline = 'alphabetic'; g.fillText(str, x, y); };
  const rrect = (x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };

  // Background + soft orange glow
  const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#12151E'); bg.addColorStop(1, '#1B202E');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const glow = g.createRadialGradient(W * 0.85, H * 0.08, 0, W * 0.85, H * 0.08, 520);
  glow.addColorStop(0, 'rgba(255,107,0,0.35)'); glow.addColorStop(1, 'rgba(255,107,0,0)');
  g.fillStyle = glow; g.fillRect(0, 0, W, H);

  // Logo + name
  const lg = g.createLinearGradient(80, 80, 190, 190); lg.addColorStop(0, '#FF6B00'); lg.addColorStop(1, '#F59E0B');
  rrect(80, 80, 110, 110, 28); g.fillStyle = lg; g.fill();
  text('ಪ್ರ', 135, 158, `700 76px ${DISPLAY}`, '#fff', 'center');
  text('Prashne', 215, 132, `700 62px ${DISPLAY}`, '#fff');
  text('Daily Trivia', 215, 174, `500 30px ${BODY}`, '#9CA3AF');
  text(`ISSUE #${res.issue_number}`, W - 80, 128, `700 36px ${DISPLAY}`, '#FF6B00', 'right');
  text(new Date(res.date + 'T00:00:00').toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' }), W - 80, 172, `500 30px ${BODY}`, '#9CA3AF', 'right');

  // Points
  text(fmtPoints(res.points), W / 2, 560, `700 230px ${DISPLAY}`, '#FF6B00', 'center');
  text(`POINTS  •  OUT OF ${MAX_POINTS}`, W / 2, 628, `600 34px ${BODY}`, '#9CA3AF', 'center');

  // Seven result squares: green = correct, red = wrong, amber = timeout
  const size = 110, gap = 24, startX = (W - (7 * size + 6 * gap)) / 2;
  res.answers.forEach((a, i) => {
    const timeout = a.selected_index === null;
    rrect(startX + i * (size + gap), 720, size, size, 26);
    g.fillStyle = a.correct ? '#00A896' : (timeout ? '#F59E0B' : '#F43F5E'); g.fill();
    text(a.correct ? '✓' : (timeout ? '–' : '✕'), startX + i * (size + gap) + size / 2, 720 + 76, `700 60px ${DISPLAY}`, '#fff', 'center');
  });

  // Stats row
  const stats = [[`${res.correct_count}/7`, 'correct'], [fmtTime(res.total_time), 'total time'], [`${res.streak || 0}`, 'day streak']];
  stats.forEach((s, i) => {
    const cx = W / 2 + (i - 1) * 300;
    text(s[0], cx, 960, `700 64px ${DISPLAY}`, '#fff', 'center');
    text(s[1], cx, 1004, `500 30px ${BODY}`, '#9CA3AF', 'center');
  });

  // Rank pill (only for ranked games) and nickname
  if (res.ranked && res.rank_today) {
    const label = `#${res.rank_today} on today's board`;
    g.font = `700 40px ${DISPLAY}`; const w = g.measureText(label).width + 80;
    rrect((W - w) / 2, 1060, w, 84, 42); g.fillStyle = 'rgba(255,107,0,0.18)'; g.fill();
    g.strokeStyle = '#FF6B00'; g.lineWidth = 3; g.stroke();
    text(label, W / 2, 1115, `700 40px ${DISPLAY}`, '#FF6B00', 'center');
  }
  if (!isGuest() && profile) text(`@${profile.nickname}`, W / 2, 1210, `600 36px ${BODY}`, '#D1D5DB', 'center');

  // Footer
  text(SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, ''), W / 2, 1290, `600 34px ${BODY}`, '#9CA3AF', 'center');

  return new Promise((resolve, reject) => c.toBlob(b => b ? resolve(b) : reject(new Error('Could not create image')), 'image/png'));
}
