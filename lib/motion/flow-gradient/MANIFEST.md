# FlowGradient

## What it looks like

Animated multi-color gradient mesh background. Soft, flowing, shader-driven.
Slow color transitions driven by layered simplex noise. Fills its container completely.
Premium SaaS aesthetic. Works equally well as a full-viewport hero background or as
a section accent. Subtle grain overlay adds tactile depth.

## When to use

Match this primitive when the user says or implies any of the following:

- "hero section background", "make the background interesting"
- "flowing gradient", "animated gradient", "mesh gradient"
- "aurora effect", "liquid background", "color flow"
- "make it feel premium", "make it pop", "cool background"
- "like Stripe", "like Linear", "like Vercel gradient"
- Any request for background visual energy that isn't a full 3D scene

## Common visual references

Stripe.com homepage (circa 2020–present), Linear.app hero, Vercel.com background,
Anthropic background overlays, most modern AI startup landing pages.

## Presets

| Preset | Character | Use when |
|---|---|---|
| `aurora` | Cool blues, purples, greens. Slow and meditative. | Default. Tech/AI/developer tools. |
| `sunset` | Warm oranges, pinks, magentas. Rich and energetic. | Creative tools, consumer apps. |
| `electric` | High-contrast neons. Fast and vivid. | CTAs, launch moments, dark mode features. |
| `monochrome` | Single-hue tonal variation. Subtle. | Neutral projects, light backgrounds, secondary sections. |

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `preset` | `'aurora' \| 'sunset' \| 'electric' \| 'monochrome'` | `'aurora'` | Preferred config method |
| `colors` | `string[]` | preset colors | 2–4 hex strings. Overrides preset colors. |
| `speed` | `number` | preset speed | 0.1 = very slow, 0.8 = max recommended |
| `intensity` | `number` | preset intensity | 0 = flat color, 1 = full contrast |
| `grain` | `number` | `0.04` | Grain overlay opacity 0–1. Adds texture. |
| `className` | `string` | — | Applied to wrapper div |

## Usage

```tsx
// In a Next.js App Router project (dynamic import required):
import dynamic from 'next/dynamic'
const FlowGradient = dynamic(
  () => import('@/lib/motion/flow-gradient').then(m => ({ default: m.FlowGradient })),
  { ssr: false }
)

// As a hero background:
<section style={{ position: 'relative', height: '100vh' }}>
  <FlowGradient preset="aurora" className="absolute inset-0" />
  <div style={{ position: 'relative', zIndex: 1 }}>
    {/* content */}
  </div>
</section>

// With project color tokens:
<FlowGradient colors={['#primary', '#accent', '#background']} speed={0.3} />
```

## Do not

- Set `speed` above `0.8` — looks chaotic and nauseating
- Combine with `HeroScene` gradient-orb preset — two competing gradient systems
- Pass more than 4 colors — the shader uses exactly 4 (wraps if fewer provided)
- Use on light backgrounds without adjusting `intensity` (defaults are tuned for dark)
- Hardcode colors outside the project's DESIGN.md palette

## Dependencies

- `@react-three/fiber`
- `three`
- No additional deps beyond what ships with dazineui

## SSR

Requires `ssr: false` dynamic import in Next.js. The Canvas element cannot render server-side.
