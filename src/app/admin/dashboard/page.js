"use client";

import { useState, useEffect } from "react";
import { Users, Package, ShoppingCart, Activity } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/products"),
          fetch("/api/admin/orders")
        ]);

        const usersData = await usersRes.json();
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        setStats({
          users: usersData.success ? usersData.users.length : 0,
          products: productsData.success ? productsData.products.length : 0,
          orders: ordersData.success ? ordersData.orders.length : 0,
        });

        if (usersData.success) {
          setRecentUsers(usersData.users.slice(0, 5));
        }
      } catch (e) {
        console.error("Failed to load dashboard stats", e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "2rem" }}>Dashboard Overview</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        
        <div style={{ backgroundColor: "var(--surface)", padding: "1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ backgroundColor: "rgba(255,107,0,0.1)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
            <Users size={28} color="var(--primary)" />
          </div>
          <div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>Total Users</p>
            <h3 style={{ fontSize: "1.75rem", fontWeight: 700 }}>{loading ? "..." : stats.users}</h3>
          </div>
        </div>

        <div style={{ backgroundColor: "var(--surface)", padding: "1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ backgroundColor: "rgba(34,197,94,0.1)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
            <Package size={28} color="#22c55e" />
          </div>
          <div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>Products</p>
            <h3 style={{ fontSize: "1.75rem", fontWeight: 700 }}>{loading ? "..." : stats.products}</h3>
          </div>
        </div>

        <div style={{ backgroundColor: "var(--surface)", padding: "1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ backgroundColor: "rgba(168,85,247,0.1)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
            <ShoppingCart size={28} color="#a855f7" />
          </div>
          <div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>Total Orders</p>
            <h3 style={{ fontSize: "1.75rem", fontWeight: 700 }}>{loading ? "..." : stats.orders}</h3>
          </div>
        </div>

      </div>

      <div style={{ backgroundColor: "var(--surface)", padding: "2rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Recent Sign Ups</h2>
          <Link href="/admin/users" style={{ color: "var(--primary)", fontSize: "0.875rem", textDecoration: "none" }}>View All</Link>
        </div>
        
        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading recent activity...</p>
        ) : recentUsers.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }}>No users registered yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left", color: "var(--text-secondary)" }}>
                <th style={{ padding: "1rem 0", fontWeight: 500 }}>Name</th>
                <th style={{ padding: "1rem 0", fontWeight: 500 }}>Email</th>
                <th style={{ padding: "1rem 0", fontWeight: 500 }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "1rem 0" }}>{u.name}</td>
                  <td style={{ padding: "1rem 0", color: "var(--text-secondary)" }}>{u.email}</td>
                  <td style={{ padding: "1rem 0", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
