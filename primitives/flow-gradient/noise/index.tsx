import type { CSSProperties } from 'react';
import type { NoiseGradientProps } from './types';
import { NOISE_GRADIENT_PRESETS } from './presets';

/**
 * NoiseGradient — zero JS, pure SVG feTurbulence + CSS animation.
 * The most performant gradient: entirely GPU-accelerated filter pipeline.
 * Works server-side (no 'use client' needed).
 */
export function NoiseGradient({
  preset = 'void',
  colors,
  speed = 1,
  frequency = 0.006,
  octaves = 4,
  className,
  style,
}: NoiseGradientProps) {
  const resolved = NOISE_GRADIENT_PRESETS[preset];
  const [c1, c2, c3] = colors ?? resolved.colors;

  const id = `ng-${preset}-${Math.round(frequency * 1000)}`;
  const duration = (28 / speed).toFixed(1);

  // The animation runs via CSS on the feTurbulence seed — purely declarative
  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      {/* Base gradient gives it color before the turbulence layers */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`,
        }}
      />
      {/* Noise layer composited on top via mix-blend-mode */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          mixBlendMode: 'soft-light',
          opacity: 0.85,
        }}
      >
        <defs>
          <filter id={id} x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`${frequency} ${frequency * 0.8}`}
              numOctaves={octaves}
              seed="2"
              stitchTiles="stitch"
              result="noise"
            >
              <animate
                attributeName="seed"
                values="1;50;1"
                dur={`${duration}s`}
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feColorMatrix
              type="matrix"
              values="2 0 0 0 -0.5  0 2 0 0 -0.5  0 0 2 0 -0.5  0 0 0 1 0"
              result="contrast"
            />
            <feBlend in="SourceGraphic" in2="contrast" mode="multiply" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </div>
  );
}

export type { NoiseGradientProps, NoiseGradientPreset } from './types';
