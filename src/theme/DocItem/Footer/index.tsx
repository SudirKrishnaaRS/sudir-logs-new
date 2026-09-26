import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import type {WrapperProps} from '@docusaurus/types';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {lessonTrack} from '@site/src/lib/progress';
import {CompleteButton, LessonTracker} from '@site/src/components/Progress';

type Props = WrapperProps<typeof FooterType>;

// Lessons get a "Mark complete" card and are remembered for "continue where you left off".
export default function FooterWrapper(props: Props) {
  const {metadata, frontMatter} = useDoc();
  const track = lessonTrack(metadata.id);
  const title = (frontMatter.sidebar_label as string | undefined) ?? metadata.title;
  return (
    <>
      {track ? (
        <>
          <LessonTracker id={metadata.id} path={metadata.permalink} title={title} track={track} />
          <CompleteButton id={metadata.id} />
        </>
      ) : null}
      <Footer {...props} />
    </>
  );
}
