"use client"

import Link from "next/link"
import { ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartItem } from "@/components/cart/cart-item"
import { CartSummary } from "@/components/cart/cart-summary"
import { useCart } from "@/context/cart-context"

export default function CartPage() {
  const { items, itemCount } = useCart()

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {itemCount === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-medium">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">Add some items to get started!</p>
            <Link href="/">
              <Button className="mt-6">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="rounded-lg border border-border bg-card p-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <CartSummary />
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
