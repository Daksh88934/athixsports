"use client";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", paddingTop: "3.5rem" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2.5rem", marginBottom: "2.5rem" }}>

          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "inline-block", marginBottom: "1rem" }}>
              <img 
                src="/logo.jpg" 
                alt="ATHIX" 
                className="theme-logo"
                style={{ 
                  height: 52,
                  transition: "transform 0.3s ease"
                }} 
                onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.target.style.transform = "scale(1)"}
              />
            </Link>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.8 }}>
              Meerut's premier destination for custom sports apparel, tournament kits, and high-performance gym wear. Wear The Win.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1.25rem", color: "var(--text)", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick Links</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[["Home", "/"], ["Shop", "/products"], ["About Us", "/about"], ["Contact Us", "/contact"]].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} style={{ color: "var(--text-secondary)", fontSize: "0.9rem", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = "var(--primary)"}
                    onMouseLeave={e => e.target.style.color = "var(--text-secondary)"}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1.25rem", color: "var(--text)", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Contact Us</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                <Phone size={18} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  <a href="tel:+918755022067" style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>+91 8755022067</a>
                  <a href="tel:+919411262264" style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>+91 9411262264</a>
                </div>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Mail size={18} style={{ color: "var(--primary)", flexShrink: 0 }} />
                <a href="mailto:athixsports@gmail.com" style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>athixsports@gmail.com</a>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                <MapPin size={18} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />
                <a href="https://maps.app.goo.gl/Y1QTCV3kGFzKgZP36" target="_blank" rel="noopener noreferrer"
                  style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>35-B, Street No.2, Nehru Nagar, Meerut</a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1.25rem", color: "var(--text)", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Follow Us</h4>
            <a href="https://instagram.com/athixsports" target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--text-secondary)", fontSize: "0.9rem", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--primary)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
            >
              {/* Instagram SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
              <span>@athixsports</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "1.25rem 0" }}>
        <div className="container">
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", textAlign: "center" }}>
            © {new Date().getFullYear()} ATHIX Sports. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
