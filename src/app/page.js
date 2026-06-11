"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, MessageSquare, PanelsTopLeft, PenTool, SquareCheckBig, FileText, Scissors, Truck, PackageCheck, Map } from "lucide-react";
import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";

const PROCESS_STEPS = [
  { icon: MessageSquare, title: "Enquire", desc: "Drop us a message via social media or email to discuss what you need." },
  { icon: PanelsTopLeft, title: "Digital Design", desc: "See your product before you order." },
  { icon: PenTool, title: "Bespoke Design", desc: "Every design is tailored to the club colours. We don't limit the design." },
  { icon: SquareCheckBig, title: "Confirm Sizes & Designs", desc: "Sizes and Design will be confirmed with the manufacturer." },
  { icon: FileText, title: "Invoice & Payment", desc: "Invoice will be provided with terms & conditions and payment confirmation." },
  { icon: Scissors, title: "Manufacturing", desc: "Depending on the product, here are various lead times. Sit back and relax." },
  { icon: Truck, title: "Quick Delivery", desc: "Delivery time starting at just 3 To 10 Days." },
  { icon: PackageCheck, title: "Received Products", desc: "Received your product safely at your location." },
  { icon: Map, title: "Design in India", desc: "Our teamwear designed and manufactured proudly in India." },
];

function RotatingJersey() {
  return (
    <div style={{ position: "relative", width: 420, height: 460, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Glow rings */}
      <div style={{
        position: "absolute", width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,107,0,0.18) 0%, transparent 70%)",
        animation: "glowPulse 3s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute", width: 380, height: 380, borderRadius: "50%",
        border: "1px solid rgba(255,107,0,0.1)",
        animation: "ringRotate 12s linear infinite"
      }} />
      <div style={{
        position: "absolute", width: 420, height: 420, borderRadius: "50%",
        border: "1px dashed rgba(255,107,0,0.06)",
        animation: "ringRotate 20s linear infinite reverse"
      }} />

      {/* Jersey image */}
      <div style={{ animation: "jerseyFloat 4s ease-in-out infinite", position: "relative", zIndex: 2 }}>
        <img
          src="/jersey.png"
          alt="ATHIX Jersey"
          style={{
            width: 380,
            height: 400,
            objectFit: "contain",
            filter: "drop-shadow(0 25px 50px rgba(255,107,0,0.35)) drop-shadow(0 10px 20px rgba(0,0,0,0.6))",
            animation: "jerseyTilt 8s ease-in-out infinite"
          }}
        />
      </div>

      <style>{`
        @keyframes jerseyFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-22px); }
        }
        @keyframes jerseyTilt {
          0%, 100% { filter: drop-shadow(0 25px 50px rgba(255,107,0,0.35)) drop-shadow(0 10px 20px rgba(0,0,0,0.6)) perspective(600px) rotateY(0deg); }
          25%       { filter: drop-shadow(-15px 20px 40px rgba(255,107,0,0.25)) drop-shadow(0 10px 20px rgba(0,0,0,0.6)); transform: translateY(-22px); }
          50%       { filter: drop-shadow(0 25px 50px rgba(255,107,0,0.35)) drop-shadow(0 10px 20px rgba(0,0,0,0.6)); }
          75%       { filter: drop-shadow(15px 20px 40px rgba(255,107,0,0.25)) drop-shadow(0 10px 20px rgba(0,0,0,0.6)); transform: translateY(-22px); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%       { opacity: 1; transform: scale(1.15); }
        }
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(d => setProducts(d.products?.slice(0, 4) || []));
  }, []);

  return (
    <>
      {/* ===== HERO ===== */}
      <section style={{
        minHeight: "calc(100vh - 80px)", display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
        background: "radial-gradient(ellipse at 65% 50%, rgba(255,107,0,0.08) 0%, transparent 65%)"
      }}>
        {/* Grid bg */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.025,
          backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "60px 60px", pointerEvents: "none"
        }} />

        <div className="container" style={{
          position: "relative", zIndex: 1, padding: "4rem 1.5rem",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center"
        }}>

          {/* LEFT */}
          <div>
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem",
                background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.25)",
                borderRadius: 100, padding: "0.4rem 1rem", color: "var(--primary)", fontSize: "0.85rem", fontWeight: 600
              }}>
              <Star size={13} fill="var(--primary)" />
              Over 20+ Years of Experience
            </motion.div>

            {/* Heading */}
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ fontSize: "clamp(2.8rem, 5vw, 5.5rem)", fontWeight: 900, lineHeight: 1.0, marginBottom: "1.5rem", letterSpacing: "-0.01em" }}>
              WEAR THE{" "}
              <span style={{ color: "var(--primary)" }}>WIN.</span>
              <br />
              DOMINATE THE{" "}
              <span style={{ color: "var(--primary)" }}>GAME.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ fontSize: "1.05rem", color: "var(--text-secondary)", marginBottom: "2.5rem", lineHeight: 1.8, maxWidth: 480 }}>
              High-performance custom sportswear tailored for athletes, academies, and champions. Designed in India, crafted for greatness.
            </motion.p>

            {/* CTA Buttons — both like original */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              style={{ marginBottom: "3rem" }}>
              <Link href="/products" className="btn-primary" style={{ fontSize: "1rem", padding: "0.9rem 2.2rem" }}>
                Explore Collection <ArrowRight size={18} />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              style={{ display: "flex", borderTop: "1px solid var(--border)", paddingTop: "1.75rem" }}>
              {[["1.2L+", "Jerseys Delivered"], ["2700+", "Happy Clients"], ["500+", "Locations Served"]].map(([val, label], i) => (
                <div key={label} style={{
                  flex: 1, textAlign: "center",
                  borderRight: i < 2 ? "1px solid var(--border)" : "none",
                  padding: "0 1rem"
                }}>
                  <h3 style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--text)", marginBottom: "0.2rem" }}>{val}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.78rem" }}>{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Rotating 3D Jersey */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <RotatingJersey />
          </motion.div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .hero-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ===== ENGINEERED FOR PERFORMANCE ===== */}
      <section className="container" style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, marginBottom: "1rem" }}>
          Engineered for{" "}
          <span style={{ color: "var(--primary)" }}>Performance</span>
        </h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: 800, margin: "0 auto 3rem", fontSize: "1.1rem", lineHeight: 1.7 }}>
          Discover our premium collections ranging from teamwear kits to promotional corporate apparel.
        </p>
        {products.length > 0 && (
          <>
            <div className="grid-4" style={{ textAlign: "left", marginBottom: "2.5rem" }}>
              {products.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
            <Link href="/products" className="btn-primary" style={{ fontSize: "1rem" }}>
              View All Products <ArrowRight size={18} />
            </Link>
          </>
        )}
      </section>

      {/* ===== OUR PROCESS ===== */}
      <section style={{ background: "var(--surface)", padding: "5rem 0", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, marginBottom: "0.75rem" }}>
              Our <span style={{ color: "var(--primary)" }}>Process</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>From concept to reality in 9 simple steps</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
            {PROCESS_STEPS.map((step, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.1 }}
                whileHover={{ y: -5, borderColor: "var(--primary)" }}
                style={{
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)", padding: "1.75rem",
                  position: "relative", transition: "all 0.25s ease"
                }}>
                <div style={{
                  position: "absolute", top: "1rem", right: "1rem", width: 28, height: 28,
                  borderRadius: "50%", background: "rgba(255,107,0,0.15)", border: "1px solid rgba(255,107,0,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.72rem", fontWeight: 800, color: "var(--primary)"
                }}>{i + 1}</div>
                <div style={{
                  width: 52, height: 52, borderRadius: "var(--radius-md)",
                  background: "rgba(255,107,0,0.1)", display: "flex",
                  alignItems: "center", justifyContent: "center", marginBottom: "1rem"
                }}>
                  <step.icon size={26} style={{ color: "var(--primary)" }} />
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", fontSize: "0.95rem" }}>{step.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.6 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
