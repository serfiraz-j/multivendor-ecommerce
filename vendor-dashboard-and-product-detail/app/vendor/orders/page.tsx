"use client"

import { useEffect, useState } from "react"
import { OrdersTable } from "@/components/vendor/orders-table"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      // Token'ı localStorage'dan alıyoruz
      const token = localStorage.getItem("access_token") || localStorage.getItem("access")

      if (!token) {
        toast.error("Giriş yapmanız gerekiyor.")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/orders/vendor-orders/", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          // DRF bazen veriyi direkt liste, bazen { results: [] } döner
          setOrders(data.results || data)
        } else if (response.status === 401) {
          toast.error("Oturum süreniz dolmuş, lütfen tekrar giriş yapın.")
        }
      } catch (error) {
        console.error("Orders fetch error:", error)
        toast.error("Sunucuya bağlanılamadı.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Mağaza Siparişleri</h1>
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Yükleniyor..." : `${orders.length} ürün satışı bulundu.`}
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <OrdersTable orders={orders} />
      )}
    </div>
  )
}