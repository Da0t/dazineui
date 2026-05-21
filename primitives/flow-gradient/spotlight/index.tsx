'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import type { SpotlightGradientProps } from './types';
import { SPOTLIGHT_GRADIENT_PRESETS } from './presets';

/**
 * SpotlightGradient — R3F animated neon tubes with physical Bloom.
 *
 * Three TubeGeometry meshes snake along CatmullRomCurve3 paths.
 * Each frame the curve control points are offset by sine/cosine functions,
 * animating the tubes with a slow organic undulation. MeshStandardMaterial
 * with toneMapped=false allows emissive values > 1, which the Bloom
 * EffectComposer picks up to produce realistic neon glow.
 *
 * Technique: rebuild TubeGeometry each frame at low polygon count
 * (32 path segments × 6 radial segments = 192 triangles per tube).
 * Three tubes total = 576 triangles — trivial for the GPU, noticeable CPU
 * cost justified by the visual fidelity of true 3D HDR bloom.
 */

interface TubeConfig {
  color: string;
  basePoints: THREE.Vector3[];
  phaseOffset: number;
  speedScale: number;
}

const PATH_SEGS  = 32;
const RADIAL_SEGS = 6;
const TUBE_RADIUS = 0.035;

function NeonTube({
  color,
  basePoints,
  phaseOffset,
  speedScale,
  speed,
  reduced,
}: TubeConfig & { speed: number; reduced: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // The curve object is mutated in-place each frame — no recreation
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3([...basePoints], false, 'catmullrom', 0.5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const initGeom = useMemo(
    () => new THREE.TubeGeometry(curve, PATH_SEGS, TUBE_RADIUS, RADIAL_SEGS, false),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((state) => {
    if (reduced || !meshRef.current) return;
    const t = state.clock.getElapsedTime() * speed * speedScale;

    // Animate each control point with a unique phase
    curve.points = basePoints.map((p, i) => {
      const ph = i * 0.9 + phaseOffset;
      return new THREE.Vector3(
        p.x + Math.sin(t * 0.4 + ph)        * 0.55,
        p.y + Math.cos(t * 0.32 + ph * 1.3) * 0.38,
        p.z + Math.sin(t * 0.28 + ph * 0.7) * 0.2,
      );
    });

    // Dispose old geometry and replace — geometry rebuild at 32×6 is ~0.1ms
    meshRef.current.geometry.dispose();
    meshRef.current.geometry = new THREE.TubeGeometry(
      curve, PATH_SEGS, TUBE_RADIUS, RADIAL_SEGS, false,
    );
  });

  return (
    <mesh ref={meshRef} geometry={initGeom}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={5}
        toneMapped={false}
      />
    </mesh>
  );
}

function NeonScene({
  color,
  secondColor,
  speed,
}: {
  color: string;
  secondColor: string;
  speed: number;
}) {
  const reduced = useReducedMotion();

  // Three tube paths — each starts and ends off-screen
  const tubes: TubeConfig[] = useMemo(() => [
    {
      color,
      basePoints: [
        new THREE.Vector3(-5,  0.5,  0),
        new THREE.Vector3(-2,  1.0,  0.5),
        new THREE.Vector3( 0,  0.0, -0.3),
        new THREE.Vector3( 2, -0.8,  0.4),
        new THREE.Vector3( 5,  0.3,  0),
      ],
      phaseOffset:  0,
      speedScale:   1,
    },
    {
      color: secondColor,
      basePoints: [
        new THREE.Vector3(-5, -0.8, 0.2),
        new THREE.Vector3(-1.5,  0.4, -0.4),
        new THREE.Vector3( 0.5, -0.3,  0.5),
        new THREE.Vector3( 2.5,  0.9, -0.2),
        new THREE.Vector3( 5, -0.4,  0),
      ],
      phaseOffset:  2.1,
      speedScale:   0.82,
    },
    {
      color,
      basePoints: [
        new THREE.Vector3(-4.5,  1.2, -0.3),
        new THREE.Vector3(-1,   -0.6,  0.6),
        new THREE.Vector3( 1.2,  0.8, -0.5),
        new THREE.Vector3( 3.5, -0.2,  0.3),
        new THREE.Vector3( 5,    0.9, -0.1),
      ],
      phaseOffset:  4.2,
      speedScale:   1.15,
    },
  ], [color, secondColor]);

  return (
    <>
      <ambientLight intensity={0.05} />
      {tubes.map((t, i) => (
        <NeonTube key={i} {...t} speed={speed} reduced={reduced} />
      ))}
      <EffectComposer>
        <Bloom
          intensity={1.4}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.3}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export function SpotlightGradient({
  preset = 'cool',
  color,
  secondColor,
  speed = 1,
  className,
  style,
}: SpotlightGradientProps) {
  const resolved = SPOTLIGHT_GRADIENT_PRESETS[preset];
  const c1 = color       ?? resolved.color;
  const c2 = secondColor ?? resolved.secondColor;

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
        camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NoToneMapping }}
        dpr={[1, 2]}
        style={{ position: 'absolute', inset: 0 }}
      >
        <NeonScene color={c1} secondColor={c2} speed={speed} />
      </Canvas>
    </div>
  );
}

export type { SpotlightGradientProps, SpotlightGradientPreset } from './types';
