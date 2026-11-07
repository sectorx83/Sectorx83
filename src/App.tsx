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
    url: 'https://github.com/sectorx83/Cathedral', status: 'COMPLETED',
    focus: 'Reproducible experiment workflows',
    overview: 'Cathedral is a developer workspace for isolated, inspectable and repeatable software experiments. Its completed implementation brings the experiment workflow and environment controls into one focused tool, making it easier to understand what ran and reproduce the result.',
    details: ['Delivered a workflow for creating and running isolated experiments.', 'Applied operating-system isolation concepts to separate experiment environments.', 'Added a more inspectable, repeatable approach to software experiments.'],
    areas: ['Isolation workflows', 'Experiment lifecycle', 'Observability', 'Developer experience'],
  },
  {
    number: '03', slug: 'flux-agent', name: 'Flux Agent', type: 'LOCAL AI TOOLING',
    description: 'A local-first AI agent and automation CLI for conversation, planning, development and approved task execution.',
    stack: ['Python', 'Groq', 'CLI'], repo: 'sectorx83/Flux-agent',
    url: 'https://github.com/sectorx83/Flux-agent', status: 'COMPLETED',
    focus: 'Local-first agent workflows',
    overview: 'Flux Agent is a local-first AI agent and automation CLI for development work. Its completed project scope brings conversation, planning and controlled task execution into a developer-focused command-line workflow.',
    details: ['Delivered a developer-focused CLI for conversation and task planning.', 'Integrated model-provider workflows behind a consistent interface.', 'Kept consequential tool execution understandable and approval-controlled.'],
    areas: ['CLI experience', 'Model providers', 'Task planning', 'Tool execution'],
  },
  {
    number: '04', slug: 'edithx1', name: 'EDITH X1', type: 'AI ASSISTANT PLATFORM',
    description: 'A multi-user assistant app combining AI chat, voice input, speech playback and the EDITH NETWORK execution layer.',
    stack: ['React', 'TypeScript', 'Supabase'], repo: 'sectorx83/edithx1',
    url: 'https://github.com/sectorx83/edithx1', status: 'COMPLETED',
    focus: 'Multi-user assistant experience',
    overview: 'EDITH X1 is a multi-user assistant application combining AI chat, voice input, speech playback and the EDITH NETWORK execution layer. The project’s current planned scope is complete, bringing its core assistant experience and supporting application pieces together.',
    details: ['Completed the unified chat and voice assistant experience.', 'Built the application for multiple users rather than a single-user demo.', 'Connected the interface, backend and EDITH NETWORK execution layer.'],
    areas: ['Chat interface', 'Voice interaction', 'Speech playback', 'EDITH NETWORK'],
  },
  {
    number: '05', slug: 'd3x8', name: 'D3X8', type: '64-BIT OPERATING SYSTEM',
    description: 'An experimental x86_64 operating system exploring kernel design, userspace, drivers, networking and a graphical desktop.',
    stack: ['C', 'x86_64', 'Kernel'], repo: 'sectorx83/D3X8',
    url: 'https://github.com/sectorx83/D3X8', status: 'EXPERIMENTAL OS',
    focus: 'Kernel and operating-system experiments',
    overview: 'D3X8 is an experimental operating system built to explore the layers between boot and a usable desktop. It spans low-level kernel work, userspace programs, hardware support and the tools that make the system usable. It is an ongoing systems experiment, not a finished commercial OS.',
    details: ['Experiment across kernel and userspace boundaries.', 'Investigate scheduling, process behaviour and system stability.', 'Build and test drivers, networking and desktop components as parts of one system.'],
    areas: ['x86_64 kernel', 'Scheduling and processes', 'Drivers and networking', 'Userspace and desktop'],
  },
]

const groups = [
  { label: 'LANGUAGES', items: ['Rust', 'C', 'C++', 'Python', 'TypeScript', 'x86_64 Assembly', 'Lua'] },
  { label: 'FRAMEWORKS & UI', items: ['React', 'Vite', 'Tauri', 'Harp UI'] },
  { label: 'SYSTEMS & TOOLS', items: ['Linux', 'SQLite', 'Supabase', 'CMake', 'Git', 'Docker', 'Vercel'] },
]

function Mark({ small = false }: { small?: boolean }) {
  return <span className={small ? 'brand-mark brand-mark--small' : 'brand-mark'} aria-hidden="true"><svg viewBox="0 0 76 38" role="presentation"><path className="brand-frame" d="M1 1H75V37H1Z" /><path className="brand-corner" d="M1 9V1H10M66 1H75V10M75 28V37H66M10 37H1V28" /><text x="8" y="27">SX83</text></svg><sup className="brand-registered">®</sup></span>
}
function CircuitPanel() {
  return <div className="circuit-panel" aria-hidden="true">
    <svg viewBox="0 0 520 820" preserveAspectRatio="xMidYMid meet">
      <g className="circuit-traces">
        <path d="M20 55H155V112H225V170H310V130H470" />
        <path d="M65 0V88H115V205H180V270H270V325H430V275H520" />
        <path d="M0 230H75V300H145V360H215V430H355V390H500" />
        <path d="M520 80H410V155H365V220H310V285H250V350H190" />
        <path d="M40 470H115V420H180V500H260V565H350V520H490" />
        <path d="M0 610H95V555H160V610H235V680H325V635H420V700H520" />
        <path d="M75 820V735H145V690H215V735H295V785H390" />
        <path d="M300 0V65H350V110H405V190H470V235" />
        <path d="M480 360V430H430V475H390V545H330" />
        <path d="M20 360H55V400H95V455" />
        <path d="M185 0V42H225V90" />
        <path d="M260 820V760H300V720H360V675" />
      </g>
      <g className="circuit-secondary">
        <path d="M155 112V75H190V55H235M310 130V85H350V50H390" />
        <path d="M145 360V320H105V280H80M355 390V345H395V315H455" />
        <path d="M115 420V385H80V350H35M260 565V610H300V650H345" />
        <path d="M160 610V655H125V700H85M420 700V750H465V790" />
        <path d="M365 220H420V250H460M215 430V390H255V365" />
      </g>
      <g className="circuit-nodes">
        <circle cx="155" cy="112" r="5"/><circle cx="310" cy="130" r="4"/><circle cx="145" cy="360" r="5"/>
        <circle cx="355" cy="390" r="4"/><circle cx="260" cy="565" r="5"/><circle cx="420" cy="700" r="4"/>
        <circle cx="225" cy="90" r="3"/><circle cx="395" cy="315" r="3"/><circle cx="85" cy="700" r="3"/>
      </g>
      <g className="circuit-chips">
        <rect x="220" y="190" width="76" height="48" rx="2"/><path d="M232 180V190M248 180V190M264 180V190M280 180V190M232 238V248M248 238V248M264 238V248M280 238V248"/>
        <rect x="95" y="500" width="64" height="42" rx="2"/><path d="M106 490V500M122 490V500M138 490V500M154 490V500M106 542V552M122 542V552M138 542V552M154 542V552"/>
        <rect x="370" y="570" width="72" height="46" rx="2"/><path d="M382 560V570M398 560V570M414 560V570M430 560V570M382 616V626M398 616V626M414 616V626M430 616V626"/>
      </g>
      <g className="circuit-labels"><text x="226" y="216">SX / 83</text><text x="104" y="525">BUS 01</text><text x="381" y="596">NODE 03</text></g>
    </svg>
  </div>
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
        <article className="building-card"><div className="building-card-top"><span className="mono">02 / EXPERIMENTAL OS</span><span className="building-indicator"><i /> EXPERIMENTAL</span></div><div className="building-icon"><Cpu size={19} /></div><h3>D3X8</h3><p>Experimental kernel, scheduling, userspace and hardware work across an evolving x86_64 operating system.</p><a href="/projects/d3x8">Project details <ArrowUpRight size={14} /></a></article>
       </div>
      <div className="building-foot mono"><span>COMPLETED: CATHEDRAL · FLUX AGENT · EDITH X1</span><span>ACTIVE WORK: GRAVITY · D3X8</span></div>
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
    <div className="detail-hero"><div><p className="hero-kicker mono">SECTORX83 / SELECTED WORK</p><h1>{project.name}<span className="detail-period">.</span></h1><p className="detail-lede">{project.description}</p></div><div className="detail-status"><span className="project-status"><i />{project.status}</span><span className="mono">{project.status === 'COMPLETED' ? 'PROJECT OUTCOME' : 'CURRENT FOCUS'}</span><strong>{project.focus}</strong></div></div>
    <div className="detail-rule" />
    <div className="detail-content-grid">
      <section className="detail-overview"><Label>THE IDEA</Label><h2>What it's<br /><span>about.</span></h2><p>{project.overview}</p><div className="detail-repo"><span className="mono">SOURCE REPOSITORY</span><a href={project.url} target="_blank" rel="noreferrer">{project.repo} <ExternalLink size={15} /></a></div></section>
      <section className="detail-notes"><Label>{project.status === 'COMPLETED' ? 'DELIVERED WORK' : 'ENGINEERING NOTES'}</Label><h2>{project.status === 'COMPLETED' ? <>What was<br /><span>delivered.</span></> : <>What I'm<br /><span>working through.</span></>}</h2><ul>{project.details.map((detail) => <li key={detail}><span>↳</span>{detail}</li>)}</ul></section>
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
  return <div className="site-shell"><CircuitPanel /><Header dark={dark} setDark={setDark} />{project ? <ProjectPage project={project} /> : projectSlug ? <main className="not-found section-wrap"><Label>404 / NOT FOUND</Label><h1>That project<br /><span>isn't here.</span></h1><a className="button button--dark" href="/#work">Back to projects <ArrowLeft size={15} /></a></main> : <HomePage />}<Footer /></div>
}
export default App
