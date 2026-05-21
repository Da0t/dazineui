import type { MeshGradientPreset } from './types';

interface PresetConfig {
  colors: string[];
}

export const MESH_GRADIENT_PRESETS: Record<MeshGradientPreset, PresetConfig> = {
  cosmos: {
    // Dark purple-to-indigo-to-teal sweep
    colors: ['#1E0A3C', '#2D1B69', '#0F172A', '#3B0764', '#1E3A5F', '#0D2137', '#4C1D95', '#1D4ED8', '#0D9488'],
  },
  dawn: {
    // Warm sand, peach, rose — light mode feel
    colors: ['#FEF3C7', '#FDE68A', '#FCA5A5', '#FECACA', '#FDE8D8', '#FBCFE8', '#F9A8D4', '#FED7AA', '#FEF9C3'],
  },
  forest: {
    // Deep greens and teals
    colors: ['#052E16', '#064E3B', '#0A2E1A', '#134E4A', '#0F3460', '#065F46', '#1A3A4A', '#0D4429', '#0C4A6E'],
  },
  candy: {
    // Bright saturated — pink/purple/blue
    colors: ['#BE185D', '#7C3AED', '#1D4ED8', '#DB2777', '#9333EA', '#2563EB', '#EC4899', '#A855F7', '#3B82F6'],
  },
};
