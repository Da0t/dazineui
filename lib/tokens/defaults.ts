import type { DesignTokens } from './types';

/**
 * Default design tokens for dazineui primitives.
 *
 * These values reflect the aesthetic defaults documented in CLAUDE.md §3
 * and BRIEF §9. Used as fallbacks when DESIGN.md is absent or when a
 * specific token is not specified.
 */
export const DEFAULT_TOKENS: DesignTokens = {
  color: {
    background: '#0a0a0a',
    foreground: '#f5f5f5',
    primary: '#6366f1',
    accent: '#6366f1',
    muted: '#3f3f46',
    gradient: ['#7C3AED', '#2563EB', '#0D9488', '#DB2777', '#D97706'],
  },

  font: {
    display: 'var(--font-geist-sans), Geist, Inter, system-ui, sans-serif',
    body: 'var(--font-geist-sans), Geist, Inter, system-ui, sans-serif',
    mono: 'var(--font-geist-mono), GeistMono, "Geist Mono", ui-monospace, monospace',
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
      hero: 750,
      micro: 250,
    },
    easing: {
      standard: 'cubic-bezier(0.32, 0.72, 0, 1)',
      smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      cinematic: 'cubic-bezier(0.76, 0, 0.24, 1)',
    },
  },
};
