import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowDownRight, ArrowUpRight, ArrowUp, Github, Instagram, MoveUpRight, Menu, X, Sparkles, Terminal, Copy, Check, FlaskConical, BookOpen, Command } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
const ExperienceScene = lazy(() => import("./components/Experience"));
import { projects, toolkit } from "./data/projects";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

function Loader({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1180);
      setProgress(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) frame = requestAnimationFrame(tick);
      else window.setTimeout(onFinish, 120);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onFinish]);
  return (
    <motion.div className="preloader" initial={{ opacity: 1 }} exit={{ opacity: 0, y: "-100%" }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}>
      <div className="loader-top"><span>SECTORX83®</span><span>INDEPENDENT DIGITAL PRACTICE / 2026</span></div>
      <div className="loader-center">
        <div className="loader-glyph"><span>83</span><i /><i /><i /></div>
        <p>MAKING IDEAS MOVE<br /><b>PLEASE STAND BY.</b></p>
      </div>
      <div className="loader-bottom"><span>BUILDING THE EXPERIENCE</span><span>{String(progress).padStart(2, "0")}%</span></div>
      <div className="loader-line"><i style={{ width: progress + "%" }} /></div>
    </motion.div>
  );
}

function ProjectVisual({ type }: { type: string }) {
  if (type === "gravity") return <div className="visual-gravity"><div className="gravity-grid" /><div className="gravity-sphere"><i /><i /><i /></div><span className="visual-coord">FIELD / 001</span></div>;
  if (type === "cathedral") return <div className="visual-cathedral"><div className="cathedral-sun" /><div className="cathedral-arches"><i /><i /><i /><i /><i /></div><div className="cathedral-floor" /><span className="visual-coord">OBSERVATION ROOM</span></div>;
  if (type === "flux") return <div className="visual-flux"><div className="flux-orbit flux-orbit-a" /><div className="flux-orbit flux-orbit-b" /><div className="flux-node flux-node-a">PLAN</div><div className="flux-node flux-node-b">ACT</div><div className="flux-node flux-node-c">VERIFY</div><span className="visual-coord">AGENT / 003</span></div>;
  if (type === "edith") return <div className="visual-edith"><div className="edith-halo"><i /><i /><i /><b>e</b></div><div className="edith-wave">{Array.from({ length: 32 }, (_, i) => <i key={i} style={{ "--bar": 0.2 + Math.abs(Math.sin(i * 0.72)) * 0.8 } as CSSProperties} />)}</div><span className="visual-coord">VOICE INTERFACE</span></div>;
  return <div className="visual-d3x8"><div className="d3-screen"><div className="d3-screen-head"><i /><i /><i /><span>D3X8 / KERNEL MONITOR</span></div><div className="d3-screen-body"><div className="d3-side"><i /><i /><i /><i /></div><div className="d3-terminal"><span>root@d3x8:~$</span><b>kernel ready_</b><div className="d3-bars">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ "--bar": 18 + ((i * 19) % 64) + "%" } as CSSProperties} />)}</div></div></div></div><span className="visual-coord">SYSTEM / 005</span></div>;
}

function ProjectCard({ project, index, onOpen }: { project: (typeof projects)[number]; index: number; onOpen: (project: (typeof projects)[number]) => void }) {
  return (
    <motion.article className={"project-card project-" + project.slug} initial={{ opacity: 0, y: 80, rotateX: 7 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.9, delay: index * 0.035, ease: [0.2, 0.75, 0.2, 1] }}>
      <a className="project-image" href={project.href} target="_blank" rel="noreferrer" aria-label={"Open " + project.name + " on GitHub"}>
        <ProjectVisual type={project.visual} />
        <span className="project-image-index">SELECTED WORK / {project.number}</span>
        <span className="project-image-open"><ArrowUpRight size={22} /></span>
        <span className="project-image-bottom">{project.metric}</span>
      </a>
      <div className="project-meta"><span>{project.number} / {project.category}</span><span>{project.year}</span></div>
      <div className="project-title-row"><h3>{project.name}</h3><a href={project.href} target="_blank" rel="noreferrer" aria-label={"Explore " + project.name}><MoveUpRight size={21} /></a></div>
      <p className="project-description">{project.description}</p>
      <div className="project-tags">{project.stack.map(tag => <span key={tag}>{tag}</span>)}</div><button className="project-dossier-link" onClick={() => onOpen(project)}>OPEN PROJECT DOSSIER <ArrowUpRight size={14} /></button>
    </motion.article>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState("00:00:00");
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[number] | null>(null);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLines, setTerminalLines] = useState<string[]>(["SECTORX83 INTERACTIVE SHELL / VERSION 1.0", "Type help to inspect available commands."]);
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const finishLoader = useCallback(() => setLoading(false), []);

  useEffect(() => {
    const updateTime = () => setTime(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date()));
    updateTime();
    const timer = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.18, smoothWheel: true, wheelMultiplier: 0.86, touchMultiplier: 1.35 });
    let raf = 0;
    const rafLoop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(rafLoop);
    };
    if (!reduced) raf = requestAnimationFrame(rafLoop);
    lenis.on("scroll", () => ScrollTrigger.update());
    const update = () => ScrollTrigger.refresh();
    window.addEventListener("load", update);
    const ctx = gsap.context(() => {
      gsap.from(".hero-kicker span, .hero-foot > *", { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, delay: 0.25, ease: "power3.out" });
      gsap.from(".hero-title .line-inner", { yPercent: 115, rotate: 3, duration: 1.25, stagger: 0.13, delay: 0.22, ease: "power4.out" });
      gsap.to(".hero-orbit-label", { rotate: 360, duration: 28, repeat: -1, ease: "none" });
      gsap.to(".hero-vertical", { y: -80, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });
      gsap.utils.toArray<HTMLElement>(".section-kicker, .section-title, .about-copy p, .tool-row, .contact-content").forEach((el) => {
        gsap.from(el, { y: 46, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card, index) => {
        gsap.fromTo(card.querySelector(".project-image"), { clipPath: "inset(10% 8% 10% 8% round 2px)", scale: 0.92 }, {
          clipPath: "inset(0% 0% 0% 0% round 2px)", scale: 1, ease: "none",
          scrollTrigger: { trigger: card, start: "top 88%", end: "top 36%", scrub: 1 }
        });
        gsap.to(card.querySelector(".project-image"), { y: index % 2 ? -16 : 16, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 1.2 } });
      });
      gsap.to(".about-orbit", { rotate: 360, duration: 34, repeat: -1, ease: "none" });
      gsap.to(".contact-orb", { y: -22, rotate: 7, duration: 5.5, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(".hero-grid", { backgroundPosition: "100px 180px, 180px 100px", duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".hero-eyebrow svg", { rotate: 360, scale: 1.35, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card, index) => {
        gsap.from(card.querySelector(".project-meta"), { x: index % 2 ? 28 : -28, opacity: 0, duration: 0.75, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 78%", once: true } });
        gsap.from(card.querySelector(".project-tags"), { y: 16, opacity: 0, duration: 0.7, delay: 0.18, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 72%", once: true } });
      });
      gsap.to(".ticker-track", { skewX: -2, duration: 2.4, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(".hero-grid", { backgroundPosition: "72px 72px, -72px -72px", duration: 24, repeat: -1, ease: "none" });
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card, index) => {
        const visual = card.querySelector(".project-image");
        gsap.fromTo(visual, { filter: "saturate(.78) contrast(1.18)" }, {
          filter: "saturate(1.12) contrast(1.04)", duration: 1.1, ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 82%", once: true }
        });
        gsap.to(visual, { "--glitch-shift": index % 2 ? "3px" : "-3px", duration: .08, repeat: 3, yoyo: true, paused: true, onComplete: () => gsap.set(visual, { "--glitch-shift": "0px" }) });
        ScrollTrigger.create({
          trigger: card, start: "top 78%", once: true,
          onEnter: () => gsap.fromTo(visual, { x: -5, skewX: index % 2 ? 1.2 : -1.2 }, { x: 0, skewX: 0, duration: .42, ease: "steps(4)" })
        });
      });
      gsap.utils.toArray<HTMLElement>(".section-kicker").forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(0 100% 0 0)", x: -12 }, {
          clipPath: "inset(0 0% 0 0)", x: 0, duration: .85, ease: "steps(8)",
          scrollTrigger: { trigger: el, start: "top 92%", once: true }
        });
      });
      gsap.to(".comic-glitch-overlay", { opacity: .2, duration: .06, repeat: -1, yoyo: true, repeatDelay: 5.8, ease: "steps(1)" });
      gsap.utils.toArray<HTMLElement>(".tool-row").forEach((row, index) => {
        gsap.fromTo(row, { x: index % 2 ? 18 : -18, clipPath: "inset(0 0 0 8%)" }, {
          x: 0, clipPath: "inset(0 0 0 0)", duration: .7, ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 90%", once: true }
        });
      });
      gsap.to(".hero-orbit-label", { scale: 1.04, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(".scroll-progress i", { scaleX: 1, ease: "none", scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.18 } });
      gsap.from(".principle-row > div", { y: 54, opacity: 0, rotateX: 12, transformOrigin: "50% 100%", stagger: 0.14, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".principle-row", start: "top 86%", once: true } });
      gsap.from(".social-links a", { x: 24, opacity: 0, stagger: 0.13, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".social-links", start: "top 92%", once: true } });
      gsap.from(".lab-card", { y: 58, opacity: 0, rotateY: -7, stagger: 0.12, duration: 0.95, ease: "power3.out", scrollTrigger: { trigger: ".lab-grid", start: "top 84%", once: true } });
      gsap.from(".journal-entry", { x: -34, opacity: 0, stagger: 0.14, duration: 0.85, ease: "power3.out", scrollTrigger: { trigger: ".journal-list", start: "top 86%", once: true } });
      gsap.from(".work-outro > *", { y: 18, opacity: 0, stagger: 0.12, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".work-outro", start: "top 92%", once: true } });
      gsap.utils.toArray<HTMLElement>(".section-kicker").forEach((el) => {
        gsap.from(el, { x: -32, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 94%", once: true } });
      });
    }, root);
    return () => {
      window.removeEventListener("load", update);
      cancelAnimationFrame(raf);
      ctx.revert();
      lenis.destroy();
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer:fine)").matches) return;
    const cursor = document.querySelector<HTMLElement>(".cursor");
    const dot = document.querySelector<HTMLElement>(".cursor-dot");
    if (!cursor || !dot) return;
    const x = gsap.quickTo(cursor, "x", { duration: 0.48, ease: "power3" });
    const y = gsap.quickTo(cursor, "y", { duration: 0.48, ease: "power3" });
    const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2" });
    const move = (event: PointerEvent) => { x(event.clientX); y(event.clientY); dx(event.clientX); dy(event.clientY); };
    const hover = (event: Event) => cursor.classList.toggle("is-hover", !!(event.target as HTMLElement).closest("a,button"));
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", hover);
    return () => { window.removeEventListener("pointermove", move); document.removeEventListener("pointerover", hover); };
  }, [reduced]);

  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer:fine)").matches) return;
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".project-image"));
    const move = (event: PointerEvent) => {
      const card = event.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", (px * 7).toFixed(2) + "deg");
      card.style.setProperty("--tilt-y", (-py * 7).toFixed(2) + "deg");
      card.style.setProperty("--spot-x", (event.clientX - rect.left) + "px");
      card.style.setProperty("--spot-y", (event.clientY - rect.top) + "px");
    };
    const reset = (event: PointerEvent) => {
      const card = event.currentTarget as HTMLElement;
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    };
    cards.forEach(card => {
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", reset);
    });
    return () => cards.forEach(card => {
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", reset);
    });
  }, [reduced]);

  const closeMenu = () => setMenuOpen(false);
  const runTerminalCommand = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const command = terminalInput.trim().toLowerCase();
    if (!command) return;
    const responses: Record<string, string[]> = {
      help: ["Available: help, projects, about, toolkit, experiments, journal, contact, clear, exit"],
      projects: projects.map((project) => project.number + "  " + project.name + "  /  " + project.category),
      about: ["Independent developer focused on systems, AI tooling, developer infrastructure and digital experiences."],
      toolkit: ["Rust · Python · TypeScript · C/C++ · React · Tauri · Linux systems · AI tooling"],
      experiments: ["Open the Experiments Lab to explore visual studies, runtime concepts and isolation research."],
      journal: ["Open the Engineering Journal for notes on topology, reproducibility and low-level debugging."],
      contact: ["sectorx83@gmail.com", "github.com/sectorx83", "instagram.com/manazz.io"],
      clear: [],
      exit: ["Closing interactive shell."]
    };
    if (command === "clear") setTerminalLines([]);
    else if (command === "exit") setTerminalOpen(false);
    else setTerminalLines((lines) => [...lines, "visitor@sectorx83:~$ " + command, ...(responses[command] ?? ["Command not found: " + command + ". Type help for the command index."])].slice(-18));
    setTerminalInput("");
  };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("sectorx83@gmail.com");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = "mailto:sectorx83@gmail.com";
    }
  };
  return (
    <div className="site-shell" ref={root}>
      <AnimatePresence>{loading && <Loader onFinish={finishLoader} />}</AnimatePresence>
      <div className="cursor" /><div className="cursor-dot" />
      <div className="noise-layer" /><div className="retro-scanlines" aria-hidden="true" /><div className="retro-vignette" aria-hidden="true" /><div className="comic-glitch-overlay" aria-hidden="true" /><div className="scroll-progress" aria-hidden="true"><i /></div>
      <header className="site-header">
        <a href="#top" className="brand" aria-label="sectorx83 home"><span className="brand-mark">s<span>×</span></span><span>SECTORX83<sup>®</sup></span></a>
        <nav className={menuOpen ? "main-nav is-open" : "main-nav"}>
          <a href="#work" onClick={closeMenu}>WORK <sup>05</sup></a><a href="#about" onClick={closeMenu}>ABOUT</a><a href="#toolkit" onClick={closeMenu}>TOOLKIT</a><a href="#lab" onClick={closeMenu}>LAB</a><a href="#journal" onClick={closeMenu}>JOURNAL</a><button className="nav-terminal" onClick={() => { closeMenu(); setTerminalOpen(true); }}><Terminal size={13} /> TERMINAL</button>
        </nav>
        <div className="header-right"><span className="live-indicator"><i /> AVAILABLE FOR IDEAS</span><button className="terminal-trigger" onClick={() => setTerminalOpen(true)} aria-label="Open interactive terminal"><Terminal size={16} /></button><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X /> : <Menu />}</button></div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-grid" />
          <div className="hero-kicker"><span>INDEPENDENT DEVELOPER / DIGITAL CRAFT</span><span>INDIA <i>10°31'N / 76°13'E</i></span></div>
          {!loading && <Suspense fallback={<div className="experience-fallback" />}><ExperienceScene /></Suspense>}
          <div className="hero-vertical"><span>SOFTWARE / SYSTEMS / EXPERIMENTS</span><span className="hero-orbit-label">CREATIVE ENGINEERING · 2026 · </span></div>
          <div className="hero-main">
            <p className="hero-eyebrow"><Sparkles size={13} /> A PERSONAL UNIVERSE IN CONSTANT MOTION</p>
            <h1 className="hero-title"><span className="line"><span className="line-inner">Ideas into</span></span><span className="line"><span className="line-inner"> <em>other</em> worlds.</span></span></h1>
            <div className="hero-foot"><p>I build software, systems and digital experiences. Curious by default. Serious about the details. Always exploring what happens next.</p><a className="discover-link" href="#work"><span>DISCOVER THE WORK</span><ArrowDownRight size={19} /></a></div>
          </div>
          <div className="hero-index"><span>SCROLL TO EXPLORE</span><span>SCROLL / 001 <ArrowDown size={13} /></span></div>
          <div className="hero-coordinates"><span>83° / PERSONAL INDEX</span><span>LOCAL TIME <b>{time}</b></span></div>
        </section>

        <div className="ticker" aria-hidden="true"><div className="ticker-track">{Array.from({ length: 4 }, (_, i) => <span key={i}>THINK IN SYSTEMS <i>✳</i> BUILD WITH INTENT <i>✳</i> MAKE IT REAL <i>✳</i> STAY CURIOUS <i>✳</i></span>)}</div></div>

        <section className="work-section section-wrap" id="work">
          <div className="section-kicker"><span>01 / SELECTED WORK</span><span>FIVE PROJECTS / ONE CURIOSITY</span></div>
          <div className="work-heading"><h2 className="section-title">Built to<br /><em>be explored.</em></h2><p>Different questions. Different scales. A collection of systems and experiments that started with “what if?”</p></div>
          <div className="project-grid">{projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} onOpen={setSelectedProject} />)}</div>
          <div className="work-outro"><span>THE WORK IS NEVER REALLY FINISHED.</span><a href="https://github.com/sectorx83?tab=repositories" target="_blank" rel="noreferrer">EXPLORE ALL REPOSITORIES <ArrowUpRight size={15} /></a></div>
        </section>

        <section className="about-section section-wrap" id="about">
          <div className="section-kicker"><span>02 / THE PERSON BEHIND THE PIXELS</span><span>INDEPENDENT PRACTICE</span></div>
          <div className="about-layout">
            <div className="about-title-wrap"><span className="eyebrow">A LITTLE CONTEXT</span><h2 className="section-title">Curiosity<br />is the <em>engine.</em></h2><div className="about-orbit"><span>83</span><i /><i /><i /></div></div>
            <div className="about-copy"><p className="about-lede">I’m an independent developer interested in how software works, how it feels, and what happens when you push it a little further.</p><p>My work moves between systems programming, developer infrastructure, AI tooling and full-stack products. I enjoy the hard parts: lifecycle management, state, scheduling, reliability and the details that make an experience feel considered.</p><p>I learn by building, testing, studying established projects and being honest about what works. The goal is to make something useful, understandable and worth maintaining.</p><a className="text-arrow" href="https://github.com/sectorx83" target="_blank" rel="noreferrer">FOLLOW THE WORK ON GITHUB <ArrowUpRight size={16} /></a></div>
          </div>
          <div className="principle-row"><div><span>01</span><b>STAY CURIOUS</b><p>Follow the question past the obvious answer.</p></div><div><span>02</span><b>BUILD WITH INTENT</b><p>Good engineering is felt in the details.</p></div><div><span>03</span><b>MAKE IT REAL</b><p>Test the idea. Ship the thing. Learn again.</p></div></div>
        </section>

        <section className="toolkit-section section-wrap" id="toolkit">
          <div className="section-kicker"><span>03 / THE TOOLKIT</span><span>TOOLS ARE A MEANS, NOT THE POINT</span></div>
          <div className="toolkit-layout"><h2 className="section-title">The right<br /><em>instrument.</em></h2><div className="toolkit-list">{toolkit.map((row, i) => <div className="tool-row" key={row.group}><span>{String(i + 1).padStart(2, "0")} / {row.group}</span><p>{row.items.map((item, j) => <b key={item}>{item}{j < row.items.length - 1 && <i> / </i>}</b>)}</p></div>)}</div></div>
          <p className="toolkit-note">This index reflects the actual engineering across Gravity, Cathedral, Flux Agent, EDITH X1 and D3X8. It spans application development, AI tooling, runtime isolation, desktop systems and low-level operating-system work.</p>
        </section>

        <section className="lab-section section-wrap" id="lab">
          <div className="section-kicker"><span>04 / EXPERIMENTS LAB</span><span>IDEAS BEFORE THEY BECOME PRODUCTS</span></div>
          <div className="lab-heading"><h2 className="section-title">Curiosity<br /><em>in motion.</em></h2><p>A working shelf for visual studies, system concepts and the questions that don't fit neatly inside a project card.</p></div>
          <div className="lab-grid">
            <article className="lab-card lab-shader"><div className="lab-art"><div className="lab-nebula" /><span>VISUAL STUDY / 001</span></div><div className="lab-card-meta"><span>SHADERS / REALTIME GRAPHICS</span><span>01</span></div><h3>Chromatic matter</h3><p>Procedural color, distortion and moving light explored through the portfolio's shader experiments.</p></article>
            <article className="lab-card lab-topology"><div className="lab-art"><div className="topology-nodes"><i /><i /><i /><i /><b /><b /></div><span>RUNTIME STUDY / 002</span></div><div className="lab-card-meta"><span>GRAVITY / TOPOLOGY</span><span>02</span></div><h3>Systems that reshape</h3><p>A visual study of workload movement, changing connections and preserving accepted work during topology changes.</p></article>
            <article className="lab-card lab-isolation"><div className="lab-art"><div className="isolation-stack"><i /><i /><i /><i /></div><span>LAB STUDY / 003</span></div><div className="lab-card-meta"><span>CATHEDRAL / ISOLATION</span><span>03</span></div><h3>Reproducible space</h3><p>Exploring isolated experiments, observable boundaries and repeatable diagnostics.</p></article>
          </div>
          <div className="lab-footnote"><FlaskConical size={15} /> CONCEPT STUDIES AND TECHNICAL EXPLORATIONS. NOT CLAIMED AS STANDALONE RELEASES.</div>
        </section>

        <section className="journal-section section-wrap" id="journal">
          <div className="section-kicker"><span>05 / ENGINEERING JOURNAL</span><span>NOTES FROM THE BUILD PROCESS</span></div>
          <div className="journal-heading"><h2 className="section-title">Thinking<br /><em>in public.</em></h2><p>Short engineering notes grounded in the actual work: architecture, trade-offs, debugging and the things worth remembering.</p></div>
          <div className="journal-list">
            <article className="journal-entry"><span className="journal-index">NOTE / 001</span><div><span className="journal-topic">DISTRIBUTED RUNTIME · GRAVITY</span><h3>Changing topology without losing the work</h3><p>Why a runtime needs to treat in-flight work and connection changes as first-class concerns, not cleanup tasks after scaling.</p></div><span className="journal-arrow"><ArrowUpRight /></span></article>
            <article className="journal-entry"><span className="journal-index">NOTE / 002</span><div><span className="journal-topic">EXPERIMENT DESIGN · CATHEDRAL</span><h3>Reproducibility is an engineering feature</h3><p>Isolation, observability and repeatable runs make experiments easier to trust and failures easier to understand.</p></div><span className="journal-arrow"><ArrowUpRight /></span></article>
            <article className="journal-entry"><span className="journal-index">NOTE / 003</span><div><span className="journal-topic">SYSTEMS DEBUGGING · D3X8</span><h3>When the interface is not the bottleneck</h3><p>Investigating scheduling pressure, busy loops and the difference between an application symptom and a system-level cause.</p></div><span className="journal-arrow"><ArrowUpRight /></span></article>
          </div>
          <div className="journal-disclaimer"><BookOpen size={14} /> FIELD NOTES FROM ONGOING PROJECTS. DETAILS EVOLVE WITH THE CODE.</div>
        </section>

        <section className="contact-section section-wrap" id="contact">
          <div className="section-kicker"><span>04 / OPEN CHANNEL</span><span>GOOD QUESTIONS WELCOME</span></div>
          <div className="contact-layout"><div className="contact-orb"><div className="contact-orb-inner">83</div><span>LET'S BUILD SOMETHING</span></div><div className="contact-content"><span className="eyebrow">HAVE SOMETHING IN MIND?</span><h2 className="section-title">Let's make<br /><em>it matter.</em></h2><div className="contact-actions"><a className="contact-email" href="mailto:sectorx83@gmail.com">sectorx83@gmail.com <ArrowUpRight size={23} /></a><button className="copy-email" onClick={copyEmail}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "COPIED" : "COPY EMAIL"}</button></div><div className="social-links"><a href="https://github.com/sectorx83" target="_blank" rel="noreferrer"><Github size={15} /> GITHUB <ArrowUpRight size={13} /></a><a href="https://instagram.com/manazz.io" target="_blank" rel="noreferrer"><Instagram size={15} /> INSTAGRAM <ArrowUpRight size={13} /></a></div></div></div>
        </section>
      </main>
      <footer className="site-footer"><a href="#top" className="brand"><span className="brand-mark">s<span>×</span></span><span>SECTORX83<sup>®</sup></span></a><span>AN INDEPENDENT UNIVERSE / MADE WITH CURIOSITY</span><button className="footer-terminal" onClick={() => setTerminalOpen(true)}><Terminal size={13} /> OPEN TERMINAL</button><a href="#top" className="back-top">BACK TO TOP <ArrowUp size={13} /></a><small>© 2026 SECTORX83</small></footer>
      <AnimatePresence>{selectedProject && <motion.div className="dossier-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProject(null)}><motion.section className="dossier-panel" role="dialog" aria-modal="true" aria-labelledby="dossier-title" initial={{ y: 45, scale: .97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 24, scale: .98 }} transition={{ duration: .38, ease: [0.2, .8, .2, 1] }} onClick={(event) => event.stopPropagation()}><div className="dossier-top"><span>PROJECT DOSSIER / {selectedProject.number}</span><button onClick={() => setSelectedProject(null)} aria-label="Close project dossier"><X /></button></div><div className="dossier-class">{selectedProject.category} / {selectedProject.year}</div><h2 id="dossier-title">{selectedProject.name}</h2><p>{selectedProject.description}</p><div className="dossier-stack">{selectedProject.stack.map((item) => <span key={item}>{item}</span>)}</div><div className="dossier-bottom"><span>{selectedProject.metric}</span><a href={selectedProject.href} target="_blank" rel="noreferrer">OPEN REPOSITORY <ArrowUpRight size={16} /></a></div></motion.section></motion.div>}</AnimatePresence>
      <AnimatePresence>{terminalOpen && <motion.div className="terminal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setTerminalOpen(false)}><motion.section className="terminal-window" role="dialog" aria-modal="true" aria-label="Sectorx83 interactive terminal" initial={{ y: 35, scale: .97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: .98 }} onClick={(event) => event.stopPropagation()}><div className="terminal-bar"><div><i /><i /><i /><span>SECTORX83 / INTERACTIVE SHELL</span></div><button onClick={() => setTerminalOpen(false)} aria-label="Close terminal"><X size={18} /></button></div><div className="terminal-output" aria-live="polite">{terminalLines.map((line, index) => <p key={index}>{line}</p>)}</div><form className="terminal-form" onSubmit={runTerminalCommand}><label htmlFor="terminal-command">visitor@sectorx83:~$</label><input id="terminal-command" value={terminalInput} onChange={(event) => setTerminalInput(event.target.value)} autoFocus autoComplete="off" spellCheck={false} placeholder="type a command..." /><button type="submit" aria-label="Run command"><ArrowUpRight size={17} /></button></form><div className="terminal-hint">TRY: HELP · PROJECTS · TOOLKIT · EXPERIMENTS · CONTACT</div></motion.section></motion.div>}</AnimatePresence>
    </div>
  );
}