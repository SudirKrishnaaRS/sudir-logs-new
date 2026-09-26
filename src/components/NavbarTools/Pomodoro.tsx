import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import {chime, finishTimer, formatClock, remainingMs, resetTimer, startOrPause, timer} from '@site/src/lib/pomodoro';
import {prefs} from '@site/src/lib/prefs';
import {logFocusSession} from '@site/src/lib/streak';
import styles from './styles.module.css';

/** Re-renders every second while `active`. */
function useNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return undefined;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [active]);
  return now;
}

/**
 * Mounted once (in Root): ends the session when time is up, wherever the user is.
 * Kept separate from the chip so there is exactly one chime even with two chips on screen.
 */
export function PomodoroController() {
  const t = timer.use();
  useEffect(() => {
    if (t.status !== 'running') return undefined;
    const ms = Math.max(0, t.endAt - Date.now());
    const id = window.setTimeout(() => {
      finishTimer();
      chime();
      logFocusSession(t.totalMs);
    }, ms);
    return () => window.clearTimeout(id);
  }, [t]);
  return null;
}

const TimerIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
    <circle cx="12" cy="13" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 9.5V13l2.5 1.8M9.5 2.8h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/** Navbar chip: click to start / pause / dismiss; × resets. */
export default function PomodoroChip({mobile, compact}: {mobile?: boolean; compact?: boolean}) {
  const t = timer.use();
  prefs.use(); // idle chip shows the configured length
  const now = useNow(t.status === 'running');
  if (mobile) return null;

  const left = remainingMs(t, now);
  const label =
    t.status === 'done' ? 'Break time' : t.status === 'idle' ? `Start ${formatClock(left)} focus timer` : `${formatClock(left)} left, ${t.status}`;

  const onClick = () => (t.status === 'done' ? resetTimer() : startOrPause());

  return (
    <span className={clsx(styles.pomodoro, compact && styles.pomodoroCompact)}>
      <button
        type="button"
        className={clsx(styles.chip, styles[`chip-${t.status}`])}
        onClick={onClick}
        aria-label={label}
        title={t.status === 'running' ? 'Pause' : t.status === 'done' ? 'Done - click to reset' : 'Start focus timer'}>
        <TimerIcon />
        <span className={styles.chipTime}>{t.status === 'done' ? 'Break!' : formatClock(left)}</span>
        {t.status === 'paused' ? <span className={styles.chipState}>paused</span> : null}
      </button>
      {t.status === 'running' || t.status === 'paused' ? (
        <button type="button" className={styles.chipReset} onClick={resetTimer} aria-label="Reset timer" title="Reset">
          ×
        </button>
      ) : null}
    </span>
  );
}
