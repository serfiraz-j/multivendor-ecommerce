"use client"

import { useState } from "react"
import { Loader2, Send } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const carriers = ["Aras Kargo", "Yurtiçi Kargo", "MNG Kargo", "UPS", "FedEx", "DHL"]

export function ShipItemModal({ item, isOpen, onClose }: { item: any; isOpen: boolean; onClose: () => void }) {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [carrierCompany, setCarrierCompany] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingNumber || !carrierCompany) {
      toast.error("Please fill in all shipping details.")
      return
    }

    setIsSubmitting(true)
    const token = localStorage.getItem("access_token")

    try {
      // Backend Action: @action(detail=True, methods=['post']) def ship_item
      const response = await fetch(`http://127.0.0.1:8000/api/orders/vendor-orders/${item.id}/ship_item/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tracking_number: trackingNumber,
          carrier: carrierCompany // Backend request.data.get('carrier') bekliyor
        })
      })

      if (response.ok) {
        toast.success("Item marked as shipped!")
        onClose()
        router.refresh() // Tabloyu güncellemek için
      } else {
        toast.error("Failed to update shipping status.")
      }
    } catch (error) {
      toast.error("Network error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ship Item</DialogTitle>
          <DialogDescription>
            Enter shipping details for <strong>{item.product_name}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Carrier Company</Label>
            <Select value={carrierCompany} onValueChange={setCarrierCompany}>
              <SelectTrigger>
                <SelectValue placeholder="Select carrier" />
              </SelectTrigger>
              <SelectContent>
                {carriers.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tracking">Tracking Number</Label>
            <Input
              id="tracking"
              placeholder="e.g. TR1234567890"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              required
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Confirm Shipment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}