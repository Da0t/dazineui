import type { DesignTokens } from './types';

export const defaultTokens: DesignTokens = {
  colors: {
    primary: '#a78bfa',
    accent: '#818cf8',
    background: '#0a0a0a',
    foreground: '#fafafa',
    gradient: ['#7c3aed', '#4f46e5', '#0ea5e9'],
  },
  fonts: {
    display: 'Geist Sans, Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    mono: 'Geist Mono, JetBrains Mono, monospace',
  },
  spacing: {
    base: 4,
    scale: [4, 8, 12, 16, 24, 32, 48, 64, 96, 128],
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  motion: {
    timing: {
      hero: 800,
      micro: 250,
      page: 400,
    },
    easing: {
      default: 'cubic-bezier(0.32, 0.72, 0, 1)',
      cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};
