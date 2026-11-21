// Procedural sound effects via Tone.js
let synth = null;
function playTone(type) {
  if (!appState.soundEnabled || typeof Tone === 'undefined') return;
  try {
    if (Tone.context.state !== 'running') Tone.start();
    if (!synth) { synth = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.15, sustain: 0.05, release: 0.2 } }).toDestination(); synth.volume.value = -10; }
    const now = Tone.now();
    if (type === 'click') synth.triggerAttackRelease('C5', '32n', now);
    else if (type === 'correct') { synth.triggerAttackRelease('E5', '16n', now); synth.triggerAttackRelease('G5', '16n', now + 0.08); synth.triggerAttackRelease('C6', '8n', now + 0.16); }
    else if (type === 'wrong') { synth.triggerAttackRelease('Eb4', '16n', now); synth.triggerAttackRelease('B3', '8n', now + 0.12); }
    else if (type === 'tick') synth.triggerAttackRelease('A5', '64n', now);
    else if (type === 'finish') synth.triggerAttackRelease(['C5', 'E5', 'G5', 'B5'], '4n', now);
  } catch (e) {}
}
