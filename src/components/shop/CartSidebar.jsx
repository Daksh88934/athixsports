"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import styles from "./CartSidebar.module.css";

export default function CartSidebar() {
  const { cartItems, removeFromCart, updateQuantity, totalBill, isSidebarOpen, setIsSidebarOpen } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsSidebarOpen(false);
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          <motion.div 
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
          />
          <motion.div 
            className={styles.sidebar}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <div className={styles.titleArea}>
                <ShoppingBag size={24} color="var(--primary)" />
                <h2>Your Cart</h2>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.itemList}>
              {cartItems.length === 0 ? (
                <div className={styles.emptyCart}>
                  <ShoppingBag size={48} opacity={0.2} />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemImage} style={{ backgroundColor: item.color || 'var(--surface)', overflow: "hidden", position: "relative" }}>
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          style={{ 
                            width: "100%", 
                            height: "100%", 
                            objectFit: "cover", 
                            position: "absolute", 
                            top: 0, 
                            left: 0
                          }} 
                        />
                      )}
                    </div>
                    <div className={styles.itemDetails}>
                      <h4>{item.title}</h4>
                      <p className={styles.itemPrice}>{item.price}</p>
                      
                      <div className={styles.qtyControls}>
                        <button onClick={() => updateQuantity(item.id, -1)} className={styles.qtyBtn}><Minus size={14} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className={styles.qtyBtn}><Plus size={14} /></button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className={styles.removeBtn}>
                      <X size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className={styles.footer}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{totalBill}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>Calculated at Checkout</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total Bill</span>
                <span>₹{totalBill}</span>
              </div>
              
              <button 
                className={`btn-primary ${styles.checkoutBtn}`} 
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                style={{ width: "100%", justifyContent: "center", padding: "1rem" }}
              >
                <CreditCard size={18} /> Proceed to Secure Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
