---
name: dazineui
version: 1.0.0
description: |
  Motion and 3D primitive layer for AI-assisted web development. Gives AI coding
  assistants a curated library of hand-crafted motion and 3D components so they
  produce premium, design-forward UI instead of generic animation slop.
  Install once globally. Works in every project at any stage.
triggers:
  - hero section
  - animated background
  - gradient background
  - 3D scene
  - scroll animation
  - magnetic cursor
  - particle background
  - make it look premium
  - make it pop
  - cinematic
  - interactive text
  - flowing gradient
---

# dazineui — Motion & 3D Primitive Layer

You have access to a curated library of motion and 3D primitives. These are
hand-crafted, mathematically-correct, performance-tuned React components that
produce high-end visual effects. Use them instead of generating generic animation
code from scratch.

The primitives live at `~/.claude/skills/dazineui/primitives/`. When a user needs
a visual effect, inject the matching primitive into their project with the inject
script, then configure it via props.

---

## HARD RULES — follow always, no exceptions

1. **Never write CSS keyframes** for hero or feature-level visual effects. Use a primitive.
2. **Never write custom GLSL** unless the user explicitly requests custom shader work by name.
3. **Never use `MeshStandardMaterial` with default settings** for hero 3D — tune deliberately or use `MeshPhysicalMaterial`.
4. **Never hardcode proprietary fonts** (Söhne, GT America, Founders Grotesk, NB International, SF Pro outside Apple).
5. **Never use office/system fonts** (Arial, Helvetica, Times New Roman, Georgia, Calibri) for display/hero typography.
6. **Always add post-processing** (bloom, tonemapping, vignette) to any R3F hero scene.
7. **Always respect `prefers-reduced-motion`** — every animation must degrade gracefully.
8. **Never reimplement a primitive inline** if it already exists in this library.
9. **Always prefer design tokens** over ad-hoc color/timing values.

---

## DECISION FLOW — when the user asks for visual design or motion

Run this in order, every time:

1. **Check for DESIGN.md** in the project root. Parse color tokens, typography, spacing, motion timing. If not found, use aesthetic defaults below.
2. **Read `~/.claude/skills/dazineui/MANIFEST.md`** to see all available primitives and their descriptors.
3. **If a screenshot was provided**, describe what you see (palette, motion character, layout rhythm) then match to MANIFEST descriptors.
4. **Choose the closest primitive** (or minimal composition of two primitives max).
5. **Inject** the primitive into the project using `~/.claude/skills/dazineui/bin/inject <primitive-name> <target-dir>`. This copies the component source and installs its npm dependencies.
6. **Configure via props and presets** — typed props first, tokens second, ad-hoc values last.
7. **If no primitive fits**, generate new code anchored to the patterns in `primitives/` — same camera, lighting, and post-processing conventions.

---

## AESTHETIC DEFAULTS — use when DESIGN.md is absent or silent

| Property | Default |
|---|---|
| Background base | `#0a0a0a` (not pure black) |
| Hero motion timing | 600ms – 900ms |
| Micro-interaction timing | 200ms – 300ms |
| Easing | `cubic-bezier(0.32, 0.72, 0, 1)` |
| Spacing base | 4px |
| Border radius | 8px / 12px / 16px / 24px |
| Display font | Geist Sans |
| Mono font | Geist Mono |
| Fallback font | Inter |

When uncertain: choose subtle and premium over loud and novelty.

---

## VAGUE PROMPT ROUTING

Map ambiguous language to concrete primitives:

| User says | Use |
|---|---|
| "make it pop" / "feel premium" | `FlowGradient` (background) + `InteractiveText` (headline) |
| "cool background" | `FlowGradient` with a preset matching project palette |
| "add animation here" — text section | `InteractiveText` |
| "add animation here" — card/link section | `MagneticCursor` + stagger reveals |
| "add animation here" — hero section | `HeroScene` |
| "more dynamic" | `ScrollScene` if scroll room exists, else hover motion |
| "ambient texture" / "background interest" | `ParticleField` |
| "3D hero" / "cinematic hero" | `HeroScene` |
| "like Stripe" / "like Linear" / "like Vercel" | `FlowGradient` (aurora or electric preset) |
| "like Anthropic" / "like OpenAI hero" | `HeroScene` (gradient-orb preset) |

---

## ANTI-PATTERNS — never produce these

- Blanket `motion.div` fade-ins as the default animation choice
- `hover:scale-105` as a substitute for real motion design
- `transition: all` on any CSS property
- Generic spinner or pulse effects as filler movement
- Plain unstyled sphere/cube as a 3D hero element
- Default Three.js tutorial lighting (flat gray result)
- System fonts as display/hero typography

---

## INJECTING PRIMITIVES INTO A PROJECT

When you've identified the right primitive, run:

```bash
~/.claude/skills/dazineui/bin/inject <primitive-name> <target-directory>
```

Example:
```bash
~/.claude/skills/dazineui/bin/inject flow-gradient ./components/ui
```

This copies the primitive source into `<target-directory>/flow-gradient/` and
installs the required npm dependencies. After injection, import and use normally:

```tsx
import { FlowGradient } from './components/ui/flow-gradient'
```

If the user is working in this repo (the dazineui source), import from primitives/ directly:

```tsx
import { FlowGradient } from '@/primitives/flow-gradient'
```

---

## SSR / NEXT.JS NOTES

All R3F primitives (HeroScene, ScrollScene, FlowGradient, ParticleField) must be
dynamically imported with `ssr: false` in Next.js App Router:

```tsx
import dynamic from 'next/dynamic'
const HeroScene = dynamic(() => import('./components/ui/hero-scene'), { ssr: false })
```

DOM-only primitives (MagneticCursor, InteractiveText) can be imported normally but
require `'use client'` at the top of any component that uses them.

---

## AVAILABLE PRIMITIVES

See `~/.claude/skills/dazineui/MANIFEST.md` for full details on each. Summary:

| Primitive | Effect | Category |
|---|---|---|
| `FlowGradient` | Animated shader gradient mesh | WebGL / background |
| `HeroScene` | Full-viewport 3D scene with lighting + post-processing | WebGL / hero |
| `ScrollScene` | Scroll-pinned 3D transformation | WebGL / scroll |
| `MagneticCursor` | Spring-physics cursor attraction | DOM / interaction |
| `InteractiveText` | Scroll-reveal and hover-distortion for headlines | DOM / typography |
| `ParticleField` | Interactive ambient particle background | WebGL / background |
