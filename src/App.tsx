import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Github, Instagram, Mail, Menu, Moon, Sun, X } from 'lucide-react'

type Project = {
  number: string
  name: string
  type: string
  description: string
  stack: string[]
  url: string
  repo: string
  featured?: boolean
  status: string
}

const projects: Project[] = [
  {
    number: '01',
    name: 'Gravity',
    type: 'STREAM PROCESSING',
    description: 'An adaptive computational runtime exploring safe changes to a running computational graph without restarting the whole application.',
    stack: ['Rust', 'Runtime', 'Computational graphs'],
    repo: 'sectorx83/Gravity',
    url: 'https://github.com/sectorx83/Gravity',
    featured: true,
    status: 'IN DEVELOPMENT',
  },
  {
    number: '02',
    name: 'Cathedral',
    type: 'OPEN COMPUTING LABORATORY',
    description: 'A developer platform for running isolated software experiments, inspecting behaviour and reproducing environments.',
    stack: ['Rust', 'Tauri', 'Linux isolation'],
    repo: 'sectorx83/Cathedral',
    url: 'https://github.com/sectorx83/Cathedral',
    status: 'BUILDING',
  },
  {
    number: '03',
    name: 'Flux Agent',
    type: 'LOCAL AI TOOLING',
    description: 'A local-first AI agent and automation CLI for conversation, planning, development and approved task execution.',
    stack: ['Python', 'Groq', 'CLI'],
    repo: 'sectorx83/Flux-agent',
    url: 'https://github.com/sectorx83/Flux-agent',
    status: 'BUILDING',
  },
  {
    number: '04',
    name: 'EDITH X1',
    type: 'PERSONAL AI ASSISTANT',
    description: 'A multi-user assistant app combining AI chat, voice input, speech playback and the EDITH NETWORK execution layer.',
    stack: ['React', 'TypeScript', 'Supabase'],
    repo: 'sectorx83/edithx1',
    url: 'https://github.com/sectorx83/edithx1',
    status: 'BUILDING',
  },
  {
    number: '05',
    name: 'D3X8',
    type: '64-BIT OPERATING SYSTEM',
    description: 'An x86_64 operating system project, built from the ground up across its kernel, userspace, drivers, networking and desktop.',
    stack: ['C', 'x86_64', 'Kernel'],
    repo: 'sectorx83/D3X8',
    url: 'https://github.com/sectorx83/D3X8',
    status: 'RESEARCH',
  },
]

const groups = [
  { label: 'LANGUAGES', items: ['Rust', 'C', 'C++', 'Python', 'TypeScript', 'x86_64 Assembly', 'Lua'] },
  { label: 'FRAMEWORKS & UI', items: ['React', 'Vite', 'Tauri', 'Harp UI'] },
  { label: 'SYSTEMS & TOOLS', items: ['Linux', 'SQLite', 'Supabase', 'CMake', 'Git', 'Docker', 'Vercel'] },
]

function Mark({ small = false }: { small?: boolean }) {
  return (
    <span className={small ? 'brand-mark brand-mark--small' : 'brand-mark'} aria-hidden="true">
      <svg viewBox="0 0 76 38" role="presentation">
        <path className="brand-frame" d="M1 1H75V37H1Z" />
        <path className="brand-corner" d="M1 9V1H10M66 1H75V10M75 28V37H66M10 37H1V28" />
        <text x="8" y="27">SX83</text>
      </svg>
    </span>
  )
}

function Label({ children }: { children: ReactNode }) {
  return <span className="eyebrow"><span className="eyebrow-dot" />{children}</span>
}

function App() {
  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const year = new Date().getFullYear()

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#111210' : '#f5f5f2')
  }, [dark])

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" onClick={closeMenu} aria-label="Sectorx83 home">
          <Mark small />
          <span>SECTORX83<span className="brand-period">.</span></span>
        </a>
        <nav className={menuOpen ? 'nav nav--open' : 'nav'} aria-label="Main navigation">
          <a href="#about" onClick={closeMenu}>About <span>01</span></a>
          <a href="#work" onClick={closeMenu}>Work <span>02</span></a>
          <a href="#toolkit" onClick={closeMenu}>Toolkit <span>03</span></a>
          <a href="#contact" onClick={closeMenu}>Contact <span>04</span></a>
        </nav>
        <div className="topbar-actions">
          <button className="theme-toggle" onClick={() => setDark((value) => !value)} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            <span>{dark ? 'LIGHT' : 'DARK'}</span>
          </button>
          <button className="menu-toggle" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero section-wrap">
          <div className="hero-meta">
            <Label>INDEPENDENT DEVELOPER</Label>
            <span className="mono hero-index"><span className="signal-live" /> PORTFOLIO / {year}</span>
          </div>
          <div className="hero-main">
            <div className="hero-copy">
              <p className="hero-kicker mono">A LITTLE BIT OF CURIOSITY. A LOT OF BUILDING.</p>
              <h1>Making things.<br /><span>Figuring them out.</span></h1>
              <p className="hero-intro">I'm an independent developer interested in software, systems and the details that make things work. This is where I keep some of what I've been building.</p>
              <div className="hero-links">
                <a className="button button--dark" href="#work">Explore the work <ArrowDown size={15} /></a>
                <a className="text-link" href="https://github.com/sectorx83" target="_blank" rel="noreferrer">GitHub profile <ArrowUpRight size={15} /></a>
              </div>
            </div>
            <aside className="hero-repos panel-frame" aria-label="Selected GitHub repositories">
              <div className="repo-panel-head mono"><span>SELECTED REPOSITORIES</span><span>05</span></div>
              {projects.map((project) => (
                <a className="repo-index-row" href={project.url} target="_blank" rel="noreferrer" key={project.number}>
                  <span className="repo-index-number mono">{project.number}</span>
                  <span className="repo-index-name">{project.repo}</span>
                  <ArrowUpRight size={14} />
                </a>
              ))}
              <a className="repo-panel-foot mono" href="https://github.com/sectorx83?tab=repositories" target="_blank" rel="noreferrer">VIEW ALL REPOSITORIES <ArrowRight size={13} /></a>
            </aside>
          </div>
          <div className="hero-footer">
            <span className="mono">SCROLL TO EXPLORE</span>
            <span className="scroll-line" />
            <span className="mono">01 — 04</span>
          </div>
        </section>

        <section className="intro-band section-wrap" data-reveal>
          <div className="band-index mono">A NOTE</div>
          <p>I like understanding how things work, then making my own version. Sometimes that's an app. Sometimes it's a system that starts much closer to the metal.</p>
          <Mark />
        </section>

        <section className="content-section section-wrap" id="about" data-reveal>
          <div className="section-heading">
            <Label>01 / ABOUT</Label>
            <span className="mono section-side-note">A PERSON, NOT A PITCH DECK.</span>
          </div>
          <div className="about-grid">
            <h2>Curious by default.<br /><span>Builder by habit.</span></h2>
            <div className="about-copy">
              <p>I'm interested in the layers beneath the interface: how software is structured, how systems behave and how small decisions shape the final experience.</p>
              <p>Most of my learning happens by building. I enjoy moving between application development and lower-level engineering, picking up a new problem and staying with it until the pieces make sense.</p>
              <div className="about-note">
                <span className="note-symbol">↳</span>
                <span>Still learning. Still shipping. Still breaking things occasionally.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="work-section section-wrap" id="work" data-reveal>
          <div className="section-heading">
            <Label>02 / SELECTED WORK</Label>
            <span className="mono section-side-note">A FEW OPEN TABS, BASICALLY.</span>
          </div>
          <div className="work-heading">
            <h2>Things I've<br /><span>put together.</span></h2>
            <p>Projects are works in progress more often than not. These are a few worth sharing.</p>
          </div>
          <div className="project-list">
            {projects.map((project) => (
              <a className={project.featured ? 'project-card project-card--featured' : 'project-card'} href={project.url} target="_blank" rel="noreferrer" key={project.number}>
                <div className="project-number mono">{project.number}</div>
                <div className="project-main">
                  <div className="project-type mono">{project.type}</div>
                  <h3>{project.name}</h3>
                  <span className="project-repo mono">{project.repo}</span>
                  <p>{project.description}</p>
                  <div className="project-tags">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
                <div className="project-side">
                  <span className="project-status"><i />{project.status}</span>
                  <span className="project-arrow"><ArrowUpRight size={20} /></span>
                </div>
              </a>
            ))}
          </div>
          <a className="all-projects" href="https://github.com/sectorx83?tab=repositories" target="_blank" rel="noreferrer">More experiments on GitHub <ArrowRight size={16} /></a>
        </section>

        <section className="toolkit-section section-wrap" id="toolkit" data-reveal>
          <div className="section-heading">
            <Label>03 / TOOLKIT</Label>
            <span className="mono section-side-note">TOOLS CHANGE. CURIOSITY DOESN'T.</span>
          </div>
          <div className="toolkit-layout">
            <div>
              <h2>Some tools<br /><span>I've spent time with.</span></h2>
              <p className="toolkit-intro">Not a checklist of expertise. Just technologies I've used, explored or keep coming back to.</p>
            </div>
            <div className="tool-groups">
              {groups.map((group, index) => (
                <div className="tool-group" key={group.label}>
                  <div className="tool-group-head"><span className="mono">{group.label}</span><span className="mono">0{index + 1}</span></div>
                  <div className="tool-pills">{group.items.map((item) => <span className="tool-pill" key={item}>{item}</span>)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section section-wrap" id="contact" data-reveal>
          <div className="contact-panel panel-frame">
            <div className="contact-top">
              <Label>04 / CONTACT</Label>
              <span className="mono">OPEN TO INTERESTING CONVERSATIONS</span>
            </div>
            <div className="contact-content">
              <h2>Have something<br /><span>interesting in mind?</span></h2>
              <a className="contact-cta" href="mailto:sectorx83@gmail.com">Let's talk <ArrowUpRight size={20} /></a>
            </div>
            <div className="contact-bottom mono"><span>NO FORMS. NO FUSS.</span><span>JUST AN EMAIL.</span></div>
          </div>
        </section>
      </main>

      <footer className="footer section-wrap">
        <a className="brand footer-brand" href="#top"><Mark small /><span>SECTORX83<span className="brand-period">.</span></span></a>
        <span className="footer-copy mono">DESIGNED & BUILT WITH CURIOSITY · {year}</span>
        <div className="social-links">
          <a href="https://github.com/sectorx83" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a>
          <a href="https://instagram.com/manazz.io" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a>
          <a href="mailto:sectorx83@gmail.com" aria-label="Email"><Mail size={17} /></a>
        </div>
      </footer>
    </div>
  )
}

export default App
