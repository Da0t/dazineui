'use client';

import { useState, useEffect, useRef, useCallback, type RefObject } from 'react';

/**
 * Returns a 0–1 scroll progress value.
 *
 * - Without a ref: page-level scroll progress (0 at top, 1 at bottom of scrollable content).
 * - With a ref: element's visibility progress through the viewport (0 when bottom edge enters
 *   viewport, 1 when top edge exits viewport). Useful for scroll-driven animations.
 *
 * @param ref - Optional element ref for element-level progress.
 * @returns Progress value in [0, 1].
 *
 * @example
 * // Page-level scroll progress (e.g. reading progress bar)
 * const progress = useScrollProgress();
 *
 * @example
 * // Element in-viewport progress (e.g. ScrollScene)
 * const ref = useRef<HTMLDivElement>(null);
 * const progress = useScrollProgress(ref);
 */
export function useScrollProgress(ref?: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);
  const frameRef = useRef<number | null>(null);

  const compute = useCallback(() => {
    if (frameRef.current !== null) return;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;

      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect();
        const vh = window.innerHeight;
        // 0 when element bottom enters from below; 1 when element top exits above
        const total = rect.height + vh;
        const elapsed = vh - rect.top;
        setProgress(Math.max(0, Math.min(1, elapsed / total)));
      } else {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? Math.max(0, Math.min(1, scrollTop / docHeight)) : 0);
      }
    });
  }, [ref]);

  useEffect(() => {
    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute, { passive: true });
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [compute]);

  return progress;
}
