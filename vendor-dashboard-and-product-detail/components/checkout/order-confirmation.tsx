import Link from "next/link"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Order } from "@/types"

interface OrderConfirmationProps {
  order: Order
}

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  return (
    <Card className="text-center">
      <CardContent className="py-12">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
        </div>

        <h2 className="mb-2 text-2xl font-bold">Order Confirmed!</h2>
        <p className="mb-6 text-muted-foreground">
          Thank you for your purchase. Your order #{order.id.slice(-6)} has been placed.
        </p>

        <div className="mx-auto mb-8 max-w-sm rounded-lg bg-muted/50 p-4 text-left">
          <h3 className="mb-3 flex items-center gap-2 font-medium">
            <Package className="h-4 w-4" />
            Order Details
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items</span>
              <span>{order.items.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>${order.shipping_cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-medium">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-sm text-left">
          <p className="mb-2 text-sm font-medium">Shipping to:</p>
          <p className="text-sm text-muted-foreground">
            {order.shipping_address.full_name}
            <br />
            {order.shipping_address.street}
            <br />
            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard/orders">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              View Order Status
            </Button>
          </Link>
          <Link href="/">
            <Button className="w-full gap-2 sm:w-auto">
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
