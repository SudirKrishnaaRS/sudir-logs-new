import React, {type ReactNode} from 'react';
import FocusController from '@site/src/components/FocusMode';
import {PomodoroController} from '@site/src/components/NavbarTools/Pomodoro';
import {StreakToast, StudyTracker} from '@site/src/components/Streak';
import {useApplyTextScale} from '@site/src/lib/prefs';

// Wraps the whole app once; hosts site-wide behaviour (focus mode, timer, text size, study streak).
export default function Root({children}: {children: ReactNode}) {
  useApplyTextScale();
  return (
    <>
      {children}
      <FocusController />
      <PomodoroController />
      <StudyTracker />
      <StreakToast />
    </>
  );
}
