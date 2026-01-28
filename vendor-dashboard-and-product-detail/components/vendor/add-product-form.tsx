"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, X, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface AddProductFormProps {
  initialData?: any // Düzenleme modu için gelen veriler
}

export function AddProductForm({ initialData }: AddProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<any[]>([])

  // State'leri initialData varsa doldur, yoksa boş bırak
  const [name, setName] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [basePrice, setBasePrice] = useState(initialData?.base_price || "")
  const [categoryId, setCategoryId] = useState(initialData?.category?.toString() || "")

  // Varyantlar ve Özellikler
  const [variants, setVariants] = useState<any[]>(initialData?.variants || [])
  const [newVariant, setNewVariant] = useState({ 
    size: "", 
    color: "", 
    additional_price: "0", 
    stock: "10" 
  })

  const [attributes, setAttributes] = useState<any[]>(initialData?.attributes || [])
  const [newAttribute, setNewAttribute] = useState({ name: "", value: "" })

  // Resimler ve Önizlemeler
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>(
    initialData?.images?.map((img: any) => 
      img.image.startsWith('http') ? img.image : `http://127.0.0.1:8000${img.image}`
    ) || []
  )

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Categories fetch error:", err))
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...filesArray])
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file))
      setPreviews((prev) => [...prev, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    // Eğer yeni eklenen bir blob ise selectedFiles'dan da çıkarılmalı (isteğe bağlı geliştirme)
    setPreviews((prev) => prev.filter((_, i) => i !== index))
    // Not: Gerçek silme mantığı için backend'de silme endpoint'i gerekebilir, 
    // şimdilik bu önizlemeden kaldırır.
  }

  const addVariant = () => {
    if (!newVariant.size && !newVariant.color) {
      toast.error("Please provide at least a Size or Color for the variant.")
      return
    }
    setVariants((prev) => [
      ...prev,
      {
        size: newVariant.size,
        color: newVariant.color,
        additional_price: Number.parseFloat(newVariant.additional_price) || 0,
        stock: Number.parseInt(newVariant.stock) || 0,
      },
    ])
    setNewVariant({ size: "", color: "", additional_price: "0", stock: "10" })
  }

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  const addAttribute = () => {
    if (!newAttribute.name || !newAttribute.value) return
    setAttributes((prev) => [...prev, newAttribute])
    setNewAttribute({ name: "", value: "" })
  }

  const removeAttribute = (index: number) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !basePrice || !categoryId) {
        toast.error("Please fill in required fields.")
        return
    }

    setIsSubmitting(true)
    const token = localStorage.getItem("access_token") || localStorage.getItem("access")
    
    const formData = new FormData()
    formData.append("title", name) 
    formData.append("description", description)
    formData.append("base_price", basePrice.toString())
    formData.append("category", categoryId)
    formData.append("variants", JSON.stringify(variants))
    formData.append("attributes", JSON.stringify(attributes))

    selectedFiles.forEach((file) => {
      formData.append("uploaded_images", file)
    })

    // EDIT MODU MU ADD MODU MU?
    const url = initialData 
      ? `http://127.0.0.1:8000/api/products/items/${initialData.id}/` 
      : "http://127.0.0.1:8000/api/products/items/"
    
    const method = initialData ? "PATCH" : "POST"

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      })

      if (response.ok) {
        toast.success(initialData ? "Product updated successfully!" : "Product created successfully!")
        router.push("/vendor/products")
        router.refresh() // Veriyi tazelemek için
      } else {
        const errData = await response.json()
        toast.error("Error: " + JSON.stringify(errData))
      }
    } catch (error) {
      toast.error("Network error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {/* Basic Information */}
      <Card>
        <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input id="name" placeholder="Handmade Vase" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Product details..." rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Base Price ($) *</Label>
              <Input id="price" type="number" step="0.01" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader><CardTitle>Images</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            {previews.map((src, index) => (
              <div key={index} className="relative aspect-square rounded-lg border bg-muted group">
                <img src={src} alt="preview" className="h-full w-full rounded-lg object-cover" />
                <Button type="button" variant="destructive" size="icon" className="absolute -right-2 -top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeImage(index)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/50 transition-colors">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <span className="mt-1 block text-xs text-muted-foreground">Upload</span>
                <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Product Variants */}
      <Card>
        <CardHeader><CardTitle>Product Variants</CardTitle></CardHeader>
        <CardContent>
          {variants.length > 0 && (
            <div className="mb-6 overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Size</th>
                    <th className="px-3 py-2 text-left font-medium">Color</th>
                    <th className="px-3 py-2 text-left font-medium">Price+</th>
                    <th className="px-3 py-2 text-left font-medium">Stock</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {variants.map((v, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2">{v.size || "-"}</td>
                      <td className="px-3 py-2">{v.color || "-"}</td>
                      <td className="px-3 py-2 text-primary font-medium">${v.additional_price}</td>
                      <td className="px-3 py-2">{v.stock}</td>
                      <td className="px-1 py-1">
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeVariant(i)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold">Size</Label>
              <Input placeholder="XL" className="h-9" value={newVariant.size} onChange={(e) => setNewVariant(p => ({ ...p, size: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold">Color</Label>
              <Input placeholder="Red" className="h-9" value={newVariant.color} onChange={(e) => setNewVariant(p => ({ ...p, color: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold">+ Price</Label>
              <Input type="number" className="h-9" value={newVariant.additional_price} onChange={(e) => setNewVariant(p => ({ ...p, additional_price: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold">Stock</Label>
              <Input type="number" className="h-9" value={newVariant.stock} onChange={(e) => setNewVariant(p => ({ ...p, stock: e.target.value }))} />
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={addVariant} className="h-9">
              <Plus className="mr-1 h-4 w-4" /> Add Row
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Extra Attributes */}
      <Card>
        <CardHeader><CardTitle>Extra Attributes</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {attributes.map((attr, index) => (
            <div key={index} className="flex items-center justify-between rounded-md border bg-muted/20 px-3 py-2 text-sm">
              <div><span className="font-bold">{attr.name}:</span> {attr.value}</div>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeAttribute(index)}><X className="h-4 w-4" /></Button>
            </div>
          ))}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Label className="text-xs">Name</Label>
              <Input placeholder="Material" className="h-9" value={newAttribute.name} onChange={(e) => setNewAttribute(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="flex-1">
              <Label className="text-xs">Value</Label>
              <Input placeholder="Cotton" className="h-9" value={newAttribute.value} onChange={(e) => setNewAttribute(p => ({ ...p, value: e.target.value }))} />
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addAttribute} className="h-9"><Plus className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
          ) : (
            initialData ? "Save Changes" : "Publish Product"
          )}
        </Button>
      </div>
    </form>
  )
}