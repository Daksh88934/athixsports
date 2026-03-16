"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems, setIsSidebarOpen } = useCart();
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <img src="/image.png" alt="ATHIX" style={{ height: "40px" }} />
        </Link>
        
        <div className={`${styles.navLinks} ${isOpen ? styles.active : ""}`}>
          <Link href="/" className={styles.navLink} onClick={closeMenu}>Home</Link>
          <Link href="/products" className={styles.navLink} onClick={closeMenu}>Products</Link>
          <Link href="/custom-builder" className={styles.navLink} onClick={closeMenu}>Custom Builder</Link>
          <Link href="/about" className={styles.navLink} onClick={closeMenu}>About Us</Link>
          <Link href="/contact" className={styles.navLink} onClick={closeMenu}>Contact</Link>
          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin/dashboard" className={styles.navLink} onClick={closeMenu} style={{ color: "var(--primary)" }}>Admin Panel</Link>
              )}
              <button 
                onClick={() => { logout(); closeMenu(); }} 
                className={styles.navLink} 
                style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className={styles.navLink} onClick={closeMenu}>Login</Link>
          )}
        </div>

        <div className={styles.navActions}>
          <div className={styles.userInfo} style={{ display: "none" }}> {/* Managed by media query later if needed */}
            {user && <span style={{ fontSize: "0.875rem", marginRight: "1rem" }}>Welcome, {user.name.split(' ')[0]}</span>}
          </div>
          <button className={styles.iconButton} onClick={() => setIsSidebarOpen(true)} style={{ position: "relative" }}>
            <ShoppingBag size={24} />
            {totalItems > 0 && (
              <span className={styles.cartBadge}>{totalItems}</span>
            )}
          </button>
          <button className={styles.menuButton} onClick={toggleMenu}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
