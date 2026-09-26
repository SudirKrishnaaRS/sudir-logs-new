import MDXComponents from '@theme-original/MDXComponents';
import * as Lesson from '@site/src/components/lesson';
import {TrackProgress} from '@site/src/components/Progress';

// Every lesson component (Callout, Flow, Quiz, CheatCard, ...) is available in
// every .mdx file without an import.
export default {
  ...MDXComponents,
  ...Lesson,
  TrackProgress,
};
