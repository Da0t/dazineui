'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import type { SpotlightGradientProps } from './types';
import { SPOTLIGHT_GRADIENT_PRESETS } from './presets';

export function SpotlightGradient({
  preset = 'cool',
  color,
  secondColor,
  speed = 1,
  followMouse = false,
  className,
  style,
  grain = 0.015,
}: SpotlightGradientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  const resolved = SPOTLIGHT_GRADIENT_PRESETS[preset];
  const c1 = color ?? resolved.color;
  const c2 = secondColor ?? resolved.secondColor;

  // Spotlight position as percentage (0-100)
  const [pos, setPos] = useState({ x: 50, y: 40 });
  const [pos2, setPos2] = useState({ x: 70, y: 65 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function onMouseMove(e: MouseEvent) {
      if (!followMouse || !el) return;
      const rect = el.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };
    }

    el.addEventListener('mousemove', onMouseMove);

    if (!reduced) {
      function tick(ts: number) {
        const t = (ts / 1000) * speed;
        timeRef.current = t;

        if (followMouse && mouseRef.current) {
          setPos(p => ({
            x: p.x + (mouseRef.current!.x - p.x) * 0.05,
            y: p.y + (mouseRef.current!.y - p.y) * 0.05,
          }));
        } else {
          setPos({
            x: 50 + Math.sin(t * 0.4) * 28,
            y: 40 + Math.cos(t * 0.31) * 22,
          });
        }

        setPos2({
          x: 55 + Math.cos(t * 0.27) * 30,
          y: 60 + Math.sin(t * 0.35) * 20,
        });

        rafRef.current = requestAnimationFrame(tick);
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      el.removeEventListener('mousemove', onMouseMove);
    };
  }, [speed, reduced, followMouse]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#08080C', ...style }}
    >
      {/* Primary spotlight */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at ${pos.x}% ${pos.y}%, ${c1}55 0%, transparent 70%)`,
          transition: reduced ? 'none' : undefined,
          willChange: 'background',
        }}
      />
      {/* Secondary spotlight */}
      {c2 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 45% 40% at ${pos2.x}% ${pos2.y}%, ${c2}33 0%, transparent 65%)`,
            willChange: 'background',
          }}
        />
      )}
      {/* Edge vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(8,8,12,0.8) 100%)',
          pointerEvents: 'none',
        }}
      />
      {grain > 0 && (
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: grain, pointerEvents: 'none' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="sg-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#sg-grain)" />
        </svg>
      )}
    </div>
  );
}

export type { SpotlightGradientProps, SpotlightGradientPreset } from './types';
