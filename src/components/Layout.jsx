import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Linkedin, Twitter, Instagram } from "lucide-react";
import { base44 } from "@/api/base44Client";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../lib/useLanguage";
import t from "../lib/translations";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { lang, dir, isAr } = useLanguage();
  const tx = t[lang];

  const NAV_LINKS = [
  { to: "/", label: tx.nav_home },
  { to: "/about", label: tx.nav_about },
  { to: "/services", label: tx.nav_services },
  { to: "/clients", label: tx.nav_clients },
  { to: "/contact", label: tx.nav_contact }];


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);



  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="bg-secondary/80 py-3 opacity-75 rounded-[14px] w-full max-w-6xl transition-all duration-500 backdrop-blur-md shadow-md border border-white/10">




        
        
        {/* Desktop */}
        <div className="hidden md:grid px-6" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center shrink-0">
              <img src="https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/4c25434d1_Consolve_identity_compressed_HQai.png"

              alt="Consolve" className="h-8 w-auto"

              style={{ mixBlendMode: 'screen' }} />
              
            </Link>
          </div>

          {/* Center: Nav links */}
          <nav className="flex items-center gap-6" dir={dir}>
            {NAV_LINKS.map((link) =>
            <motion.div key={link.to} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
                <Link
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary whitespace-nowrap relative group ${
                location.pathname === link.to ? "text-primary" : "text-white/70"}`
                }>
                
                  {link.label}
                  <span className={`absolute -bottom-0.5 left-0 h-px bg-primary transition-all duration-300 ${
                location.pathname === link.to ? "w-full" : "w-0 group-hover:w-full"}`
                } />
                </Link>
              </motion.div>
            )}
          </nav>

          {/* Right: Language + CTA */}
          <div className="flex items-center justify-end gap-3">
            <LanguageSwitcher variant="dark" />
            




            
          </div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center justify-between px-5">
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/a90b3e265_image.png"
              alt="Consolve"
              className="h-8 w-auto"
              style={{ mixBlendMode: 'screen' }} />
            
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="dark" />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen &&
        <div className="md:hidden border-t border-white/10 mt-3 px-5 py-4 flex flex-col gap-3" dir={dir}>
            {NAV_LINKS.map((link) =>
          <Link
            key={link.to}
            to={link.to}
            className={`text-sm font-medium ${
            location.pathname === link.to ? "text-primary" : "text-white/70"}`
            }>
            
                {link.label}
              </Link>
          )}
            <Link
            to="/assessment"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-full hover:opacity-90 transition-opacity mt-1">
            
              {lang === "ar" ? "ابدأ التقييم" : "Start Assessment"}
            </Link>
          </div>
        }
      </motion.header>
    </div>);

}

function Footer() {
  const { lang, dir } = useLanguage();
  const tx = t[lang];
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let cancelled = false;
    base44.entities.SiteSettings.list("-created_date", 1)
      .then((list) => { if (!cancelled) setSettings((list || [])[0] || null); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const NAV_LINKS = [
  { to: "/", label: tx.nav_home },
  { to: "/about", label: tx.nav_about },
  { to: "/services", label: tx.nav_services },
  { to: "/clients", label: tx.nav_clients },
  { to: "/contact", label: tx.nav_contact },
  { to: "/careers", label: lang === "ar" ? "الوظائف" : "Careers" }];

  const email = settings?.contact_email || "info@consolve.com";
  const phone = settings?.contact_phone || "+1 (800) 555-0199";
  const socials = [
    { url: settings?.linkedin_url, Icon: Linkedin, label: "LinkedIn" },
    { url: settings?.twitter_url, Icon: Twitter, label: "Twitter" },
    { url: settings?.instagram_url, Icon: Instagram, label: "Instagram" },
  ].filter((s) => !!s.url);

  return (
    <footer className="bg-secondary text-secondary-foreground" dir={dir}>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="mb-4">
              <img src="https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/4c25434d1_Consolve_identity_compressed_HQai.png" alt="Consolve" className="h-9 w-auto" style={{ mixBlendMode: 'screen' }} />
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
              {NAV_LINKS.map((link) =>
              <Link key={link.to} to={link.to} className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                  {link.label}
                </Link>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-secondary-foreground/40 mb-4">
              {tx.footer_contact}
            </h4>
            <div className="flex flex-col gap-3 text-sm text-secondary-foreground/60">
              <span>{email}</span>
              <span>{phone}</span>
              {socials.length > 0 && (
                <div className="flex items-center gap-3 mt-1">
                  {socials.map(({ url, Icon, label }) => (
                    <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                      aria-label={label}
                      className="text-secondary-foreground/60 hover:text-primary transition-colors">
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-secondary-foreground/30">{tx.footer_rights(new Date().getFullYear())}</p>
          <div className="flex items-center gap-6">
            {settings?.privacy_url ? (
              <a href={settings.privacy_url} target="_blank" rel="noopener noreferrer" className="text-xs text-secondary-foreground/30 hover:text-primary transition-colors">{tx.footer_privacy}</a>
            ) : (
              <span className="text-xs text-secondary-foreground/30 hover:text-primary cursor-pointer transition-colors">{tx.footer_privacy}</span>
            )}
            {settings?.terms_url ? (
              <a href={settings.terms_url} target="_blank" rel="noopener noreferrer" className="text-xs text-secondary-foreground/30 hover:text-primary transition-colors">{tx.footer_terms}</a>
            ) : (
              <span className="text-xs text-secondary-foreground/30 hover:text-primary cursor-pointer transition-colors">{tx.footer_terms}</span>
            )}
          </div>
        </div>
      </div>

    </footer>);

}

export default function Layout() {
  const { lang, isAr } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dir = isAr ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isAr]);

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      {/* Spacer for fixed floating navbar */}
      <div className="h-20" />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>);

}