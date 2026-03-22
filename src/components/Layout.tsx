import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Phone, Mail, MapPin, User, Shield, LogOut } from "lucide-react";
import { useGoldRate } from "@/contexts/GoldRateContext";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import grtLogo from "@/assets/grt-logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Our Collection" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { goldRate } = useGoldRate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Gold Rate Ticker */}
      <div className="gradient-gold py-1.5 overflow-hidden">
        <div className="animate-ticker-scroll whitespace-nowrap flex gap-16">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="text-primary-foreground text-sm font-body tracking-wide">
              ✦ Today's Gold Rate: ₹{goldRate.toLocaleString("en-IN")}/gram &nbsp;&nbsp; ✦ Special Offer: ₹150/gram Discount &nbsp;&nbsp; ✦ Free Shipping on Orders Above ₹50,000 &nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center">
            <img
              src={grtLogo}
              alt="GRT Jewellers"
              className="h-10 md:h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-body text-sm tracking-wide uppercase transition-colors hover:text-primary ${
                  location.pathname === link.to ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-card border-b border-border overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`font-body text-base py-2 px-3 rounded-md transition-colors ${
                      location.pathname === link.to
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-foreground text-primary-foreground">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <img src={grtLogo} alt="GRT Jewellers" className="h-12 w-auto mb-4 brightness-0 invert opacity-80" />
              <p className="text-sm opacity-80 leading-relaxed">
                Crafting timeless jewellery since 1964. Every piece tells a story of heritage, artistry, and elegance.
              </p>
            </div>
            <div>
              <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
              <div className="flex flex-col gap-3 text-sm opacity-80">
                <span className="flex items-center gap-2"><Phone size={14} /> +91 98765 43210</span>
                <span className="flex items-center gap-2"><Mail size={14} /> info@grtjewellery.com</span>
                <span className="flex items-center gap-2"><MapPin size={14} /> Chennai, Tamil Nadu, India</span>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-10 pt-6 text-center text-xs opacity-60">
            © {new Date().getFullYear()} GRT Jewellery. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
