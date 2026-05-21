// Easing functions for use in GLSL shaders and JavaScript animations.

export const GLSL_EASING = /* glsl */ `
float easeInOutCubic(float t) {
  return t < 0.5 ? 4.0*t*t*t : 1.0 - pow(-2.0*t + 2.0, 3.0) / 2.0;
}
float easeOutExpo(float t) {
  return t == 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * t);
}
float easeInOutQuart(float t) {
  return t < 0.5 ? 8.0*t*t*t*t : 1.0 - pow(-2.0*t + 2.0, 4.0) / 2.0;
}
float easeOutElastic(float t) {
  float c4 = (2.0 * 3.14159265) / 3.0;
  if (t == 0.0) return 0.0;
  if (t == 1.0) return 1.0;
  return pow(2.0, -10.0*t) * sin((t*10.0 - 0.75) * c4) + 1.0;
}
`;

// JS easing functions — used for scroll progress and animation curves
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}
