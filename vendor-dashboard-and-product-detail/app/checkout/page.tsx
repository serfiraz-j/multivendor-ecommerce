"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CheckoutSteps } from "@/components/checkout/checkout-steps"
import { ShippingForm } from "@/components/checkout/shipping-form"
import { PaymentForm } from "@/components/checkout/payment-form"
import { CartSummary } from "@/components/cart/cart-summary"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [shippingAddress, setShippingAddress] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false) // Başarı ekranı kontrolü

  const API_BASE_URL = "http://127.0.0.1:8000/api"

  useEffect(() => {
    if (items.length === 0 && !isProcessing && !showSuccess) {
      router.push("/cart")
    }
  }, [items.length, router, isProcessing, showSuccess])

  if (items.length === 0 && !isProcessing && !showSuccess) {
    return null 
  }

  const handleShippingSubmit = (address: string) => {
    setShippingAddress(address)
    setStep(2)
  }

  const handlePaymentSubmit = async () => {
    if (!shippingAddress) return
    setIsProcessing(true)

    const token = localStorage.getItem("access_token") || localStorage.getItem("access")

    if (!token) {
      toast.error("Oturum bulunamadı. Lütfen giriş yapın.")
      router.push("/login")
      return
    }

    const orderData = {
      address: shippingAddress,
      cart_items: items.map((item) => ({
        product_id: item.product.id,
        variant_id: item.variant?.id || null,
        quantity: item.quantity
      }))
    }

    try {
      const response = await fetch(`${API_BASE_URL}/orders/my-orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token.trim()}`,
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        clearCart() 
        setShowSuccess(true) // Başarı ekranını göster
        
        // 3 saniye sonra yönlendir
        setTimeout(() => {
          router.replace("/dashboard/orders")
        }, 3000)

      } else {
        const errorData = await response.json()
        toast.error(`Hata: ${JSON.stringify(errorData)}`)
        setIsProcessing(false)
      }
    } catch (error) {
      console.error("Ödeme hatası:", error)
      toast.error("Bir bağlantı hatası oluştu.")
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      
      {/* SUCCESS OVERLAY */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="flex flex-col items-center text-center p-8 max-w-sm animate-in zoom-in-95 duration-500">
            <div className="mb-6 rounded-full bg-emerald-100 p-4">
              <CheckCircle2 className="h-16 w-16 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Order Confirmed!</h2>
            <p className="mt-4 text-muted-foreground">
              Your order has been placed successfully. Thank you for supporting independent artisans.
            </p>
            <div className="mt-8 flex items-center gap-2 text-sm font-medium text-emerald-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirecting to your orders...
            </div>
          </div>
        </div>
      )}

      <main className={`flex-grow mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 transition-opacity duration-500 ${showSuccess ? 'opacity-0' : 'opacity-100'}`}>
        <CheckoutSteps currentStep={step} />

        <div className="grid gap-8 lg:grid-cols-3 mt-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <ShippingForm onSubmit={handleShippingSubmit} />
              </div>
            )}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <PaymentForm 
                  onSubmit={handlePaymentSubmit} 
                  onBack={() => setStep(1)} 
                  isProcessing={isProcessing} 
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <CartSummary showCheckoutButton={false} />
              <div className="p-4 bg-muted/50 rounded-lg border border-dashed text-[11px] text-muted-foreground">
                <p className="font-bold mb-1 uppercase text-foreground/70 tracking-widest">Order Policy</p>
                By completing your purchase, you agree to Artisan Market&apos;s Terms of Service and Privacy Policy.
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}