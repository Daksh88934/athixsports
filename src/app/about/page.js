"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: "6rem 1.5rem", maxWidth: "800px" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: "4rem" }}
      >
        <div style={{
          display: "inline-flex",
          padding: "1rem",
          backgroundColor: "rgba(255,107,0,0.1)",
          borderRadius: "var(--radius-full)",
          marginBottom: "2rem"
        }}>
          {/* Logo Placeholder */}
          <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary)" }}>ATHIX</span>
        </div>
        <h1 className="heading-1" style={{ marginBottom: "1rem", textTransform: "uppercase" }}>
          About <span className="text-gradient">Us</span>
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          backgroundColor: "var(--surface)",
          padding: "3rem",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
          lineHeight: "1.8",
          fontSize: "1.125rem",
          color: "var(--text-secondary)"
        }}
      >
        <p style={{ marginBottom: "1.5rem" }}>
          <strong style={{ color: "#fff" }}>Welcome to ATHIX SPORTS,</strong> your destination for custom sports apparel and tournament kits! 
          We provide high-quality, tailor-made gear for athletes, academies, corporations, and schools. 
          Our collection includes academy dresses, corporate t-shirts, promotional wear, and durable school sports dresses.
        </p>
        
        <p style={{ marginBottom: "1.5rem" }}>
          At ATHIX SPORTS, we prioritize quality, using premium fabrics to ensure comfort, durability, and performance. 
          Whether you&apos;re outfitting a team or creating unique promotional apparel, we offer customization options to reflect your identity.
        </p>

        <p style={{ marginBottom: "2rem" }}>
          We understand the importance of looking great while performing at your best, which is why our products 
          are designed to combine both style and functionality. Our team works closely with you to bring your vision to life, 
          from initial design to final product. With attention to detail and a focus on customer satisfaction, we guarantee 
          that our apparel will exceed your expectations.
        </p>

        <div style={{
          padding: "2rem",
          backgroundColor: "var(--background)",
          borderRadius: "var(--radius-md)",
          borderLeft: "4px solid var(--primary)"
        }}>
          <p style={{ fontStyle: "italic", color: "#fff", fontWeight: 500 }}>
            Visit our website or contact us today to explore our products and find the perfect apparel for your needs. 
            Let us help you make a lasting impression with personalized, high-performance gear!
          </p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          marginTop: "4rem",
          flexWrap: "wrap"
        }}
      >
        {[
          "Premium Fabrics", "Comfort & Durability", "Tailored to Identity", "Style & Functionality"
        ].map((perk, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#fff", fontWeight: 600 }}>
            <CheckCircle2 color="var(--primary)" size={20} />
            {perk}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
