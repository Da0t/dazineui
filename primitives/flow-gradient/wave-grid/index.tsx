'use client';

import { useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import type { WaveGridProps } from './types';
import { WAVE_GRID_PRESETS } from './presets';

/**
 * WaveGrid — faithful R3F adaptation of the Three.js webgl_particles_waves example.
 *
 * A AMOUNTX×AMOUNTY grid of particles sits in the XZ plane. Every frame the
 * vertex shader displaces each particle on Y using two overlapping sine waves
 * driven by the animation counter:
 *
 *   y = sin((col + count) * 0.3) * amp
 *     + sin((row + count) * 0.5) * amp
 *
 * Point size also scales with the wave height — crests are bigger, troughs
 * are smaller — giving the characteristic "breathing grid" appearance.
 *
 * A perspective camera sits at z=1000, looking at the origin. When
 * `followMouse` is enabled the camera X/Y lazily tracks the pointer
 * (spring coefficient 0.05, matching the original example exactly).
 *
 * Source: https://threejs.org/examples/webgl_particles_waves.html
 * Adapted to React Three Fiber with typed props, reduced-motion support,
 * and color presets.
 */

const SEPARATION = 100;

// Vertex shader — GPU-side wave displacement + perspective point scaling.
// Matches the original Three.js example logic exactly; uCount increments
// each frame (equivalent to the original `count` variable).
const vertexShader = /* glsl */ `
  attribute float scale;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // Perspective-correct point size: larger near camera, smaller far.
    // The 300.0 constant is taken directly from the Three.js original.
    gl_PointSize = scale * (300.0 / -mvPosition.z);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 color;

  void main() {
    // Crisp circle — matches the original's 0.475 radius exactly
    if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
    gl_FragColor = vec4(color, 1.0);
  }
`;

interface WaveSceneProps {
  color: string;
  speed: number;
  amountX: number;
  amountY: number;
  followMouse: boolean;
  mouseRef: React.RefObject<{ x: number; y: number }>;
}

function WaveScene({ color, speed, amountX, amountY, followMouse, mouseRef }: WaveSceneProps) {
  const { camera } = useThree();
  const reduced = useReducedMotion();
  const geoRef = useRef<THREE.BufferGeometry>(null);
  const countRef = useRef(0);

  const numParticles = amountX * amountY;

  // Build the initial flat XZ grid — Y starts at 0, updated each frame
  const { positions, scales } = useMemo(() => {
    const positions = new Float32Array(numParticles * 3);
    const scales    = new Float32Array(numParticles);
    let i = 0;
    let j = 0;
    for (let ix = 0; ix < amountX; ix++) {
      for (let iy = 0; iy < amountY; iy++) {
        positions[i]     = ix * SEPARATION - (amountX * SEPARATION) / 2;  // x
        positions[i + 1] = 0;                                               // y
        positions[i + 2] = iy * SEPARATION - (amountY * SEPARATION) / 2;  // z
        scales[j] = 1;
        i += 3;
        j++;
      }
    }
    return { positions, scales };
  }, [numParticles, amountX, amountY]);

  const uniforms = useMemo(() => ({
    color: { value: new THREE.Color(color) },
  }), [color]);

  // Sync color uniform when prop changes
  useEffect(() => {
    uniforms.color.value.set(color);
  }, [color, uniforms]);

  useFrame(() => {
    if (!geoRef.current) return;

    const posArr   = geoRef.current.attributes.position.array as Float32Array;
    const scaleArr = geoRef.current.attributes.scale.array    as Float32Array;

    const count = countRef.current;
    let i = 0;
    let j = 0;

    for (let ix = 0; ix < amountX; ix++) {
      for (let iy = 0; iy < amountY; iy++) {
        // Y displacement — direct port of the Three.js original formula
        posArr[i + 1] =
          Math.sin((ix + count) * 0.3) * 50 +
          Math.sin((iy + count) * 0.5) * 50;

        // Scale — crests are bigger, troughs are smaller
        scaleArr[j] =
          (Math.sin((ix + count) * 0.3) + 1) * 20 +
          (Math.sin((iy + count) * 0.5) + 1) * 20;

        i += 3;
        j++;
      }
    }

    geoRef.current.attributes.position.needsUpdate = true;
    geoRef.current.attributes.scale.needsUpdate    = true;

    // Camera mouse follow — spring coefficient 0.05 matches original
    if (followMouse && mouseRef.current) {
      camera.position.x += (mouseRef.current.x  - camera.position.x) * 0.05;
      camera.position.y += (-mouseRef.current.y - camera.position.y) * 0.05;
    }
    camera.lookAt(0, 0, 0);

    if (!reduced) countRef.current += 0.1 * speed;
  });

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-scale"    args={[scales, 1]}    />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>
  );
}

export function WaveGrid({
  preset      = 'white',
  color,
  speed       = 1,
  amountX     = 50,
  amountY     = 50,
  followMouse = true,
  className,
  style,
}: WaveGridProps) {
  const resolvedColor = color ?? WAVE_GRID_PRESETS[preset]?.color ?? '#ffffff';

  // Store mouse position in a ref so it's readable inside useFrame without
  // causing re-renders. Initial value matches window center = [0, 0].
  const mouseRef = useRef({ x: 0, y: 0 });

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!e.isPrimary) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mouseRef.current.x =  e.clientX - rect.left  - rect.width  / 2;
    mouseRef.current.y =  e.clientY - rect.top   - rect.height / 2;
  }, []);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#000000',
        ...style,
      }}
      onPointerMove={followMouse ? handlePointerMove : undefined}
    >
      <Canvas
        camera={{ position: [0, 0, 1000], fov: 75, near: 1, far: 10000 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        style={{ position: 'absolute', inset: 0 }}
      >
        <WaveScene
          color={resolvedColor}
          speed={speed}
          amountX={amountX}
          amountY={amountY}
          followMouse={followMouse}
          mouseRef={mouseRef}
        />
      </Canvas>
    </div>
  );
}

export type { WaveGridProps, WaveGridPreset } from './types';
