"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import type { Product, ProductVariant, CartItem } from "@/types"

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, variant: ProductVariant | undefined, quantity: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const BACKEND_URL = "http://127.0.0.1:8000"

  // Sayfa yüklendiğinde LocalStorage'dan sepeti al
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Sepet her değiştiğinde LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addItem = (product: Product, variant: ProductVariant | undefined, quantity: number) => {
    setItems((prevItems) => {
      // Benzersiz bir ID oluştur (Ürün ID + Varyant ID)
      const itemId = variant ? `${product.id}-${variant.id}` : `${product.id}`
      const existingItem = prevItems.find((item) => item.id === itemId)

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        )
      }

      // Backend'den gelen resim URL'ini düzelt
      const rawImage = product.images?.[0]?.image || ""
      const imageUrl = rawImage.startsWith("http") ? rawImage : `${BACKEND_URL}${rawImage}`

      const basePrice = typeof product.base_price === "string" ? parseFloat(product.base_price) : product.base_price
      const addPrice = variant ? (typeof variant.additional_price === "string" ? parseFloat(variant.additional_price) : variant.additional_price) : 0
      const finalPrice = basePrice + (addPrice || 0)

      const newItem: CartItem = {
        id: itemId,
        product: {
          ...product,
          base_price: finalPrice, // Sepette toplam birim fiyatı tutuyoruz
          image: imageUrl // Kolay erişim için resmi buraya koyuyoruz
        },
        variant: variant,
        quantity: quantity,
      }
      return [...prevItems, newItem]
    })
  }

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item))
    )
  }

  const clearCart = () => setItems([])

  const subtotal = items.reduce((total, item) => {
    const price = typeof item.product.base_price === "string" ? parseFloat(item.product.base_price) : item.product.base_price
    return total + price * item.quantity
  }, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}