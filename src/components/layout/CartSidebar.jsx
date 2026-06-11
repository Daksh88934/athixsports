"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartSidebar() {
  const { items, isOpen, setIsOpen, removeItem, updateQty, total, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1001, backdropFilter: "blur(4px)" }} />

          {/* Sidebar */}
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              position: "fixed", right: 0, top: 0, bottom: 0, width: "min(420px, 100vw)",
              background: "var(--surface)", borderLeft: "1px solid var(--border)",
              zIndex: 1002, display: "flex", flexDirection: "column"
            }}>

            {/* Header */}
            <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <ShoppingBag size={20} style={{ color: "var(--primary)" }} />
                <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>Cart ({items.length})</h2>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)" }}>
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.5rem" }}>
              {items.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem 0" }}>
                  <ShoppingBag size={48} style={{ color: "var(--border)", margin: "0 auto 1rem" }} />
                  <p style={{ color: "var(--text-secondary)" }}>Your cart is empty</p>
                  <button onClick={() => setIsOpen(false)} className="btn-primary" style={{ marginTop: "1.5rem" }}>
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {items.map(item => (
                    <div key={item.key} style={{
                      background: "var(--surface-2)", borderRadius: "var(--radius-md)",
                      padding: "1rem", border: "1px solid var(--border)", display: "flex", gap: "1rem", alignItems: "center"
                    }}>
                      {/* Color dot */}
                      <div style={{
                        width: 50, height: 50, borderRadius: 8, flexShrink: 0,
                        background: item.color || "var(--primary)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.2rem"
                      }}>👕</div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.25rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</p>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginBottom: "0.5rem" }}>Size: {item.size} • {item.color}</p>
                        <p style={{ color: "var(--primary)", fontWeight: 700, fontSize: "0.9rem" }}>{item.price}</p>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                        <button onClick={() => removeItem(item.key)} style={{ background: "none", border: "none", color: "var(--error)", cursor: "pointer" }}>
                          <Trash2 size={14} />
                        </button>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <button onClick={() => updateQty(item.key, item.quantity - 1)} style={{ width: 24, height: 24, background: "var(--border)", border: "none", borderRadius: 4, color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: "0.85rem", fontWeight: 600, minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                          <button onClick={() => updateQty(item.key, item.quantity + 1)} style={{ width: 24, height: 24, background: "var(--border)", border: "none", borderRadius: 4, color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: "1.5rem", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--primary)" }}>₹{total.toLocaleString()}</span>
                </div>
                <Link href="/checkout" onClick={() => setIsOpen(false)} className="btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: "0.75rem", display: "flex" }}>
                  Proceed to Checkout
                </Link>
                <button onClick={clearCart} style={{ width: "100%", background: "none", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "0.65rem", color: "var(--text-secondary)", fontSize: "0.85rem", cursor: "pointer" }}>
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
