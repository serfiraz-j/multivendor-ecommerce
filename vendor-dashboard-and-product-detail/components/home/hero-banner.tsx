"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroBanner() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Sadece giriş yapıp yapmadığına bakıyoruz (token varlığı yeterli)
    const token = localStorage.getItem("access_token") || localStorage.getItem("access")
    setIsLoggedIn(!!token)
  }, [])

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="absolute inset-0 bg-[url('/artisan-craft-background-subtle-pattern.jpg')] opacity-5" />
      <div className="relative px-6 py-16 sm:px-12 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Discover Unique Handmade Treasures
          </h1>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Support independent artisans and find one-of-a-kind items crafted with love and care.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Yönlendirme /product olarak güncellendi */}
            <Link href="/product">
              <Button size="lg" className="gap-2">
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            {/* Sadece kullanıcı giriş YAPMAMIŞSA görünür */}
            {!isLoggedIn && (
              <Link href="/register?role=vendor">
                <Button variant="outline" size="lg" className="bg-transparent border-primary/20 hover:bg-primary/5">
                  Become a Seller
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}