"use client"

import Image from "next/image"
import Link from "next/link"
import { X, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/context/cart-context"

interface WishlistGridProps {
  items: any[]
  onRemove?: (itemId: string) => void
}

export function WishlistGrid({ items, onRemove }: WishlistGridProps) {
  const { addItem } = useCart()
  const BASE_URL = "http://127.0.0.1:8000"

  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <p className="text-muted-foreground">Your wishlist is empty.</p>
        <Link href="/">
          <Button className="mt-4">Start Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const product = item.product_details
        if (!product) return null

        // Görsel Seçim Mantığı
        const productImages = product.images || []
        // Backend 'is_feature' kullanıyor olabilir, kontrol edelim
        const primaryImage = productImages.find((img: any) => img.is_feature || img.is_primary) || productImages[0]
        
        let imageSrc = "/placeholder.svg"
        const rawPath = primaryImage?.image || product.image

        if (rawPath) {
          imageSrc = rawPath.startsWith('http') 
            ? rawPath 
            : `${BASE_URL}${rawPath}`
        }

        const price = parseFloat(product.base_price || product.price || 0)

        return (
          <Card key={item.id} className="group overflow-hidden border-none shadow-sm ring-1 ring-border">
            <div className="relative aspect-square overflow-hidden bg-muted">
              <Link href={`/product/${product.id}`}>
                <Image
                  src={imageSrc}
                  alt={product.title || "Product"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                />
              </Link>
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-7 w-7 rounded-full opacity-0 transition-all transform translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 shadow-lg"
                onClick={() => onRemove?.(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-4">
              <Link href={`/product/${product.id}`}>
                <h3 className="line-clamp-2 text-sm font-bold leading-tight hover:text-primary min-h-[40px]">
                  {product.title || product.name}
                </h3>
              </Link>
              <p className="mt-1 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                {product.store_name || "Artisan Shop"}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <p className="font-black text-lg text-primary">${price.toFixed(2)}</p>
                <Button
                  size="sm"
                  className="h-8 gap-1 shadow-sm active:scale-95 transition-transform"
                  onClick={() => addItem(product, undefined, 1)}
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}