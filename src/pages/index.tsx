import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {TRACKS, type Track} from '@site/src/lib/tracks';
import {ContinueCard, ProgressBar, useTrackProgress} from '@site/src/components/Progress';
import styles from './index.module.css';

function TrackCard({track}: {track: Track}) {
  const {done, total} = useTrackProgress(track.id);
  const badge = !track.to ? 'Planned' : done ? `${done} / ${total} done` : `${total} lessons`;
  const body = (
    <>
      <div className={styles.cardTop}>
        <span className={styles.cardTitle}>{track.title}</span>
        <span className={styles.badge}>{badge}</span>
      </div>
      <p className={styles.cardBlurb}>{track.blurb}</p>
      {track.to && done > 0 ? (
        <div className={styles.cardBar}>
          <ProgressBar done={done} total={total} />
        </div>
      ) : null}
    </>
  );
  return track.to ? (
    <Link to={track.to} className={styles.card}>
      {body}
    </Link>
  ) : (
    <div className={clsx(styles.card, styles.cardDisabled)}>{body}</div>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout title="Home" description="Structured 0 to hero notes, one tech stack at a time.">
      <main className={styles.main}>
        <p className={styles.kicker}>Sudir Logs</p>
        <h1 className={styles.title}>Learn it once. Recap it in minutes.</h1>
        <p className={styles.lede}>
          Structured, 0 to hero notes for every tech stack I learn: short lessons, cheatsheets, quizzes and
          interview prep, built to come back to.
        </p>

        <ContinueCard />

        <h2 className={styles.sectionLabel}>Learning paths</h2>
        <div className={styles.grid}>
          {TRACKS.map((t) => (
            <TrackCard key={t.id} track={t} />
          ))}
        </div>
      </main>
    </Layout>
  );
}
