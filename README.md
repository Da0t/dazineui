# dazineui

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A global AI skill layer that makes your coding assistant produce premium motion and 3D UI — in any project, at any stage.

Install once. Works everywhere.

```bash
npx dazineui setup
```

That's it. After one command, every AI session in every project you work in automatically knows how to produce high-quality animated gradients, cinematic 3D hero scenes, scroll-pinned animations, magnetic cursors, and more — using curated, hand-crafted primitives instead of generating generic animation slop from scratch.

Inspired by how [gstack](https://github.com/garryslist/gstack) works. Install it globally like a tool, not a dependency.

## How it works

`npx dazineui setup` writes to `~/.claude/skills/dazineui/` and `~/.cursor/skills/dazineui/`. Claude Code and Cursor automatically read global skill directories in every project. No per-project configuration. No package.json entry. No import statements.

When you prompt your AI "add a hero section that feels like a modern AI startup," it reads the global skill layer, finds the matching primitive, copies it into your project, installs the required npm dependencies, and configures it with your existing design tokens.

## Primitives

Six ship in v1:

- **FlowGradient** — animated shader-based gradient mesh (à la Stripe, Linear)
- **HeroScene** — full-viewport R3F scene with cinematic lighting and post-processing
- **ScrollScene** — scroll-pinned 3D transformation sequence
- **MagneticCursor** — spring-physics cursor attraction on interactive elements
- **InteractiveText** — scroll-reveal and hover-distortion for headlines
- **ParticleField** — interactive ambient particle background

## Status

Early development. Core architecture and instruction-layer files are being established before primitives are implemented.

## License

MIT
