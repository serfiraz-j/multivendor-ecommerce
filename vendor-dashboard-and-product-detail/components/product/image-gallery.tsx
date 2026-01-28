"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Props tipini, page.tsx'ten gönderdiğimiz formata göre yerel olarak tanımlıyoruz
interface GalleryImage {
  id: number | string
  url: string
  alt: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
  productName: string
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  // Resim listesi boşsa veya undefined ise koruma sağlıyoruz
  const safeImages = images && images.length > 0 ? images : []
  const selectedImage = safeImages[selectedIndex] || safeImages[0]

  if (safeImages.length === 0) {
    return (
      <div className="aspect-square overflow-hidden rounded-lg border border-border bg-muted flex items-center justify-center">
        <Image
          src="/placeholder-product.jpg" // Projende olan bir placeholder resmini koy
          alt={productName}
          width={600}
          height={600}
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="aspect-square overflow-hidden rounded-lg border border-border bg-white">
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt || productName}
          width={600}
          height={600}
          className="h-full w-full object-contain" // object-cover yerine contain daha iyi olabilir
          priority
          unoptimized // Backend'den gelen resimler için gerekli
        />
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {safeImages.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all",
                selectedIndex === index ? "border-primary" : "border-transparent hover:border-primary/50",
              )}
            >
              <Image
                src={image.url}
                alt={image.alt || `${productName} ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}