"use client"

import { useState, useMemo, useEffect } from "react"
import { Heart, Minus, Plus, ShoppingCart, Truck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/ui/star-rating"
import { VariantSelector } from "./variant-selector"
import { ProductAttributes } from "./product-attributes"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"
import type { Product } from "@/types"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<{ size?: string; color?: string }>({})

  // --- WISHLIST STATES ---
  const [isFavorite, setIsFavorite] = useState(false)
  const [wishlistItemId, setWishlistItemId] = useState<number | null>(null)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  // Wishlist kontrolü
  useEffect(() => {
    const checkWishlist = async () => {
      const token = localStorage.getItem("access_token") || localStorage.getItem("access")
      if (!token) return

      try {
        const response = await fetch("http://127.0.0.1:8000/api/products/wishlist/", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          const found = data.find((item: any) => item.product === product.id)
          if (found) {
            setIsFavorite(true)
            setWishlistItemId(found.id)
          }
        }
      } catch (error) {
        console.error("Wishlist check error:", error)
      }
    }
    checkWishlist()
  }, [product.id])

  const toggleWishlist = async () => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("access")
    if (!token) {
      toast.error("Please login to add favorites")
      return
    }

    setWishlistLoading(true)
    try {
      if (isFavorite && wishlistItemId) {
        const response = await fetch(`http://127.0.0.1:8000/api/products/wishlist/${wishlistItemId}/`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (response.ok) {
          setIsFavorite(false)
          setWishlistItemId(null)
          toast.success("Removed from wishlist")
        }
      } else {
        const response = await fetch("http://127.0.0.1:8000/api/products/wishlist/", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ product: product.id })
        })
        if (response.ok) {
          const newData = await response.json()
          setIsFavorite(true)
          setWishlistItemId(newData.id)
          toast.success("Added to wishlist")
        }
      }
    } catch (error) {
      toast.error("Action failed")
    } finally {
      setWishlistLoading(false)
    }
  }

  // --- HESAPLAMALAR ---
  const basePrice = useMemo(() => {
    const price = typeof product.base_price === "string" ? parseFloat(product.base_price) : product.base_price
    return price || 0
  }, [product.base_price])

  const activeVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null
    const hasSizes = product.variants.some(v => v.size && v.size !== "")
    const hasColors = product.variants.some(v => v.color && v.color !== "")

    const isSizeMissing = hasSizes && !selectedOptions.size
    const isColorMissing = hasColors && !selectedOptions.color

    if (isSizeMissing || isColorMissing) return null

    return product.variants.find(v => {
      const matchSize = !hasSizes || v.size === selectedOptions.size
      const matchColor = !hasColors || v.color === selectedOptions.color
      return matchSize && matchColor
    })
  }, [selectedOptions, product.variants])

  const additionalPrice = useMemo(() => {
    if (!activeVariant) return 0
    return parseFloat(activeVariant.additional_price as any) || 0
  }, [activeVariant])

  const unitPrice = basePrice + additionalPrice
  const currentStock = activeVariant ? activeVariant.stock : (product.stock || 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">
        <span>{product.category_name}</span>
      </div>

      <h1 className="text-3xl font-bold lg:text-4xl tracking-tight">{product.title || product.name}</h1>

      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Store: <span className="text-foreground font-semibold">
            {/* Backend'den gelen store_name alanını kullanıyoruz */}
            {product.store_name || "Artisan Market"}
          </span>
        </span>
        <div className="flex items-center gap-1 border-l pl-4 border-border">
          <StarRating rating={product.average_rating || 0} size="sm" />
          <span className="text-sm font-medium">({product.reviews?.length || 0} reviews)</span>
        </div>
      </div>

      <div className="py-4 border-y border-border/50">
        <span className="text-4xl font-bold text-primary">${unitPrice.toFixed(2)}</span>
      </div>

      <p className="text-muted-foreground leading-relaxed text-base">{product.description}</p>

      {/* Varyantlar */}
      {product.variants && product.variants.length > 0 && (
        <VariantSelector
          variants={product.variants}
          selectedVariants={selectedOptions}
          onSelect={(type, value) => setSelectedOptions(prev => ({ ...prev, [type]: value }))}
        />
      )}

      {/* Miktar */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quantity</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-lg border-2 border-border bg-background shadow-sm overflow-hidden">
            <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-bold text-lg">{quantity}</span>
            <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q + 1)} disabled={quantity >= currentStock}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <span className={`text-sm font-medium ${currentStock < 5 ? 'text-red-500' : 'text-muted-foreground'}`}>
            {currentStock > 0 ? `${currentStock} available` : "Out of stock"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row pt-4">
        <Button 
          size="lg" 
          className="flex-1 gap-2 h-14 text-lg font-bold shadow-md active:scale-95" 
          onClick={() => addItem(product, activeVariant || undefined, quantity)}
          disabled={currentStock <= 0}
        >
          <ShoppingCart className="h-5 w-5" />
          {currentStock > 0 ? "Add to Cart" : "Out of Stock"}
        </Button>
        
        {/* Wishlist Butonu */}
        <Button 
          variant="outline" 
          size="lg" 
          className={`h-14 px-6 border-2 transition-all active:scale-90 ${
            isFavorite ? 'bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100' : 'bg-transparent'
          }`}
          onClick={toggleWishlist}
          disabled={wishlistLoading}
        >
          {wishlistLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Heart className={`h-5 w-5 transition-colors ${isFavorite ? 'fill-current' : ''}`} />
          )}
        </Button>
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-muted/40 p-4 text-sm border border-border">
        <Truck className="h-5 w-5 text-primary mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-foreground">Worldwide Shipping</p>
          <p className="text-muted-foreground leading-snug">Artisans ship from Turkey. Delivery in 5-7 days.</p>
        </div>
      </div>

      {/* Attributes */}
      {product.attributes && product.attributes.length > 0 && (
        <ProductAttributes attributes={product.attributes} />
      )}
    </div>
  )
}