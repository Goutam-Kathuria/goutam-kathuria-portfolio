import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import type { CSSProperties } from "react";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_URL = "https://wa.me/919991374720?text=Hi%20Goutam%2C%20I%20found%20your%20portfolio.";

export function ContactSection() {
  return (
    <section id="contact" className="contact-section contact-section-shared">
      <div className="contact-top">
        <span className="section-kicker">CONTACT</span>
        <span>FULL-TIME / FREELANCE / COLLABORATION</span>
      </div>
      <div className="contact-title" data-reveal style={{ "--reveal-delay": "80ms" } as CSSProperties}>
        <span>GOT A PROJECT</span><span className="outline">IN MIND?</span>
      </div>
      <div className="contact-footer">
        <p data-reveal style={{ "--reveal-delay": "200ms" } as CSSProperties}>
          Tell me what you’re working on. I’d love to hear about it and see where I can help, whether you need the frontend, backend or the whole application.
        </p>
        <a className="contact-orbit interactive" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Start a WhatsApp conversation with Goutam">
          <span>LET’S<br />TALK</span><ArrowUpRight size={28} />
        </a>
      </div>
      <div className="contact-links" data-reveal style={{ "--reveal-delay": "300ms" } as CSSProperties}>
        <a className="interactive" href="mailto:goutam.kathuria@gmail.com"><Mail size={15} /> goutam.kathuria@gmail.com</a>
        <a className="interactive contact-whatsapp-link" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"><FaWhatsapp size={15} /> WHATSAPP · +91 99913 74720</a>
        <a className="interactive" href="https://github.com/Goutam-Kathuria" target="_blank" rel="noreferrer"><Github size={15} /> GITHUB</a>
        <a className="interactive" href="https://www.linkedin.com/in/goutam-kathuria-18915335b" target="_blank" rel="noreferrer"><Linkedin size={15} /> LINKEDIN</a>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer shared-site-footer">
      <span>© {new Date().getFullYear()} GOUTAM KATHURIA</span>
      <span>FULL-STACK / INDIA</span>
      <span>REACT · NODE · MONGODB · AUTOMATION</span>
    </footer>
  );
}

export default function ContactFooter() {
  return <><ContactSection /><SiteFooter /></>;
}
