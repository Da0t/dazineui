'use client';

import { useEffect, useRef } from 'react';

// Returns a ref with scroll progress (0–1) relative to a target element.
// 0 = element top enters viewport, 1 = element bottom leaves viewport.
export function useScrollProgress(
  ref: React.RefObject<HTMLElement | null>
): React.RefObject<number> {
  const progress = useRef(0);

  useEffect(() => {
    function update() {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const traveled = vh - rect.top;
      progress.current = Math.min(Math.max(traveled / total, 0), 1);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [ref]);

  return progress;
}
