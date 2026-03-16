"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("athix_cart");
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch(e) { console.error(e) }
  }, []);

  // Save to LocalStorage (Excluding Base64 Images to prevent QuotaExceededError)
  useEffect(() => {
    try {
      const itemsToSave = cartItems.map(item => {
        // Create a copy of the item without the potentially huge base64 image string
        const { image, ...rest } = item;
        return rest; 
      });
      localStorage.setItem("athix_cart", JSON.stringify(itemsToSave));
    } catch(e) { console.error("Could not save cart to localStorage", e) }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      setIsSidebarOpen(true);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };

  const totalBill = cartItems.reduce((sum, item) => {
    const priceStr = item.price.toString().replace(/[^0-9.-]+/g,"");
    return sum + (parseFloat(priceStr) * item.quantity);
  }, 0);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      totalBill,
      totalItems,
      isSidebarOpen,
      setIsSidebarOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
