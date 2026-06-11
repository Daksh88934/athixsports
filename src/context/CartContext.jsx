"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("athix_cart");
      if (stored) setItems(JSON.parse(stored));
    } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem("athix_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1, size = "M", color = null) => {
    const key = `${product.id}-${size}-${color}`;
    setItems(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...product, quantity, size, color: color || product.color, key }];
    });
    setIsOpen(true);
  };

  const removeItem = (key) => setItems(prev => prev.filter(i => i.key !== key));

  const updateQty = (key, qty) => {
    if (qty < 1) return removeItem(key);
    setItems(prev => prev.map(i => i.key === key ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => {
    const price = parseFloat((i.price || "0").toString().replace(/[^0-9.]/g, ""));
    return sum + price * i.quantity;
  }, 0);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
