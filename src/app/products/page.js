"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/shop/ProductCard";
import { Loader2 } from "lucide-react";

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Team Kits", "Gym Wear", "Corporate", "Accessories"];

  useEffect(() => {
    async function fetchCatalog() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (e) {
        console.error("Failed to load catalog", e);
      } finally {
        setLoading(false);
      }
    }
    fetchCatalog();
  }, []);

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="container" style={{ padding: "4rem 1.5rem", minHeight: "80vh" }}>
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h1 className="heading-1" style={{ marginBottom: "1rem", textTransform: "uppercase" }}>
          Our <span className="text-gradient">Collection</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem", maxWidth: "600px", margin: "0 auto" }}>
          Explore our premium range of sportswear, meticulously crafter for athletes, teams, and professionals.
        </p>
      </div>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "3rem", flexWrap: "wrap" }}>
        {categories.map((cat, i) => (
          <button 
            key={i}
            onClick={() => setActiveCategory(cat)}
            style={{ 
              padding: "0.5rem 1.5rem", 
              borderRadius: "var(--radius-full)",
              background: activeCategory === cat ? "var(--primary)" : "transparent",
              border: `1px solid ${activeCategory === cat ? "var(--primary)" : "var(--border)"}`,
              color: activeCategory === cat ? "#fff" : "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <Loader2 size={32} className="spinner" color="var(--primary)" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)", backgroundColor: "var(--surface)", borderRadius: "var(--radius-lg)" }}>
          No products found in this category.
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "2rem"
        }}>
          {filteredProducts.map(product => (
            <div key={product.id} style={{ opacity: product.inStock ? 1 : 0.5, position: "relative" }}>
              {!product.inStock && (
                <div style={{ position: "absolute", top: "1rem", left: "1rem", zIndex: 10, backgroundColor: "var(--error)", color: "#fff", padding: "0.25rem 0.75rem", borderRadius: "1rem", fontSize: "0.75rem", fontWeight: 700 }}>
                  OUT OF STOCK
                </div>
              )}
              <ProductCard 
                id={product.id}
                title={product.title}
                category={product.category}
                price={product.price}
                imageColor={product.color}
                image={product.image}
                disabled={!product.inStock}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
