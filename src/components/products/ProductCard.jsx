"use client";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    setAdding(true);
    addItem(product, 1, "M");
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <motion.div whileHover={{ y: -6 }} style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)", overflow: "hidden",
      transition: "box-shadow 0.3s"
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <Link href={`/products/${product.id}`} style={{ display: "block", color: "inherit" }}>
        {/* Image area */}
        <div style={{
          height: 220, background: `linear-gradient(135deg, ${product.color || "#ff6b00"}22, ${product.color || "#ff6b00"}44)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden"
        }}>
          {product.image ? (
            <img src={product.image} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "1rem" }} />
          ) : (
            <div style={{ fontSize: "5rem", opacity: 0.6 }}>👕</div>
          )}
          {!product.inStock && (
            <div style={{
              position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <span style={{ background: "var(--error)", color: "#fff", padding: "0.4rem 1rem", borderRadius: 100, fontWeight: 700, fontSize: "0.85rem" }}>Out of Stock</span>
            </div>
          )}
          <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem" }}>
            <span className="badge">{product.category}</span>
          </div>
          <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: product.color || "#ff6b00", border: "2px solid rgba(255,255,255,0.3)" }} />
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "1.25rem 1.25rem 0.5rem" }}>
          <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.4rem" }}>{product.title}</h3>
        </div>
      </Link>

      <div style={{ padding: "0 1.25rem 1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "var(--primary)", fontWeight: 800, fontSize: "1.1rem" }}>₹{product.price}</span>
          <button onClick={handleAdd} disabled={!product.inStock || adding} className="btn-primary"
            style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", gap: "0.3rem" }}>
            <ShoppingBag size={14} />
            {adding ? "Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
