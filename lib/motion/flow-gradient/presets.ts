import type { FlowGradientPreset } from './types';

interface PresetConfig {
  colors: string[];
  speed: number;
  intensity: number;
  description: string;
}

export const FLOW_GRADIENT_PRESETS: Record<FlowGradientPreset, PresetConfig> = {
  aurora: {
    colors: ['#0ea5e9', '#7c3aed', '#10b981', '#4f46e5'],
    speed: 0.25,
    intensity: 0.65,
    description: 'Cool blues, purples, and greens. Slow, meditative flow.',
  },
  sunset: {
    colors: ['#f97316', '#ec4899', '#a855f7', '#ef4444'],
    speed: 0.3,
    intensity: 0.7,
    description: 'Warm oranges, pinks, and magentas. Rich and energetic.',
  },
  electric: {
    colors: ['#22d3ee', '#a78bfa', '#f0abfc', '#38bdf8'],
    speed: 0.55,
    intensity: 0.85,
    description: 'High-contrast neons. Fast and vivid. Use sparingly.',
  },
  monochrome: {
    colors: ['#374151', '#6b7280', '#1f2937', '#4b5563'],
    speed: 0.2,
    intensity: 0.5,
    description: 'Single-hue tonal variation. Subtle, elegant, works on any palette.',
  },
};
