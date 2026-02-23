import "./globals.css";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: "Olgga Sugar & Spices",
  description: "Premium Quality Spices & Sugars from India",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#000000] text-gray-900">
        <CartProvider>
          <div className="fixed top-0 left-0 w-full z-50">
            <TopBar />
            <Navbar />
          </div>

          <main className="pt-[160px]">
            {children}
          </main>

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
