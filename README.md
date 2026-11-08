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

## Toolkit

The toolkit shown on the portfolio is sourced from the five featured repositories: Gravity, Cathedral, Flux Agent, EDITH X1 and D3X8. The portfolio repository itself is intentionally excluded from this project index.

| Area | Technologies |
| --- | --- |
| Languages and systems | Rust, Python, TypeScript, C, C++, x86_64 Assembly, Lua |
| Application and UI | React, TanStack Start, Vite, Tauri v2, Harp UI |
| AI and developer tools | Groq, Gemini, Cerebras, OpenRouter, FastEmbed, Playwright, Rich |
| Data and backends | Supabase, SQLite, server-sent events, PTY |
| Runtime and systems | Bubblewrap, Linux namespaces, cgroups v2, Limine, mlibc, BusyBox, ACPI, SMP, TCP/IP, FAT32, Intel e1000 |
| Engineering and delivery | Cargo, CMake, Make, GitHub Actions, Docker, Vercel, GitHub CLI |

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

## Sectorx83 community

The private member network is available at [sectorx83.vercel.app/sectorx83](https://sectorx83.vercel.app/sectorx83). It runs as a separate application route inside this Vercel project and uses its own Supabase backend, separate from EDITH X1. See [SECTORX83_SETUP.md](./SECTORX83_SETUP.md) for database migrations, authentication, administrator setup and security checks.
