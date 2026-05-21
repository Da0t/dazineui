'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import type { MeshGradientProps } from './types';
import { MESH_GRADIENT_PRESETS } from './presets';

interface ControlPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: [number, number, number];
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function bilinearColor(
  c00: [number, number, number],
  c10: [number, number, number],
  c01: [number, number, number],
  c11: [number, number, number],
  tx: number,
  ty: number,
): [number, number, number] {
  return [
    Math.round(lerp(lerp(c00[0], c10[0], tx), lerp(c01[0], c11[0], tx), ty)),
    Math.round(lerp(lerp(c00[1], c10[1], tx), lerp(c01[1], c11[1], tx), ty)),
    Math.round(lerp(lerp(c00[2], c10[2], tx), lerp(c01[2], c11[2], tx), ty)),
  ];
}

// Render at a lower resolution and scale up for performance
const RENDER_SCALE = 0.08;

export function MeshGradient({
  preset = 'cosmos',
  colors,
  speed = 1,
  rows = 3,
  cols = 3,
  className,
  style,
  grain = 0.015,
}: MeshGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const rafRef = useRef<number>(0);
  const pointsRef = useRef<ControlPoint[]>([]);

  const resolvedColors = colors ?? MESH_GRADIENT_PRESETS[preset]?.colors ?? MESH_GRADIENT_PRESETS.cosmos.colors;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const observer = new ResizeObserver(() => {
      canvas.width = Math.max(1, Math.round(canvas.offsetWidth * RENDER_SCALE));
      canvas.height = Math.max(1, Math.round(canvas.offsetHeight * RENDER_SCALE));
      initPoints();
    });
    observer.observe(canvas);

    function initPoints() {
      const totalPoints = rows * cols;
      const palette = resolvedColors.slice(0, totalPoints);
      // cycle colors if not enough
      pointsRef.current = Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const idx = (row * cols + col) % palette.length;
          return {
            x: col / (cols - 1),
            y: row / (rows - 1),
            vx: 0,
            vy: 0,
            color: hexToRgb(palette[idx]),
          } as ControlPoint;
        }),
      ).flat();
    }

    canvas.width = Math.max(1, Math.round(canvas.offsetWidth * RENDER_SCALE));
    canvas.height = Math.max(1, Math.round(canvas.offsetHeight * RENDER_SCALE));
    initPoints();

    let lastTime = 0;

    function draw(ts: number) {
      const w = canvas!.width;
      const h = canvas!.height;
      const dt = Math.min((ts - lastTime) / 1000, 0.05);
      lastTime = ts;

      if (!reduced) {
        const driftAmp = 0.08 * speed;
        for (const pt of pointsRef.current) {
          pt.vx += (Math.random() - 0.5) * 0.002 * speed;
          pt.vy += (Math.random() - 0.5) * 0.002 * speed;
          pt.vx *= 0.94;
          pt.vy *= 0.94;
          pt.x = Math.max(0, Math.min(1, pt.x + pt.vx * dt * 60 * driftAmp));
          pt.y = Math.max(0, Math.min(1, pt.y + pt.vy * dt * 60 * driftAmp));
        }
      }

      const imageData = ctx!.createImageData(w, h);
      const data = imageData.data;

      for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
          const nx = px / (w - 1);
          const ny = py / (h - 1);

          // Find which cell this pixel is in
          const cellX = Math.min(cols - 2, Math.floor(nx * (cols - 1)));
          const cellY = Math.min(rows - 2, Math.floor(ny * (rows - 1)));
          const tx = (nx * (cols - 1)) - cellX;
          const ty = (ny * (rows - 1)) - cellY;

          const c00 = pointsRef.current[cellY * cols + cellX].color;
          const c10 = pointsRef.current[cellY * cols + (cellX + 1)].color;
          const c01 = pointsRef.current[(cellY + 1) * cols + cellX].color;
          const c11 = pointsRef.current[(cellY + 1) * cols + (cellX + 1)].color;

          const [r, g, b] = bilinearColor(c00, c10, c01, c11, tx, ty);
          const i = (py * w + px) * 4;
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = 255;
        }
      }

      ctx!.putImageData(imageData, 0, 0);
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [resolvedColors, speed, reduced, rows, cols]);

  return (
    <div
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          // pixelated scaling preserves the smooth mesh look when upscaled from low-res buffer
          imageRendering: 'auto',
          filter: 'blur(4px)',
        }}
      />
      {grain > 0 && (
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: grain, pointerEvents: 'none' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="mg-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#mg-grain)" />
        </svg>
      )}
    </div>
  );
}

export type { MeshGradientProps, MeshGradientPreset } from './types';
