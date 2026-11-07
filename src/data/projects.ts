export type Project = {
  number: string;
  name: string;
  category: string;
  year: string;
  description: string;
  stack: string[];
  href: string;
  slug: string;
  accent: string;
  metric: string;
  visual: string;
};

export const projects: Project[] = [
  {
    number: "01",
    name: "Gravity",
    category: "COMPUTATIONAL RUNTIME",
    year: "2026",
    description: "An adaptive computational runtime exploring safe live topology changes while preserving state and accepted work.",
    stack: ["RUST", "RUNTIME SYSTEMS", "DISTRIBUTED COMPUTING"],
    href: "https://github.com/sectorx83/Gravity",
    slug: "gravity",
    accent: "#a9c9ff",
    metric: "TOPOLOGY / STATE / FLOW",
    visual: "gravity"
  },
  {
    number: "02",
    name: "Cathedral",
    category: "EXPERIMENT LAB",
    year: "2026",
    description: "A reproducible computing laboratory for isolated experiments, observability, diagnostics and controlled iteration.",
    stack: ["RUST", "OBSERVABILITY", "RESEARCH TOOLING"],
    href: "https://github.com/sectorx83/Cathedral",
    slug: "cathedral",
    accent: "#d5e5ff",
    metric: "ISOLATE / OBSERVE / REPEAT",
    visual: "cathedral"
  },
  {
    number: "03",
    name: "Flux Agent",
    category: "AI DEVELOPER TOOLS",
    year: "2026",
    description: "A local-first AI agent and automation CLI for planning, software development and controlled execution.",
    stack: ["PYTHON", "AI AGENTS", "AUTOMATION"],
    href: "https://github.com/sectorx83/Flux-agent",
    slug: "flux",
    accent: "#9cbcff",
    metric: "PLAN / ACT / VERIFY",
    visual: "flux"
  },
  {
    number: "04",
    name: "EDITH X1",
    category: "INTELLIGENT INTERFACE",
    year: "2026",
    description: "A multi-user AI assistant with chat, voice interaction and an extensible execution layer.",
    stack: ["TYPESCRIPT", "VOICE", "AI PRODUCT"],
    href: "https://github.com/sectorx83/edithx1",
    slug: "edith",
    accent: "#b6d7ff",
    metric: "VOICE / CONTEXT / ACTION",
    visual: "edith"
  },
  {
    number: "05",
    name: "D3X8",
    category: "OPERATING SYSTEM",
    year: "2026",
    description: "An experimental x86_64 operating system exploring low-level systems and desktop computing.",
    stack: ["C", "C++", "X86_64"],
    href: "https://github.com/sectorx83/D3X8",
    slug: "d3x8",
    accent: "#c8d9ef",
    metric: "CLOSE TO THE METAL",
    visual: "d3x8"
  }
];

export const toolkit = [
  { group: "LANGUAGES & SYSTEMS", items: ["Rust", "Python", "TypeScript", "C", "C++", "x86_64 Assembly", "Lua"] },
  { group: "APPLICATION & UI", items: ["React", "TanStack Start", "Vite", "Tauri v2", "Harp UI"] },
  { group: "AI & DEVELOPER TOOLS", items: ["Groq", "Gemini", "Cerebras", "OpenRouter", "FastEmbed", "Playwright", "Rich CLI"] },
  { group: "DATA & BACKENDS", items: ["Supabase", "SQLite", "SSE", "PTY"] },
  { group: "RUNTIME & SYSTEMS", items: ["Bubblewrap", "Linux Namespaces", "cgroups v2", "Limine", "mlibc", "BusyBox", "ACPI", "SMP", "TCP/IP", "FAT32", "Intel e1000"] },
  { group: "ENGINEERING & DELIVERY", items: ["Cargo", "CMake", "Make", "GitHub Actions", "Docker", "Vercel", "GitHub CLI"] }
];