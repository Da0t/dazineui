import {
  FlowGradientScene,
  SpotlightGradientScene,
  MeshGradientScene,
  AuroraGradientScene,
  NoiseGradientScene,
  WaveGridScene,
} from '@/app/components/gradient-scenes';

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
          <h2 className="text-2xl font-semibold mb-2">Wave ribbons</h2>
          <p className="text-white/40 text-sm max-w-md">
            Five sine-wave ribbon lines in palette colors, rendered in a full-screen GLSL shader.
            Each ribbon has an independent frequency, amplitude, and phase — creating
            overlapping diagonal wave compositions.
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
          <h2 className="text-2xl font-semibold mb-2">Neon tubes</h2>
          <p className="text-white/40 text-sm max-w-md">
            Three animated TubeGeometry meshes snake along CatmullRom curves with
            emissive materials and physical Bloom postprocessing. The tubes undulate
            with independent sine-wave control point animation.
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
          <h2 className="text-2xl font-semibold mb-2">Fiber streams</h2>
          <p className="text-white/40 text-sm max-w-md">
            120 thin cubic bezier curves with slowly-drifting control points.
            Each fiber has independent alpha and line weight, creating perceptual
            depth. No blur — pure crisp strokes on a dark canvas.
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
          <h2 className="text-2xl font-semibold mb-2">Flow field</h2>
          <p className="text-white/40 text-sm max-w-md">
            2000 particles trace organic curves through a sin+cos vector field,
            leaving colored trails. Flow angles are precomputed into a grid — no
            blur, no filters. Pure generative line art.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['void', 'dusk', 'forest', 'cherry'] as const).map((preset) => (
            <div key={preset} className="flex flex-col gap-2">
              <div className="relative rounded-xl overflow-hidden aspect-video border border-white/8">
                <NoiseGradientScene preset={preset} style={{ height: '100%' }} />
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
          <h2 className="text-2xl font-semibold mb-2">Particle waves</h2>
          <p className="text-white/40 text-sm max-w-md">
            A 60×20 grid of crisp circular particles displaced by overlapping sine
            waves. Each horizontal band takes a palette color — the result is a
            living dot-matrix equalizer. Additive blending for neon layering.
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

      {/* ── WaveGrid ── */}
      <section className="px-6 py-24 max-w-5xl mx-auto border-t border-white/5">
        <div className="mb-10">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">06 / WaveGrid</p>
          <h2 className="text-2xl font-semibold mb-2">Particle grid wave</h2>
          <p className="text-white/40 text-sm max-w-md">
            Direct port of the Three.js <code className="text-white/30 font-mono text-xs">webgl_particles_waves</code> example.
            A 50×50 grid of particles in the XZ plane; wave height and point size
            both driven by compound sine per-frame. Camera lazily follows your mouse.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {(['white', 'ocean', 'neon', 'ember', 'plasma'] as const).map((preset) => (
            <div key={preset} className="flex flex-col gap-2">
              <div className="relative rounded-xl overflow-hidden aspect-video border border-white/8">
                <WaveGridScene preset={preset} followMouse={false} />
              </div>
              <span className="text-xs font-mono text-white/30">{preset}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 relative rounded-xl overflow-hidden border border-white/8" style={{ height: '400px' }}>
          <WaveGridScene preset="ocean" followMouse={true} />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/20 text-xs font-mono">
            move mouse to orbit
          </div>
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
