import React, {useId} from 'react';
import clsx from 'clsx';
import {POMODORO_MINUTES, TEXT_SCALES, prefs, stepTextScale} from '@site/src/lib/prefs';
import {resetTimer, timer} from '@site/src/lib/pomodoro';
import {setFocused, useFocused} from '@site/src/components/FocusMode/store';
import {useIsDocPage} from '@site/src/components/FocusMode';
import {usePopover} from './usePopover';
import styles from './styles.module.css';

/** Navbar "Reading options" menu: focus mode, text size, focus-timer length. */
export default function ReadingOptions({mobile}: {mobile?: boolean}) {
  const {open, setOpen, wrap} = usePopover<HTMLSpanElement>();
  const panelId = useId();
  const focused = useFocused();
  const isDoc = useIsDocPage();
  const {textScale, pomodoroMinutes} = prefs.use();
  const t = timer.use();

  if (mobile) return null;

  const idx = TEXT_SCALES.findIndex((s) => s === textScale);
  const setMinutes = (m: number) => {
    prefs.set((p) => ({...p, pomodoroMinutes: m}));
    if (t.status === 'idle' || t.status === 'done') resetTimer();
  };

  return (
    <span className={styles.reading} ref={wrap}>
      <button
        type="button"
        className={clsx(styles.navButton, open && styles.navButtonOpen)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Reading options"
        title="Reading options"
        onClick={() => setOpen((o) => !o)}>
        <span className={styles.aa} aria-hidden>
          Aa
        </span>
        <span className={styles.navButtonLabel}>Reading</span>
      </button>

      {open ? (
        <div className={styles.panel} id={panelId} role="dialog" aria-label="Reading options">
          <div className={styles.row}>
            <div className={styles.rowText}>
              <span className={styles.rowTitle}>Focus mode</span>
              <span className={styles.rowHint}>
                {isDoc ? (
                  <>
                    Hide everything but the lesson · <kbd className={styles.kbd}>F</kbd>
                  </>
                ) : (
                  'Open a lesson to use it'
                )}
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-label="Focus mode"
              aria-checked={focused && isDoc}
              disabled={!isDoc}
              className={clsx(styles.switch, focused && isDoc && styles.switchOn)}
              onClick={() => {
                setFocused(!focused);
                setOpen(false);
              }}>
              <span className={styles.switchKnob} />
            </button>
          </div>

          <div className={styles.row}>
            <div className={styles.rowText}>
              <span className={styles.rowTitle}>Text size</span>
              <span className={styles.rowHint}>Lesson text, code and diagrams</span>
            </div>
            <div className={styles.stepper} role="group" aria-label="Text size">
              <button type="button" onClick={() => stepTextScale(-1)} disabled={idx === 0} aria-label="Smaller text">
                A−
              </button>
              <span className={styles.stepValue} aria-live="polite">
                {Math.round(textScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => stepTextScale(1)}
                disabled={idx === TEXT_SCALES.length - 1}
                aria-label="Larger text">
                A+
              </button>
            </div>
          </div>

          <div className={clsx(styles.row, styles.rowStack)}>
            <div className={styles.rowText}>
              <span className={styles.rowTitle}>Focus timer</span>
              <span className={styles.rowHint}>
                {t.status === 'running' || t.status === 'paused' ? 'Applies to your next session' : 'Minutes per session'}
              </span>
            </div>
            <div className={styles.segmented} role="radiogroup" aria-label="Focus timer length">
              {POMODORO_MINUTES.map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={pomodoroMinutes === m}
                  className={clsx(pomodoroMinutes === m && styles.segmentOn)}
                  onClick={() => setMinutes(m)}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </span>
  );
}
