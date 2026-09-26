import {useAllDocsData} from '@docusaurus/plugin-content-docs/client';
import {createStore} from './store';

/*
 * Lesson completion and "continue where you left off".
 * A lesson is any doc whose id is `<track>/lessons/<slug>`.
 */

export type LastVisit = {
  id: string;
  path: string;
  title: string; // sidebar label, e.g. "05 · Request Data & CRUD"
  track: string;
  scroll: number; // 0..1, how far down the page
  at: number;
};

type Progress = {
  completed: Record<string, number>; // doc id -> completed at (ms)
  last: LastVisit | null;
  lastByTrack: Record<string, LastVisit>;
};

export const progress = createStore<Progress>('sl-progress', {
  completed: {},
  last: null,
  lastByTrack: {},
});

export const lessonTrack = (id: string): string | null => {
  const m = /^([^/]+)\/lessons\//.exec(id);
  return m ? m[1] : null;
};

export function setCompleted(id: string, done: boolean) {
  progress.set((p) => {
    const completed = {...p.completed};
    if (done) completed[id] = Date.now();
    else delete completed[id];
    return {...p, completed};
  });
}

export function recordVisit(visit: Omit<LastVisit, 'at'>) {
  progress.set((p) => {
    const v = {...visit, at: Date.now()};
    return {...p, last: v, lastByTrack: {...p.lastByTrack, [visit.track]: v}};
  });
}

/** Lesson doc ids for a track, from Docusaurus global data (works on any page). */
export function useTrackLessons(track: string): {id: string; path: string}[] {
  const data = useAllDocsData();
  const docs = Object.values(data).flatMap((plugin) => plugin.versions[0]?.docs ?? []);
  return docs.filter((d) => d.id.startsWith(`${track}/lessons/`)).map(({id, path}) => ({id, path}));
}

/* ---- Resume scroll position after following a "Continue" link ---- */

const RESUME_KEY = 'sl-resume';

export function armResume(path: string, scroll: number) {
  try {
    window.sessionStorage.setItem(RESUME_KEY, JSON.stringify({path, scroll}));
  } catch {
    // no resume, the link still works
  }
}

export function takeResume(path: string): number | null {
  try {
    const raw = window.sessionStorage.getItem(RESUME_KEY);
    if (!raw) return null;
    const r = JSON.parse(raw);
    if (r.path !== path) return null;
    window.sessionStorage.removeItem(RESUME_KEY);
    return typeof r.scroll === 'number' ? r.scroll : null;
  } catch {
    return null;
  }
}

/* ---- Reset, export and import ---- */

/** Clears completion and "continue" data for one track. Returns how many lessons were un-completed. */
export function resetTrack(track: string): number {
  const prefix = `${track}/lessons/`;
  let removed = 0;
  progress.set((p) => {
    const completed = Object.fromEntries(
      Object.entries(p.completed).filter(([id]) => {
        const hit = id.startsWith(prefix);
        if (hit) removed++;
        return !hit;
      }),
    );
    const lastByTrack = {...p.lastByTrack};
    delete lastByTrack[track];
    // If the overall "continue" pointed into this track, fall back to the newest other track.
    const last =
      p.last?.track === track
        ? Object.values(lastByTrack).sort((a, b) => b.at - a.at)[0] ?? null
        : p.last;
    return {completed, last, lastByTrack};
  });
  return removed;
}

const EXPORT_APP = 'sudir-logs';
const EXPORT_VERSION = 1;

type ExportFile = {
  app: typeof EXPORT_APP;
  version: number;
  exportedAt: string;
  progress: ReturnType<typeof progress.get>;
  prefs?: {textScale?: number; pomodoroMinutes?: number};
};

export function buildExport(prefsValue: ExportFile['prefs']): ExportFile {
  return {
    app: EXPORT_APP,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    progress: progress.get(),
    prefs: prefsValue,
  };
}

const isVisit = (v: unknown): v is LastVisit => {
  const o = v as LastVisit;
  return (
    !!o &&
    typeof o.id === 'string' &&
    typeof o.path === 'string' &&
    typeof o.title === 'string' &&
    typeof o.track === 'string' &&
    typeof o.scroll === 'number' &&
    typeof o.at === 'number'
  );
};

/** Validates a parsed export file. Throws a readable Error when it isn't one. */
export function parseExport(data: unknown): ExportFile {
  const f = data as ExportFile;
  if (!f || f.app !== EXPORT_APP || typeof f.progress !== 'object' || !f.progress) {
    throw new Error("That file isn't a Sudir Logs progress export.");
  }
  if (f.version > EXPORT_VERSION) {
    throw new Error('That export comes from a newer version of the site.');
  }
  const {completed, last, lastByTrack} = f.progress;
  const completedOk =
    completed && typeof completed === 'object' && Object.values(completed).every((t) => typeof t === 'number');
  const lastOk = last === null || last === undefined || isVisit(last);
  const byTrackOk = !lastByTrack || Object.values(lastByTrack).every(isVisit);
  if (!completedOk || !lastOk || !byTrackOk) {
    throw new Error('That progress file is damaged or incomplete.');
  }
  return f;
}

/**
 * Merges an export into this browser: completed lessons are unioned (earliest date kept),
 * and for "continue" the most recent visit wins. Returns how many lessons were newly completed.
 */
export function mergeImport(file: ExportFile): number {
  let added = 0;
  progress.set((p) => {
    const completed = {...p.completed};
    for (const [id, at] of Object.entries(file.progress.completed)) {
      if (!(id in completed)) added++;
      completed[id] = id in completed ? Math.min(completed[id], at) : at;
    }
    const newer = (a: LastVisit | null | undefined, b: LastVisit | null | undefined) =>
      !a ? b ?? null : !b ? a : b.at > a.at ? b : a;
    const lastByTrack = {...p.lastByTrack};
    for (const [track, v] of Object.entries(file.progress.lastByTrack ?? {})) {
      lastByTrack[track] = newer(lastByTrack[track], v) as LastVisit;
    }
    return {completed, last: newer(p.last, file.progress.last), lastByTrack};
  });
  return added;
}
