"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { WishlistGrid } from "@/components/dashboard/wishlist-grid"
import { toast } from "sonner"

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Favorileri Listeleme (GET)
  const fetchWishlist = async () => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("access")
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/products/wishlist/", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      })

      if (response.ok) {
        const data = await response.json()
        // NOT: Eğer ViewSet pagination kullanıyorsa 'data.results' kullanman gerekebilir
        setItems(Array.isArray(data) ? data : data.results || [])
      }
    } catch (error) {
      console.error("Wishlist fetch error:", error)
      toast.error("Wishlist items could not be loaded")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  // Favoriden Kaldırma (DELETE)
  const handleRemove = async (wishlistId: string) => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("access")
    
    try {
      // router.register ile oluşan url yapısı: /wishlist/{id}/
      const response = await fetch(`http://127.0.0.1:8000/api/products/wishlist/${wishlistId}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      if (response.status === 204 || response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== wishlistId))
        toast.success("Removed from favorites")
      } else {
        toast.error("Could not remove item")
      }
    } catch (error) {
      console.error("Remove error:", error)
      toast.error("Network error occurred")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">My Wishlist</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {loading ? "Syncing..." : `${items.length} items you've saved`}
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[350px] animate-pulse bg-muted rounded-2xl" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <WishlistGrid items={items} onRemove={handleRemove} />
        ) : (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed rounded-3xl bg-muted/10">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <span className="text-3xl">❤️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Your wishlist is empty</h3>
            <p className="text-muted-foreground mt-2 max-w-xs text-center">
              You haven't saved any items yet. Start exploring our collection!
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}