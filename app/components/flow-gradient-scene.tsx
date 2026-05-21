'use client';

import dynamic from 'next/dynamic';
import type { FlowGradientProps } from '@/lib/motion/flow-gradient/types';

const FlowGradient = dynamic(
  () => import('@/lib/motion/flow-gradient').then((m) => ({ default: m.FlowGradient })),
  { ssr: false, loading: () => <div style={{ width: '100%', height: '100%', background: '#0a0a0a' }} /> }
);

export function FlowGradientScene(props: FlowGradientProps) {
  return <FlowGradient {...props} />;
}
