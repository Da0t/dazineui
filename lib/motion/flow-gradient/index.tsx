'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shader';
import { FLOW_GRADIENT_PRESETS } from './presets';
import { useReducedMotion } from '../../hooks/use-reduced-motion';
import type { FlowGradientProps } from './types';

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

function FlowMesh({
  colors,
  speed,
  intensity,
}: {
  colors: string[];
  speed: number;
  intensity: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const reduced = useReducedMotion();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: reduced ? 0 : speed },
      uIntensity: { value: intensity },
      uColor0: { value: hexToVec3(colors[0] ?? '#7c3aed') },
      uColor1: { value: hexToVec3(colors[1] ?? '#4f46e5') },
      uColor2: { value: hexToVec3(colors[2] ?? '#0ea5e9') },
      uColor3: { value: hexToVec3(colors[3] ?? colors[0] ?? '#7c3aed') },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colors.join(), speed, intensity, reduced]
  );

  useFrame((state) => {
    if (reduced) return;
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

export function FlowGradient({
  preset = 'aurora',
  colors,
  speed,
  intensity,
  className,
  grain = 0.04,
}: FlowGradientProps) {
  const config = FLOW_GRADIENT_PRESETS[preset];
  const resolvedColors = colors ?? config.colors;
  const resolvedSpeed = speed ?? config.speed;
  const resolvedIntensity = intensity ?? config.intensity;

  return (
    <div
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        camera={{ position: [0, 0, 1], near: 0.1, far: 10 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <FlowMesh
          colors={resolvedColors}
          speed={resolvedSpeed}
          intensity={resolvedIntensity}
        />
      </Canvas>
      {/* Grain overlay for tactile texture */}
      {grain > 0 && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            opacity: grain,
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}

export type { FlowGradientProps, FlowGradientPreset } from './types';
