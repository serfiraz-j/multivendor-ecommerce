
"use client"

import { MapPin, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

export function AddressCard({ address, onEdit, onSuccess }: any) {
  
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    
    const token = localStorage.getItem("access_token") || localStorage.getItem("access")
    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/me/", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          profile: {
            address_line: "",
            city: "",
            zip_code: "",
            country: ""
          }
        })
      })

      if (response.ok) {
        toast.success("Address deleted")
        onSuccess() // Sayfayı yenilemek için
      }
    } catch (error) {
      toast.error("Delete failed")
    }
  }

  return (
    <Card className="border-primary">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-bold text-xs uppercase text-primary">Primary Address</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {address.street}
                <br />
                {address.city}, {address.postal_code}
                <br />
                {address.country}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}