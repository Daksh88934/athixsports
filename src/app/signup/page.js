"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, User, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setStatus("loading"); setMsg("");
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) { setStatus("success"); setMsg("Account created! Redirecting to login..."); setTimeout(() => router.push("/login"), 1500); }
      else { setStatus("error"); setMsg(data.error || "Registration failed"); }
    } catch (e) { setStatus("error"); setMsg("Connection error"); }
  };

  const fields = [
    { field: "name", Icon: User, type: "text", placeholder: "Full Name" },
    { field: "email", Icon: Mail, type: "email", placeholder: "Email Address" },
    { field: "phone", Icon: Phone, type: "tel", placeholder: "Phone Number" },
    { field: "password", Icon: Lock, type: "password", placeholder: "Password" },
  ];

  return (
    <div className="container" style={{ padding: "6rem 1.5rem", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: 420, background: "var(--surface)", padding: "2.5rem", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 52, height: 52, background: "var(--primary)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontWeight: 900, fontSize: "1.2rem", color: "#fff" }}>AX</div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700 }}>Create Account</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.3rem" }}>Join ATHIX Sports and track your orders</p>
        </div>

        {msg && (
          <div style={{ padding: "0.85rem 1rem", borderRadius: "var(--radius-md)", marginBottom: "1.25rem", textAlign: "center", fontSize: "0.9rem",
            background: status === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            color: status === "success" ? "var(--success)" : "var(--error)",
            border: `1px solid ${status === "success" ? "var(--success)" : "var(--error)"}`
          }}>{msg}</div>
        )}

        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {fields.map(({ field, Icon, type, placeholder }) => (
            <div key={field} style={{ position: "relative" }}>
              <Icon size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
              <input required type={type} placeholder={placeholder} value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                style={{ width: "100%", padding: "0.85rem 1rem 0.85rem 2.75rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text)", fontSize: "0.9rem", outline: "none" }} />
            </div>
          ))}
          <button type="submit" disabled={status === "loading"} className="btn-primary" style={{ justifyContent: "center", marginTop: "0.5rem", padding: "0.9rem" }}>
            {status === "loading" ? <Loader2 size={18} className="spinner" /> : "Sign Up"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Already have an account? <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Log In</Link>
        </p>
      </motion.div>
    </div>
  );
}
