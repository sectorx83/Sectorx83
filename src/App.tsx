import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Github, Instagram, Mail, Menu, Moon, Sun, X } from 'lucide-react'

type Project = {
  number: string
  name: string
  type: string
  description: string
  stack: string[]
  url: string
  featured?: boolean
  status: string
}

const projects: Project[] = [
  {
    number: '01',
    name: 'Gravity',
    type: 'STREAM PROCESSING',
    description: 'An exploration into distributed data processing, event flow and the systems that keep work moving.',
    stack: ['Rust', 'Systems', 'Concurrency'],
    url: 'https://github.com/sectorx83/Gravity',
    featured: true,
    status: 'IN DEVELOPMENT',
  },
  {
    number: '02',
    name: 'Cathedral',
    type: 'SOFTWARE PROJECT',
    description: 'A project built through deliberate engineering, iteration and a healthy respect for the details.',
    stack: ['Systems', 'Engineering'],
    url: 'https://github.com/sectorx83/Cathedral',
    status: 'BUILDING',
  },
  {
    number: '03',
    name: 'Flux Agent',
    type: 'LOCAL AI TOOLING',
    description: 'A local-first command-line agent focused on making useful AI workflows feel native to the terminal.',
    stack: ['Python', 'AI', 'CLI'],
    url: 'https://github.com/sectorx83/Flux-agent',
    status: 'BUILDING',
  },
  {
    number: '04',
    name: 'EDITH X1',
    type: 'PERSONAL AI ASSISTANT',
    description: 'An assistant interface connecting conversation, voice and everyday tools in one place.',
    stack: ['React', 'TypeScript', 'Groq'],
    url: 'https://github.com/sectorx83/edithx1',
    status: 'BUILDING',
  },
  {
    number: '05',
    name: 'Rawzap',
    type: 'OPERATING SYSTEM',
    description: 'Low-level operating-system work, from process scheduling to the pieces that make a machine feel alive.',
    stack: ['C++', 'Kernel', 'x86_64'],
    url: 'https://github.com/jadeking5128-beep/D3X8',
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
      {Array.from({ length: 25 }, (_, index) => <i key={index} className={(index === 2 || index === 10 || index === 14 || index === 22) ? 'dot dot--off' : 'dot'} />)}
    </span>
  )
}

function Label({ children }: { children: React.ReactNode }) {
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
            <span className="mono hero-index">PORTFOLIO / {year}</span>
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
            <div className="hero-art" aria-label="Abstract dot matrix graphic">
              <div className="art-top mono"><span>FIG. 001</span><span>DOT STUDY</span></div>
              <div className="dot-field">
                {Array.from({ length: 121 }, (_, index) => {
                  const x = index % 11
                  const y = Math.floor(index / 11)
                  const distance = Math.sqrt((x - 5) ** 2 + (y - 5) ** 2)
                  return <i key={index} className={distance < 2.4 ? 'matrix-dot matrix-dot--solid' : 'matrix-dot'} style={{ opacity: Math.max(0.12, 1 - distance / 9) }} />
                })}
              </div>
              <div className="art-bottom mono"><span>11 × 11</span><span>EST. BY CURIOSITY</span></div>
            </div>
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
          <div className="contact-panel">
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
