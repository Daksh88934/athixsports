"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Instagram, MapPin, ExternalLink, Send, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus("success");
        setResponseMsg("Message sent successfully! We'll reach out soon.");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
        setResponseMsg(data.error || "Something went wrong.");
      }
    } catch(err) {
      setStatus("error");
      setResponseMsg("Failed to connect to the server.");
    }
  };
  const contactInfo = [
    {
      id: "phone",
      icon: Phone,
      title: "Call Us",
      details: ["+91 8755022067", "+91 9411262264"],
      href: "tel:+918755022067"
    },
    {
      id: "instagram",
      icon: Instagram,
      title: "Instagram",
      details: ["@athixsports"],
      href: "https://instagram.com/athixsports"
    },
    {
      id: "address",
      icon: MapPin,
      title: "Visit Us",
      details: ["35-B, Street No.2,", "Nehru Nagar, Meerut"],
      href: "https://maps.app.goo.gl/Y1QTCV3kGFzKgZP36"
    },
    {
      id: "email",
      icon: Mail,
      title: "Email Us",
      details: ["athixsports@gmail.com", "www.athixsports.com"],
      href: "mailto:athixsports@gmail.com"
    }
  ];

  return (
    <div className="container" style={{ padding: "6rem 1.5rem" }}>
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h1 className="heading-1" style={{ marginBottom: "1rem", textTransform: "uppercase" }}>
          Contact <span className="text-gradient">Us</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem", maxWidth: "600px", margin: "0 auto" }}>
          Ready to elevate your team&apos;s look? Reach out to us today to discuss your requirements, custom designs, and bulk orders.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "2rem",
        maxWidth: "1000px",
        margin: "0 auto"
      }}>
        {contactInfo.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.a
              href={item.href}
              target={item.id === "instagram" || item.id === "address" ? "_blank" : "_self"}
              rel="noopener noreferrer"
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "3rem 2rem",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                textDecoration: "none",
                color: "inherit",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.backgroundColor = "rgba(255, 107, 0, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.backgroundColor = "var(--surface)";
              }}
            >
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "var(--radius-full)",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2rem",
                color: "#000",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
              }}>
                <Icon size={36} />
              </div>
              
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>{item.title}</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", color: "var(--text-secondary)" }}>
                {item.details.map((detail, i) => (
                  <span key={i} style={{ fontSize: "1.125rem" }}>{detail}</span>
                ))}
              </div>

              <ExternalLink 
                size={20} 
                style={{ position: "absolute", top: "20px", right: "20px", color: "var(--text-secondary)", opacity: 0.5 }} 
              />
            </motion.a>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{
          maxWidth: "700px",
          margin: "4rem auto 0",
          backgroundColor: "var(--surface)",
          padding: "3rem",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
        }}
      >
        <h2 className="heading-3" style={{ marginBottom: "1.5rem", textAlign: "center" }}>Drop us a Message</h2>
        
        {status === "success" || status === "error" ? (
          <div style={{
            padding: "1rem",
            backgroundColor: status === "success" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
            border: `1px solid ${status === "success" ? "var(--success)" : "var(--error)"}`,
            color: status === "success" ? "var(--success)" : "var(--error)",
            borderRadius: "var(--radius-md)",
            textAlign: "center",
            marginBottom: "1.5rem"
          }}>
            {responseMsg}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Name *</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "#fff" }} 
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Email *</label>
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "#fff" }} 
              />
            </div>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Phone (Optional)</label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "#fff" }} 
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Message *</label>
            <textarea 
              required
              rows={4}
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "#fff", resize: "vertical" }} 
            />
          </div>
          <button type="submit" className="btn-primary" disabled={status === "loading"}>
            {status === "loading" ? <Loader2 size={18} className="spinner" /> : <><Send size={18} /> Send Message</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
