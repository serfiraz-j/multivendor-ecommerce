"use client"

import Image from "next/image"
import Link from "next/link"
import type { Category } from "@/types"

interface CategoryNavProps {
  categories: Category[]
  selectedCategory?: string
}

export function CategoryNav({ categories, selectedCategory }: CategoryNavProps) {
  const BACKEND_URL = "http://127.0.0.1:8000" 

  return (
    <section className="py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Shop by Category</h2>
        <Link href="/" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories?.map((category) => {
          const imageUrl = category.image 
            ? (category.image.startsWith('http') ? category.image : `${BACKEND_URL}${category.image}`)
            : "/placeholder-category.jpg"; 

          return (
            <Link
              key={category.id}
              href={`/?category=${category.slug}`} 
              className={`group relative overflow-hidden rounded-lg border transition-all hover:border-primary hover:shadow-md ${
                selectedCategory === category.slug ? "border-primary ring-2 ring-primary/20" : "border-border"
              }`}
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <Image
                  src={imageUrl}
                  alt={category.name}
                  width={200}
                  height={200}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  unoptimized 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-sm font-medium text-white">{category.name}</h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  )
}