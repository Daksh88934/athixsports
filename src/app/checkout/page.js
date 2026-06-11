"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag, CreditCard, User, MapPin } from "lucide-react";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "", phone: user?.phone || "",
    address: "", city: "", state: "", pincode: "", paymentMethod: "cod"
  });

  const handleOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items, total: `₹${total.toLocaleString()}`, userId: user?.id })
      });
      const data = await res.json();
      if (res.ok) {
        clearCart();
        router.push(`/checkout/success?orderId=${data.orderId}`);
      } else {
        setStatus("error");
      }
    } catch (e) {
      setStatus("error");
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ paddingTop: "8rem", textAlign: "center", minHeight: "100vh" }}>
        <ShoppingBag size={60} style={{ color: "var(--border)", margin: "0 auto 1rem" }} />
        <h2 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Your cart is empty</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>Add some products before checkout</p>
        <button onClick={() => router.push("/products")} className="btn-primary">Browse Products</button>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "6rem", minHeight: "100vh" }}>
      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900 }}>
            Checkout
          </h1>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "2rem", alignItems: "start" }}>
          {/* Form */}
          <form onSubmit={handleOrder} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Contact */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <User size={18} style={{ color: "var(--primary)" }} /> Contact Info
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <input required placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    style={{ padding: "0.8rem 1rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text)", outline: "none" }} />
                  <input required type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    style={{ padding: "0.8rem 1rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text)", outline: "none" }} />
                </div>
                <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{ padding: "0.8rem 1rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text)", outline: "none" }} />
              </div>
            </div>

            {/* Address */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MapPin size={18} style={{ color: "var(--primary)" }} /> Delivery Address
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <input required placeholder="Street Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                  style={{ padding: "0.8rem 1rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text)", outline: "none" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                  {[["city", "City"], ["state", "State"], ["pincode", "PIN Code"]].map(([field, placeholder]) => (
                    <input key={field} required placeholder={placeholder} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                      style={{ padding: "0.8rem 1rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text)", outline: "none" }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CreditCard size={18} style={{ color: "var(--primary)" }} /> Payment Method
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{
                  padding: "1rem", background: "rgba(255,107,0,0.1)",
                  border: "1px solid var(--primary)",
                  borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.75rem"
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--primary)" }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>💵 Cash on Delivery</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>Pay when you receive your order</div>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={status === "loading"} className="btn-primary" style={{ justifyContent: "center", padding: "1rem", fontSize: "1rem" }}>
              {status === "loading" ? <Loader2 size={18} className="spinner" /> : `Place Order — ₹${total.toLocaleString()}`}
            </button>
            {status === "error" && <p style={{ color: "var(--error)", textAlign: "center", fontSize: "0.9rem" }}>Failed to place order. Try again.</p>}
          </form>

          {/* Order Summary */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", position: "sticky", top: "7rem" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>Order Summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
              {items.map(item => (
                <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 6, background: item.color || "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>👕</div>
                    <div>
                      <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>{item.title}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>× {item.quantity} • {item.size}</p>
                    </div>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{item.price}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
              {[["Subtotal", `₹${total.toLocaleString()}`], ["Shipping", "FREE"], ["Tax (18%)", `₹${Math.round(total * 0.18).toLocaleString()}`]].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{label}</span>
                  <span style={{ fontSize: "0.9rem", color: val === "FREE" ? "var(--success)" : "var(--text)" }}>{val}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "0.75rem", marginTop: "0.75rem" }}>
                <span style={{ fontWeight: 700, fontSize: "1rem" }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: "1.2rem", color: "var(--primary)" }}>₹{Math.round(total * 1.18).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
