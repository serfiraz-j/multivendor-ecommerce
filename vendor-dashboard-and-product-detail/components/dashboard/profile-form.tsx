"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // Sayfayı yenilemek için ekledik
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export function ProfileForm({ user: initialUser }: { user: any }) {
  const router = useRouter()
  const [firstName, setFirstName] = useState(initialUser.first_name || "")
  const [lastName, setLastName] = useState(initialUser.last_name || "")
  const [email, setEmail] = useState(initialUser.email || "")
  const [phone, setPhone] = useState(initialUser.profile?.phone || "")
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const token = localStorage.getItem("access_token") || localStorage.getItem("access")

    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/me/", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          profile: {
            phone: phone
          }
        }),
      })

      if (response.ok) {
        toast.success("Profile updated successfully!", {
          description: "Your changes have been saved to our servers.",
        })
        router.refresh() // Verileri sunucu tarafında da tazeleyelim
      } else {
        const err = await response.json()
        toast.error("Update failed", {
          description: err.detail || "Please check your information.",
        })
      }
    } catch (error) {
      toast.error("Connection error", {
        description: "Could not reach the server. Please try again later.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}