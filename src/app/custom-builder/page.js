"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Download, ShoppingBag, RotateCcw, Shirt } from "lucide-react";
import { useCart } from "@/context/CartContext";

const COLORS = [
  { name: "Orange", hex: "#ff6b00" }, { name: "Red", hex: "#ef4444" },
  { name: "Blue", hex: "#3b82f6" }, { name: "Green", hex: "#22c55e" },
  { name: "Purple", hex: "#a855f7" }, { name: "Black", hex: "#1a1a1a" },
  { name: "White", hex: "#f5f5f5" }, { name: "Navy", hex: "#1e3a5f" },
  { name: "Gold", hex: "#f59e0b" }, { name: "Pink", hex: "#ec4899" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function CustomBuilderPage() {
  const [primaryColor, setPrimaryColor] = useState("#ff6b00");
  const [secondaryColor, setSecondaryColor] = useState("#1a1a1a");
  const [size, setSize] = useState("M");
  const [text, setText] = useState("ATHIX");
  const [number, setNumber] = useState("10");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    setAdding(true);
    const customProduct = {
      id: `custom-${Date.now()}`,
      title: `Custom Jersey — ${text} #${number}`,
      price: `₹${(1499 * quantity).toLocaleString()}`,
      color: primaryColor,
      category: "Custom",
      inStock: true,
      isCustom: true,
      customText: text,
      customNumber: number,
      primaryColor,
      secondaryColor,
    };
    addItem(customProduct, quantity, size, primaryColor);
    setTimeout(() => setAdding(false), 1000);
  };

  return (
    <div style={{ paddingTop: "6rem", minHeight: "100vh" }}>
      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "2.5rem" }}>
          <span className="badge" style={{ marginBottom: "0.75rem", display: "inline-block" }}>3D Builder</span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, marginBottom: "0.5rem" }}>
            Custom <span style={{ color: "var(--primary)" }}>Builder</span>
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>Design your perfect jersey in real time</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem", alignItems: "start" }}>
          {/* Preview */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)", padding: "3rem", textAlign: "center",
              minHeight: 500, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              position: "sticky", top: "7rem"
            }}>
            {/* Jersey SVG Preview */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              style={{ marginBottom: "2rem" }}>
              <svg viewBox="0 0 200 200" width="280" height="280">
                {/* Jersey body */}
                <path d="M 60 40 L 30 70 L 50 80 L 50 170 L 150 170 L 150 80 L 170 70 L 140 40 L 120 55 Q 100 65 80 55 Z"
                  fill={primaryColor} stroke={secondaryColor} strokeWidth="3" />
                {/* Collar */}
                <path d="M 80 55 Q 100 75 120 55" fill="none" stroke={secondaryColor} strokeWidth="4" />
                {/* Side stripes */}
                <rect x="50" y="90" width="12" height="80" fill={secondaryColor} opacity="0.6" />
                <rect x="138" y="90" width="12" height="80" fill={secondaryColor} opacity="0.6" />
                {/* Number */}
                <text x="100" y="130" textAnchor="middle" fontSize="32" fontWeight="bold" fill={secondaryColor} fontFamily="Arial">{number}</text>
                {/* Name */}
                <text x="100" y="158" textAnchor="middle" fontSize="11" fontWeight="bold" fill={secondaryColor} fontFamily="Arial" letterSpacing="2">{text.toUpperCase()}</text>
              </svg>
            </motion.div>

            <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Custom Jersey Preview</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              {text} #{number} • Size {size}
            </p>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: primaryColor, border: "2px solid rgba(255,255,255,0.2)" }} />
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: secondaryColor, border: "2px solid rgba(255,255,255,0.2)" }} />
            </div>
          </motion.div>

          {/* Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Primary Color */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Palette size={18} style={{ color: "var(--primary)" }} /> Primary Color
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {COLORS.map(c => (
                  <button key={c.hex} onClick={() => setPrimaryColor(c.hex)} title={c.name}
                    style={{
                      width: 34, height: 34, borderRadius: "50%", background: c.hex, cursor: "pointer",
                      border: primaryColor === c.hex ? "3px solid var(--primary)" : "2px solid rgba(255,255,255,0.1)",
                      transform: primaryColor === c.hex ? "scale(1.2)" : "scale(1)", transition: "all 0.2s"
                    }} />
                ))}
              </div>
            </div>

            {/* Secondary Color */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Palette size={18} style={{ color: "var(--primary)" }} /> Secondary Color
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {COLORS.map(c => (
                  <button key={c.hex} onClick={() => setSecondaryColor(c.hex)} title={c.name}
                    style={{
                      width: 34, height: 34, borderRadius: "50%", background: c.hex, cursor: "pointer",
                      border: secondaryColor === c.hex ? "3px solid var(--primary)" : "2px solid rgba(255,255,255,0.1)",
                      transform: secondaryColor === c.hex ? "scale(1.2)" : "scale(1)", transition: "all 0.2s"
                    }} />
                ))}
              </div>
            </div>

            {/* Text & Number */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Shirt size={18} style={{ color: "var(--primary)" }} /> Personalize
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>Player Name</label>
                  <input value={text} onChange={e => setText(e.target.value.toUpperCase())} maxLength={12} placeholder="YOUR NAME"
                    style={{ width: "100%", padding: "0.75rem 1rem", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text)", fontSize: "0.95rem", outline: "none", letterSpacing: 2 }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>Jersey Number</label>
                  <input value={number} onChange={e => setNumber(e.target.value)} maxLength={3} placeholder="10" type="number"
                    style={{ width: "100%", padding: "0.75rem 1rem", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text)", fontSize: "0.95rem", outline: "none" }} />
                </div>
              </div>
            </div>

            {/* Size */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Select Size</h3>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {SIZES.map(s => (
                  <button key={s} onClick={() => setSize(s)} style={{
                    width: 44, height: 44, borderRadius: "var(--radius-sm)", cursor: "pointer",
                    background: size === s ? "var(--primary)" : "var(--surface-2)",
                    color: size === s ? "#fff" : "var(--text-secondary)",
                    border: size === s ? "none" : "1px solid var(--border)",
                    fontWeight: 600, fontSize: "0.85rem", transition: "all 0.2s"
                  }}>{s}</button>
                ))}
              </div>
            </div>

            {/* Quantity & Price */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <h3 style={{ fontWeight: 700 }}>Quantity</h3>
                <span style={{ color: "var(--primary)", fontWeight: 800, fontSize: "1.1rem" }}>₹{(1499 * quantity).toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer", fontSize: "1.2rem" }}>−</button>
                <span style={{ fontWeight: 700, fontSize: "1.1rem", minWidth: 30, textAlign: "center" }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer", fontSize: "1.2rem" }}>+</button>
              </div>
              <button onClick={handleAddToCart} disabled={adding} className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "1rem", padding: "0.9rem" }}>
                <ShoppingBag size={18} />
                {adding ? "Added to Cart! ✓" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .container > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
