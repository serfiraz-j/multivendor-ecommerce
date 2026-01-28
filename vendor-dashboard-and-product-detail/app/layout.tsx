import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/context/auth-context"
import { CartProvider } from "@/context/cart-context"
import "./globals.css"
// app/layout.tsx
import { Toaster } from "sonner"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Artisan Market - Handcrafted Marketplace",
  description: "Discover unique handmade items from independent artisans and creators",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="w-full">
      <body className="font-sans antialiased w-full min-w-0">
        <AuthProvider>
          <CartProvider>{children}
          <Toaster richColors position="top-right" /> {/* BU SATIR ŞART */}
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}

