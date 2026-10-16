import { Download, Menu, MoveUpRight, X } from "lucide-react";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

type SiteHeaderProps = {
  isDark?: boolean;
  activeSection?: string;
  onNavigate?: (id: string) => void;
};

const RESUME_PATH = "/assets/Goutam-Kathuria-Resume.pdf";
const WHATSAPP_URL = "https://wa.me/919991374720?text=Hi%20Goutam%2C%20I%20found%20your%20portfolio.";
const NAV_ITEMS = [
  { id: "work", label: "PROJECTS" },
  { id: "services", label: "SERVICES" },
  { id: "about", label: "ABOUT" },
  { id: "contact", label: "CONTACT" },
];

export default function SiteHeader({ isDark = false, activeSection, onNavigate }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const themeClass = isDark ? "is-dark" : "is-light";
  const navigate = (id: string) => {
    setMenuOpen(false);
    if (onNavigate) onNavigate(id);
  };

  return (
    <>
      <header className={`main-nav ${themeClass}`}>
        {onNavigate ? (
          <button type="button" className="logo interactive" onClick={() => navigate("hero")} aria-label="Back to top">
            <span>GK</span><small>/ FULL-STACK DEVELOPER</small>
          </button>
        ) : (
          <a className="logo interactive" href="/" aria-label="Goutam Kathuria — home">
            <span>GK</span><small>/ FULL-STACK DEVELOPER</small>
          </a>
        )}

        <nav aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => onNavigate ? (
            <button type="button" className={`interactive ${activeSection === item.id ? "is-active" : ""}`} key={item.id} onClick={() => navigate(item.id)}>{item.label}</button>
          ) : (
            <a className="interactive" key={item.id} href={item.id === "contact" ? "#contact" : `/#${item.id}`}>{item.label}</a>
          ))}
        </nav>

        <div className="nav-status">
          <span className="status-dot" aria-hidden="true" />
          <span className="status-copy">OPEN TO ROLES &amp; PROJECTS</span>
          <a className="nav-icon-button nav-cv interactive" href={RESUME_PATH} download="Goutam-Kathuria-Resume.pdf" aria-label="Download resume PDF" title="Download resume">
            <Download size={15} strokeWidth={2.1} />
          </a>
          <a className="nav-icon-button nav-whatsapp interactive" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Contact Goutam on WhatsApp" title="Chat on WhatsApp">
            <FaWhatsapp size={18} aria-hidden="true" />
          </a>
          <button type="button" className="menu-trigger interactive" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className={`mobile-menu ${themeClass}`}>
          {NAV_ITEMS.map((item) => onNavigate ? (
            <button type="button" className="interactive" key={item.id} onClick={() => navigate(item.id)}>{item.label}<MoveUpRight size={14} /></button>
          ) : (
            <a className="interactive" key={item.id} href={item.id === "contact" ? "#contact" : `/#${item.id}`} onClick={() => setMenuOpen(false)}>{item.label}<MoveUpRight size={14} /></a>
          ))}
          <a className="mobile-resume interactive" href={RESUME_PATH} download="Goutam-Kathuria-Resume.pdf">DOWNLOAD RESUME PDF <Download size={14} /></a>
          <a className="mobile-whatsapp interactive" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}><FaWhatsapp size={17} /> CHAT ON WHATSAPP <MoveUpRight size={14} /></a>
        </div>
      )}
    </>
  );
}
