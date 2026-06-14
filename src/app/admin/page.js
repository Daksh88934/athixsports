"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Package, Users, ShoppingBag, Plus, Trash2, Save, X,
  TrendingUp, LogOut, Edit3, AlertTriangle, CheckCircle,
  RefreshCw, BarChart2, ArrowUp, ArrowDown, Search, Eye
} from "lucide-react";

const TABS = ["Dashboard", "Products", "Orders", "Users"];
const CATEGORIES = ["Team Kits", "Jerseys", "Training Wear", "Accessories", "Cricket", "Football", "Basketball"];
const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const EMPTY_PRODUCT = {
  title: "",
  category: "",
  price: "",
  color: "#ff6b00",
  inStock: true,
  image: "",
  images: ["", "", "", "", ""],
  stock: 0,
  description: "",
  design: "",
  fit: "",
  fabric: "",
  washCare: ""
};

export default function AdminPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("Dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchProduct, setSearchProduct] = useState("");
  const [searchOrder, setSearchOrder] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") { router.push("/login"); return; }
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [p, o, u] = await Promise.all([
        fetch("/api/admin/products").then(r => r.json()),
        fetch("/api/admin/orders").then(r => r.json()),
        fetch("/api/admin/users").then(r => r.json()),
      ]);
      setProducts(p.products || []);
      setOrders(o.orders || []);
      setUsers(u.users || []);
    } catch (e) { showToast("Failed to load data", "error"); }
    setLoading(false);
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => { setForm(EMPTY_PRODUCT); setEditingProduct(null); setShowModal(true); };
  const openEdit = (p) => {
    setForm({
      ...EMPTY_PRODUCT,
      ...p,
      images: p.images || [p.image || "", "", "", "", ""]
    });
    setEditingProduct(p);
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast("Image too large (max 5MB)", "error"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) { setForm(prev => ({ ...prev, image: data.imageUrl })); showToast("Image uploaded!"); }
      else showToast(data.error || "Upload failed", "error");
    } catch { showToast("Upload failed", "error"); }
    setUploading(false);
  };

  const handleImageUploadIndex = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast("Image too large (max 5MB)", "error"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        setForm(prev => {
          const imgs = [...(prev.images || ["", "", "", "", ""])];
          imgs[index] = data.imageUrl;
          const mainImg = index === 0 ? data.imageUrl : (prev.image || data.imageUrl);
          return { ...prev, images: imgs, image: mainImg };
        });
        showToast(`Image ${index + 1} uploaded!`);
      } else {
        showToast(data.error || "Upload failed", "error");
      }
    } catch {
      showToast("Upload failed", "error");
    }
    setUploading(false);
  };

  const saveProduct = async () => {
    if (!form.title.trim() || !form.price.toString().trim()) { showToast("Title and price are required", "error"); return; }
    setSaving(true);
    try {
      const method = editingProduct ? "PUT" : "POST";
      const body = editingProduct ? { ...form, id: editingProduct.id } : form;
      const res = await fetch("/api/admin/products", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok) {
        showToast(editingProduct ? "Product updated!" : "Product added!");
        setShowModal(false);
        if (editingProduct) {
          setProducts(prev => prev.map(p => p.id === data.product.id ? data.product : p));
        } else {
          setProducts(prev => [...prev, data.product]);
        }
      } else {
        showToast(data.error || "Failed to save", "error");
      }
    } catch (e) { showToast("Network error", "error"); }
    setSaving(false);
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Product deleted");
      setProducts(prev => prev.filter(p => p.id !== id));
    } else {
      showToast("Failed to delete", "error");
    }
  };

  const updateOrderStatus = async (id, status) => {
    const res = await fetch("/api/admin/orders", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    }
  };

  const addStock = async (product, qty) => {
    const newStock = (product.stock || 0) + qty;
    const res = await fetch("/api/admin/products", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...product, stock: newStock }) });
    if (res.ok) {
      showToast(`Stock updated to ${newStock}`);
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: newStock } : p));
    }
  };

  // Analytics
  const totalRevenue = orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + parseFloat((o.total || "0").replace(/[^0-9.]/g, "")), 0);
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const lowStockProducts = products.filter(p => (p.stock || 0) < 10 && p.inStock);
  const filteredProducts = products.filter(p => p.title?.toLowerCase().includes(searchProduct.toLowerCase()));
  const filteredOrders = orders.filter(o => o.id?.toLowerCase().includes(searchOrder.toLowerCase()) || o.name?.toLowerCase().includes(searchOrder.toLowerCase()));

  // Product demand based on orders
  const productDemand = products.map(p => {
    const demand = orders.reduce((sum, o) => {
      const found = (o.items || []).find(i => i.id === p.id || i.title === p.title);
      return sum + (found ? found.quantity || 1 : 0);
    }, 0);
    return { ...p, demand };
  }).sort((a, b) => b.demand - a.demand);

  const inputStyle = {
    padding: "0.7rem 1rem", background: "var(--background)", border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)", color: "var(--text)", fontSize: "0.9rem", outline: "none", width: "100%",
    boxSizing: "border-box"
  };

  if (!user || user.role !== "admin") return null;

  const StatusBadge = ({ status }) => {
    const colors = {
      Pending: { bg: "rgba(245,158,11,0.15)", color: "#f59e0b" },
      Processing: { bg: "rgba(59,130,246,0.15)", color: "#3b82f6" },
      Shipped: { bg: "rgba(168,85,247,0.15)", color: "#a855f7" },
      Delivered: { bg: "rgba(34,197,94,0.15)", color: "#22c55e" },
      Cancelled: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },
    };
    const c = colors[status] || colors.Pending;
    return (
      <span style={{ padding: "0.25rem 0.7rem", borderRadius: 100, fontSize: "0.75rem", fontWeight: 700, background: c.bg, color: c.color, whiteSpace: "nowrap" }}>{status}</span>
    );
  };

  return (
    <div style={{ paddingTop: "5rem", minHeight: "100vh" }}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{
              position: "fixed", top: "5.5rem", right: "1.5rem", zIndex: 9999,
              padding: "0.8rem 1.25rem", borderRadius: "var(--radius-md)", fontWeight: 600, fontSize: "0.9rem",
              background: toast.type === "error" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
              color: toast.type === "error" ? "#ef4444" : "#22c55e",
              border: `1px solid ${toast.type === "error" ? "rgba(239,68,68,0.4)" : "rgba(34,197,94,0.4)"}`,
              display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 8px 30px rgba(0,0,0,0.3)"
            }}>
            {toast.type === "error" ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Modal */}
      <AnimatePresence>
        {showModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "2rem", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontWeight: 800, fontSize: "1.15rem" }}>{editingProduct ? "✏️ Edit Product" : "➕ Add New Product"}</h3>
                <button onClick={() => setShowModal(false)} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text)" }}><X size={16} /></button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem", display: "block" }}>Product Name *</label>
                  <input placeholder="e.g. Pro Football Jersey" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem", display: "block" }}>Category</label>
                    <input placeholder="e.g. Jerseys" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem", display: "block" }}>Price *</label>
                    <input placeholder="₹1499" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem", display: "block" }}>Stock Quantity</label>
                    <input type="number" min="0" placeholder="0" value={form.stock} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem", display: "block" }}>Color</label>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}
                        style={{ width: 44, height: 38, border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", cursor: "pointer", background: "none", padding: 2 }} />
                      <input value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} placeholder="#ff6b00" style={{ ...inputStyle, flex: 1 }} />
                    </div>
                  </div>
                </div>

                {/* Images (Up to 5) */}
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.5rem", display: "block" }}>Product Images (Up to 5)</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {[0, 1, 2, 3, 4].map((index) => {
                      const imgUrl = form.images ? form.images[index] : (index === 0 ? form.image : "");
                      return (
                        <div key={index} style={{ display: "grid", gridTemplateColumns: imgUrl ? "1fr auto" : "1fr", gap: "0.75rem", alignItems: "center" }}>
                          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flex: 1 }}>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", width: 55, flexShrink: 0 }}>Image {index + 1}:</span>
                            <label style={{
                              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                              padding: "0.5rem 0.8rem", border: "1px dashed var(--border)", borderRadius: "var(--radius-md)",
                              cursor: "pointer", background: "var(--background)", fontSize: "0.78rem", color: "var(--text-secondary)",
                              flexShrink: 0, width: 110
                            }}>
                              📷 {uploading ? "..." : "Upload"}
                              <input type="file" accept="image/*" onChange={(e) => handleImageUploadIndex(index, e)} style={{ display: "none" }} disabled={uploading} />
                            </label>
                            <input placeholder="Or image URL..." value={imgUrl?.startsWith("data:") ? "" : imgUrl}
                              onChange={(e) => {
                                const val = e.target.value;
                                setForm(prev => {
                                  const imgs = [...(prev.images || ["", "", "", "", ""])];
                                  imgs[index] = val;
                                  const mainImg = index === 0 ? val : (prev.image || val);
                                  return { ...prev, images: imgs, image: mainImg };
                                });
                              }} style={{ ...inputStyle, flex: 1, fontSize: "0.8rem", padding: "0.45rem" }} />
                          </div>
                          {imgUrl && (
                            <div style={{ position: "relative", flexShrink: 0 }}>
                              <div style={{
                                width: 38, height: 38, borderRadius: "var(--radius-sm)",
                                background: "var(--background)", border: "1px solid var(--border)",
                                overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"
                              }}>
                                <img src={imgUrl} alt="preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                              </div>
                              <button onClick={() => {
                                setForm(prev => {
                                  const imgs = [...(prev.images || ["", "", "", "", ""])];
                                  imgs[index] = "";
                                  const mainImg = index === 0 ? "" : prev.image;
                                  return { ...prev, images: imgs, image: mainImg };
                                });
                              }} style={{ position: "absolute", top: -4, right: -4, width: 14, height: 14, borderRadius: "50%", background: "#ef4444", border: "none", color: "white", fontSize: "0.6rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem", display: "block" }}>Description (optional)</label>
                  <textarea rows={2} placeholder="Product description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    style={{ ...inputStyle, resize: "vertical" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem", display: "block" }}>Design Highlight</label>
                    <input placeholder="e.g. Side Panel / Graphics" value={form.design} onChange={e => setForm({ ...form, design: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem", display: "block" }}>Fit Type</label>
                    <input placeholder="e.g. Straight Fit / Athletic" value={form.fit} onChange={e => setForm({ ...form, fit: e.target.value })} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem", display: "block" }}>Fabric Blend</label>
                    <input placeholder="e.g. 100% Polyester / Cotton Blend" value={form.fabric} onChange={e => setForm({ ...form, fabric: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem", display: "block" }}>Wash Care</label>
                    <input placeholder="e.g. Machine wash cold" value={form.washCare} onChange={e => setForm({ ...form, washCare: e.target.value })} style={inputStyle} />
                  </div>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", padding: "0.75rem 1rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                  <input type="checkbox" checked={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.checked })} style={{ accentColor: "var(--primary)", width: 16, height: 16 }} />
                  <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>In Stock</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button onClick={saveProduct} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "0.85rem" }}>
                  {saving ? <><RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} /> Saving...</> : <><Save size={16} /> {editingProduct ? "Update Product" : "Add Product"}</>}
                </button>
                <button onClick={() => setShowModal(false)} className="btn-outline" style={{ padding: "0.85rem 1.25rem" }}>Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{ display: "inline-block", padding: "0.25rem 0.75rem", background: "rgba(255,107,0,0.15)", color: "var(--primary)", borderRadius: 100, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Admin Panel</span>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 900 }}>
              ATHIX <span style={{ color: "var(--primary)" }}>Dashboard</span>
            </h1>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button onClick={fetchAll} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "0.55rem 1rem", color: "var(--text-secondary)", fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <RefreshCw size={14} /> Refresh
            </button>
            <button onClick={() => { logout(); router.push("/"); }} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-md)", padding: "0.55rem 1rem", color: "#ef4444", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "2rem", flexWrap: "wrap", borderBottom: "1px solid var(--border)", paddingBottom: "1px" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "0.65rem 1.35rem", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer",
              background: "none", border: "none", borderBottom: tab === t ? "2px solid var(--primary)" : "2px solid transparent",
              color: tab === t ? "var(--primary)" : "var(--text-secondary)", transition: "all 0.2s", marginBottom: -1
            }}>{t}</button>
          ))}
        </div>

        {/* ───── DASHBOARD ───── */}
        {tab === "Dashboard" && (
          <div>
            {/* Stat cards */}
            <div className="grid-4" style={{ marginBottom: "2rem" }}>
              {[
                { label: "Total Revenue", value: `₹${Math.round(totalRevenue).toLocaleString()}`, icon: TrendingUp, color: "#ff6b00", sub: `${orders.filter(o => o.status !== "Cancelled").length} completed orders` },
                { label: "Total Orders", value: orders.length, icon: Package, color: "#22c55e", sub: `${pendingOrders} pending` },
                { label: "Products", value: products.length, icon: ShoppingBag, color: "#3b82f6", sub: `${lowStockProducts.length} low stock` },
                { label: "Customers", value: users.length, icon: Users, color: "#a855f7", sub: "Registered users" },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div style={{ width: 44, height: 44, background: `${s.color}22`, borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <s.icon size={20} style={{ color: s.color }} />
                    </div>
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginBottom: "0.3rem" }}>{s.label}</p>
                  <p style={{ fontSize: "1.9rem", fontWeight: 900, color: s.color, marginBottom: "0.3rem" }}>{s.value}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{s.sub}</p>
                </motion.div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {/* Top Demand Products */}
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontWeight: 700, fontSize: "0.95rem" }}>🔥 Top Products by Demand</h3>
                </div>
                {productDemand.slice(0, 5).map((p, i) => (
                  <div key={p.id} style={{ padding: "0.85rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ width: 24, height: 24, background: i === 0 ? "rgba(255,107,0,0.2)" : "var(--surface-2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, color: i === 0 ? "var(--primary)" : "var(--text-secondary)", flexShrink: 0 }}>{i + 1}</span>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: `${p.color || "var(--primary)"}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.9rem" }}>👕</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</p>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>{p.category}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--primary)" }}>{p.demand} orders</p>
                      <p style={{ color: p.stock < 10 ? "#ef4444" : "var(--success)", fontSize: "0.72rem", fontWeight: 600 }}>
                        {p.stock < 10 ? "⚠ Low stock" : `✓ ${p.stock} in stock`}
                      </p>
                    </div>
                  </div>
                ))}
                {productDemand.length === 0 && <p style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9rem" }}>No products yet</p>}
              </div>

              {/* Recent Orders + Low Stock Alerts */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                  <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-lg)", padding: "1.25rem 1.5rem" }}>
                    <h4 style={{ fontWeight: 700, color: "#ef4444", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                      <AlertTriangle size={16} /> Low Stock Alert ({lowStockProducts.length} products)
                    </h4>
                    {lowStockProducts.map(p => (
                      <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.85rem" }}>{p.title}</span>
                        <span style={{ fontWeight: 700, fontSize: "0.85rem", color: p.stock === 0 ? "#ef4444" : "#f59e0b" }}>
                          {p.stock === 0 ? "Out of Stock" : `${p.stock} left`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recent Orders */}
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", flex: 1 }}>
                  <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
                    <h3 style={{ fontWeight: 700, fontSize: "0.95rem" }}>📦 Recent Orders</h3>
                  </div>
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} style={{ padding: "0.85rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--primary)" }}>{o.id}</p>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>{o.name}</p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: "0.85rem" }}>{o.total}</p>
                        <StatusBadge status={o.status} />
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <p style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9rem" }}>No orders yet</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ───── PRODUCTS ───── */}
        {tab === "Products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
                <Search size={16} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                <input placeholder="Search products..." value={searchProduct} onChange={e => setSearchProduct(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: "2.4rem" }} />
              </div>
              <button onClick={openAdd} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Plus size={16} /> Add Product
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>
                <ShoppingBag size={48} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
                <p>No products found. Add your first product!</p>
              </div>
            ) : (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                        {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                          <th key={h} style={{ padding: "0.85rem 1rem", textAlign: "left", color: "var(--text-secondary)", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(p => (
                        <tr key={p.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <td style={{ padding: "1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${p.color || "#ff6b00"}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1rem" }}>
                                {p.image ? <img src={p.image} style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 6 }} /> : "👕"}
                              </div>
                              <div>
                                <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>{p.title}</p>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>{p.description?.slice(0, 40) || "—"}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "1rem" }}>
                            <span style={{ padding: "0.25rem 0.6rem", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 100, fontSize: "0.75rem" }}>{p.category}</span>
                          </td>
                          <td style={{ padding: "1rem", fontWeight: 700, color: "var(--primary)", fontSize: "0.9rem" }}>{p.price}</td>
                          <td style={{ padding: "1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <span style={{
                                fontWeight: 700, fontSize: "0.9rem",
                                color: (p.stock || 0) === 0 ? "#ef4444" : (p.stock || 0) < 10 ? "#f59e0b" : "var(--success)"
                              }}>{p.stock || 0}</span>
                              <div style={{ display: "flex", gap: "0.25rem" }}>
                                <button onClick={() => addStock(p, 10)} title="Add 10 stock"
                                  style={{ background: "rgba(34,197,94,0.15)", border: "none", borderRadius: 4, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#22c55e" }}>
                                  <ArrowUp size={11} />
                                </button>
                                <button onClick={() => addStock(p, -1)} title="Remove 1 stock"
                                  style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: 4, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#ef4444" }}>
                                  <ArrowDown size={11} />
                                </button>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "1rem" }}>
                            <span style={{
                              padding: "0.25rem 0.7rem", borderRadius: 100, fontSize: "0.75rem", fontWeight: 700,
                              background: p.inStock ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                              color: p.inStock ? "#22c55e" : "#ef4444"
                            }}>{p.inStock ? "In Stock" : "Out of Stock"}</span>
                          </td>
                          <td style={{ padding: "1rem" }}>
                            <div style={{ display: "flex", gap: "0.4rem" }}>
                              <button onClick={() => openEdit(p)} title="Edit"
                                style={{ background: "rgba(59,130,246,0.1)", border: "none", borderRadius: 6, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#3b82f6" }}>
                                <Edit3 size={13} />
                              </button>
                              <button onClick={() => deleteProduct(p.id)} title="Delete"
                                style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: 6, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#ef4444" }}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ───── ORDERS ───── */}
        {tab === "Orders" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
                <Search size={16} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                <input placeholder="Search by order ID or name..." value={searchOrder} onChange={e => setSearchOrder(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: "2.4rem" }} />
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {["All", "Pending", "Delivered"].map(s => (
                  <button key={s} onClick={() => setSearchOrder(s === "All" ? "" : s)}
                    style={{ padding: "0.5rem 1rem", borderRadius: 100, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>{s}</button>
                ))}
              </div>
            </div>

            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
              {filteredOrders.length === 0 ? (
                <p style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>No orders found</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                        {["Order ID", "Customer", "Phone", "Amount", "Items", "Status", "Date", "Update"].map(h => (
                          <th key={h} style={{ padding: "0.85rem 1rem", textAlign: "left", color: "var(--text-secondary)", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(o => (
                        <tr key={o.id} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "0.9rem 1rem", fontWeight: 800, color: "var(--primary)", fontSize: "0.82rem" }}>{o.id}</td>
                          <td style={{ padding: "0.9rem 1rem" }}>
                            <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>{o.name}</p>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>{o.email}</p>
                          </td>
                          <td style={{ padding: "0.9rem 1rem", fontSize: "0.83rem", color: "var(--text-secondary)" }}>{o.phone}</td>
                          <td style={{ padding: "0.9rem 1rem", fontWeight: 800, fontSize: "0.9rem" }}>{o.total}</td>
                          <td style={{ padding: "0.9rem 1rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>{(o.items || []).length} items</td>
                          <td style={{ padding: "0.9rem 1rem" }}><StatusBadge status={o.status} /></td>
                          <td style={{ padding: "0.9rem 1rem", fontSize: "0.78rem", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                          <td style={{ padding: "0.9rem 1rem" }}>
                            <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)}
                              style={{ ...inputStyle, width: "auto", fontSize: "0.78rem", padding: "0.35rem 0.6rem" }}>
                              {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ───── USERS ───── */}
        {tab === "Users" && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            {users.length === 0 ? (
              <p style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>No registered users yet</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                      {["#", "Name", "Email", "Phone", "Role", "Joined"].map(h => (
                        <th key={h} style={{ padding: "0.85rem 1rem", textAlign: "left", color: "var(--text-secondary)", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "0.85rem 1rem", color: "var(--text-secondary)", fontSize: "0.8rem" }}>{i + 1}</td>
                        <td style={{ padding: "0.85rem 1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,107,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", color: "var(--primary)", flexShrink: 0 }}>
                              {u.name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "0.85rem 1rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{u.email}</td>
                        <td style={{ padding: "0.85rem 1rem", fontSize: "0.85rem" }}>{u.phone || "—"}</td>
                        <td style={{ padding: "0.85rem 1rem" }}>
                          <span style={{ padding: "0.25rem 0.6rem", borderRadius: 100, fontSize: "0.75rem", fontWeight: 700, background: u.role === "admin" ? "rgba(255,107,0,0.15)" : "rgba(59,130,246,0.15)", color: u.role === "admin" ? "var(--primary)" : "#3b82f6" }}>{u.role}</span>
                        </td>
                        <td style={{ padding: "0.85rem 1rem", fontSize: "0.8rem", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
