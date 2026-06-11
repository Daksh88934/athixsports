"use client";
import { motion } from "framer-motion";
import { Target, Users, Award, Zap } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{
        padding: "5rem 0 4rem",
        background: "radial-gradient(ellipse at 50% 50%, rgba(255,107,0,0.08) 0%, transparent 65%)",
        textAlign: "center"
      }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span style={{ display: "inline-block", padding: "0.3rem 0.9rem", background: "rgba(255,107,0,0.15)", color: "var(--primary)", borderRadius: 100, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.25rem" }}>Our Story</span>
            <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, marginBottom: "1.5rem" }}>
              About <span style={{ background: "linear-gradient(135deg, var(--primary), #ff9a4a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ATHIX Sports</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", maxWidth: 680, margin: "0 auto 2rem", lineHeight: 1.8 }}>
              Meerut's premier destination for custom sports apparel, tournament kits, and high-performance gym wear.
              With over 20+ years of experience, we craft sportswear that champions deserve.
            </p>
            <Link href="/contact" className="btn-primary" style={{ fontSize: "1rem" }}>Get In Touch</Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "var(--surface)", padding: "3rem 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div className="grid-4" style={{ gap: "2rem", textAlign: "center" }}>
            {[
              ["1.2L+", "Jerseys Delivered", Award],
              ["2700+", "Happy Clients", Users],
              ["500+", "Locations Served", Target],
              ["20+", "Years of Experience", Zap]
            ].map(([val, label, Icon]) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Icon size={24} style={{ color: "var(--primary)", margin: "0 auto 0.75rem" }} />
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--primary)" }}>{val}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.25rem" }}>{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: "5rem 0" }}>
        <div className="container">
          <div className="about-mission-grid" style={{ display: "grid", gap: "4rem", alignItems: "center" }}>
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span style={{ display: "inline-block", padding: "0.3rem 0.9rem", background: "rgba(255,107,0,0.15)", color: "var(--primary)", borderRadius: 100, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Our Mission</span>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, marginBottom: "1.5rem" }}>
                Designed in India,<br />
                <span style={{ background: "linear-gradient(135deg, var(--primary), #ff9a4a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Crafted for Greatness</span>
              </h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.9, marginBottom: "1.25rem" }}>
                At ATHIX Sports, we believe that what you wear affects how you play. A well-designed kit builds team identity, boosts confidence, and creates unity on the field.
              </p>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.9, marginBottom: "1.5rem" }}>
                Based in Meerut, we combine cutting-edge fabric technology with world-class design to deliver sportswear that teams deserve. Every stitch, every color, every detail — crafted with purpose.
              </p>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Link href="/products" className="btn-primary">Explore Products</Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                ["Bespoke Design", "Every design is tailored to your club colours. We don't limit the design."],
                ["Quick Delivery", "Delivery time starting at just 3 to 10 Days."],
                ["Premium Quality", "High-performance fabrics built for serious athletes and teams."],
                ["Made in India", "Our teamwear designed and manufactured proudly in India."],
                ["Dedicated Support", "End-to-end support from enquiry to delivery."],
              ].map(([title, desc]) => (
                <div key={title} style={{
                  padding: "1rem 1.25rem", background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)"
                }}>
                  <div>
                    <h4 style={{ fontWeight: 700, marginBottom: "0.25rem", fontSize: "0.95rem" }}>{title}</h4>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.6 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section style={{ background: "var(--surface)", padding: "5rem 0", borderTop: "1px solid var(--border)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span style={{ display: "inline-block", padding: "0.3rem 0.9rem", background: "rgba(255,107,0,0.15)", color: "var(--primary)", borderRadius: 100, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Find Us</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, marginBottom: "1rem" }}>
            Visit Our <span style={{ background: "linear-gradient(135deg, var(--primary), #ff9a4a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Store</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2.5rem" }}>35-B, Street No.2, Nehru Nagar, Meerut, Uttar Pradesh</p>

          <div className="grid-3" style={{ gap: "1.5rem", maxWidth: 700, margin: "0 auto" }}>
            {[
              ["📍", "Address", "35-B, Street No.2,\nNehru Nagar, Meerut"],
              ["📞", "Phone", "+91 8755022067\n+91 9411262264"],
              ["✉️", "Email", "athixsports@gmail.com"],
            ].map(([emoji, title, info]) => (
              <div key={title} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{emoji}</div>
                <h4 style={{ fontWeight: 700, marginBottom: "0.5rem", fontSize: "0.9rem" }}>{title}</h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", whiteSpace: "pre-line", lineHeight: 1.6 }}>{info}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "2rem" }}>
            <a href="https://maps.app.goo.gl/Y1QTCV3kGFzKgZP36" target="_blank" rel="noopener noreferrer" className="btn-outline">
              📍 Open in Google Maps
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .about-mission-grid {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 768px) {
          .about-mission-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
