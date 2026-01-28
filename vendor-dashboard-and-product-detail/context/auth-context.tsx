"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { User } from "@/types"
import api from "@/lib/api"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
      if (token) {
        try {
          const response = await api.get("/accounts/me/")
          setUser(response.data)
        } catch (error) {
          console.error("Session expired or invalid token")
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const response = await api.post("/accounts/login/", {
      username,
      password,
    })

    const { access, refresh } = response.data
    localStorage.setItem("access_token", access)
    localStorage.setItem("refresh_token", refresh)

    const userResponse = await api.get("/accounts/me/")
    setUser(userResponse.data)
  }, [])

  const register = useCallback(async (data: any) => {
    const payload = {
      username: data.username,
      email: data.email,
      password: data.password,
      is_seller: data.role === "vendor", 
      first_name: data.first_name,
      last_name: data.last_name,
      store: data.store,
      profile: {} 
    }
    
    const response = await api.post("/accounts/register/", payload)
    return response.data
  }, [])

const logout = useCallback(() => {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  
  setUser(null)
  
  window.location.href = "/login"
}, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}