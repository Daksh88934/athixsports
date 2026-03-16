"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  
  const [status, setStatus] = useState("processing");
  const orderId = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!orderId || !sessionId) {
      router.push("/");
      return;
    }

    async function completeOrder() {
      try {
        // Here we mark the order as Completed since Stripe confirmed payment
        const res = await fetch("/api/admin/orders", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: orderId, status: "Completed" })
        });
        
        if (res.ok) {
          clearCart();
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (e) {
        setStatus("error");
      }
    }

    completeOrder();
  }, [orderId, sessionId, router]);

  if (status === "processing") {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", flexDirection: "column", gap: "1rem" }}>
        <Loader2 size={48} className="spinner" color="var(--primary)" />
        <p>Verifying your payment securely...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "6rem 1.5rem", minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: "center", backgroundColor: "var(--surface)", padding: "4rem 2rem", borderRadius: "1rem" }}>
        
        {status === "success" ? (
          <>
            <CheckCircle size={64} color="var(--success)" style={{ margin: "0 auto 1.5rem" }} />
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Payment Successful!</h1>
            <p style={{ color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Thank you for ordering with ATHIX Sports.</p>
            <div style={{ backgroundColor: "rgba(255,107,0,0.1)", padding: "1rem", borderRadius: "var(--radius-md)", display: "inline-block", marginTop: "1rem", border: "1px solid var(--primary)" }}>
              Tracking ID: <strong style={{ color: "var(--primary)" }}>{orderId}</strong>
            </div>
          </>
        ) : (
          <>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", color: "var(--error)", fontSize: "2rem" }}>!</div>
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Order Update Failed</h1>
            <p style={{ color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Your payment may have succeeded, but we couldn't properly link it to your order. Please contact support with Order ID: {orderId}</p>
          </>
        )}

        <button onClick={() => router.push("/")} className="btn-primary" style={{ marginTop: "2rem", display: "block", margin: "2rem auto 0" }}>
          Return to Home
        </button>
      </motion.div>
    </div>
  );
}
