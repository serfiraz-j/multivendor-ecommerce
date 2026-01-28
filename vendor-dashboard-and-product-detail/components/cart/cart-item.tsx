"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import type { CartItem as CartItemType } from "@/types"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  // 1. cart-context'te hazırladığımız temizlenmiş fiyatı alıyoruz
  const unitPrice = typeof item.product.base_price === "string" 
    ? parseFloat(item.product.base_price) 
    : item.product.base_price;
    
  const totalPrice = unitPrice * item.quantity;

  // 2. Resim URL'ini cart-context'te hazırladığımız 'image' alanından alıyoruz
  const displayImage = item.product.image || "/placeholder.svg";

  // 3. Varyant ismini size/color modeline uygun şekilde oluşturuyoruz
  const variantDisplay = item.variant 
    ? [item.variant.size, item.variant.color].filter(Boolean).join(" / ")
    : null;

  return (
    <div className="flex gap-4 border-b border-border py-4 last:border-0">
      {/* Image - Klasör ismini [id] yaptığımız için id'ye link veriyoruz */}
      <Link href={`/product/${item.product.id}`} className="flex-shrink-0">
        <div className="relative h-24 w-24 overflow-hidden rounded-md border border-border bg-muted">
          <Image
            src={displayImage}
            alt={item.product.name || item.product.title}
            fill
            className="object-cover"
            unoptimized // Backend resimleri için
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <Link href={`/product/${item.product.id}`} className="font-medium hover:text-primary hover:underline">
              {item.product.name || item.product.title}
            </Link>
            
            {/* Size / Color gösterimi */}
            {variantDisplay && (
              <p className="mt-0.5 text-sm text-muted-foreground font-medium">
                Option: {variantDisplay}
              </p>
            )}
            
            <p className="mt-0.5 text-xs text-muted-foreground uppercase tracking-tight">
              Sold by {item.product.store_name || item.product.vendor_name || "Artisan"}
            </p>
          </div>
          <p className="font-bold text-primary">${totalPrice.toFixed(2)}</p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              // Opsiyonel: Stok sınırı varsa eklenebilir
              disabled={item.variant ? item.quantity >= item.variant.stock : item.quantity >= item.product.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  )
}
