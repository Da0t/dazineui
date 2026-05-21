import type { AuroraGradientPreset } from './types';

interface PresetConfig {
  colors: string[];
}

export const AURORA_GRADIENT_PRESETS: Record<AuroraGradientPreset, PresetConfig> = {
  nordic: {
    // Cyan + purple — matches the neon particle wave reference image exactly
    colors: ['#06B6D4', '#7C3AED'],
  },
  plasma: {
    // Bright magenta + electric blue
    colors: ['#E879F9', '#3B82F6'],
  },
  void: {
    // Dark teal + dark indigo — subtle, near-monochrome
    colors: ['#0891B2', '#3730A3'],
  },
  twilight: {
    // Rose + amber — warm neon sunset
    colors: ['#F43F5E', '#D97706'],
  },
};
