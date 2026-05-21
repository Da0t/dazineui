import { defineConfig } from 'tsup';
import { resolve } from 'path';

export default defineConfig({
  entry: {
    index: 'primitives/flow-gradient/index.tsx',
  },
  format: ['cjs', 'esm'],
  dts: false,  // Types generated separately via tsc --project tsconfig.build.json
  splitting: false,
  sourcemap: true,
  clean: true,
  // Consumers supply these — don't bundle them
  external: [
    'react',
    'react-dom',
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/postprocessing',
  ],
  esbuildOptions(options) {
    // Resolve the remaining @/ aliases used during development
    options.alias = {
      '@': resolve(__dirname, '.'),
    };
  },
  // tsup strips 'use client' by default — re-inject it for RSC compatibility
  banner: {
    js: '"use client";',
  },
});
