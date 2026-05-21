'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import type { AuroraGradientProps } from './types';
import { AURORA_GRADIENT_PRESETS } from './presets';

/**
 * AuroraGradient — two layered wave sheets of crisp particle dots.
 *
 * Each sheet is a COLS×ROWS grid of Points. The vertex shader displaces
 * every particle vertically with a compound sine wave (3 frequency
 * components): a slow large undulation, a medium ripple, and fine detail.
 * This reproduces the characteristic neon particle-wave surface look.
 *
 * Two sheets render at different Z depths with a phase offset so their
 * crests cross each other, creating the woven/layered intersection effect.
 * THREE.AdditiveBlending lets overlapping dots mix as real light would.
 *
 * Fragment shader: hard circle discard (distance > 0.5 → discard),
 * then a tiny soft edge. Zero blur anywhere.
 *
 * Reference: the neon-sound-wave particle wave image — cyan sheet +
 * purple sheet crossing on black.
 */

const COLS = 160;
const ROWS = 38;
const N = COLS * ROWS;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uPhase;

  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Three-component compound wave — slow large + medium ripple + fine detail.
    // Frequencies tuned so ~2.5 full cycles are visible across the viewport.
    float wave = sin(pos.x * 0.82 + uTime * uSpeed        + uPhase       ) * 1.15
               + sin(pos.x * 2.10 + uTime * uSpeed * 1.55 + uPhase * 1.8 ) * 0.32
               + sin(pos.x * 4.90 + uTime * uSpeed * 0.75 + uPhase * 0.6 ) * 0.11;
    pos.y += wave;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);

    // Point size: 3.5px base, slight depth boost for front-layer sheets
    gl_PointSize = clamp(3.8 + (-mvPos.z * 0.07), 2.5, 6.0);

    // Alpha: brighter at wave crests, dimmer at troughs — creates the
    // illusion of a lit surface rather than a flat grid
    vAlpha = 0.50 + 0.50 * (sin(pos.x * 0.82 + uTime * uSpeed + uPhase) * 0.5 + 0.5);

    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;

  varying float vAlpha;

  void main() {
    // Crisp circle — discard anything outside the dot radius
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;

    // Very slight softness at the very edge (< 1px feather)
    float alpha = vAlpha * smoothstep(0.5, 0.28, d);
    gl_FragColor = vec4(uColor, alpha);
  }
`;

interface WaveSheetProps {
  color: string;
  yCenter: number;
  zOffset: number;
  phaseOffset: number;
  speed: number;
  sheetW: number;
  sheetH: number;
}

function WaveSheet({
  color,
  yCenter,
  zOffset,
  phaseOffset,
  speed,
  sheetW,
  sheetH,
}: WaveSheetProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const reduced = useReducedMotion();

  const positions = useMemo(() => {
    const arr = new Float32Array(N * 3);
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const i = (row * COLS + col) * 3;
        arr[i]     = (col / (COLS - 1) - 0.5) * sheetW;
        arr[i + 1] = (row / (ROWS - 1) - 0.5) * sheetH + yCenter;
        arr[i + 2] = zOffset;
      }
    }
    return arr;
  }, [sheetW, sheetH, yCenter, zOffset]);

  const uniforms = useRef({
    uTime:  { value: 0 },
    uSpeed: { value: speed },
    uPhase: { value: phaseOffset },
    uColor: { value: new THREE.Color(color) },
  });

  useEffect(() => {
    uniforms.current.uColor.value.set(color);
    uniforms.current.uSpeed.value = speed;
  }, [color, speed]);

  useFrame((state) => {
    if (reduced || !matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function WaveScene({ colors, speed }: { colors: string[]; speed: number }) {
  const { viewport } = useThree();

  // Use first and last color for maximum contrast between the two sheets.
  // Most presets define 2 colors (one per sheet). Arrays with more colors
  // still work — middle values are ignored so the two-sheet structure is clean.
  const color1 = colors[0]                    ?? '#06B6D4';
  const color2 = colors[colors.length - 1]    ?? '#7C3AED';

  // Sheets span slightly wider than the viewport so edges never go bare
  // during the wave's lateral drift. Height = 55% of visible area.
  const sheetW = viewport.width  * 1.08;
  const sheetH = viewport.height * 0.58;

  return (
    <>
      {/* Sheet 1 — front layer, phase 0 */}
      <WaveSheet
        color={color1}
        yCenter={0.18}
        zOffset={0}
        phaseOffset={0}
        speed={speed}
        sheetW={sheetW}
        sheetH={sheetH}
      />
      {/* Sheet 2 — back layer, phase-shifted so crests cross sheet 1 */}
      <WaveSheet
        color={color2}
        yCenter={-0.18}
        zOffset={-0.6}
        phaseOffset={Math.PI * 0.72}
        speed={speed * 0.82}
        sheetW={sheetW}
        sheetH={sheetH}
      />
    </>
  );
}

export function AuroraGradient({
  preset = 'nordic',
  colors,
  speed = 1,
  className,
  style,
}: AuroraGradientProps) {
  const resolvedColors =
    colors ??
    AURORA_GRADIENT_PRESETS[preset]?.colors ??
    AURORA_GRADIENT_PRESETS.nordic.colors;

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#06060a',
        ...style,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 55, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ position: 'absolute', inset: 0 }}
      >
        <WaveScene colors={resolvedColors} speed={speed} />
      </Canvas>
    </div>
  );
}

export type { AuroraGradientProps, AuroraGradientPreset } from './types';
