import { type RefObject } from 'react';
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
export declare function useScrollProgress(ref?: RefObject<HTMLElement | null>): number;
