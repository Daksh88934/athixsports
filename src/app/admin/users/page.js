"use client";

import { useState, useEffect } from "react";
import { Loader2, Mail, Phone, Calendar } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.error);
        }
      } catch (e) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Registered Users</h1>
        <div style={{ backgroundColor: "var(--surface)", padding: "0.5rem 1rem", borderRadius: "var(--radius-full)", border: "1px solid var(--border)", fontSize: "0.875rem" }}>
          Total: <span style={{ color: "var(--primary)", fontWeight: 700 }}>{users.length}</span>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <Loader2 size={32} className="spinner" color="var(--primary)" />
        </div>
      ) : error ? (
        <div style={{ padding: "1.5rem", backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid var(--error)", color: "var(--error)", borderRadius: "var(--radius-md)" }}>
          {error}
        </div>
      ) : users.length === 0 ? (
        <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", padding: "4rem 2rem", borderRadius: "var(--radius-lg)", textAlign: "center", color: "var(--text-secondary)" }}>
          No users have registered yet.
        </div>
      ) : (
        <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
              <tr style={{ textAlign: "left", color: "var(--text-secondary)" }}>
                <th style={{ padding: "1.25rem 1.5rem", fontWeight: 500 }}>User Profile</th>
                <th style={{ padding: "1.25rem 1.5rem", fontWeight: 500 }}>Contact Info</th>
                <th style={{ padding: "1.25rem 1.5rem", fontWeight: 500 }}>Role</th>
                <th style={{ padding: "1.25rem 1.5rem", fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--text-secondary)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                          <Calendar size={12} /> {new Date(u.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "1.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Mail size={14} /> {u.email}</span>
                      {u.phone && <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Phone size={14} /> {u.phone}</span>}
                    </div>
                  </td>
                  <td style={{ padding: "1.5rem" }}>
                    <span style={{ 
                      padding: "0.25rem 0.75rem", 
                      borderRadius: "var(--radius-full)", 
                      fontSize: "0.75rem", 
                      fontWeight: 600,
                      backgroundColor: u.role === "admin" ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.05)",
                      color: u.role === "admin" ? "#22c55e" : "var(--text-secondary)",
                      border: `1px solid ${u.role === "admin" ? "#22c55e" : "var(--border)"}`
                    }}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "1.5rem" }}>
                    <button style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "not-allowed", textDecoration: "underline", fontSize: "0.875rem" }}>
                      View Orders
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
