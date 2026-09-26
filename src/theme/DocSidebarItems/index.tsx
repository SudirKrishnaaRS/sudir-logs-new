import React from 'react';
import DocSidebarItems from '@theme-original/DocSidebarItems';
import type DocSidebarItemsType from '@theme/DocSidebarItems';
import type {WrapperProps} from '@docusaurus/types';
import {CourseProgress} from '@site/src/components/Progress';

type Props = WrapperProps<typeof DocSidebarItemsType>;

// The top level of every doc sidebar (desktop and the mobile drawer) starts with the course progress card.
export default function DocSidebarItemsWrapper(props: Props) {
  if (props.level !== 1) return <DocSidebarItems {...props} />;
  return (
    <>
      <li className="sl-course-progress">
        <CourseProgress />
      </li>
      <DocSidebarItems {...props} />
    </>
  );
}
