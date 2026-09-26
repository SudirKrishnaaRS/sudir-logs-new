import {useSyncExternalStore} from 'react';
import {createStore} from './store';

/*
 * Daily study streak. A day counts once any of these happens that (local) day:
 * - active reading time on doc pages reaches the daily goal
 * - a focus timer session at least as long as the goal finishes
 * - a lesson is marked complete
 * Once a day counts it stays counted, so changing the goal never erases history.
 */

export const STREAK_GOALS = [5, 10, 15, 25] as const;

export type Day = {
  sec: number; // active reading seconds
  focusSec: number; // finished focus timer seconds
  lessons: number; // lessons marked complete
  done?: boolean; // the day counts toward the streak
};

type StreakState = {
  days: Record<string, Day>; // "YYYY-MM-DD" (local) -> activity
  goalMinutes: number;
};

export const streak = createStore<StreakState>('sl-streak', {days: {}, goalMinutes: 10});

const EMPTY: Day = {sec: 0, focusSec: 0, lessons: 0};

/* ---- Dates (local time, so "today" matches the learner's clock) ---- */

const pad = (n: number) => String(n).padStart(2, '0');

export const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const keyToDate = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (key: string, n: number) => {
  const d = keyToDate(key);
  d.setDate(d.getDate() + n);
  return dayKey(d);
};

/* ---- Streak maths ---- */

/** Consecutive counted days ending today, or yesterday while today is still open. */
export function currentStreak(days: StreakState['days'], today = dayKey()): number {
  let k = days[today]?.done ? today : addDays(today, -1);
  let n = 0;
  while (days[k]?.done) {
    n++;
    k = addDays(k, -1);
  }
  return n;
}

export function bestStreak(days: StreakState['days']): number {
  const keys = Object.keys(days)
    .filter((k) => days[k].done)
    .sort();
  let best = 0;
  let run = 0;
  let prev = '';
  for (const k of keys) {
    run = prev && addDays(prev, 1) === k ? run + 1 : 1;
    best = Math.max(best, run);
    prev = k;
  }
  return best;
}

/** Minutes that count toward today's goal. */
export const studiedMinutes = (d: Day | undefined) => Math.floor(Math.max(d?.sec ?? 0, d?.focusSec ?? 0) / 60);

/* ---- Recording activity ---- */

type Celebration = {streak: number; at: number} | null;
let celebration: Celebration = null;
const celebrationListeners = new Set<() => void>();

/** Fires when today first counts (in-memory only, so a reload doesn't repeat it). */
export function useCelebration(): Celebration {
  return useSyncExternalStore(
    (l) => {
      celebrationListeners.add(l);
      return () => celebrationListeners.delete(l);
    },
    () => celebration,
    () => null,
  );
}

function bump(update: (d: Day) => Day) {
  const today = dayKey();
  let newlyDone = false;
  streak.set((s) => {
    const next = update({...EMPTY, ...s.days[today]});
    const goal = s.goalMinutes * 60;
    if (!next.done && (next.sec >= goal || next.focusSec >= goal || next.lessons > 0)) {
      next.done = true;
      newlyDone = true;
    }
    return {...s, days: {...s.days, [today]: next}};
  });
  if (newlyDone) {
    celebration = {streak: currentStreak(streak.get().days, today), at: Date.now()};
    celebrationListeners.forEach((l) => l());
  }
}

export const addReadingSeconds = (sec: number) => bump((d) => ({...d, sec: d.sec + sec}));
export const logFocusSession = (ms: number) => bump((d) => ({...d, focusSec: d.focusSec + Math.round(ms / 1000)}));
export const logLessonComplete = () => bump((d) => ({...d, lessons: d.lessons + 1}));

export function setGoalMinutes(goalMinutes: number) {
  streak.set((s) => ({...s, goalMinutes}));
  bump((d) => d); // a lower goal may already be met today
}

/* ---- Export / import ---- */

const isDay = (v: unknown): v is Day => {
  const d = v as Day;
  return !!d && typeof d.sec === 'number' && typeof d.focusSec === 'number' && typeof d.lessons === 'number';
};

/** Merges another device's days: the larger value of each field wins, and a counted day stays counted. */
export function mergeStreak(data: unknown) {
  const days = (data as StreakState | undefined)?.days;
  if (!days || typeof days !== 'object') return;
  streak.set((s) => {
    const merged = {...s.days};
    for (const [k, d] of Object.entries(days)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(k) || !isDay(d)) continue;
      const mine = merged[k];
      merged[k] = mine
        ? {
            sec: Math.max(mine.sec, d.sec),
            focusSec: Math.max(mine.focusSec, d.focusSec),
            lessons: Math.max(mine.lessons, d.lessons),
            done: mine.done || d.done,
          }
        : d;
    }
    return {...s, days: merged};
  });
}
