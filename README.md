# dazineui

[![npm](https://img.shields.io/npm/v/dazineui)](https://www.npmjs.com/package/dazineui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Motion primitives for AI-built UI.** Install once — every AI session in your project produces senior-level Three.js designs instead of generic animation slop.

```bash
npm install dazineui
```

That's it. On install, dazineui automatically drops `.cursor/rules/dazineui-motion.mdc` into your project. Cursor and Claude Code read this file and immediately know:

- Which primitives exist and when to use them
- How to route vague requests ("make it pop", "add a cool background") to the right component
- The aesthetic rules that separate premium motion from filler animation

---

## What you get

### Importable primitives

```tsx
import { FlowGradient } from 'dazineui'
import { AuroraGradient } from 'dazineui'
import { WaveGrid } from 'dazineui'
// ... all six primitives
```

### AI that knows your design system

The installed `.cursor/rules/dazineui-motion.mdc` contains:
- A routing table: vague prompt → correct primitive
- Anti-pattern rules: what the AI must never produce (blur-fakes, flat spheres, CSS keyframes as 3D substitutes)
- Aesthetic defaults: timing, easing, spacing, typography
- A full decision flow the AI runs before writing any visual code

---

## Primitives

| Primitive | Visual | When to use |
|---|---|---|
| `FlowGradient` | 5 sine-wave ribbon meshes, tilted 35°, additive blending | Hero backgrounds — "Stripe-style", "wave ribbons", "feel premium" |
| `SpotlightGradient` | Neon TubeGeometry snaking along CatmullRom curves + Bloom | "Neon tubes", "glowing lines", "Linear-style" |
| `MeshGradient` | 120 thin bezier fiber curves, drifting control points | "Fine lines", "thread texture", "fiber", "woven" |
| `NoiseGradient` | 2000 particles tracing a sin+cos flow field | "Flow field", "generative art", "organic particle streams" |
| `AuroraGradient` | Two dense particle sheets crossing in 3D, compound sine waves | "Dot matrix", "aurora borealis", "wave particles", "AI aesthetic" |
| `WaveGrid` | 50×50 particle grid in perspective, crests scale point size, mouse follows camera | "Particle grid", "wave surface", classic Three.js waves |

All six are:
- Dark-first (black backgrounds, additive blending)
- `'use client'` React components
- No `filter: blur` — glow from emissive materials + Bloom only
- `prefers-reduced-motion` aware
- TypeScript with full prop types

---

## Installation

### Per-project (recommended)

```bash
npm install dazineui
```

Postinstall automatically writes `.cursor/rules/dazineui-motion.mdc`. Your AI will use it on the next conversation.

### Global (all projects on your machine)

```bash
npx dazineui setup
```

Installs to `~/.claude/skills/dazineui/` and `~/.cursor/skills/dazineui/`. Works in every project you open, without a per-project `npm install`.

---

## Usage

### Next.js (App Router)

All primitives use WebGL/Canvas — wrap in `dynamic` with `ssr: false`:

```tsx
import dynamic from 'next/dynamic'

const FlowGradient = dynamic(
  () => import('dazineui').then(m => ({ default: m.FlowGradient })),
  { ssr: false }
)

export default function Hero() {
  return (
    <div className="relative h-screen">
      <FlowGradient preset="stripe" className="absolute inset-0" />
      <div className="relative z-10">Your content</div>
    </div>
  )
}
```

### Vite / other bundlers

```tsx
import { FlowGradient } from 'dazineui'

export default function Hero() {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <FlowGradient preset="stripe" style={{ position: 'absolute', inset: 0 }} />
    </div>
  )
}
```

### Peer dependencies

Install if not already present in your project:

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
```

---

## Props

Every primitive accepts `preset`, `className`, and `style`. Most also accept `colors: string[]` and `speed: number`.

### FlowGradient

```tsx
<FlowGradient
  preset="stripe"          // 'stripe' | 'sunset' | 'ocean' | 'ember' | 'mint'
  colors={['#6366f1', '#8b5cf6', '#a78bfa']}  // override palette
  speed={1}                // animation speed multiplier
/>
```

### AuroraGradient

```tsx
<AuroraGradient
  preset="nordic"          // 'nordic' | 'plasma' | 'void' | 'twilight'
  colors={['#06B6D4', '#7C3AED']}
  speed={1}
/>
```

### WaveGrid

```tsx
<WaveGrid
  preset="ocean"           // 'white' | 'ocean' | 'neon' | 'ember' | 'plasma'
  followMouse={true}       // camera lazily tracks pointer
  amountX={50}             // grid columns
  amountY={50}             // grid rows
  speed={1}
/>
```

---

## How the AI integration works

When you install dazineui, the postinstall script creates:

```
your-project/
└── .cursor/
    └── rules/
        └── dazineui-motion.mdc   ← written automatically
```

Cursor reads every `.mdc` file in `.cursor/rules/` and attaches it to every AI conversation. The file contains:

1. **Routing table** — maps "make it pop" → `FlowGradient preset="stripe"`
2. **Decision flow** — AI checks MANIFEST before writing any visual code
3. **Hard rules** — never blur, always tune materials, always post-process R3F scenes
4. **Anti-pattern list** — what to explicitly refuse to generate

The AI doesn't need to be told about dazineui. It already knows.

---

## License

MIT
