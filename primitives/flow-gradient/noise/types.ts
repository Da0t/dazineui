import type { CSSProperties } from 'react';

export type NoiseGradientPreset = 'void' | 'dusk' | 'forest' | 'cherry';

export interface NoiseGradientProps {
  preset?: NoiseGradientPreset;
  /** Override gradient colors [from, mid, to] as hex strings. */
  colors?: [string, string, string];
  /** Animation speed multiplier. Note: this primitive uses CSS animation, not rAF. */
  speed?: number;
  /** SVG turbulence base frequency. Lower = larger blobs. Defaults to 0.006. */
  frequency?: number;
  /** Number of noise octaves. Higher = more detail. Defaults to 4. */
  octaves?: number;
  className?: string;
  style?: CSSProperties;
}
