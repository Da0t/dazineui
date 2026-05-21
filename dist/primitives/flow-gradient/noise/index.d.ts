import type { NoiseGradientProps } from './types';
/**
 * NoiseGradient — Canvas 2D flow-field particle system.
 *
 * 2000 particles trace organic curves through a sin+cos vector field,
 * leaving colored trails. No blur, no filters — pure crisp generative lines.
 *
 * Technique: flow field angles computed from sin(x·zoom) + cos(y·zoom),
 * each particle follows the local angle and records a trail history.
 * Inspired by the "Basic Flow Field" approach by Frank's Laboratory.
 */
export declare function NoiseGradient({ preset, colors, speed, frequency, className, style, }: NoiseGradientProps): import("react/jsx-runtime").JSX.Element;
export type { NoiseGradientProps, NoiseGradientPreset } from './types';
