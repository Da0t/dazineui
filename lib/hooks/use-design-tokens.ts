'use client';

import { useMemo } from 'react';
import { defaultTokens } from '../tokens/defaults';
import type { DesignTokens } from '../tokens/types';

// In a browser context, DESIGN.md is not directly readable.
// Tokens are injected at build time via next.config or passed as props.
// This hook provides the resolved tokens with a fallback to defaults.

let _injectedTokens: Partial<DesignTokens> | null = null;

export function injectTokens(tokens: Partial<DesignTokens>) {
  _injectedTokens = tokens;
}

export function useDesignTokens(): DesignTokens {
  return useMemo(() => {
    if (!_injectedTokens) return defaultTokens;
    return {
      colors: { ...defaultTokens.colors, ..._injectedTokens.colors },
      fonts: { ...defaultTokens.fonts, ..._injectedTokens.fonts },
      spacing: { ...defaultTokens.spacing, ..._injectedTokens.spacing },
      radius: { ...defaultTokens.radius, ..._injectedTokens.radius },
      motion: {
        timing: { ...defaultTokens.motion.timing, ..._injectedTokens.motion?.timing },
        easing: { ...defaultTokens.motion.easing, ..._injectedTokens.motion?.easing },
      },
    };
  }, []);
}
