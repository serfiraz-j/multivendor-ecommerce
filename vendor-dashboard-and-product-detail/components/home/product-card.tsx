"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProductCard({ product }: { product: any }) {
  const BACKEND_URL = "http://127.0.0.1:8000"

  // 1. Sayı hatasını çözmek için price'ı güvenli bir şekilde Number'a çeviriyoruz
  const price = typeof product.base_price === "string" 
    ? parseFloat(product.base_price) 
    : (product.base_price || 0);

  const mainImage = product.images?.[0]?.image || product.image;
  const imageUrl = mainImage 
    ? (mainImage.startsWith('http') ? mainImage : `${BACKEND_URL}${mainImage}`)
    : "/placeholder-product.jpg";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
      <Link href={`/product/${product.id}`} className="relative aspect-square overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          unoptimized
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>{product.category_name || "Handmade"}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span>{Number(product.average_rating || 0).toFixed(1)}</span>
          </div>
        </div>

        <Link href={`/product/${product.id}`} className="flex-1">
          <h3 className="font-medium leading-tight text-card-foreground line-clamp-2">
            {product.title}
          </h3>
        </Link>

        <div className="mt-3 flex items-center justify-between">
          {/* HATA ÇÖZÜMÜ: Sayı olduğundan emin olup toFixed çağırıyoruz */}
          <p className="text-lg font-semibold text-card-foreground">
            ${price.toFixed(2)}
          </p>
          {product.variants?.length > 0 && (
            <span className="text-xs text-muted-foreground">+ options</span>
          )}
        </div>
      </div>
    </div>
  )
}