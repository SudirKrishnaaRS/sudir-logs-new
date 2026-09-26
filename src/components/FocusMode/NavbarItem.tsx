import React from 'react';
import {toggleFocused, useFocused} from './store';
import {useIsDocPage} from './index';
import styles from './styles.module.css';

/** Navbar button (type: 'custom-focusToggle'). Desktop only, doc pages only. */
export default function FocusToggleNavbarItem({mobile}: {mobile?: boolean}) {
  const focused = useFocused();
  const isDoc = useIsDocPage();
  if (mobile || !isDoc) return null;
  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleFocused}
      aria-pressed={focused}
      aria-label="Focus mode"
      title="Focus mode (F)">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <path
          d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      </svg>
      <span className={styles.toggleLabel}>Focus</span>
    </button>
  );
}
