import type { CSSProperties } from 'react';

export type NoiseGradientPreset = 'void' | 'dusk' | 'forest' | 'cherry';

export interface NoiseGradientProps {
  preset?: NoiseGradientPreset;
  /** Particle palette. Each color is randomly assigned across 2000 flow-field particles. */
  colors?: string[];
  /** Animation speed multiplier. 0 = frozen. Defaults to 1. */
  speed?: number;
  /**
   * Flow-field zoom. Smaller = broader, sweeping curves. Larger = tighter spirals.
   * Defaults to 0.012.
   */
  frequency?: number;
  className?: string;
  style?: CSSProperties;
}
