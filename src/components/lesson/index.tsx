import React, {Children, Fragment, useEffect, useState, type ReactNode} from 'react';
import clsx from 'clsx';
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
