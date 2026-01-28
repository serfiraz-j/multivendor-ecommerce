"use client"

import { useState } from "react"
import Image from "next/image"
import { Truck, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShipItemModal } from "./ship-item-modal"
import { Badge } from "@/components/ui/badge"

export function OrdersTable({ orders }: { orders: any[] }) {
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const BASE_URL = "http://127.0.0.1:8000"

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        No orders yet. They will appear here when customers purchase your products.
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((item) => {
              const imgSrc = item.product_image || "/placeholder.svg"

              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 overflow-hidden rounded-md border">
                      <Image src={imgSrc} alt={item.product_name} fill className="object-cover" unoptimized />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-sm">{item.product_name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{item.store_name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                  <TableCell className="text-right font-bold">
                  ${(Number(item.price_at_purchase) * item.quantity).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.shipping_status === 'processing' ? (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none uppercase text-[10px]">
                        Paid / Processing
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-500 hover:bg-blue-600 border-none uppercase text-[10px]">
                        Shipped
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.shipping_status === 'processing' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary"
                        onClick={() => setSelectedItem(item)}
                      >
                        <Truck className="h-4 w-4" /> Ship
                      </Button>
                    ) : (
                      <div className="flex items-center justify-end text-emerald-600 gap-1 text-xs font-bold">
                        <CheckCircle2 className="h-4 w-4" /> SENT
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {selectedItem && (
        <ShipItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  )
}