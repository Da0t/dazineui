import type { CSSProperties } from 'react';
export type FlowGradientPreset = 'stripe' | 'sunset' | 'ocean' | 'ember' | 'mint';
export interface FlowGradientProps {
    /** Named preset. Defaults to 'stripe'. */
    preset?: FlowGradientPreset;
    /** Override colors directly (hex strings). Overrides preset. */
    colors?: string[];
    /** Animation speed multiplier. 0 = frozen. Defaults to 1. */
    speed?: number;
    /** Grain overlay opacity (0–1). Adds tactile texture. Defaults to 0.015. */
    grain?: number;
    className?: string;
    style?: CSSProperties;
}
