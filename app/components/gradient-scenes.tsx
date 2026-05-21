'use client';

import dynamic from 'next/dynamic';
import type {
  FlowGradientProps,
  SpotlightGradientProps,
  MeshGradientProps,
  AuroraGradientProps,
} from '@/primitives/flow-gradient';

// Canvas-based components need dynamic import with ssr:false
// because they reference window/canvas APIs during render.

const FlowGradientDynamic = dynamic(
  () => import('@/primitives/flow-gradient').then((m) => ({ default: m.FlowGradient })),
  { ssr: false, loading: () => <div style={{ width: '100%', height: '100%', background: '#08080C' }} /> },
);

const SpotlightGradientDynamic = dynamic(
  () => import('@/primitives/flow-gradient').then((m) => ({ default: m.SpotlightGradient })),
  { ssr: false, loading: () => <div style={{ width: '100%', height: '100%', background: '#08080C' }} /> },
);

const MeshGradientDynamic = dynamic(
  () => import('@/primitives/flow-gradient').then((m) => ({ default: m.MeshGradient })),
  { ssr: false, loading: () => <div style={{ width: '100%', height: '100%', background: '#08080C' }} /> },
);

const AuroraGradientDynamic = dynamic(
  () => import('@/primitives/flow-gradient').then((m) => ({ default: m.AuroraGradient })),
  { ssr: false, loading: () => <div style={{ width: '100%', height: '100%', background: '#03080F' }} /> },
);

export function FlowGradientScene(props: FlowGradientProps) {
  return <FlowGradientDynamic {...props} />;
}

export function SpotlightGradientScene(props: SpotlightGradientProps) {
  return <SpotlightGradientDynamic {...props} />;
}

export function MeshGradientScene(props: MeshGradientProps) {
  return <MeshGradientDynamic {...props} />;
}

export function AuroraGradientScene(props: AuroraGradientProps) {
  return <AuroraGradientDynamic {...props} />;
}
