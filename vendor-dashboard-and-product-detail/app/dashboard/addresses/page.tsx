"use client"

import { useEffect, useState } from "react"
import { Plus, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddressCard } from "@/components/dashboard/address-card"
import { AddressModal } from "@/components/dashboard/address-modal" 

export default function AddressesPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchAddress = async () => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("access")
    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/me/", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
      }
    } catch (error) {
      console.error("Fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddress()
  }, [])

  // Backend modelindeki veriyi AddressCard'ın beklediği formata çeviriyoruz
  const formattedAddress = profile?.address_line ? {
    id: "primary",
    full_name: "My Primary Address", // Profilde isim alanı varsa eklenebilir
    street: profile.address_line,
    city: profile.city,
    state: profile.country, // Backend modelinde state yerine country var
    postal_code: profile.zip_code,
    country: profile.country,
    is_default: true
  } : null

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Addresses</h1>
          <p className="text-muted-foreground">Manage your shipping addresses</p>
        </div>
        {!formattedAddress && !loading && (
          <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Address
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-32 animate-pulse bg-muted rounded-xl" />
        </div>
      ) : formattedAddress ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AddressCard 
            address={formattedAddress as any} 
            onEdit={() => setIsModalOpen(true)} 
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <MapPin className="h-10 w-10 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No address found. Please add one.</p>
        </div>
      )}

      <AddressModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={profile}
        onSuccess={fetchAddress}
      />
    </div>
  )
}