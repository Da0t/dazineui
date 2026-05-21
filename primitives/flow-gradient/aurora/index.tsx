'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import type { AuroraGradientProps } from './types';
import { AURORA_GRADIENT_PRESETS } from './presets';

interface Band {
  x: number;
  width: number;
  color: string;
  speed: number;
  phase: number;
  amplitude: number;
  opacity: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function AuroraGradient({
  preset = 'nordic',
  colors,
  speed = 1,
  className,
  style,
  grain = 0.015,
}: AuroraGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const rafRef = useRef<number>(0);
  const bandsRef = useRef<Band[]>([]);
  const timeRef = useRef<number>(0);

  const resolvedColors = colors ?? AURORA_GRADIENT_PRESETS[preset]?.colors ?? AURORA_GRADIENT_PRESETS.nordic.colors;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const observer = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initBands();
    });
    observer.observe(canvas);

    function initBands() {
      const w = canvas!.width;
      bandsRef.current = resolvedColors.map((color, i) => ({
        x: (i / resolvedColors.length) * w + Math.random() * (w / resolvedColors.length) * 0.5,
        width: w * (0.12 + Math.random() * 0.14),
        color,
        speed: (0.3 + Math.random() * 0.4) * (Math.random() > 0.5 ? 1 : -1),
        phase: (i / resolvedColors.length) * Math.PI * 2,
        amplitude: 0.04 + Math.random() * 0.08,
        opacity: 0.55 + Math.random() * 0.35,
      }));
    }

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    initBands();

    let lastTime = 0;

    function draw(ts: number) {
      const w = canvas!.width;
      const h = canvas!.height;
      const dt = Math.min((ts - lastTime) / 1000, 0.05);
      lastTime = ts;

      if (!reduced) {
        timeRef.current += dt * speed;
      }
      const t = timeRef.current;

      ctx!.clearRect(0, 0, w, h);
      ctx!.fillStyle = '#03080F';
      ctx!.fillRect(0, 0, w, h);

      const bands = bandsRef.current;
      for (const band of bands) {
        // Each band oscillates horizontally — phase-offset sine
        const xOffset = Math.sin(t * band.speed + band.phase) * w * band.amplitude;
        const cx = band.x + xOffset;

        const [r, g, b] = hexToRgb(band.color);

        // Draw a tall narrow gradient strip
        const grad = ctx!.createLinearGradient(cx - band.width, 0, cx + band.width, 0);
        grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        grad.addColorStop(0.3, `rgba(${r},${g},${b},${(band.opacity * 0.4).toFixed(3)})`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${band.opacity.toFixed(3)})`);
        grad.addColorStop(0.7, `rgba(${r},${g},${b},${(band.opacity * 0.4).toFixed(3)})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        // Vertical fade — brightest in upper third, fades at bottom
        const vertGrad = ctx!.createLinearGradient(0, 0, 0, h);
        vertGrad.addColorStop(0, 'rgba(0,0,0,0.1)');
        vertGrad.addColorStop(0.3, 'rgba(0,0,0,0)');
        vertGrad.addColorStop(0.75, 'rgba(0,0,0,0.5)');
        vertGrad.addColorStop(1, 'rgba(0,0,0,0.9)');

        ctx!.globalCompositeOperation = 'screen';
        ctx!.fillStyle = grad;
        ctx!.fillRect(0, 0, w, h);
      }

      // Vertical vignette pass
      ctx!.globalCompositeOperation = 'source-over';
      const vignette = ctx!.createLinearGradient(0, 0, 0, h);
      vignette.addColorStop(0, 'rgba(3,8,15,0.15)');
      vignette.addColorStop(0.4, 'rgba(3,8,15,0)');
      vignette.addColorStop(0.8, 'rgba(3,8,15,0.3)');
      vignette.addColorStop(1, 'rgba(3,8,15,0.85)');
      ctx!.fillStyle = vignette;
      ctx!.fillRect(0, 0, w, h);

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
      {grain > 0 && (
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: grain, pointerEvents: 'none' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="ag-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#ag-grain)" />
        </svg>
      )}
    </div>
  );
}

export type { AuroraGradientProps, AuroraGradientPreset } from './types';
