"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");
  const { login } = useAuth();

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

      if (res.ok) {
        setStatus("success");
        setMsg("Welcome back!");
        setTimeout(() => login(data.user), 800);
      } else {
        setStatus("error");
        setMsg(data.error || "Invalid credentials.");
      }
    } catch(err) {
      setStatus("error");
      setMsg("Connection error.");
    }
  };

  return (
    <div className="container" style={{ padding: "6rem 1.5rem", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "var(--surface)",
          padding: "3rem 2.5rem",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Login</h1>
          <p style={{ color: "var(--text-secondary)" }}>Access your ATHIX Account</p>
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
            <input required type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              style={{ width: "100%", padding: "0.85rem 1rem 0.85rem 3rem", backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "#fff" }} />
          </div>

          <div style={{ position: "relative" }}>
            <Lock size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
            <input required type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
              style={{ width: "100%", padding: "0.85rem 1rem 0.85rem 3rem", backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "#fff" }} />
          </div>

          <button type="submit" className="btn-primary" disabled={status === "loading"} style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}>
            {status === "loading" ? <Loader2 size={18} className="spinner" /> : "Log In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "2rem", color: "var(--text-secondary)" }}>
          Don't have an account? <Link href="/signup" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
}
