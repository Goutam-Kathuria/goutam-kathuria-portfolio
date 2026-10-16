import { ArrowDownRight, ArrowUpRight, Download, MoveUpRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "@tanstack/react-router";
import CustomCursor from "./components/CustomCursor";
import ExperienceScene from "./components/ExperienceScene";
import LoadingScreen from "./components/LoadingScreen";
import ProjectScene from "./components/ProjectScene";
import type { ProjectMedia } from "./components/ProjectScene";
import SiteHeader from "./components/SiteHeader";
import { ContactSection, SiteFooter } from "./components/ContactFooter";

type Project = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  role: string;
  stack: string[];
  accent: string;
  cover: string;
  fact?: { value: string; label: string; note: string };
  media?: ProjectMedia[];
  url?: string;
  links?: { label: string; url: string }[];
};

const PROFILE_IMAGE = "/assets/uploads/me.webp";
const RESUME_PATH = "/assets/Goutam-Kathuria-Resume.pdf";

const PROJECTS: Project[] = [
  {
    id: "samarpan-hospital",
    index: "01",
    title: "Samarpan Hospital",
    subtitle: "HEALTHCARE / WEBSITE & ADMIN",
    description: "A hospital website and admin panel for doctor and service information, appointment requests, page content and site colours.",
    role: "FULL-STACK DEVELOPMENT",
    stack: ["React", "Node.js", "MongoDB", "Meta APIs"],
    accent: "#c9975a",
    cover: "/assets/projects/samarpan-home.webp",
    fact: { value: "02", label: "CONNECTED SURFACES", note: "Website + admin panel" },
    url: "https://samarpanhospitalhisar.com/",
    media: [
      { type: "image", src: "/assets/projects/samarpan-home.webp", alt: "Samarpan Hospital website homepage preview", label: "WEBSITE PREVIEW" },
      { type: "image", src: "/assets/projects/samarpan-home-services.webp", alt: "Samarpan Hospital services and doctors website preview", label: "SERVICES & DOCTORS" },
      { type: "image", src: "/assets/projects/samarpan-admin-demo.webp", alt: "Anonymized Samarpan Hospital admin dashboard preview with sample data", label: "ADMIN PREVIEW · DEMO DATA" },
    ],
  },
  {
    id: "fivlia",
    index: "02",
    title: "Fivlia",
    subtitle: "COMMERCE / CUSTOMER, SELLER & ADMIN",
    description: "A multi-vendor commerce platform with separate customer, seller and admin experiences, covering product, stock, order and delivery workflows.",
    role: "BACKEND / REAL-TIME",
    stack: ["Node.js", "Express", "MongoDB", "Redis", "Socket.io"],
    accent: "#dfff55",
    cover: "/assets/projects/fivlia-storefront.webp",
    fact: { value: "03", label: "CONNECTED EXPERIENCES", note: "Customer + seller + admin" },
    url: "https://www.fivlia.com/",
    media: [
      { type: "image", src: "/assets/projects/fivlia-storefront.webp", alt: "Fivlia customer storefront homepage preview", label: "STOREFRONT PREVIEW" },
      { type: "image", src: "/assets/projects/fivlia-admin-demo.webp", alt: "Anonymized Fivlia admin dashboard preview with demo orders and metrics", label: "ADMIN PREVIEW · DEMO DATA" },
      { type: "image", src: "/assets/projects/fivlia-seller-demo.webp", alt: "Anonymized Fivlia seller dashboard preview with sample store orders", label: "SELLER PORTAL · DEMO DATA" },
    ],
  },
  {
    id: "jpme",
    index: "03",
    title: "JPM Enterprises",
    subtitle: "FURNITURE / E-COMMERCE",
    description: "A sofa and furniture website for browsing collections and sending product enquiries, with admin-managed content and theme colours.",
    role: "FULL-STACK / E-COMMERCE",
    stack: ["Product Catalogue", "CMS", "Dynamic Theming", "Enquiry Flow"],
    accent: "#bd8a5a",
    cover: "/assets/projects/jpme-storefront.webp",
    fact: { value: "02", label: "CONNECTED SURFACES", note: "Storefront + content admin" },
    url: "https://jpme.in/",
    media: [
      { type: "image", src: "/assets/projects/jpme-storefront.webp", alt: "JPM Enterprises sofa and furniture storefront preview", label: "STOREFRONT PREVIEW" },
      { type: "image", src: "/assets/projects/jpme-admin-demo.webp", alt: "Anonymized JPM Enterprises content admin dashboard preview with sample enquiries", label: "ADMIN PREVIEW · DEMO DATA" },
    ],
  },
  {
    id: "business-automation",
    index: "04",
    title: "Automation Systems",
    subtitle: "AI / WORKFLOW / INTEGRATIONS",
    description: "AI-assisted workflows connecting webhooks, business APIs, text generation and communication tools for review replies and customer conversations.",
    role: "FULL-STACK / AUTOMATION",
    stack: ["n8n", "Gemini", "Ollama", "Google APIs"],
    accent: "#9e8cff",
    cover: "/assets/projects/automation-flow-overview.svg",
    fact: { value: "02", label: "AI MODEL OPTIONS", note: "Gemini API + local Ollama" },
    media: [
      { type: "image", src: "/assets/projects/automation-flow-overview.svg", alt: "Illustrative webhook-to-AI-to-message workflow diagram without customer data", label: "WORKFLOW OVERVIEW" },
      { type: "image", src: "/assets/projects/automation-integrations.svg", alt: "Illustrative map of AI and business API integrations", label: "INTEGRATION MAP" },
      { type: "image", src: "/assets/projects/automation-ai-response.svg", alt: "Illustrative AI-assisted review response flow with sample text only", label: "AI RESPONSE FLOW" },
    ],
  },
  {
    id: "atelier-09",
    index: "05",
    title: "Atelier / Luxury & Space",
    subtitle: "IMMERSIVE WEB / LUXURY · SPACE · STUDIO",
    description: "A single-domain Next.js build pairing Atelier 09, an editorial jewellery experience, with NOVA / 01, a cinematic space archive. The Studio admin includes Dashboard, Content, Media and Preview views; copy and media settings persist locally in the same browser and origin rather than becoming a global database publish.",
    role: "CREATIVE FULL STACK / INTERACTIVE 3D",
    stack: ["Next.js 16", "React 19", "TypeScript", "Three.js", "React Three Fiber", "Drei", "Tailwind CSS", "LocalStorage"],
    accent: "#72e7f3",
    cover: "/assets/projects/atelier-09-cover.webp",
    fact: { value: "03", label: "CONNECTED ROUTES", note: "Two public experiences + Studio admin" },
    url: "https://atelier-lux.netlify.app/luxury",
    links: [
      { label: "OPEN LUXURY", url: "https://atelier-lux.netlify.app/luxury" },
      { label: "EXPLORE SPACE", url: "https://atelier-lux.netlify.app/space" },
      { label: "OPEN STUDIO ADMIN", url: "https://atelier-lux.netlify.app/admin" },
    ],
    media: [
      { type: "image", src: "/assets/projects/atelier-09-cover.webp", alt: "AI-generated art-directed concept board inspired by the Atelier 09 and NOVA 01 dual experience", label: "ART DIRECTION / DUAL EXPERIENCE" },
      { type: "image", src: "/assets/projects/atelier-09-experience-board.webp", alt: "Generated case-study visual showing the luxury and space experiences together", label: "EXPERIENCE SYSTEM / VISUAL STUDY" },
      { type: "image", src: "/assets/projects/atelier-09-editorial-study.webp", alt: "Generated editorial visual study for the jewellery and aerospace design systems", label: "EDITORIAL SYSTEM / VISUAL STUDY" },
      { type: "image", src: "/assets/projects/atelier-09-studio-overview.webp", alt: "Generated art-directed visual study of the unified Studio admin experience", label: "STUDIO / VISUAL STUDY" },
      { type: "image", src: "/assets/projects/atelier-09-system-map.svg", alt: "Architecture diagram showing one deployment and the luxury, space and admin routes", label: "ARCHITECTURE / THREE ROUTES" },
      { type: "video", src: "/assets/projects/atelier-09-luxury-film.mp4", alt: "Art-directed Atelier 09 luxury showcase film with framed footage from the supplied live-site recording", label: "MOTION FILM / ATELIER LUXURY" },
      { type: "video", src: "/assets/projects/atelier-09-space-film.mp4", alt: "Art-directed NOVA 01 space showcase film with framed footage from the supplied live-site recording", label: "MOTION FILM / NOVA SPACE" },
    ],
  },
];

const CAPABILITIES = [
  { kicker: "01", title: "FRONTEND", copy: "Responsive interfaces that make complex products easier to navigate, with careful attention to hierarchy, interaction and performance.", tools: "REACT / NEXT / VUE / TYPESCRIPT" },
  { kicker: "02", title: "BACKEND", copy: "APIs, data models and business logic that connect the interface to the parts of the product that actually do the work.", tools: "NODE / EXPRESS / MONGODB / REDIS" },
  { kicker: "03", title: "PRODUCT & ADMIN", copy: "Dashboards, role-based access, catalogues, inventory and internal tools that help teams operate the product every day.", tools: "ADMIN / DASHBOARDS / REAL-TIME" },
  { kicker: "04", title: "AUTOMATION", copy: "Webhooks, APIs and AI services connected into repeatable workflows that remove manual steps and keep operations moving.", tools: "META / GOOGLE / N8N / AI" },
];

const STACK = ["React", "Next.js", "Vue.js", "Node.js", "Express.js", "MongoDB", "Mongoose", "Redis", "Socket.io", "Three.js", "WebGL", "n8n", "Gemini", "Ollama", "Google APIs", "Meta APIs"];
const SECTION_IDS = ["hero", "about", "work", "services", "contact"];

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function useViewportMotion() {
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      const vw = window.innerWidth || 1;
      document.documentElement.style.setProperty("--vw", `${vw}px`);
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      const pageProgress = clamp((window.scrollY || 0) / Math.max(document.documentElement.scrollHeight - vh, 1));
      document.documentElement.style.setProperty("--page-progress", pageProgress.toFixed(4));
      document.documentElement.style.setProperty("--scroll-y", String(window.scrollY || 0));
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const enter = clamp((vh - rect.top) / (vh * 0.9));
        const leave = clamp((rect.bottom) / (vh * 0.9));
        const progress = clamp((vh - rect.top) / (vh + rect.height));
        section.style.setProperty("--progress", progress.toFixed(4));
        section.style.setProperty("--enter", enter.toFixed(4));
        section.style.setProperty("--leave", leave.toFixed(4));
      });
    };
    const request = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);
}

function useRevealObserver() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!nodes.length) return;
    const reveal = (node: HTMLElement) => node.classList.add("revealed");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -5% 0px" });
    nodes.forEach((node) => observer.observe(node));
    const fallback = window.setTimeout(() => nodes.forEach(reveal), 1550);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);
}

function useActiveSection() {
  const [active, setActive] = useState("hero");
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    let raf = 0;
    const update = () => {
      raf = 0;
      const anchor = window.innerHeight * 0.34;
      let current = "hero";
      let best = Number.POSITIVE_INFINITY;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const inside = rect.top <= anchor && rect.bottom >= anchor;
        const distance = inside ? 0 : Math.abs(rect.top - anchor);
        if (distance < best) {
          best = distance;
          current = section.id;
        }
      });
      setActive(current);
    };
    const request = () => { if (!raf) raf = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);
  return active;
}

function useActiveProject() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const panels = Array.from(document.querySelectorAll<HTMLElement>("[data-project-panel]"));
    if (!panels.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.53;
      let best = 0;
      let bestDistance = Number.POSITIVE_INFINITY;
      panels.forEach((panel, index) => {
        const rect = panel.getBoundingClientRect();
        const center = rect.top + rect.height * 0.5;
        const distance = Math.abs(mid - center);
        const progress = clamp((mid - center) / (window.innerHeight * 0.72), -1, 1);
        panel.style.setProperty("--panel-progress", progress.toFixed(4));
        if (distance < bestDistance) { bestDistance = distance; best = index; }
      });
      const activeRect = panels[best].getBoundingClientRect();
      const activeProgress = clamp((mid - (activeRect.top + activeRect.height * 0.5)) / (window.innerHeight * 0.72), -1, 1);
      document.documentElement.style.setProperty("--project-scene-progress", activeProgress.toFixed(4));
      setActive(best);
    };
    const request = () => { if (!raf) raf = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);
  return active;
}

function App() {
  const navigate = useNavigate();
  const activeSection = useActiveSection();
  const activeProject = useActiveProject();
  useViewportMotion();
  useRevealObserver();

  const [loaded, setLoaded] = useState(false);
  const [capability, setCapability] = useState(0);
  const [capabilityDisplay, setCapabilityDisplay] = useState(0);
  const [capabilityChanging, setCapabilityChanging] = useState(false);
  const capabilityTimer = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 980);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".magnetic-button, .contact-orbit"));
    if (!targets.length || !window.matchMedia("(pointer:fine)").matches) return;
    const cleanups = targets.map((target) => {
      const move = (event: PointerEvent) => {
        const rect = target.getBoundingClientRect();
        const x = (event.clientX - (rect.left + rect.width * 0.5)) / rect.width;
        const y = (event.clientY - (rect.top + rect.height * 0.5)) / rect.height;
        target.style.transform = `translate3d(${(x * 11).toFixed(2)}px, ${(y * 11).toFixed(2)}px, 0) rotate(${(x * -3.5).toFixed(2)}deg)`;
      };
      const leave = () => { target.style.transform = ""; };
      target.addEventListener("pointermove", move, { passive: true });
      target.addEventListener("pointerleave", leave, { passive: true });
      return () => {
        target.removeEventListener("pointermove", move);
        target.removeEventListener("pointerleave", leave);
      };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const onMove = (event: PointerEvent) => {
      if (!window.matchMedia("(pointer:fine)").matches) return;
      const x = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
      const y = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
      hero.style.setProperty("--hero-mx", x.toFixed(4));
      hero.style.setProperty("--hero-my", y.toFixed(4));
    };
    const onLeave = () => {
      hero.style.setProperty("--hero-mx", "0");
      hero.style.setProperty("--hero-my", "0");
    };
    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useEffect(() => () => {
    if (capabilityTimer.current) window.clearTimeout(capabilityTimer.current);
  }, []);

  const selectCapability = (index: number) => {
    setCapability(index);
    if (index === capabilityDisplay) return;
    if (capabilityTimer.current) window.clearTimeout(capabilityTimer.current);
    setCapabilityChanging(true);
    capabilityTimer.current = window.setTimeout(() => {
      setCapabilityDisplay(index);
      capabilityTimer.current = window.setTimeout(() => setCapabilityChanging(false), 120);
    }, 640);
  };

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeProjectData = PROJECTS[activeProject];
  const navDark = activeSection === "work";

  return (
    <div className={`portfolio ${loaded ? "is-loaded" : ""}`}>
      <LoadingScreen />
      <CustomCursor />
      <div className="progress-line" aria-hidden="true"><span /></div>

      <SiteHeader isDark={navDark} activeSection={activeSection} onNavigate={go} />

      <main>
        <section id="hero" className="hero-section">
          <ExperienceScene />
          <div className="hero-grain" aria-hidden="true" />
          <div className="hero-frame" aria-hidden="true" />
          <div className="hero-meta"><span>FULL-STACK DEVELOPER</span><span>BASED IN INDIA</span><span>SCROLL TO EXPLORE</span></div>
          <div className="hero-center">
            <div className="eyebrow reveal-line" data-reveal style={{ "--reveal-delay": "80ms" } as CSSProperties}>REACT / NODE / MONGODB</div>
            <h1 className="hero-title" aria-label="Full-stack web developer">
              <span className="hero-word hero-word-1" data-reveal style={{ "--reveal-delay": "160ms" } as CSSProperties}>FULL-STACK</span>
              <span className="hero-word hero-word-2" data-reveal style={{ "--reveal-delay": "260ms" } as CSSProperties}>WEB DEVELOPER</span>
            </h1>
            <div className="hero-bottom" data-reveal style={{ "--reveal-delay": "380ms" } as CSSProperties}>
              <p>I design and develop web applications across the frontend and backend, including the databases, integrations and automation that support them.</p>
              <button type="button" className="magnetic-button interactive" onClick={() => go("work")}><span>VIEW<br />MY WORK</span><ArrowDownRight size={20} /></button>
            </div>
          </div>
          <div className="hero-vertical hero-vertical-left">INTERFACE / API / DATA / AUTOMATION /</div>
          <div className="hero-vertical hero-vertical-right">SCROLL / EXPLORE</div>
          <div className="hero-nameplate">
            <div className="nameplate-image"><img src={PROFILE_IMAGE} alt="Goutam Kathuria" loading="eager" decoding="async" /></div>
            <span>GOUTAM KATHURIA</span><span>FULL STACK / MERN</span>
          </div>
          <div className="hero-scroll-cue"><span /><small>SCROLL</small></div>
        </section>

        <section id="about" className="about-section">
          <div className="section-gridline" aria-hidden="true" />
          <div className="about-heading"><span className="section-kicker">THE DEVELOPER</span><span>PRODUCT / ENGINEERING / DETAIL</span></div>
          <div className="about-grid">
            <div className="about-portrait about-portrait-animated" data-reveal style={{ "--reveal-delay": "60ms" } as CSSProperties}>
              <img src={PROFILE_IMAGE} alt="Portrait of Goutam Kathuria" loading="lazy" decoding="async" />
              <div className="portrait-glass"><span>GK</span><span>FULL STACK</span><span>22</span></div>
              <div className="portrait-scan" aria-hidden="true" />
              <div className="portrait-orbit portrait-orbit-a" aria-hidden="true" />
              <div className="portrait-orbit portrait-orbit-b" aria-hidden="true" />
            </div>
            <div className="about-story">
              <h2 data-reveal style={{ "--reveal-delay": "130ms" } as CSSProperties}>
                <span className="about-line about-line-1">I WORK ACROSS</span>
                <span className="about-line about-line-2"><em>THE WHOLE PRODUCT.</em></span>
              </h2>
              <p className="about-body-line about-body-line-a" data-reveal style={{ "--reveal-delay": "210ms" } as CSSProperties}>I’m a full-stack developer based in India, working mainly with React, Node.js and MongoDB. I enjoy taking a product requirement and turning it into a complete web application.</p>
              <p className="about-body-line about-body-line-b" data-reveal style={{ "--reveal-delay": "280ms" } as CSSProperties}>My production work has included healthcare platforms, commerce systems and automation workflows. I care about clear user flows, maintainable code and the details that make software easier to use.</p>
              <div className="about-facts" data-reveal style={{ "--reveal-delay": "350ms" } as CSSProperties}>
                <div><strong>1+</strong><span>YEARS<br />PROFESSIONAL EXPERIENCE</span></div>
                <div><strong>3</strong><span>PRODUCTION<br />PROJECT AREAS</span></div>
                <div><strong>MERN</strong><span>PRIMARY<br />STACK</span></div>
              </div>
              <div className="about-links" data-reveal style={{ "--reveal-delay": "430ms" } as CSSProperties}>
                <a className="interactive" href="https://github.com/Goutam-Kathuria" target="_blank" rel="noreferrer">GITHUB <ArrowUpRight size={14} /></a>
                <a className="interactive" href="https://www.linkedin.com/in/goutam-kathuria-18915335b" target="_blank" rel="noreferrer">LINKEDIN <ArrowUpRight size={14} /></a>
                <a className="interactive" href={RESUME_PATH} download="Goutam-Kathuria-Resume.pdf">RESUME <Download size={14} /></a>
              </div>
            </div>
          </div>
          <div className="about-marquee" aria-hidden="true"><span>REACT</span><i>✦</i><span>NODE</span><i>✦</i><span>MONGODB</span><i>✦</i><span>APIS</span><i>✦</i><span>AUTOMATION</span></div>
        </section>

        <section id="work" className="work-section">
          <div className="work-topline"><span className="section-kicker">SELECTED WORK</span><span>HEALTHCARE / COMMERCE / FURNITURE / AUTOMATION</span></div>
          <div className="work-intro">
            <h2 data-reveal style={{ "--reveal-delay": "80ms" } as CSSProperties}>WORK I’VE<br /><em>BUILT.</em></h2>
            <p data-reveal style={{ "--reveal-delay": "170ms" } as CSSProperties}>A selection of work across healthcare, commerce, automation and immersive digital experiences — from production platforms to motion-led product storytelling.</p>
          </div>

          <div className="work-stage">
            <div className="work-scene-shell">
              <div className="work-scene-sticky">
                <ProjectScene image={activeProjectData.cover} title={activeProjectData.title} accent={activeProjectData.accent} index={activeProjectData.index} total={String(PROJECTS.length).padStart(2, "0")} category={activeProjectData.subtitle} />
                <div className="scene-readout"><span>{activeProjectData.index}</span><span>{activeProjectData.title}</span><span>{activeProjectData.role}</span></div>
                <div className="scene-crosshair" aria-hidden="true"><i /><i /></div>
                <div className="work-index-rail" aria-label="Projects">{PROJECTS.map((project, index) => <span className={activeProject === index ? "is-active" : ""} key={project.id}>{project.index}</span>)}</div>
              </div>
            </div>
            <div className="work-panels">
              {PROJECTS.map((project, index) => (
                <article data-project-panel className={`work-panel ${activeProject === index ? "is-active" : ""}`} key={project.id} style={{ "--project-accent": project.accent } as CSSProperties}>
                  <div className="panel-index">{project.index}</div>
                  <div className="panel-category">{project.subtitle}</div>
                  <div className="panel-title"><small>{project.index}</small><h3>{project.title}</h3></div>
                  <p>{project.description}</p>
                  {project.fact && <div className="panel-fact"><strong>{project.fact.value}</strong><div><b>{project.fact.label}</b><span>{project.fact.note}</span></div></div>}
                  <div className="panel-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
                  <div className="panel-actions">
                    <button type="button" className="panel-enter interactive" onClick={() => navigate({ to: `/projects/${project.id}` })}>VIEW CASE STUDY <ArrowUpRight size={16} /></button>
                    {project.links?.length
                      ? project.links.map((link) => <a className="panel-enter panel-live interactive" href={link.url} target="_blank" rel="noopener noreferrer" key={link.url}>{link.label} <ArrowUpRight size={16} /></a>)
                      : project.url && <a className="panel-enter panel-live interactive" href={project.url} target="_blank" rel="noopener noreferrer">VISIT WEBSITE <ArrowUpRight size={16} /></a>}
                  </div>
                  <div className="panel-number-line"><span>{String(index + 1).padStart(2, "0")}</span><span>{String(PROJECTS.length).padStart(2, "0")}</span></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="capabilities-section">
          <div className="capabilities-heading">
            <span className="section-kicker">SERVICES</span>
            <h2 data-reveal style={{ "--reveal-delay": "80ms" } as CSSProperties}>WHAT I<br /><em>DO.</em></h2>
            <p data-reveal style={{ "--reveal-delay": "160ms" } as CSSProperties}>A full-stack practice covering interface development, backend engineering, internal tools and automation.</p>
          </div>
          <div className="capabilities-grid">
            <div className={`capability-copy ${capabilityChanging ? "is-changing" : ""}`}>
              <p className="capability-index">{CAPABILITIES[capabilityDisplay].kicker} / {String(CAPABILITIES.length).padStart(2, "0")}</p>
              <div key={CAPABILITIES[capabilityDisplay].title} className="capability-copy-animate">
                <h3>{CAPABILITIES[capabilityDisplay].title}</h3>
                <p>{CAPABILITIES[capabilityDisplay].copy}</p>
                <span>{CAPABILITIES[capabilityDisplay].tools}</span>
              </div>
            </div>
            <div className="capability-list">
              {CAPABILITIES.map((item, index) => (
                <button type="button" key={item.title} className={`capability-item interactive ${capability === index ? "is-active" : ""}`} onMouseEnter={() => selectCapability(index)} onFocus={() => selectCapability(index)} onClick={() => selectCapability(index)}>
                  <span>{item.kicker}</span><strong>{item.title}</strong><MoveUpRight size={18} />
                </button>
              ))}
            </div>
          </div>
          <div className={`capability-visual visual-${capability + 1}`} aria-hidden="true"><div className="visual-core" /><div className="visual-ring ring-a" /><div className="visual-ring ring-b" /><div className="visual-ring ring-c" /><span>{String(capability + 1).padStart(2, "0")}</span></div>
          <div className="services-stack" aria-label="Technology stack"><div className="stack-track">{[...STACK, ...STACK].map((item, index) => <span key={`${item}-${index}`}>{item}<b>✦</b></span>)}</div></div>
        </section>
        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  );
}

export default App;
