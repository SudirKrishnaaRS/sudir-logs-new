import React, {Children, Fragment, useEffect, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {progress} from '@site/src/lib/progress';
import styles from './lesson.module.css';

/*
 * Lesson building blocks. Registered globally in src/theme/MDXComponents.tsx,
 * so any .mdx lesson can use them without importing.
 */

export function LessonHeader({
  kicker,
  minutes,
  subtitle,
}: {
  kicker: string;
  minutes?: number;
  subtitle?: ReactNode;
}) {
  const {metadata} = useDoc();
  const {completed} = progress.use();
  return (
    <>
      <p className={styles.kicker}>
        <span>{kicker}</span>
        {minutes ? (
          <>
            <span className={styles.kickerDot}>/</span>
            <span>~{minutes} min</span>
          </>
        ) : null}
        {completed[metadata.id] ? <span className={styles.donePill}>✓ Completed</span> : null}
      </p>
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
    </>
  );
}

type CalloutType = 'react' | 'warn' | 'info' | 'key';

export function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className={clsx(styles.callout, styles[type])}>
      {title ? <span className={styles.calloutTitle}>{title}</span> : null}
      {children}
    </div>
  );
}

type StepType = 'default' | 'client' | 'warn' | 'error';

export function Step({type = 'default', children}: {type?: StepType; children: ReactNode}) {
  return (
    <div
      className={clsx(
        styles.step,
        type === 'client' && styles.stepClient,
        type === 'warn' && styles.stepWarn,
        type === 'error' && styles.stepError,
      )}>
      {children}
    </div>
  );
}

/** Horizontal flowchart. Put <Step> children inside; arrows are added between them. */
export function Flow({children, label}: {children: ReactNode; label?: string}) {
  const steps = Children.toArray(children);
  return (
    <div className={styles.flow} role="img" aria-label={label}>
      {steps.map((step, i) => (
        <Fragment key={i}>
          {i > 0 ? (
            <span className={styles.arrow} aria-hidden>
              →
            </span>
          ) : null}
          {step}
        </Fragment>
      ))}
    </div>
  );
}

/**
 * Multiple-choice check. The question is the children (markdown allowed).
 * Options are shuffled after mount so the correct answer's position gives nothing away.
 * Authoring rule: keep every option the same word count.
 */
export function Quiz({
  options,
  answer,
  label = 'Quick check',
  children,
}: {
  options: string[];
  answer: number;
  label?: string;
  children: ReactNode;
}) {
  const [order, setOrder] = useState(() => options.map((_, i) => i));
  const [wrong, setWrong] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    const shuffled = options.map((_, i) => i);
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setOrder(shuffled);
  }, [options.length]);

  const pick = (i: number) => {
    if (i === answer) setSolved(true);
    else setWrong((w) => [...w, i]);
  };

  const lastWasWrong = !solved && wrong.length > 0;

  return (
    <div className={styles.quiz}>
      <div className={styles.quizLabel}>{label}</div>
      <div className={styles.quizQuestion}>{children}</div>
      <div className={styles.quizOptions}>
        {order.map((i) => {
          const isWrong = wrong.includes(i);
          const isRight = solved && i === answer;
          return (
            <button
              key={i}
              type="button"
              className={clsx(
                styles.option,
                isRight && styles.optionCorrect,
                isWrong && styles.optionWrong,
              )}
              disabled={solved || isWrong}
              onClick={() => pick(i)}>
              {options[i]}
            </button>
          );
        })}
      </div>
      <p
        className={clsx(
          styles.feedback,
          solved && styles.feedbackCorrect,
          lastWasWrong && styles.feedbackWrong,
        )}
        aria-live="polite">
        {solved ? 'Correct.' : lastWasWrong ? 'Not quite - try another option.' : ''}
      </p>
    </div>
  );
}

/** Quiet bordered box for sources and cross-links. */
export function Note({children}: {children: ReactNode}) {
  return <div className={styles.note}>{children}</div>;
}

/** End-of-lesson reminder to ask the teacher (Claude) follow-up questions. */
export function AskBox({children}: {children: ReactNode}) {
  return <div className={styles.ask}>{children}</div>;
}

/** Topic glossary: <Terms><Term name="next()">...</Term></Terms> */
export function Terms({children}: {children: ReactNode}) {
  return <dl className={styles.terms}>{children}</dl>;
}

export function Term({name, children}: {name: ReactNode; children: ReactNode}) {
  return (
    <>
      <dt>{name}</dt>
      <dd>{children}</dd>
    </>
  );
}

/* ---------- Cheatsheet cards ---------- */

type Tone = 'neutral' | 'info' | 'ok' | 'warn' | 'danger' | 'gold';

/** Responsive grid of <CheatCard>s. */
export function CheatGrid({children}: {children: ReactNode}) {
  return <div className={styles.cheatGrid}>{children}</div>;
}

/**
 * One quick-reference card: a bold mono title, what it's for, an example.
 * Optional children render above the title (e.g. a <JoinVenn />).
 */
export function CheatCard({
  title,
  use,
  ex,
  tone = 'neutral',
  children,
}: {
  title: ReactNode;
  use?: ReactNode;
  ex?: ReactNode;
  tone?: Tone;
  children?: ReactNode;
}) {
  return (
    <div className={clsx(styles.cheatCard, tone !== 'neutral' && styles[`tone-${tone}`])}>
      {children ? <div className={styles.cheatVisual}>{children}</div> : null}
      <span className={styles.cheatTitle}>{title}</span>
      {use ? <div className={styles.cheatUse}>{use}</div> : null}
      {ex ? <div className={styles.cheatEx}>{ex}</div> : null}
    </div>
  );
}

/** Two-circle Venn diagram for SQL joins. */
export function JoinVenn({
  type,
  left = 'users',
  right = 'todos',
}: {
  type: 'inner' | 'left' | 'right' | 'full';
  left?: string;
  right?: string;
}) {
  const clipId = React.useId().replace(/:/g, '');
  return (
    <svg className={styles.venn} viewBox="0 0 160 100" role="img" aria-label={`${type} join of ${left} and ${right}`}>
      <defs>
        <clipPath id={clipId}>
          <circle cx="105" cy="50" r="38" />
        </clipPath>
      </defs>
      {type === 'inner' && <circle cx="55" cy="50" r="38" className={styles.vennLeft} clipPath={`url(#${clipId})`} />}
      {(type === 'left' || type === 'full') && <circle cx="55" cy="50" r="38" className={styles.vennLeft} />}
      {(type === 'right' || type === 'full') && <circle cx="105" cy="50" r="38" className={styles.vennRight} />}
      <circle cx="55" cy="50" r="38" className={styles.vennRing} />
      <circle cx="105" cy="50" r="38" className={styles.vennRing} />
      <text x="30" y="54" className={styles.vennText}>{left}</text>
      <text x="113" y="54" className={styles.vennText}>{right}</text>
    </svg>
  );
}

/* ---------- URL anatomy ---------- */

type UrlKind = 'base' | 'param' | 'query';

/**
 * Colour-coded URL. parts = [['base', '/todos'], ['param', '/7'], ['query', '?sort=asc']].
 * Children are <UrlLegend kind="...">label</UrlLegend> items.
 */
export function UrlAnatomy({parts, children}: {parts: [UrlKind, string][]; children?: ReactNode}) {
  return (
    <div className={styles.url}>
      <div className={styles.urlBar}>
        {parts.map(([kind, text], i) => (
          <span key={i} className={clsx(styles.urlPart, styles[`url-${kind}`])}>
            {text}
          </span>
        ))}
      </div>
      {children ? <div className={styles.urlLegend}>{children}</div> : null}
    </div>
  );
}

export function UrlLegend({kind, children}: {kind: UrlKind; children: ReactNode}) {
  return (
    <span className={styles.urlLegendItem}>
      <span className={clsx(styles.dot, styles[`dot-${kind}`])} />
      <span>{children}</span>
    </span>
  );
}

/* ---------- Cyclic process diagram ---------- */

type LoopNode = {title: ReactNode; detail?: ReactNode};
type LoopArrow = {glyph: string; label: ReactNode};

/**
 * Four nodes in a clockwise cycle: nodes[0] top-left, [1] top-right, [2] bottom-right, [3] bottom-left.
 * arrows[0] goes 0->1 (top), [1] 1->2 (right), [2] 2->3 (bottom), [3] 3->0 (left).
 */
export function LoopDiagram({
  nodes,
  arrows,
  center,
}: {
  nodes: [LoopNode, LoopNode, LoopNode, LoopNode];
  arrows: [LoopArrow, LoopArrow, LoopArrow, LoopArrow];
  center?: ReactNode;
}) {
  const nodeCls = [styles.loopN1, styles.loopN2, styles.loopN3, styles.loopN4];
  const arrowCls = [styles.loopTop, styles.loopRight, styles.loopBottom, styles.loopLeft];
  return (
    <div className={styles.loop}>
      {nodes.map((n, i) => (
        <div key={`n${i}`} className={clsx(styles.loopNode, nodeCls[i])}>
          {n.title}
          {n.detail ? <small>{n.detail}</small> : null}
        </div>
      ))}
      {arrows.map((a, i) => (
        <div key={`a${i}`} className={clsx(styles.loopArrow, arrowCls[i])}>
          <span className={styles.loopGlyph} aria-hidden>
            {a.glyph}
          </span>
          <span className={styles.loopLabel}>{a.label}</span>
        </div>
      ))}
      {center ? <div className={styles.loopCenter}>{center}</div> : null}
    </div>
  );
}

/* ---------- File tree ---------- */

/** Wrap a nested markdown list: <FileTree>\n\n- 📁 src/\n  - 📄 index.js <FileNote>what it does</FileNote>\n\n</FileTree> */
export function FileTree({children}: {children: ReactNode}) {
  return <div className={styles.fileTree}>{children}</div>;
}

export function FileNote({children}: {children: ReactNode}) {
  return <span className={styles.fileNote}>{children}</span>;
}

/* ---------- Checklist ---------- */

/** Interactive checklist: <Checklist><Check>item</Check>...</Checklist>. Ticks are not saved; `done` starts an item ticked. */
export function Checklist({children}: {children: ReactNode}) {
  return <ul className={styles.checklist}>{children}</ul>;
}

export function Check({done: initial = false, children}: {done?: boolean; children: ReactNode}) {
  const [done, setDone] = useState(initial);
  return (
    <li className={styles.check}>
      <label>
        <input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} />
        <span className={clsx(done && styles.checkDone)}>{children}</span>
      </label>
    </li>
  );
}

/* ---------- Badge ---------- */

export function Badge({type = 'planned', children}: {type?: 'done' | 'optional' | 'planned'; children: ReactNode}) {
  return <span className={clsx(styles.badge, styles[`badge-${type}`])}>{children}</span>;
}

/* ---------- Where code runs ---------- */

type Where = 'server' | 'client' | 'both' | 'build';

const WHERE: Record<Where, {icon: string; label: string}> = {
  server: {icon: '🖥️', label: 'Runs on the server'},
  client: {icon: '🌐', label: 'Runs in the browser'},
  both: {icon: '🔁', label: 'Server first, then the browser'},
  build: {icon: '🏗️', label: 'Runs at build time'},
};

/** Pill that says where the next code block runs: <RunsOn where="server" />. Optional children add a short note. */
export function RunsOn({where, children}: {where: Where; children?: ReactNode}) {
  const {icon, label} = WHERE[where];
  return (
    <p className={clsx(styles.runsOn, styles[`runsOn-${where}`])}>
      <span className={styles.runsOnPill}>
        <span aria-hidden>{icon}</span> {label}
      </span>
      {children ? <span className={styles.runsOnNote}>{children}</span> : null}
    </p>
  );
}

/* ---------- Side-by-side comparison ---------- */

/** Two (or more) columns that stack on phones: <Compare><Side title="React">...</Side><Side title="Next.js" tone="new">...</Side></Compare> */
export function Compare({children}: {children: ReactNode}) {
  return <div className={styles.compare}>{children}</div>;
}

export function Side({title, tone = 'old', children}: {title: ReactNode; tone?: 'old' | 'new' | 'bad' | 'good'; children: ReactNode}) {
  return (
    <div className={clsx(styles.side, styles[`side-${tone}`])}>
      <span className={styles.sideTitle}>{title}</span>
      {children}
    </div>
  );
}
