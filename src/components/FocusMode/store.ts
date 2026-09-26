import {useSyncExternalStore} from 'react';

/*
 * Focus mode on/off, shared by the navbar toggle and the controller in Root.
 * Persisted per browser so it stays on while moving between lessons.
 */

const KEY = 'sl-focus';
const listeners = new Set<() => void>();
let focused: boolean | null = null;

function read(): boolean {
  if (focused === null) {
    try {
      focused = window.localStorage.getItem(KEY) === '1';
    } catch {
      focused = false;
    }
  }
  return focused;
}

export function setFocused(next: boolean) {
  focused = next;
  try {
    window.localStorage.setItem(KEY, next ? '1' : '0');
  } catch {
    // storage blocked (private window etc.): still works for this page view
  }
  listeners.forEach((l) => l());
}

export function toggleFocused() {
  setFocused(!read());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useFocused(): boolean {
  return useSyncExternalStore(subscribe, read, () => false);
}
