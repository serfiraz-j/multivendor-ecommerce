"use client"

import Link from "next/link"
import { ShoppingBag, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/context/cart-context"

interface CartSummaryProps {
  showCheckoutButton?: boolean
}

export function CartSummary({ showCheckoutButton = true }: CartSummaryProps) {
  const { itemCount, subtotal } = useCart()

  const shippingCost = subtotal > 50 ? 0 : 9.99
  const total = subtotal + shippingCost

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Items ({itemCount})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span>
        </div>
        {subtotal > 0 && subtotal < 50 && (
          <p className="rounded-md bg-primary/10 p-2 text-xs text-primary">
            Add ${(50 - subtotal).toFixed(2)} more for free shipping!
          </p>
        )}
        <div className="border-t border-border pt-3">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      {showCheckoutButton && (
        <CardFooter>
          <Link href="/checkout" className="w-full">
            <Button className="w-full gap-2" size="lg" disabled={itemCount === 0}>
              <CreditCard className="h-4 w-4" />
              Proceed to Checkout
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}
