"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function AddressModal({ isOpen, onClose, initialData, onSuccess }: any) {
  const [formData, setFormData] = useState({
    address_line: initialData?.address_line || "",
    city: initialData?.city || "",
    zip_code: initialData?.zip_code || "",
    country: initialData?.country || ""
  })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
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
        toast.success("Address saved successfully")
        onSuccess()
        onClose()
      }
    } catch (error) {
      toast.error("Failed to save address")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData?.address_line ? "Edit Address" : "Add Address"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Address Line</Label>
            <Input 
              value={formData.address_line} 
              onChange={(e) => setFormData({...formData, address_line: e.target.value})} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Input 
                value={formData.city} 
                onChange={(e) => setFormData({...formData, city: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Zip Code</Label>
              <Input 
                value={formData.zip_code} 
                onChange={(e) => setFormData({...formData, zip_code: e.target.value})} 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Country</Label>
            <Input 
              value={formData.country} 
              onChange={(e) => setFormData({...formData, country: e.target.value})} 
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Address"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}