import type { NoiseGradientPreset } from './types';

interface PresetConfig {
  colors: string[];
}

export const NOISE_GRADIENT_PRESETS: Record<NoiseGradientPreset, PresetConfig> = {
  void: {
    // Purple / violet / white — generative art classic
    colors: ['#4c026b', '#730d9e', '#9622c7', '#b44ae0', '#cd72f2', '#ffffff'],
  },
  dusk: {
    // Blue / teal / indigo — digital ocean
    colors: ['#0891b2', '#0d9488', '#6366f1', '#8b5cf6', '#a78bfa', '#38bdf8'],
  },
  forest: {
    // Green / emerald / teal — living system
    colors: ['#065f46', '#059669', '#10b981', '#34d399', '#0d9488', '#6ee7b7'],
  },
  cherry: {
    // Pink / rose / white — blossom
    colors: ['#be185d', '#db2777', '#ec4899', '#f9a8d4', '#fda4af', '#ffffff'],
  },
};
