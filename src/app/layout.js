import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/layout/CartSidebar";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "ATHIX Sports | Wear The Win",
  description: "Premium sportswear manufacturer in Meerut. High-quality custom jerseys, team kits, gym wear, and sports apparel.",
  keywords: "sportswear, custom jerseys, team kits, gym wear, Meerut sportswear, ATHIX Sports",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <CartSidebar />
            <main style={{ minHeight: "100vh", paddingTop: "80px" }}>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
