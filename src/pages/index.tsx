import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {useAllDocsData} from '@docusaurus/plugin-content-docs/client';
import {TRACKS, type Track} from '@site/src/lib/tracks';
import {ContinueCard, ProgressBar, useTrackProgress} from '@site/src/components/Progress';
import {StreakCard} from '@site/src/components/Streak';
import styles from './index.module.css';

const USES = [
  {
    label: 'Learn',
    title: 'From zero, one idea at a time',
    body: 'Short lessons, about 15 minutes each, built on what you already know.',
  },
  {
    label: 'Recap',
    title: 'The night before an interview',
    body: 'A cheatsheet per lesson and a 30 minute recap per path.',
  },
  {
    label: 'Refresh',
    title: 'After months away',
    body: 'Quizzes and interview Q&A show what stuck and what to reread.',
  },
];

function useCheatsheetCount(track: string) {
  const data = useAllDocsData();
  return Object.values(data)
    .flatMap((plugin) => plugin.versions[0]?.docs ?? [])
    .filter((d) => d.id.startsWith(`${track}/cheatsheets/`)).length;
}

/* ---------- Hero visual: a lesson card with a cheatsheet peeking out behind it ---------- */

function LessonPreview() {
  return (
    <div className={styles.preview} aria-hidden>
      <div className={clsx(styles.sheet, styles.sheetBack)}>
        <span className={styles.sheetKicker}>Cheatsheet</span>
        <div className={styles.sheetGrid}>
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className={clsx(styles.sheet, styles.sheetFront)}>
        <div className={styles.sheetTop}>
          <span className={styles.sheetKicker}>Express · Lesson 03</span>
          <span className={styles.sheetPill}>15 min</span>
        </div>
        <span className={styles.sheetTitle}>Middleware</span>
        <span className={styles.sheetLine} style={{width: '92%'}} />
        <span className={styles.sheetLine} style={{width: '78%'}} />
        <div className={styles.sheetFlow}>
          <span>req</span>
          <i />
          <span>logger</span>
          <i />
          <span className={styles.sheetFlowHot}>route</span>
        </div>
        <span className={styles.sheetLabel}>Quick check</span>
        <span className={clsx(styles.sheetOption, styles.sheetOptionOk)}>Calls next() to continue</span>
        <span className={styles.sheetOption}>Returns a new request</span>
      </div>

      <span className={styles.note}>
        one idea, ~15 min
        <svg viewBox="0 0 60 40" className={styles.noteArrow}>
          <path d="M4 6 C 22 4, 44 12, 52 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M44 28 L 52 33 L 55 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}

/* ---------- Learning path row ---------- */

function PathRow({track, index}: {track: Track; index: number}) {
  const {done, total} = useTrackProgress(track.id);
  const sheets = useCheatsheetCount(track.id);
  const number = String(index + 1).padStart(2, '0');

  const body = (
    <>
      <span className={styles.pathIndex}>{number}</span>
      <span className={styles.pathMain}>
        <span className={styles.pathTitle}>{track.title}</span>
        <span className={styles.pathBlurb}>{track.blurb}</span>
        {track.to && done > 0 ? (
          <span className={styles.pathBar}>
            <ProgressBar done={done} total={total} />
          </span>
        ) : null}
      </span>
      <span className={styles.pathMeta}>
        {!track.to ? (
          <span className={styles.pathPlanned}>Planned</span>
        ) : !total ? (
          <span className={styles.pathPlanned}>Starting soon</span>
        ) : done ? (
          <>
            <strong>{done}</strong> / {total} done
          </>
        ) : (
          <>
            <strong>{total}</strong> lessons
            {sheets ? (
              <>
                <br />
                <strong>{sheets}</strong> cheatsheets
              </>
            ) : null}
          </>
        )}
      </span>
      <span className={styles.pathArrow} aria-hidden>
        →
      </span>
    </>
  );

  return track.to ? (
    <Link to={track.to} className={styles.path}>
      {body}
    </Link>
  ) : (
    <div className={clsx(styles.path, styles.pathDisabled)}>{body}</div>
  );
}

export default function Home(): ReactNode {
  const first = TRACKS.find((t) => t.to);

  return (
    <Layout title="Home" description="Structured 0 to hero notes, one tech stack at a time.">
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <p className={styles.kicker}>
              <span className={styles.dot} /> A personal learning log
            </p>
            <h1 className={styles.title}>
              Learn a stack once.{' '}
              <span className={styles.titleAccent}>
                Recap it in minutes.
                <svg viewBox="0 0 300 12" preserveAspectRatio="none" className={styles.underline} aria-hidden>
                  <path d="M2 8 C 60 2, 140 2, 200 6 S 280 10, 298 4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className={styles.lede}>
              Structured, 0 to hero notes for every tech stack I pick up. Short lessons, cheatsheets, quizzes and
              interview prep, written to come back to.
            </p>
            <div className={styles.actions}>
              {first?.to ? (
                <Link to={first.to} className={styles.primary}>
                  Start with {first.title.split(' ')[0]} <span aria-hidden>→</span>
                </Link>
              ) : null}
              <a href="#paths" className={styles.ghost}>
                All learning paths
              </a>
            </div>
          </div>
          <LessonPreview />
        </section>

        <div className={styles.today}>
          <ContinueCard />
          <StreakCard />
        </div>

        <section className={styles.uses} aria-label="How to use these notes">
          {USES.map((u, i) => (
            <div key={u.label} className={styles.use}>
              <span className={styles.useLabel}>
                {String(i + 1).padStart(2, '0')} · {u.label}
              </span>
              <h2 className={styles.useTitle}>{u.title}</h2>
              <p className={styles.useBody}>{u.body}</p>
            </div>
          ))}
        </section>

        <section id="paths" className={styles.paths}>
          <div className={styles.pathsHead}>
            <h2 className={styles.sectionLabel}>Learning paths</h2>
            <span className={styles.pathsCount}>
              {TRACKS.length} {TRACKS.length === 1 ? 'path' : 'paths'}
            </span>
          </div>
          <div className={styles.pathList}>
            {TRACKS.map((t, i) => (
              <PathRow key={t.id} track={t} index={i} />
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
