import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import LearningPaths from '@site/src/components/NavbarTools/LearningPaths';
import PomodoroChip from '@site/src/components/NavbarTools/Pomodoro';
import ReadingOptions from '@site/src/components/NavbarTools/ReadingOptions';

// Custom navbar item types, used from docusaurus.config.ts.
export default {
  ...ComponentTypes,
  'custom-learningPaths': LearningPaths,
  'custom-pomodoro': PomodoroChip,
  'custom-readingOptions': ReadingOptions,
};
