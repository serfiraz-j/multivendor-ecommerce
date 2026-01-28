"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { OrderCard } from "@/components/dashboard/order-card"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const API_BASE_URL = "http://127.0.0.1:8000/api"

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("access_token") || localStorage.getItem("access")
      
      if (!token) {
        router.push("/login")
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/orders/my-orders/`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        })

        if (response.ok) {
          const data = await response.json()
          
          const formattedOrders = data.map((order: any) => {
            const finalPrice = parseFloat(order.total_price) || 0

            return {
              ...order,
              id: String(order.id), 
              
              total: finalPrice,
              subtotal: finalPrice,
              shipping_cost: 0, 
              
              shipping_address: order.shipping_address, 
              
              items: order.items.map((item: any) => {
                const itemPrice = parseFloat(item.price_at_purchase) || 0;
                return {
                  ...item,
                  product_id: item.product_id || item.product,                  product_slug: item.product_slug,
                  product_name: item.product_name,
                  product_image: item.product_image,
                  total_price: itemPrice * (item.quantity || 1),
                  price: itemPrice,
                  
                  product: {
                    name: item.product_name,
                    image: item.product_image || "/placeholder.png",
                    slug: item.product_slug 
                  }
                }
              })
            }
          })
          
          setOrders(formattedOrders)
        }
      } catch (error) {
        console.error("Orders fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [router])

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your orders</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 w-full animate-pulse bg-muted rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center bg-white">
          <p className="text-muted-foreground font-medium">You haven&apos;t placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order as any} />
          ))}
        </div>
      )}
    </div>
  )
}