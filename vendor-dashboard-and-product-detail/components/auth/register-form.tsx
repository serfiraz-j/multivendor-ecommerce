"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Store, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/context/auth-context"

export function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register } = useAuth()

  const defaultRole = searchParams.get("role") === "vendor" ? "vendor" : "customer"

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [storeName, setStoreName] = useState("") // Mağaza adı state'i
  const [role, setRole] = useState<"customer" | "vendor">(defaultRole)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await register({ 
        username, 
        email, 
        password, 
        first_name: firstName, 
        last_name: lastName, 
        role,
        store: role === "vendor" ? storeName : "", // Sadece vendorsa gönderiyoruz
        profile: {}
      })
      
      alert("Account created successfully! Redirecting to login...")
      router.push("/login")
    } catch (err: any) {
      console.error("Register error:", err)
      const errorMessage = err.response?.data?.error || "Failed to create account. Username or email might be taken."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Link href="/" className="mb-4 inline-flex items-center justify-center gap-2">
          <Store className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold">Artisan Market</span>
        </Link>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Join our marketplace today</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          {/* Account Type Selection */}
          <div className="space-y-2">
            <Label>Account Type</Label>
            <RadioGroup value={role} onValueChange={(v) => setRole(v as "customer" | "vendor")} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="customer" id="customer" />
                <Label htmlFor="customer" className="font-normal">Customer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vendor" id="vendor" />
                <Label htmlFor="vendor" className="font-normal">Vendor</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Store Name - Sadece Vendor seçiliyse görünür */}
          {role === "vendor" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                placeholder="My Awesome Artisan Shop"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required={role === "vendor"} // Sadece vendorsa zorunlu
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="johndoe123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}