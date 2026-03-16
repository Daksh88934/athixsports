"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function CustomBuilderPage() {
  const [selectedColor, setSelectedColor] = useState("#ff6b00");
  const [jerseyText, setJerseyText] = useState("ATHIX");
  const [number, setNumber] = useState("10");
  const [fabric, setFabric] = useState("Dri-FIT Polyester");
  const [stickers, setStickers] = useState([]);
  const [stickerSize, setStickerSize] = useState(3);
  const mockupRef = useRef(null);

  const colors = [
    { name: "Athix Orange", hex: "#ff6b00" },
    { name: "Midnight Black", hex: "#111111" },
    { name: "Royal Blue", hex: "#0033cc" },
    { name: "Crimson Red", hex: "#cc0000" },
    { name: "Neon Green", hex: "#39ff14" },
    { name: "Pure White", hex: "#f8f8f8" },
  ];

  const fabrics = [
    "Dri-FIT Polyester (Standard)",
    "Premium Lycra Blend (Stretch)",
    "Microdot Mesh (Breathable)",
    "Heavyweight Cotton (Casual)"
  ];

  const availableStickers = ["⭐", "🔥", "⚡", "👑", "⚽", "🏆", "🦅"];

  const handleAddSticker = (sticker) => {
    // Add sticker at a random position within the jersey bounds
    const newSticker = {
      id: Date.now(),
      emoji: sticker,
      size: stickerSize,
      x: 0,
      y: 0 
    };
    setStickers([...stickers, newSticker]);
  };

  const removeSticker = (id) => {
    setStickers(stickers.filter(s => s.id !== id));
  };

  return (
    <div className="container" style={{ padding: "4rem 1.5rem" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 className="heading-1" style={{ marginBottom: "1rem", textTransform: "uppercase" }}>
          <span className="text-gradient">Custom</span> Builder
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem", maxWidth: "600px", margin: "0 auto" }}>
          Design your perfect team kit and use our AI to visualize how it looks on you.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem" }}>
        {/* Editor Controls */}
        <div>
          <div style={{ backgroundColor: "var(--surface)", padding: "2rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>Jersey Options</h3>
            
            <div style={{ marginBottom: "2rem" }}>
              <label style={{ display: "block", marginBottom: "0.75rem", color: "var(--text-secondary)" }}>Base Color</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {colors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setSelectedColor(c.hex)}
                    title={c.name}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: c.hex,
                      border: selectedColor === c.hex ? "3px solid #fff" : "1px solid var(--border)",
                      boxShadow: selectedColor === c.hex ? "0 0 10px rgba(255,255,255,0.3)" : "none",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.75rem", color: "var(--text-secondary)" }}>Fabric Type</label>
              <select 
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  color: "#fff",
                  fontSize: "1rem"
                }}
              >
                {fabrics.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.75rem", color: "var(--text-secondary)" }}>Add Stickers/Logos</label>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", backgroundColor: "var(--background)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                {availableStickers.map(s => (
                  <button 
                    key={s} 
                    onClick={() => handleAddSticker(s)}
                    style={{ fontSize: "1.5rem", padding: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", cursor: "pointer", transition: "transform 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    {s}
                  </button>
                ))}
              </div>
              
              <div style={{ marginTop: "1rem" }}>
                <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                  <span>Sticker Size</span>
                  <span>{stickerSize}x</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="8" 
                  step="0.5" 
                  value={stickerSize} 
                  onChange={(e) => setStickerSize(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--primary)" }}
                />
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>Adjust size then click a sticker to add. Drag to place it anywhere. Double click it to remove.</p>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.75rem", color: "var(--text-secondary)" }}>Team/Custom Name</label>
              <input 
                type="text" 
                value={jerseyText}
                onChange={(e) => setJerseyText(e.target.value)}
                maxLength={15}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  color: "#fff",
                  fontSize: "1rem"
                }}
              />
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label style={{ display: "block", marginBottom: "0.75rem", color: "var(--text-secondary)" }}>Player Number</label>
              <input 
                type="text" 
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                maxLength={2}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  color: "#fff",
                  fontSize: "1rem"
                }}
              />
            </div>
            
            <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
              <button 
                className="btn-primary" 
                style={{ width: "100%" }}
                onClick={() => {
                  const text = `Hi, I want to order my Custom Jersey: ${jerseyText} - ${number}, Color: ${selectedColor}, Fabric: ${fabric}.`;
                  window.open(`https://wa.me/918755022067?text=${encodeURIComponent(text)}`, "_blank");
                }}
              >
                Order via WhatsApp
              </button>
              
              <a href="tel:+918755022067" className="btn-outline" style={{ width: "100%", textAlign: "center", textDecoration: "none" }}>
                📞 Call to Customize
              </a>
            </div>
          </div>
        </div>

        {/* Live Preview Area */}
        <div style={{ 
          backgroundColor: "var(--surface)", 
          borderRadius: "var(--radius-lg)", 
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem",
          minHeight: "600px",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Jersey Mockup SVG / Element */}
          <div 
            ref={mockupRef}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "350px",
              aspectRatio: "3/4",
              backgroundColor: selectedColor,
              clipPath: "polygon(25% 0, 75% 0, 100% 25%, 85% 35%, 85% 100%, 15% 100%, 15% 35%, 0 25%)",
              boxShadow: "inset 0 -20px 40px rgba(0,0,0,0.5), inset 0 20px 40px rgba(255,255,255,0.2)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2rem",
              transition: "background-color 0.4s ease"
            }}
          >
            <div style={{ 
              color: selectedColor === "#f8f8f8" ? "#111" : "#fff", 
              fontSize: "clamp(2rem, 4vw, 3rem)", 
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              textShadow: "0 4px 10px rgba(0,0,0,0.3)"
            }}>
              {jerseyText}
            </div>
            <div style={{ 
              color: selectedColor === "#f8f8f8" ? "#111" : "#fff", 
              fontSize: "clamp(4rem, 8vw, 6rem)", 
              fontWeight: 900,
              textShadow: "0 4px 10px rgba(0,0,0,0.3)"
            }}>
              {number}
            </div>

            {/* Placed Interactive Stickers */}
            {stickers.map(sticker => (
              <motion.div 
                key={sticker.id}
                drag
                dragConstraints={mockupRef}
                dragElastic={0}
                dragMomentum={false}
                onDoubleClick={() => removeSticker(sticker.id)}
                whileHover={{ scale: 1.1, cursor: "grab" }}
                whileDrag={{ scale: 1.2, cursor: "grabbing" }}
                style={{
                  position: "absolute",
                  fontSize: `${sticker.size}rem`,
                  userSelect: "none",
                  filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))",
                  zIndex: 20
                }}
                title="Drag to move. Double click to remove."
              >
                {sticker.emoji}
              </motion.div>
            ))}
            
            {/* Texture Overlay */}
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')",
              pointerEvents: "none",
              mixBlendMode: "overlay"
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
