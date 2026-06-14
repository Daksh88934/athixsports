"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star, ArrowRight, ShieldCheck, RefreshCw, Truck, ChevronDown, ChevronUp, MapPin, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("M");
  const [adding, setAdding] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [showSizeChart, setShowSizeChart] = useState(false);
  
  // Pincode checker states
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Accordion states
  const [descOpen, setDescOpen] = useState(true);
  const [returnOpen, setReturnOpen] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const found = data.products?.find((p) => p.id.toString() === id);
        if (found) {
          setProduct(found);
          setActiveImage(found.image || (found.images && found.images[0]) || "");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    setAdding(true);
    addItem(product, 1, selectedSize);
    setTimeout(() => setAdding(false), 1000);
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincode.trim() || pincode.length < 6) {
      setPincodeStatus({ success: false, msg: "Please enter a valid 6-digit pincode." });
      return;
    }
    setPincodeStatus({ success: true, msg: "Fast Delivery available within 3-5 days! Eligible for Free Shipping." });
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <div style={{ width: 45, height: 45, border: "4px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "8rem 2rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Product Not Found</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>The product you are looking for does not exist or has been removed.</p>
        <Link href="/products" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  // Calculate simulated prices
  const priceVal = parseFloat(product.price.toString().replace(/[^0-9.]/g, "")) || 499;
  const originalPrice = Math.round(priceVal * 2.2); // ~55% OFF
  const discountPercent = 55;

  // Filter out any blank images
  const validImages = product.images?.filter(img => img && img.trim() !== "") || [product.image || ""];

  return (
    <div style={{ minHeight: "100vh", paddingTop: "5rem" }}>
      {/* Size Chart Modal */}
      <AnimatePresence>
        {showSizeChart && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "2rem", width: "100%", maxWidth: 500, position: "relative" }}>
              <button onClick={() => setShowSizeChart(false)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "var(--text)", cursor: "pointer" }}><X size={20} /></button>
              <h3 style={{ fontWeight: 800, fontSize: "1.25rem", marginBottom: "1.5rem", color: "var(--primary)" }}>Jersey Size Chart</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border)", fontWeight: 700 }}>
                    <th style={{ padding: "0.75rem 0.5rem" }}>Size</th>
                    <th style={{ padding: "0.75rem 0.5rem" }}>Chest (in)</th>
                    <th style={{ padding: "0.75rem 0.5rem" }}>Length (in)</th>
                    <th style={{ padding: "0.75rem 0.5rem" }}>Sleeve (in)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["S", "38", "26.5", "8.0"],
                    ["M", "40", "27.5", "8.5"],
                    ["L", "42", "28.5", "9.0"],
                    ["XL", "44", "29.5", "9.5"],
                    ["XXL", "46", "30.5", "10.0"],
                    ["3XL", "48", "31.5", "10.5"]
                  ].map(([sz, chest, len, sleeve]) => (
                    <tr key={sz} style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                      <td style={{ padding: "0.75rem 0.5rem", fontWeight: 700, color: "var(--text)" }}>{sz}</td>
                      <td style={{ padding: "0.75rem 0.5rem" }}>{chest}</td>
                      <td style={{ padding: "0.75rem 0.5rem" }}>{len}</td>
                      <td style={{ padding: "0.75rem 0.5rem" }}>{sleeve}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "1rem", textAlign: "center" }}>* Note: Standard sportswear sizing. Fit may vary slightly based on fabric blend type.</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="container" style={{ padding: "2rem 1.5rem" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "2rem", display: "flex", gap: "0.5rem" }}>
          <Link href="/" style={{ hover: { color: "var(--primary)" } }}>Home</Link> / 
          <Link href="/products">Shop</Link> / 
          <span style={{ color: "var(--text)" }}>{product.title}</span>
        </div>

        {/* Product Layout Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "3.5rem" }} className="product-detail-grid">
          
          {/* LEFT: Image Gallery */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{
              background: `linear-gradient(135deg, ${product.color || "#ff6b00"}15, ${product.color || "#ff6b00"}30)`,
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              height: 480,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden"
            }}>
              {activeImage ? (
                <img src={activeImage} alt={product.title} style={{ width: "85%", height: "85%", objectFit: "contain" }} />
              ) : (
                <div style={{ fontSize: "7rem" }}>👕</div>
              )}
              <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
                <span className="badge" style={{ fontSize: "0.9rem", padding: "0.4rem 1rem" }}>{product.category}</span>
              </div>
            </div>

            {/* Extra Angle Thumbnails */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {validImages.map((img, i) => (
                <div key={i} onClick={() => setActiveImage(img)} style={{
                  width: 80, height: 80,
                  border: activeImage === img ? "2px solid var(--primary)" : "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--surface)",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden", opacity: activeImage === img ? 1 : 0.6,
                  transition: "all 0.2s"
                }}>
                  <img src={img} alt="thumbnail" style={{ width: "90%", height: "90%", objectFit: "contain" }} />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Detail Information */}
          <div>
            {/* Title & Brand */}
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ color: "var(--primary)", fontWeight: 700, textTransform: "uppercase", fontSize: "0.9rem", letterSpacing: "0.05em" }}>ATHIX Sports</span>
              <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, color: "var(--text)", marginTop: "0.25rem", marginBottom: "0.5rem" }}>
                {product.title}
              </h1>
              {/* Ratings */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", background: "rgba(255,107,0,0.1)", padding: "0.25rem 0.6rem", borderRadius: 6 }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>4.7</span>
                  <Star size={14} fill="var(--primary)" color="var(--primary)" />
                </div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>| 318 reviews</span>
              </div>
            </div>

            {/* Price section */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "2rem", fontWeight: 900, color: "var(--text)" }}>₹{priceVal}</span>
              <span style={{ fontSize: "1.3rem", color: "var(--text-secondary)", textDecoration: "line-through" }}>₹{originalPrice}</span>
              <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--success)" }}>({discountPercent}% OFF)</span>
            </div>

            {/* Colors */}
            <div style={{ marginBottom: "1.75rem" }}>
              <span style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Colour:</span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: product.color || "#ff6b00",
                  border: "3px solid var(--text)",
                  boxShadow: "0 0 0 2px var(--primary)",
                  cursor: "pointer"
                }} />
              </div>
            </div>

            {/* Sizes */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)" }}>Select Size:</span>
                <span onClick={() => setShowSizeChart(true)} style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}>Size Guide &gt;</span>
              </div>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                {["S", "M", "L", "XL", "XXL", "3XL"].map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)} style={{
                    width: 48, height: 48, borderRadius: "var(--radius-md)",
                    border: selectedSize === size ? "2px solid var(--primary)" : "1px solid var(--border)",
                    background: selectedSize === size ? "var(--primary)" : "var(--surface)",
                    color: selectedSize === size ? "#fff" : "var(--text)",
                    fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}>{size}</button>
                ))}
              </div>
            </div>

            {/* CTA Buy Buttons */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
              <button onClick={handleAdd} disabled={!product.inStock || adding} className="btn-primary" style={{
                flex: 1, padding: "1.1rem", fontSize: "1.05rem", justifyContent: "center", borderRadius: "var(--radius-lg)"
              }}>
                <ShoppingBag size={20} />
                {adding ? "Adding to bag..." : "ADD TO BAG"}
              </button>
            </div>

            {/* Pincode Delivery Details */}
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)", padding: "1.25rem", marginBottom: "2rem"
            }}>
              <span style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.75rem" }}>Check Delivery Details</span>
              <form onSubmit={handleCheckPincode} style={{ display: "flex", gap: "0.5rem" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <MapPin size={16} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                  <input type="text" maxLength={6} placeholder="Enter Pincode" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ""))}
                    style={{
                      width: "100%", padding: "0.6rem 0.85rem 0.6rem 2.3rem", background: "var(--background)",
                      border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text)", outline: "none", fontSize: "0.9rem"
                    }} />
                </div>
                <button type="submit" style={{
                  padding: "0.6rem 1.25rem", background: "var(--primary)", border: "none",
                  borderRadius: "var(--radius-md)", color: "#fff", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer"
                }}>Check</button>
              </form>
              {pincodeStatus && (
                <div style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: pincodeStatus.success ? "var(--success)" : "var(--error)" }}>
                  {pincodeStatus.msg}
                </div>
              )}
            </div>

            {/* Key Highlights Grid */}
            <div style={{ marginBottom: "2.5rem" }}>
              <span style={{ display: "block", fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Key Highlights</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                <div>
                  <span style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)" }}>Design</span>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{product.design || "Sports Teamwear"}</span>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)" }}>Fit</span>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{product.fit || "Athletic Fit"}</span>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)" }}>Fabric</span>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{product.fabric || "High Performance Blend"}</span>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)" }}>Wash Care</span>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{product.washCare || "Machine wash as per tag"}</span>
                </div>
              </div>
            </div>

            {/* Details Accordion */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
              {/* Description */}
              <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
                <button onClick={() => setDescOpen(!descOpen)} style={{
                  width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "none", border: "none", padding: "0.5rem 0", color: "var(--text)", fontWeight: 700, textAlign: "left"
                }}>
                  Product Description
                  {descOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <AnimatePresence>
                  {descOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: "hidden" }}>
                      <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7, paddingTop: "0.5rem" }}>
                        {product.description || "Premium custom jerseys and teamwear apparel manufactured by ATHIX. Crafted with breathable, moisture-wicking technology to keep athletes dry and comfortable during intensive sports play."}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Refund Policy */}
              <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
                <button onClick={() => setReturnOpen(!returnOpen)} style={{
                  width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "none", border: "none", padding: "0.5rem 0", color: "var(--text)", fontWeight: 700, textAlign: "left"
                }}>
                  15 Day Returns & Exchange Policy
                  {returnOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <AnimatePresence>
                  {returnOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: "hidden" }}>
                      <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7, paddingTop: "0.5rem" }}>
                        Easy returns and exchange within 15 days of delivery. Custom printed items with personalized names/numbers are manufactured bespoke and are eligible for exchange only in case of manufacturer errors.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Genuine Seals */}
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: "2rem", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", textAlign: "center" }}>
                <ShieldCheck size={28} style={{ color: "var(--primary)" }} />
                <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>100% Genuine Sportswear</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", textAlign: "center" }}>
                <RefreshCw size={28} style={{ color: "var(--primary)" }} />
                <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>Easy Returns & Exchanges</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", textAlign: "center" }}>
                <Truck size={28} style={{ color: "var(--primary)" }} />
                <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>Fast Shipping in India</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .product-detail-grid {
          grid-template-columns: 1.15fr 0.85fr;
        }
        @media (max-width: 900px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
