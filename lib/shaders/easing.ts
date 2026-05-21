/**
 * Reusable GLSL easing functions.
 *
 * Import as template-literal strings and inject into shader source:
 *
 *   import { EASE_IN_OUT_CUBIC, SMOOTHERSTEP, REMAP } from '@/lib/shaders/easing';
 *
 *   const fragmentShader = `
 *     ${REMAP}
 *     ${SMOOTHERSTEP}
 *     ${EASE_IN_OUT_CUBIC}
 *     void main() { ... }
 *   `;
 *
 * All functions are self-contained.
 */

// REMAP — map a value from one range to another.
// Equivalent to Three.js MathUtils.mapLinear. Used constantly for range normalization.
export const REMAP = /* glsl */`
float remap(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

// Clamped variant — output is bounded to [outMin, outMax].
float remapClamped(float value, float inMin, float inMax, float outMin, float outMax) {
  return clamp(remap(value, inMin, inMax, outMin, outMax), min(outMin, outMax), max(outMin, outMax));
}
`;

// SMOOTHERSTEP — Ken Perlin's improved smoothstep (6t^5 - 15t^4 + 10t^3).
// Zero first and second derivative at t=0 and t=1 — no visible inflection point.
// Prefer over GLSL built-in smoothstep for gradient blending.
export const SMOOTHERSTEP = /* glsl */`
float smootherstep(float edge0, float edge1, float x) {
  float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

// Normalized variant — input already in [0, 1].
float smootherstep(float t) {
  t = clamp(t, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}
`;

// Standard easing curves — all accept t in [0, 1], return value in [0, 1].

export const EASE_IN_OUT_CUBIC = /* glsl */`
float easeInOutCubic(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}
`;

export const EASE_OUT_QUINT = /* glsl */`
float easeOutQuint(float t) {
  return 1.0 - pow(1.0 - t, 5.0);
}
`;

export const EASE_IN_EXPO = /* glsl */`
float easeInExpo(float t) {
  return t == 0.0 ? 0.0 : pow(2.0, 10.0 * t - 10.0);
}
`;

export const EASE_OUT_EXPO = /* glsl */`
float easeOutExpo(float t) {
  return t == 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * t);
}
`;

export const EASE_IN_OUT_EXPO = /* glsl */`
float easeInOutExpo(float t) {
  if (t == 0.0) return 0.0;
  if (t == 1.0) return 1.0;
  return t < 0.5
    ? pow(2.0, 20.0 * t - 10.0) / 2.0
    : (2.0 - pow(2.0, -20.0 * t + 10.0)) / 2.0;
}
`;
