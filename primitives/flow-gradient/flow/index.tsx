'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import type { FlowGradientProps } from './types';
import { FLOW_GRADIENT_PRESETS } from './presets';

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  r: number;
  color: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function FlowGradient({
  preset = 'stripe',
  colors,
  speed = 1,
  className,
  style,
  grain = 0.015,
}: FlowGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const rafRef = useRef<number>(0);
  const orbsRef = useRef<Orb[]>([]);

  const resolvedColors = colors ?? FLOW_GRADIENT_PRESETS[preset]?.colors ?? FLOW_GRADIENT_PRESETS.stripe.colors;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initOrbs();
    });
    resizeObserver.observe(canvas);

    function initOrbs() {
      const w = canvas!.width;
      const h = canvas!.height;
      orbsRef.current = resolvedColors.map((color) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
        targetX: Math.random() * w,
        targetY: Math.random() * h,
        r: Math.min(w, h) * (0.35 + Math.random() * 0.25),
        color,
      }));
    }

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    initOrbs();

    let lastTime = 0;

    function draw(ts: number) {
      const w = canvas!.width;
      const h = canvas!.height;
      const dt = Math.min((ts - lastTime) / 1000, 0.05);
      lastTime = ts;

      ctx!.clearRect(0, 0, w, h);
      ctx!.fillStyle = '#08080C';
      ctx!.fillRect(0, 0, w, h);

      const orbs = orbsRef.current;
      for (const orb of orbs) {
        if (!reduced) {
          const driftSpeed = 0.6 * speed;
          orb.vx += (orb.targetX - orb.x) * 0.003 * driftSpeed;
          orb.vy += (orb.targetY - orb.y) * 0.003 * driftSpeed;
          orb.vx *= 0.96;
          orb.vy *= 0.96;
          orb.x += orb.vx * dt * 60;
          orb.y += orb.vy * dt * 60;

          if (Math.abs(orb.x - orb.targetX) < 2 && Math.abs(orb.y - orb.targetY) < 2) {
            orb.targetX = Math.random() * w;
            orb.targetY = Math.random() * h;
          }
        }

        const [r, g, b] = hexToRgb(orb.color);
        const grad = ctx!.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        grad.addColorStop(0, `rgba(${r},${g},${b},0.72)`);
        grad.addColorStop(0.4, `rgba(${r},${g},${b},0.28)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx!.globalCompositeOperation = 'screen';
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.globalCompositeOperation = 'source-over';
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
    };
  }, [resolvedColors, speed, reduced]);

  return (
    <div
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }}
    >
      {/* The blur on the canvas is the core of the Stripe look — without it, just colored circles */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: '-20%',
          width: '140%',
          height: '140%',
          filter: 'blur(80px)',
        }}
      />
      {grain > 0 && (
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: grain, pointerEvents: 'none' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="fg-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#fg-grain)" />
        </svg>
      )}
    </div>
  );
}

export type { FlowGradientProps, FlowGradientPreset } from './types';
