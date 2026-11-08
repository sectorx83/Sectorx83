import { useEffect, useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Atom, Bot, Code2, Cpu, ExternalLink, Github, Instagram, Layers3, Mail, Menu, Radio, Terminal, X } from 'lucide-react'

const github = 'https://github.com/sectorx83'
const projects = [
  { id:'d3x8', number:'01', name:'D3X8', type:'Operating system', category:'Systems', status:'Active development', tone:'live', description:'A 64-bit x86_64 operating system built from the ground up — custom kernel, userspace, drivers, networking, and a graphical desktop.', details:'Kernel engineering · SMP · ELF64 · Harp desktop', stack:['C','x86_64 ASM','Limine','Make'], icon:Cpu, featured:true, href:'https://github.com/sectorx83/D3X8', accent:'violet' },
  { id:'flux', number:'02', name:'Flux Agent', type:'AI developer tooling', category:'AI', status:'Phase 3 · in progress', tone:'progress', description:'A local-first AI agent and automation CLI with planning, approval-gated build tools, provider fallbacks, memory, and remote task execution.', details:'Multi-provider · Multi-agent · Local-first', stack:['Python','Groq','OpenRouter','SQLite'], icon:Bot, featured:true, href:'https://github.com/sectorx83/Flux-agent', accent:'cyan' },
  { id:'cathedral', number:'03', name:'Cathedral', type:'Developer infrastructure', category:'Infrastructure', status:'Phase 4 · in progress', tone:'progress', description:'An open computing laboratory for running isolated software experiments, inspecting runtime behavior, and reproducing environments.', details:'Rust core · Linux isolation · Desktop studio', stack:['Rust','Tauri','React','SQLite'], icon:Layers3, featured:true, href:'https://github.com/sectorx83/Cathedral', accent:'amber' },
  { id:'gravity', number:'04', name:'Gravity', type:'Computational runtime', category:'Systems', status:'Phase 2 · in progress', tone:'progress', description:'An adaptive computational runtime exploring safe live topology changes while preserving required state and correctness.', details:'Mutable graphs · State transfer · Runtime evolution', stack:['Rust','Graph runtime','CLI'], icon:Atom, featured:false, href:'https://github.com/sectorx83/Gravity', accent:'rose' },
  { id:'edith', number:'05', name:'EDITH X1', type:'AI assistant platform', category:'AI', status:'Live', tone:'complete', description:'A multi-user AI assistant with chat, voice input, configurable behavior, and an execution layer for connected workflows.', details:'AI chat · Voice interface · Supabase', stack:['React','TypeScript','TanStack','Supabase'], icon:Radio, featured:false, href:'https://github.com/sectorx83/edithx1', live:'https://www.edithx1.vercel.app', accent:'green' },
]
const filters = ['All','Systems','AI','Infrastructure']
const profilePic = 'https://avatars.githubusercontent.com/u/352018852?v=4'
const projectPages: Record<string, { kicker:string; headline:string; overview:string; stage:string; focus:string[]; milestones:{label:string;state:'done'|'active'|'next'}[]; limitations:string }> = {
  d3x8: {
    kicker:'SYSTEMS / OPERATING SYSTEM',
    headline:'An operating system, built from the ground up.',
    overview:'D3X8 is a 64-bit x86_64 operating system developed primarily in C and assembly. Its scope spans the kernel, userspace, hardware support, networking, storage, and a custom graphical desktop.',
    stage:'Active development',
    focus:['SMP kernel and preemptive scheduling','ELF64 userspace and dynamic loading','Hardware discovery, interrupts and device drivers','TCP/IP, DNS, HTTP downloads and package tooling','Harp compositor and native desktop applications'],
    milestones:[{label:'Bootable x86_64 kernel and core runtime',state:'done'},{label:'Userspace, drivers and networking foundations',state:'done'},{label:'Memory isolation and broader hardware validation',state:'active'},{label:'Desktop stability and application coverage',state:'active'}],
    limitations:'Process isolation, memory mapping, page-table management, and some graphics and device edge cases remain active areas of development and testing.'
  },
  flux: {
    kicker:'AI / DEVELOPER TOOLING',
    headline:'A local-first agent for real work.',
    overview:'Flux Agent is a developer-focused automation CLI with chat, planning, and approval-gated build modes. It combines provider routing, workspace tools, memory, multi-agent task delegation, workflows, and remote execution.',
    stage:'Phase 1 and 2 complete · Phase 3 in progress',
    focus:['Groq, Gemini, Cerebras and OpenRouter provider routing','Approval-gated workspace edits and shell execution','SQLite notes and optional local semantic memory','Specialist agents, browser automation and workflows','Remote device pairing, task streaming and integrations'],
    milestones:[{label:'Core planning, build tools and workflow automation',state:'done'},{label:'Semantic memory, integrations and remote access',state:'done'},{label:'Signed plugins, deployment tooling and release automation',state:'done'},{label:'Workflow-specific GitHub Actions rollback',state:'next'}],
    limitations:'Provider deployments and real-account integration tests are not run in CI. GitHub Actions rollback remains workflow-specific; Flux does not provide an OS sandbox.'
  },
  cathedral: {
    kicker:'INFRASTRUCTURE / EXPERIMENT LAB',
    headline:'Make software behavior reproducible.',
    overview:'Cathedral is an open computing laboratory for creating isolated experiments, observing runtime behavior, diagnosing failures, and reproducing environments across compatible machines.',
    stage:'Phases 1–3 complete · Phase 4 in progress',
    focus:['Rust CLI and SQLite-backed experiment registry','Linux workload isolation with Bubblewrap and cgroup controls','Snapshots, verification and comparison workflows','Tauri desktop shell and authenticated local API','Live run telemetry, PTY controls and filesystem inspection'],
    milestones:[{label:'Phase 1 — foundation and core engine',state:'done'},{label:'Phase 2 — Linux runtime and observability',state:'done'},{label:'Phase 3 — snapshots and reproducibility',state:'done'},{label:'Phase 4 — desktop lab and advanced experiments',state:'active'}],
    limitations:'Phase 4 validation continues around real sandbox and PTY execution, broader experiments, and installer upgrades. Windows and macOS workload isolation are not supported.'
  },
  gravity: {
    kicker:'SYSTEMS / COMPUTATIONAL RUNTIME',
    headline:'Evolving a running graph without losing its state.',
    overview:'Gravity explores safe live topology transformation: adding, removing, splitting, replacing, and reconnecting computational cells while preserving accepted work and required state.',
    stage:'Phase 1 complete · Phase 2 in progress',
    focus:['Deterministic directed message graph and bounded queues','Transactional cell processing and in-memory snapshots','Topology mutation transactions and work partitioning','Morphological State Transfer and shadow validation','Atomic routing cutover, rollback and measured adaptation'],
    milestones:[{label:'Phase 1 — local runtime foundation',state:'done'},{label:'Runtime topology mutation and partitioning contracts',state:'active'},{label:'Consistent snapshots and state transfer',state:'next'},{label:'Automated failure-injected cutover demonstration',state:'next'}],
    limitations:'Phase 2 is not marked complete until the full demonstration is automated and repeatable, including injected failures during snapshot, migration, validation, and cutover.'
  },
  edith: {
    kicker:'AI / ASSISTANT PLATFORM',
    headline:'A multi-user assistant with voice and tools.',
    overview:'EDITH X1 is a live AI assistant web application built with React, TypeScript, TanStack Start, Vite, and Supabase. It combines conversational AI, voice input, configurable behavior, and an execution layer.',
    stage:'Live application',
    focus:['Multi-user chat with anonymous sessions','Voice input and local speech playback','Configurable assistant behavior','EDITH NETWORK execution layer','Groq-backed chat with server-side credentials'],
    milestones:[{label:'Core web application and chat experience',state:'done'},{label:'Voice input and speech playback',state:'done'},{label:'Execution layer and configuration',state:'done'},{label:'Ongoing provider and product improvements',state:'active'}],
    limitations:'The public README describes the live application and its current setup. Deployment and provider configuration depend on the external Supabase and Groq services.'
  }
}
function ProjectDetail({id}:{id:string}) {
  const project=projects.find(item=>item.id===id)
  const page=projectPages[id]
  if(!project||!page) return <div className="site-shell detail-shell"><main className="detail-not-found"><p>404 / NOT FOUND</p><h1>This project page doesn't exist.</h1><a className="button button-primary" href="/">Back to portfolio <ArrowUpRight size={16}/></a></main></div>
  const Icon=project.icon
  return <div className="site-shell detail-shell">
    <header className="topbar detail-topbar"><a className="brand" href="/"><img className="brand-avatar" src={profilePic} alt="Tyler's GitHub profile picture"/><span className="brand-name">TYLER<span className="brand-slash">/</span>DEV</span></a><nav className="nav-links"><a href="/#work">All projects</a><a href="/#about">About</a><a className="nav-contact" href={project.href} target="_blank" rel="noreferrer">Repository <ArrowUpRight size={14}/></a></nav><a className="detail-mobile-back" href="/#work">← Work</a></header>
    <main className="detail-main section-wrap">
      <a className="back-link" href="/#work"><ArrowDownRight size={15}/> BACK TO SELECTED WORK</a>
      <section className="detail-hero">
        <div className="detail-kicker"><span className="eyebrow-dot"/>{page.kicker}</div>
        <div className="detail-title-row"><div><div className="project-number">/{project.number} — PROJECT FILE</div><h1>{project.name}<span className="heading-period">.</span></h1></div><div className={'detail-project-icon accent-'+project.accent}><Icon size={34} strokeWidth={1.35}/></div></div>
        <p className="detail-headline">{page.headline}</p><p className="detail-overview">{page.overview}</p>
        <div className="detail-actions"><a className="button button-primary" href={project.href} target="_blank" rel="noreferrer"><Github size={16}/> View source <ArrowUpRight size={15}/></a>{project.live&&<a className="button button-quiet" href={project.live} target="_blank" rel="noreferrer">Open live app <ExternalLink size={14}/></a>}<span className={'status status-'+project.tone}><i/>{page.stage}</span></div>
      </section>
      <div className="detail-grid">
        <section className="detail-block"><div className="eyebrow"><span className="eyebrow-dot"/> CORE SYSTEMS</div><h2>What it's made of<span className="heading-period">.</span></h2><div className="detail-focus">{page.focus.map((item,i)=><div className="detail-focus-row" key={item}><span>0{i+1}</span><p>{item}</p><ArrowUpRight size={14}/></div>)}</div></section>
        <section className="detail-block"><div className="eyebrow"><span className="eyebrow-dot"/> DEVELOPMENT LOG</div><h2>Project status<span className="heading-period">.</span></h2><div className="milestone-list">{page.milestones.map((item,i)=><div className="milestone" key={item.label}><span className={'milestone-dot milestone-'+item.state}/><div><small>0{i+1} / {item.state==='done'?'COMPLETE':item.state==='active'?'IN PROGRESS':'UP NEXT'}</small><p>{item.label}</p></div></div>)}</div></section>
      </div>
      <section className="detail-note"><span>ENGINEERING NOTE</span><p>{page.limitations}</p></section>
      <section className="detail-files">
        <div><div className="eyebrow"><span className="eyebrow-dot"/> PROJECT DIRECTORY</div><h2>Files & documentation<span className="heading-period">.</span></h2><p>Browse the project notes and structured metadata stored in this portfolio repository, or open the full implementation in its original repository.</p></div>
        <div className="detail-file-actions"><a href={'https://github.com/sectorx83/Sectorx83/tree/main/projects/' + project.id} target="_blank" rel="noreferrer"><Layers3 size={16}/> Browse portfolio files <ArrowUpRight size={14}/></a><a href={project.href} target="_blank" rel="noreferrer"><Github size={16}/> Browse full source <ArrowUpRight size={14}/></a></div>
      </section>
      <footer className="detail-footer"><a href="/#work">← All projects</a><a href={github} target="_blank" rel="noreferrer">More work on GitHub <ArrowUpRight size={14}/></a></footer>
    </main>
  </div>
}

function App() {
  const routeMatch = window.location.pathname.match(/^\/projects\/([^/]+)\/?$/)
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
  if (routeMatch) return <ProjectDetail id={routeMatch[1]}/>
  return <div className="site-shell">
    <div className="ambient ambient-one"/><div className="ambient ambient-two"/>
    <header className="topbar">
      <a className="brand" href="#home" aria-label="Tyler home"><img className="brand-avatar" src={profilePic} alt="Tyler GitHub avatar"/><span className="brand-name">TYLER<span className="brand-slash">/</span>DEV</span></a>
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
          <div className="project-card-footer"><a href={'/projects/' + project.id + '/'}><span>Project file</span><ArrowUpRight size={13}/></a><a href={project.href} target="_blank" rel="noreferrer"><Github size={15}/> Source <ExternalLink size={12}/></a>{project.live && <a href={project.live} target="_blank" rel="noreferrer">Live app <ArrowUpRight size={13}/></a>}</div>
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
    <footer className="footer section-wrap"><a className="brand footer-brand" href="#home"><img className="brand-avatar" src={profilePic} alt="Tyler GitHub avatar"/><span className="brand-name">TYLER<span className="brand-slash">/</span>DEV</span></a><span className="footer-note">Designed & built with intent.</span><div className="footer-socials"><a href="mailto:sectorx83@gmail.com" aria-label="Email Tyler"><Mail size={15}/></a><a href="https://www.instagram.com/manazz.io/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={15}/></a><a href={github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={15}/></a></div><span className="copyright">© {new Date().getFullYear()} TYLER</span></footer>
  </div>
}
export default App