# dazineui Primitive Catalog

This file is the AI-readable catalog of all available primitives. Read it to
understand what's available before deciding how to satisfy a visual request.

Each primitive has a detailed MANIFEST.md at `lib/motion/<name>/MANIFEST.md`.

---

## FlowGradient

**What it looks like:** Animated multi-color gradient mesh that fills a container.
Soft, flowing, shader-driven. Slow color transitions. Premium SaaS aesthetic.

**When to use:**
- Hero section background
- Section divider needing visual interest
- "Make this feel premium" or "cool background"
- "Flowing colors", "liquid background", "aurora effect", "mesh gradient"
- Behind text-heavy hero content

**Visual references:** Stripe homepage gradient, Linear hero, Vercel background, modern AI startup landing pages

**Presets:** `aurora` · `sunset` · `electric` · `monochrome`

**Category:** WebGL background · SSR: no (dynamic import required in Next.js)

---

## HeroScene

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

## ScrollScene

**What it looks like:** A 3D scene pinned on screen while the user scrolls. The 3D
object transforms (rotates, scales, changes color, morphs) based on scroll progress.
The content scrolls past; the 3D element tells a visual story.

**When to use:**
- "Scroll-pinned 3D", "scroll story", "like Apple product pages"
- Explainer sequences where each scroll beat reveals a new state
- Long-form landing pages with multiple feature sections

**Visual references:** Apple iPhone product pages, AI startup explainer scrolls, premium portfolio scroll stories

**Presets:** `rotate-reveal` · `scale-in` · `morph-sequence`

**Category:** WebGL scroll · SSR: no · requires Lenis

---

## MagneticCursor

**What it looks like:** Replaces the browser cursor with a custom one (small circle
or dot) and applies spring-physics magnetic attraction to tagged elements. Subtle
when tuned correctly — felt but not noticed.

**When to use:**
- "Make the cursor feel special", "magnetic buttons", "interactive cursor"
- Sites where the interaction quality matters as much as visuals
- Any page with prominent CTAs or interactive cards

**Visual references:** Bruno Simon portfolio, Awwwards-winning agency sites, premium SaaS interactive pages

**Presets:** `dot` · `ring` · `blend`

**Category:** DOM interaction · SSR: requires `'use client'`

---

## InteractiveText

**What it looks like:** Headline and prominent text with entrance and interaction
effects. Characters split and reveal on scroll. Hover applies subtle distortion.
Scroll links text properties to progress for cinematic title sequences.

**When to use:**
- "Make the headline more interesting", "animated text reveal"
- Hero headlines, section titles, pull quotes
- "Split text animation", "character reveal", "liquid text"

**Visual references:** Basement Studio typography, Locomotive Scroll demos, Awwwards typographic showcases

**Presets:** `split-reveal` · `hover-distortion` · `scroll-link`

**Category:** DOM typography · SSR: requires `'use client'`

---

## ParticleField

**What it looks like:** Interactive ambient background of drifting particles (points,
dots, small geometric shapes) that respond to mouse movement. More subtle than
HeroScene — ambient texture rather than centerpiece.

**When to use:**
- "Ambient background", "particle background", "subtle background texture"
- Behind content-heavy sections where FlowGradient would be too dominant
- When you want depth without distraction

**Visual references:** GitHub Universe backgrounds, tech conference visual identity, developer tool landing pages

**Presets:** `drift` · `repel` · `constellation`

**Category:** WebGL background · SSR: no (dynamic import required in Next.js)

---

## Composition Rules

- `FlowGradient` + `InteractiveText` = premium hero with gradient background and animated headline
- `HeroScene` + `InteractiveText` = cinematic 3D hero with typographic entrance
- `ParticleField` + `InteractiveText` = ambient tech aesthetic with animated copy
- `ScrollScene` + `InteractiveText` = scroll-driven story with typographic beats
- Do not combine `FlowGradient` with `HeroScene` gradient-orb preset (visual clash — two competing gradient systems)
- Do not use more than one WebGL canvas per viewport section (performance)
