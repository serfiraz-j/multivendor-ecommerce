"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Store } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export function Footer() {
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token") || localStorage.getItem("access")
      
      if (!token) {
        setUserData(null)
        setLoading(false)
        return
      }

      try {
        // Backend: accounts/urls.py -> path('me/', ProfileUpdateView.as_view())
        const res = await fetch("http://127.0.0.1:8000/api/accounts/me/", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setUserData(data) // UserSerializer is_seller alanını içeriyor
        } else {
          setUserData(null)
        }
      } catch (err) {
        console.error("Footer user fetch error", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const ModalLink = ({ title, content, triggerText }: { title: string, content: React.ReactNode, triggerText: string }) => (
    <Dialog>
      <DialogTrigger className="hover:text-foreground text-sm text-muted-foreground transition-colors text-left outline-none">
        {triggerText}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold border-b pb-2">{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[50vh] pr-4 mt-4 text-sm leading-relaxed text-muted-foreground">
          {content}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Store className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold tracking-tight">Artisan Market</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Discover unique handmade items from independent artisans and creators around the world.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/product" className="hover:text-foreground">All Categories</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Sell</h3>
            <ul className="mt-4 flex flex-col space-y-2 text-sm text-muted-foreground">
              {/* Kullanıcı login DEĞİLSE Start Selling göster */}
              {!userData && !loading && (
                <li>
                  <Link href="/register?role=vendor" className="hover:text-foreground">Start Selling</Link>
                </li>
              )}
              
              {/* Kullanıcı giriş yapmış VE is_seller ise Dashboard göster */}
              {userData?.is_seller && (
                <li>
                  <Link href="/vendor/dashboard" className="text-primary font-semibold hover:underline">
                    Seller Dashboard
                  </Link>
                </li>
              )}

              <li>
                <ModalLink 
                  title="Seller Handbook" 
                  triggerText="Seller Handbook"
                  content={
                    <div className="space-y-4">
                      <h4 className="font-bold text-foreground">1. Creating Your Artisan Brand</h4>
                      <p>Success on Artisan Market starts with a compelling story. Your shop name and description should reflect the unique craftsmanship behind your products.</p>
                      <h4 className="font-bold text-foreground">2. Listing & Photography</h4>
                      <p>Use high-quality photos with natural lighting. Clearly state the materials used (e.g., sustainable wood, organic cotton) in the attributes section to help buyers find your items.</p>
                      <h4 className="font-bold text-foreground">3. Customer Trust</h4>
                      <p>Respond to messages promptly and be transparent about your shipping times. A reliable seller builds a loyal customer base through honesty and quality.</p>
                    </div>
                  }
                />
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Support</h3>
            <ul className="mt-4 flex flex-col space-y-2 text-sm text-muted-foreground">
              <li>
                <ModalLink 
                  title="Privacy Policy" 
                  triggerText="Privacy Policy"
                  content={
                    <div className="space-y-4">
                      <p>Your privacy is important to us. We collect only the data necessary to provide our services and secure your transactions.</p>
                      <p>We do not sell your personal data to third parties. All sensitive information, including payment details, is encrypted using industry-standard protocols.</p>
                    </div>
                  }
                />
              </li>
              <li>
                <ModalLink 
                  title="Terms of Service" 
                  triggerText="Terms of Service"
                  content={
                    <div className="space-y-4">
                      <p>By using Artisan Market, you agree to our community standards. Sellers must provide authentic handmade goods, and buyers must complete payments in a timely manner.</p>
                      <p>We maintain the right to suspend accounts that engage in fraudulent activity or violate our craftsmanship guidelines.</p>
                    </div>
                  }
                />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Artisan Market. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}