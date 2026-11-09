# Sectorx83® — Independent Digital Works

Sectorx83® is an independent software studio and engineering portfolio focused on systems software, developer infrastructure, computational runtimes, and applied AI. The site presents selected work, technical context, project status, and links to the source repositories.

The identity mark is **[sx⁸³]®**. The visual direction pairs editorial typography and a restrained forest / warm-stone palette with tactile project artwork and purposeful motion.

## Selected work

| Project | Focus | Current status |
| --- | --- | --- |
| [D3X8](https://github.com/sectorx83/D3X8) | Experimental 64-bit x86_64 operating system and Harp desktop | Experimental |
| [Flux Agent](https://github.com/sectorx83/Flux-agent) | Local-first AI agent and automation CLI | Core platform complete |
| [Cathedral](https://github.com/sectorx83/Cathedral) | Isolated experiment laboratory and runtime inspection | Phase 4 in progress |
| [Gravity](https://github.com/sectorx83/Gravity) | Adaptive computational graph runtime | Phase 2 complete |
| [EDITH X1](https://github.com/sectorx83/edithx1) | Multi-user AI assistant and EDITH NETWORK | Live application |

Every project has a dedicated case study under `/projects/<project>/`. The pages cover the problem, approach, system map, engineering scope, delivery record, and documented limitations. The matching Markdown files under `projects/` provide the longer technical record.

## Development

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Repository structure

```text
src/
  App.tsx          Portfolio and project case-study views
  styles.css       Responsive visual system and motion
  main.tsx         Application entry point
projects/
  <slug>/
    README.md      Technical project notes
    project.json   Project metadata
index.html         Document metadata and application shell
vercel.json        SPA deep-link fallback
```

## Links

- Website: https://sectorx83.vercel.app
- GitHub: https://github.com/sectorx83
- Email: mailto:sectorx83@gmail.com
- Instagram: https://www.instagram.com/manazz.io/
- EDITH X1: https://www.edithx1.vercel.app

## Stack

React 18 · TypeScript · Vite · Lucide · CSS
