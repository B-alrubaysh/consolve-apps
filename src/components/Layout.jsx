import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Send } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../lib/useLanguage";
import t from "../lib/translations";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inquiry, setInquiry] = useState("");
  const location = useLocation();
  const { lang, dir, isAr } = useLanguage();
  const tx = t[lang];

  const NAV_LINKS = [
    { to: "/", label: tx.nav_home },
    { to: "/about", label: tx.nav_about },
    { to: "/services", label: tx.nav_services },
    { to: "/clients", label: tx.nav_clients },
    { to: "/contact", label: tx.nav_contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const handleInquiry = (e) => {
    e.preventDefault();
    if (!inquiry.trim()) return;
    window.location.href = `/contact?q=${encodeURIComponent(inquiry)}`;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-border shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      {/* Desktop: 3-column grid — logo | nav | actions */}
      <div className="max-w-7xl mx-auto px-6 hidden md:grid grid-cols-[auto_1fr_auto] items-center gap-6" dir={dir}>
        {/* Logo — left for EN, right for AR (grid order handles it via dir) */}
        <Link to="/" className="flex items-center">
          <img
            src="https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/a90b3e265_image.png"
            alt="Consolve"
            className="h-9 w-auto"
            style={{ mixBlendMode: "multiply" }}
          />
        </Link>

        {/* Centered nav */}
        <nav className="flex items-center justify-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions — lang + inquiry — opposite side of logo */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <form onSubmit={handleInquiry} className="flex items-center">
            <div className="flex items-center border border-border rounded-full overflow-hidden bg-white/60 backdrop-blur-sm hover:border-primary/40 transition-colors">
              <input
                value={inquiry}
                onChange={(e) => setInquiry(e.target.value)}
                placeholder={isAr ? "لديك استفسار…" : "Ask a Question…"}
                className="text-xs bg-transparent px-4 py-2 outline-none w-36 text-foreground placeholder:text-muted-foreground"
                dir={dir}
              />
              <button type="submit" className="px-3 py-2 text-muted-foreground hover:text-primary transition-colors">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile */}
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between md:hidden" dir={dir}>
        <Link to="/" className="flex items-center">
          <img
            src="https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/a90b3e265_image.png"
            alt="Consolve"
            className="h-8 w-auto"
            style={{ mixBlendMode: "multiply" }}
          />
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-secondary">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-border">
          <div className="px-6 py-6 flex flex-col gap-4" dir={dir}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-base font-medium ${
                  location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <form onSubmit={handleInquiry} className="flex items-center border border-border rounded-full overflow-hidden bg-white">
              <input
                value={inquiry}
                onChange={(e) => setInquiry(e.target.value)}
                placeholder={isAr ? "لديك استفسار…" : "Ask a Question…"}
                className="text-sm bg-transparent px-4 py-2.5 outline-none flex-1 text-foreground placeholder:text-muted-foreground"
                dir={dir}
              />
              <button type="submit" className="px-3 py-2.5 text-muted-foreground hover:text-primary">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { lang, dir } = useLanguage();
  const tx = t[lang];

  const NAV_LINKS = [
    { to: "/", label: tx.nav_home },
    { to: "/about", label: tx.nav_about },
    { to: "/services", label: tx.nav_services },
    { to: "/clients", label: tx.nav_clients },
    { to: "/contact", label: tx.nav_contact },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground" dir={dir}>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="mb-4">
              <img src="https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/a90b3e265_image.png" alt="Consolve" className="h-9 w-auto" style={{mixBlendMode: 'screen'}} />
            </div>
            <p className="text-secondary-foreground/60 text-sm leading-relaxed max-w-sm">
              {tx.footer_tagline}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-secondary-foreground/40 mb-4">
              {tx.footer_navigate}
            </h4>
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link key={link.to} to={link.to} className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-secondary-foreground/40 mb-4">
              {tx.footer_contact}
            </h4>
            <div className="flex flex-col gap-3 text-sm text-secondary-foreground/60">
              <span>info@consolve.com</span>
              <span>+1 (800) 555-0199</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-secondary-foreground/30">{tx.footer_rights(new Date().getFullYear())}</p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-secondary-foreground/30 hover:text-primary cursor-pointer transition-colors">{tx.footer_privacy}</span>
            <span className="text-xs text-secondary-foreground/30 hover:text-primary cursor-pointer transition-colors">{tx.footer_terms}</span>
          </div>
        </div>
      </div>

    </footer>
  );
}

export default function Layout() {
  const { lang, isAr } = useLanguage();

  useEffect(() => {
    document.documentElement.dir = isAr ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isAr]);

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}