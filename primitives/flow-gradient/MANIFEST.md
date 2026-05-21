# flow-gradient

**Category:** WebGL / Background  
**Inject name:** `flow-gradient`  
**Import path (after inject):** `import { ... } from './components/ui/flow-gradient'`  
**Import path (in dazineui source):** `import { ... } from '@/primitives/flow-gradient'`

---

## What it looks like

A family of five GPU-rendered gradient backgrounds. All variants are full-bleed, SSR-safe with dynamic import, and ship with a subtle film grain overlay for tactile depth. They are meant to sit behind content as a living, animated surface — not as decorative overlays.

---

## When to use

- Full-viewport or section-level animated background
- Hero sections where a static solid or CSS gradient looks flat
- "Make it feel premium / cinematic / alive" requests
- Products where the brand lives in color (Stripe-style spectral sweep, Linear electric indigo, Vercel dark-mode moody)
- Dark-mode–first designs needing depth without heavy 3D overhead

**Do not use** when:
- The user explicitly needs an interactive 3D scene → use `HeroScene` instead
- Scroll-based transformation is required → use `ScrollScene` instead
- The brand is light-mode only and high-contrast — gradient backgrounds fight legibility

---

## Variants

All five are exported from the same inject unit. Choose one per use-case; do not layer multiple gradient variants on top of each other.

| Component | Visual character | Tech |
|---|---|---|
| `FlowGradient` | Flowing spectral wave — rich multi-color sweep | WebGL canvas (vertex + fragment shader) |
| `SpotlightGradient` | Dual radial spotlights on dark surface, optionally mouse-tracked | WebGL canvas |
| `MeshGradient` | Organic blob mesh — soft color nodes blending bilinearly | WebGL canvas |
| `NoiseGradient` | SVG turbulence + radial gradient — minimal overhead, CSS-animated | SVG filter |
| `AuroraGradient` | Horizontal curtain bands of light like a northern lights effect | WebGL canvas |

---

## FlowGradient

**What it looks like:** Multi-color spectral bands animate slowly across the surface in a looping wave. Closest brand reference: Stripe's homepage gradient, Linear gradient accent sections.

**Presets:**

| Preset | Colors | Mood |
|---|---|---|
| `stripe` (default) | violet → blue → teal → pink → amber | Spectral, Stripe-like, premium |
| `sunset` | orange → pink → amber → red → purple | Warm, energetic |
| `ocean` | sky → cyan → teal → blue → indigo | Cool, calm, technical |
| `ember` | red → orange → amber → crimson → yellow | Hot, intense |
| `mint` | green → teal → cyan → emerald → blue | Fresh, clean |

**Props:**

| Prop | Type | Default | Notes |
|---|---|---|---|
| `preset` | `'stripe' \| 'sunset' \| 'ocean' \| 'ember' \| 'mint'` | `'stripe'` | Named preset |
| `colors` | `string[]` | — | Array of hex strings. Overrides `preset`. 3–6 colors recommended. |
| `speed` | `number` | `1` | Animation multiplier. `0` = frozen. |
| `grain` | `number` | `0.015` | Film grain opacity (0–1). Keep below 0.05. |
| `className` | `string` | — | |
| `style` | `CSSProperties` | — | |

---

## SpotlightGradient

**What it looks like:** Two radial spotlight halos on a dark background. Primary spotlight can track the mouse. Closest reference: Tailwind UI dark hero sections, Vercel feature section backgrounds.

**Presets:**

| Preset | Primary color | Secondary color | Mood |
|---|---|---|---|
| `cool` (default) | indigo `#6366F1` | cyan `#0891B2` | Technical, cool |
| `warm` | amber `#F59E0B` | orange `#EA580C` | Warm, energetic |
| `electric` | purple `#A855F7` | blue `#3B82F6` | Vivid, electric |
| `rose` | pink `#EC4899` | rose `#F43F5E` | Feminine, bold |

**Props:**

| Prop | Type | Default | Notes |
|---|---|---|---|
| `preset` | `'cool' \| 'warm' \| 'electric' \| 'rose'` | `'cool'` | Named preset |
| `color` | `string` | — | Override primary spotlight (hex or rgba). |
| `secondColor` | `string \| null` | — | Override secondary spotlight. `null` disables it. |
| `speed` | `number` | `1` | Animation speed. `0` = static. |
| `followMouse` | `boolean` | `false` | Primary spotlight tracks cursor position. |
| `grain` | `number` | `0.015` | Film grain opacity (0–1). |
| `className` | `string` | — | |
| `style` | `CSSProperties` | — | |

---

## MeshGradient

**What it looks like:** A 3×3 (configurable) grid of color control points that bilinearly blend into each other and animate slowly. Produces soft, organic color blobs. Closest reference: Figma's mesh gradient tool, Apple Music album art styles.

**Presets:**

| Preset | Colors | Mood |
|---|---|---|
| `cosmos` (default) | Dark purple, indigo, teal | Moody, dark, cosmic |
| `dawn` | Sand, peach, rose — light tones | Soft, warm, light-mode |
| `forest` | Deep greens and teals | Natural, grounded |
| `candy` | Bright pink, purple, blue | Saturated, playful |

**Props:**

| Prop | Type | Default | Notes |
|---|---|---|---|
| `preset` | `'cosmos' \| 'dawn' \| 'forest' \| 'candy'` | `'cosmos'` | Named preset |
| `colors` | `string[]` | — | Array of hex strings. Length should equal `rows × cols`. |
| `speed` | `number` | `1` | Animation multiplier. |
| `rows` | `number` | `3` | Grid rows. More rows = finer blending. |
| `cols` | `number` | `3` | Grid columns. |
| `grain` | `number` | `0.015` | Film grain opacity. |
| `className` | `string` | — | |
| `style` | `CSSProperties` | — | |

---

## NoiseGradient

**What it looks like:** SVG turbulence filter applied to a radial gradient — produces cloudy, painterly blobs of color. Lower GPU cost than WebGL variants (uses SVG filter primitives + CSS animation). Closest reference: Anthropic.com's subtle textured backgrounds.

**Presets:**

| Preset | Colors | Mood |
|---|---|---|
| `void` (default) | Near-black deep space purples | Minimal, premium dark |
| `dusk` | Dark violet, midnight blue | Moody, atmospheric |
| `forest` | Very dark greens | Organic, natural |
| `cherry` | Very dark wines | Intimate, dramatic |

**Props:**

| Prop | Type | Default | Notes |
|---|---|---|---|
| `preset` | `'void' \| 'dusk' \| 'forest' \| 'cherry'` | `'void'` | Named preset |
| `colors` | `[string, string, string]` | — | Tuple of exactly 3 hex strings [from, mid, to]. |
| `speed` | `number` | `1` | CSS animation duration multiplier. |
| `frequency` | `number` | `0.006` | SVG turbulence base frequency. Lower = larger blobs. |
| `octaves` | `number` | `4` | Turbulence octaves. More = finer detail (higher CPU cost). |
| `className` | `string` | — | |
| `style` | `CSSProperties` | — | |

---

## AuroraGradient

**What it looks like:** Horizontal bands of light sweep and undulate like a northern lights / aurora borealis effect. Strong vertical motion rhythm. Closest reference: Linear gradient hero, Stripe Connect feature backgrounds.

**Presets:**

| Preset | Colors | Mood |
|---|---|---|
| `nordic` (default) | Teal, cyan, jade, pale green | Classic aurora, fresh |
| `plasma` | Purple, magenta, indigo | Electric, vivid |
| `void` | Near-monochrome dark blues | Ultra-subtle, barely-there |
| `twilight` | Rose, amber, purple | Sunset-to-night, warm |

**Props:**

| Prop | Type | Default | Notes |
|---|---|---|---|
| `preset` | `'nordic' \| 'plasma' \| 'void' \| 'twilight'` | `'nordic'` | Named preset |
| `colors` | `string[]` | — | Array of hex strings. Each becomes one light band. 4–8 colors ideal. |
| `speed` | `number` | `1` | Animation speed multiplier. |
| `grain` | `number` | `0.015` | Film grain opacity. |
| `className` | `string` | — | |
| `style` | `CSSProperties` | — | |

---

## Inject and usage

```bash
~/.claude/skills/dazineui/bin/inject flow-gradient ./components/ui
```

All five variants are copied together and export from a single barrel:

```tsx
import { FlowGradient } from './components/ui/flow-gradient'
import { SpotlightGradient } from './components/ui/flow-gradient'
import { MeshGradient } from './components/ui/flow-gradient'
import { NoiseGradient } from './components/ui/flow-gradient'
import { AuroraGradient } from './components/ui/flow-gradient'
```

All are canvas/SVG elements and must be wrapped in `dynamic` with `ssr: false` in Next.js:

```tsx
import dynamic from 'next/dynamic'
const FlowGradient = dynamic(
  () => import('./components/ui/flow-gradient').then((m) => ({ default: m.FlowGradient })),
  { ssr: false }
)
```

Size the container explicitly — they render to 100% width/height of their parent:

```tsx
<div style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
  <FlowGradient preset="stripe" />
</div>
```

---

## Variant selection guide

| Signal | Use |
|---|---|
| Multi-color, spectral, "Stripe-like" | `FlowGradient` |
| Spotlight / halo on dark surface | `SpotlightGradient` |
| Soft organic blobs, mesh-like | `MeshGradient` |
| Painterly, cloudy, minimal GPU | `NoiseGradient` |
| Horizontal light bands, aurora feeling | `AuroraGradient` |
| Mouse-interactive background | `SpotlightGradient` with `followMouse` |
| Light-mode background | `MeshGradient` with `dawn` preset |
| Most subtle / barely visible | `AuroraGradient` with `void` preset OR `NoiseGradient` with `void` preset |
