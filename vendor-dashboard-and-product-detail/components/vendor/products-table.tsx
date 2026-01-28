"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

export function ProductsTable({ products }: { products: any[] }) {
  const router = useRouter()
  const BASE_URL = "http://127.0.0.1:8000"

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
    
    try {
      const res = await fetch(`${BASE_URL}/api/products/items/${id}/`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        toast.success("Product deleted")
        router.refresh()
      }
    } catch (err) { toast.error("Delete failed") }
  }

  if (!products || products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        No products found in your store.
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const imgObj = product.images?.find((img: any) => img.is_feature) || product.images?.[0]
            const imgSrc = (imgObj && imgObj.image) 
              ? (imgObj.image.startsWith('http') ? imgObj.image : `${BASE_URL}${imgObj.image}`) 
              : "/placeholder.svg"

            return (
              <TableRow key={product.id}>
                <TableCell>
        <div className="relative h-12 w-12 overflow-hidden rounded-md border">
          <Image 
            src={imgSrc} 
            alt={product.title} 
            fill 
            className="object-cover"
            unoptimized
          />
        </div>
      </TableCell>
                {/* Backend: title (name değil) */}
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell className="text-right">${Number(product.base_price).toFixed(2)}</TableCell>
                <TableCell className="text-center">{product.stock || 0}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Link href={`/product/${product.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                    </Link>
                    <Link href={`/vendor/products/${product.id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}