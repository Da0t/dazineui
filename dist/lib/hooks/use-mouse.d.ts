import { type RefObject } from 'react';
export interface MousePosition {
    /** Pixel position relative to the target element (or window if no ref). */
    x: number;
    y: number;
    /** Normalized [0, 1] position within the target bounds. */
    normalized: {
        x: number;
        y: number;
    };
}
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
export declare function useMouse(ref?: RefObject<HTMLElement | null>): MousePosition;
