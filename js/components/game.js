/**
 * Game view: header card (issue, counter, timer, progress), question, options, feedback.
 * Layout is a flex column sized to the viewport (see body.game-active in css/styles.css)
 * so the question, options and explanation all fit without page scrolling.
 */
const GameComponent = {
  html: `
    <section id="view-game" class="hidden flex-1 min-h-0 flex flex-col gap-2">
      <!-- Top bar: issue badge, question counter, timer ring, progress pills -->
      <div class="shrink-0 rounded-2xl bg-white dark:bg-ink-900 border border-paper-200 dark:border-ink-700 p-2.5 shadow-sm">
        <div class="flex items-center justify-between gap-3 mb-2">
          <div class="flex items-center gap-2">
            <span id="game-mode-badge" class="px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-saffron/15 text-saffron">ISSUE #--</span>
            <span id="game-q-counter" class="font-display font-bold text-sm text-gray-600 dark:text-gray-300">Q1 of 7</span>
          </div>
          <div class="relative w-10 h-10 flex items-center justify-center shrink-0">
            <svg class="w-10 h-10" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="4" fill="transparent" class="text-paper-200 dark:text-ink-700" />
              <circle id="timer-ring" cx="24" cy="24" r="20" stroke="#00A896" stroke-width="4" stroke-linecap="round" fill="transparent" stroke-dasharray="125.66" stroke-dashoffset="0" class="timer-ring-circle" />
            </svg>
            <span id="timer-text" class="absolute font-display font-bold text-xs tabular-nums">25</span>
          </div>
        </div>
        <div id="progress-pills" class="grid grid-cols-7 gap-1.5"></div>
      </div>

      <!-- Question card: fills remaining height; scrolls internally only on very small screens -->
      <div class="flex-1 min-h-0 game-scroll rounded-3xl bg-white dark:bg-ink-900 border-2 border-paper-200 dark:border-ink-700 p-4 shadow-lg flex flex-col gap-3">
        <h2 id="q-text" class="font-display font-bold text-lg sm:text-xl leading-snug tracking-tight">Loading...</h2>
        <div id="options-container" class="flex flex-col gap-2"></div>

        <!-- Feedback (shown after answering): result, short explanation, Next button -->
        <div id="feedback-box" class="hidden shrink-0 rounded-2xl p-3 border border-paper-200 dark:border-ink-700 bg-paper-50 dark:bg-ink-800/60 animate-pop">
          <div class="flex items-start gap-2.5">
            <div id="feedback-icon" class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">✓</div>
            <div class="flex-1 min-w-0">
              <div id="feedback-title" class="font-display font-bold text-sm">Spot on!</div>
              <p id="feedback-fact" class="text-xs text-gray-700 dark:text-gray-300 leading-snug"></p>
            </div>
          </div>
          <button id="feedback-next-button" type="button" onclick="nextQuestion()" class="btn-tactile mt-2.5 w-full py-2.5 px-5 rounded-xl bg-saffron hover:bg-saffron-hover text-white font-display font-bold text-sm">Next</button>
        </div>
      </div>
    </section>`,
  mount() { document.getElementById('app-main').insertAdjacentHTML('beforeend', this.html); },

  // Colored dots showing answered (green/red/amber), current (orange) and upcoming questions
  renderProgressPills() {
    const c = document.getElementById('progress-pills'); c.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const p = document.createElement('div'); let cls = 'h-2 rounded-full transition-all ';
      if (i < session.answers.length) { const a = session.answers[i]; cls += a.isTimeout ? 'bg-amber-400' : (a.isCorrect ? 'bg-peacock' : 'bg-rose-500'); }
      else if (i === session.currentIndex) cls += 'bg-saffron scale-y-125';
      else cls += 'bg-paper-200 dark:bg-ink-700';
      p.className = cls; c.appendChild(p);
    }
  },

  // Show the current question and its options, reset the timer
  renderQuestion() {
    clearInterval(session.timerInterval);
    session.isAnswered = false; session.timeRemaining = TIME_LIMIT; session.questionStartTime = performance.now();
    const qObj = session.questions[session.currentIndex];
    document.getElementById('game-q-counter').textContent = `Q${session.currentIndex + 1} of 7`;
    document.getElementById('q-text').textContent = qObj.question;
    document.getElementById('feedback-box').classList.add('hidden');
    const optContainer = document.getElementById('options-container'); optContainer.innerHTML = '';
    qObj.options.forEach((optText, idx) => {
      const btn = document.createElement('button'); btn.id = `option-btn-${idx}`; btn.onclick = () => this.selectOption(idx);
      btn.className = 'btn-tactile w-full text-left p-2.5 rounded-2xl bg-paper-50 dark:bg-ink-800/90 hover:bg-paper-100 dark:hover:bg-ink-700 border-2 border-paper-200 dark:border-ink-700 flex items-center gap-3 transition-colors';
      btn.innerHTML = `<span class="w-7 h-7 rounded-lg bg-white dark:bg-ink-900 border border-paper-200 dark:border-ink-600 font-display font-bold text-xs flex items-center justify-center shrink-0">${['A', 'B', 'C', 'D'][idx]}</span><span class="font-semibold text-sm flex-1">${optText}</span><span id="option-status-${idx}" class="font-bold text-base shrink-0"></span>`;
      optContainer.appendChild(btn);
    });
    this.renderProgressPills(); this.startTimer();
  },

  // 25s countdown ring; turns amber then red as time runs out
  startTimer() {
    const ring = document.getElementById('timer-ring'); const timerText = document.getElementById('timer-text');
    ring.style.strokeDasharray = `${RING_CIRCUMFERENCE}`; ring.style.strokeDashoffset = '0'; ring.style.stroke = '#00A896'; timerText.textContent = TIME_LIMIT;
    session.timerInterval = setInterval(() => {
      if (session.isAnswered) { clearInterval(session.timerInterval); return; }
      const elapsed = (performance.now() - session.questionStartTime) / 1000;
      const remaining = Math.max(0, TIME_LIMIT - elapsed);
      ring.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - remaining / TIME_LIMIT);
      timerText.textContent = Math.ceil(remaining);
      if (remaining <= 5) ring.style.stroke = '#F43F5E'; else if (remaining <= 10) ring.style.stroke = '#F59E0B';
      if (remaining <= 0) { clearInterval(session.timerInterval); this.handleTimeout(); }
    }, 60);
  },

  handleTimeout() {
    if (session.isAnswered) return;
    session.isAnswered = true; playTone('wrong');
    const qObj = session.questions[session.currentIndex];
    session.answers.push({ selectedIndex: null, isCorrect: false, isTimeout: true, timeTaken: TIME_LIMIT });
    this.highlightAnswers(null, qObj.correctIndex); this.showFeedback('timeout', qObj.fact); this.renderProgressPills();
  },

  // Player tapped an option
  selectOption(selectedIdx) {
    if (session.isAnswered) return;
    session.isAnswered = true; clearInterval(session.timerInterval);
    const elapsed = Math.min(TIME_LIMIT, Math.max(0.4, (performance.now() - session.questionStartTime) / 1000));
    const qObj = session.questions[session.currentIndex];
    const isCorrect = selectedIdx === qObj.correctIndex;
    playTone(isCorrect ? 'correct' : 'wrong');
    session.answers.push({ selectedIndex: selectedIdx, isCorrect, isTimeout: false, timeTaken: Number(elapsed.toFixed(1)) });
    this.highlightAnswers(selectedIdx, qObj.correctIndex); this.showFeedback(isCorrect ? 'correct' : 'wrong', qObj.fact); this.renderProgressPills();
  },

  // Mark the correct option green, a wrong pick red, dim the rest
  highlightAnswers(selectedIdx, correctIdx) {
    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`option-btn-${i}`); const statusEl = document.getElementById(`option-status-${i}`);
      if (!btn || !statusEl) continue;
      btn.disabled = true;
      if (i === correctIdx) { btn.classList.add('border-peacock', 'bg-peacock/15'); statusEl.textContent = '✓'; statusEl.className = 'text-peacock font-bold'; }
      else if (i === selectedIdx) { btn.classList.add('border-rose-500', 'bg-rose-500/15'); statusEl.textContent = '✕'; statusEl.className = 'text-rose-500 font-bold'; }
      else btn.classList.add('opacity-50');
    }
  },

  // Show result title/icon, the fun fact, and the Next / See Results button
  showFeedback(status, factText) {
    const cfg = {
      correct: { title: 'Spot on!', icon: '✓', cls: 'bg-peacock/20 text-peacock' },
      wrong:   { title: 'Not quite', icon: '✕', cls: 'bg-rose-500/20 text-rose-500' },
      timeout: { title: "Time's up", icon: '⏱', cls: 'bg-amber-400/20 text-amber-500' },
    }[status];
    document.getElementById('feedback-box').classList.remove('hidden');
    document.getElementById('feedback-title').textContent = cfg.title;
    const icon = document.getElementById('feedback-icon');
    icon.textContent = cfg.icon;
    icon.className = `w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 ${cfg.cls}`;
    document.getElementById('feedback-fact').textContent = factText;
    document.getElementById('feedback-next-button').textContent = session.currentIndex === session.questions.length - 1 ? 'See Results' : 'Next';
  },
};
// Called from inline onclick in the feedback box
function nextQuestion() {
  if (!session.isAnswered) return;
  if (session.currentIndex < session.questions.length - 1) { session.currentIndex++; GameComponent.renderQuestion(); }
  else finishQuiz();
}
