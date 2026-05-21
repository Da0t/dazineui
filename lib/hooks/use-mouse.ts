'use client';

import { useState, useEffect, useRef, useCallback, type RefObject } from 'react';

export interface MousePosition {
  /** Pixel position relative to the target element (or window if no ref). */
  x: number;
  y: number;
  /** Normalized [0, 1] position within the target bounds. */
  normalized: { x: number; y: number };
}

const DEFAULT_POSITION: MousePosition = {
  x: 0,
  y: 0,
  normalized: { x: 0.5, y: 0.5 },
};

/**
 * Tracks mouse position relative to an element ref or the window.
 *
 * @param ref - Optional element ref. When omitted, tracks window-level position.
 * @returns Current mouse position with pixel and normalized (0–1) coordinates.
 *
 * @example
 * // Window-level tracking
 * const { x, y, normalized } = useMouse();
 *
 * @example
 * // Element-relative tracking (for spotlight follow-mouse, etc.)
 * const ref = useRef<HTMLDivElement>(null);
 * const { normalized } = useMouse(ref);
 */
export function useMouse(ref?: RefObject<HTMLElement | null>): MousePosition {
  const [position, setPosition] = useState<MousePosition>(DEFAULT_POSITION);
  const frameRef = useRef<number | null>(null);

  const handleMove = useCallback(
    (e: MouseEvent) => {
      if (frameRef.current !== null) return;

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;

        const target = ref?.current;

        if (target) {
          const rect = target.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setPosition({
            x,
            y,
            normalized: {
              x: Math.max(0, Math.min(1, x / rect.width)),
              y: Math.max(0, Math.min(1, y / rect.height)),
            },
          });
        } else {
          const x = e.clientX;
          const y = e.clientY;
          setPosition({
            x,
            y,
            normalized: {
              x: Math.max(0, Math.min(1, x / window.innerWidth)),
              y: Math.max(0, Math.min(1, y / window.innerHeight)),
            },
          });
        }
      });
    },
    [ref],
  );

  useEffect(() => {
    const el = ref?.current ?? window;
    el.addEventListener('mousemove', handleMove as EventListener);
    return () => {
      el.removeEventListener('mousemove', handleMove as EventListener);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [ref, handleMove]);

  return position;
}
