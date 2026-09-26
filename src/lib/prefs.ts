import {useEffect} from 'react';
import {createStore} from './store';

/* Reading preferences, chosen in the navbar "Reading options" menu. */

export const TEXT_SCALES = [0.9, 1, 1.1, 1.2, 1.35] as const;
export const POMODORO_MINUTES = [5, 10, 15, 20, 25] as const;

type Prefs = {
  textScale: number;
  pomodoroMinutes: number;
};

export const prefs = createStore<Prefs>('sl-prefs', {textScale: 1, pomodoroMinutes: 25});

export function stepTextScale(direction: 1 | -1) {
  prefs.set((p) => {
    const i = TEXT_SCALES.findIndex((s) => s === p.textScale);
    const from = i === -1 ? 1 : i;
    const next = Math.min(TEXT_SCALES.length - 1, Math.max(0, from + direction));
    return {...p, textScale: TEXT_SCALES[next]};
  });
}

/** Applies the text scale as a CSS variable used by .theme-doc-markdown. */
export function useApplyTextScale() {
  const {textScale} = prefs.use();
  useEffect(() => {
    document.documentElement.style.setProperty('--sl-text-scale', String(textScale));
  }, [textScale]);
}
