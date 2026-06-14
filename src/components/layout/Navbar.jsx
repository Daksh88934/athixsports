"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, User, LogOut, ChevronDown, Sun, Moon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { count, setIsOpen } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    ...(!user ? [{ href: "/login", label: "Login" }] : []),
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      padding: scrolled ? "0.6rem 0" : "1rem 0",
      background: scrolled ? (theme === "dark" ? "rgba(10,10,10,0.97)" : "rgba(251,251,251,0.97)") : "var(--background)",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition: "all 0.3s ease"
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <img 
            src="/logo.jpg" 
            alt="ATHIX" 
            className="theme-logo"
            style={{ 
              height: 52, 
              display: "block",
              transition: "transform 0.3s ease",
            }} 
            onMouseEnter={e => e.target.style.transform = "scale(1.05) translateY(-1px)"}
            onMouseLeave={e => e.target.style.transform = "scale(1) translateY(0px)"}
          />
        </Link>

        {/* Desktop Links */}
        <div style={{ display: "flex", gap: "1.75rem", alignItems: "center" }} className="desktop-nav">
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{
              color: pathname === l.href ? "var(--primary)" : "var(--text-secondary)",
              fontWeight: 500, fontSize: "0.95rem", transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "var(--primary)"}
              onMouseLeave={e => e.target.style.color = pathname === l.href ? "var(--primary)" : "var(--text-secondary)"}
            >{l.label}</Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Theme Toggle */}
          <button onClick={toggleTheme} style={{
            background: "none", border: "none",
            color: "var(--text)", cursor: "pointer", padding: "0.5rem",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {theme === "dark" ? (
              <Sun size={20} fill="var(--primary)" color="var(--primary)" />
            ) : (
              <Moon size={20} fill="#111" color="#111" />
            )}
          </button>

          {/* Cart */}
          <button onClick={() => setIsOpen(true)} style={{
            position: "relative", background: "none", border: "none",
            color: "var(--text)", cursor: "pointer", padding: "0.5rem",
          }}>
            <ShoppingBag size={24} />
            {count > 0 && (
              <span style={{
                position: "absolute", top: 0, right: 0,
                background: "var(--primary)", color: "#fff",
                borderRadius: "50%", width: 18, height: 18,
                fontSize: "0.7rem", fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>{count}</span>
            )}
          </button>

          {/* User dropdown if logged in */}
          {user && (
            <div style={{ position: "relative" }}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)", padding: "0.45rem 0.9rem",
                color: "var(--text)", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer"
              }}>
                <User size={15} />
                {user.name?.split(" ")[0]}
                <ChevronDown size={13} />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    style={{
                      position: "absolute", top: "calc(100% + 8px)", right: 0,
                      background: "var(--surface)", border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)", overflow: "hidden", minWidth: 160, zIndex: 100,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                    }}>
                    {user.role === "admin" && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)} style={{
                        display: "block", padding: "0.7rem 1rem", color: "var(--primary)",
                        fontWeight: 600, borderBottom: "1px solid var(--border)", fontSize: "0.85rem"
                      }}>⚙️ Admin Panel</Link>
                    )}
                    <button onClick={() => { logout(); setUserMenuOpen(false); }} style={{
                      width: "100%", display: "flex", alignItems: "center", gap: "0.5rem",
                      padding: "0.7rem 1rem", color: "var(--text-secondary)", background: "none",
                      border: "none", fontSize: "0.85rem", textAlign: "left", cursor: "pointer"
                    }}>
                      <LogOut size={13} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{
            background: "none", border: "none", color: "var(--text)", display: "none", cursor: "pointer"
          }} className="mobile-menu-btn">
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", overflow: "hidden" }}>
            <div className="container" style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0" }}>
              {links.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} style={{
                  padding: "0.85rem 0", color: pathname === l.href ? "var(--primary)" : "var(--text)",
                  fontWeight: 500, borderBottom: "1px solid var(--border)", fontSize: "0.95rem"
                }}>{l.label}</Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
