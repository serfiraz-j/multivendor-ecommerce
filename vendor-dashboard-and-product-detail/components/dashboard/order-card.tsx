"use client"

import Image from "next/image"
import Link from "next/link"
import { Package, Truck } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function OrderCard({ order }: { order: any }) {
  const BASE_URL = "http://127.0.0.1:8000"

  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-muted/20">
        <div className="flex items-center gap-3">
          <Package className="h-5 w-5 text-primary" />
          <div>
            <p className="font-bold text-sm">Order #{order.id.toString().slice(-6)}</p>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
              Placed on{" "}
              {new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${
          order.status === 'paid' 
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
            : 'bg-amber-100 text-amber-700 border-amber-200'
        }`}>
          {order.status}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-4">
          {order.items.map((item: any) => {
            const imgSrc = item.product_image 
              ? (item.product_image.startsWith('http') ? item.product_image : `${BASE_URL}${item.product_image}`) 
              : "/placeholder.svg";

            return (
              <div key={item.id} className="flex gap-4">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                  <Image
                    src={imgSrc}
                    alt={item.product_name}
                    fill
                    className="object-cover"
                    unoptimized 
                  />
                </div>
                <div className="flex-1">
                  <Link 
                    href={`/product/${item.product_id || item.id}`}
                    className="font-semibold text-gray-800 hover:text-primary transition-colors duration-200"
                  >
                    {item.product_name}
                  </Link>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    <p className="font-bold text-gray-900">${parseFloat(item.total_price).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 border-t border-dashed border-border pt-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-tight">Total Paid</span>
            <span className="text-xl font-black text-primary">${parseFloat(order.total).toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-muted/40 p-4 text-xs border border-muted/60">
          <p className="font-bold text-gray-700 mb-2 flex items-center gap-2 uppercase tracking-tight">
            <Truck className="h-3.5 w-3.5 text-primary" /> Shipping to:
          </p>
          <p className="text-muted-foreground leading-relaxed italic">
            {order.shipping_address}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}