import React, {useId} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {TRACKS, type Track} from '@site/src/lib/tracks';
import {ProgressBar, useTrackProgress} from '@site/src/components/Progress';
import {usePopover} from './usePopover';
import styles from './styles.module.css';

/** True when the current page belongs to the track (overview, lessons, cheatsheets...). */
function useIsActiveTrack(track: Track) {
  const {pathname} = useLocation();
  const {siteConfig} = useDocusaurusContext();
  const root = `${siteConfig.baseUrl}${track.id}`;
  return pathname === root || pathname.startsWith(`${root}/`);
}

const PathsIcon = () => (
  <svg className={styles.pathsIcon} viewBox="0 0 16 16" width="15" height="15" aria-hidden>
    <circle cx="3.5" cy="12.5" r="1.8" fill="currentColor" />
    <circle cx="12.5" cy="3.5" r="1.8" fill="currentColor" />
    <path d="M3.5 10.2V8.5a2 2 0 0 1 2-2h5a2 2 0 0 0 2-2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const Chevron = ({open}: {open: boolean}) => (
  <svg className={clsx(styles.chevron, open && styles.chevronOpen)} viewBox="0 0 12 12" width="11" height="11" aria-hidden>
    <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function PathRow({track, onPick}: {track: Track; onPick: () => void}) {
  const {done, total} = useTrackProgress(track.id);
  const active = useIsActiveTrack(track);

  if (!track.to) {
    return (
      <div className={clsx(styles.pathRow, styles.pathRowPlanned)} aria-disabled="true">
        <div className={styles.rowText}>
          <span className={styles.rowTitle}>{track.title}</span>
          <span className={styles.rowHint}>{track.blurb}</span>
        </div>
        <span className={styles.pathBadge}>Soon</span>
      </div>
    );
  }

  return (
    <Link
      to={track.to}
      className={clsx(styles.pathRow, active && styles.pathRowActive)}
      aria-current={active ? 'page' : undefined}
      onClick={onPick}>
      <div className={styles.rowText}>
        <span className={styles.rowTitle}>{track.title}</span>
        <span className={styles.rowHint}>{track.blurb}</span>
        <div className={styles.pathMeta}>
          <span className={styles.pathCount}>
            {done} / {total}
          </span>
          <div className={styles.pathBar}>
            <ProgressBar done={done} total={total} />
          </div>
        </div>
      </div>
    </Link>
  );
}

/** Menu drawer (phones): plain links, styled like the rest of the drawer. */
function MobilePaths() {
  return (
    <li className="menu__list-item">
      <span className={clsx('menu__link', styles.drawerHeading)}>Learning Paths</span>
      <ul className="menu__list">
        {TRACKS.filter((t) => t.to).map((t) => (
          <li key={t.id} className="menu__list-item">
            <Link to={t.to} className="menu__link">
              {t.title}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

/** Navbar "Learning Paths" menu: every track with its progress. */
export default function LearningPaths({mobile}: {mobile?: boolean}) {
  const {open, setOpen, wrap} = usePopover<HTMLSpanElement>();
  const panelId = useId();

  if (mobile) return <MobilePaths />;

  return (
    <span className={clsx(styles.reading, styles.paths)} ref={wrap}>
      <button
        type="button"
        className={clsx(styles.navButton, open && styles.navButtonOpen)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Learning Paths"
        onClick={() => setOpen((o) => !o)}>
        <PathsIcon />
        <span className={styles.pathsLabel}>Learning Paths</span>
        <Chevron open={open} />
      </button>

      {open ? (
        <div className={clsx(styles.panel, styles.panelLeft)} id={panelId} role="dialog" aria-label="Learning paths">
          <p className={styles.panelKicker}>Learning paths</p>
          {TRACKS.map((t) => (
            <PathRow key={t.id} track={t} onPick={() => setOpen(false)} />
          ))}
        </div>
      ) : null}
    </span>
  );
}
