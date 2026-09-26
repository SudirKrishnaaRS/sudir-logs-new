import {useSyncExternalStore} from 'react';

/*
 * Tiny localStorage-backed store for per-browser state (progress, reading prefs,
 * timer). Every read/write is guarded: storage can be blocked or throw (private
 * windows, cleared site data), and the site must still work without it.
 * Server rendering and hydration always see `initial`, then the saved value applies.
 */

export type Store<T> = {
  get: () => T;
  set: (next: T | ((prev: T) => T)) => void;
  use: () => T;
};

export function createStore<T>(key: string, initial: T): Store<T> {
  const listeners = new Set<() => void>();
  let value: T | undefined;

  const load = (): T => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? {...(initial as object), ...JSON.parse(raw)} : initial;
    } catch {
      return initial;
    }
  };

  const get = () => {
    if (typeof window === 'undefined') return initial;
    if (value === undefined) value = load();
    return value;
  };

  const set = (next: T | ((prev: T) => T)) => {
    value = typeof next === 'function' ? (next as (p: T) => T)(get()) : next;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // not persisted, but still applies for this page view
    }
    listeners.forEach((l) => l());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    // Keep other tabs in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) {
        value = load();
        listener();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', onStorage);
    };
  };

  const use = () => useSyncExternalStore(subscribe, get, () => initial);

  return {get, set, use};
}
