import type { FlowGradientPreset } from './types';

interface PresetConfig {
  colors: string[];
}

export const FLOW_GRADIENT_PRESETS: Record<FlowGradientPreset, PresetConfig> = {
  stripe: {
    colors: ['#7C3AED', '#2563EB', '#0D9488', '#DB2777', '#D97706'],
  },
  sunset: {
    colors: ['#EA580C', '#DB2777', '#D97706', '#DC2626', '#9333EA'],
  },
  ocean: {
    colors: ['#0369A1', '#0891B2', '#0D9488', '#1D4ED8', '#6366F1'],
  },
  ember: {
    colors: ['#DC2626', '#EA580C', '#D97706', '#B91C1C', '#F59E0B'],
  },
  mint: {
    colors: ['#059669', '#0D9488', '#0891B2', '#16A34A', '#2563EB'],
  },
};
