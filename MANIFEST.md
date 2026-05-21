# dazineui Primitive Catalog

This file is the AI-readable catalog of all available primitives. Read it to
understand what's available before deciding how to satisfy a visual request.

---

## Gradient Primitives

Five gradient backgrounds, all dark-first, all Canvas 2D or pure CSS — no WebGL required.

### FlowGradient

**What it looks like:** Colored orbs drifting slowly on a dark canvas, blurred into
pools of ambient light. Stripe homepage energy. Multiple colors bleed together via CSS
`screen` composite + `filter: blur(80px)`. The blur is the ingredient — without it,
circles; with it, light.

**When to use:**
- "Make this feel like Stripe", "Vercel-style background", "pools of color"
- Hero section backgrounds, full-bleed sections
- "Flowing gradient", "colored light background"

**Presets:** `stripe` · `sunset` · `ocean` · `ember` · `mint`

**Import:** `import { FlowGradient } from '@/primitives/flow-gradient'` (all gradient variants export from this single path)

**Category:** Canvas 2D background · SSR: no (needs `'use client'`)

---

### SpotlightGradient

**What it looks like:** One or two focused radial light sources that slowly orbit the
container. A bright core that falls off to transparent, on a near-black base. Cinematic
and directional — less diffuse than FlowGradient. Think Linear.app hero.

**When to use:**
- "Linear-style background", "focused light", "directional gradient"
- When you want depth without chaos — one glowing region, not five
- `followMouse: true` for interactive hero sections

**Presets:** `cool` · `warm` · `electric` · `rose`

**Import:** `import { SpotlightGradient } from '@/primitives/flow-gradient'`

**Category:** CSS radial + rAF · SSR: no (needs `'use client'`)

---

### MeshGradient

**What it looks like:** A grid of color control points bilinearly interpolated into a
smooth gradient. Points drift very slowly. Output looks like the macOS Sonoma wallpaper
or Figma's mesh gradient tool — structured and geometric rather than organic.

**When to use:**
- "Mesh gradient", "macOS-style background", "geometric gradient"
- Full-bleed section backgrounds where you want color variety without the orb look
- Light or dark mode (presets cover both)

**Presets:** `cosmos` · `dawn` · `forest` · `candy`

**Import:** `import { MeshGradient } from '@/primitives/flow-gradient'`

**Category:** Canvas 2D · SSR: no (needs `'use client'`)

---

### NoiseGradient

**What it looks like:** An organic, rough-textured gradient animated via SVG
`<feTurbulence>` seed animation. Zero JS — pure SVG filter pipeline. The turbulence
shifts slowly, creating an almost painterly surface. Most performant of all five;
entirely GPU-accelerated.

**When to use:**
- "Organic gradient", "noisy background", "abstract texture", "painterly"
- When you need animation with zero JS overhead
- Dark moody backgrounds for editorial or portfolio work

**Presets:** `void` · `dusk` · `forest` · `cherry`

**Import:** `import { NoiseGradient } from '@/primitives/flow-gradient'`

**Category:** SVG filter · SSR: yes (no client code) · zero JS

---

### AuroraGradient

**What it looks like:** Vertical light bands in teal/cyan/jade that shimmer
horizontally with offset sine waves. Each band has its own phase, so they move
independently. Nordic sky — a clear, cooler aesthetic versus the warm orbs of
FlowGradient.

**When to use:**
- "Aurora borealis", "northern lights", "vertical light streaks"
- Cool-toned landing pages, developer tool aesthetics
- When you want FlowGradient energy but distinctly vertical and structured

**Presets:** `nordic` · `plasma` · `void` · `twilight`

**Import:** `import { AuroraGradient } from '@/primitives/flow-gradient'`

**Category:** Canvas 2D · SSR: no (needs `'use client'`)

---

## Interactive Primitives

### HeroScene

**What it looks like:** Full-viewport React Three Fiber scene. Central 3D element
with cinematic camera, three-point lighting, environment reflections, and
post-processing (bloom, ACES tonemapping, vignette) baked in.

**When to use:**
- Full-viewport hero section
- "3D hero", "cinematic hero", "like Anthropic / OpenAI"
- When the hero needs a premium centerpiece beyond a gradient
- Product launch pages, AI startup marketing pages

**Visual references:** Anthropic.com hero orb, OpenAI product pages, Framer hero sections

**Presets:** `gradient-orb` · `wireframe-object` · `particle-cloud`

**Category:** WebGL hero · SSR: no (dynamic import required in Next.js)

---

### ScrollScene

**What it looks like:** A 3D scene pinned on screen while the user scrolls. The 3D
object transforms (rotates, scales, changes color, morphs) based on scroll progress.
The content scrolls past; the 3D element tells a visual story.

**When to use:**
- "Scroll-pinned 3D", "scroll story", "like Apple product pages"
- Explainer sequences where each scroll beat reveals a new state
- Long-form landing pages with multiple feature sections

**Visual references:** Apple iPhone product pages, AI startup explainer scrolls

**Presets:** `rotate-reveal` · `scale-in` · `morph-sequence`

**Category:** WebGL scroll · SSR: no · requires Lenis

---

### MagneticCursor

**What it looks like:** Replaces the browser cursor with a custom one (small circle
or dot) and applies spring-physics magnetic attraction to tagged elements.

**When to use:**
- "Make the cursor feel special", "magnetic buttons", "interactive cursor"
- Sites where the interaction quality matters as much as visuals
- Any page with prominent CTAs or interactive cards

**Visual references:** Bruno Simon portfolio, Awwwards-winning agency sites

**Presets:** `dot` · `ring` · `blend`

**Category:** DOM interaction · SSR: requires `'use client'`

---

### InteractiveText

**What it looks like:** Headline text with entrance and interaction effects. Characters
split and reveal on scroll. Hover applies subtle distortion. Scroll links text
properties to progress.

**When to use:**
- "Make the headline more interesting", "animated text reveal"
- Hero headlines, section titles, pull quotes
- "Split text animation", "character reveal"

**Visual references:** Basement Studio typography, Locomotive Scroll demos

**Presets:** `split-reveal` · `hover-distortion` · `scroll-link`

**Category:** DOM typography · SSR: requires `'use client'`

---

### ParticleField

**What it looks like:** Interactive ambient background of drifting particles that
respond to mouse movement. Ambient texture rather than centerpiece.

**When to use:**
- "Ambient background", "particle background", "subtle background texture"
- Behind content-heavy sections where gradients would be too dominant
- When you want depth without distraction

**Visual references:** GitHub Universe backgrounds, tech conference visual identity

**Presets:** `drift` · `repel` · `constellation`

**Category:** WebGL background · SSR: no (dynamic import required in Next.js)

---

## Composition Rules

- `FlowGradient` + `InteractiveText` — premium hero: gradient background + animated headline
- `SpotlightGradient` + `InteractiveText` — minimal cinematic hero, clean and focused
- `AuroraGradient` + `InteractiveText` — developer/tech aesthetic
- `NoiseGradient` + `InteractiveText` — editorial, moody, organic feel
- `HeroScene` + `InteractiveText` — cinematic 3D hero with typographic entrance
- `ParticleField` + `InteractiveText` — ambient tech aesthetic with animated copy
- `ScrollScene` + `InteractiveText` — scroll-driven story with typographic beats

**Do not combine two WebGL canvases in the same viewport section** (performance).
**Do not stack two gradient primitives** on the same section — pick one.
