import { FlowGradientScene } from '@/app/components/flow-gradient-scene';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <FlowGradientScene preset="aurora" className="absolute inset-0" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <p className="text-sm font-mono text-white/50 tracking-widest uppercase mb-6">
            dazineui
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
            Motion primitives
            <br />
            <span className="text-white/60">for AI-built UI</span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
            Install once. Every AI session in every project instantly produces
            premium motion and 3D — not animation slop.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <code className="px-4 py-2 bg-white/10 rounded-lg text-sm font-mono border border-white/10">
              npx dazineui setup
            </code>
          </div>
        </div>
      </section>

      {/* Preset showcase */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">FlowGradient presets</h2>
        <p className="text-white/40 mb-12 text-sm">
          Shader-driven gradient mesh. Fills any container.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(
            [
              { preset: 'aurora', label: 'aurora' },
              { preset: 'sunset', label: 'sunset' },
              { preset: 'electric', label: 'electric' },
              { preset: 'monochrome', label: 'monochrome' },
            ] as const
          ).map(({ preset, label }) => (
            <div key={preset} className="flex flex-col gap-2">
              <div className="relative rounded-xl overflow-hidden aspect-video border border-white/10">
                <FlowGradientScene preset={preset} />
              </div>
              <span className="text-xs font-mono text-white/40">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Install CTA */}
      <section className="border-t border-white/10 px-6 py-24 text-center">
        <p className="text-white/30 text-sm font-mono mb-3">get started</p>
        <pre className="text-sm font-mono text-white/70 inline-block bg-white/5 px-6 py-4 rounded-xl border border-white/10">
          npx dazineui setup
        </pre>
        <p className="text-white/30 text-xs mt-6">
          MIT · Works with Claude Code, Cursor, Windsurf, and any agent that reads global skill directories.
        </p>
      </section>
    </main>
  );
}
