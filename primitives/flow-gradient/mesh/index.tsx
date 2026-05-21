'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import type { MeshGradientProps } from './types';
import { MESH_GRADIENT_PRESETS } from './presets';

/**
 * MeshGradient — Canvas 2D color fiber streams.
 *
 * 120 thin cubic bezier curves sweep across the canvas in palette colors.
 * Each fiber has two slowly-drifting control points, creating an organic
 * weaving motion. No blur — crisp, hair-thin strokes with alpha variation
 * for perceptual depth.
 *
 * Technique: each fiber is a single bezierCurveTo call. Control point
 * velocities are tiny and reverse when hitting canvas bounds, ensuring
 * the animation stays fluid indefinitely without resetting.
 */
export function MeshGradient({
  preset = 'cosmos',
  colors,
  speed = 1,
  className,
  style,
}: MeshGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const rafRef = useRef<number>(0);

  const resolvedColors = colors ?? MESH_GRADIENT_PRESETS[preset]?.colors ?? MESH_GRADIENT_PRESETS.cosmos.colors;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const FIBER_COUNT = 120;

    interface Fiber {
      // Start / end in normalized [0,1] coords — outside edges so lines bleed off canvas
      x0: number; y0: number;
      x1: number; y1: number;
      // Bezier control points (normalized)
      cx0: number; cy0: number;
      cx1: number; cy1: number;
      // Control point drift velocities (tiny per-frame deltas)
      vcx0: number; vcy0: number;
      vcx1: number; vcy1: number;
      color: string;
      alpha: number;
      lineWidth: number;
    }

    let fibers: Fiber[] = [];
    let width = 0;
    let height = 0;

    function initFibers() {
      fibers = Array.from({ length: FIBER_COUNT }, (_, i) => {
        const color = resolvedColors[i % resolvedColors.length];

        // Alternate orientation: most fibers go left→right, some top→bottom
        const vertical = i % 5 === 0;
        const margin = 0.15;

        let x0, y0, x1, y1;
        if (vertical) {
          x0 = -margin + Math.random() * (1 + margin * 2);
          y0 = -margin;
          x1 = -margin + Math.random() * (1 + margin * 2);
          y1 = 1 + margin;
        } else {
          x0 = -margin;
          y0 = Math.random();
          x1 = 1 + margin;
          y1 = Math.random();
        }

        // Control points scattered in the interior
        const cx0 = 0.1 + Math.random() * 0.8;
        const cy0 = 0.1 + Math.random() * 0.8;
        const cx1 = 0.1 + Math.random() * 0.8;
        const cy1 = 0.1 + Math.random() * 0.8;

        // Very slow drift — a complete oscillation takes ~30–90 seconds
        const drift = 0.00015 * speed;
        return {
          x0, y0, x1, y1,
          cx0, cy0, cx1, cy1,
          vcx0: (Math.random() - 0.5) * drift,
          vcy0: (Math.random() - 0.5) * drift,
          vcx1: (Math.random() - 0.5) * drift,
          vcy1: (Math.random() - 0.5) * drift,
          color,
          alpha: 0.08 + Math.random() * 0.55,
          lineWidth: 0.3 + Math.random() * 1.4,
        } as Fiber;
      });
    }

    function init(w: number, h: number) {
      width = w;
      height = h;
      canvas!.width = w;
      canvas!.height = h;
      initFibers();
    }

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      init(Math.round(rect.width) || 1, Math.round(rect.height) || 1);
    });
    observer.observe(canvas);
    init(canvas.offsetWidth || 800, canvas.offsetHeight || 600);

    function draw() {
      ctx!.fillStyle = '#06060a';
      ctx!.fillRect(0, 0, width, height);

      for (const f of fibers) {
        if (!reduced) {
          // Drift control points
          f.cx0 += f.vcx0;
          f.cy0 += f.vcy0;
          f.cx1 += f.vcx1;
          f.cy1 += f.vcy1;

          // Reflect at bounds to keep in [0,1] range
          if (f.cx0 <= 0 || f.cx0 >= 1) f.vcx0 *= -1;
          if (f.cy0 <= 0 || f.cy0 >= 1) f.vcy0 *= -1;
          if (f.cx1 <= 0 || f.cx1 >= 1) f.vcx1 *= -1;
          if (f.cy1 <= 0 || f.cy1 >= 1) f.vcy1 *= -1;
        }

        ctx!.globalAlpha = f.alpha;
        ctx!.strokeStyle = f.color;
        ctx!.lineWidth = f.lineWidth;
        ctx!.beginPath();
        ctx!.moveTo(f.x0 * width, f.y0 * height);
        ctx!.bezierCurveTo(
          f.cx0 * width, f.cy0 * height,
          f.cx1 * width, f.cy1 * height,
          f.x1 * width, f.y1 * height,
        );
        ctx!.stroke();
      }

      ctx!.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [resolvedColors, speed, reduced]);

  return (
    <div
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
    </div>
  );
}

export type { MeshGradientProps, MeshGradientPreset } from './types';
