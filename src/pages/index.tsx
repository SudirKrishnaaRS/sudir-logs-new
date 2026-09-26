import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

type Path = {
  title: string;
  blurb: string;
  to?: string;
  status: string;
};

// Add a learning path here when a new track starts.
const PATHS: Path[] = [
  {
    title: 'Express + PostgreSQL',
    blurb: 'Routing, middleware, Postgres, auth, validation. React dev to backend dev in 14 short lessons.',
    to: '/express',
    status: '16 lessons',
  },
  {
    title: 'Next.js',
    blurb: 'Next up.',
    status: 'Planned',
  },
];

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

        <h2 className={styles.sectionLabel}>Learning paths</h2>
        <div className={styles.grid}>
          {PATHS.map((p) => {
            const body = (
              <>
                <div className={styles.cardTop}>
                  <span className={styles.cardTitle}>{p.title}</span>
                  <span className={styles.badge}>{p.status}</span>
                </div>
                <p className={styles.cardBlurb}>{p.blurb}</p>
              </>
            );
            return p.to ? (
              <Link key={p.title} to={p.to} className={styles.card}>
                {body}
              </Link>
            ) : (
              <div key={p.title} className={`${styles.card} ${styles.cardDisabled}`}>
                {body}
              </div>
            );
          })}
        </div>
      </main>
    </Layout>
  );
}
