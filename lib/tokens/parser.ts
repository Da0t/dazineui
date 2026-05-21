/**
 * Server-side DESIGN.md token parser.
 *
 * Reads a DESIGN.md file from disk and extracts color, typography, and motion
 * tokens via regex patterns. Designed to be forgiving — freeform prose is fine.
 * Falls back to DEFAULT_TOKENS for any token it cannot find.
 *
 * Usage (Next.js server component / route handler / build script):
 *   import { parseDesignTokens } from '@/lib/tokens/parser';
 *   const tokens = parseDesignTokens('/path/to/project'); // project root
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { DEFAULT_TOKENS } from './defaults';
import type { DesignTokens, PartialDesignTokens } from './types';

const HEX_RE = /#([0-9A-Fa-f]{3,8})\b/g;

/** Extract the first hex color that follows a label in a line or nearby text. */
function extractHex(text: string, label: string): string | null {
  const lines = text.split('\n');
  for (const line of lines) {
    if (!line.toLowerCase().includes(label.toLowerCase())) continue;
    const match = line.match(/#[0-9A-Fa-f]{3,8}/);
    if (match) return match[0];
  }
  return null;
}

/** Extract all hex colors from a named section (looks within ~5 lines). */
function extractHexList(text: string, label: string, maxColors = 6): string[] {
  const lines = text.split('\n');
  const results: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].toLowerCase().includes(label.toLowerCase())) continue;
    // Scan up to 5 lines starting from the label line
    for (let j = i; j < Math.min(i + 6, lines.length); j++) {
      const matches = lines[j].match(HEX_RE);
      if (matches) {
        results.push(...matches);
      }
      if (results.length >= maxColors) break;
    }
    break;
  }

  return results.slice(0, maxColors);
}

/** Extract a font name from a line containing a label. */
function extractFont(text: string, label: string): string | null {
  const lines = text.split('\n');
  for (const line of lines) {
    if (!line.toLowerCase().includes(label.toLowerCase())) continue;
    // Remove the label part and extract a font name token
    const after = line.replace(new RegExp(label, 'i'), '').replace(/[:\-|#`]/g, '').trim();
    // Match a font name: word characters, spaces, quotes
    const match = after.match(/["']?([A-Za-z][\w\s-]{1,40})["']?/);
    if (match) return match[1].trim();
  }
  return null;
}

/** Extract a numeric value (ms) from a line containing a label. */
function extractMs(text: string, label: string): number | null {
  const lines = text.split('\n');
  for (const line of lines) {
    if (!line.toLowerCase().includes(label.toLowerCase())) continue;
    const match = line.match(/(\d{2,4})\s*ms/);
    if (match) return parseInt(match[1], 10);
  }
  return null;
}

/** Extract a cubic-bezier string from text. */
function extractEasing(text: string, label: string): string | null {
  const lines = text.split('\n');
  for (const line of lines) {
    if (!line.toLowerCase().includes(label.toLowerCase())) continue;
    const match = line.match(/cubic-bezier\([^)]+\)/);
    if (match) return match[0];
  }
  return null;
}

/**
 * Deep-merges partial tokens onto the defaults, producing a complete DesignTokens.
 */
function mergeWithDefaults(partial: PartialDesignTokens): DesignTokens {
  return {
    color: {
      ...DEFAULT_TOKENS.color,
      ...partial.color,
      gradient:
        partial.color?.gradient?.length
          ? partial.color.gradient
          : DEFAULT_TOKENS.color.gradient,
    },
    font: {
      ...DEFAULT_TOKENS.font,
      ...partial.font,
    },
    spacing: {
      ...DEFAULT_TOKENS.spacing,
      ...partial.spacing,
    },
    radius: {
      ...DEFAULT_TOKENS.radius,
      ...partial.radius,
    },
    motion: {
      timing: {
        ...DEFAULT_TOKENS.motion.timing,
        ...partial.motion?.timing,
      },
      easing: {
        ...DEFAULT_TOKENS.motion.easing,
        ...partial.motion?.easing,
      },
    },
  };
}

/**
 * Parse a DESIGN.md file in the given directory and return merged DesignTokens.
 *
 * @param projectRoot - Absolute path to the directory containing DESIGN.md.
 * @returns Fully resolved DesignTokens (defaults + parsed overrides).
 */
export function parseDesignTokens(projectRoot: string): DesignTokens {
  let text: string;

  try {
    text = readFileSync(join(projectRoot, 'DESIGN.md'), 'utf-8');
  } catch {
    // DESIGN.md not found — return defaults
    return { ...DEFAULT_TOKENS };
  }

  const partial: PartialDesignTokens = { color: {} };

  // Colors
  const bg = extractHex(text, 'background');
  if (bg) partial.color!.background = bg;

  const fg = extractHex(text, 'foreground') ?? extractHex(text, 'text color') ?? extractHex(text, 'text:');
  if (fg) partial.color!.foreground = fg;

  const primary = extractHex(text, 'primary');
  if (primary) partial.color!.primary = primary;

  const accent = extractHex(text, 'accent');
  if (accent) partial.color!.accent = accent;

  const muted = extractHex(text, 'muted') ?? extractHex(text, 'secondary');
  if (muted) partial.color!.muted = muted;

  const gradient = extractHexList(text, 'gradient');
  if (gradient.length >= 2) partial.color!.gradient = gradient;

  // Fonts
  const displayFont = extractFont(text, 'display font') ?? extractFont(text, 'heading font') ?? extractFont(text, 'font:');
  if (displayFont) partial.font = { ...partial.font, display: displayFont };

  const bodyFont = extractFont(text, 'body font');
  if (bodyFont) partial.font = { ...partial.font, body: bodyFont };

  const monoFont = extractFont(text, 'mono font') ?? extractFont(text, 'monospace');
  if (monoFont) partial.font = { ...partial.font, mono: monoFont };

  // Motion
  const heroTiming = extractMs(text, 'hero') ?? extractMs(text, 'transition');
  if (heroTiming) partial.motion = { ...partial.motion, timing: { ...partial.motion?.timing, hero: heroTiming } };

  const microTiming = extractMs(text, 'micro') ?? extractMs(text, 'hover');
  if (microTiming) partial.motion = { ...partial.motion, timing: { ...partial.motion?.timing, micro: microTiming } };

  const easing = extractEasing(text, 'easing') ?? extractEasing(text, 'cubic-bezier');
  if (easing) partial.motion = { ...partial.motion, easing: { ...partial.motion?.easing, standard: easing } };

  return mergeWithDefaults(partial);
}
