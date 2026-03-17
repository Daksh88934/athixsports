"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CreditCard, Truck, MapPin, CheckCircle, Loader2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe (will be null if keys aren't added yet)
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) 
  : null;

export default function CheckoutPage() {
  const { cartItems, totalBill, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderTracking, setOrderTracking] = useState("");

  const handleInput = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    setIsProcessing(true);

    try {
      // Send Order to Backend as Pending
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user ? user.id : "guest",
          userName: form.name,
          userEmail: form.email,
          userPhone: form.phone,
          shippingAddress: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
          items: cartItems.map(i => ({ id: i.id, title: i.title, qty: i.quantity, price: i.price, color: i.color, image: i.image })),
          total: totalBill,
          paymentMethod: "Stripe Online Payment"
        })
      });
      const data = await res.json();
      
      if (data.success) {
        // Now trigger Stripe
        if (!stripePromise) {
          alert("Stripe keys missing. Check your terminal or instructions.");
          setIsProcessing(false);
          return;
        }

        const sessionRes = await fetch("/api/checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems,
            orderId: data.orderId
          })
        });

        const sessionData = await sessionRes.json();
        
        if (sessionRes.ok) {
          // Redirect to Stripe Checkout
          const stripe = await stripePromise;
          const { error } = await stripe.redirectToCheckout({
            sessionId: sessionData.id,
          });

          if (error) {
            alert(error.message);
          }
        } else {
          alert(sessionData.error || "Failed to create Stripe connection.");
        }

      } else {
        alert("Payment Error: Could not generate order.");
      }
    } catch(err) {
      alert("Network Error: Something went wrong.");
    } finally {
      setIsProcessing(false);
    }
  };

  // The success screen has been moved to /checkout/success
  // so we can delete the local success hook logic

  if (cartItems.length === 0 && !success) {
    return (
      <div style={{ padding: "6rem 2rem", textAlign: "center", minHeight: "60vh" }}>
        <h2>Checkout Unavailable</h2>
        <p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>Your cart is empty.</p>
        <button onClick={() => router.push("/products")} className="btn-primary" style={{ marginTop: "2rem" }}>Browse Shop</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "4rem 1.5rem", minHeight: "80vh" }}>
      <h1 className="heading-1" style={{ marginBottom: "2rem" }}>Secure <span className="text-gradient">Checkout</span></h1>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "3rem", alignItems: "start" }}>
        
        {/* Shipping Form */}
        <motion.form 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onSubmit={handleCheckoutSubmit} 
          style={{ backgroundColor: "var(--surface)", padding: "2.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", fontSize: "1.25rem", fontWeight: 700 }}>
            <MapPin size={24} color="var(--primary)" /> Shipping Details
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <input required type="text" name="name" placeholder="Full Name *" value={form.name} onChange={handleInput} style={{ padding: "0.85rem", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "#fff" }} />
            <input required type="tel" name="phone" placeholder="Phone Number *" value={form.phone} onChange={handleInput} style={{ padding: "0.85rem", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "#fff" }} />
          </div>
          
          <input required type="email" name="email" placeholder="Email Address *" value={form.email} onChange={handleInput} style={{ width: "100%", padding: "0.85rem", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "#fff", marginBottom: "1rem" }} />

          <input required type="text" name="address" placeholder="Street Address / Building *" value={form.address} onChange={handleInput} style={{ width: "100%", padding: "0.85rem", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "#fff", marginBottom: "1rem" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
            <input required type="text" name="city" placeholder="City *" value={form.city} onChange={handleInput} style={{ padding: "0.85rem", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "#fff" }} />
            <input required type="text" name="state" placeholder="State *" value={form.state} onChange={handleInput} style={{ padding: "0.85rem", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "#fff" }} />
            <input required type="text" name="pincode" placeholder="PIN Code *" value={form.pincode} onChange={handleInput} style={{ padding: "0.85rem", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "#fff" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", fontSize: "1.25rem", fontWeight: 700, paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
            <CreditCard size={24} color="var(--primary)" /> Payment Simulation
          </div>
          <div style={{ padding: "1rem", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-md)", border: "1px dashed var(--border)", marginBottom: "2rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            By clicking &quot;Pay Now&quot;, you are simulating a secure checkout connection. Your order will be stored securely in the Admin Dashboard database.
          </div>

          <button type="submit" disabled={isProcessing} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "1.25rem", fontSize: "1.1rem" }}>
            {isProcessing ? <Loader2 size={24} className="spinner" /> : `Pay ₹${totalBill}`}
          </button>
        </motion.form>

        {/* Order Summary */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          style={{ backgroundColor: "#111", padding: "2.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", position: "sticky", top: "100px" }}
        >
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
            Order Summary
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                <span>{item.quantity}x {item.title}</span>
                <span style={{ fontWeight: 600 }}>{item.price}</span>
              </div>
            ))}
          </div>

          <div style={{ paddingTop: "1.5rem", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
              <span>Subtotal</span>
              <span>₹{totalBill}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
              <span>Shipping details</span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Truck size={14} /> Free</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.25rem", fontWeight: 800, color: "var(--primary)", marginTop: "1rem" }}>
              <span>Total Price</span>
              <span>₹{totalBill}</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
