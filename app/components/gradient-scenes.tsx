'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type {
  FlowGradientProps,
  SpotlightGradientProps,
  MeshGradientProps,
  AuroraGradientProps,
  NoiseGradientProps,
  WaveGridProps,
} from '@/primitives/flow-gradient';

/**
 * LazyScene — IntersectionObserver-gated mount.
 *
 * WebGL canvases are only created when the container enters the viewport,
 * preventing Chrome's ~16 active WebGL context limit from being hit when
 * multiple R3F scenes coexist on a single long page. The container keeps
 * its dimensions so layout doesn't shift when the scene mounts.
 */
function LazyScene({ children, placeholder = '#06060a' }: {
  children: React.ReactNode;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();  // mount once — never unmount to avoid flicker
        }
      },
      { rootMargin: '120px' },  // preload 120px before it enters view
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ position: 'absolute', inset: 0, background: visible ? undefined : placeholder }}
    >
      {visible && children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dynamic imports — all primitives use 'use client' + Canvas APIs
// ─────────────────────────────────────────────────────────────────────────────

function loadingPlaceholder(bg = '#06060a') {
  function Placeholder() {
    return <div style={{ width: '100%', height: '100%', background: bg }} />;
  }
  return Placeholder;
}

const FlowGradientDynamic = dynamic(
  () => import('@/primitives/flow-gradient').then((m) => ({ default: m.FlowGradient })),
  { ssr: false, loading: loadingPlaceholder() },
);

const SpotlightGradientDynamic = dynamic(
  () => import('@/primitives/flow-gradient').then((m) => ({ default: m.SpotlightGradient })),
  { ssr: false, loading: loadingPlaceholder() },
);

const MeshGradientDynamic = dynamic(
  () => import('@/primitives/flow-gradient').then((m) => ({ default: m.MeshGradient })),
  { ssr: false, loading: loadingPlaceholder() },
);

const AuroraGradientDynamic = dynamic(
  () => import('@/primitives/flow-gradient').then((m) => ({ default: m.AuroraGradient })),
  { ssr: false, loading: loadingPlaceholder() },
);

const NoiseGradientDynamic = dynamic(
  () => import('@/primitives/flow-gradient').then((m) => ({ default: m.NoiseGradient })),
  { ssr: false, loading: loadingPlaceholder() },
);

const WaveGridDynamic = dynamic(
  () => import('@/primitives/flow-gradient').then((m) => ({ default: m.WaveGrid })),
  { ssr: false, loading: loadingPlaceholder('#000000') },
);

// ─────────────────────────────────────────────────────────────────────────────
// Scene wrappers — lazy-mount each R3F / canvas scene
// ─────────────────────────────────────────────────────────────────────────────

export function FlowGradientScene(props: FlowGradientProps) {
  return (
    <LazyScene>
      <FlowGradientDynamic {...props} />
    </LazyScene>
  );
}

export function SpotlightGradientScene(props: SpotlightGradientProps) {
  return (
    <LazyScene>
      <SpotlightGradientDynamic {...props} />
    </LazyScene>
  );
}

export function MeshGradientScene(props: MeshGradientProps) {
  return (
    <LazyScene>
      <MeshGradientDynamic {...props} />
    </LazyScene>
  );
}

export function AuroraGradientScene(props: AuroraGradientProps) {
  return (
    <LazyScene>
      <AuroraGradientDynamic {...props} />
    </LazyScene>
  );
}

export function NoiseGradientScene(props: NoiseGradientProps) {
  return (
    <LazyScene>
      <NoiseGradientDynamic {...props} />
    </LazyScene>
  );
}

export function WaveGridScene(props: WaveGridProps) {
  return (
    <LazyScene placeholder="#000000">
      <WaveGridDynamic {...props} />
    </LazyScene>
  );
}
