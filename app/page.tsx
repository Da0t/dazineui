import {
  FlowGradientScene,
  SpotlightGradientScene,
  MeshGradientScene,
  AuroraGradientScene,
} from '@/app/components/gradient-scenes';
import { NoiseGradient } from '@/primitives/flow-gradient';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08080C] text-white">

      {/* ── Hero ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <FlowGradientScene preset="stripe" className="absolute inset-0" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <p className="text-sm font-mono text-white/40 tracking-widest uppercase mb-6">
            dazineui
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
            Motion primitives
            <br />
            <span className="text-white/55">for AI-built UI</span>
          </h1>
          <p className="text-lg text-white/45 max-w-xl mx-auto leading-relaxed">
            Install once. Every AI session in every project instantly produces
            premium motion — not animation slop.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <code className="px-4 py-2 bg-white/8 rounded-lg text-sm font-mono border border-white/10 text-white/70">
              npx dazineui setup
            </code>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 text-xs font-mono tracking-wider">
          scroll to explore
        </div>
      </section>

      {/* ── FlowGradient ── */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">01 / FlowGradient</p>
          <h2 className="text-2xl font-semibold mb-2">Stripe-style orbs</h2>
          <p className="text-white/40 text-sm max-w-md">
            Colored orbs on Canvas 2D composited with{' '}
            <code className="text-white/55 font-mono text-xs">filter: blur(80px)</code>.
            The blur turns circles into pools of light.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(['stripe', 'sunset', 'ocean', 'ember', 'mint'] as const).map((preset) => (
            <div key={preset} className="flex flex-col gap-2">
              <div className="relative rounded-xl overflow-hidden aspect-video border border-white/8">
                <FlowGradientScene preset={preset} />
              </div>
              <span className="text-xs font-mono text-white/30">{preset}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SpotlightGradient ── */}
      <section className="px-6 py-24 max-w-5xl mx-auto border-t border-white/5">
        <div className="mb-10">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">02 / SpotlightGradient</p>
          <h2 className="text-2xl font-semibold mb-2">Directional light</h2>
          <p className="text-white/40 text-sm max-w-md">
            One or two focused radial light sources slowly orbiting. Linear.app
            energy. Supports{' '}
            <code className="text-white/55 font-mono text-xs">followMouse</code> for interactive heroes.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['cool', 'warm', 'electric', 'rose'] as const).map((preset) => (
            <div key={preset} className="flex flex-col gap-2">
              <div className="relative rounded-xl overflow-hidden aspect-video border border-white/8">
                <SpotlightGradientScene preset={preset} />
              </div>
              <span className="text-xs font-mono text-white/30">{preset}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── MeshGradient ── */}
      <section className="px-6 py-24 max-w-5xl mx-auto border-t border-white/5">
        <div className="mb-10">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">03 / MeshGradient</p>
          <h2 className="text-2xl font-semibold mb-2">Mesh gradient</h2>
          <p className="text-white/40 text-sm max-w-md">
            Bilinear interpolation across a grid of color control points.
            macOS Sonoma wallpaper or Figma mesh gradient aesthetic.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['cosmos', 'dawn', 'forest', 'candy'] as const).map((preset) => (
            <div key={preset} className="flex flex-col gap-2">
              <div className="relative rounded-xl overflow-hidden aspect-video border border-white/8">
                <MeshGradientScene preset={preset} />
              </div>
              <span className="text-xs font-mono text-white/30">{preset}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── NoiseGradient ── */}
      <section className="px-6 py-24 max-w-5xl mx-auto border-t border-white/5">
        <div className="mb-10">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">04 / NoiseGradient</p>
          <h2 className="text-2xl font-semibold mb-2">SVG noise</h2>
          <p className="text-white/40 text-sm max-w-md">
            Pure SVG{' '}
            <code className="text-white/55 font-mono text-xs">&lt;feTurbulence&gt;</code>{' '}
            filter. Zero JS. GPU-accelerated. Organic and painterly.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['void', 'dusk', 'forest', 'cherry'] as const).map((preset) => (
            <div key={preset} className="flex flex-col gap-2">
              <div className="relative rounded-xl overflow-hidden aspect-video border border-white/8">
                <NoiseGradient preset={preset} style={{ height: '100%' }} />
              </div>
              <span className="text-xs font-mono text-white/30">{preset}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── AuroraGradient ── */}
      <section className="px-6 py-24 max-w-5xl mx-auto border-t border-white/5">
        <div className="mb-10">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">05 / AuroraGradient</p>
          <h2 className="text-2xl font-semibold mb-2">Aurora</h2>
          <p className="text-white/40 text-sm max-w-md">
            Vertical light bands shimmering horizontally with offset sine waves.
            Each band has an independent phase — northern lights aesthetic.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['nordic', 'plasma', 'void', 'twilight'] as const).map((preset) => (
            <div key={preset} className="flex flex-col gap-2">
              <div className="relative rounded-xl overflow-hidden aspect-video border border-white/8">
                <AuroraGradientScene preset={preset} />
              </div>
              <span className="text-xs font-mono text-white/30">{preset}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="border-t border-white/8 px-6 py-24 text-center">
        <p className="text-white/25 text-xs font-mono mb-3 uppercase tracking-widest">get started</p>
        <pre className="text-sm font-mono text-white/60 inline-block bg-white/5 px-6 py-4 rounded-xl border border-white/8">
          npx dazineui setup
        </pre>
        <p className="text-white/25 text-xs mt-6 max-w-sm mx-auto">
          MIT · Works with Claude Code, Cursor, Windsurf, and any agent that reads global skill directories.
        </p>
      </section>

    </main>
  );
}
