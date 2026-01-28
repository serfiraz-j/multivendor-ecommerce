"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AddProductForm } from "@/components/vendor/add-product-form"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EditProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/products/items/${id}/`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        } else {
          router.push("/vendor/products")
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">Modify details for: {product.title}</p>
        </div>
      </div>

      <div className="max-w-3xl">
        <AddProductForm initialData={product} />
      </div>
    </div>
  )
}