import React, {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';
import {useActiveDocContext} from '@docusaurus/plugin-content-docs/client';
import {setFocused, toggleFocused, useFocused} from './store';
import PomodoroChip from '@site/src/components/NavbarTools/Pomodoro';
import {timer} from '@site/src/lib/pomodoro';
import styles from './styles.module.css';

/*
 * Focus mode for doc pages. Hides the site chrome (via html[data-focus] rules in
 * src/css/custom.css), centres the lesson, and fades sections already scrolled past.
 * Toggle: F key or Reading options in the navbar. Exit: Esc or the floating button.
 * The navbar is hidden here, so a running focus timer is shown next to the exit button.
 */

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  return el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
}

/** Marks every block before the current section's h2 with data-sl-past. */
function markPastSections() {
  const md = document.querySelector('.theme-doc-markdown');
  if (!md) return;
  const blocks = Array.from(md.children);
  const readingLine = window.innerHeight * 0.3;
  let current = -1;
  blocks.forEach((b, i) => {
    if (b.tagName === 'H2' && b.getBoundingClientRect().top < readingLine) current = i;
  });
  blocks.forEach((b, i) => {
    if (current > 0 && i < current) b.setAttribute('data-sl-past', '');
    else b.removeAttribute('data-sl-past');
  });
}

function clearPastSections() {
  document.querySelectorAll('[data-sl-past]').forEach((b) => b.removeAttribute('data-sl-past'));
}

/** True only on an actual doc page. (Docs live at routeBasePath '/', so every
 *  URL belongs to the docs plugin; the active doc is what tells pages apart.) */
export function useIsDocPage() {
  return useActiveDocContext(undefined).activeDoc !== undefined;
}

export default function FocusController() {
  const focused = useFocused();
  const isDoc = useIsDocPage();
  const {pathname} = useLocation();
  const active = focused && isDoc;
  const t = timer.use();

  // Keyboard: F toggles, Esc exits.
  useEffect(() => {
    if (!isDoc) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return;
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFocused();
      } else if (e.key === 'Escape' && focused) {
        setFocused(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isDoc, focused]);

  // Apply the attribute that the CSS keys off.
  useEffect(() => {
    const root = document.documentElement;
    if (active) root.setAttribute('data-focus', 'on');
    else root.removeAttribute('data-focus');
    return () => root.removeAttribute('data-focus');
  }, [active]);

  // Fade sections already read.
  useEffect(() => {
    if (!active) {
      clearPastSections();
      return undefined;
    }
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(markPastSections);
    };
    // New page content mounts after the route change; measure once it has.
    const initial = window.setTimeout(markPastSections, 50);
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      window.clearTimeout(initial);
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      clearPastSections();
    };
  }, [active, pathname]);

  if (!active) return null;
  return (
    <div className={styles.corner}>
      {t.status !== 'idle' ? <PomodoroChip compact /> : null}
      <button type="button" className={styles.exit} onClick={() => setFocused(false)}>
        Exit focus <kbd className={styles.kbd}>Esc</kbd>
      </button>
    </div>
  );
}
