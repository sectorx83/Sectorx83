import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Github, Instagram, Mail, Menu, Moon, Sun, X, ExternalLink, Layers3, Cpu, Terminal } from 'lucide-react'

type Project = {
  number: string
  slug: string
  name: string
  type: string
  description: string
  stack: string[]
  url: string
  repo: string
  featured?: boolean
  status: string
  focus: string
  overview: string
  details: string[]
  areas: string[]
}

const projects: Project[] = [
  {
    number: '01', slug: 'gravity', name: 'Gravity', type: 'STREAM PROCESSING',
    description: 'An adaptive computational runtime exploring safe changes to a running computational graph without restarting the whole application.',
    stack: ['Rust', 'Runtime', 'Computational graphs'], repo: 'sectorx83/Gravity',
    url: 'https://github.com/sectorx83/Gravity', featured: true, status: 'IN DEVELOPMENT',
    focus: 'Live graph evolution',
    overview: 'Gravity explores what happens when a running computation needs to change shape. Instead of treating a topology as fixed, the project investigates how work can move across an evolving graph while the system keeps running.',
    details: ['Model graph changes as explicit runtime operations.', 'Explore workload transfer between processing cells and safe connection updates.', 'Treat correctness, repeatability and tests as part of the runtime design.'],
    areas: ['Runtime architecture', 'Graph topology', 'Workload migration', 'Correctness and testing'],
  },
  {
    number: '02', slug: 'cathedral', name: 'Cathedral', type: 'OPEN COMPUTING LABORATORY',
    description: 'A developer platform for running isolated software experiments, inspecting behaviour and reproducing environments.',
    stack: ['Rust', 'Tauri', 'Linux isolation'], repo: 'sectorx83/Cathedral',
    url: 'https://github.com/sectorx83/Cathedral', status: 'BUILDING',
    focus: 'Reproducible experiments',
    overview: 'Cathedral is a workspace for experiments that should be isolated, inspectable and repeatable. The aim is to make it easier to run software in controlled environments and understand what happened inside them.',
    details: ['Build a clear workflow around creating and running experiments.', 'Use operating-system isolation concepts to keep experiments separated.', 'Make behaviour easier to inspect and reproduce instead of relying on guesswork.'],
    areas: ['Isolation workflows', 'Experiment lifecycle', 'Observability', 'Developer experience'],
  },
  {
    number: '03', slug: 'flux-agent', name: 'Flux Agent', type: 'LOCAL AI TOOLING',
    description: 'A local-first AI agent and automation CLI for conversation, planning, development and approved task execution.',
    stack: ['Python', 'Groq', 'CLI'], repo: 'sectorx83/Flux-agent',
    url: 'https://github.com/sectorx83/Flux-agent', status: 'BUILDING',
    focus: 'Useful, controlled agent workflows',
    overview: 'Flux Agent is a command-line workspace for working with AI during development. It is designed around local-first usage, practical automation and keeping consequential actions under the user’s control.',
    details: ['Bring conversation and task planning into a developer-friendly CLI.', 'Connect model providers through a consistent workflow.', 'Keep tool execution understandable, reviewable and explicitly approved.'],
    areas: ['CLI experience', 'Model providers', 'Task planning', 'Tool execution'],
  },
  {
    number: '04', slug: 'edithx1', name: 'EDITH X1', type: 'AI ASSISTANT PLATFORM',
    description: 'A multi-user assistant app combining AI chat, voice input, speech playback and the EDITH NETWORK execution layer.',
    stack: ['React', 'TypeScript', 'Supabase'], repo: 'sectorx83/edithx1',
    url: 'https://github.com/sectorx83/edithx1', status: 'BUILDING',
    focus: 'A cohesive voice and chat experience',
    overview: 'EDITH X1 brings conversational AI into a multi-user application. The project combines a responsive interface with chat, voice input, speech playback and an execution layer called EDITH NETWORK.',
    details: ['Make chat and voice feel like parts of one coherent assistant.', 'Support multiple users rather than a single-user demo.', 'Keep the interface, backend and execution layer connected cleanly.'],
    areas: ['Chat interface', 'Voice interaction', 'Speech playback', 'EDITH NETWORK'],
  },
  {
    number: '05', slug: 'd3x8', name: 'D3X8', type: '64-BIT OPERATING SYSTEM',
    description: 'An x86_64 operating system project, built from the ground up across its kernel, userspace, drivers, networking and desktop.',
    stack: ['C', 'x86_64', 'Kernel'], repo: 'sectorx83/D3X8',
    url: 'https://github.com/sectorx83/D3X8', status: 'RESEARCH',
    focus: 'Kernel and system behaviour',
    overview: 'D3X8 is an operating-system project focused on understanding the layers between boot and a usable desktop. It spans low-level kernel work, userspace programs, hardware support and the tools that make the system usable.',
    details: ['Work across kernel and userspace boundaries.', 'Investigate scheduling, process behaviour and system stability.', 'Develop drivers, networking and desktop components as part of one system.'],
    areas: ['x86_64 kernel', 'Scheduling and processes', 'Drivers and networking', 'Userspace and desktop'],
  },
]

const groups = [
  { label: 'LANGUAGES', items: ['Rust', 'C', 'C++', 'Python', 'TypeScript', 'x86_64 Assembly', 'Lua'] },
  { label: 'FRAMEWORKS & UI', items: ['React', 'Vite', 'Tauri', 'Harp UI'] },
  { label: 'SYSTEMS & TOOLS', items: ['Linux', 'SQLite', 'Supabase', 'CMake', 'Git', 'Docker', 'Vercel'] },
]

function Mark({ small = false }: { small?: boolean }) {
  return <span className={small ? 'brand-mark brand-mark--small' : 'brand-mark'} aria-hidden="true"><svg viewBox="0 0 76 38" role="presentation"><path className="brand-frame" d="M1 1H75V37H1Z" /><path className="brand-corner" d="M1 9V1H10M66 1H75V10M75 28V37H66M10 37H1V28" /><text x="8" y="27">SX83</text></svg></span>
}
function Label({ children }: { children: ReactNode }) { return <span className="eyebrow"><span className="eyebrow-dot" />{children}</span> }
function Brand({ closeMenu }: { closeMenu?: () => void }) {
  return <a className="brand" href="/" onClick={closeMenu} aria-label="Sectorx83 home"><Mark small /><span>SECTORX83<span className="brand-period">.</span></span></a>
}
function Header({ dark, setDark }: { dark: boolean; setDark: (value: (current: boolean) => boolean) => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  return <header className="topbar">
    <Brand closeMenu={closeMenu} />
    <nav className={menuOpen ? 'nav nav--open' : 'nav'} aria-label="Main navigation">
      <a href="/#about" onClick={closeMenu}>About <span>01</span></a><a href="/#work" onClick={closeMenu}>Work <span>02</span></a><a href="/#building" onClick={closeMenu}>Building <span>03</span></a><a href="/#toolkit" onClick={closeMenu}>Toolkit <span>04</span></a><a href="/#contact" onClick={closeMenu}>Contact <span>05</span></a>
    </nav>
    <div className="topbar-actions">
      <button className="theme-toggle" onClick={() => setDark((value) => !value)} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>{dark ? <Sun size={16} /> : <Moon size={16} />}<span>{dark ? 'LIGHT' : 'DARK'}</span></button>
      <button className="menu-toggle" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
    </div>
  </header>
}
function Footer() {
  return <footer className="footer section-wrap">
    <Brand />
    <span className="footer-copy mono">DESIGNED & BUILT WITH CURIOSITY · {new Date().getFullYear()}</span>
    <div className="social-links"><a href="https://github.com/sectorx83" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a><a href="https://instagram.com/manazz.io" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a><a href="mailto:sectorx83@gmail.com" aria-label="Email"><Mail size={17} /></a></div>
  </footer>
}
function ProjectCard({ project }: { project: Project }) {
  return <a className={project.featured ? 'project-card project-card--featured' : 'project-card'} href={`/projects/${project.slug}`}>
    <div className="project-number mono">{project.number}</div>
    <div className="project-main"><div className="project-type mono">{project.type}</div><h3>{project.name}</h3><span className="project-repo mono">{project.repo}</span><p>{project.description}</p><div className="project-tags">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
    <div className="project-side"><span className="project-status"><i />{project.status}</span><span className="project-arrow"><ArrowUpRight size={20} /></span></div>
  </a>
}
function HomePage() {
  return <main id="top">
    <section className="hero section-wrap">
      <div className="hero-meta"><Label>INDEPENDENT DEVELOPER</Label><span className="mono hero-index"><span className="signal-live" /> PORTFOLIO / {new Date().getFullYear()}</span></div>
      <div className="hero-main">
        <div className="hero-copy"><p className="hero-kicker mono">A LITTLE BIT OF CURIOSITY. A LOT OF BUILDING.</p><h1>Making things.<br /><span>Figuring them out.</span></h1><p className="hero-intro">I'm an independent developer interested in software, systems and the details that make things work. This is where I keep some of what I've been building.</p><div className="hero-links"><a className="button button--dark" href="#work">Explore the work <ArrowDown size={15} /></a><a className="text-link" href="https://github.com/sectorx83" target="_blank" rel="noreferrer">GitHub profile <ArrowUpRight size={15} /></a></div></div>
        <aside className="hero-repos panel-frame" aria-label="Selected GitHub repositories"><div className="repo-panel-head mono"><span>SELECTED REPOSITORIES</span><span>05</span></div>{projects.map((project) => <a className="repo-index-row" href={`/projects/${project.slug}`} key={project.number}><span className="repo-index-number mono">{project.number}</span><span className="repo-index-name">{project.repo}</span><ArrowUpRight size={14} /></a>)}<a className="repo-panel-foot mono" href="https://github.com/sectorx83?tab=repositories" target="_blank" rel="noreferrer">VIEW ALL REPOSITORIES <ArrowRight size={13} /></a></aside>
      </div>
      <div className="hero-footer"><span className="mono">SCROLL TO EXPLORE</span><span className="scroll-line" /><span className="mono">01 — 05</span></div>
    </section>
    <section className="intro-band section-wrap panel-rule" data-reveal><div className="band-index mono">A NOTE</div><p>I like understanding how things work, then making my own version. Sometimes that's an app. Sometimes it's a system that starts much closer to the metal.</p><Mark /></section>
    <section className="content-section section-wrap" id="about" data-reveal>
      <div className="section-heading"><Label>01 / ABOUT</Label><span className="mono section-side-note">A PERSON, NOT A PITCH DECK.</span></div>
      <div className="about-grid"><div><h2>Curious by default.<br /><span>Builder by habit.</span></h2><div className="about-aside mono"><span>MY DEFAULT MODE</span><strong>LEARN → BUILD → TEST → REPEAT</strong></div></div>
        <div className="about-copy"><p>I'm an independent developer who learns by taking things apart and building them again. I like seeing how the pieces fit, from the first interface a person touches down to the systems doing the work underneath.</p><p>That curiosity has pulled me in a few directions: building applications, experimenting with AI tools, designing developer workflows and spending a lot of time with operating-system internals. I don't want to stay in one layer of the stack just because it's familiar.</p><p>I care about the details that make software dependable: clear architecture, useful tests, understandable behaviour and interfaces that feel considered. Most projects are also a way to learn something I couldn't learn by just reading about it.</p><div className="about-note"><span className="note-symbol">↳</span><span>Still learning. Still shipping. Still breaking things occasionally.</span></div></div>
      </div>
    </section>
    <section className="work-section section-wrap" id="work" data-reveal>
      <div className="section-heading"><Label>02 / SELECTED WORK</Label><span className="mono section-side-note">FIVE PROJECTS. MANY OPEN TABS.</span></div>
      <div className="work-heading"><h2>Things I've<br /><span>put together.</span></h2><p>Each project has its own rabbit hole. Open one for the idea, the engineering focus and the repository.</p></div>
      <div className="project-list">{projects.map((project) => <ProjectCard project={project} key={project.number} />)}</div>
      <a className="all-projects" href="https://github.com/sectorx83?tab=repositories" target="_blank" rel="noreferrer">More experiments on GitHub <ArrowRight size={16} /></a>
    </section>
    <section className="building-section section-wrap" id="building" data-reveal>
      <div className="section-heading"><Label>03 / CURRENTLY BUILDING</Label><span className="mono section-side-note">THE WORKBENCH, NOT A ROADMAP.</span></div>
      <div className="building-intro"><h2>What's on<br /><span>the workbench.</span></h2><p>A quick snapshot of the themes I'm spending time on across the projects. These are focus areas, not made-up percentage bars.</p></div>
      <div className="building-grid">
        <article className="building-card building-card--wide"><div className="building-card-top"><span className="mono">01 / RUNTIME DESIGN</span><span className="building-indicator"><i /> ACTIVE THREAD</span></div><div className="building-card-main"><div className="building-icon"><Layers3 size={19} /></div><div><h3>Gravity</h3><p>Exploring safe graph changes and workload movement inside a running computational system.</p><a href="/projects/gravity">Project details <ArrowUpRight size={14} /></a></div></div></article>
        <article className="building-card"><div className="building-card-top"><span className="mono">02 / SYSTEMS</span><span className="building-indicator"><i /> EXPLORING</span></div><div className="building-icon"><Cpu size={19} /></div><h3>D3X8</h3><p>Kernel behaviour, process scheduling and the layers that make an operating system usable.</p><a href="/projects/d3x8">Project details <ArrowUpRight size={14} /></a></article>
        <article className="building-card"><div className="building-card-top"><span className="mono">03 / DEVELOPER TOOLS</span><span className="building-indicator"><i /> BUILDING</span></div><div className="building-icon"><Terminal size={19} /></div><h3>Flux Agent</h3><p>Local-first agent workflows, task planning and controlled tool execution.</p><a href="/projects/flux-agent">Project details <ArrowUpRight size={14} /></a></article>
      </div>
      <div className="building-foot mono"><span>ALSO IN THE MIX: CATHEDRAL · EDITH X1</span><span>UPDATED AS THE WORK EVOLVES</span></div>
    </section>
    <section className="toolkit-section section-wrap" id="toolkit" data-reveal>
      <div className="section-heading"><Label>04 / TOOLKIT</Label><span className="mono section-side-note">TOOLS CHANGE. CURIOSITY DOESN'T.</span></div>
      <div className="toolkit-layout"><div><h2>Some tools<br /><span>I've spent time with.</span></h2><p className="toolkit-intro">Not a checklist of expertise. Just technologies I've used, explored or keep coming back to.</p></div><div className="tool-groups">{groups.map((group, index) => <div className="tool-group" key={group.label}><div className="tool-group-head"><span className="mono">{group.label}</span><span className="mono">0{index + 1}</span></div><div className="tool-pills">{group.items.map((item) => <span className="tool-pill" key={item}>{item}</span>)}</div></div>)}</div></div>
    </section>
    <ContactSection />
  </main>
}
function ContactSection() {
  return <section className="contact-section section-wrap" id="contact" data-reveal>
    <div className="contact-panel panel-frame">
      <div className="contact-top"><Label>05 / CONTACT</Label><span className="mono">GOOD CONVERSATIONS START SOMEWHERE</span></div>
      <div className="contact-content"><div><h2>Have something<br /><span>interesting in mind?</span></h2><p>Questions, ideas, project discussions or just a good conversation about how things work. My inbox is open.</p></div><a className="contact-cta" href="mailto:sectorx83@gmail.com?subject=Hello%20Sectorx83">Write an email <ArrowUpRight size={20} /></a></div>
      <div className="contact-channels">
        <a href="https://github.com/sectorx83" target="_blank" rel="noreferrer"><span className="channel-icon"><Github size={18} /></span><span><small className="mono">CODE & PROJECTS</small><strong>GitHub</strong><em>@sectorx83</em></span><ArrowUpRight size={16} /></a>
        <a href="https://instagram.com/manazz.io" target="_blank" rel="noreferrer"><span className="channel-icon"><Instagram size={18} /></span><span><small className="mono">OCCASIONAL UPDATES</small><strong>Instagram</strong><em>@manazz.io</em></span><ArrowUpRight size={16} /></a>
        <a href="mailto:sectorx83@gmail.com"><span className="channel-icon"><Mail size={18} /></span><span><small className="mono">DIRECT CONTACT</small><strong>Email</strong><em>sectorx83@gmail.com</em></span><ArrowUpRight size={16} /></a>
      </div>
      <div className="contact-bottom mono"><span>NO FORMS. NO FUSS.</span><span>JUST A HUMAN-SIZED HELLO.</span></div>
    </div>
  </section>
}
function ProjectPage({ project }: { project: Project }) {
  const index = projects.findIndex((item) => item.slug === project.slug)
  const next = projects[(index + 1) % projects.length]
  return <main className="project-detail section-wrap" id="top">
    <a className="back-link mono" href="/#work"><ArrowLeft size={14} /> BACK TO ALL PROJECTS</a>
    <div className="detail-meta"><Label>PROJECT / {project.number}</Label><span className="mono">{project.type}</span></div>
    <div className="detail-hero"><div><p className="hero-kicker mono">SECTORX83 / SELECTED WORK</p><h1>{project.name}<span className="detail-period">.</span></h1><p className="detail-lede">{project.description}</p></div><div className="detail-status"><span className="project-status"><i />{project.status}</span><span className="mono">CURRENT FOCUS</span><strong>{project.focus}</strong></div></div>
    <div className="detail-rule" />
    <div className="detail-content-grid">
      <section className="detail-overview"><Label>THE IDEA</Label><h2>What it's<br /><span>about.</span></h2><p>{project.overview}</p><div className="detail-repo"><span className="mono">SOURCE REPOSITORY</span><a href={project.url} target="_blank" rel="noreferrer">{project.repo} <ExternalLink size={15} /></a></div></section>
      <section className="detail-notes"><Label>ENGINEERING NOTES</Label><h2>What I'm<br /><span>working through.</span></h2><ul>{project.details.map((detail) => <li key={detail}><span>↳</span>{detail}</li>)}</ul></section>
    </div>
    <section className="detail-stack"><div><Label>AREAS OF FOCUS</Label><h2>Inside the<br /><span>project.</span></h2></div><div className="detail-area-grid">{project.areas.map((area, i) => <div key={area}><span className="mono">0{i + 1}</span><strong>{area}</strong></div>)}</div></section>
    <section className="detail-bottom"><div><span className="mono">NEXT PROJECT / {next.number}</span><h2>{next.name}</h2></div><a href={`/projects/${next.slug}`}>Explore project <ArrowRight size={17} /></a></section>
  </main>
}
function App() {
  const [dark, setDark] = useState(false)
  const path = window.location.pathname.replace(/\/+$/, '')
  const projectSlug = path.startsWith('/projects/') ? path.slice('/projects/'.length) : ''
  const project = projects.find((item) => item.slug === projectSlug)
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#111210' : '#f5f5f2')
  }, [dark])
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: 0.12 })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [path])
  useEffect(() => { document.title = project ? `${project.name} — Sectorx83` : 'Sectorx83 — Independent developer' }, [project])
  return <div className="site-shell"><Header dark={dark} setDark={setDark} />{project ? <ProjectPage project={project} /> : projectSlug ? <main className="not-found section-wrap"><Label>404 / NOT FOUND</Label><h1>That project<br /><span>isn't here.</span></h1><a className="button button--dark" href="/#work">Back to projects <ArrowLeft size={15} /></a></main> : <HomePage />}<Footer /></div>
}
export default App
