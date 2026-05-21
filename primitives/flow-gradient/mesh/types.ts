import type { CSSProperties } from 'react';

export type MeshGradientPreset = 'cosmos' | 'dawn' | 'forest' | 'candy';

export interface MeshGradientProps {
  preset?: MeshGradientPreset;
  /** Array of hex colors for the control points. Length should equal rows × cols. */
  colors?: string[];
  speed?: number;
  /** Grid rows. Defaults to 3. */
  rows?: number;
  /** Grid columns. Defaults to 3. */
  cols?: number;
  grain?: number;
  className?: string;
  style?: CSSProperties;
}
