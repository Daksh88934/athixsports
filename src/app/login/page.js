"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, LogIn, KeyRound, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");
  const [mode, setMode] = useState("login"); // 'login' | 'forgot' | 'reset'
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus("loading"); setMsg("");
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) {
        login(data.user);
        setStatus("success");
        setTimeout(() => router.push(data.user.role === "admin" ? "/admin" : "/"), 500);
      } else { setStatus("error"); setMsg(data.error || "Login failed"); }
    } catch (e) { setStatus("error"); setMsg("Connection error"); }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    setStatus("loading"); setMsg("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("idle");
        // Pre-fill OTP for easy testing
        if (data.otp) {
          setOtp(data.otp);
          setMsg(`OTP sent to email! (For testing, OTP has been auto-filled: ${data.otp})`);
        } else {
          setMsg("OTP sent successfully! Please check your email/server logs.");
        }
        setMode("reset");
      } else {
        setStatus("error");
        setMsg(data.error || "Failed to send OTP");
      }
    } catch {
      setStatus("error");
      setMsg("Connection error");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!resetEmail || !otp || !newPassword) return;
    setStatus("loading"); setMsg("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMsg("Password changed successfully! Please log in.");
        setTimeout(() => {
          setMode("login");
          setForm({ email: resetEmail, password: "" });
          setStatus("idle");
          setMsg("");
        }, 1500);
      } else {
        setStatus("error");
        setMsg(data.error || "Reset failed");
      }
    } catch {
      setStatus("error");
      setMsg("Connection error");
    }
  };

  return (
    <div className="container" style={{ padding: "6rem 1.5rem", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: 420, background: "var(--surface)", padding: "2.5rem", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
        
        {/* LOGO & HEADER */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 52, height: 52, background: "var(--primary)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontWeight: 900, fontSize: "1.2rem", color: "#fff" }}>AX</div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700 }}>
            {mode === "login" && "Welcome Back"}
            {mode === "forgot" && "Reset Password"}
            {mode === "reset" && "Enter OTP"}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.3rem" }}>
            {mode === "login" && "Sign in to your ATHIX account"}
            {mode === "forgot" && "We will send an OTP to verify your email"}
            {mode === "reset" && `Enter OTP sent to ${resetEmail}`}
          </p>
        </div>

        {/* STATUS MESSAGE */}
        {msg && (
          <div style={{ padding: "0.85rem 1rem", borderRadius: "var(--radius-md)", marginBottom: "1.25rem", textAlign: "center", fontSize: "0.9rem",
            background: status === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            color: status === "success" ? "var(--success)" : "var(--error)",
            border: `1px solid ${status === "success" ? "var(--success)" : "var(--error)"}`
          }}>{msg}</div>
        )}

        {/* LOGIN MODE */}
        {mode === "login" && (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[{ field: "email", Icon: Mail, type: "email", placeholder: "Email Address" }, { field: "password", Icon: Lock, type: "password", placeholder: "Password" }].map(({ field, Icon, type, placeholder }) => (
              <div key={field} style={{ position: "relative" }}>
                <Icon size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                <input required type={type} placeholder={placeholder} value={form[field]}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                  style={{ width: "100%", padding: "0.85rem 1rem 0.85rem 2.75rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text)", fontSize: "0.9rem", outline: "none" }} />
              </div>
            ))}
            
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-0.25rem" }}>
              <button type="button" onClick={() => { setMode("forgot"); setMsg(""); }} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
                Forgot Password?
              </button>
            </div>

            <button type="submit" disabled={status === "loading"} className="btn-primary" style={{ justifyContent: "center", marginTop: "0.5rem", padding: "0.9rem" }}>
              {status === "loading" ? <Loader2 size={18} className="spinner" /> : <><LogIn size={16} /> Sign In</>}
            </button>
          </form>
        )}

        {/* FORGOT OTP MODE */}
        {mode === "forgot" && (
          <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
              <input required type="email" placeholder="Email Address" value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                style={{ width: "100%", padding: "0.85rem 1rem 0.85rem 2.75rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text)", fontSize: "0.9rem", outline: "none" }} />
            </div>

            <button type="submit" disabled={status === "loading"} className="btn-primary" style={{ justifyContent: "center", marginTop: "0.5rem", padding: "0.9rem" }}>
              {status === "loading" ? <Loader2 size={18} className="spinner" /> : "Send OTP"}
            </button>

            <button type="button" onClick={() => { setMode("login"); setMsg(""); }} style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", cursor: "pointer", marginTop: "0.5rem" }}>
              <ArrowLeft size={14} /> Back to Login
            </button>
          </form>
        )}

        {/* RESET MODE */}
        {mode === "reset" && (
          <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ position: "relative" }}>
              <KeyRound size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
              <input required type="text" placeholder="Enter 6-digit OTP" value={otp}
                onChange={e => setOtp(e.target.value)}
                style={{ width: "100%", padding: "0.85rem 1rem 0.85rem 2.75rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text)", fontSize: "0.9rem", outline: "none" }} />
            </div>

            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
              <input required type="password" placeholder="Enter New Password" value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={{ width: "100%", padding: "0.85rem 1rem 0.85rem 2.75rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text)", fontSize: "0.9rem", outline: "none" }} />
            </div>

            <button type="submit" disabled={status === "loading"} className="btn-primary" style={{ justifyContent: "center", marginTop: "0.5rem", padding: "0.9rem" }}>
              {status === "loading" ? <Loader2 size={18} className="spinner" /> : "Reset Password"}
            </button>

            <button type="button" onClick={() => { setMode("login"); setMsg(""); }} style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", cursor: "pointer", marginTop: "0.5rem" }}>
              <ArrowLeft size={14} /> Back to Login
            </button>
          </form>
        )}

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Don't have an account? <Link href="/signup" style={{ color: "var(--primary)", fontWeight: 600 }}>Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
}
