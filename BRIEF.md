dazineui — Motion Layer for AI-Assisted Web Development
Complete Project Documentation

Table of Contents

BRIEF.md:
The Problem
The Solution
How It Works
Who It's For
What It Is (and Isn't)
The Technical Stack
The Primitives
The Repository Structure
The CLAUDE.md System
The MANIFEST System
DESIGN.md Interoperability
Legal and Licensing
Build Order and Approach

DOCS.md:
Working with Claude Code
Glossary of Terms
Learning Path Reference


1. The Problem
AI coding assistants — Claude Code, Cursor, GitHub Copilot, Lovable, Bolt, v0 — have become extraordinary at writing functional code. They can scaffold full applications, wire up APIs, handle authentication, and build complete user interfaces from natural language prompts. But there is one specific area where they consistently fail: producing websites that look designed rather than generated.
When a developer asks an AI to "build a landing page," the output almost always exhibits the same characteristic pattern. A solid background color or a basic linear gradient. A centered headline in a system font. A few cards with hover:scale-105. A motion.div with a fade-in transition. A call-to-action button with rounded corners and a subtle shadow. It works. It functions. And it looks unmistakably like every other AI-generated website. Designers and developers have started calling this aesthetic "AI slop" — the visual signature of code that was generated rather than crafted.
The problem becomes especially acute when the developer wants something more ambitious. Ask the AI to recreate Stripe's flowing gradient mesh, or Linear's scroll-pinned 3D scene, or the kind of cinematic Three.js work seen on award-winning portfolios. The AI will try. It will fail. It will produce a <canvas> element with broken shader math, a Three.js scene with default lighting that looks gray and lifeless, or a scroll handler that desyncs after the first interaction. The developer re-prompts. The AI tries again, often worse. After three or four iterations, the developer gives up and either ships something they're embarrassed by or hand-writes the animation themselves.
There are three root causes for this failure mode.
The first is statistical averaging. Large language models predict tokens based on what they've seen most frequently in training data. The vast majority of "make a landing page" code on the internet is mediocre. Tutorials, Stack Overflow snippets, generic component libraries. So when the AI predicts the most likely code, it predicts mediocrity. The exceptional code — the kind shipped by Stripe, Linear, Vercel, Apple — is rare in the training distribution and gets averaged out.
The second is spatial and mathematical weakness. Three.js and shader programming require thinking in three-dimensional space, working with vectors, matrices, and parametric equations. LLMs are notoriously weak at this. Ask one to write a custom vertex shader that displaces geometry along a noise field, and the math will be subtly wrong in ways that crash the render or produce visual garbage. The model knows the shape of shader code but not the correctness of the math.
The third is the context vacuum. Every prompt starts from a blank canvas. The AI has no project context, no reference implementations, no examples of what "good" means in this codebase. It generates in isolation, every single time. A senior developer working in a familiar codebase produces better work than the same developer in an unfamiliar one — context is leverage. AI assistants generally don't have that leverage.
This project addresses all three causes simultaneously.

2. The Solution
The solution is not to make the AI smarter. That's a problem for Anthropic and OpenAI to solve over the next several years. The solution is to give the AI a curated reference library and strict instructions about how to use it.
The tool ships three things into any project that installs it:
A library of pre-built motion and 3D primitives. Each primitive is a hand-crafted, mathematically-correct, performance-tuned component that produces a specific high-end visual effect. Animated gradient meshes, full-viewport 3D hero scenes, scroll-pinned animations, magnetic cursors, kinetic typography, interactive particle fields. Each primitive is built once, by a human (or with significant human curation), and then becomes reusable forever.
A set of AI instruction files. Most importantly CLAUDE.md, mirrored to AGENTS.md for other coding agents and .cursor/rules/ for Cursor users. These files contain hard rules about what the AI is and isn't allowed to do in projects using this tool. They forbid the AI from writing CSS keyframes for hero elements. They forbid custom GLSL unless explicitly requested. They establish a decision flow: when the user asks for visual interest, the AI scans the primitive library and matches their request to an existing component, then configures it via typed props instead of generating new code.
A token interoperability layer. The tool reads the user's existing DESIGN.md file if one is present in the project. DESIGN.md is an emerging open format — popularized by Google Stitch and now supported by libraries like freedesignmd, designmd.app, and getdesign.md — that defines a project's color tokens, typography, spacing scale, and component patterns in a single markdown file. AI assistants read it and apply consistent styling. This tool plugs into that ecosystem rather than competing with it. The motion primitives accept design tokens as props, so a FlowGradient in a project with a warm cream palette renders in warm cream tones, while the same primitive in a project with a cool indigo palette renders in cool indigo tones. The motion automatically inherits the design system.
The result is a workflow shift. Without this tool installed, the AI sees "add a hero section" and writes a <div> with a Tailwind gradient and a motion.div fade-in. With this tool installed, the AI reads its instructions, identifies that the user wants visual impact, scans the available primitives, recognizes that HeroScene is the appropriate match, configures it with the project's color tokens, and produces a full-viewport 3D scene with cinematic lighting and post-processing. Same prompt. Completely different output.
The aesthetic floor moves from "generic Bootstrap site" to "senior Three.js developer's portfolio." The ceiling moves from "what an LLM can guess" to "what a human curator has hand-crafted." And because the primitives are designed to be composed, recombined, and extended, the AI can also produce new effects that take stylistic inspiration from the existing library — preserving the senior-developer fingerprint even when generating beyond the explicit primitive set.

3. How It Works
The end-user flow is intentionally minimal.
A developer is working in their IDE — Visual Studio Code with the Claude Code extension, Cursor, Windsurf, or any other tool that reads markdown configuration files. They have a project, either new or existing. It doesn't matter what stage it's in. They run npx dazineui setup once. That's the entire install step. The command writes the AI skill layer to ~/.claude/skills/dazineui/ (for Claude Code and Claude Code-compatible agents) and ~/.cursor/skills/dazineui/ (for Cursor). It stores the six primitives, their MANIFESTs, and the global instruction rules globally on the machine — not inside any specific project. From that point forward, every IDE session in every project automatically has dazineui in context. No per-project setup. No package.json entry. No import statements. Just: install once, works everywhere.
From that point forward, the developer interacts with their AI assistant normally. They don't have to remember the tool exists. They just prompt: "Add a hero section that feels like a modern AI startup landing page."
Internally, the AI assistant — let's say Claude Code — reads CLAUDE.md automatically because that's how Claude Code's context loading works. The file tells Claude that this project uses a motion library, that there are hard rules about what not to generate, and that the decision flow for visual requests is to scan lib/motion/*/MANIFEST.md files for matches before generating any new code.
Claude opens each MANIFEST.md and reads the descriptors. Each manifest describes what the primitive looks like, what user prompts it maps to, what props it accepts, and what visual references it draws from. Claude identifies HeroScene as the match for "modern AI startup landing page" — the manifest explicitly mentions that pattern. Claude imports HeroScene from lib/motion/hero-scene/. It checks for a DESIGN.md in the project root. If found, it pulls the color tokens and passes them as props. If not, it uses the safe defaults defined in lib/tokens/defaults.ts. It picks the gradient-orb preset because that's the closest match to the "AI startup" descriptor in the manifest. It writes the component invocation into the user's app/page.tsx file.
The result, rendered in the browser, is a full-viewport scene with a slowly rotating 3D orb, cinematic three-point lighting, a subtle bloom post-processing effect, a vignette, and ACES tonemapping. The orb's color matches the project's existing palette. The animation timing matches the project's motion tokens. The whole thing took the user one prompt and looks like it took a senior developer a full day.
If the user follows up with "Make it feel more energetic", Claude reads the manifest again, sees that the electric preset is described as faster and higher-contrast, and adjusts the prop. One word from the user, one prop change from Claude.
If the user prompts something the library doesn't directly cover — "Make the orb shatter into glass shards when you click" — Claude doesn't have a primitive for that. But it has HeroScene as a reference for camera, lighting, and post-processing setup. It has lib/shaders/ for noise functions and easing utilities. It writes new code, but anchored to the patterns it sees in the existing primitives. The output isn't a generic Three.js demo; it's a glass-shatter effect built in the same style as the rest of the library. The senior-developer fingerprint persists even when the AI is generating outside the explicit library.
The crucial thing to understand: nothing about this process is magical. Claude isn't trained on your primitives, doesn't remember them between sessions, doesn't actually "learn" anything in the machine-learning sense. What's happening is in-context reference matching. Every time Claude works in this project, it re-reads the files. The CLAUDE.md instructs it on rules. The MANIFEST files tell it what's available. The primitive code itself acts as a style guide. Each session is fresh, but the references in the repo are persistent.
This makes the tool fundamentally different from a no-code generator like Lovable or Bolt. Those tools try to produce a finished site from a single prompt by generating everything in one shot. This tool doesn't try to one-shot anything. It augments the iterative, prompt-by-prompt workflow that developers already use with AI assistants in their IDE. It's a quality multiplier on every individual interaction, not a replacement for the workflow.

4. Who It's For
The primary user is a developer who uses AI coding assistants heavily and cares about how their work looks. More specifically: someone who admires the aesthetic of sites like Stripe, Linear, Vercel, Anthropic's marketing pages, Apple's product pages, and the curated work showcased on Awwwards, 21st.dev, and Bruno Simon's portfolio. Someone who has tried to get their AI to produce that kind of output and given up. Someone who can code but doesn't consider themselves a designer.
Hackathon developers are a particularly natural fit. At a hackathon, you have 24 to 48 hours to ship something demo-worthy. The technical work usually dominates the available time, and the landing page or marketing site for the project gets thrown together in the last two hours. With current AI tools, those two hours produce slop, and the demo suffers visually. With this tool installed, those two hours produce something that looks polished, which materially affects how judges and audiences receive the work.
Indie hackers and solo developers shipping side projects are another core user. They don't have a designer. They don't have time to spend a week perfecting a marketing site. They want to prompt their AI and get something that doesn't embarrass them.
Junior developers learning modern web design benefit too. The tool serves as a reference library — they can read the primitive code, see how cinematic R3F scenes are actually structured, learn from it. The MANIFEST.md files double as design education, explaining what makes an effect work and what to pair it with.
The secondary user, intentionally not optimized for, is the no-code or low-code user looking to produce a website without writing any code. They're already served by Lovable, Bolt, v0, and similar tools. This project doesn't compete for that audience. It's specifically for people who are in their IDE, using an AI assistant, writing real code, and want that workflow to produce better visual output.
The person this tool is built for, first and foremost, is me — the original author. The author is exactly the kind of developer described above: hackathon-frequent, AI-heavy, taste-aware but not design-trained, frustrated with the current state of AI-generated web design. The project is being built to solve a personal problem first. The fact that other developers face the same problem is what makes it potentially useful as an open-source tool, but the design decisions are not optimized for a hypothetical broad audience. They're optimized for the author's own workflow. This is intentional. Tools built to scratch the author's own itch tend to be more focused, more opinionated, and more genuinely useful than tools designed by committee for a vague target market.

5. What It Is (and Isn't)
Clarity about scope is critical for a project like this, because the surrounding ecosystem is crowded and it's easy to drift into someone else's lane.
It is a globally-installed motion and 3D primitive library plus AI instruction layer — installed once per machine, active in every project automatically.
It is not a no-code site generator. It produces no output without a developer in the loop using an AI assistant to invoke it. There is no "describe a site and get a site" mode. Tools like Lovable, Bolt, v0, and Replit Agent occupy that space and they're well-funded incumbents. Competing with them would be a losing battle and isn't the goal.
It is a complement to the DESIGN.md ecosystem.
It is not another DESIGN.md library. The space of "drop a markdown file in your project root so your AI applies consistent styling" is already saturated. As of mid-2026, freedesignmd hosts over 120 systems, designmd.app hosts 454, getdesign.md hosts 69 brand-inspired files, and VoltAgent's awesome-design-md GitHub repository is a community standard. Google introduced DESIGN.md as an open format. Building another one would be redundant. Instead, this tool plugs into whichever DESIGN.md the user already has — reading their color tokens, typography, and spacing — and adds the motion layer that all of those DESIGN.md libraries explicitly don't yet cover.
It is focused on motion, animation, transitions, and 3D.
It is not focused on static 2D component styling. Buttons, cards, forms, navigation, dropdowns, modals — those are well-covered by shadcn/ui, Aceternity, Magic UI, and the broader ecosystem of React component libraries. This tool doesn't try to be a general-purpose UI library. It's specifically the motion and 3D layer.
It is free, open-source, MIT licensed.
It is not monetized in v1 or v2 or v3. There are no plans for a premium tier, a paid registry, a hosted service, or any other revenue model in the foreseeable future. The tool exists as a public good. If it ever generates revenue, it would be through optional sponsorships or eventual paid extensions years from now — but designing for that now would corrupt the priorities.
It is for developers working in their IDE with AI assistants.
It is not for use directly inside Claude.ai's chat interface, Cursor's composer without a real project, or any environment that doesn't have access to a filesystem. The primitives are real React components that need to be installed and rendered. They don't work as in-chat artifacts.
It is opinionated about aesthetic defaults — dark themes, premium-feeling type, cinematic motion timing.
It is not style-neutral or universally applicable. The tool optimizes for the aesthetic family of modern SaaS, developer tools, AI products, and creative portfolios. It doesn't try to be appropriate for, say, a children's educational app, a government website, or a hospital's patient portal. Those projects need different tools.

6. The Technical Stack
The stack is chosen to maximize alignment with what AI coding assistants generate well, what the target users already use, and what makes the motion-and-3D goals achievable.
Next.js 15 with the App Router is the foundation. Next.js is the most common React framework in 2026, and AI assistants default to it when asked to build a website. The App Router is the current standard pattern. Server components, client components, route handlers, and metadata APIs all behave the way AI assistants expect them to. Using anything else — Remix, Astro, plain Vite + React — would mean fighting AI tooling rather than leveraging it.
React Three Fiber (R3F) is the rendering layer for all 3D primitives. R3F is a React renderer for Three.js, meaning developers write 3D scenes as declarative React components rather than imperative Three.js code. A <mesh> becomes a new THREE.Mesh(). A <directionalLight> becomes a new THREE.DirectionalLight(). This declarative approach has two huge advantages for this project: first, it's far easier for AI assistants to read and modify than raw Three.js, and second, it integrates naturally with React's state management and component composition. The companion library @react-three/drei provides high-level helpers — OrbitControls, Environment, Float, MeshTransmissionMaterial — that handle complex setups in one line. @react-three/postprocessing provides bloom, chromatic aberration, depth-of-field, and other effects that separate "WebGL demo" from "production site."
TypeScript is used throughout, and not as an afterthought. The type definitions of each primitive — its props, its presets, its allowed values — function as a contract that constrains what the AI is allowed to do. When FlowGradient's preset prop is typed as 'aurora' | 'sunset' | 'electric' | 'monochrome', the AI cannot pass 'stripe' or 'random' because TypeScript will reject it. This turns the type system into a guardrail. Without TypeScript, the AI would freely invent props that don't exist and pass values that aren't valid. With TypeScript, the AI is forced into the contract.
Tailwind CSS handles utility-level styling for the non-3D parts of the system. Tailwind is the dominant utility framework in modern React development, and AI assistants are extremely fluent in it. The project does not use plain CSS, CSS Modules, or styled-components — all of those are more verbose, less AI-friendly, and less aligned with what users expect.
Motion (the library formerly known as Framer Motion) handles 2D DOM animations — page transitions, element reveals, layout animations. It's the standard React animation library and complements R3F's 3D motion.
Lenis is the smooth-scroll library. It replaces the browser's default scroll behavior with a smoother, easing-based version. This is essential for scroll-pinned animations like ScrollScene to feel premium rather than janky. Lenis is small, performant, and the de facto standard in award-winning sites built in 2024-2026.
Geist and Inter are the default fonts. Geist is open-source, free for commercial use, and designed by Vercel specifically to look premium. It carries the visual weight of expensive grotesque sans-serifs like Söhne or GT America without the licensing cost. Inter is the most-used premium-feeling free font on the web. Geist Mono and JetBrains Mono cover monospace needs. No proprietary fonts are ever bundled or recommended as defaults.
The full dependency list, kept intentionally small:
next, react, react-dom
typescript, @types/react, @types/node
tailwindcss, postcss, autoprefixer
@react-three/fiber, @react-three/drei, @react-three/postprocessing
three, @types/three
motion
lenis
geist
clsx, tailwind-merge
Nothing else. No state management library, no form library, no auth, no database, no UI component framework. The tool is scoped to motion and 3D; everything else is the user's responsibility, served by their existing stack.

7. The Primitives
Six primitives ship in version 1. Each one is intentionally chosen to cover a specific category of high-impact visual effect that AI assistants currently fail at producing well.
FlowGradient. An animated, shader-based gradient mesh that fills a container with flowing, slowly-shifting color. This is the effect popularized by Stripe's homepage circa 2020 and now seen on nearly every premium SaaS landing page. Implementation: a fullscreen quad rendered with a fragment shader that combines multiple octaves of simplex noise with smoothly interpolated colors. Performance is excellent because it's pixel-shader-only — no geometry, no physics, no per-frame React work. Four presets ship: aurora (cool blues, purples, greens), sunset (warm oranges, pinks, magentas), electric (high-contrast neons), and monochrome (single-hue tonal variations). Props allow speed adjustment, color override, and intensity control. This is the highest-leverage primitive in the library — most projects can use it immediately, and the visual upgrade is dramatic.
HeroScene. A full-viewport React Three Fiber scene with a central 3D element, cinematic camera positioning, three-point lighting, environment-based reflections, and post-processing (bloom, tonemapping, vignette) baked in. The 3D element varies by preset. The gradient-orb preset renders a sphere with a custom shader that creates an iridescent, color-shifting surface — think Anthropic's marketing pages or OpenAI's hero sections. The wireframe-object preset renders a low-poly form (icosahedron, torus knot) with a wireframe overlay and subtle pulse animation. The particle-cloud preset renders thousands of points that drift and react to mouse position. Each preset has its camera, lighting, and post-processing pre-tuned. The user gets a cinematic 3D hero with zero configuration.
ScrollScene. A React Three Fiber scene that is "pinned" — meaning it stays fixed on screen while the user scrolls — and transforms based on scroll progress. The user scrolls down; the 3D object rotates, scales, changes color, or morphs. This is the effect used by Apple's product pages, by AI startup explainer scrolls, and by countless premium portfolios. The primitive accepts a transform configuration that maps scroll progress (0 to 1) to property values (rotation, scale, position, color). The pin behavior is handled by Lenis and an intersection observer. Defaults are sensible enough that a one-line invocation produces a working scroll story.
MagneticCursor. A DOM-based effect, not 3D. It replaces the browser cursor with a custom one (typically a small circle or dot) and applies magnetic attraction to tagged elements — buttons, links, interactive cards. When the user moves their cursor near a tagged element, the cursor (or the element, depending on configuration) is pulled toward it with a spring physics curve. This effect, when subtle, makes the entire site feel more responsive and considered. Heavy-handed implementations look obnoxious; this primitive is tuned to be felt-but-not-noticed.
InteractiveText. A wrapper for headlines and prominent text that applies one of several entrance and interaction effects. The split-reveal effect splits text into characters and reveals them sequentially on scroll-into-view. The hover-distortion effect applies subtle text shadow and transform animations on hover, creating a "liquid" feel. The scroll-link effect ties text properties (size, weight, color) to scroll position for cinematic title sequences. The primitive integrates with the project's font tokens, so it automatically uses Geist or whatever the DESIGN.md specifies.
ParticleField. An interactive background field of particles — points, dots, or small geometric shapes — that respond to mouse movement. Particles drift, repel from the cursor, and form subtle patterns. Implementation uses R3F for performance (instanced meshes or Points) but the visual register is more "ambient texture" than "centerpiece 3D element." Useful as a backdrop for content-heavy sections where FlowGradient would be too dominant.
Each primitive lives in its own folder under lib/motion/. Each folder contains the component code, its TypeScript types, its preset definitions, a preview image, and its MANIFEST.md. The structure is identical across all primitives, making the library easy to navigate and extend.
When the project grows beyond v1, additional primitives will be added based on real usage gaps — places where AI assistants had to generate from scratch because no primitive fit. Likely candidates for v2 and beyond: bento grid layouts with built-in motion, marquee/ticker strips, image distortion effects, animated SVG illustrations, fluid simulation backgrounds, page transition primitives. But none of those are in v1 scope. Six primitives, each polished to ship-quality, is the v1 bar.

8. The Repository Structure
The repository is organized into two parts: the source tree (this repo, on GitHub) and the installed global layout (what npx dazineui setup writes to the user's machine).

Source repository:
/
├── primitives/
│   ├── flow-gradient/
│   │   ├── source.tsx
│   │   ├── shader.ts
│   │   ├── presets.ts
│   │   ├── types.ts
│   │   ├── deps.json
│   │   ├── PREVIEW.png
│   │   └── MANIFEST.md
│   ├── hero-scene/
│   │   ├── source.tsx
│   │   ├── scenes/
│   │   │   ├── gradient-orb.tsx
│   │   │   ├── wireframe-object.tsx
│   │   │   └── particle-cloud.tsx
│   │   ├── presets.ts
│   │   ├── types.ts
│   │   ├── deps.json
│   │   ├── PREVIEW.png
│   │   └── MANIFEST.md
│   ├── scroll-scene/
│   ├── magnetic-cursor/
│   ├── interactive-text/
│   └── particle-field/
├── shaders/
│   ├── noise.ts
│   ├── easing.ts
│   └── color.ts
├── hooks/
│   ├── use-mouse.ts
│   ├── use-scroll-progress.ts
│   ├── use-reduced-motion.ts
│   └── use-design-tokens.ts
├── tokens/
│   ├── parser.ts
│   ├── defaults.ts
│   └── types.ts
├── bin/
│   ├── setup              ← npx dazineui setup entry point
│   └── inject             ← copies a primitive + installs deps into any project
├── SKILL.md               ← the global AI instruction layer (what AI assistants read)
├── MANIFEST.md            ← catalog of all available primitives
├── CLAUDE.md              ← development rules for this repo itself
├── AGENTS.md
├── .cursor/rules/motion-rules.mdc
├── README.md
├── LICENSE
├── package.json
└── BRIEF.md

After npx dazineui setup, the following is written globally on the user's machine:

~/.claude/skills/dazineui/      ← Claude Code reads this automatically in every project
  SKILL.md                      ← global AI instruction layer
  MANIFEST.md                   ← primitive catalog
  primitives/                   ← all six primitive source files + MANIFESTs
  shaders/                      ← shared GLSL utilities
  hooks/                        ← shared React hooks
  tokens/                       ← DESIGN.md parser and defaults
  bin/inject                    ← copies a primitive into the current project on demand

~/.cursor/skills/dazineui/      ← Cursor reads this automatically in every project
  (same structure)

The app/ directory contains Next.js pages. The root page.tsx is the project's home page and also functions as a live demo of every primitive composed together — a one-page showcase that doubles as documentation. Each primitive has a dedicated demo page under app/primitives/[slug]/ showing all its presets and configurations.
The primitives/ directory is the heart of the library. Each primitive gets its own folder following the identical structure: an index.tsx exporting the React component, a presets.ts defining named configurations, a types.ts with the TypeScript prop definitions, a PREVIEW.png showing what the rendered output looks like, and a MANIFEST.md written for AI assistants to read.
The lib/shaders/ directory holds reusable GLSL utilities — noise functions, easing curves, color manipulation — that primitives can import. This keeps the actual primitive shaders focused on composition rather than reimplementing foundational math.
The lib/hooks/ directory holds React hooks shared across primitives. Mouse tracking, scroll progress, reduced-motion detection, design-token reading. By centralizing these, the primitives stay clean and consistent.
The lib/tokens/ directory handles the DESIGN.md interoperability layer. The parser.ts reads any DESIGN.md in the project root and extracts color, font, spacing, and motion tokens. The defaults.ts provides safe fallback values when no DESIGN.md is present. The types.ts defines the canonical token shape that primitives consume.
The root-level configuration files — CLAUDE.md, AGENTS.md, .cursor/rules/motion-rules.mdc — are the AI instruction layer. They contain the same content in three slightly different formats because different AI tools read different files. Keeping them in sync is a maintenance burden, but it's necessary for cross-tool compatibility.
BRIEF.md is a project-purpose document, kept in the repo root. It explains the project's intent, scope, and constraints. When starting a new Claude Code session, this file is the first thing Claude reads, ensuring context is consistent across sessions.

9. The CLAUDE.md System
The CLAUDE.md file is the most important asset in the entire project. More important than any individual primitive. Without a good CLAUDE.md, the primitives are just a library — useful, but not transformative. With a good CLAUDE.md, the primitives become a system that fundamentally changes how AI assistants produce visual code.
The file has five major sections.
Section one: Hard rules. These are non-negotiable constraints that override any other instinct the AI might have. The rules forbid certain anti-patterns explicitly. No CSS keyframes for hero or feature elements — those must use primitives. No custom GLSL unless the user explicitly asks. No MeshStandardMaterial with default settings — it must be tuned, or MeshPhysicalMaterial should be preferred. No proprietary font names like Söhne, GT America, or Founders Grotesk. No Arial, Helvetica, Times New Roman, or Georgia as display fonts. Always apply post-processing to R3F scenes. Always respect prefers-reduced-motion. These rules are stated in absolute terms because softening them ("try to avoid...") leads to inconsistent compliance.
Section two: Decision flow. This describes the step-by-step process the AI should follow when the user makes a request involving visual design. First, check for a DESIGN.md in the project root and parse its tokens. Second, read MANIFEST.md from ~/.claude/skills/dazineui/ and scan each primitive's individual MANIFEST.md for descriptors. Third, if the user provided a screenshot, describe what's visible in the image (colors, motion type, layout structure) and match the description to MANIFEST descriptors. Fourth, identify the closest-matching primitive (or combination of primitives). Fifth, run the inject script to copy the primitive source into the project and install its npm dependencies. Sixth, configure the component via preset prop or named props, passing DESIGN.md tokens where applicable. Never reimplement a primitive's functionality inline — if it exists in the library, inject and use it.
Section three: Aesthetic defaults. When the AI must make decisions that aren't covered by the user's DESIGN.md or by a specific primitive's preset, fall back to these defaults. Dark theme base is #0a0a0a, not pure black. Hero timing is 600 to 900 milliseconds. Micro-interaction timing is 200 to 300 milliseconds. Easing is cubic-bezier(0.32, 0.72, 0, 1) — never the browser default. Spacing scale uses a 4-pixel base unit. Border radius tiers are 8px, 12px, 16px, and 24px. Fonts default to Geist Sans for display and Geist Mono for monospace, with Inter as fallback. These defaults encode taste decisions a senior designer would make automatically.
Section four: Vague prompt routing. Users frequently say things like "make it pop," "feel premium," "more interesting," or "more dynamic." These are exactly the prompts where AI assistants produce the most slop, because there's no specific request to match. This section gives explicit routing for common vague phrases. "Make it pop" or "feel premium" routes to FlowGradient background plus InteractiveText for headlines. "Add animation here" routes by context — text-heavy sections get InteractiveText, card grids get MagneticCursor plus stagger reveals, hero sections get HeroScene. "Cool background" routes to FlowGradient with a preset matching the project palette. "More dynamic" routes to ScrollScene if there's room to scroll, otherwise to hover-based motion on existing elements. These routings prevent the AI from defaulting to generic CSS animations when faced with ambiguity.
Section five: Anti-patterns and explicit prohibitions. A list of things the AI must never produce in this project. Default motion.div fade-ins everywhere. hover:scale-105 as a substitute for real motion. transition: all on CSS. Generic spinners or pulse animations as filler "movement." Plain spheres or cubes as 3D elements (always use the styled primitives). Default Three.js lighting (the gray-on-gray look that signals "tutorial code"). System fonts as primary display fonts. These are the AI's reflexive bad habits, called out explicitly so they get suppressed.
The CLAUDE.md is also mirrored to AGENTS.md for Codex and other agent frameworks, and to .cursor/rules/motion-rules.mdc for Cursor users. The three files contain functionally identical content, formatted to each tool's conventions. Keeping them in sync is a chore, but it's necessary because different developers use different tools, and the project should work for all of them.
Over time, the CLAUDE.md evolves based on observation. Every time the AI does something wrong in a real-world session — generates slop, ignores a primitive, hallucinates a prop — that's a signal to add a new rule, clarify an existing one, or improve a routing. The CLAUDE.md is a living document. It is, in a real sense, the actual product. The primitives are infrastructure; the CLAUDE.md is the intelligence layer on top.

10. The MANIFEST System
Each primitive's MANIFEST.md is a structured document designed for AI consumption. It is not user-facing documentation — that's what the README and demo pages are for. It is a precise, AI-readable specification of what the primitive does, when to use it, and how to configure it.
Every MANIFEST follows the same template.
A "What it looks like" section describes the visual appearance and behavior of the primitive in concrete terms. Not just "an animated gradient" but "Animated multi-color gradient mesh background. Soft, flowing, shader-driven. Slow color transitions. Premium SaaS aesthetic. Fills the entire container." Specificity matters — vague descriptions lead to vague matching.
A "When to use" section lists the user prompts and contexts that should trigger this primitive. Phrases like "hero section background," "section divider needing visual interest," "make this feel premium," and the visual descriptors users might offer — "flowing colors," "liquid background," "aurora," "mesh gradient." This is what the AI matches against when deciding which primitive to reach for.
A "Common references" section lists publicly observable design patterns the primitive draws from. "Stripe homepage, Linear hero, Vercel gradient, modern AI startup landing pages." This serves two purposes: it gives the AI a way to match screenshot-based requests ("recreate Stripe's gradient" → FlowGradient), and it gives users a way to communicate intent ("I want something like Linear's hero" → FlowGradient with aurora preset).
A "Presets" section enumerates the named preset configurations. Each preset has a short description of its visual character. aurora is cool and slow. electric is high-contrast and fast. The presets are the AI's preferred configuration mechanism — rather than tuning twenty individual props, the AI selects a preset that captures the desired feel.
A "Props" section lists the TypeScript-defined prop names, their types, and their defaults. This is technically redundant with the types.ts file, but having it in the MANIFEST means the AI doesn't have to context-switch between files to know what's possible.
A "Do not" section lists explicit prohibitions specific to this primitive. For FlowGradient: don't pass hex codes outside the project's DESIGN.md palette, don't set speed above 0.8 (looks chaotic), don't combine with HeroScene's gradient-orb preset (visually clashes). These prohibitions encode design judgment that the AI wouldn't otherwise know.
The MANIFEST files are written in deliberate, slightly formal prose because that's what AI assistants parse most reliably. They avoid jokes, irony, and ambiguity. Every line is meant to be read literally and acted upon.
One important design choice: the MANIFESTs do not include code examples. The AI can read the actual primitive code in index.tsx if it needs implementation details. The MANIFEST is purely descriptive and prescriptive — what the primitive does, when to use it, how to configure it. Mixing code examples into the MANIFEST would bloat it and create maintenance overhead when the underlying code changes.

11. DESIGN.md Interoperability
The DESIGN.md ecosystem is a critical part of how this tool achieves its full effect. A motion primitive that doesn't match the rest of the site's design isn't helpful — it's a foreign element. By reading the user's existing DESIGN.md, the primitives inherit the site's visual language and feel native rather than imposed.
The interop layer lives in lib/tokens/ and works as follows.
The parser.ts reads a DESIGN.md file from the project root, if one exists. It supports the major formats currently in use — the structure popularized by freedesignmd, the YAML-frontmatter style used by designmd.app, the brand-token format from getdesign.md, and the more freeform style of community-contributed designs. The parser extracts a canonical token object with consistent shape: a colors object with primary, accent, background, foreground, and semantic colors; a fonts object with display, body, and mono families; a spacing scale; a motion configuration with timing and easing curves; and a radius scale.
If no DESIGN.md is found, defaults.ts provides safe, premium-feeling fallback values. Dark background, Geist Sans display font, Geist Mono code font, neutral palette with a subtle indigo accent, generous spacing, sane motion timing. The defaults are chosen so that even users who never set up a DESIGN.md get good-looking output.
The use-design-tokens.ts hook in lib/hooks/ exposes the parsed tokens to React components. Every primitive imports this hook and reads only the tokens it cares about. FlowGradient reads colors.gradient (or falls back to colors.primary, accent, and background). HeroScene reads colors.accent, motion.timing.hero, and motion.easing.cinematic. InteractiveText reads fonts.display, motion.timing.micro, and motion.easing.smooth.
The token system is intentionally permissive. If a token is missing, the primitive uses its preset default. If a token is malformed, it falls back silently rather than crashing. The principle is graceful degradation — the user should never have to debug their DESIGN.md to get primitives working.
There's an explicit decision to not generate DESIGN.md files from scratch. Tools like Banani AI and Google Stitch already do this. This tool's role is to consume DESIGN.md, not produce it. If a user wants a DESIGN.md, they're directed to the existing ecosystem.
The README will include a "Recommended companions" section pointing to freedesignmd, designmd.app, and the awesome-design-md GitHub repository. The framing is collaborative: pick a design system from those libraries, drop the file in your project, then install this tool for the motion layer. The two pieces compose into a complete AI-friendly visual system.

12. Legal and Licensing
The project is released under the MIT License. MIT is the standard for open-source developer tools — permissive, well-understood, no restrictions on commercial use, and broadly compatible with other licenses. The full license text lives in the LICENSE file in the repository root.
Beyond the license itself, several legal and ethical considerations shape how the project is built.
All implementations are original. No code is copied from Stripe, Linear, Vercel, Apple, or any other commercial source. The techniques themselves — animated gradient meshes, scroll-pinned 3D scenes, magnetic cursors — are not copyrightable. They are commonly-used patterns in modern web design. The specific implementations of those techniques are copyrightable, and the project respects that line. When a primitive is inspired by an effect seen on a commercial site, the implementation is rebuilt from scratch based on observable behavior, not copied from the source.
Preset names are technique-based, not brand-based. Presets are called aurora, electric, sunset, monochrome — names that describe the visual character. Presets are never named after companies (no stripe, no linear, no vercel). This is partly a legal safeguard against trademark issues and partly a practical decision: technique-based names are more durable and more useful as the library expands.
MANIFEST.md files reference brands only as visual descriptors, never as instructions to copy. A manifest may say "common pattern on premium SaaS sites like Stripe and Linear" because that's a factual visual reference. A manifest will never say "copy Stripe's gradient" or "recreate Linear's hero." The framing is always observational, not instructional.
Only free, open-source fonts are bundled or recommended as defaults. Geist (Vercel, free), Inter (Rasmus Andersson, free under SIL OFL), Geist Mono (Vercel, free), JetBrains Mono (JetBrains, free under SIL OFL). No proprietary fonts are ever included in the package, referenced in primitive code, or recommended in CLAUDE.md. The CLAUDE.md explicitly forbids Claude from hardcoding proprietary font names like Söhne, GT America, Founders Grotesk, NB International, or SF Pro outside Apple platforms. If a user wants to use a proprietary font they've licensed, they can specify it in their DESIGN.md and the primitives will use it — but the responsibility for licensing rests with the user.
Office-style fonts (Arial, Times New Roman, Calibri, Helvetica, Georgia) are forbidden as display fonts in the CLAUDE.md rules. This isn't a legal concern — those fonts are usually fine to use — but a quality concern. Those fonts signal "unfinished" and undermine the premium aesthetic the tool is built to enable.
Attribution to open-source sources is generous. When a primitive or technique is adapted from MIT-licensed work — for example, a noise function from lygia (the GLSL shader library), an easing curve from a Codrops tutorial, a camera setup from a drei example — the source file includes a comment citing the original, and the README's Acknowledgments section lists the contribution. Stripping attribution from open-source code is both legally questionable and a fast way to burn community goodwill.
Trademark disclaimer in the README states clearly that any brand names referenced (Stripe, Linear, Vercel, etc.) are mentioned as visual descriptors only, that the project is not affiliated with or endorsed by those companies, and that all trademarks belong to their respective owners. This is standard language for any project that references brand aesthetics, modeled on the disclaimer used by the awesome-claude-design repository.
The project is not commercial. There are no plans to charge for any part of it. If financial sustainability becomes necessary in the future, the most likely path is voluntary GitHub Sponsors or eventual paid extensions — but the core library remains free forever. This non-commercial posture provides additional legal protection: visual inspiration from commercial brands is more defensible when there's no commercial intent behind the derivative work.

