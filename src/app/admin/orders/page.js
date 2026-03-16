"use client";

import { useState, useEffect } from "react";
import { Loader2, Package, MapPin, Phone, User, CheckCircle, Clock, Search } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) fetchOrders();
    } catch(e) { console.error(e) }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Customer Orders</h1>
        <div style={{ backgroundColor: "var(--surface)", padding: "0.5rem 1rem", borderRadius: "var(--radius-full)", border: "1px solid var(--border)", fontSize: "0.875rem" }}>
          Total Orders: <span style={{ color: "var(--primary)", fontWeight: 700 }}>{orders.length}</span>
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
      ) : orders.length === 0 ? (
        <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", padding: "4rem 2rem", borderRadius: "var(--radius-lg)", textAlign: "center", color: "var(--text-secondary)" }}>
          <Package size={48} opacity={0.2} style={{ margin: "0 auto 1rem" }} />
          <p>No orders have been placed yet.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {orders.map(order => (
            <div key={order.id} style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
              
              {/* Header */}
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(255,255,255,0.02)" }}>
                <div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {order.id} 
                    <span style={{ 
                      fontSize: "0.75rem", 
                      padding: "0.2rem 0.6rem", 
                      borderRadius: "1rem", 
                      backgroundColor: order.status === "Pending" ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.1)",
                      color: order.status === "Pending" ? "#f59e0b" : "#22c55e",
                      border: `1px solid ${order.status === "Pending" ? "#f59e0b" : "#22c55e"}`
                    }}>
                      {order.status}
                    </span>
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.35rem" }}>
                    <Clock size={14} /> {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {order.status === "Pending" ? (
                    <button 
                      onClick={() => updateStatus(order.id, "Completed")}
                      style={{ padding: "0.5rem 1rem", backgroundColor: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontSize: "0.875rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 600 }}>
                      <CheckCircle size={14} /> Mark Completed
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateStatus(order.id, "Pending")}
                      style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "0.875rem", cursor: "pointer" }}>
                      Revert to Pending
                    </button>
                  )}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "2rem" }}>
                
                {/* Customer Details */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div>
                    <h4 style={{ fontSize: "0.875rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>Customer Details</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <User size={16} />
                        </div>
                        <div>
                          <p style={{ fontWeight: 600 }}>{order.userName}</p>
                          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{order.userEmail}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--text-secondary)", paddingLeft: "12px" }}>
                        <Phone size={14} /> {order.userPhone || "Not provided"}
                      </div>
                    </div>
                  </div>

                  {order.shippingAddress && (
                    <div style={{ backgroundColor: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px dashed var(--border)" }}>
                      <h4 style={{ fontSize: "0.875rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <MapPin size={16} color="var(--primary)" /> Shipping Address
                      </h4>
                      <p style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>{order.shippingAddress}</p>
                      
                      <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                        <strong>Payment:</strong> {order.paymentMethod || "WhatsApp Offline"}
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div>
                  <h4 style={{ fontSize: "0.875rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>Purchased Items</h4>
                  <div style={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-md)", padding: "1rem" }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: idx !== order.items.length - 1 ? "0.75rem" : 0, paddingBottom: idx !== order.items.length - 1 ? "0.75rem" : 0, borderBottom: idx !== order.items.length - 1 ? "1px solid var(--border)" : "none" }}>
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                          <div style={{ width: "24px", height: "24px", borderRadius: "4px", backgroundColor: item.color || "var(--border)" }} />
                          <div>
                            <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{item.title}</p>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Qty: {item.qty}</p>
                          </div>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{item.price}</div>
                      </div>
                    ))}
                    
                    <div style={{ borderTop: "1px solid var(--border)", marginTop: "1rem", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Total Value:</span>
                      <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--primary)" }}>₹{order.total}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
