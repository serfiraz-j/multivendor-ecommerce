"use client"

import ProductCard from "./product-card"
import type { Product } from "@/types"

interface ProductGridProps {
  products: Product[]
  title?: string
}

export function ProductGrid({ products, title }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No products found.</p>
      </div>
    )
  }

  return (
    <section className="py-8">
      {title && <h2 className="mb-6 text-xl font-semibold">{title}</h2>}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
