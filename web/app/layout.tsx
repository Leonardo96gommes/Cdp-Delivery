import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { OrdersProvider } from "@/contexts/OrdersContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { StoreSettingsProvider } from "@/contexts/StoreSettingsContext";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import { ProductsProvider } from "@/contexts/ProductsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NostraPizza - Cardápio Delivery",
  description: "App de cardápio delivery moderno e intuitivo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className} suppressHydrationWarning>
            <AuthProvider>
              <StoreSettingsProvider>
                <CategoriesProvider>
                  <ProductsProvider>
                    <OrdersProvider>
                      <CartProvider>
                        {children}
                      </CartProvider>
                    </OrdersProvider>
                  </ProductsProvider>
                </CategoriesProvider>
              </StoreSettingsProvider>
            </AuthProvider>
      </body>
    </html>
  );
}
