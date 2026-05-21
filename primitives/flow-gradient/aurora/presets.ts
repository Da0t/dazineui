import type { AuroraGradientPreset } from './types';

interface PresetConfig {
  colors: string[];
}

export const AURORA_GRADIENT_PRESETS: Record<AuroraGradientPreset, PresetConfig> = {
  nordic: {
    // Classic northern lights — teal, cyan, jade, pale green
    colors: ['#0D9488', '#0891B2', '#10B981', '#06B6D4', '#34D399', '#22D3EE'],
  },
  plasma: {
    // Warmer — purple, magenta, blue
    colors: ['#7C3AED', '#A855F7', '#6366F1', '#8B5CF6', '#4F46E5', '#9333EA'],
  },
  void: {
    // Near-monochrome dark — barely visible, very subtle
    colors: ['#1E3A5F', '#1A3A4A', '#0F2A3F', '#162C45', '#0D2137'],
  },
  twilight: {
    // Sunset-into-night — rose, amber, purple
    colors: ['#BE185D', '#9333EA', '#D97706', '#7C3AED', '#DB2777'],
  },
};
