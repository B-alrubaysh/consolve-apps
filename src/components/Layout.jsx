import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../lib/useLanguage";
import t from "../lib/translations";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { lang, dir } = useLanguage();
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/70 backdrop-blur-xl border-b border-border shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between" dir={dir}>
        <Link to="/" className="flex items-center">
          <img src="https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/a90b3e265_image.png" alt="Consolve" className="h-9 w-auto" style={{mixBlendMode: 'multiply'}} />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
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
          <LanguageSwitcher />
          <Link
            to="/assessment"
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {tx.nav_cta}
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
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
            <Link
              to="/assessment"
              className="bg-primary text-primary-foreground px-5 py-3 rounded-full text-sm font-semibold text-center mt-2"
            >
              {tx.nav_cta}
            </Link>
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