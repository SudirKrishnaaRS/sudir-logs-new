import React from 'react';
import clsx from 'clsx';
import Link from '@theme-original/DocSidebarItem/Link';
import type LinkType from '@theme/DocSidebarItem/Link';
import type {WrapperProps} from '@docusaurus/types';
import {progress} from '@site/src/lib/progress';

type Props = WrapperProps<typeof LinkType>;

// Completed lessons get a check mark in the sidebar (styled via .sl-done in custom.css).
export default function LinkWrapper(props: Props) {
  const {completed} = progress.use();
  const docId = props.item.docId;
  const done = Boolean(docId && completed[docId]);
  return <Link {...props} item={{...props.item, className: clsx(props.item.className, done && 'sl-done')}} />;
}
