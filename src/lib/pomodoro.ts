import {createStore} from './store';
import {prefs} from './prefs';

/*
 * Pomodoro timer state. Stored as an end timestamp (not a ticking counter) so it
 * survives page navigation, reloads and background tabs without drifting.
 */

type Timer =
  | {status: 'idle'}
  | {status: 'running'; endAt: number; totalMs: number}
  | {status: 'paused'; remainingMs: number; totalMs: number}
  | {status: 'done'};

export const timer = createStore<Timer>('sl-pomodoro', {status: 'idle'});

const minutesMs = () => prefs.get().pomodoroMinutes * 60_000;

export function startOrPause() {
  timer.set((t) => {
    if (t.status === 'running') {
      return {status: 'paused', remainingMs: Math.max(0, t.endAt - Date.now()), totalMs: t.totalMs};
    }
    if (t.status === 'paused') {
      return {status: 'running', endAt: Date.now() + t.remainingMs, totalMs: t.totalMs};
    }
    const totalMs = minutesMs();
    return {status: 'running', endAt: Date.now() + totalMs, totalMs};
  });
}

export function resetTimer() {
  timer.set({status: 'idle'});
}

export function finishTimer() {
  timer.set({status: 'done'});
}

export function remainingMs(t: Timer, now: number): number {
  if (t.status === 'running') return Math.max(0, t.endAt - now);
  if (t.status === 'paused') return t.remainingMs;
  if (t.status === 'done') return 0;
  return minutesMs();
}

export function formatClock(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Three soft beeps via Web Audio; silently does nothing if audio is unavailable. */
export function chime() {
  try {
    const Ctx = window.AudioContext || (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.35, 0.7].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      const t0 = ctx.currentTime + offset;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.18, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.28);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.3);
    });
    window.setTimeout(() => ctx.close(), 1500);
  } catch {
    // no audio: the visual "Break" state still shows
  }
}
