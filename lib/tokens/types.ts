/**
 * Canonical design token shape for dazineui.
 *
 * Used by lib/tokens/parser.ts (reads from DESIGN.md) and
 * lib/tokens/defaults.ts (fallback values).
 * Primitives accept a `DesignTokens` object or individual token groups.
 */

export interface ColorTokens {
  /** Page/canvas background. Should be near-black for dark-mode defaults. */
  background: string;
  /** Primary text color. */
  foreground: string;
  /** Primary brand/action color. */
  primary: string;
  /** Secondary highlight or interactive accent. */
  accent: string;
  /** De-emphasized text or border color. */
  muted: string;
  /**
   * Ordered list of gradient stop colors used by FlowGradient, AuroraGradient, etc.
   * Overrides preset when present.
   */
  gradient: string[];
}

export interface FontTokens {
  /** Display / hero / heading typeface. */
  display: string;
  /** Body copy typeface. */
  body: string;
  /** Code and mono typeface. */
  mono: string;
}

export interface SpacingTokens {
  /** Base unit in pixels (default 4). All spacing is a multiple of this. */
  base: number;
  /** Explicit scale steps as pixel values, e.g. [4, 8, 12, 16, 24, 32, 48, 64]. */
  scale: number[];
}

export interface RadiusTokens {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface MotionTimingTokens {
  /** Hero entrance / page transition duration (ms). */
  hero: number;
  /** Micro-interaction / hover feedback duration (ms). */
  micro: number;
}

export interface MotionEasingTokens {
  /** Default easing for most animations. */
  standard: string;
  /** Smooth deceleration for reveals. */
  smooth: string;
  /** Cinematic / high-end motion easing. */
  cinematic: string;
}

export interface MotionTokens {
  timing: MotionTimingTokens;
  easing: MotionEasingTokens;
}

/** Root composite token type. Passed to primitives and used by the parser. */
export interface DesignTokens {
  color: ColorTokens;
  font: FontTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  motion: MotionTokens;
}

/** Deep partial — allows partial overrides at any level from DESIGN.md parsing. */
export type PartialDesignTokens = {
  color?: Partial<ColorTokens> & { gradient?: string[] };
  font?: Partial<FontTokens>;
  spacing?: Partial<SpacingTokens>;
  radius?: Partial<RadiusTokens>;
  motion?: {
    timing?: Partial<MotionTimingTokens>;
    easing?: Partial<MotionEasingTokens>;
  };
};
