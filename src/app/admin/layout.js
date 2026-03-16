"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Users, Package, ShoppingCart, LogOut } from "lucide-react";

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Protect Admin Routes
  useEffect(() => {
    if (user === null) return; // Loading state theoretically
    if (user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") return <div style={{ minHeight: "100vh" }} />;

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 80px)" }}>
      {/* Sidebar */}
      <aside style={{ width: "250px", backgroundColor: "var(--surface)", borderRight: "1px solid var(--border)", padding: "2rem 1rem" }}>
        <h2 style={{ fontSize: "1.25rem", color: "var(--primary)", marginBottom: "2rem", paddingLeft: "1rem" }}>Admin Portal</h2>
        
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Link href="/admin/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", color: "#fff", textDecoration: "none" }} className="admin-nav-link">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/admin/users" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", color: "#fff", textDecoration: "none" }} className="admin-nav-link">
            <Users size={18} /> Registered Users
          </Link>
          <Link href="/admin/products" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", color: "#fff", textDecoration: "none" }} className="admin-nav-link">
            <Package size={18} /> Manage Products
          </Link>
          <Link href="/admin/orders" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", color: "#fff", textDecoration: "none" }} className="admin-nav-link">
            <ShoppingCart size={18} /> View Orders
          </Link>
          
          <button 
            onClick={logout}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", color: "var(--error)", textDecoration: "none", background: "none", border: "none", cursor: "pointer", marginTop: "auto", textAlign: "left" }}>
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "2rem", backgroundColor: "var(--background)", overflowY: "auto" }}>
        {children}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .admin-nav-link:hover { background-color: rgba(255,255,255,0.05); }
        .admin-nav-link.active { background-color: var(--primary); color: #fff; }
      `}} />
    </div>
  );
}
