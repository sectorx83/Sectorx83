import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowDownRight, ArrowUpRight, Atom, Bot, Code2, Cpu, ExternalLink, Github, Instagram, Layers3, Mail, Menu, Radio, Terminal, X } from 'lucide-react'

const github = 'https://github.com/sectorx83'
const projects = [
  { id:'d3x8', number:'01', name:'D3X8', type:'Operating system', category:'Systems', status:'Experimental', tone:'progress', description:'A 64-bit x86_64 operating system built from the ground up: custom kernel, userspace, drivers, networking, and a graphical desktop.', details:'Kernel engineering · SMP · ELF64 · Harp desktop', stack:['C','x86_64 ASM','Limine','Make'], icon:Cpu, href:'https://github.com/sectorx83/D3X8', accent:'oxide', visual:'os' },
  { id:'flux', number:'02', name:'Flux Agent', type:'AI developer tooling', category:'AI', status:'Complete', tone:'complete', description:'A local-first AI agent and automation CLI with planning, approval-gated build tools, provider routing, memory, and remote task execution.', details:'Multi-provider · Multi-agent · Local-first', stack:['Python','Groq','OpenRouter','SQLite'], icon:Bot, href:'https://github.com/sectorx83/Flux-agent', accent:'silver', visual:'flux' },
  { id:'cathedral', number:'03', name:'Cathedral', type:'Developer infrastructure', category:'Infrastructure', status:'Phase 4 / active', tone:'progress', description:'An open computing laboratory for isolated software experiments, runtime inspection, failure diagnosis, and reproducible environments.', details:'Rust core · Linux isolation · Desktop studio', stack:['Rust','Tauri','React','SQLite'], icon:Layers3, href:'https://github.com/sectorx83/Cathedral', accent:'wine', visual:'cathedral' },
  { id:'gravity', number:'04', name:'Gravity', type:'Computational runtime', category:'Systems', status:'Phase 2 complete', tone:'complete', description:'An adaptive computational runtime that evolves a live graph through transactional topology changes while preserving accepted work and state.', details:'Mutable graphs · State transfer · Runtime evolution', stack:['Rust','Graph runtime','CLI'], icon:Atom, href:'https://github.com/sectorx83/Gravity', accent:'red', visual:'gravity' },
  { id:'edith', number:'05', name:'EDITH X1', type:'AI assistant platform', category:'AI', status:'Live', tone:'complete', description:'A multi-user AI assistant with conversational AI, voice input, configurable behavior, and an execution layer for connected workflows.', details:'AI chat · Voice interface · Supabase', stack:['React','TypeScript','TanStack','Supabase'], icon:Radio, href:'https://github.com/sectorx83/edithx1', live:'https://www.edithx1.vercel.app', accent:'olive', visual:'edith' },
]
const filters = ['All','Systems','AI','Infrastructure']
const projectPages: Record<string, { kicker:string; headline:string; overview:string; stage:string; focus:string[]; milestones:{label:string;state:'done'|'active'|'next'}[]; limitations:string }> = {
  d3x8: { kicker:'SYSTEMS / OPERATING SYSTEM', headline:'A computer, from first principles.', overview:'D3X8 is a 64-bit x86_64 operating system developed primarily in C and assembly. Its scope spans the kernel, userspace, hardware support, networking, storage, and a custom graphical desktop.', stage:'Experimental operating system', focus:['SMP kernel and preemptive scheduling','ELF64 userspace and dynamic loading','Hardware discovery, interrupts and device drivers','TCP/IP, DNS, HTTP downloads and package tooling','Harp compositor and native desktop applications'], milestones:[{label:'Bootable x86_64 kernel and core runtime',state:'done'},{label:'Userspace, drivers and networking foundations',state:'done'},{label:'Memory isolation and broader hardware validation',state:'active'},{label:'Desktop stability and application coverage',state:'active'}], limitations:'Process isolation, memory mapping, page-table management, and some graphics and device edge cases remain active areas of development and testing.' },
  flux: { kicker:'AI / DEVELOPER TOOLING', headline:'An agent that gets its hands dirty.', overview:'Flux Agent is a developer-focused automation CLI with chat, planning, and approval-gated build modes. It combines provider routing, workspace tools, memory, multi-agent task delegation, workflows, and remote execution.', stage:'Core platform complete', focus:['Groq, Gemini, Cerebras and OpenRouter provider routing','Approval-gated workspace edits and shell execution','SQLite notes and optional local semantic memory','Specialist agents, browser automation and workflows','Remote device pairing, task streaming and integrations'], milestones:[{label:'Core planning, build tools and workflow automation',state:'done'},{label:'Semantic memory, integrations and remote access',state:'done'},{label:'Signed plugins, deployment tooling and release automation',state:'done'}], limitations:'Provider deployments and real-account integration tests depend on external credentials and are not run in CI. Flux is not an operating-system sandbox.' },
  cathedral: { kicker:'INFRASTRUCTURE / EXPERIMENT LAB', headline:'Make software behavior reproducible.', overview:'Cathedral is an open computing laboratory for creating isolated experiments, observing runtime behavior, diagnosing failures, and reproducing environments across compatible machines.', stage:'Phases 1–3 complete · Phase 4 active', focus:['Rust CLI and SQLite-backed experiment registry','Linux workload isolation with Bubblewrap and cgroup controls','Snapshots, verification and comparison workflows','Tauri desktop shell and authenticated local API','Live run telemetry, PTY controls and filesystem inspection'], milestones:[{label:'Phase 1 — foundation and core engine',state:'done'},{label:'Phase 2 — Linux runtime and observability',state:'done'},{label:'Phase 3 — snapshots and reproducibility',state:'done'},{label:'Phase 4 — desktop lab and advanced experiments',state:'active'}], limitations:'Phase 4 validation continues around real sandbox and PTY execution, broader experiments, and installer upgrades. Windows and macOS workload isolation are not supported.' },
  gravity: { kicker:'SYSTEMS / COMPUTATIONAL RUNTIME', headline:'Change the shape. Keep the state.', overview:'Gravity explores safe live topology transformation: adding, removing, splitting, replacing, and reconnecting computational cells while preserving accepted work and required state.', stage:'Phase 2 complete · CI verified on main', focus:['Deterministic directed message graph and bounded queues','Transactional cell processing with rollback','Live topology mutation and explicit work partitioning','State transfer, shadow validation, and routing cutover','Failure-injected rollback and live evolution demonstration'], milestones:[{label:'Phase 1 — local runtime foundation',state:'done'},{label:'Topology mutation and work partitioning',state:'done'},{label:'Snapshots, state transfer, and candidate validation',state:'done'},{label:'Atomic cutover, rollback, and live evolution CI demo',state:'done'}], limitations:'The runtime remains single-threaded and in-memory. It does not claim distributed consensus, durable cross-process transactions, or automatic partitioning without an explicit partitioner.' },
  edith: { kicker:'AI / ASSISTANT PLATFORM', headline:'A capable interface for everyday intelligence.', overview:'EDITH X1 is a live AI assistant web application built with React, TypeScript, TanStack Start, Vite, and Supabase. It combines conversational AI, voice input, configurable behavior, and an execution layer.', stage:'Live application', focus:['Multi-user chat with anonymous sessions','Voice input and local speech playback','Configurable assistant behavior','EDITH NETWORK execution layer','Groq-backed chat with server-side credentials'], milestones:[{label:'Core web application and chat experience',state:'done'},{label:'Voice input and speech playback',state:'done'},{label:'Execution layer and configuration',state:'done'},{label:'Ongoing provider and product improvements',state:'active'}], limitations:'The public README describes the live application and its current setup. Deployment and provider configuration depend on the external Supabase and Groq services.' }
}
function Brand({small=false}:{small?:boolean}) {
  return <a className={'brand'+(small?' brand-small':'')} href="/" aria-label="Sectorx83 home"><span className="brand-mark">[sx⁸³]<sup>®</sup></span><span className="brand-caption">INDEPENDENT DIGITAL WORKS</span></a>
}
function Artwork({visual}:{visual:string}) {
  return <div className={'project-art art-'+visual} aria-hidden="true">
    <div className="art-grain"/>
    {visual==='os' && <><div className="os-window"><div className="window-bar"><i/><i/><i/><span>HARP / SYSTEM</span></div><div className="os-screen"><b> D3X8 </b><small>64-BIT KERNEL / 001</small><div className="os-lines"><i/><i/><i/></div></div></div><span className="art-index">SYS.001</span></>}
    {visual==='flux' && <><div className="flux-orbit orbit-one"/><div className="flux-orbit orbit-two"/><div className="flux-core">F<span>.</span></div><span className="art-index">AGENT / ACTIVE</span></>}
    {visual==='cathedral' && <><div className="cathedral-arch arch-one"/><div className="cathedral-arch arch-two"/><div className="cathedral-door"/><span className="art-index">LAB / 004</span></>}
    {visual==='gravity' && <><div className="gravity-network"><i/><i/><i/><i/><i/><i/><b/><b/><b/><b/></div><span className="gravity-word">G</span><span className="art-index">RUNTIME / EVOLVE</span></>}
    {visual==='edith' && <><div className="edith-ring ring-one"/><div className="edith-ring ring-two"/><div className="edith-core"><span>e</span></div><span className="art-index">VOICE / INTERFACE</span></>}
  </div>
}
function ProjectDetail({id}:{id:string}) {
  const project=projects.find(item=>item.id===id)
  const page=projectPages[id]
  if(!project||!page) return <div className="site-shell"><main className="not-found"><p>404 / NOT FOUND</p><h1>This project file is missing.</h1><a className="text-link" href="/">Return home <ArrowUpRight size={16}/></a></main></div>
  const Icon=project.icon
  return <div className="site-shell detail-shell">
    <header className="topbar detail-topbar"><Brand/><nav className="nav-links"><a href="/#work">Selected work</a><a href="/#about">About</a><a href="/#contact">Contact</a></nav><a className="nav-cta" href={project.href} target="_blank" rel="noreferrer">Repository <ArrowUpRight size={14}/></a></header>
    <main className="detail-main section-wrap">
      <a className="back-link" href="/#work"><ArrowDownRight size={14}/> ALL PROJECTS</a>
      <div className="detail-hero">
        <div className="eyebrow"><span className="eyebrow-dot"/>{page.kicker}</div>
        <div className="detail-heading-row"><div><span className="project-index">PROJECT / {project.number}</span><h1>{project.name}<span>.</span></h1></div><div className={'detail-icon accent-'+project.accent}><Icon size={32}/></div></div>
        <p className="detail-headline">{page.headline}</p><p className="detail-overview">{page.overview}</p>
        <div className="detail-actions"><a className="button button-dark" href={project.href} target="_blank" rel="noreferrer"><Github size={16}/> Source code <ArrowUpRight size={14}/></a>{project.live&&<a className="button button-outline" href={project.live} target="_blank" rel="noreferrer">Open live app <ExternalLink size={14}/></a>}<span className={'status status-'+project.tone}><i/>{page.stage}</span></div>
      </div>
      <div className="detail-art-wrap"><Artwork visual={project.visual}/></div>
      <div className="detail-grid">
        <section className="detail-block"><div className="eyebrow">01 / SYSTEMS & CAPABILITIES</div><h2>Under the hood<span>.</span></h2><div className="detail-focus">{page.focus.map((item,i)=><div className="detail-focus-row" key={item}><span>0{i+1}</span><p>{item}</p><ArrowUpRight size={14}/></div>)}</div></section>
        <section className="detail-block"><div className="eyebrow">02 / DEVELOPMENT LOG</div><h2>Where it stands<span>.</span></h2><div className="milestone-list">{page.milestones.map((item,i)=><div className="milestone" key={item.label}><span className={'milestone-dot milestone-'+item.state}/><div><small>0{i+1} / {item.state==='done'?'COMPLETE':item.state==='active'?'IN PROGRESS':'UP NEXT'}</small><p>{item.label}</p></div></div>)}</div></section>
      </div>
      <section className="detail-note"><span>ENGINEERING NOTE</span><p>{page.limitations}</p></section>
      <div className="detail-bottom"><a className="text-link" href="/#work">← Back to selected work</a><a className="text-link" href={project.href} target="_blank" rel="noreferrer">Explore repository <ArrowUpRight size={15}/></a></div>
    </main>
    <footer className="footer section-wrap"><Brand small/><span>© {new Date().getFullYear()} SECTORX83</span><a href="/#contact">Get in touch <ArrowUpRight size={14}/></a></footer>
  </div>
}
function IntroLoader() {
  const [visible,setVisible] = useState(() => {
    try { return !sessionStorage.getItem('sx83-intro-seen') } catch { return true }
  })
  const [progress,setProgress] = useState(0)
  const [message,setMessage] = useState('Preparing the workspace')
  useEffect(() => {
    if (!visible) return
    const messages = ['Preparing the workspace','Mapping the signal','Warming up the systems','Opening the studio','Almost ready']
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 350 : 800 + Math.random() * 3600
    const started = Date.now()
    setMessage(messages[Math.floor(Math.random() * messages.length)])
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - started
      setProgress(Math.min(94, Math.round((elapsed / duration) * 94)))
    }, 32)
    const finish = window.setTimeout(() => {
      setProgress(100)
      try { sessionStorage.setItem('sx83-intro-seen','1') } catch {}
      window.setTimeout(() => setVisible(false), 520)
    }, duration)
    return () => { window.clearInterval(tick); window.clearTimeout(finish) }
  }, [visible])
  if (!visible) return null
  return <div className="intro-loader" role="status" aria-live="polite">
    <div className="intro-loader-inner">
      <div className="intro-loader-top"><span className="intro-brand">[sx⁸³]<sup>®</sup></span><span>INDEPENDENT DIGITAL WORKS</span></div>
      <div className="intro-loader-center"><span className="intro-kicker">SECTORX83 / INITIALIZING</span><h1>Ideas into<br/><em>infrastructure.</em></h1><p>{message}<span className="loader-ellipsis">...</span></p></div>
      <div className="intro-loader-bottom"><div className="loader-track"><span style={{width:progress+'%'}}/></div><div className="loader-meta"><span>LOADING EXPERIENCE</span><strong>{String(progress).padStart(2,'0')}%</strong></div><span className="loader-foot">BUILT WITH INTENT. / SX83 © 2026</span></div>
    </div>
  </div>
}


function ScrollProgress() {
  const [progress,setProgress] = useState(0)
  useEffect(() => {
    let frame = 0
    const update = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        const range = document.documentElement.scrollHeight - window.innerHeight
        setProgress(range > 0 ? (window.scrollY / range) * 100 : 0)
        frame = 0
      })
    }
    window.addEventListener('scroll',update,{passive:true})
    update()
    return () => { window.removeEventListener('scroll',update); if(frame) window.cancelAnimationFrame(frame) }
  },[])
  return <div className="scroll-progress" aria-hidden="true"><span style={{width:progress+'%'}}/></div>
}
function CustomCursor() {
  const [position,setPosition] = useState({x:-100,y:-100})
  const [active,setActive] = useState(false)
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const move = (event:PointerEvent) => setPosition({x:event.clientX,y:event.clientY})
    const over = (event:PointerEvent) => setActive(Boolean((event.target as HTMLElement).closest('a,button,[role="button"]')))
    const out = () => setActive(false)
    window.addEventListener('pointermove',move,{passive:true})
    document.addEventListener('pointerover',over)
    document.addEventListener('pointerout',out)
    document.documentElement.classList.add('has-custom-cursor')
    return () => {
      window.removeEventListener('pointermove',move)
      document.removeEventListener('pointerover',over)
      document.removeEventListener('pointerout',out)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  },[])
  return <div className={active?'custom-cursor is-active':'custom-cursor'} style={{transform:'translate3d('+position.x+'px,'+position.y+'px,0)'}} aria-hidden="true"/>
}
function StudioClock() {
  const [now,setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()),30000)
    return () => window.clearInterval(timer)
  },[])
  return <span className="studio-clock"><i/> LOCAL TIME / {new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hour12:false}).format(now)} IST</span>
}

function App() {
  const routeMatch = window.location.pathname.match(/^\/projects\/([^/]+)\/?$/)
  const [filter,setFilter] = useState('All')
  const [mobileOpen,setMobileOpen] = useState(false)
  const visibleProjects = useMemo(() => projects.filter(p => filter === 'All' || p.category === filter),[filter])
  const closeMenu = () => setMobileOpen(false)
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (!('IntersectionObserver' in window)) { elements.forEach(el => el.classList.add('is-visible')); return }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
    }),{threshold:0.12,rootMargin:'0px 0px -42px 0px'})
    elements.forEach((el,index)=>{el.style.setProperty('--delay',`${Math.min(index%5,4)*65}ms`);observer.observe(el)})
    return ()=>observer.disconnect()
  },[])
  if(routeMatch) return <><IntroLoader/><ProjectDetail id={routeMatch[1]}/></>
  return <><IntroLoader/><ScrollProgress/><CustomCursor/><div className="site-shell">
    <header className="topbar">
      <Brand/>
      <nav className={mobileOpen?'nav-links nav-open':'nav-links'}>
        <a href="#work" onClick={closeMenu}>Work <span>01</span></a><a href="#about" onClick={closeMenu}>About <span>02</span></a><a href="#stack" onClick={closeMenu}>Capabilities <span>03</span></a><a href="#contact" onClick={closeMenu}>Contact <span>04</span></a>
      </nav>
      <a className="nav-cta" href={github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14}/></a>
      <button className="mobile-menu" onClick={()=>setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">{mobileOpen?<X size={20}/>:<Menu size={20}/>}</button>
    </header>
    <main id="home">
      <section className="hero section-wrap">
        <div className="hero-topline"><span>INDEPENDENT DEVELOPER / INDIA</span><span>EST. 2024 — PRESENT</span></div>
        <div className="hero-copy reveal"><div className="eyebrow"><span className="eyebrow-dot"/> DESIGNING SYSTEMS. BUILDING SOFTWARE.</div>
          <h1>Ideas into<br/><em>infrastructure.</em></h1>
          <div className="hero-bottom"><p>I’m Tyler. I build software at the intersection of systems engineering, developer tools, and applied AI. Curious by default. Serious about the details.</p><a className="round-link" href="#work" aria-label="Explore selected work"><ArrowDown size={22}/></a></div>
        </div>
        <div className="hero-stage reveal">
          <div className="hero-stage-top"><span>SECTORX83 / DIGITAL WORKS</span><span>FIG. 001 — SELECTED SIGNALS</span></div>
          <div className="hero-stage-art"><div className="stage-grid"/><div className="stage-typemark">sx<span>⁸³</span></div><div className="stage-orbit stage-orbit-a"/><div className="stage-orbit stage-orbit-b"/><div className="stage-cross">+</div><div className="stage-coordinate">10°31' N<br/>76°13' E</div><div className="stage-stamp">BUILT<br/>NOT BOUGHT</div></div>
          <div className="hero-stage-bottom"><span>ENGINEERING / EXPERIMENT / EXECUTION</span><span>SCROLL TO EXPLORE ↓</span></div>
        </div>
        <div className="hero-index-row"><span>01 — 05 / SELECTED WORK</span><span>OPEN SOURCE, ALWAYS IN PROGRESS.</span></div>
      </section>
      <section className="work-section section-wrap" id="work">
        <div className="section-heading reveal"><div><div className="eyebrow">01 / SELECTED WORK</div><h2>Built to <em>matter.</em></h2></div><p>Five ongoing experiments in making software more capable, understandable, and useful.</p></div>
        <div className="work-toolbar"><div className="project-count">INDEX <strong>05</strong> / PROJECTS</div><div className="filter-row" aria-label="Filter projects">{filters.map(item=><button key={item} className={filter===item?'filter-button active':'filter-button'} onClick={()=>setFilter(item)}>{item}</button>)}</div></div>
        <div className="project-grid">{visibleProjects.map(project=><article className={'project-card reveal accent-'+project.accent} key={project.id}>
          <a className="project-art-link" href={'/projects/'+project.id+'/'} aria-label={'Open '+project.name+' project file'}><Artwork visual={project.visual}/><span className="art-open"><ArrowUpRight size={18}/></span></a>
          <div className="project-info"><div className="project-meta"><span>{project.number} / {project.type}</span><span className={'status status-'+project.tone}><i/>{project.status}</span></div>
            <div className="project-title-row"><div><h3>{project.name}<span>.</span></h3><p>{project.description}</p></div><a className="project-arrow" href={project.href} target="_blank" rel="noreferrer" aria-label={'Open '+project.name+' source'}><ArrowUpRight size={20}/></a></div>
            <div className="project-footer"><div className="tag-row">{project.stack.map(tag=><span className="tech-tag" key={tag}>{tag}</span>)}</div><a href={'/projects/'+project.id+'/'}>EXPLORE PROJECT <ArrowUpRight size={13}/></a></div>
          </div>
        </article>)}</div>
        <div className="all-repos"><span>MORE EXPERIMENTS LIVE ON GITHUB</span><a href={github+'?tab=repositories'} target="_blank" rel="noreferrer">Browse all repositories <ArrowUpRight size={15}/></a></div>
      </section>
      <section className="manifesto-section">
        <div className="section-wrap manifesto-inner reveal"><span className="eyebrow">02 / THE APPROACH</span><h2>Not just software.<br/><em>Systems that make sense.</em></h2><div className="manifesto-bottom"><p>From a kernel scheduler to an AI workflow, the interesting part is always what happens beneath the surface.</p><span>THINK DEEPLY. BUILD CAREFULLY. SHIP HONESTLY.</span></div></div>
      </section>
      <section className="about-section section-wrap" id="about">
        <div className="about-heading reveal"><div className="eyebrow">03 / A LITTLE CONTEXT</div><h2>Curiosity,<br/><em>made tangible.</em></h2><span className="about-giant">sx⁸³</span></div>
        <div className="about-content reveal"><p className="about-statement">I’m Tyler, an independent developer from India. I learn by building systems, testing ideas, and figuring out what happens beneath the surface.</p><p className="about-body">My work moves between operating-system development, computational runtimes, developer infrastructure, and AI tooling. I enjoy working close to the fundamentals, but care just as much about making the result understandable and useful. Clear documentation and honest progress matter more than inflated claims.</p>
          <div className="principles"><div><span>01</span><strong>Start at the source</strong><p>Understand the system before adding abstraction.</p></div><div><span>02</span><strong>Make it useful</strong><p>Turn experiments into tools with a clear purpose.</p></div><div><span>03</span><strong>Show the real state</strong><p>Document limitations as carefully as capabilities.</p></div></div>
        </div>
      </section>
      <section className="building-section section-wrap" id="building">
        <div className="section-heading reveal"><div><div className="eyebrow">04 / IN THE WORKSHOP</div><h2>On the <em>bench.</em></h2></div><p>Active work, honest status. The next milestone matters more than a polished claim.</p></div>
        <div className="building-list reveal">
          <a className="building-item" href="/projects/cathedral/"><span className="building-index">01</span><span className="building-copy"><strong>Cathedral</strong><small>Phase 4 / desktop studio, experiment controls, and validation</small></span><span className="building-state"><i/> IN PROGRESS</span><ArrowUpRight size={17}/></a>
          <a className="building-item" href="/projects/d3x8/"><span className="building-index">02</span><span className="building-copy"><strong>D3X8</strong><small>Experimental OS / kernel, memory, and desktop stability</small></span><span className="building-state"><i/> EXPERIMENTAL</span><ArrowUpRight size={17}/></a>
          <a className="building-item building-complete" href="/projects/gravity/"><span className="building-index">03</span><span className="building-copy"><strong>Gravity</strong><small>Phase 2 evolution engine / verified on main</small></span><span className="building-state"><i/> VERIFIED</span><ArrowUpRight size={17}/></a>
        </div>
      </section>
      <section className="timeline-section section-wrap" id="timeline">
        <div className="section-heading reveal"><div><div className="eyebrow">05 / THE RECORD</div><h2>Built in <em>public.</em></h2></div><p>A living record of experiments, releases, and the work still taking shape.</p></div>
        <div className="timeline-track reveal">
          <article className="timeline-entry"><span className="timeline-date">2024 / ORIGIN</span><i/><div><h3>The first systems experiments</h3><p>Started exploring software from the lower layers, with an emphasis on learning by building.</p></div></article>
          <article className="timeline-entry"><span className="timeline-date">2025 / EXPANSION</span><i/><div><h3>Tools, runtimes, and interfaces</h3><p>Expanded into developer infrastructure, computational runtimes, and practical AI tooling.</p></div></article>
          <article className="timeline-entry timeline-current"><span className="timeline-date">2026 / IN PROGRESS</span><i/><div><h3>Making the experiments real</h3><p>Hardening projects, documenting the engineering, and shipping usable software in the open.</p></div></article>
        </div>
      </section>
      <section className="stack-section section-wrap" id="stack">
        <div className="section-heading reveal"><div><div className="eyebrow">05 / CAPABILITIES</div><h2>Tools of the <em>trade.</em></h2></div><p>Technologies reflected across the public projects and experiments.</p></div>
        <div className="stack-grid reveal"><div className="stack-group"><Terminal size={19}/><span>01 / SYSTEMS</span><h3>Close to the metal</h3><p>Rust · C · x86_64 Assembly · Linux</p></div><div className="stack-group"><Code2 size={19}/><span>02 / APPLICATIONS</span><h3>Interfaces & tools</h3><p>TypeScript · React · Python · Vite</p></div><div className="stack-group"><Layers3 size={19}/><span>03 / INFRASTRUCTURE</span><h3>Reliable foundations</h3><p>Supabase · SQLite · Git · CI</p></div><div className="stack-group"><Bot size={19}/><span>04 / AI & AUTOMATION</span><h3>Useful intelligence</h3><p>Groq · OpenRouter · Agent tooling</p></div></div>
      </section>
      <section className="contact-section" id="contact"><div className="section-wrap contact-inner reveal"><div className="eyebrow">06 / START A CONVERSATION</div><h2>Have a good<br/><em>problem to solve?</em></h2><div className="contact-bottom"><p>For project conversations, collaboration, or a thoughtful technical discussion. I’m always interested in work with a clear purpose.</p><div className="contact-links"><a href="mailto:sectorx83@gmail.com"><span>EMAIL</span><strong>sectorx83@gmail.com</strong><ArrowUpRight size={17}/></a><a href="https://www.instagram.com/manazz.io/" target="_blank" rel="noreferrer"><span>INSTAGRAM</span><strong>@manazz.io</strong><ArrowUpRight size={17}/></a><a href={github} target="_blank" rel="noreferrer"><span>GITHUB</span><strong>github.com/sectorx83</strong><ArrowUpRight size={17}/></a></div></div></div></section>
    </main>
    <footer className="footer section-wrap"><Brand small/><span className="footer-note">INDEPENDENT DIGITAL WORKS / INDIA</span><StudioClock/><div className="footer-socials"><a href="mailto:sectorx83@gmail.com" aria-label="Email"><Mail size={16}/></a><a href="https://www.instagram.com/manazz.io/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={16}/></a><a href={github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={16}/></a></div><span className="copyright">© {new Date().getFullYear()} SECTORX83</span></footer>
  </div></>
}
export default App
