import React, {type ReactNode} from 'react';
import FocusController from '@site/src/components/FocusMode';

// Wraps the whole app once; hosts site-wide behaviour like focus mode.
export default function Root({children}: {children: ReactNode}) {
  return (
    <>
      {children}
      <FocusController />
    </>
  );
}
