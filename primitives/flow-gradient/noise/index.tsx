'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../../lib/hooks/use-reduced-motion';
import type { NoiseGradientProps } from './types';
import { NOISE_GRADIENT_PRESETS } from './presets';

/**
 * NoiseGradient — Canvas 2D flow-field particle system.
 *
 * 2000 particles trace organic curves through a sin+cos vector field,
 * leaving colored trails. No blur, no filters — pure crisp generative lines.
 *
 * Technique: flow field angles computed from sin(x·zoom) + cos(y·zoom),
 * each particle follows the local angle and records a trail history.
 * Inspired by the "Basic Flow Field" approach by Frank's Laboratory.
 */
export function NoiseGradient({
  preset = 'void',
  colors,
  speed = 1,
  frequency = 0.012,
  className,
  style,
}: NoiseGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const rafRef = useRef<number>(0);

  const resolvedColors = colors ?? NOISE_GRADIENT_PRESETS[preset].colors;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flow field cell size — smaller = higher resolution vector field
    const CELL_SIZE = 5;
    const PARTICLE_COUNT = 2000;
    // Curve multiplier: higher = tighter spirals
    const CURVE = 5;

    // Shared mutable state (avoids closure staleness with ResizeObserver)
    let width = 0;
    let height = 0;
    let cols = 0;
    let flowField: Float32Array = new Float32Array(0);

    interface Particle {
      x: number;
      y: number;
      color: string;
      history: { x: number; y: number }[];
      maxLength: number;
      speedModifier: number;
      timer: number;
    }

    let particles: Particle[] = [];

    function buildFlowField() {
      const rows = Math.floor(height / CELL_SIZE);
      cols = Math.floor(width / CELL_SIZE);
      flowField = new Float32Array(rows * cols);
      const zoom = frequency;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          flowField[y * cols + x] = (Math.sin(x * zoom) + Math.cos(y * zoom)) * CURVE;
        }
      }
    }

    function resetParticle(p: Particle) {
      p.x = Math.random() * width;
      p.y = Math.random() * height;
      p.history = [{ x: p.x, y: p.y }];
      p.maxLength = Math.floor(Math.random() * 150 + 10);
      p.timer = p.maxLength * 2;
    }

    function init(w: number, h: number) {
      width = w;
      height = h;
      canvas!.width = w;
      canvas!.height = h;
      buildFlowField();
      particles = Array.from({ length: PARTICLE_COUNT }, () => {
        const p: Particle = {
          x: 0,
          y: 0,
          color: resolvedColors[Math.floor(Math.random() * resolvedColors.length)],
          history: [],
          maxLength: 0,
          speedModifier: Math.floor(Math.random() * 4 + 1),
          timer: 0,
        };
        resetParticle(p);
        return p;
      });
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

      if (!reduced) {
        const maxCols = cols;
        const maxRows = Math.floor(height / CELL_SIZE);

        for (const p of particles) {
          p.timer--;

          if (p.timer >= 1) {
            const cx = Math.floor(p.x / CELL_SIZE);
            const cy = Math.floor(p.y / CELL_SIZE);

            if (cx >= 0 && cx < maxCols && cy >= 0 && cy < maxRows) {
              const angle = flowField[cy * cols + cx];
              p.x += Math.cos(angle) * p.speedModifier * speed;
              p.y += Math.sin(angle) * p.speedModifier * speed;
              p.history.push({ x: p.x, y: p.y });
              if (p.history.length > p.maxLength) p.history.shift();
            } else {
              resetParticle(p);
            }
          } else if (p.history.length > 1) {
            p.history.shift();
          } else {
            resetParticle(p);
          }

          if (p.history.length > 1) {
            ctx!.beginPath();
            ctx!.moveTo(p.history[0].x, p.history[0].y);
            for (let i = 1; i < p.history.length; i++) {
              ctx!.lineTo(p.history[i].x, p.history[i].y);
            }
            ctx!.strokeStyle = p.color;
            ctx!.lineWidth = 1;
            ctx!.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [resolvedColors, speed, reduced, frequency]);

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

export type { NoiseGradientProps, NoiseGradientPreset } from './types';
