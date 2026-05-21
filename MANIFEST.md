# dazineui Primitive Catalog

AI-readable catalog of all available primitives. Before writing any visual motion
or 3D code, check this file to see if a primitive already covers the need.

**Install:** `npm install dazineui`
**Import:** `import { FlowGradient, AuroraGradient, WaveGrid, ... } from 'dazineui'`
**Next.js:** Wrap in `dynamic(..., { ssr: false })` — all primitives use Canvas/WebGL.

Every primitive is implemented at **senior Three.js designer level** —
no blur-based tricks, no CSS gradients as stand-ins for real visual work.
All motion uses explicit geometry, materials, or shader logic.

---

## flow-gradient Family

Six animated backgrounds. All dark-first. Four use R3F + WebGL; two use Canvas 2D.
None use `filter: blur` or CSS gradients as their visual core.

---

### FlowGradient

**What it looks like:** Five semi-transparent ribbon meshes rotated 35° across the
viewport. Each ribbon is a `PlaneGeometry` whose vertex shader displaces points along Z
with a compound sine wave — real 3D undulation in depth, not just 2D wavy lines.
`THREE.AdditiveBlending` makes overlapping ribbons mix chromatically at intersections.
The result is sweeping diagonal color bands with organic shimmer and natural color mixing
where bands cross.

**Visual character:** Stripe homepage · high-energy launch page · premium SaaS hero

**When to use:**
- "Stripe-style", "colored wave bands", "diagonal animated gradient"
- Hero backgrounds needing strong color identity with real motion
- "Make it feel alive", "premium colorful background"
- When the visual hierarchy demands a dominant, kinetic backdrop

**Presets:** `stripe` · `sunset` · `ocean` · `ember` · `mint`

**Props:** `preset`, `colors: string[]` (5 colors), `speed: number`

**Import:** `import { FlowGradient } from '@/primitives/flow-gradient'`

**Category:** WebGL (R3F, ShaderMaterial, AdditiveBlending) · SSR: no · `'use client'`

---

### SpotlightGradient

**What it looks like:** Two or three `TubeGeometry` objects following animated
`CatmullRomCurve3` paths whose control points drift over time. Material is
`MeshStandardMaterial` with `emissiveIntensity: 5` — the glow comes from HDR emissive
value in linear color space, not CSS blur. `@react-three/postprocessing` `Bloom` with
`mipmapBlur` and `luminanceThreshold: 0.1` produces physically-plausible neon halos.
Tubes cross and orbit organically.

**Visual character:** Neon tubes · cyberpunk accent · dark editorial hero · dev tool
product

**When to use:**
- "Neon glow", "glowing tubes", "Linear-style", "focused color accent"
- When you want a single-color dominant focal energy rather than all-over coverage
- Dark hero sections needing drama without noise
- "Like that neon light aesthetic"

**Presets:** `cool` · `warm` · `electric` · `rose`

**Props:** `preset`, `color`, `secondColor`, `speed: number`, `tubeCount: number`

**Import:** `import { SpotlightGradient } from '@/primitives/flow-gradient'`

**Category:** WebGL (R3F, TubeGeometry, Bloom postprocessing) · SSR: no · `'use client'`

---

### MeshGradient

**What it looks like:** 120 thin bezier fiber curves drawn on Canvas 2D. Each fiber has
two animated control points with velocities that reflect at canvas bounds — the curves
breathe and drift. Fibers span horizontally or vertically with independent alpha
(0.08–0.63) and line weight (0.3–1.4px), creating perceptual depth through density
alone. No blur at any step. The richness comes entirely from fiber count and variation.

**Visual character:** Fine thread textile · premium data visualization backdrop ·
editorial fashion aesthetic

**When to use:**
- "Thread aesthetic", "fiber streams", "hair-thin lines", "woven background"
- Editorial pages, luxury brand digital, photography portfolio
- When you want extreme fine detail as texture rather than big color fields
- "Hundreds of thin lines moving"

**Presets:** `cosmos` · `dawn` · `forest` · `candy`

**Props:** `preset`, `colors: string[]`, `speed: number`, `fiberCount: number`

**Import:** `import { MeshGradient } from '@/primitives/flow-gradient'`

**Category:** Canvas 2D (bezier curves) · SSR: no · `'use client'`

---

### NoiseGradient

**What it looks like:** 2000 tiny particles following a sin+cos vector field on Canvas
2D. Each particle has a history trail (polyline), creating flowing organic streaks.
Particles wrap at canvas edges and never die — the system reaches a beautiful steady
state of streaming curves after ~3 seconds. Colors are assigned per particle group.
Zero blur: visual density comes entirely from particle count and trail length.

**Visual character:** Flow field art · Frank's Lab style · generative organic motion

**When to use:**
- "Flow field", "particle streams", "organic flowing lines", "generative art background"
- Portfolio pages, creative agency, developer aesthetic
- Dark moody backgrounds where structure emerges from chaos
- "Like those particle art pieces"

**Presets:** `void` · `dusk` · `forest` · `cherry`

**Props:** `preset`, `colors: string[]`, `speed: number`, `frequency: number`
(frequency controls vector field zoom — smaller = broad sweeping, larger = tight spirals)

**Import:** `import { NoiseGradient } from '@/primitives/flow-gradient'`

**Category:** Canvas 2D (flow field, particle trails) · SSR: no · `'use client'`

---

### AuroraGradient

**What it looks like:** 60×20 grid of particles (1200 total) arranged in sine-wave
bands, one band per palette color. Custom `ShaderMaterial` vertex shader displaces each
particle vertically with two overlapping sine waves of different frequencies, creating
interference patterns. Fragment shader discards pixels outside point radius — hard
circle cutoff, no softness. `AdditiveBlending` makes layered bands glow where they
intersect. The result is a dot-matrix aurora: structured rows of crisp points undulating
in depth.

**Visual character:** Dot matrix · particle waves · electronic music visualizer ·
science/data aesthetic

**When to use:**
- "Dot matrix", "particle grid", "aurora borealis", "wave bands of particles"
- Developer tools, data platform, AI product aesthetic
- When you want order + motion — geometric but alive
- "Like those LED matrix displays"

**Presets:** `nordic` · `plasma` · `void` · `twilight`

**Props:** `preset`, `colors: string[]`, `speed: number`, `particleSize: number`

**Import:** `import { AuroraGradient } from '@/primitives/flow-gradient'`

**Category:** WebGL (R3F, Points, ShaderMaterial, AdditiveBlending) · SSR: no ·
`'use client'`

---

---

### WaveGrid

**What it looks like:** A 50×50 grid of crisp circular particles laid flat in the XZ
plane, viewed from a perspective camera positioned at z=1000. Every frame the Y position
of each particle is updated with two compound sine waves:

```
y = sin((col + t) * 0.3) * 50 + sin((row + t) * 0.5) * 50
```

Particle size also scales with wave height — crests have bigger dots, troughs have
smaller dots — creating a tactile "breathing surface" feel. The perspective camera lazily
tracks the mouse pointer (spring coefficient 0.05), tilting the entire grid as you move.

**Visual character:** Classic Three.js example aesthetics · tech conference hero ·
data visualization · "ocean surface from above"

**When to use:**
- "Particle grid", "wave surface", "Three.js waves", "grid wave effect"
- Conference backdrop, interactive demo hero, "ocean of data" metaphor
- When you want a classic 3D particle field with mouse interactivity
- "That Three.js example with the white dots"

**Presets:** `white` (original) · `ocean` · `neon` · `ember` · `plasma`

**Props:** `preset`, `color: string`, `speed: number`, `amountX: number`,
`amountY: number`, `followMouse: boolean`

**Import:** `import { WaveGrid } from '@/primitives/flow-gradient'`

**Category:** WebGL (R3F, BufferGeometry, CPU-updated attributes, perspective point
sizing) · SSR: no · `'use client'` · Mouse interactive

**Source:** Faithful R3F adaptation of
[Three.js webgl_particles_waves](https://threejs.org/examples/webgl_particles_waves.html)

---

## Roadmap — Original Works

These primitives are planned for implementation from scratch. Each is designed at
senior Three.js level: real geometry, real materials, real shader reasoning. No
approximations.

---

### MorphOrb *(planned)*

**Concept:** A sphere whose surface is continuously displaced by fractional Brownian
motion (fBm) GLSL — smooth organic morphing, like a living cell or the Anthropic logo
done properly. `MeshPhysicalMaterial` with `transmission: 0.9`, `roughness: 0.05`,
`thickness: 2.0` gives glass-like subsurface depth. Bloom postprocessing makes the orb
glow at bright surface peaks. Camera orbits slowly.

**Visual character:** AI startup hero · premium product orb · "living logo"

**When to use:** "Anthropic-style orb", "morphing ball", "glowing orb hero", "living
shape"

**Category:** WebGL (R3F, fBm vertex shader, MeshPhysicalMaterial, Bloom)

---

### CrystalShard *(planned)*

**Concept:** A fractured glass/gemstone cluster made from `IcosahedronGeometry` with
low detail + `flatShading`. `MeshPhysicalMaterial` with `transmission: 1.0`,
`reflectivity: 1.0`, `ior: 2.4` (diamond IOR). Environment map drives reflections.
Shards slowly rotate at different rates. `@react-three/drei` `Environment` preset
provides the HDRI. Caustic light patterns emerge naturally from transmission material.

**Visual character:** Luxury product · crystal clear · premium gemstone · light play

**When to use:** "Crystal", "gem", "glass shard", "jewel", "refraction effect"

**Category:** WebGL (R3F, transmission material, HDRI environment, flat-shaded geometry)

---

### HolographicGrid *(planned)*

**Concept:** An infinite perspective grid on the ground plane using instanced
`PlaneGeometry` cells. A custom fragment shader draws grid lines with distance-based
falloff. A scan-line passes over the grid periodically. A neon hotspot at screen center
brightens nearby cells. Classic cyberpunk/tech aesthetic — think Tron, Midjourney UI,
ghost-in-the-shell HUD.

**Visual character:** Cyberpunk · tech HUD · sci-fi · hacker aesthetic

**When to use:** "Cyberpunk grid", "Tron aesthetic", "infinite grid", "tech HUD
background", "sci-fi"

**Category:** WebGL (R3F, instanced geometry, custom fragment shader, scan-line uniform)

---

### ParticleText *(planned)*

**Concept:** `TextGeometry` (or sampled bitmap) dissolved into a `Points` cloud.
Particles swirl in a vortex, then on trigger (load, scroll-in, or hover) they converge
into the letter forms. On exit they explode outward with per-particle velocity
influenced by a curl-noise field. Yuri Artiukh / Akella Studio level work — the
canonical "particles form a word" effect done with real physics integration.

**Visual character:** Reveal animation · hero title · "our product name" moment

**When to use:** "Particles form text", "particle logo reveal", "word made of particles"

**Category:** WebGL (R3F, TextGeometry sampling, particle physics, curl noise)

---

### ChromaText *(planned)*

**Concept:** `TextGeometry` with a custom `ShaderMaterial` implementing thin-film
interference (iridescent holographic effect). The fragment shader computes a viewing
angle–dependent hue shift using `dot(normal, viewDir)` and maps it to a spectral color
ramp. The result looks like holographic foil text — shifting rainbow colors as the
camera or text moves. Add subtle vertex wobble for life.

**Visual character:** Holographic foil · iridescent · high-fashion · NFT/crypto luxury

**When to use:** "Holographic text", "iridescent type", "rainbow foil", "chrome
letters", "metallic shimmer text"

**Category:** WebGL (R3F, TextGeometry, custom iridescent ShaderMaterial)

---

### GalaxyField *(planned)*

**Concept:** 80,000–120,000 particles arranged in a logarithmic spiral (Milky Way
morphology). Each arm uses a different hue. A custom vertex shader offsets particles
along the Y axis using a noise function to break the flat-plane look. Particles rotate
at different angular velocities based on radius (differential rotation). Inner core is
denser and brighter. The canonical "galaxy background" rendered at senior quality
instead of the common flat-disc tutorial result.

**Visual character:** Space · cosmic · science · exploration · scale and awe

**When to use:** "Galaxy background", "space aesthetic", "star field", "cosmic",
"Milky Way"

**Category:** WebGL (R3F, BufferGeometry with custom attributes, spiral math)

---

## Composition Rules

- `FlowGradient` + content overlay — dominant colorful hero for SaaS, product launches
- `SpotlightGradient` + content overlay — cinematic focused hero for dev tools,
  editorial
- `AuroraGradient` + content overlay — structured, data-platform, AI product aesthetic
- `NoiseGradient` + content overlay — creative agency, portfolio, generative art context
- `MeshGradient` + content overlay — luxury, editorial, fine-detail atmosphere

**Never combine two WebGL canvases in the same viewport section** (context budget).
**Never stack two gradient primitives** in one section — pick one.
**Always use `LazyScene` wrapper** when rendering multiple WebGL scenes on the same
page to prevent Chrome's ~16-context limit from being exhausted.

---

## Design Philosophy

Every primitive in this library encodes a specific design decision made at senior level:

1. **No blur as a core visual trick.** Blur is a shortcut for depth and glow. Use it
   only as post-processing (Bloom on HDR-emissive materials), never as the primary
   visual ingredient.

2. **Geometry carries meaning.** Ribbons, tubes, fibers, particles — each shape
   communicates something. Ribbons = flow and energy. Tubes = neon, focus, drama.
   Fibers = texture, craft, density. Particles = emergence, scale, data.

3. **Materials are deliberate.** `MeshPhysicalMaterial` for glass/gem. `MeshStandard`
   + high emissive for neon. Custom `ShaderMaterial` when the built-in material model
   can't express the idea. Never use default materials for hero-grade visuals.

4. **AdditiveBlending for overlapping colored elements.** When shapes with color overlap
   on a dark background, additive blending produces physically-accurate light mixing
   (colors brighten at intersections, as real lights do). This is the right choice for
   neon, glow, and luminous aesthetics.

5. **Post-processing is the finishing pass, not the main event.** Bloom enhances
   emissive materials; it doesn't rescue non-emissive flat geometry. ACES tonemapping
   for realism. Vignette for cinematic framing.

6. **Speed props are multipliers, not raw values.** `speed = 1` is the designed
   default. `speed = 0` pauses (needed for `prefers-reduced-motion`). `speed = 2` is
   fast.
