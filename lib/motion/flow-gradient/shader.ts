// FlowGradient vertex and fragment shaders.
// Renders an animated gradient mesh using layered simplex noise.
// The effect fills a fullscreen quad — no geometry other than a plane.

import { GLSL_NOISE, GLSL_COLOR } from '../../shaders/noise';

export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  ${GLSL_NOISE}
  ${GLSL_COLOR}

  uniform float uTime;
  uniform float uSpeed;
  uniform float uIntensity;
  uniform vec3 uColor0;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Layer 3 octaves of FBM noise at different scales and speeds
    float t = uTime * uSpeed;
    float n1 = fbm(vec3(uv * 1.8, t * 0.7), 4, 2.0, 0.5);
    float n2 = fbm(vec3(uv * 2.4 + 3.7, t * 0.4), 3, 2.0, 0.5);
    float n3 = fbm(vec3(uv * 1.2 + 7.1, t * 0.9), 3, 2.0, 0.5);

    // Blend four colors via smooth noise-driven masks
    float w0 = smoothstep(0.0, 1.0, n1 * 0.5 + 0.5);
    float w1 = smoothstep(0.0, 1.0, n2 * 0.5 + 0.5);
    float w2 = smoothstep(0.0, 1.0, n3 * 0.5 + 0.5);

    vec3 col = mix(uColor0, uColor1, w0);
    col = mix(col, uColor2, w1 * 0.7);
    col = mix(col, uColor3, w2 * 0.5);

    // Apply intensity contrast
    col = mix(vec3(dot(col, vec3(0.299, 0.587, 0.114))), col, uIntensity);

    // ACES tonemap + gamma
    col = acesTonemap(col * 1.2);
    col = linearToSrgb(col);

    gl_FragColor = vec4(col, 1.0);
  }
`;
