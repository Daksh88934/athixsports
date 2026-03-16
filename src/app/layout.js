import { Inter } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartSidebar from "@/components/shop/CartSidebar";
import SmoothScroll from "@/components/layout/SmoothScroll";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ATHIX Sports | Wear The Win",
  description:
    "Premium sportswear manufacturer in Meerut. High-quality custom jerseys, team kits, gym wear, and sports apparel.",
  keywords:
    "sportswear, custom jerseys, team kits, gym wear, Meerut sportswear, ATHIX Sports",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SmoothScroll>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <CartSidebar />
              <main style={{ minHeight: "100vh", paddingTop: "80px" }}>
                {children}
              </main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}