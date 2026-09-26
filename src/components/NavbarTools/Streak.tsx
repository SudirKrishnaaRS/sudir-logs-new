import React, {useId} from 'react';
import clsx from 'clsx';
import {FlameIcon, GoalBar, GoalPicker, WeekDots, streakMessage, useStreak} from '@site/src/components/Streak';
import {usePopover} from './usePopover';
import styles from './styles.module.css';

/** Navbar streak chip: flame + day count; opens today's goal, the week and the goal picker. */
export default function StreakChip({mobile}: {mobile?: boolean}) {
  const {open, setOpen, wrap} = usePopover<HTMLSpanElement>();
  const panelId = useId();
  const info = useStreak();
  if (mobile) return null;

  const {current, best, doneToday, days, today} = info;
  const state = doneToday ? 'done' : current > 0 ? 'risk' : 'none';
  const label = `${current}-day study streak${doneToday ? ', goal met today' : ''}`;

  return (
    <span className={styles.streak} ref={wrap}>
      <button
        type="button"
        className={clsx(styles.navButton, styles[`streak-${state}`], open && styles.navButtonOpen)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={label}
        title={label}
        onClick={() => setOpen((o) => !o)}>
        <FlameIcon filled={doneToday} />
        <span className={styles.chipTime}>{current}</span>
        {state === 'risk' ? <span className={styles.streakDot} aria-hidden /> : null}
      </button>

      {open ? (
        <div className={styles.panel} id={panelId} role="dialog" aria-label="Study streak">
          <div className={clsx(styles.row, styles.rowStack)}>
            <div className={styles.streakHead}>
              <span className={styles.streakBig}>
                {current} <span>day streak</span>
              </span>
              <span className={styles.rowHint}>Best {best}</span>
            </div>
            <span className={styles.rowHint}>{streakMessage(info)}</span>
            <GoalBar {...info} />
          </div>
          <div className={clsx(styles.row, styles.rowStack)}>
            <span className={styles.rowTitle}>This week</span>
            <WeekDots days={days} today={today} />
          </div>
          <div className={clsx(styles.row, styles.rowStack)}>
            <div className={styles.rowText}>
              <span className={styles.rowTitle}>Daily goal</span>
              <span className={styles.rowHint}>Minutes of active reading. Finishing a lesson also counts.</span>
            </div>
            <GoalPicker />
          </div>
        </div>
      ) : null}
    </span>
  );
}
