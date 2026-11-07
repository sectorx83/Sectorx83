import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowDownRight, ArrowUpRight, ArrowUp, Github, Instagram, MoveUpRight, Menu, X, Sparkles } from "lucide-react";
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

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
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
      <div className="project-tags">{project.stack.map(tag => <span key={tag}>{tag}</span>)}</div>
    </motion.article>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState("00:00:00");
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
      gsap.to(".scroll-progress i", { scaleX: 1, ease: "none", scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.18 } });
      gsap.from(".principle-row > div", { y: 54, opacity: 0, rotateX: 12, transformOrigin: "50% 100%", stagger: 0.14, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".principle-row", start: "top 86%", once: true } });
      gsap.from(".social-links a", { x: 24, opacity: 0, stagger: 0.13, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".social-links", start: "top 92%", once: true } });
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
  return (
    <div className="site-shell" ref={root}>
      <AnimatePresence>{loading && <Loader onFinish={finishLoader} />}</AnimatePresence>
      <div className="cursor" /><div className="cursor-dot" />
      <div className="noise-layer" /><div className="scroll-progress" aria-hidden="true"><i /></div>
      <header className="site-header">
        <a href="#top" className="brand" aria-label="sectorx83 home"><span className="brand-mark">s<span>×</span></span><span>SECTORX83<sup>®</sup></span></a>
        <nav className={menuOpen ? "main-nav is-open" : "main-nav"}>
          <a href="#work" onClick={closeMenu}>WORK <sup>05</sup></a><a href="#about" onClick={closeMenu}>ABOUT</a><a href="#toolkit" onClick={closeMenu}>TOOLKIT</a><a href="#contact" onClick={closeMenu}>CONTACT</a>
        </nav>
        <div className="header-right"><span className="live-indicator"><i /> AVAILABLE FOR IDEAS</span><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X /> : <Menu />}</button></div>
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
          <div className="project-grid">{projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
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

        <section className="contact-section section-wrap" id="contact">
          <div className="section-kicker"><span>04 / OPEN CHANNEL</span><span>GOOD QUESTIONS WELCOME</span></div>
          <div className="contact-layout"><div className="contact-orb"><div className="contact-orb-inner">83</div><span>LET'S BUILD SOMETHING</span></div><div className="contact-content"><span className="eyebrow">HAVE SOMETHING IN MIND?</span><h2 className="section-title">Let's make<br /><em>it matter.</em></h2><a className="contact-email" href="mailto:sectorx83@gmail.com">sectorx83@gmail.com <ArrowUpRight size={23} /></a><div className="social-links"><a href="https://github.com/sectorx83" target="_blank" rel="noreferrer"><Github size={15} /> GITHUB <ArrowUpRight size={13} /></a><a href="https://instagram.com/manazz.io" target="_blank" rel="noreferrer"><Instagram size={15} /> INSTAGRAM <ArrowUpRight size={13} /></a></div></div></div>
        </section>
      </main>
      <footer className="site-footer"><a href="#top" className="brand"><span className="brand-mark">s<span>×</span></span><span>SECTORX83<sup>®</sup></span></a><span>AN INDEPENDENT UNIVERSE / MADE WITH CURIOSITY</span><a href="#top" className="back-top">BACK TO TOP <ArrowUp size={13} /></a><small>© 2026 SECTORX83</small></footer>
    </div>
  );
}