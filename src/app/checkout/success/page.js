"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Package, Home, ShoppingBag } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div style={{ paddingTop: "8rem", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: "center", maxWidth: 520, padding: "0 1.5rem" }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
          style={{ width: 90, height: 90, background: "rgba(34,197,94,0.15)", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
          <CheckCircle size={48} style={{ color: "var(--success)" }} />
        </motion.div>

        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "0.75rem" }}>Order Placed! 🎉</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginBottom: "1.5rem", lineHeight: 1.7 }}>
          Your order has been successfully placed. We'll start processing it right away!
        </p>

        {orderId && (
          <div style={{
            padding: "1rem 1.5rem", background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)", marginBottom: "2rem", display: "inline-block"
          }}>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "0.25rem" }}>Order ID</p>
            <p style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--primary)", letterSpacing: 1 }}>{orderId}</p>
          </div>
        )}

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.25rem", marginBottom: "2rem", textAlign: "left" }}>
          {[["📦", "Processing", "We're preparing your order"], ["🚚", "Shipping", "Dispatched within 2 business days"], ["✅", "Delivery", "Expected in 5-7 business days"]].map(([icon, step, desc]) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.6rem 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: "1.3rem" }}>{icon}</span>
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{step}</p>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn-primary"><Home size={16} /> Back to Home</Link>
          <Link href="/products" className="btn-outline"><ShoppingBag size={16} /> Keep Shopping</Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return <Suspense fallback={<div style={{ paddingTop: "8rem", textAlign: "center" }}>Loading...</div>}><SuccessContent /></Suspense>;
}
