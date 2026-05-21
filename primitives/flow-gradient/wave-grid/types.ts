import type { CSSProperties } from 'react';

export type WaveGridPreset = 'white' | 'ocean' | 'neon' | 'ember' | 'plasma';

export interface WaveGridProps {
  preset?: WaveGridPreset;
  /** Override particle color (hex string). */
  color?: string;
  /** Animation speed multiplier. 0 = frozen. Defaults to 1. */
  speed?: number;
  /** Grid columns (X axis). Higher = denser. Defaults to 50. */
  amountX?: number;
  /** Grid rows (Z axis). Higher = denser. Defaults to 50. */
  amountY?: number;
  /** Whether the camera follows mouse movement. Defaults to true. */
  followMouse?: boolean;
  className?: string;
  style?: CSSProperties;
}
