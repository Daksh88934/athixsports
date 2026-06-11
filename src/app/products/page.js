"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(d => {
      setProducts(d.products || []);
      setLoading(false);
    });
  }, []);

  const dynamicCategories = ["All", ...new Set(products.map(p => p.category).filter(c => c && c.trim() !== ""))];

  const filtered = products.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ paddingTop: "6rem", minHeight: "100vh" }}>
      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "2.5rem" }}>
          <span className="badge" style={{ marginBottom: "0.75rem", display: "inline-block" }}>Our Collection</span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, marginBottom: "0.5rem" }}>
            All <span style={{ color: "var(--primary)" }}>Products</span>
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>Premium sportswear for serious athletes</p>
        </motion.div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
              style={{
                width: "100%", padding: "0.75rem 1rem 0.75rem 2.75rem",
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)", color: "var(--text)", fontSize: "0.9rem", outline: "none"
              }} />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {dynamicCategories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                padding: "0.6rem 1.1rem", borderRadius: 100, fontSize: "0.85rem", fontWeight: 500, cursor: "pointer",
                background: category === cat ? "var(--primary)" : "var(--surface)",
                color: category === cat ? "#fff" : "var(--text-secondary)",
                border: category === cat ? "1px solid var(--primary)" : "1px solid var(--border)",
                transition: "all 0.2s"
              }}>{cat}</button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ height: 340, background: "var(--surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 0", color: "var(--text-secondary)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <p style={{ fontSize: "1.1rem" }}>No products found</p>
            {search && <button onClick={() => setSearch("")} style={{ marginTop: "1rem", color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Clear search</button>}
          </div>
        ) : (
          <>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>
            <div className="grid-4">
              {filtered.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
