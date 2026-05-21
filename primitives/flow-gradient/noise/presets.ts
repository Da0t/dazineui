import type { NoiseGradientPreset } from './types';

interface PresetConfig {
  colors: [string, string, string];
}

export const NOISE_GRADIENT_PRESETS: Record<NoiseGradientPreset, PresetConfig> = {
  void: {
    colors: ['#0F0720', '#1A0A3C', '#060D1F'],
  },
  dusk: {
    colors: ['#1A0533', '#2D1052', '#0D1B3E'],
  },
  forest: {
    colors: ['#041A0D', '#0A2E16', '#062010'],
  },
  cherry: {
    colors: ['#1A0010', '#2D0020', '#0F000A'],
  },
};
