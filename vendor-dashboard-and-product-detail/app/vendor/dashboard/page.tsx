"use client"

import { useEffect, useState } from "react"
import { StatsCards } from "@/components/vendor/stats-cards"
import { ProductsTable } from "@/components/vendor/products-table"
import { OrdersTable } from "@/components/vendor/orders-table"
import { Loader2 } from "lucide-react"

export default function VendorDashboardPage() {
  const [data, setData] = useState({
    products: [],
    orders: [],
    stats: {
      total_products: 0,
      total_orders: 0,
      total_revenue: 0,
      pending_orders: 0
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("access_token") || localStorage.getItem("access")
      const headers = { "Authorization": `Bearer ${token}` }

      try {
        const [prodRes, orderRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/products/items/?vendor=true", { headers }),
          fetch("http://127.0.0.1:8000/api/orders/vendor-orders/", { headers })
        ])

        const products = await prodRes.json()
        const orders = await orderRes.json()

        const stats = {
          total_products: products.length,
          total_orders: orders.length,
          total_revenue: orders.reduce((acc: number, curr: any) => {
            const itemTotal = Number(curr.price_at_purchase) * Number(curr.quantity);
            return acc + itemTotal;
          }, 0),
          pending_orders: orders.filter((o: any) => o.shipping_status === 'processing').length
        }

        setData({ products, orders, stats })
      } catch (error) {
        console.error("Dashboard data error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your shop.</p>
      </div>

      <StatsCards stats={data.stats} />

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Products</h2>
            <span className="text-xs text-muted-foreground">Last 5 items</span>
          </div>
          <ProductsTable products={data.products.slice(0, 5)} />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <span className="text-xs text-muted-foreground">Recent activity</span>
          </div>
          <OrdersTable orders={data.orders.slice(0, 5)} />
        </div>
      </div>
    </div>
  )
}