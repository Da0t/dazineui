export interface DesignTokens {
  colors: {
    primary: string;
    accent: string;
    background: string;
    foreground: string;
    // Gradient-specific: used by FlowGradient and HeroScene
    gradient?: string[];
  };
  fonts: {
    display: string;
    body: string;
    mono: string;
  };
  spacing: {
    base: number; // in px, typically 4
    scale: number[]; // e.g. [4, 8, 12, 16, 24, 32, 48, 64]
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  motion: {
    timing: {
      hero: number;       // ms, e.g. 800
      micro: number;      // ms, e.g. 250
      page: number;       // ms, e.g. 400
    };
    easing: {
      default: string;    // CSS cubic-bezier string
      cinematic: string;
      smooth: string;
    };
  };
}
