import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import CustomCursor from "../components/CustomCursor";
import ProjectScene from "../components/ProjectScene";
import SiteHeader from "../components/SiteHeader";
import { ContactSection, SiteFooter } from "../components/ContactFooter";

const PROJECT_DATA: Record<string, {
  title: string;
  category: string;
  description: string;
  role: string;
  company: string;
  duration: string;
  tech: string[];
  stackLabel?: string;
  scope: { value: string; label: string; note: string };
  contribution: string[];
  features: { title: string; description: string }[];
  image?: string;
  media?: import("../components/ProjectScene").ProjectMedia[];
  url?: string;
  links?: { label: string; url: string }[];
  accent: string;
  index: string;
}> = {
  "samarpan-hospital": {
    index: "01",
    title: "Samarpan Hospital",
    category: "HEALTHCARE / WEBSITE & ADMIN",
    description: "A public website for a hospital in Hisar, paired with an admin panel for maintaining doctors, services, appointment requests and page content. The site’s theme colours can also be managed from the admin side.",
    role: "Full Stack Developer",
    company: "Samarpan Hospital",
    duration: "Production project",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Meta APIs"],
    scope: { value: "02", label: "CONNECTED SURFACES", note: "Public website + admin panel" },
    contribution: ["Built the public-facing hospital website and its content-management panel", "Connected doctor, service and appointment information to the relevant website pages", "Added admin controls for updating site content and theme colours without editing page code", "Worked on enquiry handling and website analytics, including Meta-related integrations"],
    features: [
      { title: "Hospital information", description: "Public pages for services, doctors and patient-facing information" },
      { title: "Appointment requests", description: "An admin workflow for reviewing submitted appointment requests" },
      { title: "Content management", description: "Update website copy and selected page content through the admin panel" },
      { title: "Theme controls", description: "Manage the website’s colours from the admin side" },
    ],
    url: "https://samarpanhospitalhisar.com/",
    media: [
      { type: "image", src: "/assets/projects/samarpan-home.webp", alt: "Samarpan Hospital website homepage preview", label: "WEBSITE PREVIEW" },
      { type: "image", src: "/assets/projects/samarpan-home-services.webp", alt: "Samarpan Hospital services and doctors website preview", label: "SERVICES & DOCTORS" },
      { type: "image", src: "/assets/projects/samarpan-admin-demo.webp", alt: "Anonymized hospital administration dashboard with sample data", label: "ADMIN PREVIEW · DEMO DATA" },
    ],
    accent: "#c9975a",
  },
  fivlia: {
    index: "02",
    title: "Fivlia",
    category: "COMMERCE / CUSTOMER, SELLER & ADMIN",
    description: "A multi-vendor commerce platform with separate customer, seller and admin experiences. My work focused on backend APIs and the catalogue, stock, order and delivery workflows used across the platform.",
    role: "MERN Stack Developer",
    company: "Code Era Tech",
    duration: "Production project",
    tech: ["Node.js", "Express.js", "MongoDB", "Mongoose", "Redis", "Socket.io", "React.js"],
    scope: { value: "03", label: "CONNECTED EXPERIENCES", note: "Customer / seller / admin" },
    contribution: ["Developed backend APIs used by the customer site, seller portal and admin panel", "Worked on product, category, stock, pricing and seller-management flows", "Connected order and store operations with delivery and driver workflows", "Used Redis caching and Socket.io for selected performance and real-time update needs", "Implemented location-aware availability and order filtering for supported areas"],
    features: [
      { title: "Customer shopping", description: "Browse categories and products, with availability filtered for the selected area" },
      { title: "Seller portal", description: "Manage store products, stock and orders from a separate seller experience" },
      { title: "Admin operations", description: "Central management for catalogue data, stores, sellers and platform orders" },
      { title: "Order & delivery flows", description: "Order status and driver-related operations across the platform" },
    ],
    url: "https://www.fivlia.com/",
    media: [
      { type: "image", src: "/assets/projects/fivlia-storefront.webp", alt: "Fivlia customer storefront homepage preview", label: "STOREFRONT PREVIEW" },
      { type: "image", src: "/assets/projects/fivlia-admin-demo.webp", alt: "Anonymized Fivlia admin dashboard preview with demo records", label: "ADMIN PREVIEW · DEMO DATA" },
      { type: "image", src: "/assets/projects/fivlia-seller-demo.webp", alt: "Anonymized Fivlia seller dashboard preview with demo orders", label: "SELLER PORTAL · DEMO DATA" },
    ],
    accent: "#dfff55",
  },
  jpme: {
    index: "03",
    title: "JPM Enterprises",
    category: "FURNITURE / E-COMMERCE",
    description: "A sofa and furniture website where visitors can browse styles and collections, then enquire about products. The accompanying admin panel manages catalogue content, banners, galleries and the site’s theme colours.",
    role: "Full Stack Developer",
    company: "JPM Enterprises",
    duration: "Client project",
    tech: ["Product Catalogue", "CMS", "Dynamic Theming", "Enquiry Flow"],
    stackLabel: "PLATFORM FEATURES",
    scope: { value: "02", label: "CONNECTED SURFACES", note: "Storefront + content admin" },
    contribution: ["Built the public-facing sofa and furniture storefront", "Organised product categories and collection pages so visitors can explore different styles", "Connected banners, gallery and other website content to admin-managed updates", "Added enquiry paths for visitors asking about specific furniture products", "Connected the website theme to colour settings managed from the admin panel"],
    features: [
      { title: "Sofa catalogue", description: "A product-led storefront for browsing sofa styles and collections" },
      { title: "Product enquiries", description: "Contact paths for people who need product details or a quote" },
      { title: "Website content", description: "Admin-managed banners, gallery assets and page content" },
      { title: "Theme colours", description: "The site’s colour styling can be changed through admin settings" },
    ],
    url: "https://jpme.in/",
    media: [
      { type: "image", src: "/assets/projects/jpme-storefront.webp", alt: "JPM Enterprises sofa and furniture storefront preview", label: "STOREFRONT PREVIEW" },
      { type: "image", src: "/assets/projects/jpme-admin-demo.webp", alt: "Anonymized JPM Enterprises content admin dashboard with sample enquiries" },
    ],
    accent: "#bd8a5a",
  },
  "business-automation": {
    index: "04",
    title: "Automation Systems",
    category: "AI / WORKFLOW / INTEGRATIONS",
    description: "A set of AI-assisted workflows for review replies and business communication. Webhooks and external APIs pass the event to a flow, which can use Gemini or a local Ollama model to prepare text for a connected communication channel.",
    role: "Full Stack & Automation Developer",
    company: "Internal / Client Work",
    duration: "2025 — 2026",
    tech: ["Node.js", "Express.js", "n8n", "Gemini API", "Ollama", "Google APIs", "Webhooks"],
    scope: { value: "02", label: "AI MODEL OPTIONS", note: "Gemini API + local Ollama" },
    contribution: ["Connected webhook triggers to the relevant workflow steps and external APIs", "Integrated Gemini and local Ollama models for AI-assisted text generation", "Built review-response and communication flows using the services required by each workflow", "Connected Google and Meta APIs and messaging steps where needed"],
    features: [
      { title: "Review-response assistance", description: "Prepare a suggested reply from review or business-event input" },
      { title: "AI provider options", description: "Use Gemini or a local Ollama model where appropriate" },
      { title: "Webhook & API connections", description: "Pass data between event triggers and the services a workflow needs" },
      { title: "Communication steps", description: "Send or route prepared text through a connected channel such as WhatsApp" },
    ],
    media: [
      { type: "image", src: "/assets/projects/automation-flow-overview.svg", alt: "Illustrative AI automation flow from event trigger to response", label: "WORKFLOW OVERVIEW" },
      { type: "image", src: "/assets/projects/automation-integrations.svg", alt: "Illustrative automation integration map connecting webhooks, AI models and communication tools", label: "INTEGRATION MAP" },
      { type: "image", src: "/assets/projects/automation-ai-response.svg", alt: "Illustrative AI-assisted response example with placeholder text, not a real customer review", label: "AI RESPONSE FLOW" },
    ],
    accent: "#a995ff",
  },
  "atelier-09": {
    index: "05",
    title: "Atelier / Luxury & Space",
    category: "IMMERSIVE WEB / LUXURY · SPACE · STUDIO",
    description: "One shared Next.js deployment houses two contrasting public experiences: Atelier 09, an editorial world for fine objects and jewellery, and NOVA / 01, a cinematic space archive. The Studio admin offers browser-local content and media customization; edits stay in the same browser and origin rather than publishing through a global database.",
    role: "Creative Full Stack Developer",
    company: "Independent project",
    duration: "2026 · Live multi-route experience",
    tech: ["Next.js 16.3", "React 19", "TypeScript", "Three.js", "React Three Fiber", "Drei", "Tailwind CSS 4", "LocalStorage"],
    scope: { value: "03", label: "CONNECTED ROUTES", note: "/luxury · /space · /admin" },
    contribution: [
      "Built two distinct public experiences within one Next.js App Router deployment, with luxury and aerospace visual systems sharing the same domain",
      "Created the Atelier 09 luxury journey with a cinematic hero, editorial typography, signature jewellery object, collection archive and material-led storytelling",
      "Built the NOVA / 01 space journey around an Earth-and-satellite hero, a multi-world archive, mission records, spacecraft systems, a timeline and Earth exploration",
      "Integrated interactive 3D scenes using Three.js and React Three Fiber, with scroll-led storytelling and deferred scene loading for a more considered experience",
      "Built a shared Studio admin route for editing page content and media with preview and draft/publish-style controls; saved customizations remain browser-local via LocalStorage"
    ],
    features: [
      { title: "Atelier 09 / Objects of desire", description: "An ivory, ink-black and gold editorial world: We make presence tangible, The Heirloom Ring, Move through the vault, Light surface and finish, material studies and small-edition storytelling" },
      { title: "NOVA / 01 mission archive", description: "Beyond the known, Three worlds / Earth · Mars · Titan, mission records, spacecraft systems, Light arrives as data, a mission timeline and an Earth-from-orbit exploration sequence" },
      { title: "Interactive 3D & motion", description: "Three.js / React Three Fiber scenes, day-side Earth visuals, orbital satellite imagery, custom cursor treatments, scroll-led storytelling and responsive motion" },
      { title: "Studio / browser-local admin", description: "Dashboard, Content, Media and Preview views edit copy and media slots, accept public image/video URLs or uploaded files, and persist local customizations through LocalStorage on the same browser and origin" },
    ],
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
    accent: "#72e7f3",
  },
};

export function ProjectDetail() {
  const { projectId } = useParams({ from: "/projects/$projectId" });
  const navigate = useNavigate();
  const project = PROJECT_DATA[projectId];

  useEffect(() => { window.scrollTo(0, 0); }, [projectId]);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".contact-section-shared [data-reveal]"));
    if (!nodes.length) return;
    const reveal = (node: HTMLElement) => node.classList.add("revealed");
    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach(reveal);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -5% 0px" });
    nodes.forEach((node) => observer.observe(node));
    const fallback = window.setTimeout(() => nodes.forEach(reveal), 1500);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [projectId]);

  if (!project) {
    return <div className="detail-page project-not-found-page"><CustomCursor /><SiteHeader isDark /><main><section className="project-not-found"><button type="button" className="interactive" onClick={() => navigate({ to: "/" })}><ArrowLeft /> BACK HOME</button><h1>PROJECT NOT FOUND.</h1></section><ContactSection /></main><SiteFooter /></div>;
  }

  const index = Number(project.index);
  const nextId = Object.keys(PROJECT_DATA)[index % Object.keys(PROJECT_DATA).length];
  const nextProject = PROJECT_DATA[nextId];

  return (
    <div className="detail-page">
      <CustomCursor />
      <SiteHeader isDark />

      <main>
        <section className="detail-hero">
          <div className="detail-kicker">{project.category}</div>
          <h1>{project.title}<em>.</em></h1>
          <div className="detail-techbar">
            <div className="detail-techbar-head"><span>{project.stackLabel ?? "TECH STACK"}</span><span>{String(project.tech.length).padStart(2, "0")} {project.stackLabel ? "ITEMS" : "TOOLS / SERVICES"}</span></div>
            <div className="detail-tech-chips">{project.tech.map((tech) => <span key={tech}>{tech}</span>)}</div>
          </div>
          <p>{project.description}</p>
          <div className="detail-meta">
            <div><span>ROLE</span><b>{project.role}</b></div>
            <div><span>CLIENT / COMPANY</span><b>{project.company}</b></div>
            <div><span>PROJECT</span><b>{project.duration}</b></div>
          </div>
          {project.links?.length
            ? <div className="detail-live-links">{project.links.map((link) => <a className="detail-live-link interactive" href={link.url} target="_blank" rel="noopener noreferrer" key={link.url}>{link.label} <ArrowUpRight size={17} /></a>)}</div>
            : project.url && <a className="detail-live-link interactive" href={project.url} target="_blank" rel="noopener noreferrer">VISIT LIVE WEBSITE <ArrowUpRight size={17} /></a>}
          <div className="detail-scope">
            <div className="detail-scope-number"><span>PROJECT SCOPE</span><strong>{project.scope.value}</strong></div>
            <div className="detail-scope-copy"><b>{project.scope.label}</b><span>{project.scope.note}</span></div>
          </div>
        </section>

        <section className="detail-feature">
          <div className="detail-scene-wrap"><ProjectScene media={project.media} title={project.title} accent={project.accent} index={project.index} total={String(Object.keys(PROJECT_DATA).length).padStart(2, "0")} category={project.category} interactive /><div className="detail-scene-label"><span>{project.index} / PROJECT GALLERY</span><span>SELECT A SCREEN OR VIDEO TO EXPLORE</span></div></div>
        </section>

        <section className="detail-grid">
          <div><p className="detail-kicker">02 / MY ROLE</p><h2>WHAT I<br /><em>BUILT.</em></h2></div>
          <div className="detail-content">{project.contribution.map((item, i) => <div className="detail-row" key={item}><span>0{i + 1}</span><p>{item}</p></div>)}</div>
        </section>

        <section className="detail-grid detail-features">
          <div><p className="detail-kicker">03 / WHAT IT HANDLES</p><h2>WHAT IT<br /><em>DOES.</em></h2></div>
          <div className="feature-grid">{project.features.map((feature, i) => <article className="feature-card" key={feature.title}><span>0{i + 1}</span><h3>{feature.title}</h3><p>{feature.description}</p></article>)}</div>
        </section>

        <section className="next-project">
          <button type="button" className="next-link interactive" onClick={() => navigate({ to: `/projects/${nextId}` })}>
            <span><small>NEXT PROJECT / {nextProject.index}</small><strong>{nextProject.title} <ArrowUpRight size={23} /></strong></span>
          </button>
        </section>
        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  );
}
