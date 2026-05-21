import type { DesignTokens } from './types';
import { defaultTokens } from './defaults';

// Parses a DESIGN.md file and extracts design tokens.
// Supports the freedesignmd / designmd.app markdown format.
// Falls back gracefully — any missing token uses the default.

function hexToRgbFloat(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return [r, g, b];
}

export function parseDesignMd(content: string): Partial<DesignTokens> {
  const tokens: Partial<DesignTokens> = {};

  // Extract hex colors via regex — look for patterns like `#xxxxxx` near token names
  const hexPattern = /#([0-9a-fA-F]{6})\b/g;
  const hexMatches = [...content.matchAll(hexPattern)].map(m => `#${m[1]}`);

  // Look for named color assignments
  const primaryMatch = content.match(/primary[^#\n]*#([0-9a-fA-F]{6})/i);
  const accentMatch = content.match(/accent[^#\n]*#([0-9a-fA-F]{6})/i);
  const bgMatch = content.match(/background[^#\n]*#([0-9a-fA-F]{6})/i);
  const fgMatch = content.match(/foreground[^#\n]*#([0-9a-fA-F]{6})/i);

  if (primaryMatch || accentMatch || bgMatch || fgMatch || hexMatches.length > 0) {
    tokens.colors = {
      primary: primaryMatch ? `#${primaryMatch[1]}` : defaultTokens.colors.primary,
      accent: accentMatch ? `#${accentMatch[1]}` : defaultTokens.colors.accent,
      background: bgMatch ? `#${bgMatch[1]}` : defaultTokens.colors.background,
      foreground: fgMatch ? `#${fgMatch[1]}` : defaultTokens.colors.foreground,
      gradient: hexMatches.length >= 3 ? hexMatches.slice(0, 3) : defaultTokens.colors.gradient,
    };
  }

  // Extract font families
  const displayFontMatch = content.match(/display[^:\n]*:\s*['"]?([^'"\n,]+)/i);
  const bodyFontMatch = content.match(/body[^:\n]*:\s*['"]?([^'"\n,]+)/i);
  if (displayFontMatch || bodyFontMatch) {
    tokens.fonts = {
      display: displayFontMatch ? displayFontMatch[1].trim() : defaultTokens.fonts.display,
      body: bodyFontMatch ? bodyFontMatch[1].trim() : defaultTokens.fonts.body,
      mono: defaultTokens.fonts.mono,
    };
  }

  // Extract motion timing (look for ms values near timing keywords)
  const heroTimingMatch = content.match(/hero[^0-9\n]*(\d+)ms/i);
  const microTimingMatch = content.match(/micro[^0-9\n]*(\d+)ms/i);
  if (heroTimingMatch || microTimingMatch) {
    tokens.motion = {
      timing: {
        hero: heroTimingMatch ? parseInt(heroTimingMatch[1]) : defaultTokens.motion.timing.hero,
        micro: microTimingMatch ? parseInt(microTimingMatch[1]) : defaultTokens.motion.timing.micro,
        page: defaultTokens.motion.timing.page,
      },
      easing: defaultTokens.motion.easing,
    };
  }

  return tokens;
}

export function mergeWithDefaults(partial: Partial<DesignTokens>): DesignTokens {
  return {
    colors: { ...defaultTokens.colors, ...partial.colors },
    fonts: { ...defaultTokens.fonts, ...partial.fonts },
    spacing: { ...defaultTokens.spacing, ...partial.spacing },
    radius: { ...defaultTokens.radius, ...partial.radius },
    motion: {
      timing: { ...defaultTokens.motion.timing, ...partial.motion?.timing },
      easing: { ...defaultTokens.motion.easing, ...partial.motion?.easing },
    },
  };
}

export { hexToRgbFloat };
