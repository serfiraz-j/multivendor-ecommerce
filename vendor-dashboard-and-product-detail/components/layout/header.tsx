"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Search, ShoppingCart, Heart, User, Menu, X, Store, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const { items } = useCart()
  const itemCount = items?.length || 0

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<any[]>([])

  // Kategorileri Backend'den çekiyoruz
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/products/categories/")
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Categories could not be loaded", error)
      }
    }
    fetchCategories()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Klasör yapın 'product' olduğu için linki düzelttik
      window.location.href = `/product?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Store className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground tracking-tight hidden sm:inline-block">
              Artisan Market
            </span>
          </Link>

          {/* Arama Çubuğu - Desktop */}
          <form onSubmit={handleSearch} className="hidden flex-1 max-w-xl md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for handmade items..."
                className="w-full pl-10 pr-4 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Masaüstü Navigasyon */}
          <nav className="hidden items-center gap-2 md:flex">
            
            {/* Kategori Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden lg:flex gap-1 items-center font-medium">
                  Categories <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <DropdownMenuItem key={cat.id} asChild className="cursor-pointer">
                      {/* Link 'product' olarak güncellendi */}
                      <Link href={`/product?category=${cat.slug}`}>{cat.name}</Link>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>Loading categories...</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative hover:text-primary transition-colors">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:text-primary transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-muted rounded-full">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium hidden lg:inline-block max-w-[100px] truncate">
                      {user?.username}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <div className="px-2 py-2 border-b mb-1 bg-muted/30">
                    <p className="text-sm font-semibold truncate">
                      {user?.profile?.first_name || user?.username} {user?.profile?.last_name || ""}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={user?.is_seller ? "/vendor/dashboard" : "/dashboard"}>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/orders">My Orders</Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => logout()} 
                    className="text-destructive focus:bg-destructive/10 cursor-pointer font-medium"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-medium">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="font-medium">Register</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobil Menü Butonu */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobil Arama */}
        <form onSubmit={handleSearch} className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 bg-muted/50 border-none rounded-full h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Yatay Kategori Barı (Masaüstü) */}
        <div className="hidden md:flex items-center justify-center border-t py-3 overflow-x-auto no-scrollbar">
          <ul className="flex items-center gap-8 text-sm font-medium text-muted-foreground whitespace-nowrap px-4">
            {categories.slice(0, 8).map((category) => (
              <li key={category.id} className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">
                {/* Link 'product' olarak güncellendi */}
                <Link href={`/product?category=${category.slug}`}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobil Menü İçeriği */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden animate-in slide-in-from-top duration-300">
          <nav className="mx-auto max-w-7xl px-4 py-6">
            <div className="flex flex-col gap-6">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase text-muted-foreground px-2">Shop by Category</p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.slice(0, 6).map((cat) => (
                    <Link key={cat.id} href={`/product?category=${cat.slug}`} className="px-2 py-1 text-sm font-medium">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
              <DropdownMenuSeparator />
              {/* Diğer mobil linkler... */}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}