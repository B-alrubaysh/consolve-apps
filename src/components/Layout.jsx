import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ConsolveIcon from "./ConsolveIcon";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/clients", label: "Clients" },
  { to: "/contact", label: "Contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

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
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <ConsolveIcon className="w-8 h-8" color="hsl(190, 43%, 10%)" />
          <span className="text-xl font-semibold tracking-tight text-secondary font-inter">
            consolve
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/assessment"
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Start Assessment
          </Link>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-secondary"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-border">
          <div className="px-6 py-6 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-base font-medium ${
                  location.pathname === link.to
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/assessment"
              className="bg-primary text-primary-foreground px-5 py-3 rounded-full text-sm font-semibold text-center mt-2"
            >
              Start Assessment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <ConsolveIcon className="w-8 h-8" color="hsl(14, 70%, 62%)" />
              <span className="text-xl font-semibold tracking-tight text-white font-inter">
                consolve
              </span>
            </div>
            <p className="text-secondary-foreground/60 text-sm leading-relaxed max-w-sm">
              Built to solve. Premium consulting solutions for operations,
              governance, finance, and beyond.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-secondary-foreground/40 mb-4">
              Navigate
            </h4>
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-secondary-foreground/40 mb-4">
              Contact
            </h4>
            <div className="flex flex-col gap-3 text-sm text-secondary-foreground/60">
              <span>info@consolve.com</span>
              <span>+1 (800) 555-0199</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-secondary-foreground/30">
            © {new Date().getFullYear()} Consolve. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-secondary-foreground/30 hover:text-primary cursor-pointer transition-colors">Privacy</span>
            <span className="text-xs text-secondary-foreground/30 hover:text-primary cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </div>

      {/* Giant logo watermark */}
      <div className="overflow-hidden pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center opacity-10">
            <ConsolveIcon className="w-24 h-24" color="hsl(14, 70%, 62%)" />
            <span className="text-8xl md:text-[10rem] font-bold tracking-tighter text-primary font-inter leading-none">
              consolve
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
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