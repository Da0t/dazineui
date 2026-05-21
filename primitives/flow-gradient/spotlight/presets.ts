import type { SpotlightGradientPreset } from './types';

interface PresetConfig {
  color: string;
  secondColor: string;
}

export const SPOTLIGHT_GRADIENT_PRESETS: Record<SpotlightGradientPreset, PresetConfig> = {
  cool: {
    color: '#6366F1',
    secondColor: '#0891B2',
  },
  warm: {
    color: '#F59E0B',
    secondColor: '#EA580C',
  },
  electric: {
    color: '#A855F7',
    secondColor: '#3B82F6',
  },
  rose: {
    color: '#EC4899',
    secondColor: '#F43F5E',
  },
};
