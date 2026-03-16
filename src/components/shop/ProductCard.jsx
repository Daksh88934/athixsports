"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import styles from "./ProductCard.module.css";

export default function ProductCard({ id, title, category, price, imageColor, image, disabled }) {
  const { addToCart, setIsSidebarOpen } = useCart();

  const handleBuyNow = () => {
    if (disabled) return;
    addToCart({ id, title, category, price, color: imageColor, image });
    setIsSidebarOpen(true);
  };

  const handleAddToCart = () => {
    if (disabled) return;
    addToCart({ id, title, category, price, color: imageColor, image });
    // Don't open sidebar, just let the notification/count update
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={styles.card}
    >
      <div className={styles.imageContainer} style={{ background: `linear-gradient(135deg, ${imageColor}, var(--surface))` }}>
        {image ? (
          <img 
            src={image} 
            alt={title} 
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover", 
              position: "absolute", 
              top: 0,
              left: 0
            }} 
          />
        ) : (
          <div className={styles.tshirtSilhouette}></div>
        )}
        <div className={styles.badge}>{category}</div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.price}>{price}</p>

        <div className={styles.actions} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <button
            className="btn-outline"
            onClick={handleAddToCart}
            disabled={disabled}
            style={{ 
              width: "100%", 
              justifyContent: "center", 
              opacity: disabled ? 0.5 : 1, 
              cursor: disabled ? "not-allowed" : "pointer",
              padding: "0.5rem",
              fontSize: "0.875rem"
            }}
          >
            Add to Cart
          </button>
          <button
            className="btn-primary"
            onClick={handleBuyNow}
            disabled={disabled}
            style={{ 
              width: "100%", 
              justifyContent: "center", 
              opacity: disabled ? 0.5 : 1, 
              cursor: disabled ? "not-allowed" : "pointer",
              padding: "0.5rem",
              fontSize: "0.875rem"
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
