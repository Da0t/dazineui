import type { CSSProperties } from 'react';
export type SpotlightGradientPreset = 'cool' | 'warm' | 'electric' | 'rose';
export interface SpotlightGradientProps {
    preset?: SpotlightGradientPreset;
    /** Override primary spotlight color (hex or rgba). */
    color?: string;
    /** Override secondary spotlight color. Set null to disable. */
    secondColor?: string;
    /** 0 = frozen, 1 = default. */
    speed?: number;
    /** If true, primary spotlight follows mouse position. */
    followMouse?: boolean;
    grain?: number;
    className?: string;
    style?: CSSProperties;
}
