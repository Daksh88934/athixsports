"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok && data.user.role === "admin") {
        setStatus("success");
        setMsg("Admin access granted.");
        setTimeout(() => login(data.user), 800);
      } else {
        setStatus("error");
        setMsg("Unauthorized. Invalid admin credentials.");
      }
    } catch(err) {
      setStatus("error");
      setMsg("Connection error.");
    }
  };

  return (
    <div style={{ padding: "6rem 1.5rem", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", backgroundColor: "var(--background)" }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#111",
          padding: "3rem 2.5rem",
          borderRadius: "var(--radius-lg)",
          border: "1px solid rgba(255,107,0,0.3)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.6)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <ShieldAlert size={48} color="var(--primary)" style={{ marginBottom: "1rem" }} />
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", marginBottom: "0.25rem" }}>Admin Portal</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Restricted Access Only</p>
        </div>

        {msg && (
          <div style={{ padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", textAlign: "center",
            backgroundColor: status === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            color: status === "success" ? "var(--success)" : "var(--error)",
            border: `1px solid ${status === "success" ? "var(--success)" : "var(--error)"}`
          }}>
            {msg}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ position: "relative" }}>
            <Mail size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
            <input required type="email" placeholder="Admin Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              style={{ width: "100%", padding: "0.85rem 1rem 0.85rem 3rem", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "#fff" }} />
          </div>

          <div style={{ position: "relative" }}>
            <Lock size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
            <input required type="password" placeholder="Passkey" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
              style={{ width: "100%", padding: "0.85rem 1rem 0.85rem 3rem", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "#fff" }} />
          </div>

          <button type="submit" className="btn-primary" disabled={status === "loading"} style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}>
            {status === "loading" ? <Loader2 size={18} className="spinner" /> : "Authenticate"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
