import type { WaveGridPreset } from './types';

interface PresetConfig {
  color: string;
}

export const WAVE_GRID_PRESETS: Record<WaveGridPreset, PresetConfig> = {
  white:  { color: '#ffffff' },   // original Three.js example — pure white
  ocean:  { color: '#06B6D4' },   // cyan-teal
  neon:   { color: '#A855F7' },   // electric purple
  ember:  { color: '#F97316' },   // orange
  plasma: { color: '#EC4899' },   // hot pink
};
