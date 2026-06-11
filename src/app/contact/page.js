"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) { setStatus("success"); setMsg(data.message); setForm({ name: "", email: "", subject: "", message: "" }); }
      else { setStatus("error"); setMsg(data.error || "Something went wrong"); }
    } catch (e) { setStatus("error"); setMsg("Connection error"); }
  };

  return (
    <div style={{ paddingTop: "2rem", minHeight: "100vh" }}>
      <section style={{ padding: "4rem 0" }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ display: "inline-block", padding: "0.3rem 0.9rem", background: "rgba(255,107,0,0.15)", color: "var(--primary)", borderRadius: 100, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1rem" }}>Get In Touch</span>
            <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, marginBottom: "1rem" }}>
              Contact <span style={{ background: "linear-gradient(135deg, var(--primary), #ff9a4a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Us</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>Have questions about custom orders? Want a bulk quote? Reach out — we're here to help!</p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "3rem", alignItems: "start" }}>
            {/* Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                { Icon: Phone, title: "Call Us", info: ["+91 8755022067", "+91 9411262264"], links: ["tel:+918755022067", "tel:+919411262264"] },
                { Icon: Mail, title: "Email Us", info: ["athixsports@gmail.com"], links: ["mailto:athixsports@gmail.com"] },
                { Icon: MapPin, title: "Visit Us", info: ["35-B, Street No.2, Nehru Nagar, Meerut"], links: ["https://maps.app.goo.gl/Y1QTCV3kGFzKgZP36"] },
              ].map(({ Icon, title, info, links }) => (
                <div key={title} style={{
                  padding: "1.25rem 1.5rem", background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)", display: "flex", gap: "1rem", alignItems: "flex-start"
                }}>
                  <div style={{
                    width: 44, height: 44, background: "rgba(255,107,0,0.1)", borderRadius: "var(--radius-md)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    <Icon size={20} style={{ color: "var(--primary)" }} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, marginBottom: "0.4rem" }}>{title}</h4>
                    {info.map((text, i) => (
                      <a key={i} href={links[i]} target={links[i].startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer" style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "0.15rem" }}>
                        {text}
                      </a>
                    ))}
                  </div>
                </div>
              ))}

              {/* WhatsApp Buttons */}
              <div style={{
                padding: "1.25rem 1.5rem", background: "rgba(37,211,102,0.08)",
                border: "1px solid rgba(37,211,102,0.3)", borderRadius: "var(--radius-lg)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                  <div style={{
                    width: 44, height: 44, background: "rgba(37,211,102,0.15)", borderRadius: "var(--radius-md)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    <MessageCircle size={20} style={{ color: "#25d366" }} />
                  </div>
                  <h4 style={{ fontWeight: 700 }}>WhatsApp Us</h4>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {[["8755022067", "+91 8755022067"], ["9411262264", "+91 9411262264"]].map(([num, label]) => (
                    <a key={num} href={`https://wa.me/91${num}?text=Hi%20ATHIX%20Sports%2C%20I%20am%20interested%20in%20your%20sportswear!`}
                      target="_blank" rel="noopener noreferrer"
                      style={{
                        display: "flex", alignItems: "center", gap: "0.6rem",
                        padding: "0.65rem 1rem", background: "#25d366",
                        borderRadius: "var(--radius-md)", color: "#fff",
                        fontWeight: 700, fontSize: "0.9rem", transition: "all 0.2s",
                        textDecoration: "none"
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#1da851"}
                      onMouseLeave={e => e.currentTarget.style.background = "#25d366"}
                    >
                      {/* WhatsApp SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Message on WhatsApp — {label}
                    </a>
                  ))}
                </div>
              </div>


              {/* Instagram */}
              <div style={{ padding: "1.25rem 1.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
                <h4 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>Follow Us</h4>
                <a href="https://instagram.com/athixsports" target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}>
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                  @athixsports
                </a>
              </div>

              {/* Hours */}
              <div style={{ padding: "1.25rem 1.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
                <h4 style={{ fontWeight: 700, marginBottom: "1rem" }}>Business Hours</h4>
                {[["Monday – Saturday", "9:00 AM – 6:00 PM"], ["Sunday", "Closed"]].map(([day, time]) => (
                  <div key={day} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{day}</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 500, color: time === "Closed" ? "var(--error)" : "var(--text)" }}>{time}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "2rem" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "1.5rem", fontSize: "1.2rem" }}>Send a Message</h3>

              {msg && (
                <div style={{
                  padding: "0.85rem 1rem", borderRadius: "var(--radius-md)", marginBottom: "1.25rem", fontSize: "0.9rem",
                  background: status === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  color: status === "success" ? "var(--success)" : "var(--error)",
                  border: `1px solid ${status === "success" ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`
                }}>{msg}</div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  {[["name", "Full Name", "text"], ["email", "Email Address", "email"]].map(([field, placeholder, type]) => (
                    <input key={field} required type={type} placeholder={placeholder} value={form[field]}
                      onChange={e => setForm({ ...form, [field]: e.target.value })}
                      style={{ padding: "0.85rem 1rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text)", fontSize: "0.9rem", outline: "none" }} />
                  ))}
                </div>
                <input required type="text" placeholder="Subject" value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  style={{ padding: "0.85rem 1rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text)", fontSize: "0.9rem", outline: "none" }} />
                <textarea required rows={5} placeholder="Your message..." value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  style={{ padding: "0.85rem 1rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text)", fontSize: "0.9rem", outline: "none", resize: "vertical" }} />
                <button type="submit" disabled={status === "loading"} className="btn-primary" style={{ justifyContent: "center", padding: "0.9rem" }}>
                  {status === "loading" ? <Loader2 size={18} className="spinner" /> : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
