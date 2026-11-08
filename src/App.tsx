import { useEffect, useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Atom, Bot, Code2, Cpu, ExternalLink, Github, Instagram, Layers3, Mail, Menu, Radio, Terminal, X } from 'lucide-react'

const github = 'https://github.com/sectorx83'
const projects = [
  { id:'d3x8', number:'01', name:'D3X8', type:'Operating system', category:'Systems', status:'Active development', tone:'live', description:'A 64-bit x86_64 operating system built from the ground up — custom kernel, userspace, drivers, networking, and a graphical desktop.', details:'Kernel engineering · SMP · ELF64 · Harp desktop', stack:['C','x86_64 ASM','Limine','Make'], icon:Cpu, featured:true, href:'https://github.com/sectorx83/D3X8', accent:'violet' },
  { id:'flux', number:'02', name:'Flux Agent', type:'AI developer tooling', category:'AI', status:'Active development', tone:'live', description:'A local-first AI agent and automation CLI with planning, approval-gated build tools, provider fallbacks, memory, and remote task execution.', details:'Multi-provider · Multi-agent · Local-first', stack:['Python','Groq','OpenRouter','SQLite'], icon:Bot, featured:true, href:'https://github.com/sectorx83/Flux-agent', accent:'cyan' },
  { id:'cathedral', number:'03', name:'Cathedral', type:'Developer infrastructure', category:'Infrastructure', status:'Phase 4 in progress', tone:'progress', description:'An open computing laboratory for running isolated software experiments, inspecting runtime behavior, and reproducing environments.', details:'Rust core · Linux isolation · Desktop studio', stack:['Rust','Tauri','React','SQLite'], icon:Layers3, featured:true, href:'https://github.com/sectorx83/Cathedral', accent:'amber' },
  { id:'gravity', number:'04', name:'Gravity', type:'Computational runtime', category:'Systems', status:'Phase 1 complete', tone:'complete', description:'An adaptive computational runtime exploring safe live topology changes while preserving required state and correctness.', details:'Mutable graphs · State transfer · Runtime evolution', stack:['Rust','Graph runtime','CLI'], icon:Atom, featured:false, href:'https://github.com/sectorx83/Gravity', accent:'rose' },
  { id:'edith', number:'05', name:'EDITH X1', type:'AI assistant platform', category:'AI', status:'Live', tone:'complete', description:'A multi-user AI assistant with chat, voice input, configurable behavior, and an execution layer for connected workflows.', details:'AI chat · Voice interface · Supabase', stack:['React','TypeScript','TanStack','Supabase'], icon:Radio, featured:false, href:'https://github.com/sectorx83/edithx1', live:'https://www.edithx1.vercel.app', accent:'green' },
]
const filters = ['All','Systems','AI','Infrastructure']

function App() {
  const [filter,setFilter] = useState('All')
  const [mobileOpen,setMobileOpen] = useState(false)
  const visibleProjects = useMemo(() => projects.filter(p => filter === 'All' || p.category === filter),[filter])
  const closeMenu = () => setMobileOpen(false)
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.14, rootMargin: '0px 0px -36px 0px' })
    elements.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`)
      observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])
  return <div className="site-shell">
    <div className="ambient ambient-one"/><div className="ambient ambient-two"/>
    <header className="topbar">
      <a className="brand" href="#home" aria-label="Tyler home"><span className="brand-mark">T<span>.</span></span><span className="brand-name">TYLER<span className="brand-slash">/</span>DEV</span></a>
      <nav className={mobileOpen ? 'nav-links nav-open' : 'nav-links'}>
        <a href="#work" onClick={closeMenu}>Work</a><a href="#about" onClick={closeMenu}>About</a><a href="#stack" onClick={closeMenu}>Stack</a><a href="#contact" onClick={closeMenu}>Contact</a>
        <a className="nav-contact" href={github} target="_blank" rel="noreferrer" onClick={closeMenu}>GitHub <ArrowUpRight size={14}/></a>
      </nav>
      <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">{mobileOpen ? <X size={21}/> : <Menu size={21}/>}</button>
    </header>
    <main id="home">
      <section className="hero section-wrap">
        <div className="hero-copy hero-entry">
          <div className="eyebrow"><span className="eyebrow-dot"/> INDEPENDENT DEVELOPER <span className="eyebrow-line"/> INDIA</div>
          <h1>Building things<br/>that <span className="gradient-text">do things.</span></h1>
          <p className="hero-lede">I'm Tyler — a developer interested in systems programming, AI tooling, and the infrastructure that makes software work.</p>
          <div className="hero-actions"><a className="button button-primary" href="#work">Explore my work <ArrowDownRight size={17}/></a><a className="button button-quiet" href={github} target="_blank" rel="noreferrer"><Github size={17}/> GitHub profile <ArrowUpRight size={15}/></a></div>
          <div className="hero-meta"><span><span className="pulse-dot"/> Building & experimenting</span><span className="meta-divider">/</span><span>Open-source focused</span></div>
        </div>
        <div className="hero-visual hero-entry hero-entry-delay" aria-label="Developer terminal illustration">
          <div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="core-grid"/>
          <div className="terminal-card">
            <div className="terminal-top"><div className="window-dots"><i/><i/><i/></div><span>tyler@workspace ~</span><span className="terminal-lock">●</span></div>
            <div className="terminal-body">
              <div className="terminal-line"><span className="terminal-muted">01</span><span className="terminal-prompt">$</span><span>whoami</span></div><div className="terminal-output">developer & builder</div>
              <div className="terminal-line"><span className="terminal-muted">02</span><span className="terminal-prompt">$</span><span>cat interests.txt</span></div><div className="terminal-output terminal-list">systems programming<br/>AI agents & tooling<br/>developer infrastructure</div>
              <div className="terminal-line"><span className="terminal-muted">03</span><span className="terminal-prompt">$</span><span>ls projects/</span></div><div className="terminal-output terminal-files">D3X8&nbsp;&nbsp; Flux&nbsp;&nbsp; Cathedral<br/>Gravity&nbsp;&nbsp; EDITH-X1</div>
              <div className="terminal-line terminal-last"><span className="terminal-muted">04</span><span className="terminal-prompt">$</span><span className="cursor-block"/></div>
            </div>
          </div>
          <div className="floating-chip chip-top"><Cpu size={14}/> LOW-LEVEL SYSTEMS</div><div className="floating-chip chip-bottom"><Bot size={14}/> APPLIED AI</div><div className="hero-index">001 <span>—</span> 005</div>
        </div>
        <a className="scroll-cue" href="#work"><span/> SCROLL TO EXPLORE</a>
      </section>
      <section className="work-section section-wrap" id="work">
        <div className="section-heading reveal"><div><div className="eyebrow"><span className="eyebrow-dot"/> SELECTED BUILDS</div><h2>Projects<span className="heading-period">.</span></h2></div><p className="section-intro">A selection of things I've been building, from low-level systems to practical AI software.</p></div>
        <div className="work-toolbar"><div className="project-count"><span>05</span> PROJECTS IN THE FIELD</div><div className="filter-row" aria-label="Filter projects">{filters.map(item => <button key={item} className={filter === item ? 'filter-button active' : 'filter-button'} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
        <div className="project-grid">{visibleProjects.map(project => { const Icon = project.icon; return <article className={'project-card reveal accent-' + project.accent + (project.featured ? ' project-featured' : '')} key={project.id}>
          <div className="project-card-top"><span className="project-number">/{project.number}</span><span className={'status status-' + project.tone}><i/>{project.status}</span></div>
          <div className="project-icon"><Icon size={23} strokeWidth={1.6}/></div>
          <div className="project-title-row"><div><div className="project-type">{project.type}</div><h3>{project.name}</h3></div><a className="project-arrow" href={project.href} target="_blank" rel="noreferrer" aria-label={'Open ' + project.name + ' repository'}><ArrowUpRight size={19}/></a></div>
          <p className="project-description">{project.description}</p><div className="project-details">{project.details}</div>
          <div className="tag-row">{project.stack.map(tag => <span className="tech-tag" key={tag}>{tag}</span>)}</div>
          <div className="project-card-footer"><a href={project.href} target="_blank" rel="noreferrer"><Github size={15}/> Source code <ExternalLink size={12}/></a>{project.live && <a href={project.live} target="_blank" rel="noreferrer">Live app <ArrowUpRight size={13}/></a>}</div>
        </article>})}</div>
        <div className="all-repos"><span>More code, experiments and iteration history</span><a href={github + '?tab=repositories'} target="_blank" rel="noreferrer">Browse all repositories <ArrowUpRight size={15}/></a></div>
      </section>
      <section className="about-section section-wrap" id="about">
        <div className="about-label reveal"><div className="eyebrow"><span className="eyebrow-dot"/> A LITTLE CONTEXT</div><h2>Curiosity,<br/><span className="gradient-text">made tangible.</span></h2></div>
        <div className="about-content reveal"><p className="about-statement">I like understanding how things work beneath the surface — then turning that understanding into something people can use.</p><p className="about-body">My work moves between low-level engineering and higher-level product building. That means exploring kernels and runtimes, designing developer tools, and experimenting with AI-powered interfaces. I value clear architecture, useful software, and honest engineering over flashy claims.</p>
          <div className="principles"><div><span>01</span><strong>Build from fundamentals</strong><p>Understand the system before adding abstraction.</p></div><div><span>02</span><strong>Make it useful</strong><p>Turn experiments into tools with a clear purpose.</p></div><div><span>03</span><strong>Show the real state</strong><p>Document limitations as carefully as capabilities.</p></div></div>
        </div>
      </section>
      <section className="stack-section section-wrap" id="stack">
        <div className="section-heading stack-heading reveal"><div><div className="eyebrow"><span className="eyebrow-dot"/> TOOLS OF THE TRADE</div><h2>Working stack<span className="heading-period">.</span></h2></div><p className="section-intro">Technologies reflected across the public projects on my GitHub.</p></div>
        <div className="stack-grid reveal"><div className="stack-group"><div className="stack-icon"><Terminal size={18}/></div><h3>Systems</h3><p>Rust · C · x86_64 Assembly · Linux</p></div><div className="stack-group"><div className="stack-icon"><Code2 size={18}/></div><h3>Application</h3><p>TypeScript · React · Python · Vite</p></div><div className="stack-group"><div className="stack-icon"><Layers3 size={18}/></div><h3>Infrastructure</h3><p>Supabase · SQLite · Git · CI</p></div><div className="stack-group"><div className="stack-icon"><Bot size={18}/></div><h3>AI & automation</h3><p>Groq · OpenRouter · Agent tooling</p></div></div>
      </section>
      <section className="contact-section section-wrap" id="contact"><div className="contact-panel reveal"><div className="contact-orb"/><div className="eyebrow"><span className="eyebrow-dot"/> OPEN SOURCE / OPEN TO IDEAS</div><h2>Have something<br/>interesting in mind<span className="gradient-text">?</span></h2><p>For project conversations, collaboration, or a good technical discussion, the best way to reach me is by email or Instagram.</p>
          <div className="contact-links">
            <a className="contact-link" href="mailto:sectorx83@gmail.com"><span className="contact-link-icon"><Mail size={18}/></span><span className="contact-link-copy"><small>EMAIL</small><strong>sectorx83@gmail.com</strong></span><ArrowUpRight size={17}/></a>
            <a className="contact-link" href="https://www.instagram.com/manazz.io/" target="_blank" rel="noreferrer"><span className="contact-link-icon"><Instagram size={18}/></span><span className="contact-link-copy"><small>INSTAGRAM</small><strong>@manazz.io</strong></span><ArrowUpRight size={17}/></a>
          </div>
          <a className="contact-github" href={github} target="_blank" rel="noreferrer"><Github size={15}/> Or explore the code on GitHub <ArrowUpRight size={14}/></a>
          <div className="contact-corner">TYLER / SECTORX83</div></div></section>
    </main>
    <footer className="footer section-wrap"><a className="brand footer-brand" href="#home"><span className="brand-mark">T<span>.</span></span><span className="brand-name">TYLER<span className="brand-slash">/</span>DEV</span></a><span className="footer-note">Designed & built with intent.</span><div className="footer-socials"><a href="mailto:sectorx83@gmail.com" aria-label="Email Tyler"><Mail size={15}/></a><a href="https://www.instagram.com/manazz.io/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={15}/></a><a href={github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={15}/></a></div><span className="copyright">© {new Date().getFullYear()} TYLER</span></footer>
  </div>
}
export default App