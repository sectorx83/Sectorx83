# sectorx83

**An independent digital practice exploring software, systems and immersive experiences.**

[Live portfolio](https://sectorx83.vercel.app) · [GitHub](https://github.com/sectorx83) · [All repositories](https://github.com/sectorx83?tab=repositories)

## Experience

The portfolio is designed as a motion-led digital environment rather than a static project list.

- Custom GLSL-shaded 3D core rendered with Three.js through React Three Fiber.
- Drei scene helpers, procedural orbital geometry, particles and depth.
- GSAP + ScrollTrigger for scroll choreography and project transitions.
- Lenis for smooth scrolling, with reduced-motion support.
- Framer Motion for interface transitions, loading and project reveals.
- TypeScript throughout the application.
- Vite for fast local development and production bundling.

## Technology

| Area | Tools |
| --- | --- |
| Language and shaders | TypeScript, GLSL |
| Build and framework ecosystem | Vite, React |
| Other framework experience | Next.js, Nuxt.js |
| Motion | GSAP, Framer Motion, Lenis |
| Real-time 3D | Three.js, React Three Fiber, Drei |
| 3D creation workflow | Blender |

Vite + React is the actual runtime/build stack for this portfolio. Next.js and Nuxt.js are listed as framework experience rather than being installed together. Blender is part of the 3D asset creation workflow.

## Featured work

| Project | Description |
| --- | --- |
| [Gravity](https://github.com/sectorx83/Gravity) | Adaptive computational runtime exploring safe live topology changes. |
| [Cathedral](https://github.com/sectorx83/Cathedral) | Reproducible computing laboratory for experiments and observability. |
| [Flux Agent](https://github.com/sectorx83/Flux-agent) | Local-first AI agent and automation CLI. |
| [EDITH X1](https://github.com/sectorx83/edithx1) | Multi-user AI assistant with chat and voice interaction. |
| [D3X8](https://github.com/sectorx83/D3X8) | Experimental x86_64 operating system. |

## Development

Requirements: Node.js 20.19+ or 22.12+.

Install dependencies with npm install, then start the local server with npm run dev.

Create a production build with npm run build. The generated output is in the dist directory.

## Accessibility and performance

- Respects prefers-reduced-motion.
- Uses responsive layouts and a reduced 3D canvas pixel ratio.
- The WebGL scene is decorative and does not block navigation or content.
- No remote video is required for the hero experience.