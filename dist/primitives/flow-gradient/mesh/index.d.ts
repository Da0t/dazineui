import type { MeshGradientProps } from './types';
/**
 * MeshGradient — Canvas 2D color fiber streams.
 *
 * 120 thin cubic bezier curves sweep across the canvas in palette colors.
 * Each fiber has two slowly-drifting control points, creating an organic
 * weaving motion. No blur — crisp, hair-thin strokes with alpha variation
 * for perceptual depth.
 *
 * Technique: each fiber is a single bezierCurveTo call. Control point
 * velocities are tiny and reverse when hitting canvas bounds, ensuring
 * the animation stays fluid indefinitely without resetting.
 */
export declare function MeshGradient({ preset, colors, speed, className, style, }: MeshGradientProps): import("react/jsx-runtime").JSX.Element;
export type { MeshGradientProps, MeshGradientPreset } from './types';
