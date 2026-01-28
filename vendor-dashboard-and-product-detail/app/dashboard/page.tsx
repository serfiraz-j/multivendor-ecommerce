"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProfileForm } from "@/components/dashboard/profile-form"

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token") || localStorage.getItem("access")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/accounts/me/", { // 'auth' yerine 'accounts'
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data)
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Profile fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  if (loading) return <div className="p-8">Loading profile...</div>
  if (!user) return null

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <div className="max-w-2xl">
        <ProfileForm user={user} />
      </div>
    </div>
  )
}