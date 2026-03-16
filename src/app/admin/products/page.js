"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Edit2, Trash2, Check, X } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newProd, setNewProd] = useState({ title: "", category: "Team Kits", price: "₹", color: "#ff6b00", inStock: true, image: "" });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProd({ ...newProd, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProd)
      });
      if (res.ok) {
        setIsAdding(false);
        setNewProd({ title: "", category: "Team Kits", price: "₹", color: "#ff6b00", inStock: true, image: "" });
        fetchProducts();
      }
    } catch (e) { console.error(e) }
  };

  const toggleStock = async (product) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, inStock: !product.inStock })
      });
      if (res.ok) fetchProducts();
    } catch (e) { console.error(e) }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchProducts();
    } catch (e) { console.error(e) }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Manage Products</h1>
        <button className="btn-primary" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? <X size={18} /> : <Plus size={18} />} {isAdding ? "Cancel" : "Add Product"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} style={{ backgroundColor: "var(--surface)", padding: "1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", marginBottom: "2rem", display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr 1fr 1fr auto" }}>
          <input required type="text" placeholder="Product Title" value={newProd.title} onChange={e => setNewProd({...newProd, title: e.target.value})} style={{ padding: "0.5rem 1rem", backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "#fff", borderRadius: "var(--radius-md)" }} />
          
          <select value={newProd.category} onChange={e => setNewProd({...newProd, category: e.target.value})} style={{ padding: "0.5rem 1rem", backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "#fff", borderRadius: "var(--radius-md)" }}>
            <option>Team Kits</option>
            <option>Gym Wear</option>
            <option>Corporate</option>
            <option>Accessories</option>
          </select>
          
          <input required type="text" placeholder="Price (e.g. ₹999)" value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} style={{ padding: "0.5rem 1rem", backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "#fff", borderRadius: "var(--radius-md)" }} />
          
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Color:</label>
            <input type="color" value={newProd.color} onChange={e => setNewProd({...newProd, color: e.target.value})} style={{ width: "40px", height: "40px", padding: 0, border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", backgroundColor: "transparent" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", gridColumn: "1 / -1" }}>
            <label style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Product Image (Optional):</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ color: "#fff" }} />
            {newProd.image && <img src={newProd.image} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "var(--radius-md)", marginTop: "0.5rem", backgroundColor: newProd.color || "transparent" }} />}
          </div>

          <button type="submit" className="btn-primary" style={{ padding: "0.5rem 1rem" }}>Save</button>
        </form>
      )}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <Loader2 size={32} className="spinner" color="var(--primary)" />
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)", backgroundColor: "var(--surface)", borderRadius: "var(--radius-lg)" }}>
          Catalogue empty. Add some products!
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {products.map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "var(--surface)", padding: "1rem 1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <div style={{ width: "50px", height: "50px", backgroundColor: p.color, borderRadius: "0.25rem", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden" }}>
                  {p.image && <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 600 }}>{p.title}</h3>
                  <div style={{ display: "flex", gap: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                    <span>{p.category}</span>
                    <span style={{ color: "var(--primary)", fontWeight: 700 }}>{p.price}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <button 
                  onClick={() => toggleStock(p)}
                  style={{ 
                    padding: "0.5rem 1rem", 
                    borderRadius: "var(--radius-full)", 
                    fontSize: "0.75rem", 
                    fontWeight: 600,
                    cursor: "pointer",
                    backgroundColor: p.inStock ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                    color: p.inStock ? "#22c55e" : "var(--error)",
                    border: `1px solid ${p.inStock ? "#22c55e" : "var(--error)"}`
                  }}
                >
                  {p.inStock ? "In Stock" : "Out of Stock"}
                </button>
                
                <button onClick={() => handleDelete(p.id)} style={{ padding: "0.5rem", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color="var(--error)"} onMouseLeave={e => e.currentTarget.style.color="var(--text-secondary)"}>
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
