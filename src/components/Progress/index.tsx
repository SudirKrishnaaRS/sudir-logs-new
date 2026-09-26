import React, {useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useActiveDocContext} from '@docusaurus/plugin-content-docs/client';
import {
  armResume,
  buildExport,
  mergeImport,
  parseExport,
  progress,
  recordVisit,
  resetTrack,
  setCompleted,
  takeResume,
  useTrackLessons,
  type LastVisit,
} from '@site/src/lib/progress';
import {POMODORO_MINUTES, TEXT_SCALES, prefs} from '@site/src/lib/prefs';
import {TRACKS, trackTitle} from '@site/src/lib/tracks';
import styles from './styles.module.css';

/* ---------- Invisible: remembers the last lesson and scroll position ---------- */

export function LessonTracker({id, path, title, track}: {id: string; path: string; title: string; track: string}) {
  useEffect(() => {
    const fraction = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    // Coming from a "Continue" link: return to where the reader stopped.
    const resume = takeResume(path);
    const resumeTimer =
      resume !== null
        ? window.setTimeout(() => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            window.scrollTo({top: resume * max});
          }, 150)
        : 0;

    recordVisit({id, path, title, track, scroll: resume ?? fraction()});

    let pending = 0;
    const onScroll = () => {
      window.clearTimeout(pending);
      pending = window.setTimeout(() => recordVisit({id, path, title, track, scroll: fraction()}), 600);
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => {
      window.clearTimeout(resumeTimer);
      window.clearTimeout(pending);
      window.removeEventListener('scroll', onScroll);
    };
  }, [id, path, title, track]);
  return null;
}

/* ---------- End-of-lesson completion card ---------- */

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
    <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function CompleteButton({id}: {id: string}) {
  const {completed} = progress.use();
  const doneAt = completed[id];
  return (
    <div className={clsx(styles.complete, doneAt && styles.completeDone)}>
      {doneAt ? (
        <>
          <span className={styles.completeText}>
            <span className={styles.completeIcon}>
              <CheckIcon />
            </span>
            Completed{' '}
            {new Date(doneAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
          </span>
          <button type="button" className={styles.linkButton} onClick={() => setCompleted(id, false)}>
            Undo
          </button>
        </>
      ) : (
        <>
          <span className={styles.completeText}>Finished this lesson?</span>
          <button type="button" className={styles.primaryButton} onClick={() => setCompleted(id, true)}>
            <CheckIcon /> Mark complete
          </button>
        </>
      )}
    </div>
  );
}

/* ---------- Progress bar ---------- */

export function ProgressBar({done, total}: {done: number; total: number}) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className={styles.bar} role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done} aria-label={`${done} of ${total} lessons complete`}>
      <div className={styles.barFill} style={{width: `${pct}%`}} />
    </div>
  );
}

export function useTrackProgress(track: string) {
  const lessons = useTrackLessons(track);
  const {completed, lastByTrack} = progress.use();
  const done = lessons.filter((l) => completed[l.id]).length;
  return {done, total: lessons.length, last: lastByTrack[track] ?? null};
}

/* ---------- Continue link ---------- */

function ContinueLink({visit, className, children}: {visit: LastVisit; className?: string; children: React.ReactNode}) {
  return (
    <Link to={visit.path} className={className} onClick={() => armResume(visit.path, visit.scroll)}>
      {children}
    </Link>
  );
}

const pctRead = (v: LastVisit) => Math.round(v.scroll * 100);

/** Track overview: progress + continue. Used in docs/<track>/index.mdx. */
export function TrackProgress({track}: {track: string}) {
  const {done, total, last} = useTrackProgress(track);
  return (
    <div className={styles.track}>
      <div className={styles.trackTop}>
        <span className={styles.trackCount}>
          <strong>{done}</strong> of {total} lessons complete
        </span>
        {last ? (
          <ContinueLink visit={last} className={styles.primaryButton}>
            Continue: {last.title} →
          </ContinueLink>
        ) : null}
      </div>
      <ProgressBar done={done} total={total} />
      <ManageProgress track={track} done={done} />
    </div>
  );
}

/* ---------- Export / import / reset ---------- */

type Status = {kind: 'ok' | 'error'; text: string} | null;

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Export and import cover every course; reset only this one. All of it stays in this browser. */
function ManageProgress({track, done}: {track: string; done: number}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>(null);

  const onExport = () => {
    const {textScale, pomodoroMinutes} = prefs.get();
    const day = new Date().toISOString().slice(0, 10);
    downloadJson(`sudir-logs-progress-${day}.json`, buildExport({textScale, pomodoroMinutes}));
    setStatus({kind: 'ok', text: 'Progress exported. Import that file on another device to carry it over.'});
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow picking the same file again
    if (!file) return;
    try {
      const parsed = parseExport(JSON.parse(await file.text()));
      const added = mergeImport(parsed);
      const {textScale, pomodoroMinutes} = parsed.prefs ?? {};
      prefs.set((p) => ({
        textScale: TEXT_SCALES.includes(textScale as never) ? (textScale as number) : p.textScale,
        pomodoroMinutes: POMODORO_MINUTES.includes(pomodoroMinutes as never) ? (pomodoroMinutes as number) : p.pomodoroMinutes,
      }));
      setStatus({
        kind: 'ok',
        text: added
          ? `Imported and merged: ${plural(added, 'more lesson')} marked complete.`
          : 'Imported and merged. Nothing new: this browser already had all of it.',
      });
    } catch (err) {
      setStatus({
        kind: 'error',
        text: err instanceof SyntaxError ? "That file isn't valid JSON." : (err as Error).message,
      });
    }
  };

  const onReset = () => {
    const name = trackTitle(track);
    const ok = window.confirm(
      `Reset ${name} progress?\n\nThis clears ${plural(done, 'completed lesson')} and "continue where you left off" for this course, in this browser only. Other courses aren't affected.\n\nTip: export first if you might want it back.`,
    );
    if (!ok) return;
    const removed = resetTrack(track);
    setStatus({kind: 'ok', text: `${name} progress reset (${plural(removed, 'lesson')} cleared).`});
  };

  return (
    <div className={styles.manage}>
      <div className={styles.manageActions}>
        <button type="button" className={styles.ghostButton} onClick={onExport} title="Download all course progress as a file">
          Export progress
        </button>
        <button type="button" className={styles.ghostButton} onClick={() => fileInput.current?.click()} title="Merge a progress file into this browser">
          Import
        </button>
        <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={onFile} />
        <button type="button" className={clsx(styles.ghostButton, styles.dangerButton)} onClick={onReset}>
          Reset this course
        </button>
      </div>
      <p className={clsx(styles.manageStatus, status?.kind === 'error' && styles.manageError)} aria-live="polite">
        {status?.text ?? 'Progress is saved in this browser. Export and import it to move between devices.'}
      </p>
    </div>
  );
}

/** Home page: the most recent lesson across all tracks. */
export function ContinueCard() {
  const {last} = progress.use();
  if (!last) return null;
  return (
    <ContinueLink visit={last} className={styles.continueCard}>
      <span className={styles.continueLabel}>Continue where you left off</span>
      <span className={styles.continueTitle}>{last.title}</span>
      <span className={styles.continueMeta}>
        {trackTitle(last.track)} · {pctRead(last)}% read
      </span>
      <span className={styles.continueArrow} aria-hidden>
        →
      </span>
    </ContinueLink>
  );
}

/* ---------- Course progress card at the top of the doc sidebar ---------- */

/** Works out the course from the current page (doc ids start with the track folder). */
function useCurrentTrack(): string | null {
  const {activeDoc} = useActiveDocContext(undefined);
  const track = activeDoc?.id.split('/')[0];
  return track && TRACKS.some((t) => t.id === track) ? track : null;
}

export function CourseProgress() {
  const track = useCurrentTrack();
  const {done, total} = useTrackProgress(track ?? '');
  if (!track || !total) return null;
  const pct = Math.round((done / total) * 100);
  const to = TRACKS.find((t) => t.id === track)?.to ?? `/${track}`;
  return (
    <Link to={to} className={styles.course} title="Open the course overview">
      <span className={styles.courseTop}>
        <span className={styles.courseLabel}>Course progress</span>
        <span className={styles.coursePct}>{pct}%</span>
      </span>
      <ProgressBar done={done} total={total} />
      <span className={styles.courseCount}>
        {done === total ? 'All ' + total + ' lessons complete' : `${done} of ${total} lessons complete`}
      </span>
    </Link>
  );
}
