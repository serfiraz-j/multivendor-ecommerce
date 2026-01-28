"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, MapPin, Plus } from "lucide-react"
import { toast } from "sonner"

export function ShippingForm({ onSubmit }: { onSubmit: (address: string) => void }) {
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    address_line: "",
    city: "",
    zip_code: "",
    country: ""
  })

  const fetchProfile = async () => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("access")
    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/me/", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setProfileData(data) // Tüm kullanıcı verisini saklıyoruz (isim soyisim için)
      }
    } catch (error) {
      console.error("Profile fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Sipariş modeli için isim soyisim birleştirme
    const fullName = `${profileData?.first_name || ""} ${profileData?.last_name || ""}`.trim() || profileData?.username;

    // 1. Durum: Kayıtlı profil adresi varsa, string formatına çevir ve gönder
    if (profileData?.profile?.address_line) {
      const p = profileData.profile;
      const formattedAddress = `${fullName} - ${p.address_line}, ${p.city} / ${p.country}`;
      onSubmit(formattedAddress);
      return;
    }

    // 2. Durum: Adres yoksa önce profili güncelle, sonra string formatında gönder
    setIsSubmitting(true)
    const token = localStorage.getItem("access_token") || localStorage.getItem("access")
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/me/", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ profile: formData })
      })

      if (response.ok) {
        toast.success("Address saved to your profile")
        // Yeni girilen verilerle string oluştur
        const formattedAddress = `${fullName} - ${formData.address_line}, ${formData.city} / ${formData.country}`;
        onSubmit(formattedAddress);
      } else {
        toast.error("Failed to save address")
      }
    } catch (error) {
      toast.error("Network error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const profile = profileData?.profile;

  return (
    <Card className="border-none shadow-md ring-1 ring-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {profile?.address_line ? (
            <div className="rounded-lg border border-primary bg-primary/5 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase text-primary tracking-widest">Deliver to Saved Address</p>
                  <p className="mt-2 font-medium">{profile.address_line}</p>
                  <p className="text-sm text-muted-foreground">
                    {profile.city}, {profile.zip_code}
                  </p>
                  <p className="text-sm text-muted-foreground">{profile.country}</p>
                </div>
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-4 text-[10px] text-muted-foreground italic">
                * This info will be saved as your permanent shipping address.
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground flex gap-2 items-center">
                <Plus className="h-4 w-4" />
                No saved address found. Adding an address here will save it to your profile.
              </div>
              
              <div className="space-y-2">
                <Label>Address Line</Label>
                <Input 
                  placeholder="Street, neighborhood, building no..." 
                  value={formData.address_line}
                  onChange={(e) => setFormData({...formData, address_line: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input 
                    placeholder="Batman" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Zip Code</Label>
                  <Input 
                    placeholder="72000" 
                    value={formData.zip_code}
                    onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Country</Label>
                <Input 
                  placeholder="Türkiye" 
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  required
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full h-12 font-bold" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : (
              profile?.address_line ? "Confirm & Continue" : "Save & Continue"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}