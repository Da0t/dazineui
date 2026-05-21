export type FlowGradientPreset = 'aurora' | 'sunset' | 'electric' | 'monochrome';

export interface FlowGradientProps {
  /** Named preset. Overrides individual color/speed props when set. */
  preset?: FlowGradientPreset;
  /** Override gradient colors. Pass 2–4 hex strings. */
  colors?: string[];
  /** Animation speed multiplier. 0.1 = very slow, 0.8 = max recommended. Default: 0.3 */
  speed?: number;
  /** Effect intensity / contrast. 0 = flat, 1 = full. Default: 0.7 */
  intensity?: number;
  /** CSS className for the wrapper div. */
  className?: string;
  /** Grain overlay opacity (0–1). Adds tactile texture. Default: 0.04 */
  grain?: number;
}
