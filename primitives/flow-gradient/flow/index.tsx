'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import type { FlowGradientProps } from './types';
import { FLOW_GRADIENT_PRESETS } from './presets';

/**
 * FlowGradient — R3F diagonal wave ribbons.
 *
 * Five PlaneGeometry meshes rotated 35° around Z, each using a ShaderMaterial
 * whose vertex shader displaces the ribbon along Z with a sine wave:
 *   pos.z += amplitude · sin(pos.x · frequency + time · waveSpeed + phase)
 *
 * THREE.AdditiveBlending causes overlapping ribbons to mix their colors
 * naturally, creating rich chromatic intersections without any blur.
 * Each ribbon has independent wave frequency, amplitude, phase, and speed.
 *
 * API: preset, colors, speed, grain (grain prop accepted, not rendered —
 * blur-free by design), className, style.
 */

const ROTATION_Z  = Math.PI * 35 / 180;   // 35° tilt
const RIBBON_W    = 22;                    // world units — extends past viewport
const RIBBON_H    = 0.42;                  // band thickness
const RIBBON_SEGS = 128;                   // path vertices for smooth sine

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uWaveSpeed;
  uniform float uAmplitude;
  uniform float uFrequency;
  uniform float uPhase;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Sine wave displacement along Z — ribbon undulates in depth
    float wave = sin(pos.x * uFrequency + uTime * uWaveSpeed + uPhase)
               + 0.4 * sin(pos.x * uFrequency * 1.8 + uTime * uWaveSpeed * 0.6 + uPhase + 1.0);
    pos.z += wave * uAmplitude;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying vec2 vUv;

  void main() {
    // Smooth alpha falloff from ribbon center → edges
    float edge  = abs(vUv.y - 0.5) * 2.0;        // 0 = center, 1 = edge
    float alpha = smoothstep(1.0, 0.20, edge) * uOpacity;

    // Soft fade at the ribbon's horizontal ends
    float ends  = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x);
    alpha *= ends;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

interface RibbonProps {
  color: string;
  yOffset: number;
  phaseOffset: number;
  amplitude: number;
  frequency: number;
  waveSpeed: number;
}

function Ribbon({ color, yOffset, phaseOffset, amplitude, frequency, waveSpeed }: RibbonProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const reduced = useReducedMotion();

  // Stable uniform object — mutated directly; never triggers re-render
  const uniforms = useRef({
    uTime:      { value: 0 },
    uWaveSpeed: { value: waveSpeed },
    uAmplitude: { value: amplitude },
    uFrequency: { value: frequency },
    uPhase:     { value: phaseOffset },
    uColor:     { value: new THREE.Color(color) },
    uOpacity:   { value: 0.78 },
  });

  // Sync prop changes (color, speed) into the uniform object
  useEffect(() => {
    uniforms.current.uColor.value.set(color);
    uniforms.current.uWaveSpeed.value = waveSpeed;
  }, [color, waveSpeed]);

  useFrame((state) => {
    if (reduced || !matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <mesh position={[0, yOffset, 0]} rotation={[0, 0, ROTATION_Z]}>
      <planeGeometry args={[RIBBON_W, RIBBON_H, RIBBON_SEGS, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function RibbonScene({ colors, speed }: { colors: string[]; speed: number }) {
  const { viewport } = useThree();

  // Ensure exactly 5 colors
  const palette = [...colors];
  while (palette.length < 5) palette.push(palette[palette.length - 1] ?? '#7C3AED');
  const five = palette.slice(0, 5);

  // Spread ribbons evenly across the vertical viewport
  const spread = viewport.height * 0.82;

  return (
    <>
      {five.map((color, i) => (
        <Ribbon
          key={i}
          color={color}
          yOffset={(i / (five.length - 1) - 0.5) * spread}
          phaseOffset={i * ((Math.PI * 2) / five.length)}
          amplitude={0.24 + i * 0.04}
          frequency={0.68 + i * 0.17}
          waveSpeed={speed * (0.38 + i * 0.1)}
        />
      ))}
    </>
  );
}

export function FlowGradient({
  preset = 'stripe',
  colors,
  speed = 1,
  className,
  style,
}: FlowGradientProps) {
  const resolvedColors = colors ?? FLOW_GRADIENT_PRESETS[preset]?.colors ?? FLOW_GRADIENT_PRESETS.stripe.colors;

  return (
    <div
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        style={{ position: 'absolute', inset: 0, background: '#06060a' }}
      >
        <RibbonScene colors={resolvedColors} speed={speed} />
      </Canvas>
    </div>
  );
}

export type { FlowGradientProps, FlowGradientPreset } from './types';
