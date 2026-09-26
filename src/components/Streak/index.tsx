import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {
  STREAK_GOALS,
  addDays,
  addReadingSeconds,
  bestStreak,
  currentStreak,
  dayKey,
  keyToDate,
  setGoalMinutes,
  streak,
  studiedMinutes,
  useCelebration,
  type Day,
} from '@site/src/lib/streak';
import {useIsDocPage} from '@site/src/components/FocusMode';
import styles from './styles.module.css';

/* ---------- State ---------- */

export function useStreak() {
  const {days, goalMinutes} = streak.use();
  const isBrowser = useIsBrowser(); // "today" only exists in the browser; SSR renders the empty state
  const today = isBrowser ? dayKey() : '';
  const todayDay = days[today];
  return {
    ready: isBrowser,
    days,
    today,
    goalMinutes,
    current: isBrowser ? currentStreak(days, today) : 0,
    best: isBrowser ? bestStreak(days) : 0,
    doneToday: !!todayDay?.done,
    minutesToday: studiedMinutes(todayDay),
  };
}

type StreakInfo = ReturnType<typeof useStreak>;

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

export function streakMessage({current, doneToday, goalMinutes, minutesToday}: StreakInfo): string {
  if (doneToday) return `Goal met today. Come back tomorrow for day ${current + 1}.`;
  const left = Math.max(1, goalMinutes - minutesToday);
  if (current > 0) return `${plural(left, 'more minute')} today keeps your ${current}-day streak alive.`;
  return `Read for ${goalMinutes} minutes or finish a lesson to start a streak.`;
}

/* ---------- Bits ---------- */

export function FlameIcon({filled, size = 16}: {filled?: boolean; size?: number}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden className={styles.flame}>
      <path
        d="M12 2.5c.6 3.2 2.6 4.9 4.3 6.7 1.6 1.7 2.7 3.6 2.7 6 0 3.9-3.1 6.3-7 6.3s-7-2.4-7-6.3c0-2.3 1-4 2.4-5.4.3 1.6 1.1 2.8 2.3 3.4-.2-3.8 1-7.4 2.3-10.7Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {filled ? <path d="M12 21.5c-1.9 0-3.2-1.2-3.2-2.9 0-1.5 1.1-2.5 2-3.4.2 1 .8 1.6 1.5 1.8.2-1.2.6-2.2 1.3-3.1.9 1.4 1.6 2.9 1.6 4.4 0 2-1.3 3.2-3.2 3.2Z" fill="var(--sl-card)" opacity="0.55" /> : null}
    </svg>
  );
}

const WEEKDAY = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** The last seven days, today last. */
export function WeekDots({days, today}: {days: Record<string, Day>; today: string}) {
  if (!today) return <div className={styles.week} />;
  const keys = Array.from({length: 7}, (_, i) => addDays(today, i - 6));
  return (
    <div className={styles.week} role="list" aria-label="Last 7 days">
      {keys.map((k) => {
        const d = days[k];
        const label = keyToDate(k).toLocaleDateString(undefined, {weekday: 'long', month: 'short', day: 'numeric'});
        return (
          <span key={k} role="listitem" className={styles.weekDay} aria-label={`${label}: ${d?.done ? 'studied' : 'no streak'}`}>
            <span
              className={clsx(
                styles.weekDot,
                d?.done && styles.weekDotDone,
                !d?.done && studiedMinutes(d) > 0 && styles.weekDotSome,
                k === today && styles.weekDotToday,
              )}>
              {d?.done ? <CheckMark /> : null}
            </span>
            <span className={styles.weekLabel}>{WEEKDAY[keyToDate(k).getDay()]}</span>
          </span>
        );
      })}
    </div>
  );
}

const CheckMark = () => (
  <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden>
    <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function GoalPicker() {
  const {goalMinutes} = streak.use();
  return (
    <div className={styles.goals} role="radiogroup" aria-label="Daily goal in minutes">
      {STREAK_GOALS.map((m) => (
        <button
          key={m}
          type="button"
          role="radio"
          aria-checked={goalMinutes === m}
          className={clsx(goalMinutes === m && styles.goalOn)}
          onClick={() => setGoalMinutes(m)}>
          {m}m
        </button>
      ))}
    </div>
  );
}

export function GoalBar({minutesToday, goalMinutes, doneToday}: StreakInfo) {
  const pct = doneToday ? 100 : Math.min(100, Math.round((minutesToday / goalMinutes) * 100));
  return (
    <div className={styles.goalBar}>
      <div className={styles.goalBarTop}>
        <span>Today</span>
        <span>{doneToday ? 'Done' : `${minutesToday} / ${goalMinutes} min`}</span>
      </div>
      <div className={styles.track} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Today's goal">
        <div className={styles.fill} style={{width: `${pct}%`}} />
      </div>
    </div>
  );
}

/* ---------- Heatmap: the last N weeks, one column per week ---------- */

function level(d: Day | undefined, goal: number): 0 | 1 | 2 | 3 {
  if (!d) return 0;
  const min = studiedMinutes(d);
  if (!d.done) return min > 0 ? 1 : 0;
  return min >= goal * 2 || d.lessons > 1 ? 3 : 2;
}

export function Heatmap({days, today, goalMinutes, weeks = 20}: {days: Record<string, Day>; today: string; goalMinutes: number; weeks?: number}) {
  if (!today) return <div className={styles.heat} style={{gridTemplateColumns: `repeat(${weeks}, 1fr)`}} />;
  // Last column ends on this week's Saturday; future days render as blanks.
  const end = addDays(today, 6 - keyToDate(today).getDay());
  const start = addDays(end, -(weeks * 7 - 1));
  const cells = Array.from({length: weeks * 7}, (_, i) => addDays(start, i));
  return (
    <div className={styles.heat} style={{gridTemplateColumns: `repeat(${weeks}, 1fr)`}} aria-hidden>
      {cells.map((k) => {
        const future = k > today;
        const d = days[k];
        return (
          <span
            key={k}
            className={clsx(styles.cell, future ? styles.cellFuture : styles[`cell${level(d, goalMinutes)}`], k === today && styles.cellToday)}
            title={
              future
                ? undefined
                : `${keyToDate(k).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}: ${studiedMinutes(d)} min${d?.lessons ? `, ${plural(d.lessons, 'lesson')}` : ''}`
            }
          />
        );
      })}
    </div>
  );
}

/* ---------- Home page card ---------- */

export function StreakCard() {
  const info = useStreak();
  const {current, best, days, today, goalMinutes, doneToday} = info;
  return (
    <section className={styles.card} aria-label="Study streak">
      <div className={styles.cardInfo}>
        <div className={styles.cardHead}>
          <div className={clsx(styles.big, doneToday && styles.bigDone)}>
            <FlameIcon filled={doneToday} size={30} />
            <span className={styles.bigNumber}>{current}</span>
            <span className={styles.bigUnit}>day streak</span>
          </div>
          <span className={styles.best}>Best {best}</span>
        </div>
        <p className={styles.message}>{info.ready ? streakMessage(info) : '\u00a0'}</p>
        <GoalBar {...info} />
      </div>
      <div className={styles.heatWrap}>
        <Heatmap days={days} today={today} goalMinutes={goalMinutes} weeks={26} />
        <div className={styles.legend} aria-hidden>
          <span>Less</span>
          <span className={clsx(styles.cell, styles.cell0)} />
          <span className={clsx(styles.cell, styles.cell1)} />
          <span className={clsx(styles.cell, styles.cell2)} />
          <span className={clsx(styles.cell, styles.cell3)} />
          <span>More</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- Toast when today's goal is first met ---------- */

export function StreakToast() {
  const c = useCelebration();
  const [shown, setShown] = useState<typeof c>(null);
  useEffect(() => {
    if (!c) return undefined;
    setShown(c);
    const id = window.setTimeout(() => setShown(null), 4500);
    return () => window.clearTimeout(id);
  }, [c]);
  return (
    <div className={styles.toastRegion} aria-live="polite">
      {shown ? (
        <button type="button" className={styles.toast} onClick={() => setShown(null)} title="Dismiss">
          <FlameIcon filled size={20} />
          <span>
            <strong>{shown.streak === 1 ? 'Streak started!' : `${shown.streak}-day streak!`}</strong> Today's goal is done.
          </span>
        </button>
      ) : null}
    </div>
  );
}

/* ---------- Invisible: counts active reading time on doc pages ---------- */

const TICK_SEC = 15;
const IDLE_MS = 90_000; // no scroll, key or pointer for this long = not reading

export function StudyTracker() {
  const isDoc = useIsDocPage();
  useEffect(() => {
    if (!isDoc) return undefined;
    let lastActive = Date.now();
    const onActive = () => {
      lastActive = Date.now();
    };
    const events = ['scroll', 'keydown', 'pointermove', 'pointerdown', 'touchstart', 'wheel'] as const;
    events.forEach((e) => window.addEventListener(e, onActive, {passive: true}));
    const id = window.setInterval(() => {
      const reading = document.visibilityState === 'visible' && document.hasFocus() && Date.now() - lastActive < IDLE_MS;
      if (reading) addReadingSeconds(TICK_SEC);
    }, TICK_SEC * 1000);
    return () => {
      window.clearInterval(id);
      events.forEach((e) => window.removeEventListener(e, onActive));
    };
  }, [isDoc]);
  return null;
}
