"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductsTable } from "@/components/vendor/products-table"
import { toast } from "sonner"

export default function VendorProductsPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      // Token'ı localStorage'dan alıyoruz
      const token = localStorage.getItem("access_token") || localStorage.getItem("access")

      if (!token) {
        toast.error("Please login to see your products.")
        setIsLoading(false)
        return
      }

      try {
        // Backend'deki ProductViewSet -> get_queryset(vendor=true) kısmını tetikler
        const response = await fetch("http://127.0.0.1:8000/api/products/items/?vendor=true", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          // DRF pagination kullanıyorsa results, kullanmıyorsa direkt data
          setProducts(data.results || data)
        } else {
          toast.error("Failed to load products from server.")
        }
      } catch (error) {
        console.error("Fetch error:", error)
        toast.error("Check your backend connection!")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Store Inventory</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading your items..." : `Displaying ${products.length} products`}
          </p>
        </div>
        <Link href="/vendor/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <ProductsTable products={products} />
      )}
    </div>
  )
}