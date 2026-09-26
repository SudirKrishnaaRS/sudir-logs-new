import {useEffect, useRef, useState} from 'react';

/**
 * Open state for a navbar popover. Closes on an outside click and on Esc
 * (Esc here must not also exit focus mode, so it is captured and stopped).
 */
export function usePopover<T extends HTMLElement>() {
  const [open, setOpen] = useState(false);
  const wrap = useRef<T>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey, true);
    };
  }, [open]);

  return {open, setOpen, wrap};
}
