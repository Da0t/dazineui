'use client';

import { useEffect, useRef } from 'react';

export interface MousePosition {
  x: number; // -1 to 1, normalized to viewport
  y: number; // -1 to 1, normalized to viewport
  px: number; // 0 to 1
  py: number; // 0 to 1
}

// Returns a ref (not state) to avoid re-renders on every mouse move.
// Read .current.x / .current.y in animation loops.
export function useMouse(): React.RefObject<MousePosition> {
  const mouse = useRef<MousePosition>({ x: 0, y: 0, px: 0.5, py: 0.5 });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const px = e.clientX / window.innerWidth;
      const py = e.clientY / window.innerHeight;
      mouse.current = {
        x: px * 2 - 1,
        y: -(py * 2 - 1),
        px,
        py,
      };
    }
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return mouse;
}
