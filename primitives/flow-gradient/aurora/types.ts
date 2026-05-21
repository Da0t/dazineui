import type { CSSProperties } from 'react';

export type AuroraGradientPreset = 'nordic' | 'plasma' | 'void' | 'twilight';

export interface AuroraGradientProps {
  preset?: AuroraGradientPreset;
  /** Override band colors (hex strings). Each color becomes one light band. */
  colors?: string[];
  speed?: number;
  grain?: number;
  className?: string;
  style?: CSSProperties;
}
