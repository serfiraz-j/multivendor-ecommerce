"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import ProductCard from "@/components/home/product-card" 
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [sortBy, setSortBy] = useState("-created_at")

  const categorySlug = searchParams.get("category")
  const search = searchParams.get("search")

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (categorySlug) params.append("category__slug", categorySlug)
      if (search) params.append("search", search)
      if (sortBy) params.append("ordering", sortBy)
      
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/products/items/?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data.results || (Array.isArray(data) ? data : []))
        }
      } catch (error) {
        console.error("Fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categorySlug, search, sortBy])

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="w-full lg:w-64 shrink-0 space-y-6">
        <div className="p-4 rounded-xl border border-border bg-muted/5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Selected Category</h3>
          <p className="text-sm font-semibold text-primary capitalize">
            {categorySlug ? categorySlug.replace(/-/g, ' ') : "All Categories"}
          </p>
          {search && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Search Results for:</h3>
              <p className="text-sm font-medium italic">"{search}"</p>
            </div>
          )}
        </div>
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-8 bg-muted/20 p-4 rounded-xl border border-border/50">
          <p className="text-sm font-medium">
            Showing <span className="text-primary font-bold">{products.length}</span> products
          </p>
          <div className="flex items-center gap-3">
            <Label className="text-[10px] uppercase font-bold opacity-60">Sort By:</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] h-9 bg-background text-xs">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-created_at">Newest Arrivals</SelectItem>
                <SelectItem value="-avg_rating">Customer Rating</SelectItem>
                <SelectItem value="base_price">Price: Low to High</SelectItem>
                <SelectItem value="-base_price">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading / Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/5] animate-pulse bg-muted rounded-2xl" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-muted/5 rounded-3xl border-2 border-dashed border-muted">
            <p className="text-muted-foreground font-medium">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="h-96 flex items-center justify-center font-medium">Loading products...</div>}>
          <ProductsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}